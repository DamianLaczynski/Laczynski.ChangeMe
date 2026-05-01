import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  CreateIssueRequest,
  IssueAcceptanceCriteriaConstraints,
  IssueAssignableUserDto,
  IssueConstraints,
  IssuePriority,
  IssueStatus
} from '@features/issues/models/issue.model';
import { IssuesService } from '@features/issues/services/issues.service';

type CreateIssueForm = {
  title: FormControl<string>;
  description: FormControl<string>;
  status: FormControl<IssueStatus>;
  priority: FormControl<IssuePriority>;
  assignedToUserId: FormControl<string | null>;
  watchAfterCreate: FormControl<boolean>;
  acceptanceCriteria: FormArray<FormGroup<AcceptanceCriterionForm>>;
};

type AcceptanceCriterionForm = {
  content: FormControl<string>;
};

@Component({
  selector: 'app-create-issue',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-issue.component.html'
})
export class CreateIssueComponent {
  private readonly issuesService = inject(IssuesService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly issuePriorities = this.issuesService.issuePriorities;
  readonly issueStatuses = this.issuesService.issueStatuses;
  readonly issueConstraints = IssueConstraints;
  readonly issueAcceptanceCriteriaConstraints = IssueAcceptanceCriteriaConstraints;
  readonly assignableUsers = signal<IssueAssignableUserDto[]>([]);
  readonly isLoadingAssignableUsers = signal(true);
  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly isSubmitted = signal(false);

  readonly form = new FormGroup<CreateIssueForm>({
    title: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(IssueConstraints.TITLE_MIN_LENGTH),
        Validators.maxLength(IssueConstraints.TITLE_MAX_LENGTH)
      ]
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(IssueConstraints.DESCRIPTION_MAX_LENGTH)
      ]
    }),
    status: new FormControl(IssueStatus.NEW, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    priority: new FormControl(IssuePriority.MEDIUM, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    assignedToUserId: new FormControl<string | null>(null),
    watchAfterCreate: new FormControl(true, { nonNullable: true }),
    acceptanceCriteria: new FormArray<FormGroup<AcceptanceCriterionForm>>([])
  });

  constructor() {
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

  get acceptanceCriteria(): FormArray<FormGroup<AcceptanceCriterionForm>> {
    return this.form.controls.acceptanceCriteria;
  }

  addAcceptanceCriterion(): void {
    this.acceptanceCriteria.push(this.createAcceptanceCriterionGroup());
  }

  removeAcceptanceCriterion(index: number): void {
    this.acceptanceCriteria.removeAt(index);
  }

  onSubmit(): void {
    this.isSubmitted.set(true);
    this.submitError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request: CreateIssueRequest = {
      title: this.form.controls.title.value.trim(),
      description: this.form.controls.description.value.trim(),
      status: this.form.controls.status.value,
      priority: this.form.controls.priority.value,
      assignedToUserId: this.form.controls.assignedToUserId.value,
      watchAfterCreate: this.form.controls.watchAfterCreate.value,
      acceptanceCriteria: this.acceptanceCriteria.controls.map((criterion) => ({
        content: criterion.controls.content.value.trim()
      }))
    };

    this.isSubmitting.set(true);

    this.issuesService
      .createIssue(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (issue) => {
          this.isSubmitting.set(false);
          void this.router.navigate(['/issues', issue.id]);
        },
        error: (error: Error) => {
          this.submitError.set(error.message);
          this.isSubmitting.set(false);
        }
      });
  }

  shouldShowError(control: FormControl<string> | FormControl<IssueStatus> | FormControl<IssuePriority>): boolean {
    return !!control.errors && (control.touched || this.isSubmitted());
  }

  private createAcceptanceCriterionGroup(content = ''): FormGroup<AcceptanceCriterionForm> {
    return new FormGroup({
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
