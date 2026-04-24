import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IssuesService } from '@features/issues/services/issues.service';
import { CreateIssueRequest, IssueCommentConstraints, IssueConstraints, IssuePriority } from '@features/issues/models/issue.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-issue',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './create-issue.component.html',
})
export class CreateIssueComponent {
  private readonly issuesService = inject(IssuesService);
  private readonly router = inject(Router);

  issuePriorities = this.issuesService.issuePriorities;
  issueConstraints = IssueConstraints;
  issueCommentConstraints = IssueCommentConstraints;

  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(IssueConstraints.TITLE_MIN_LENGTH), Validators.maxLength(IssueConstraints.TITLE_MAX_LENGTH)]),
    description: new FormControl('', [Validators.required, Validators.maxLength(IssueConstraints.DESCRIPTION_MAX_LENGTH)]),
    priority: new FormControl<IssuePriority>(IssuePriority.MEDIUM, [Validators.required]),
    comments: new FormArray<FormGroup<CommentForm>>([]),
  });

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const request: CreateIssueRequest = {
      title: this.form.controls.title.value ?? '',
      description: this.form.controls.description.value ?? '',
      priority: this.form.controls.priority.value ?? IssuePriority.MEDIUM,
      comments: this.comments.controls
        .map(comment => ({
          content: comment.controls.content.value?.trim() ?? '',
        }))
        .filter(comment => comment.content.length > 0),
    };

    this.issuesService.createIssue(request).subscribe({
      next: (issue) => {
        this.router.navigate(['/issues', issue.id]);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  addComment() {
    this.comments.push(this.createCommentGroup());
  }

  removeComment(index: number) {
    this.comments.removeAt(index);
  }

  get comments() {
    return this.form.controls.comments;
  }

  private createCommentGroup(): FormGroup<CommentForm> {
    return new FormGroup({
      content: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(IssueCommentConstraints.CONTENT_MAX_LENGTH)] }),
    });
  }
}

type CommentForm = {
  content: FormControl<string>;
};
