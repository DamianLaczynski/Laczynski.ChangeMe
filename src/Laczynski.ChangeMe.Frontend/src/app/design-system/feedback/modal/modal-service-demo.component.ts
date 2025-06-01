import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalService, ModalRef } from './modal.service';
import { ButtonComponent } from '../../ui/button';

/**
 * Simple content component for modal service demonstration
 */
@Component({
  selector: 'ds-modal-content',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="modal-content-demo">
      <h4>{{ title }}</h4>
      <p>{{ message }}</p>
      @if (data) {
        <div class="data-section">
          <strong>Received data:</strong>
          <pre>{{ data | json }}</pre>
        </div>
      }
      <div class="actions">
        <ds-button variant="primary" (clicked)="closeWithResult()"> Close with Result </ds-button>
        <ds-button variant="secondary" (clicked)="closeModal()"> Just Close </ds-button>
      </div>
    </div>

    <style>
      .modal-content-demo {
        padding: var(--spacing-md);
      }

      .data-section {
        margin: var(--spacing-md) 0;
        padding: var(--spacing-sm);
        background: var(--color-gray-50);
        border-radius: var(--border-radius-sm);
      }

      .data-section pre {
        margin: var(--spacing-xs) 0 0;
        font-size: var(--font-size-sm);
      }

      .actions {
        display: flex;
        gap: var(--spacing-sm);
        margin-top: var(--spacing-lg);
      }
    </style>
  `,
})
export class ModalContentDemoComponent implements OnInit {
  title = 'Modal Service Demo';
  message = 'This modal was opened using ModalService programmatically!';
  data: any = null;

  // This will be injected by ModalService
  modalRef?: ModalRef;

  ngOnInit(): void {
    // Update message if data was provided
    if (this.data) {
      this.message = 'This modal was opened with custom data using ModalService!';
    }
  }

  closeWithResult(): void {
    this.modalRef?.close({
      action: 'confirmed',
      timestamp: Date.now(),
      userInput: 'Some result data',
    });
  }

  closeModal(): void {
    this.modalRef?.close();
  }
}

/**
 * Demonstration component showing ModalService usage
 */
@Component({
  selector: 'ds-modal-service-demo',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="service-demo">
      <h3>ModalService API Demo</h3>
      <p>Demonstrate opening modals programmatically using ModalService.</p>

      <div class="demo-grid">
        <div class="demo-item">
          <h4>Basic Modal</h4>
          <ds-button variant="primary" (clicked)="openBasicModal()"> Open Basic Modal </ds-button>
        </div>

        <div class="demo-item">
          <h4>Modal with Data</h4>
          <ds-button variant="secondary" (clicked)="openModalWithData()">
            Open with Data
          </ds-button>
        </div>

        <div class="demo-item">
          <h4>Template Modal</h4>
          <ds-button variant="secondary" (clicked)="openTemplateModal()">
            Open Template Modal
          </ds-button>
        </div>

        <div class="demo-item">
          <h4>Custom Configuration</h4>
          <ds-button variant="danger" (clicked)="openCustomModal()"> Open Custom Modal </ds-button>
        </div>

        <div class="demo-item">
          <h4>Multiple Modals</h4>
          <ds-button variant="secondary" (clicked)="openMultipleModals()">
            Open Multiple
          </ds-button>
        </div>
      </div>

      @if (lastResult) {
        <div class="result-section">
          <h4>Last Modal Result:</h4>
          <pre>{{ lastResult | json }}</pre>
        </div>
      }
    </div>

    <!-- Template for template modal demo -->
    <ng-template #templateModalContent>
      <div class="template-modal-content">
        <h4>🎯 Template Modal</h4>
        <p>This content comes from an ng-template!</p>
        <div class="template-features">
          <h5>Template Benefits:</h5>
          <ul>
            <li>✅ Direct template syntax</li>
            <li>✅ Access to component scope</li>
            <li>✅ No additional component needed</li>
            <li>✅ Angular directives work</li>
          </ul>
        </div>
        <p>Current time: {{ getCurrentTime() }}</p>
      </div>
    </ng-template>

    <style>
      .service-demo {
        padding: var(--spacing-lg);
        max-width: 800px;
      }

      .demo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-lg);
        margin: var(--spacing-lg) 0;
      }

      .demo-item {
        padding: var(--spacing-md);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-md);
      }

      .demo-item h4 {
        margin: 0 0 var(--spacing-sm);
        color: var(--color-text);
      }

      .result-section {
        margin-top: var(--spacing-xl);
        padding: var(--spacing-md);
        background: var(--color-gray-50);
        border-radius: var(--border-radius-md);
        border-left: 4px solid var(--color-primary);
      }

      .result-section h4 {
        margin: 0 0 var(--spacing-sm);
      }

      .result-section pre {
        background: var(--color-white);
        padding: var(--spacing-sm);
        border-radius: var(--border-radius-sm);
        font-size: var(--font-size-sm);
        border: 1px solid var(--color-border);
      }

      .template-modal-content {
        padding: var(--spacing-lg);
      }

      .template-features {
        margin: var(--spacing-md) 0;
        padding: var(--spacing-md);
        background: var(--color-gray-50);
        border-radius: var(--border-radius-sm);
        border-left: 4px solid var(--color-info);
      }

      .template-features h5 {
        margin: 0 0 var(--spacing-sm);
        color: var(--color-info);
      }

      .template-features ul {
        margin: 0;
        padding-left: var(--spacing-lg);
      }

      .template-features li {
        margin-bottom: var(--spacing-xs);
      }
    </style>
  `,
})
export class ModalServiceDemoComponent {
  @ViewChild('templateModalContent') templateModalContent!: TemplateRef<any>;

