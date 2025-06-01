import {
  Component,
  input,
  output,
  signal,
  computed,
  effect,
  inject,
  DestroyRef,
  ElementRef,
  viewChild,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

import { ButtonComponent } from '../../ui/button';
import {
  ModalSize,
  ModalVariant,
  ModalAnimation,
  ModalCloseTrigger,
  ModalOpenEvent,
  ModalCloseEvent,
  ModalBeforeCloseEvent,
  ModalAction,
  ModalState,
  generateModalId,
  getModalVariantDefinition,
  getModalSizeDefinition,
  ModalActionEvent,
} from './modal.model';

// =============================================================================
// MODAL COMPONENT CONFIGURATION
// =============================================================================

export interface ModalComponentConfig {
  size?: ModalSize;
  variant?: ModalVariant;
  animation?: ModalAnimation;
  title?: string;
  showCloseButton?: boolean;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  actions?: ModalAction[];
  autoFocus?: boolean;
  trapFocus?: boolean;
  restoreFocus?: boolean;
}

/**
 * Modal Component
 *
 * A versatile modal dialog component with multiple variants, sizes, animations,
 * and accessibility features. Can be used directly in templates or via ModalService.
 */
@Component({
  selector: 'ds-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="ds-modal-host"
      [class.open]="isOpen()"
      [attr.aria-hidden]="!isOpen()"
      [attr.role]="isOpen() ? 'dialog' : null"
      [attr.aria-modal]="isOpen() ? 'true' : null"
      [attr.aria-labelledby]="titleId"
    >
      @if (isOpen()) {
        <div
          class="ds-modal-overlay"
          [class.closing]="isClosing()"
          [attr.data-animation]="animation()"
          (click)="onOverlayClick($event)"
        >
          <div
            class="ds-modal-container"
            [class]="containerClasses()"
            [class.closing]="isClosing()"
            (click)="$event.stopPropagation()"
            #modalContainer
          >
            <!-- Header -->
            @if (title() || showCloseButton()) {
              <div class="ds-modal-header">
                @if (title()) {
                  <h2 class="ds-modal-title" [id]="titleId">
                    {{ title() }}
                  </h2>
                }

                @if (showCloseButton()) {
                  <ds-button
                    variant="ghost"
                    size="sm"
                    class="ds-modal-close"
                    [ariaLabel]="'Close modal'"
                    (clicked)="close('close-button')"
                  >
                    ✕
                  </ds-button>
                }
              </div>
            }

            <!-- Body -->
            <div class="ds-modal-body">
              <ng-content></ng-content>
            </div>

            <!-- Footer with Actions -->
            @if (actions() && actions().length > 0) {
              <div class="ds-modal-footer">
                <div class="ds-modal-actions">
                  @for (action of actions(); track action.id) {
                    <ds-button
                      [variant]="action.variant || 'secondary'"
                      [size]="action.size || 'md'"
                      [disabled]="action.disabled || false"
                      [loading]="action.loading || false"
                      class="ds-modal-action"
                      (clicked)="onActionClick(action)"
                    >
                      {{ action.label }}
                    </ds-button>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './modal.component.scss',
  host: {
    '[class.ds-modal]': 'true',
  },
})
export class ModalComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);

  // =============================================================================
  // TEMPLATE REFERENCES
  // =============================================================================

  private readonly modalContainer = viewChild<ElementRef<HTMLDivElement>>('modalContainer');

  // =============================================================================
  // INPUTS (for template usage)
  // =============================================================================

  readonly size = input<ModalSize>('md');
  readonly variant = input<ModalVariant>('default');
  readonly animation = input<ModalAnimation>('fade');
  readonly title = input<string>('');
  readonly isOpenInput = input<boolean>(false, { alias: 'isOpen' });
  readonly showCloseButton = input<boolean>(true);
  readonly closeOnOverlay = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);
  readonly actions = input<ModalAction[]>([]);
  readonly autoFocus = input<boolean>(true);
  readonly trapFocus = input<boolean>(true);
  readonly restoreFocus = input<boolean>(true);

  // =============================================================================
  // OUTPUTS
  // =============================================================================

  readonly opened = output<ModalOpenEvent>();
  readonly closed = output<ModalCloseEvent>();
  readonly beforeClose = output<ModalBeforeCloseEvent>();
  readonly actionClicked = output<ModalActionEvent>();

  // =============================================================================
  // INTERNAL STATE
  // =============================================================================

  readonly isOpen = signal<boolean>(false);
  readonly isClosing = signal<boolean>(false);

  // Configuration for service usage
  private configSignal = signal<ModalComponentConfig>({});

  // =============================================================================
  // COMPUTED PROPERTIES
  // =============================================================================

  readonly config = computed(() => this.configSignal());

  // Get effective values (config from service takes precedence over inputs)
  readonly effectiveSize = computed(() => this.config().size || this.size());
  readonly effectiveVariant = computed(() => this.config().variant || this.variant());
  readonly effectiveAnimation = computed(() => this.config().animation || this.animation());
  readonly effectiveTitle = computed(() => this.config().title || this.title());
  readonly effectiveShowCloseButton = computed(() =>
    this.config().showCloseButton !== undefined
      ? this.config().showCloseButton!
      : this.showCloseButton(),
  );
  readonly effectiveCloseOnOverlay = computed(() =>
    this.config().closeOnOverlay !== undefined
      ? this.config().closeOnOverlay!
      : this.closeOnOverlay(),
  );
  readonly effectiveCloseOnEscape = computed(() =>
    this.config().closeOnEscape !== undefined ? this.config().closeOnEscape! : this.closeOnEscape(),
  );
  readonly effectiveActions = computed(() => this.config().actions || this.actions());

  readonly containerClasses = computed(() => {
    return [`ds-modal--${this.effectiveSize()}`, `ds-modal--${this.effectiveVariant()}`].join(' ');
  });

  readonly titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`;

  // =============================================================================
  // LIFECYCLE & SETUP
  // =============================================================================

  private previouslyFocusedElement: HTMLElement | null = null;
  private isServiceMode = false;

  constructor() {
    // Watch for input changes when used in template mode
    effect(() => {
      if (!this.isServiceMode) {
        this.isOpen.set(this.isOpenInput());
      }
    });

    // Handle opening/closing effects
    effect(() => {
      if (this.isOpen()) {
        this.handleModalOpen();
      }
    });
  }

  ngOnInit(): void {
    // Auto-detect if this is service mode (no template bindings)
    this.isServiceMode = !this.isOpenInput();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // =============================================================================
  // SERVICE INTERFACE
  // =============================================================================

  /**
   * Configure modal for service usage
   */
  configure(config: ModalComponentConfig): void {
    this.isServiceMode = true;
    this.configSignal.set(config);
  }

  /**
   * Open modal programmatically
   */
  open(): void {
    this.isOpen.set(true);
  }

  /**
   * Get current configuration (for service usage)
   */
  getConfig(): ModalComponentConfig {
    return this.config();
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) return;

    if (event.key === 'Escape' && this.effectiveCloseOnEscape()) {
      event.preventDefault();
      this.close('escape');
    }

    if (event.key === 'Tab' && this.trapFocus()) {
      this.handleTabKey(event);
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if (this.effectiveCloseOnOverlay()) {
      this.close('overlay');
    }
  }

  onActionClick(action: ModalAction): void {
    const actionEvent: ModalActionEvent = {
      action: action.id,
      data: action.data,
      originalEvent: new Event('click'),
    };

    this.actionClicked.emit(actionEvent);

    if (action.closesModal) {
      this.close('action');
    }
  }

  close(trigger: ModalCloseTrigger): void {
    const beforeCloseEvent: ModalBeforeCloseEvent = {
      trigger,
      preventDefault: () => {
        beforeCloseEvent.defaultPrevented = true;
      },
      defaultPrevented: false,
    };

    this.beforeClose.emit(beforeCloseEvent);

    if (beforeCloseEvent.defaultPrevented) {
      return;
    }

    this.isClosing.set(true);

    // Wait for animation
    setTimeout(() => {
      this.isOpen.set(false);
      this.isClosing.set(false);

      const closeEvent: ModalCloseEvent = {
        trigger,
        timestamp: Date.now(),
      };

      this.closed.emit(closeEvent);
      this.cleanup();
    }, 300);
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  private handleModalOpen(): void {
    this.storePreviouslyFocusedElement();
    this.trapFocusIfEnabled();

    const openEvent: ModalOpenEvent = {
      timestamp: Date.now(),
    };

    this.opened.emit(openEvent);
  }

  private storePreviouslyFocusedElement(): void {
    if (this.restoreFocus()) {
      this.previouslyFocusedElement = document.activeElement as HTMLElement;
    }
  }

  private trapFocusIfEnabled(): void {
    if (this.autoFocus()) {
      setTimeout(() => {
        this.focusFirstElement();
      }, 100);
    }
  }

  private focusFirstElement(): void {
    const modalElement = this.elementRef.nativeElement;
    const focusableElement = modalElement.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ) as HTMLElement;

    if (focusableElement) {
      focusableElement.focus();
    }
  }

  private handleTabKey(event: KeyboardEvent): void {
    const modalElement = this.elementRef.nativeElement;
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }

  private cleanup(): void {
    if (this.restoreFocus() && this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;
    }
  }
}
