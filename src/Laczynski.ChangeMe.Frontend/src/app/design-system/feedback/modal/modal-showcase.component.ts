import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModalComponent } from './modal.component';
import { ModalService } from './modal.service';
import { ModalServiceDemoComponent } from './modal-service-demo.component';
import { ApiDocumentationComponent } from '../../shared/components';
import { ButtonComponent } from '../../ui/button';

import {
  InteractiveExampleConfig,
  InteractiveConfigChangeEvent,
  createVariantControl,
  createSizeControl,
  createCheckboxControl,
  createSelectControl,
} from '../../shared/components/interactive-example/interactive-example.model';

import {
  ModalVariant,
  ModalSize,
  ModalAnimation,
  ModalAction,
  ModalOpenEvent,
  ModalCloseEvent,
  MODAL_VARIANTS,
  MODAL_SIZES,
} from './modal.model';

import {
  ShowcaseComponent,
  ComponentApiDocumentation,
  createShowcaseConfig,
  ShowcaseConfig,
} from '../../models/showcase.model';

/**
 * Modal Component Showcase
 *
 * Demonstrates all modal variants, sizes, animations, and functionality.
 * Provides interactive examples and complete API documentation.
 */
@Component({
  selector: 'ds-modal-showcase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    ModalServiceDemoComponent,
    ButtonComponent,
    ApiDocumentationComponent,
  ],
  template: `
    <div class="showcase-container">
      <!-- Header -->
      <div class="showcase-header">
        <h1>{{ showcaseConfig().component.componentName }}</h1>
        <p class="showcase-description">
          {{ showcaseConfig().component.description }}
        </p>
      </div>

      <!-- ModalService Section - NEW -->
      <section class="showcase-section">
        <h2>🚀 ModalService API (Recommended)</h2>
        <p>
          <strong>Use ModalService for programmatic modal management!</strong>
          This provides better animation control, centralized z-index management, and easier dynamic
          content injection.
        </p>

        <div class="service-highlight">
          <h3>✨ Advantages of ModalService:</h3>
          <ul>
            <li><strong>Better animations</strong> - Proper lifecycle management</li>
            <li><strong>Dynamic content</strong> - Inject any component or template</li>
            <li><strong>Z-index management</strong> - Auto-stacking of multiple modals</li>
            <li><strong>Simpler API</strong> - No template management needed</li>
            <li><strong>Programmatic control</strong> - Open/close from anywhere</li>
          </ul>
        </div>

        <ds-modal-service-demo />
      </section>

      <!-- Template Usage Section -->
      <section class="showcase-section">
        <h2>📝 Template Usage (Alternative)</h2>
        <p>
          You can still use modal components directly in templates, but ModalService is recommended
          for most use cases.
        </p>

        <!-- Variants Section -->
        <h3>Variants</h3>
        <p>Different modal styles for various semantic meanings and contexts.</p>

        <div class="showcase-grid">
          @for (variant of modalVariants; track variant.name) {
            <div class="showcase-item">
              <h4>{{ variant.label }}</h4>
              <p>{{ variant.description }}</p>
              <ds-button variant="secondary" (clicked)="openVariantModal(variant.name)">
                Open {{ variant.label }} Modal
              </ds-button>
            </div>
          }
        </div>

        <!-- Variant Modals -->
        @for (variant of modalVariants; track variant.name) {
          <ds-modal
            [isOpen]="openModals()[variant.name] || false"
            [variant]="variant.name"
            [title]="variant.label + ' Modal'"
            size="md"
            [actions]="getVariantActions(variant.name)"
            (closed)="closeModal(variant.name)"
            (actionClicked)="handleModalAction($event)"
          >
            <p>
              This is a {{ variant.label.toLowerCase() }} modal demonstrating the
              {{ variant.name }} variant.
            </p>
            <p>{{ variant.description }}</p>
            @if (variant.icon) {
              <p>Icon: {{ variant.icon }}</p>
            }
          </ds-modal>
        }
      </section>

      <!-- Sizes Section -->
      <section class="showcase-section">
        <h3>Sizes</h3>
        <p>Different modal sizes for various content types and screen sizes.</p>

        <div class="showcase-grid">
          @for (size of modalSizes; track size.name) {
            <div class="showcase-item">
              <h4>{{ size.label }} ({{ size.maxWidth }})</h4>
              <p>{{ size.recommendedFor }}</p>
              <ds-button variant="secondary" (clicked)="openSizeModal(size.name)">
                Open {{ size.label }}
              </ds-button>
            </div>
          }
        </div>

        <!-- Size Modals -->
        @for (size of modalSizes; track size.name) {
          <ds-modal
            [isOpen]="openSizeModals()[size.name] || false"
            [size]="size.name"
            [title]="size.label + ' Modal'"
            variant="default"
            [actions]="getSizeActions()"
            (closed)="closeSizeModal(size.name)"
          >
            <h4>{{ size.label }} Modal Content</h4>
            <p><strong>Recommended for:</strong> {{ size.recommendedFor }}</p>
            <p><strong>Max Width:</strong> {{ size.maxWidth }}</p>
            <p><strong>Max Height:</strong> {{ size.maxHeight }}</p>
            <p>
              This modal demonstrates the {{ size.name }} size variant with appropriate content.
            </p>

            @if (size.name === 'sm') {
              <p>Small modals are perfect for simple confirmations and alerts.</p>
            } @else if (size.name === 'md') {
              <p>
                Medium modals work well for forms and detailed content. They provide enough space
                for most use cases without overwhelming the user.
              </p>
            } @else if (size.name === 'lg') {
              <p>
                Large modals are suitable for complex forms, data tables, and rich content that
                requires more space to be properly displayed and interacted with.
              </p>
            } @else if (size.name === 'xl') {
              <p>
                Extra large modals are designed for rich content, media viewers, and complex
                workflows that need maximum space while still maintaining the modal context.
              </p>
            } @else if (size.name === 'full') {
              <p>
                Full screen modals provide an immersive experience perfect for complex workflows,
                large forms, or when you need to display extensive content without the constraints
                of smaller modal sizes.
              </p>
            }
          </ds-modal>
        }
      </section>

      <!-- Component API -->
      <section class="showcase-section">
        <h2>Component API</h2>
        <ds-api-documentation [api]="showcaseConfig().api" />
      </section>
    </div>

    <style>
      .service-highlight {
        background: linear-gradient(
          135deg,
          var(--color-primary-50) 0%,
          var(--color-primary-100) 100%
        );
        border: 1px solid var(--color-primary-200);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-lg);
        margin: var(--spacing-lg) 0;
      }

      .service-highlight h3 {
        margin: 0 0 var(--spacing-md);
        color: var(--color-primary-700);
      }

      .service-highlight ul {
        margin: 0;
        padding-left: var(--spacing-lg);
      }

      .service-highlight li {
        margin-bottom: var(--spacing-xs);
        color: var(--color-text-secondary);
      }

      .service-highlight strong {
        color: var(--color-primary-700);
      }

      .modal-form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
      }

      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-lg);
      }

      @media (max-width: 768px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `,
  styleUrl: '../../shared/styles/showcase.scss',
})
export class ModalShowcaseComponent implements ShowcaseComponent {
  componentName = 'Modal Component';
  description =
    'A versatile modal dialog component with multiple variants, sizes, animations, and accessibility features. Use ModalService for programmatic management or template bindings for simple cases.';

