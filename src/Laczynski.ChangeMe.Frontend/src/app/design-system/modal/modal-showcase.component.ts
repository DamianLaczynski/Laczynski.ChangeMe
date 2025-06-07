// =============================================================================
// Modal Showcase Component
// =============================================================================
// Demonstrates modal component features and provides interactive examples

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { ButtonComponent } from '../button/button.component';

/**
 * Modal Showcase Component
 */
@Component({
  selector: 'modal-showcase',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  template: `
    <div class="showcase-container">
      <!-- Header -->
      <header class="showcase-header">
        <h1>Modal Component</h1>
        <p class="showcase-description">
          A comprehensive modal dialog component with accessibility features.
        </p>
      </header>

      <!-- Interactive Example -->
      <section class="showcase-section">
        <h2>Interactive Example</h2>

        <div class="showcase-interactive">
          <div class="controls">
            <ds-button variant="primary" (clicked)="openBasicModal()"> Open Modal </ds-button>
            <p>Modal is {{ showBasicModal() ? 'open' : 'closed' }}</p>
          </div>
        </div>
      </section>

      <!-- Basic Modal -->
      @if (showBasicModal()) {
        <ds-modal
          [open]="true"
          size="md"
          animation="none"
          [trapFocus]="false"
          (openChange)="handleModalOpenChange($event)"
        >
          <div slot="header">
            <h2>Basic Modal Example</h2>
          </div>
          <div slot="body">
            <p>This is a basic modal with default settings.</p>
          </div>
          <div slot="footer">
            <ds-button variant="secondary" (clicked)="closeModal()"> Cancel </ds-button>
            <ds-button variant="primary" (clicked)="closeModal()"> OK </ds-button>
          </div>
        </ds-modal>
      }
    </div>
  `,
  styles: [
    `
      .showcase-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--spacing-xl);
      }

      .showcase-header {
        margin-bottom: var(--spacing-xl);
        border-bottom: 1px solid var(--color-border);
        padding-bottom: var(--spacing-lg);
      }

      .showcase-header h1 {
        margin: 0 0 var(--spacing-sm) 0;
        font-size: var(--font-size-xxxl);
        font-weight: var(--font-weight-bold);
        color: var(--color-text);
      }

      .showcase-description {
        margin: 0;
        color: var(--color-text-secondary);
        font-size: var(--font-size-lg);
      }

      .showcase-section {
        margin-bottom: var(--spacing-xl);
      }

      .showcase-section h2 {
        margin: 0 0 var(--spacing-md) 0;
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text);
      }

      .showcase-interactive {
        padding: var(--spacing-lg);
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-lg);
      }
    `,
  ],
})
export class ModalShowcaseComponent {
  // Modal visibility states
  showBasicModal = signal(false);

  // Open basic modal
  openBasicModal(): void {
    this.showBasicModal.set(true);
  }

  // Handle modal open change
  handleModalOpenChange(isOpen: boolean): void {
    this.showBasicModal.set(isOpen);
  }

  // Close modal
  closeModal(): void {
    this.showBasicModal.set(false);
  }
}
