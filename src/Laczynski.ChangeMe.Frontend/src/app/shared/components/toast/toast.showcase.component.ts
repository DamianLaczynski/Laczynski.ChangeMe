import { Component } from '@angular/core';
import { ToastComponent } from './toast.component';
import { ToastContainerComponent } from './toast-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toast-showcase',
  imports: [ToastComponent, ToastContainerComponent, CommonModule, FormsModule],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Toast Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Toast component built with Fluent 2 Design System. All
        variants are responsive and accessible.
      </p>

      <!-- Toast Intents -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Toast Intents</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-toast
              intent="info"
              title="Information Toast"
              message="This is an informational message"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
            <app-toast
              intent="success"
              title="Success Toast"
              message="Operation completed successfully"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
            <app-toast
              intent="warning"
              title="Warning Toast"
              message="Please review your input"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
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
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-toast
              intent="info"
              title="Small Toast"
              message="This is a small toast"
              size="small"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
            <app-toast
              intent="success"
              title="Medium Toast"
              message="This is a medium toast"
              size="medium"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
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
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-toast
              intent="info"
              title="Solid Variant"
              message="This is a solid toast"
              variant="solid"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
            <app-toast
              intent="success"
              title="Outline Variant"
              message="This is an outline toast"
              variant="outline"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
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
        <h2 class="showcase__section__title">Interactive Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <button type="button" (click)="showToast('info')" class="btn btn--primary">
                Show Info Toast
              </button>
              <button type="button" (click)="showToast('success')" class="btn btn--success">
                Show Success Toast
              </button>
              <button type="button" (click)="showToast('warning')" class="btn btn--warning">
                Show Warning Toast
              </button>
              <button type="button" (click)="showToast('danger')" class="btn btn--danger">
                Show Error Toast
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Toast Container Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Toast Container</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-toast-container position="top-right"></app-toast-container>
            <div class="showcase__form">
              <button type="button" (click)="addToast('info')" class="btn btn--primary">
                Add Info Toast
              </button>
              <button type="button" (click)="addToast('success')" class="btn btn--success">
                Add Success Toast
              </button>
              <button type="button" (click)="addToast('warning')" class="btn btn--warning">
                Add Warning Toast
              </button>
              <button type="button" (click)="addToast('danger')" class="btn btn--danger">
                Add Error Toast
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- All Variants Combined -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">All Variants Combined</h2>
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
          <div class="showcase__item">
            <app-toast
              intent="info"
              title="Dismissible Toast"
              message="This toast can be dismissed"
              [dismissible]="true"
              [visible]="true"
            ></app-toast>
          </div>
          <div class="showcase__item">
            <app-toast
              intent="success"
              title="Auto Dismiss"
              message="This toast will auto dismiss"
              [duration]="3000"
              [visible]="true"
            ></app-toast>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ToastShowcaseComponent {
  showToast(intent: string) {
    // This would typically use a toast service
    console.log(`Showing ${intent} toast`);
  }

  addToast(intent: string) {
    // This would typically use a toast service
    console.log(`Adding ${intent} toast`);
  }
}