  lastResult: any = null;

  constructor(private modalService: ModalService) {}

  getCurrentTime(): string {
    return new Date().toLocaleTimeString();
  }

  openBasicModal(): void {
    const modalRef = this.modalService.open(ModalContentDemoComponent, {
      title: 'Basic Modal',
      size: 'md',
      variant: 'default',
    });

    modalRef.afterClosed().subscribe(result => {
      this.lastResult = result || 'Modal closed without result';
    });
  }

  openModalWithData(): void {
    const modalRef = this.modalService.open(ModalContentDemoComponent, {
      title: 'Modal with Data',
      size: 'lg',
      variant: 'info',
      data: {
        userId: 123,
        userName: 'John Doe',
        preferences: ['dark-mode', 'notifications'],
        timestamp: new Date().toISOString(),
      },
    });

    // Data will be automatically injected into the component
    modalRef.afterClosed().subscribe(result => {
      this.lastResult = result || 'Data modal closed';
    });
  }

  openTemplateModal(): void {
    const modalRef = this.modalService.openTemplate(this.templateModalContent, {
      title: 'Template Modal Demo',
      size: 'md',
      variant: 'info',
      actions: [
        {
          id: 'close',
          label: 'Close Template',
          variant: 'primary',
          closesModal: true,
        },
      ],
    });

    modalRef.afterClosed().subscribe(result => {
      this.lastResult = result || 'Template modal closed';
    });
  }

  openCustomModal(): void {
    const modalRef = this.modalService.open(ModalContentDemoComponent, {
      title: 'Custom Danger Modal',
      size: 'sm',
      variant: 'danger',
      animation: 'scale',
      closeOnOverlay: false,
      closeOnEscape: false,
      showCloseButton: false,
      actions: [
        {
          id: 'confirm',
          label: 'Confirm Delete',
          variant: 'danger',
          closesModal: true,
        },
        {
          id: 'cancel',
          label: 'Cancel',
          variant: 'secondary',
          closesModal: true,
        },
      ],
    });

    modalRef.afterClosed().subscribe(result => {
      this.lastResult = result || 'Custom modal closed';
    });
  }

  openMultipleModals(): void {
    // Open first modal
    const firstModal = this.modalService.open(ModalContentDemoComponent, {
      title: 'First Modal',
      size: 'sm',
      variant: 'default',
    });

    // Open second modal after a delay
    setTimeout(() => {
      const secondModal = this.modalService.open(ModalContentDemoComponent, {
        title: 'Second Modal',
        size: 'md',
        variant: 'success',
      });

      // Close all after 3 seconds
      setTimeout(() => {
        this.modalService.closeAll();
        this.lastResult = 'All modals closed programmatically';
      }, 3000);
    }, 1000);
  }
}
