import { Component, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IssuesService } from '@features/issues/services/issues.service';
import { IssueDetailsDto, IssuePriority, UpdateIssueRequest } from '@features/issues/models/issue.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-issue',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './edit-issue.component.html',
})
export class EditIssueComponent {
  id = input<string>();

  private readonly issuesService = inject(IssuesService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      const id = this.id();
      if (id && !this.form.dirty) {
        this.issuesService.getIssue(id).subscribe((issue) => {
          this.form.patchValue({
            title: issue.title,
            description: issue.description ?? '',
            priority: issue.priority,
          });
          this.setComments(issue);
        });
      }
    });
  }

  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    priority: new FormControl<IssuePriority>(IssuePriority.MEDIUM, [Validators.required]),
    comments: new FormArray<FormGroup<CommentForm>>([]),
  });

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const id = this.id();
    if (!id) {
      return;
    }

    const request: UpdateIssueRequest = {
      id,
      title: this.form.controls.title.value ?? '',
      description: this.form.controls.description.value ?? '',
      priority: this.form.controls.priority.value ?? IssuePriority.MEDIUM,
      comments: this.comments.controls
        .map(comment => ({
          id: comment.controls.id.value || undefined,
          content: comment.controls.content.value.trim(),
        }))
        .filter(comment => comment.content.length > 0),
    };

    this.issuesService.updateIssue(request).subscribe({
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

  private setComments(issue: IssueDetailsDto) {
    this.comments.clear();

    for (const comment of issue.comments) {
      this.comments.push(this.createCommentGroup(comment.id, comment.content));
    }
  }

  private createCommentGroup(id = '', content = ''): FormGroup<CommentForm> {
    return new FormGroup({
      id: new FormControl(id, { nonNullable: true }),
      content: new FormControl(content, { nonNullable: true, validators: [Validators.required] }),
    });
  }
}

type CommentForm = {
  id: FormControl<string>;
  content: FormControl<string>;
};
