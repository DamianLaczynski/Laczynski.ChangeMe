import { Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { IssuesService } from '@features/issues/services/issues.service';
import {
  IssueAcceptanceCriteriaConstraints,
  IssueAssignableUserDto,
  IssueConstraints,
  IssueDetailsDto,
  IssuePriority,
  IssueStatus,
  UpdateIssueRequest
} from '@features/issues/models/issue.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-issue',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-issue.component.html'
})
export class EditIssueComponent {
  id = input<string>();

  private readonly issuesService = inject(IssuesService);
  private readonly router = inject(Router);

  issuePriorities = this.issuesService.issuePriorities;
  issueStatuses = this.issuesService.issueStatuses;
  issueConstraints = IssueConstraints;
  issueAcceptanceCriteriaConstraints = IssueAcceptanceCriteriaConstraints;
  assignableUsers = signal<IssueAssignableUserDto[]>([]);
  private currentIssue: IssueDetailsDto | null = null;

  constructor() {
    this.issuesService.getAssignableUsers().subscribe((users) => {
      this.assignableUsers.set(users);
    });

    effect(() => {
      const id = this.id();
      if (id && !this.form.dirty) {
        this.issuesService.getIssue(id).subscribe((issue) => {
          this.currentIssue = issue;
          this.form.patchValue({
            title: issue.title,
            description: issue.description,
            status: issue.status,
            priority: issue.priority,
            assignedToUserId: issue.assignedToUserId ?? null
          });
          this.setAcceptanceCriteria(issue);
        });
      }
    });
  }

  form = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(IssueConstraints.TITLE_MIN_LENGTH),
      Validators.maxLength(IssueConstraints.TITLE_MAX_LENGTH)
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(IssueConstraints.DESCRIPTION_MAX_LENGTH)
    ]),
    status: new FormControl<IssueStatus>(IssueStatus.NEW, [Validators.required]),
    priority: new FormControl<IssuePriority>(IssuePriority.MEDIUM, [
      Validators.required
    ]),
    assignedToUserId: new FormControl<string | null>(null),
    acceptanceCriteria: new FormArray<FormGroup<AcceptanceCriterionForm>>([])
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
      status: this.form.controls.status.value ?? IssueStatus.NEW,
      priority: this.form.controls.priority.value ?? IssuePriority.MEDIUM,
      assignedToUserId: this.form.controls.assignedToUserId.value,
      acceptanceCriteria: this.acceptanceCriteria.controls
        .map((acceptanceCriterion) => ({
          id: acceptanceCriterion.controls.id.value || undefined,
          content: acceptanceCriterion.controls.content.value.trim()
        }))
        .filter((acceptanceCriterion) => acceptanceCriterion.content.length > 0)
    };

    this.issuesService.updateIssue(request).subscribe({
      next: (issue) => {
        this.router.navigate(['/issues', issue.id]);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  addAcceptanceCriterion() {
    this.acceptanceCriteria.push(this.createAcceptanceCriterionGroup());
  }

  removeAcceptanceCriterion(index: number) {
    this.acceptanceCriteria.removeAt(index);
  }

  get acceptanceCriteria() {
    return this.form.controls.acceptanceCriteria;
  }

  private setAcceptanceCriteria(issue: IssueDetailsDto) {
    this.acceptanceCriteria.clear();

    for (const acceptanceCriterion of issue.acceptanceCriteria) {
      this.acceptanceCriteria.push(this.createAcceptanceCriterionGroup(acceptanceCriterion.id, acceptanceCriterion.content));
    }
  }

  private createAcceptanceCriterionGroup(id = '', content = ''): FormGroup<AcceptanceCriterionForm> {
    return new FormGroup({
      id: new FormControl(id, { nonNullable: true }),
      content: new FormControl(content, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(IssueAcceptanceCriteriaConstraints.CONTENT_MAX_LENGTH)
        ]
      })
    });
  }
}

type AcceptanceCriterionForm = {
  id: FormControl<string>;
  content: FormControl<string>;
};
