// =============================================================================
// Modal Component
// =============================================================================
// Modern Angular Modal Dialog Component with accessibility and animations

import {
  Component,
  input,
  output,
  signal,
  computed,
  effect,
  inject,
  ElementRef,
  DestroyRef,
  ViewChild,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IconComponent } from '../shared/icon/icon.component';
import { ButtonComponent } from '../button/button.component';
import { ComponentSize, generateComponentId } from '../shared';
import {
  ModalState,
  ModalAnimation,
  ModalPosition,
  ModalOpenEvent,
  ModalCloseEvent,
  ModalBackdropClickEvent,
  ModalCloseTrigger,
  createModalState,
  getModalSizeDefinition,
  getModalAnimationDefinition,
} from './modal.model';

/**
 * Modern Angular Modal Component
 *
 * A fully accessible modal dialog component with multiple sizes, animations, and positions.
 * Supports focus trapping, keyboard navigation, and backdrop interaction.
 *
 * @example
 * ```html
 * <!-- Basic modal -->
 * <ds-modal [open]="showModal" (openChange)="showModal = $event">
 *   <h2>Modal Title</h2>
 *   <p>Modal content goes here</p>
 * </ds-modal>
 *
 * <!-- Configured modal -->
 * <ds-modal
 *   [open]="showModal"
 *   size="lg"
 *   animation="slide"
 *   position="center"
 *   [closeOnBackdrop]="false"
 *   (openChange)="handleModalToggle($event)"
 *   (modalClosed)="handleModalClosed($event)">
 *   <ng-container slot="header">
 *     <h2>Custom Header</h2>
 *   </ng-container>
 *   <ng-container slot="body">
 *     <p>Custom body content</p>
 *   </ng-container>
 *   <ng-container slot="footer">
 *     <button>Custom Footer</button>
 *   </ng-container>
 * </ds-modal>
 * ```
 */
