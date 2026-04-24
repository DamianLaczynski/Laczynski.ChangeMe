import { Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssuesService } from '@features/issues/services/issues.service';
import { IssueDetailsDto } from '@features/issues/models/issue.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-issue-details',
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './issue-details.component.html',
})
export class IssueDetailsComponent {
  id = input<string>();

  private readonly issuesService = inject(IssuesService);
  private readonly router = inject(Router);

  issue = signal<IssueDetailsDto | null>(null);

  constructor() {
    effect(() => {
      console.log('id', this.id());
      const id = this.id();
      if (id) {
        this.issuesService.getIssue(id).subscribe((issue) => {
          this.issue.set(issue);
        });
      }
    });
  }

  deleteIssue() {
    const id = this.id();
    if (!id) {
      return;
    }
    this.issuesService.deleteIssue(id).subscribe(() => {
      this.router.navigate(['/issues']);
    });
  }
}
