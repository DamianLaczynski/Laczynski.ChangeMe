import {
  Component,
  input,
  output,
  signal,
  computed,
  inject,
  DestroyRef,
  ElementRef,
  OnInit,
  OnDestroy,
  effect,
  model,
  runInInjectionContext,
  Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Modal Component
 *
 * A fully accessible modal dialog component with backdrop, keyboard navigation,
 * and focus management. Built with Angular Signals API.
 */
@Component({
  selector: 'ds-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div
        class="ds-modal-backdrop"
        [class.ds-modal-backdrop--visible]="isVisible()"
        (click)="onBackdropClick($event)"
        role="presentation"
        aria-hidden="true"
      ></div>

      <!-- Modal Container -->
      <div
        class="ds-modal-container"
        [class.ds-modal-container--visible]="isVisible()"
        [class.ds-modal-container--centered]="centered()"
        [class.ds-modal-container--fullscreen]="fullscreen()"
        role="dialog"
        [attr.aria-modal]="true"
        [attr.aria-labelledby]="titleId()"
        [attr.aria-describedby]="descriptionId()"
        tabindex="-1"
        (keydown)="onKeydown($event)"
        #modalRef
      >
        <!-- Modal Content -->
        <div class="ds-modal-content" [class]="contentClasses()">
          <!-- Header -->
          @if (showHeader()) {
            <div class="ds-modal-header">
              @if (title()) {
                <h2 [id]="titleId()" class="ds-modal-title">{{ title() }}</h2>
              }
              @if (closable()) {
                <button
                  type="button"
                  class="ds-modal-close"
                  (click)="close()"
                  [attr.aria-label]="closeAriaLabel()"
                >
                  ✕
                </button>
              }
            </div>
          }

          <!-- Body -->
          <div class="ds-modal-body" [id]="descriptionId()">
            <ng-content></ng-content>
          </div>

          <!-- Footer -->
          @if (showFooter()) {
            <div class="ds-modal-footer">
              <ng-content select="[ds-modal-footer]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `,
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);
  private readonly injector = inject(Injector);

  // =============================================================================
  // INPUT SIGNALS
  // =============================================================================

  /** Whether modal is open */
  isOpen = model<boolean>(false);

  /** Modal title */
  title = input<string>('');

  /** Whether modal is centered */
  centered = input<boolean>(true);

  /** Whether modal is fullscreen */
  fullscreen = input<boolean>(false);

  /** Whether modal is closable */
  closable = input<boolean>(true);

  /** Whether to show header */
  showHeader = input<boolean>(true);

  /** Whether to show footer */
  showFooter = input<boolean>(false);

  /** Whether to close on backdrop click */
  closeOnBackdropClick = input<boolean>(true);

  /** Whether to close on escape key */
  closeOnEscape = input<boolean>(true);

  /** Custom CSS classes */
  customClasses = input<string>('');

  /** Close button aria label */
  closeAriaLabel = input<string>('Close modal');

  // =============================================================================
  // OUTPUT SIGNALS
  // =============================================================================

  /** Modal opened event */
  opened = output<void>();

  /** Modal closed event */
  closed = output<void>();

  /** Modal backdrop clicked event */
  backdropClicked = output<void>();

  // =============================================================================
  // INTERNAL STATE
  // =============================================================================

  /** Whether modal is visible (for animations) */
  isVisible = signal<boolean>(false);

  /** Unique IDs for accessibility */
  titleId = signal<string>('');
  descriptionId = signal<string>('');

  /** Previously focused element */
  private previouslyFocusedElement: HTMLElement | null = null;

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  /** Modal content classes */
  contentClasses = computed(() => {
    const classes = ['ds-modal-content'];
    if (this.customClasses()) {
      classes.push(this.customClasses());
    }
    return classes.join(' ');
  });

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  ngOnInit(): void {
    // Generate unique IDs
    this.titleId.set(`modal-title-${Math.random().toString(36).substr(2, 9)}`);
    this.descriptionId.set(`modal-description-${Math.random().toString(36).substr(2, 9)}`);

    // Handle open/close state changes
    runInInjectionContext(this.injector, () => {
      effect(() => {
        if (this.isOpen()) {
          this.openModal();
        } else {
          this.closeModal();
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.restoreFocus();
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /** Open the modal */
  open(): void {
    this.isOpen.set(true);
  }

  /** Close the modal */
  close(): void {
    this.isOpen.set(false);
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  /** Handle backdrop click */
  onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdropClick() && event.target === event.currentTarget) {
      this.backdropClicked.emit();
      this.close();
    }
  }

  /** Handle keyboard events */
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.closeOnEscape()) {
      event.preventDefault();
      this.close();
    }
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  /** Open modal and manage focus */
  private openModal(): void {
    // Store currently focused element
    this.previouslyFocusedElement = document.activeElement as HTMLElement;

    // Show modal with animation
    setTimeout(() => {
      this.isVisible.set(true);
    }, 10);

    // Focus modal
    setTimeout(() => {
      const modalElement = this.elementRef.nativeElement.querySelector('.ds-modal-container');
      if (modalElement) {
        modalElement.focus();
      }
    }, 50);

    // Emit opened event
    this.opened.emit();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  /** Close modal and restore focus */
  private closeModal(): void {
    this.isVisible.set(false);

    // Emit closed event after animation
    setTimeout(() => {
      this.closed.emit();
      this.restoreFocus();
    }, 300);
  }

  /** Restore focus to previously focused element */
  private restoreFocus(): void {
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;
    }

    // Restore body scroll
    document.body.style.overflow = '';
  }
}