  // =============================================================================
  // SHOWCASE DATA
  // =============================================================================

  readonly modalVariants = Object.values(MODAL_VARIANTS);
  readonly modalSizes = Object.values(MODAL_SIZES);

  // =============================================================================
  // MODAL STATE MANAGEMENT
  // =============================================================================

  private readonly openModalsSignal = signal<Record<string, boolean>>({});
  private readonly openSizeModalsSignal = signal<Record<string, boolean>>({});

  readonly openModals = computed(() => this.openModalsSignal());
  readonly openSizeModals = computed(() => this.openSizeModalsSignal());

  // =============================================================================
  // LAST ACTION TRACKING
  // =============================================================================

  protected readonly lastActionSignal = signal<string>('');

  get lastAction(): string {
    return this.lastActionSignal();
  }

  // =============================================================================
  // SHOWCASE CONFIGURATION
  // =============================================================================

  readonly showcaseConfig = computed<ShowcaseConfig>(() => {
    const componentInfo: ShowcaseComponent = {
      componentName: this.componentName,
      description: this.description,
    };

    const apiDocumentation: ComponentApiDocumentation = {
      inputs: [
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
          defaultValue: "'md'",
          description: 'Modal size variant',
        },
        {
          name: 'variant',
          type: "'default' | 'danger' | 'success' | 'warning' | 'info'",
          defaultValue: "'default'",
          description: 'Modal style variant',
        },
        {
          name: 'animation',
          type: "'fade' | 'slide' | 'scale' | 'none'",
          defaultValue: "'fade'",
          description: 'Animation type for opening/closing',
        },
        {
          name: 'title',
          type: 'string',
          defaultValue: "''",
          description: 'Modal title text',
        },
        {
          name: 'isOpen',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether modal is open (template usage)',
        },
        {
          name: 'showCloseButton',
          type: 'boolean',
          defaultValue: 'true',
          description: 'Whether to show close button',
        },
        {
          name: 'closeOnOverlay',
          type: 'boolean',
          defaultValue: 'true',
          description: 'Whether to close on overlay click',
        },
        {
          name: 'closeOnEscape',
          type: 'boolean',
          defaultValue: 'true',
          description: 'Whether to close on escape key',
        },
        {
          name: 'actions',
          type: 'ModalAction[]',
          defaultValue: '[]',
          description: 'Action buttons configuration',
        },
      ],
      outputs: [
        {
          name: 'opened',
          type: 'ModalOpenEvent',
          description: 'Emitted when modal opens',
        },
        {
          name: 'closed',
          type: 'ModalCloseEvent',
          description: 'Emitted when modal closes',
        },
        {
          name: 'beforeClose',
          type: 'ModalBeforeCloseEvent',
          description: 'Emitted before modal closes (preventable)',
        },
        {
          name: 'actionClicked',
          type: 'ModalActionEvent',
          description: 'Emitted when action button is clicked',
        },
      ],
      methods: [
        {
          name: 'ModalService.open(component, config)',
          signature: 'open<T>(component: Type<T>, config?: ModalConfig): ModalRef<T>',
          description: 'Open modal with component (recommended)',
          parameters: [
            {
              name: 'component',
              type: 'Type<T>',
              required: true,
              description: 'Component to render in modal',
            },
            {
              name: 'config',
              type: 'ModalConfig',
              required: false,
              description: 'Modal configuration options',
            },
          ],
          returnType: 'ModalRef<T>',
        },
        {
          name: 'ModalService.openTemplate(template, config)',
          signature:
            'openTemplate<T>(template: TemplateRef<any>, config?: ModalConfig): ModalRef<T>',
          description: 'Open modal with template',
          parameters: [
            {
              name: 'template',
              type: 'TemplateRef<any>',
              required: true,
              description: 'Template to render in modal',
            },
            {
              name: 'config',
              type: 'ModalConfig',
              required: false,
              description: 'Modal configuration options',
            },
          ],
          returnType: 'ModalRef<T>',
        },
        {
          name: 'ModalService.closeAll()',
          signature: 'closeAll(): void',
          description: 'Close all open modals',
          parameters: [],
          returnType: 'void',
        },
        {
          name: 'modalRef.close(result?)',
          signature: 'close(result?: T): void',
          description: 'Close specific modal with optional result',
          parameters: [
            {
              name: 'result',
              type: 'T',
              required: false,
              description: 'Optional result data to pass to afterClosed observers',
            },
          ],
          returnType: 'void',
        },
        {
          name: 'modalRef.afterClosed()',
          signature: 'afterClosed(): Observable<T | undefined>',
          description: 'Observable for modal close event',
          parameters: [],
          returnType: 'Observable<T | undefined>',
        },
      ],
    };

    return createShowcaseConfig(componentInfo, apiDocumentation);
  });

  // =============================================================================
  // MODAL ACTIONS
  // =============================================================================

  getVariantActions(variant: ModalVariant): ModalAction[] {
    const baseActions: ModalAction[] = [
      {
        id: 'ok',
        label: 'OK',
        variant: variant === 'danger' ? 'danger' : 'primary',
        closesModal: true,
      },
      {
        id: 'cancel',
        label: 'Cancel',
        variant: 'secondary',
        closesModal: true,
      },
    ];

    if (variant === 'danger') {
      baseActions[0].label = 'Delete';
    } else if (variant === 'success') {
      baseActions[0].label = 'Continue';
    }

    return baseActions;
  }

  getSizeActions(): ModalAction[] {
    return [
      {
        id: 'close',
        label: 'Close',
        variant: 'secondary',
        closesModal: true,
      },
    ];
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  openVariantModal(variant: ModalVariant): void {
    this.openModalsSignal.update(modals => ({ ...modals, [variant]: true }));
    this.lastActionSignal.set(`Opened ${variant} variant modal`);
  }

  closeModal(variant: ModalVariant): void {
    this.openModalsSignal.update(modals => ({ ...modals, [variant]: false }));
    this.lastActionSignal.set(`Closed ${variant} variant modal`);
  }

  openSizeModal(size: ModalSize): void {
    this.openSizeModalsSignal.update(modals => ({ ...modals, [size]: true }));
    this.lastActionSignal.set(`Opened ${size} size modal`);
  }

  closeSizeModal(size: ModalSize): void {
    this.openSizeModalsSignal.update(modals => ({ ...modals, [size]: false }));
    this.lastActionSignal.set(`Closed ${size} size modal`);
  }

  handleModalAction(event: any): void {
    this.lastActionSignal.set(
      `Modal action: ${event.action} at ${new Date().toLocaleTimeString()}`,
    );
  }
}
