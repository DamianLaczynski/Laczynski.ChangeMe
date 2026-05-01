import {
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@features/auth/services/auth.service';
import {
  IssueCommentConstraints,
  IssueDetailsDto,
  IssueHistoryEntryDto
} from '@features/issues/models/issue.model';
import { IssueRealtimeService } from '@features/issues/services/issue-realtime.service';
import { IssuesService } from '@features/issues/services/issues.service';

type CommentForm = {
  content: FormControl<string>;
};

@Component({
  selector: 'app-issue-details',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './issue-details.component.html'
})
export class IssueDetailsComponent {
  readonly id = input<string>();

  private readonly authService = inject(AuthService);
  private readonly issuesService = inject(IssuesService);
  private readonly issueRealtimeService = inject(IssueRealtimeService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly issueCommentConstraints = IssueCommentConstraints;
  readonly issue = signal<IssueDetailsDto | null>(null);
  readonly isLoading = signal(true);
  readonly hasLoaded = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly commentError = signal<string | null>(null);
  readonly isSubmitted = signal(false);
  readonly isSubmittingComment = signal(false);
  readonly isTogglingWatch = signal(false);

  readonly commentForm = new FormGroup<CommentForm>({
    content: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(IssueCommentConstraints.CONTENT_MAX_LENGTH)
      ]
    })
  });

  readonly sortedHistoryEntries = computed(() =>
    [...(this.issue()?.historyEntries ?? [])].sort(this.sortByCreatedAtAscending)
  );
  readonly sortedComments = computed(() =>
    [...(this.issue()?.comments ?? [])].sort(this.sortByCreatedAtAscending)
  );

  constructor() {
    effect(() => {
      const id = this.id();
      if (!id) {
        this.isLoading.set(false);
        return;
      }

      this.loadIssue(id);
    });

    effect(() => {
      const messageVersion = this.issueRealtimeService.issueMessageVersion();
      const message = this.issueRealtimeService.lastIssueMessage();
      const issueId = this.id();

      if (
        messageVersion === 0 ||
        !message ||
        !issueId ||
        message.issueId !== issueId ||
        !this.hasLoaded()
      ) {
        return;
      }

      untracked(() => this.loadIssue(issueId, false));
    });

    effect(() => {
      const reconnectCount = this.issueRealtimeService.reconnectCount();
      const issueId = this.id();
      if (reconnectCount === 0 || !issueId || !this.hasLoaded()) {
        return;
      }

      untracked(() => this.loadIssue(issueId, false));
    });
  }

  shouldShowCommentError(): boolean {
    return (
      !!this.commentForm.controls.content.errors &&
      (this.commentForm.controls.content.touched || this.isSubmitted())
    );
  }

  addComment(): void {
    this.isSubmitted.set(true);
    this.commentError.set(null);

    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    const issueId = this.id();
    if (!issueId) {
      return;
    }

    this.isSubmittingComment.set(true);

    this.issuesService
      .addComment(issueId, {
        content: this.commentForm.controls.content.value.trim()
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (issue) => {
          this.issue.set(issue);
          this.commentForm.reset({ content: '' });
          this.commentForm.markAsPristine();
          this.commentForm.markAsUntouched();
          this.isSubmitted.set(false);
          this.isSubmittingComment.set(false);
        },
        error: (error: Error) => {
          this.commentError.set(error.message);
          this.isSubmittingComment.set(false);
        }
      });
  }

  toggleWatch(): void {
    const issue = this.issue();
    if (!issue || !this.isAuthenticated() || this.isTogglingWatch()) {
      return;
    }

    this.isTogglingWatch.set(true);

    const request = issue.isWatchedByCurrentUser
      ? this.issuesService.unwatchIssue(issue.id)
      : this.issuesService.watchIssue(issue.id);

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (watchState) => {
        this.issue.update((currentIssue) =>
          currentIssue
            ? {
                ...currentIssue,
                isWatchedByCurrentUser: watchState.isWatchedByCurrentUser,
                watchersCount: watchState.watchersCount
              }
            : currentIssue
        );
        this.isTogglingWatch.set(false);
      },
      error: (error: Error) => {
        this.loadError.set(error.message);
        this.isTogglingWatch.set(false);
      }
    });
  }

  trackHistoryEntry(_index: number, entry: IssueHistoryEntryDto): string {
    return entry.id;
  }

  private loadIssue(issueId: string, resetState = true): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.issuesService
      .getIssue(issueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (issue) => {
          this.issue.set(issue);
          this.isLoading.set(false);
          this.hasLoaded.set(true);

          if (resetState) {
            this.commentError.set(null);
          }
        },
        error: (error: Error) => {
          this.loadError.set(error.message);
          this.isLoading.set(false);
          this.hasLoaded.set(true);
        }
      });
  }

  private sortByCreatedAtAscending(
    left: { createdAt: string },
    right: { createdAt: string }
  ): number {
    return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
  }
}