@Component({
  selector: 'ds-modal',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  host: {
    '[class.ds-modal-host]': 'true',
    '[class.ds-modal-host--open]': 'componentState().isOpen',
    '[class.ds-modal-host--opening]': 'componentState().isOpening',
    '[class.ds-modal-host--closing]': 'componentState().isClosing',
    '[class.ds-modal-host--focus-trapped]': 'componentState().focusTrapActive',
  },
})
export class ModalComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('modalDialog', { static: false }) modalDialog!: ElementRef<HTMLElement>;
  @ViewChild('backdrop', { static: false }) backdrop!: ElementRef<HTMLDivElement>;

  // =============================================================================
  // INPUT SIGNALS
  // =============================================================================

  /** Whether modal is open */
  open = input<boolean>(false);

  /** Modal size */
  size = input<ComponentSize>('md');

  /** Modal animation type */
  animation = input<ModalAnimation>('fade');

  /** Modal position on screen */
  position = input<ModalPosition>('center');

  /** Whether to close modal on backdrop click */
  closeOnBackdrop = input<boolean>(true);

  /** Whether to close modal on escape key */
  closeOnEscape = input<boolean>(true);

  /** Whether to trap focus within modal */
  trapFocus = input<boolean>(true);

  /** Whether to restore focus when modal closes */
  restoreFocus = input<boolean>(true);

  /** Whether to show close button in header */
  showCloseButton = input<boolean>(true);

  /** ARIA label for modal */
  ariaLabel = input<string>('');

  /** ARIA labelledby reference */
  ariaLabelledby = input<string>('');

  /** ARIA describedby reference */
  ariaDescribedby = input<string>('');

  /** Modal role attribute */
  role = input<string>('dialog');

  /** Custom CSS classes */
  customClasses = input<string>('');

  /** Z-index for modal */
  zIndex = input<number>(1050);

  /** Whether modal is disabled */
  disabled = input<boolean>(false);

  // =============================================================================
  // OUTPUT SIGNALS
  // =============================================================================

  /** Fired when modal open state changes */
  openChange = output<boolean>();

  /** Fired when modal opens */
  modalOpened = output<ModalOpenEvent>();

  /** Fired when modal closes */
  modalClosed = output<ModalCloseEvent>();

  /** Fired when backdrop is clicked */
  backdropClicked = output<ModalBackdropClickEvent>();

  /** Fired when escape key is pressed */
  escapePressed = output<KeyboardEvent>();

  // =============================================================================
  // COMPONENT STATE
  // =============================================================================

  /** Unique component ID */
  readonly componentId = signal(generateComponentId('modal'));

  /** Component state */
  readonly componentState = signal<ModalState>(createModalState());

  /** Focus trap elements */
  private readonly focusableElements = signal<HTMLElement[]>([]);
  private readonly firstFocusableElement = computed(() => this.focusableElements()[0] || null);
  private readonly lastFocusableElement = computed(() => {
    const elements = this.focusableElements();
    return elements[elements.length - 1] || null;
  });

  /** Guard to prevent multiple keyboard listener setups */
  private keyboardListenersSetup = false;

  /** Guard to prevent multiple simultaneous updateOpenState calls */
  private updatingState = false;

  // =============================================================================
  // COMPUTED PROPERTIES
  // =============================================================================

  /** Computed CSS classes for modal */
  readonly computedClasses = computed(() => {
    const sizeDefinition = getModalSizeDefinition(this.size());
    const animationDefinition = getModalAnimationDefinition(this.animation());

    const classes = [
      'ds-modal',
      sizeDefinition.className,
      animationDefinition.className,
      `ds-modal--${this.position()}`,
      this.customClasses(),
    ];

    return classes.filter(Boolean).join(' ');
  });

  /** Computed backdrop classes */
  readonly backdropClasses = computed(() => {
    const animationDefinition = getModalAnimationDefinition(this.animation());

    return ['ds-modal-backdrop', animationDefinition.className].join(' ');
  });

  /** Modal style attributes */
  readonly modalStyles = computed(() => ({
    'z-index': this.zIndex().toString(),
  }));

  /** Accessibility attributes */
  readonly accessibilityAttributes = computed(() => ({
    'aria-label': this.ariaLabel() || 'Modal dialog',
    'aria-labelledby': this.ariaLabelledby() || null,
    'aria-describedby': this.ariaDescribedby() || null,
    'aria-modal': 'true',
    role: this.role(),
  }));

  /** Should show modal in DOM */
  shouldShowModal = computed(() => {
    const state = this.componentState();
    return state.isOpen || state.isClosing;
  });

  // =============================================================================
  // EFFECTS
  // =============================================================================

  constructor() {
    // Update component state when open input changes
    effect(() => {
      const isOpen = this.open();
      const currentState = this.componentState();

      if (isOpen !== currentState.isOpen) {
        // Use queueMicrotask to prevent infinite loops
        queueMicrotask(() => {
          if (isOpen !== this.componentState().isOpen) {
            this.updateOpenState(isOpen);
          }
        });
      }
    });

    // Setup keyboard listeners in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.setupKeyboardListeners();
    }
  }

  // =============================================================================
  // MODAL CONTROL METHODS
  // =============================================================================

  /**
   * Open the modal
   */
  openModal(): void {
    if (this.disabled() || this.componentState().isOpen) {
      return;
    }

    this.openChange.emit(true);
  }

  /**
   * Close the modal
   */
  closeModal(trigger: ModalCloseTrigger = 'api', data?: any): void {
    if (!this.componentState().isOpen) {
      return;
    }

    this.openChange.emit(false);

    // Emit close event
    const closeEvent: ModalCloseEvent = {
      modalId: this.componentId(),
      timestamp: Date.now(),
      trigger,
      data,
    };

    this.modalClosed.emit(closeEvent);
  }

  /**
   * Toggle modal open state
   */
  toggleModal(): void {
    if (this.componentState().isOpen) {
      this.closeModal('api');
    } else {
      this.openModal();
    }
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  /**
   * Handle backdrop click
   */
  handleBackdropClick(event: MouseEvent): void {
    if (!this.closeOnBackdrop()) {
      return;
    }

    // Ensure click was on backdrop, not modal content
    if (event.target === this.backdrop?.nativeElement) {
      const backdropEvent: ModalBackdropClickEvent = {
        event: event,
        element: this.backdrop.nativeElement,
        shouldClose: true,
        timestamp: Date.now(),
      };

      this.backdropClicked.emit(backdropEvent);

      if (backdropEvent.shouldClose) {
        this.closeModal('overlay');
      }
    }
  }

  /**
   * Handle escape key press
   */
  handleEscapeKey(event: KeyboardEvent): void {
    if (!this.closeOnEscape() || !this.componentState().isOpen) {
      return;
    }

    this.escapePressed.emit(event);
    this.closeModal('escape');
  }

  /**
   * Handle close button click
   */
  handleCloseButtonClick(): void {
    this.closeModal('button');
  }

  /**
   * Handle focus trap
   */
  handleFocusTrap(event: KeyboardEvent): void {
    if (!this.trapFocus() || !this.componentState().focusTrapActive) {
      return;
    }

    if (event.key === 'Tab') {
      const firstElement = this.firstFocusableElement();
      const lastElement = this.lastFocusableElement();

      if (event.shiftKey) {
        // Shift + Tab - moving backward
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab - moving forward
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  /**
   * Update modal open state with animation handling
   */
  private updateOpenState(isOpen: boolean): void {
    if (this.updatingState) {
      return;
    }

    this.updatingState = true;
    const currentState = this.componentState();

    if (isOpen) {
      // Store current focus element
      const activeElement = document.activeElement as HTMLElement;

      this.componentState.update(state => ({
        ...state,
        isOpen: true,
        isOpening: true,
        isClosing: false,
        previousFocusElement: activeElement,
        currentAnimation: this.animation(),
      }));

      // Emit open event
      const openEvent: ModalOpenEvent = {
        modalId: this.componentId(),
        timestamp: Date.now(),
        animation: this.animation(),
      };

      this.modalOpened.emit(openEvent);

      // Handle animation and focus after render
      setTimeout(() => {
        this.componentState.update(state => ({
          ...state,
          isOpening: false,
        }));

        this.setupFocusTrap();
        this.focusModal();
        this.updatingState = false;
      }, 50);
    } else {
      // Start closing animation
      this.componentState.update(state => ({
        ...state,
        isClosing: true,
        isOpening: false,
      }));

      // Complete close after animation
      const animationDuration = getModalAnimationDefinition(this.animation()).duration;

      setTimeout(
        () => {
          this.componentState.update(state => ({
            ...state,
            isOpen: false,
            isClosing: false,
            focusTrapActive: false,
            currentAnimation: null,
          }));

          this.restorePreviousFocus();
          this.updatingState = false;
        },
        Math.max(animationDuration, 10),
      ); // Minimum 10ms delay even for 'none' animation
    }
  }

  /**
   * Setup focus trap for modal
   */
  private setupFocusTrap(): void {
    if (!this.trapFocus() || !this.modalDialog?.nativeElement) {
      return;
    }

    try {
      const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ');

      const elements = Array.from(
        this.modalDialog.nativeElement.querySelectorAll(focusableSelectors),
      ) as HTMLElement[];

      this.focusableElements.set(elements);

      this.componentState.update(state => ({
        ...state,
        focusTrapActive: true,
      }));
    } catch (error) {
      console.warn('Error setting up focus trap:', error);
    }
  }

  /**
   * Focus the modal when it opens
   */
  private focusModal(): void {
    if (!this.modalDialog?.nativeElement) {
      return;
    }

    try {
      const firstFocusable = this.firstFocusableElement();
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        this.modalDialog.nativeElement.focus();
      }
    } catch (error) {
      console.warn('Error focusing modal:', error);
    }
  }

  /**
   * Restore focus to previously focused element
   */
  private restorePreviousFocus(): void {
    if (!this.restoreFocus()) {
      return;
    }

    try {
      const previousElement = this.componentState().previousFocusElement;
      if (previousElement && document.contains(previousElement)) {
        previousElement.focus();
      }
    } catch (error) {
      console.warn('Error restoring focus:', error);
    }
  }

  /**
   * Setup keyboard event listeners
   */
  private setupKeyboardListeners(): void {
    if (!isPlatformBrowser(this.platformId) || this.keyboardListenersSetup) {
      return;
    }

    this.keyboardListenersSetup = true;

    const keydown$ = fromEvent<KeyboardEvent>(document, 'keydown');

    // Escape key handler
    keydown$
      .pipe(
        filter(event => event.key === 'Escape'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(event => this.handleEscapeKey(event));

    // Focus trap handler
    keydown$
      .pipe(
        filter(event => event.key === 'Tab'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(event => this.handleFocusTrap(event));
  }

  // =============================================================================
  // PUBLIC API METHODS
  // =============================================================================

  /**
   * Get current component state
   */
  getState(): ModalState {
    return { ...this.componentState() };
  }

  /**
   * Get focusable elements within modal
   */
  getFocusableElements(): HTMLElement[] {
    return [...this.focusableElements()];
  }

  /**
   * Check if modal is currently animating
   */
  isAnimating(): boolean {
    const state = this.componentState();
    return state.isOpening || state.isClosing;
  }
}
