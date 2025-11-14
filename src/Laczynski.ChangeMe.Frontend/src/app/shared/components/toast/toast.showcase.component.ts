import { Component, inject } from '@angular/core';
import { ToastComponent } from './toast.component';
import { ToastContainerComponent } from './toast-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ToastService } from './services/toast.service';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-toast-showcase',
  imports: [ToastComponent, ToastContainerComponent, CommonModule, FormsModule, ButtonComponent, TableOfContentComponent],
  template: `
    <div class="showcase showcase--responsive showcase__with-toc">
      <app-table-of-content
        [sticky]="true"
        [offsetTop]="20"
        containerSelector=".showcase-content"
        [minLevel]="1"
        [maxLevel]="2"
      />
      <div class="showcase-content">
        <h1 class="showcase__title">Toast Component</h1>
      <p class="showcase__description">
        Toast notifications built with Fluent 2 Design System. Toasts provide brief messages about
        app processes at the bottom or top of the screen. They're meant to be noticed without being
        disruptive.
      </p>

      <!-- Toast Intents -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Toast Intents</h2>
        <p class="showcase__section__description">
          Toast components support different intent types to communicate the nature of the message:
          info, success, warning, and error.
        </p>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3 class="showcase__item__title">Info</h3>
            <app-toast
              intent="info"
              title="Information Toast"
              message="This is an informational message"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
            <h3 class="showcase__item__title">Success</h3>
            <app-toast
              intent="success"
              title="Success Toast"
              message="Operation completed successfully"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
            <h3 class="showcase__item__title">Warning</h3>
            <app-toast
              intent="warning"
              title="Warning Toast"
              message="Please review your input"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
            <h3 class="showcase__item__title">Error</h3>
            <app-toast
              intent="danger"
              title="Error Toast"
              message="Something went wrong"
              [visible]="true"
            ></app-toast>
          </div>
        </div>
      </div>

      <!-- Toast Sizes -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Toast Sizes</h2>
        <p class="showcase__section__description">
          Toasts are available in three sizes: small, medium (default), and large.
        </p>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3 class="showcase__item__title">Small</h3>
            <app-toast
              intent="info"
              title="Small Toast"
              message="This is a small toast"
              size="small"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
            <h3 class="showcase__item__title">Medium (Default)</h3>
            <app-toast
              intent="success"
              title="Medium Toast"
              message="This is a medium toast"
              size="medium"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
            <h3 class="showcase__item__title">Large</h3>
            <app-toast
              intent="warning"
              title="Large Toast"
              message="This is a large toast"
              size="large"
              [visible]="true"
            ></app-toast>
          </div>
        </div>
      </div>

      <!-- Toast Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Toast Variants</h2>
        <p class="showcase__section__description">
          Toast components support three visual variants: solid (default), outline, and ghost.
        </p>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3 class="showcase__item__title">Solid (Default)</h3>
            <app-toast
              intent="info"
              title="Solid Variant"
              message="This is a solid toast"
              variant="solid"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
            <h3 class="showcase__item__title">Outline</h3>
            <app-toast
              intent="success"
              title="Outline Variant"
              message="This is an outline toast"
              variant="outline"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
            <h3 class="showcase__item__title">Ghost</h3>
            <app-toast
              intent="warning"
              title="Ghost Variant"
              message="This is a ghost toast"
              variant="ghost"
              [visible]="true"
            ></app-toast>
          </div>
        </div>
      </div>

      <!-- Interactive Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive Toast Service</h2>
        <p class="showcase__section__description">
          Click the buttons below to trigger toast notifications using the ToastService. Toasts will
          appear in the top-right corner.
        </p>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-toast-container position="top-right"></app-toast-container>
            <div class="showcase__form">
              <app-button
                type="button"
                (click)="showInfoToast()"
                intent="primary"
                label="Show Info Toast"
              >
                Show Info Toast</app-button
              >
              <app-button
                type="button"
                (click)="showSuccessToast()"
                intent="success"
                label="Show Success Toast"
              >
                Show Success Toast</app-button
              >
              <app-button
                type="button"
                (click)="showWarningToast()"
                intent="warning"
                label="Show Warning Toast"
              >
                Show Warning Toast</app-button
              >
              <app-button
                type="button"
                (click)="showErrorToast()"
                intent="danger"
                label="Show Error Toast"
              >
                Show Error Toast</app-button
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Toast Options -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Toast Options</h2>
        <p class="showcase__section__description">
          Toasts support various options including dismissible, auto-dismiss duration, and progress
          indicators.
        </p>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <h3 class="showcase__item__title">Dismissible</h3>
            <app-toast
              intent="info"
              title="Dismissible Toast"
              message="Click the X to dismiss"
              [dismissible]="true"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
            <h3 class="showcase__item__title">With Progress Bar</h3>
            <app-toast
              intent="success"
              title="Auto Dismiss"
              message="This toast will auto dismiss in 5s"
              [duration]="5000"
              [showProgress]="true"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
            <h3 class="showcase__item__title">Without Icon</h3>
            <app-toast
              intent="warning"
              title="No Icon"
              message="This toast has no icon"
              [showIcon]="false"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
            <h3 class="showcase__item__title">Without Progress</h3>
            <app-toast
              intent="info"
              title="No Progress"
              message="This toast has no progress bar"
              [showProgress]="false"
              [visible]="true"
            ></app-toast>
          </div>
        </div>
      </div>

      <!-- All Variants Combined -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">All Variants Combined</h2>
        <p class="showcase__section__description">
          A comprehensive view of different toast combinations.
        </p>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <app-toast
              intent="info"
              title="Small Info"
              message="Small info toast"
              size="small"
              variant="solid"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
            <app-toast
              intent="success"
              title="Medium Success"
              message="Medium success toast"
              size="medium"
              variant="outline"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
            <app-toast
              intent="warning"
              title="Large Warning"
              message="Large warning toast"
              size="large"
              variant="ghost"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
            <app-toast
              intent="danger"
              title="Small Error"
              message="Small error toast"
              size="small"
              variant="solid"
              [visible]="true"
            ></app-toast>
          </div>
        </div>
      </div>
      </div>
    </div>
  `,
})
export class ToastShowcaseComponent {
  private toastService = inject(ToastService);

  showInfoToast() {
    this.toastService.info(
      'Information',
      'This is an informational message that will auto-dismiss.',
    );
  }

  showSuccessToast() {
    this.toastService.success('Success!', 'Your operation completed successfully.');
  }

  showWarningToast() {
    this.toastService.warn('Warning', 'Please review your input before proceeding.');
  }

  showErrorToast() {
    this.toastService.error('Error', 'Something went wrong. Please try again.');
  }
}
