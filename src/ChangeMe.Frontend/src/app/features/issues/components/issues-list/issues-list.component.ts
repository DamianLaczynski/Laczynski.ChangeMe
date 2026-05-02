import {
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
  untracked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, tap } from 'rxjs';
import { AuthService } from '@features/auth/services/auth.service';
import { PaginationResult } from '@shared/data/models/pagination-result.model';
import {
  IssueAssignableUserDto,
  IssueDto,
  IssuePriority,
  IssueSearchParameters,
  IssueStatus
} from '@features/issues/models/issue.model';
import { IssueRealtimeService } from '@features/issues/services/issue-realtime.service';
import { IssuesService } from '@features/issues/services/issues.service';

type IssuesFilterForm = {
  searchText: FormControl<string>;
  statuses: FormControl<IssueStatus[]>;
  priorities: FormControl<IssuePriority[]>;
  assignedToUserId: FormControl<string | null>;
  watchedByMe: FormControl<boolean>;
  createdByMe: FormControl<boolean>;
};

type IssueSortField = 'Id' | 'Title' | 'CreatedAt' | 'LastActivityAt';

@Component({
  selector: 'app-issues',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './issues-list.component.html'
})
export class IssuesComponent {
  private readonly issuesService = inject(IssuesService);
  private readonly authService = inject(AuthService);
  private readonly issueRealtimeService = inject(IssueRealtimeService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly issuePriorities = this.issuesService.issuePriorities;
  readonly issueStatuses = this.issuesService.issueStatuses;

  readonly issues = signal<IssueDto[]>([]);
  readonly pagination = signal<PaginationResult<IssueDto> | null>(null);
  readonly query = signal<IssueSearchParameters>({
    pageNumber: 1,
    pageSize: 10,
    sortField: 'LastActivityAt',
    ascending: false
  });
  readonly isLoading = signal(true);
  readonly hasLoaded = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly assignableUsers = signal<IssueAssignableUserDto[]>([]);
  readonly isLoadingAssignableUsers = signal(false);
  readonly pendingWatchIssueIds = signal<string[]>([]);
  readonly skeletonRows = Array.from({ length: 5 }, (_, index) => index);

  readonly filtersForm = new FormGroup<IssuesFilterForm>({
    searchText: new FormControl('', { nonNullable: true }),
    statuses: new FormControl<IssueStatus[]>([], { nonNullable: true }),
    priorities: new FormControl<IssuePriority[]>([], { nonNullable: true }),
    assignedToUserId: new FormControl<string | null>(null),
    watchedByMe: new FormControl(false, { nonNullable: true }),
    createdByMe: new FormControl(false, { nonNullable: true })
  });

  constructor() {
    this.loadAssignableUsers();

    toObservable(this.query)
      .pipe(
        tap(() => {
          this.isLoading.set(true);
          this.errorMessage.set(null);
        }),
        switchMap((query) =>
          this.issuesService.getAllIssues(query).pipe(
            catchError((error: Error) => {
              this.errorMessage.set(error.message);
              return of(this.createEmptyPaginationResult(query));
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((result) => {
        this.issues.set(result.items);
        this.pagination.set(result);
        this.isLoading.set(false);
        this.hasLoaded.set(true);
      });

    effect(() => {
      const messageVersion = this.issueRealtimeService.issueMessageVersion();
      if (messageVersion === 0 || !this.hasLoaded()) {
        return;
      }

      untracked(() => this.refreshCurrentPage());
    });

    effect(() => {
      const reconnectCount = this.issueRealtimeService.reconnectCount();
      if (reconnectCount === 0 || !this.hasLoaded()) {
        return;
      }

      untracked(() => this.refreshCurrentPage());
    });
  }

  applyFilters(): void {
    const formValue = this.filtersForm.getRawValue();

    this.query.set({
      ...this.query(),
      pageNumber: 1,
      searchText: formValue.searchText.trim() || undefined,
      statuses: formValue.statuses.length > 0 ? formValue.statuses : undefined,
      priorities: formValue.priorities.length > 0 ? formValue.priorities : undefined,
      assignedToUserId: formValue.assignedToUserId,
      watchedByMe: formValue.watchedByMe,
      createdByMe: formValue.createdByMe
    });
  }

  clearFilters(): void {
    this.filtersForm.reset({
      searchText: '',
      statuses: [],
      priorities: [],
      assignedToUserId: null,
      watchedByMe: false,
      createdByMe: false
    });

    this.query.set({
      ...this.query(),
      pageNumber: 1,
      searchText: undefined,
      statuses: undefined,
      priorities: undefined,
      assignedToUserId: null,
      watchedByMe: false,
      createdByMe: false
    });
  }

  changePage(pageNumber: number): void {
    const currentPagination = this.pagination();
    if (
      !currentPagination ||
      pageNumber < 1 ||
      pageNumber > currentPagination.totalPages
    ) {
      return;
    }

    this.query.set({
      ...this.query(),
      pageNumber
    });
  }

  toggleSort(field: IssueSortField): void {
    const currentQuery = this.query();
    const isSameField = currentQuery.sortField === field;
    const ascending = isSameField
      ? !currentQuery.ascending
      : this.getDefaultAscending(field);

    this.query.set({
      ...currentQuery,
      pageNumber: 1,
      sortField: field,
      ascending
    });
  }

  getSortDirection(field: IssueSortField): 'ascending' | 'descending' | null {
    const currentQuery = this.query();
    if (currentQuery.sortField !== field) {
      return null;
    }

    return currentQuery.ascending ? 'ascending' : 'descending';
  }

  toggleWatch(issue: IssueDto): void {
    if (!this.isAuthenticated() || this.isWatchPending(issue.id)) {
      return;
    }

    this.setWatchPending(issue.id, true);

    const request = issue.isWatchedByCurrentUser
      ? this.issuesService.unwatchIssue(issue.id)
      : this.issuesService.watchIssue(issue.id);

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (watchState) => {
        this.issues.update((items) =>
          items.map((item) =>
            item.id === watchState.issueId
              ? {
                  ...item,
                  isWatchedByCurrentUser: watchState.isWatchedByCurrentUser,
                  watchersCount: watchState.watchersCount
                }
              : item
          )
        );
        this.setWatchPending(issue.id, false);
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message);
        this.setWatchPending(issue.id, false);
      }
    });
  }

  isWatchPending(issueId: string): boolean {
    return this.pendingWatchIssueIds().includes(issueId);
  }

  private loadAssignableUsers(): void {
    this.isLoadingAssignableUsers.set(true);

    this.issuesService
      .getAssignableUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => {
          this.assignableUsers.set(users);
          this.isLoadingAssignableUsers.set(false);
        },
        error: () => {
          this.isLoadingAssignableUsers.set(false);
        }
      });
  }

  private refreshCurrentPage(): void {
    this.query.set({
      ...this.query()
    });
  }

  private setWatchPending(issueId: string, isPending: boolean): void {
    this.pendingWatchIssueIds.update((issueIds) =>
      isPending ? [...issueIds, issueId] : issueIds.filter((id) => id !== issueId)
    );
  }

  private getDefaultAscending(field: IssueSortField): boolean {
    return field === 'Id' || field === 'Title';
  }

  private createEmptyPaginationResult(
    query: IssueSearchParameters
  ): PaginationResult<IssueDto> {
    return {
      items: [],
      totalCount: 0,
      currentPage: query.pageNumber,
      pageSize: query.pageSize,
      totalPages: 0,
      hasPrevious: false,
      hasNext: false
    };
  }
}
