import { Component, signal, model } from '@angular/core';
import { DialogComponent } from './dialog.component';
import { ButtonComponent } from '../button/button.component';
import { QuickAction } from '../utils';

@Component({
  selector: 'app-dialog-showcase',
  standalone: true,
  imports: [DialogComponent, ButtonComponent],
  template: `
    <div class="showcase">
      <h1 class="showcase__title">Dialog Component</h1>
      <p class="showcase__description">
        Dialog component based on Fluent 2 Design System - displays modal dialogs with customizable
        content and actions.
      </p>

      <!-- Basic Dialog -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">Basic Dialog</h2>
        <p class="showcase__section-description">
          Simple dialog with title, body text and action buttons.
        </p>

        <div class="showcase__demo">
          <app-button variant="primary" (click)="showBasicDialog()"> Open Basic Dialog </app-button>

          <app-dialog
            title="Main question or action"
            bodyText="Here is more about the consequences of the main action, if details are needed."
            [(visible)]="basicDialogVisible"
            [primaryAction]="basicPrimaryAction()"
            [secondaryAction]="basicSecondaryAction()"
          />
        </div>
      </section>

      <!-- Dialog with Custom Content -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">Dialog with Custom Content</h2>
        <p class="showcase__section-description">
          Dialog with projected content instead of simple body text.
        </p>

        <div class="showcase__demo">
          <app-button variant="primary" (click)="showCustomContentDialog()">
            Open Custom Content Dialog
          </app-button>

          <app-dialog
            title="Main question or action"
            [(visible)]="customContentDialogVisible"
            [primaryAction]="customPrimaryAction()"
            [secondaryAction]="customSecondaryAction()"
          >
            <div
              style="background: #EBF3FC; min-width: 100%; min-height: 100%; padding: 40px; text-align: center; border-radius: 4px;"
            >
              <p style="color: #0F6CBD; font-size: 14px; margin: 0;">
                Custom content area - you can place any component or HTML here
              </p>
            </div>
          </app-dialog>
        </div>
      </section>

      <!-- Dialog Sizes -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">Dialog Sizes</h2>
        <p class="showcase__section-description">
          Different dialog sizes: small (320px), medium (600px), large (800px).
        </p>

        <div class="showcase__demo" style="display: flex; gap: 8px;">
          <app-button variant="outline" (click)="showSmallDialog()"> Small Dialog </app-button>

          <app-button variant="outline" (click)="showMediumDialog()"> Medium Dialog </app-button>

          <app-button variant="outline" (click)="showLargeDialog()"> Large Dialog </app-button>

          <app-dialog
            title="Small Dialog (320px)"
            bodyText="This is a small dialog suitable for mobile devices or simple confirmations."
            size="small"
            [(visible)]="smallDialogVisible"
            [primaryAction]="sizePrimaryAction()"
            [secondaryAction]="sizeSecondaryAction()"
          />

          <app-dialog
            title="Medium Dialog (600px)"
            bodyText="This is a medium dialog - the default size for most use cases."
            size="medium"
            [(visible)]="mediumDialogVisible"
            [primaryAction]="sizePrimaryAction()"
            [secondaryAction]="sizeSecondaryAction()"
          />

          <app-dialog
            title="Large Dialog (800px)"
            bodyText="This is a large dialog suitable for complex forms or detailed information."
            size="large"
            [(visible)]="largeDialogVisible"
            [primaryAction]="sizePrimaryAction()"
            [secondaryAction]="sizeSecondaryAction()"
          />
        </div>
      </section>

      <!-- Non-Closable Dialog -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">Non-Closable Dialog</h2>
        <p class="showcase__section-description">
          Dialog that can only be closed via action buttons (no close button, no ESC key, no
          backdrop click).
        </p>

        <div class="showcase__demo">
          <app-button variant="primary" (click)="showNonClosableDialog()">
            Open Non-Closable Dialog
          </app-button>

          <app-dialog
            title="Important Action Required"
            bodyText="You must take one of the actions below. This dialog cannot be dismissed."
            [closable]="false"
            backdrop="static"
            [(visible)]="nonClosableDialogVisible"
            [primaryAction]="nonClosablePrimaryAction()"
            [secondaryAction]="nonClosableSecondaryAction()"
          />
        </div>
      </section>

      <!-- Multiple Actions -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">Multiple Actions</h2>
        <p class="showcase__section-description">
          Dialog with additional action buttons beyond primary and secondary.
        </p>

        <div class="showcase__demo">
          <app-button variant="primary" (click)="showMultipleActionsDialog()">
            Open Multi-Action Dialog
          </app-button>

          <app-dialog
            title="Choose an action"
            bodyText="This dialog has multiple action buttons to choose from."
            [(visible)]="multipleActionsDialogVisible"
            [primaryAction]="multiplePrimaryAction()"
            [secondaryAction]="multipleSecondaryAction()"
            [additionalActions]="additionalActions()"
          />
        </div>
      </section>

      <!-- No Actions Dialog -->
      <section class="showcase__section">
        <h2 class="showcase__section-title">Information Only Dialog</h2>
        <p class="showcase__section-description">
          Dialog without action buttons - informational only.
        </p>

        <div class="showcase__demo">
          <app-button variant="primary" (click)="showInfoDialog()"> Open Info Dialog </app-button>

          <app-dialog
            title="Information"
            bodyText="This is an informational dialog. Close it by clicking the X button, pressing ESC, or clicking the backdrop."
            [(visible)]="infoDialogVisible"
          />
        </div>
      </section>
    </div>
  `,
})
export class DialogShowcaseComponent {
  // Basic Dialog
  basicDialogVisible = model(false);
  basicPrimaryAction = signal<QuickAction>({
    label: 'Take action',
    variant: 'primary',
    action: () => {
      console.log('Primary action clicked');
      this.basicDialogVisible.set(false);
    },
  });
  basicSecondaryAction = signal<QuickAction>({
    label: 'Different action',
    variant: 'secondary',
    action: () => {
      console.log('Secondary action clicked');
      this.basicDialogVisible.set(false);
    },
  });

