import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthConstraints } from '@features/auth/models/auth.model';
import { AuthService } from '@features/auth/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly errorMessage = signal('');
  readonly isSubmitting = signal(false);
  readonly authConstraints = AuthConstraints;

  readonly form = new FormGroup(
    {
      email: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.email,
          Validators.maxLength(AuthConstraints.EMAIL_MAX_LENGTH)
        ]
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(AuthConstraints.PASSWORD_MIN_LENGTH),
          Validators.maxLength(AuthConstraints.PASSWORD_MAX_LENGTH)
        ]
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      })
    },
    { validators: [passwordMatchValidator] }
  );

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const { email, password } = this.form.getRawValue();

    this.authService.register({ email, password }).subscribe({
      next: () => {
        this.router.navigateByUrl('/issues');
      },
      error: (error) => {
        this.errorMessage.set(
          error instanceof Error ? error.message : 'Registration failed.'
        );
        this.isSubmitting.set(false);
      },
      complete: () => {
        this.isSubmitting.set(false);
      }
    });
  }
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
}
