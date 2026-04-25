import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssuesService } from '@features/issues/services/issues.service';
import { IssueDto, IssueSearchParameters } from '@features/issues/models/issue.model';
import { RouterLink } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';

@Component({
  selector: 'app-issues',
  imports: [CommonModule, RouterLink],
  templateUrl: './issues-list.component.html'
})
export class IssuesComponent {
  private readonly issuesService = inject(IssuesService);
  readonly isAuthenticated = inject(AuthService).isAuthenticated;

  issues = signal<IssueDto[]>([]);
  paginationParameters = signal<IssueSearchParameters>({
    pageNumber: 1,
    pageSize: 10
  });

  constructor() {
    effect(() => {
      this.issuesService
        .getAllIssues(this.paginationParameters())
        .subscribe((issues) => {
          this.issues.set(issues.items);
        });
    });
  }

  previousPage() {
    this.paginationParameters.set({
      ...this.paginationParameters(),
      pageNumber: this.paginationParameters().pageNumber - 1
    });
  }

  nextPage() {
    this.paginationParameters.set({
      ...this.paginationParameters(),
      pageNumber: this.paginationParameters().pageNumber + 1
    });
  }
}