  // Custom Content Dialog
  customContentDialogVisible = model(false);
  customPrimaryAction = signal<QuickAction>({
    label: 'Confirm',
    variant: 'primary',
    action: () => {
      this.customContentDialogVisible.set(false);
    },
  });
  customSecondaryAction = signal<QuickAction>({
    label: 'Cancel',
    variant: 'secondary',
    action: () => {
      this.customContentDialogVisible.set(false);
    },
  });

  // Size Dialogs
  smallDialogVisible = model(false);
  mediumDialogVisible = model(false);
  largeDialogVisible = model(false);
  sizePrimaryAction = signal<QuickAction>({
    label: 'OK',
    variant: 'primary',
    action: () => {
      this.smallDialogVisible.set(false);
      this.mediumDialogVisible.set(false);
      this.largeDialogVisible.set(false);
    },
  });
  sizeSecondaryAction = signal<QuickAction>({
    label: 'Cancel',
    variant: 'secondary',
    action: () => {
      this.smallDialogVisible.set(false);
      this.mediumDialogVisible.set(false);
      this.largeDialogVisible.set(false);
    },
  });

  // Non-Closable Dialog
  nonClosableDialogVisible = model(false);
  nonClosablePrimaryAction = signal<QuickAction>({
    label: 'Accept',
    variant: 'primary',
    action: () => {
      console.log('Accepted');
      this.nonClosableDialogVisible.set(false);
    },
  });
  nonClosableSecondaryAction = signal<QuickAction>({
    label: 'Decline',
    variant: 'secondary',
    action: () => {
      console.log('Declined');
      this.nonClosableDialogVisible.set(false);
    },
  });

  // Multiple Actions Dialog
  multipleActionsDialogVisible = model(false);
  multiplePrimaryAction = signal<QuickAction>({
    label: 'Primary',
    variant: 'primary',
    action: () => {
      console.log('Primary clicked');
      this.multipleActionsDialogVisible.set(false);
    },
  });
  multipleSecondaryAction = signal<QuickAction>({
    label: 'Secondary',
    variant: 'secondary',
    action: () => {
      console.log('Secondary clicked');
      this.multipleActionsDialogVisible.set(false);
    },
  });
  additionalActions = signal<QuickAction[]>([
    {
      label: 'Option A',
      variant: 'outline',
      action: () => {
        console.log('Option A clicked');
        this.multipleActionsDialogVisible.set(false);
      },
    },
    {
      label: 'Option B',
      variant: 'subtle',
      action: () => {
        console.log('Option B clicked');
        this.multipleActionsDialogVisible.set(false);
      },
    },
  ]);

  // Info Dialog
  infoDialogVisible = model(false);

  // Methods
  showBasicDialog(): void {
    this.basicDialogVisible.set(true);
  }

  showCustomContentDialog(): void {
    this.customContentDialogVisible.set(true);
  }

  showSmallDialog(): void {
    this.smallDialogVisible.set(true);
  }

  showMediumDialog(): void {
    this.mediumDialogVisible.set(true);
  }

  showLargeDialog(): void {
    this.largeDialogVisible.set(true);
  }

  showNonClosableDialog(): void {
    this.nonClosableDialogVisible.set(true);
  }

  showMultipleActionsDialog(): void {
    this.multipleActionsDialogVisible.set(true);
  }

  showInfoDialog(): void {
    this.infoDialogVisible.set(true);
  }
}
