import {
  Component,
  input,
  output,
  computed,
  signal,
  viewChild,
  inject,
  DestroyRef,
  OnInit,
  effect,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  generateComponentId,
  mergeClasses,
} from '../shared';

import { IconComponent } from '../shared/icon/icon.component';

import {
  ScrollPanelSize,
  ScrollPanelState,
  ScrollDirection,
  ScrollBehavior,
  ScrollPosition,
  ScrollDimensions,
  ScrollEvent,
  ScrollEndEvent,
  ScrollEdgeEvent,
  createScrollPanelConfig,
  calculateScrollPosition,
  calculateScrollDimensions,
  getScrollDirection,
  canScroll,
  scrollToPosition,
  scrollByOffset,
  getScrollPanelAriaAttributes,
  SCROLLPANEL_SIZE_CONFIG,
  SCROLL_DIRECTION_CONFIG,
} from './scrollpanel.model';

/**
 * ScrollPanel Component
 *
 * Modern scroll panel component with custom scrollbars, scroll tracking,
 * and accessibility features. Follows Angular Signals API patterns.
 */
@Component({
  selector: 'ds-scrollpanel',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div
      class="ds-scrollpanel-container"
      [class]="containerClasses()"
      [attr.data-size]="size()"
      [attr.data-state]="state()"
    >
      <!-- Scroll Indicators -->
      @if (showScrollIndicators()) {
        <div class="ds-scrollpanel-indicators" [attr.inert]="state() === 'disabled'">
          @if (scrollPosition().scrollPercentageY > 0 && scrollDirection() !== 'horizontal') {
            <div
              class="ds-scrollpanel-indicator ds-scrollpanel-indicator--vertical"
              [style.height.%]="scrollPosition().scrollPercentageY"
            ></div>
          }
          @if (scrollPosition().scrollPercentageX > 0 && scrollDirection() !== 'vertical') {
            <div
              class="ds-scrollpanel-indicator ds-scrollpanel-indicator--horizontal"
              [style.width.%]="scrollPosition().scrollPercentageX"
            ></div>
          }
        </div>
      }

      <!-- Loading Overlay -->
      @if (state() === 'loading') {
        <div class="ds-scrollpanel-loading" [attr.inert]="true">
          <app-icon name="cog" size="md" class="ds-scrollpanel-loading-icon"></app-icon>
          <span class="ds-scrollpanel-loading-text">{{ loadingText() }}</span>
        </div>
      }

      <!-- Error Overlay -->
      @if (state() === 'error') {
        <div class="ds-scrollpanel-error" [attr.inert]="true">
          <app-icon
            name="exclamation-triangle"
            size="md"
            class="ds-scrollpanel-error-icon"
          ></app-icon>
          <span class="ds-scrollpanel-error-text">{{ errorText() }}</span>
        </div>
      }

      <!-- Main Scrollable Area -->
      <div
        #scrollableElement
        class="ds-scrollpanel-content"
        [class]="contentClasses()"
        [style]="contentStyles()"
        [attr.tabindex]="computedTabIndex()"
        [attr.role]="accessibilityAttributes()['role']"
        [attr.aria-label]="accessibilityAttributes()['aria-label']"
        [attr.aria-describedby]="accessibilityAttributes()['aria-describedby']"
        [attr.aria-disabled]="accessibilityAttributes()['aria-disabled']"
        [attr.aria-valuetext]="accessibilityAttributes()['aria-valuetext']"
        (scroll)="onScroll($event)"
        (keydown)="onKeyDown($event)"
        (focus)="onFocus($event)"
        (blur)="onBlur($event)"
      >
        <ng-content></ng-content>
      </div>

      <!-- Custom Scrollbars -->
      @if (customScrollbar() && showScrollbars()) {
        <!-- Vertical Scrollbar -->
        @if (scrollDimensions().overflowY && scrollDirection() !== 'horizontal') {
          <div
            class="ds-scrollpanel-scrollbar ds-scrollpanel-scrollbar--vertical"
            [class.auto-hide]="autoHideScrollbars()"
            [attr.inert]="state() === 'disabled'"
          >
            <div
              class="ds-scrollpanel-scrollbar-thumb"
              [style.height.%]="verticalThumbHeight()"
              [style.top.%]="verticalThumbPosition()"
              (mousedown)="startVerticalDrag($event)"
            ></div>
          </div>
        }

        <!-- Horizontal Scrollbar -->
        @if (scrollDimensions().overflowX && scrollDirection() !== 'vertical') {
          <div
            class="ds-scrollpanel-scrollbar ds-scrollpanel-scrollbar--horizontal"
            [class.auto-hide]="autoHideScrollbars()"
            [attr.inert]="state() === 'disabled'"
          >
            <div
              class="ds-scrollpanel-scrollbar-thumb"
              [style.width.%]="horizontalThumbWidth()"
              [style.left.%]="horizontalThumbPosition()"
              (mousedown)="startHorizontalDrag($event)"
            ></div>
          </div>
        }
      }
    </div>
  `,
  styleUrls: ['./scrollpanel.component.scss'],
  host: {
    '[attr.data-component]': '"ds-scrollpanel"',
    '[class.ds-scrollpanel]': 'true',
  },
})
export class ScrollPanelComponent implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);

  // =============================================================================
  // INPUT SIGNALS
  // =============================================================================

  /** ScrollPanel size */
  size = input<ScrollPanelSize>('md');

  /** ScrollPanel state */
  state = input<ScrollPanelState>('default');

  /** Scroll direction support */
  scrollDirection = input<ScrollDirection>('both');

  /** Whether to show scrollbars */
  showScrollbars = input<boolean>(true);

  /** Whether scrollbars should auto-hide */
  autoHideScrollbars = input<boolean>(false);

  /** Custom scrollbar styling */
  customScrollbar = input<boolean>(true);

  /** Whether to enable smooth scrolling */
  smoothScrolling = input<boolean>(true);

  /** Whether to show scroll indicators */
  showScrollIndicators = input<boolean>(false);

  /** Loading text to display */
  loadingText = input<string>('Loading...');

  /** Error text to display */
  errorText = input<string>('An error occurred');

  /** Custom CSS classes */
  customClasses = input<string>('');

  /** Maximum height constraint */
  maxHeight = input<string | null>(null);

  /** Maximum width constraint */
  maxWidth = input<string | null>(null);

  /** ARIA label */
  ariaLabel = input<string>('');

  /** ARIA described by */
  ariaDescribedBy = input<string>('');

  /** Tab index for keyboard navigation */
  tabIndex = input<number | null>(null);

  // =============================================================================
  // OUTPUT SIGNALS
  // =============================================================================

  /** Emitted when scroll position changes */
  scrollChange = output<ScrollEvent>();

  /** Emitted when scrolling stops */
  scrollEnd = output<ScrollEndEvent>();

  /** Emitted when reaching scroll edges */
  edgeReached = output<ScrollEdgeEvent>();

  /** Emitted when focus changes */
  focusChange = output<{ focused: boolean; element: HTMLElement }>();

  // =============================================================================
  // VIEW CHILD REFERENCES
  // =============================================================================

  private scrollableElement = viewChild.required<ElementRef<HTMLDivElement>>('scrollableElement');

  // =============================================================================
  // STATE SIGNALS
  // =============================================================================

  componentId = signal(generateComponentId('ds-scrollpanel'));

  /** Current scroll position */
  scrollPosition = signal<ScrollPosition>({
    scrollLeft: 0,
    scrollTop: 0,
    scrollPercentageX: 0,
    scrollPercentageY: 0,
    atTop: true,
    atBottom: false,
    atLeft: true,
    atRight: false,
  });

  /** Current scroll dimensions */
  scrollDimensions = signal<ScrollDimensions>({
    containerWidth: 0,
    containerHeight: 0,
    contentWidth: 0,
    contentHeight: 0,
    overflowX: false,
    overflowY: false,
  });

  /** Whether component is focused */
  isFocused = signal<boolean>(false);

  /** Whether user is currently dragging scrollbar */
  isDragging = signal<boolean>(false);

  /** Previous scroll position (for direction calculation) */
  private previousScrollPosition = signal<ScrollPosition | null>(null);

  /** Scroll end timeout */
  private scrollEndTimeout: number | null = null;

  // =============================================================================
  // COMPUTED SIGNALS
  // =============================================================================

  /** Component configuration */
  config = computed(() =>
    createScrollPanelConfig({
      size: this.size(),
      state: this.state(),
      scrollDirection: this.scrollDirection(),
      showScrollbars: this.showScrollbars(),
      autoHideScrollbars: this.autoHideScrollbars(),
      customScrollbar: this.customScrollbar(),
      smoothScrolling: this.smoothScrolling(),
      showScrollIndicators: this.showScrollIndicators(),
    }),
  );

  /** Container CSS classes */
  containerClasses = computed(() =>
    mergeClasses(
      'ds-scrollpanel',
      `ds-scrollpanel--${this.size()}`,
      `ds-scrollpanel--${this.state()}`,
      `ds-scrollpanel--scroll-${this.scrollDirection()}`,
      this.customScrollbar() ? 'ds-scrollpanel--custom-scrollbar' : '',
      this.autoHideScrollbars() ? 'ds-scrollpanel--auto-hide' : '',
      this.isFocused() ? 'ds-scrollpanel--focused' : '',
      this.isDragging() ? 'ds-scrollpanel--dragging' : '',
      this.customClasses(),
    ),
  );

  /** Content CSS classes */
  contentClasses = computed(() =>
    mergeClasses(
      'ds-scrollpanel-content',
      `ds-scrollpanel-content--${this.scrollDirection()}`,
      this.smoothScrolling() ? 'ds-scrollpanel-content--smooth' : '',
    ),
  );

  /** Content styles */
  contentStyles = computed(() => {
    const styles: Record<string, string> = {};
    const config = SCROLL_DIRECTION_CONFIG[this.scrollDirection()];

    styles['overflow-x'] = config.overflowX;
    styles['overflow-y'] = config.overflowY;

    if (this.maxHeight()) {
      styles['max-height'] = this.maxHeight()!;
    } else {
      const sizeConfig = SCROLLPANEL_SIZE_CONFIG[this.size()];
      styles['max-height'] = sizeConfig.maxHeight;
    }

    if (this.maxWidth()) {
      styles['max-width'] = this.maxWidth()!;
    }

    return styles;
  });

  /** Computed tab index */
  computedTabIndex = computed(() => {
    if (this.state() === 'disabled') return -1;
    return this.tabIndex() ?? 0;
  });

  /** Vertical scrollbar thumb height percentage */
  verticalThumbHeight = computed(() => {
    const dimensions = this.scrollDimensions();
    if (!dimensions.overflowY) return 0;
    return Math.max((dimensions.containerHeight / dimensions.contentHeight) * 100, 10);
  });

  /** Vertical scrollbar thumb position percentage */
  verticalThumbPosition = computed(() => {
    const position = this.scrollPosition();
    return (position.scrollPercentageY * (100 - this.verticalThumbHeight())) / 100;
  });

  /** Horizontal scrollbar thumb width percentage */
  horizontalThumbWidth = computed(() => {
    const dimensions = this.scrollDimensions();
    if (!dimensions.overflowX) return 0;
    return Math.max((dimensions.containerWidth / dimensions.contentWidth) * 100, 10);
  });

  /** Horizontal scrollbar thumb position percentage */
  horizontalThumbPosition = computed(() => {
    const position = this.scrollPosition();
    return (position.scrollPercentageX * (100 - this.horizontalThumbWidth())) / 100;
  });

  /** Accessibility attributes */
  accessibilityAttributes = computed(() => {
    const describedBy = this.ariaDescribedBy() ? [this.ariaDescribedBy()] : [];

    return getScrollPanelAriaAttributes(this.config(), this.scrollPosition(), describedBy);
  });

  // =============================================================================
  // LIFECYCLE HOOKS
  // =============================================================================

  constructor() {
    // Update dimensions when configuration changes
    effect(() => {
      this.config();
      this.updateDimensions();
    });

    // Set up scroll end detection
    effect(() => {
      this.scrollPosition();
      this.detectScrollEnd();
    });
  }

  ngOnInit(): void {
    this.setupEventListeners();
  }

  ngAfterViewInit(): void {
    this.updateDimensions();
    this.updateScrollPosition();
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  onScroll(event: Event): void {
    if (this.state() === 'disabled') return;

    const element = event.target as HTMLElement;
    this.updateScrollPosition();
    this.updateDimensions();
    this.emitScrollEvent(event);
    this.checkScrollEdges();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.state() === 'disabled') return;

    const element = this.scrollableElement().nativeElement;
    const { key, ctrlKey, shiftKey } = event;

    let handled = false;

    switch (key) {
      case 'ArrowUp':
        if (this.scrollDirection() !== 'horizontal') {
          scrollByOffset(element, 0, -40, this.smoothScrolling() ? 'smooth' : 'auto');
          handled = true;
        }
        break;
      case 'ArrowDown':
        if (this.scrollDirection() !== 'horizontal') {
          scrollByOffset(element, 0, 40, this.smoothScrolling() ? 'smooth' : 'auto');
          handled = true;
        }
        break;
      case 'ArrowLeft':
        if (this.scrollDirection() !== 'vertical') {
          scrollByOffset(element, -40, 0, this.smoothScrolling() ? 'smooth' : 'auto');
          handled = true;
        }
        break;
      case 'ArrowRight':
        if (this.scrollDirection() !== 'vertical') {
          scrollByOffset(element, 40, 0, this.smoothScrolling() ? 'smooth' : 'auto');
          handled = true;
        }
        break;
      case 'Home':
        if (ctrlKey) {
          this.scrollToTop();
        } else if (this.scrollDirection() !== 'vertical') {
          this.scrollToLeft();
        }
        handled = true;
        break;
      case 'End':
        if (ctrlKey) {
          this.scrollToBottom();
        } else if (this.scrollDirection() !== 'vertical') {
          this.scrollToRight();
        }
        handled = true;
        break;
      case 'PageUp':
        if (this.scrollDirection() !== 'horizontal') {
          const scrollAmount = element.clientHeight * 0.8;
          scrollByOffset(element, 0, -scrollAmount, this.smoothScrolling() ? 'smooth' : 'auto');
          handled = true;
        }
        break;
      case 'PageDown':
        if (this.scrollDirection() !== 'horizontal') {
          const scrollAmount = element.clientHeight * 0.8;
          scrollByOffset(element, 0, scrollAmount, this.smoothScrolling() ? 'smooth' : 'auto');
          handled = true;
        }
        break;
    }

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onFocus(event: FocusEvent): void {
    this.isFocused.set(true);
    this.focusChange.emit({ focused: true, element: event.target as HTMLElement });
  }

  onBlur(event: FocusEvent): void {
    this.isFocused.set(false);
    this.focusChange.emit({ focused: false, element: event.target as HTMLElement });
  }

  // =============================================================================
  // SCROLLBAR DRAG HANDLERS
  // =============================================================================

  startVerticalDrag(event: MouseEvent): void {
    if (this.state() === 'disabled') return;

    event.preventDefault();
    this.isDragging.set(true);

    const startY = event.clientY;
    const element = this.scrollableElement().nativeElement;
    const startScrollTop = element.scrollTop;
    const maxScroll = element.scrollHeight - element.clientHeight;
    const containerHeight = element.clientHeight;

    const mouseMoveHandler = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const scrollDelta = (deltaY / containerHeight) * maxScroll;
      element.scrollTop = Math.max(0, Math.min(maxScroll, startScrollTop + scrollDelta));
    };

    const mouseUpHandler = () => {
      this.isDragging.set(false);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }

  startHorizontalDrag(event: MouseEvent): void {
    if (this.state() === 'disabled') return;

    event.preventDefault();
    this.isDragging.set(true);

    const startX = event.clientX;
    const element = this.scrollableElement().nativeElement;
    const startScrollLeft = element.scrollLeft;
    const maxScroll = element.scrollWidth - element.clientWidth;
    const containerWidth = element.clientWidth;

    const mouseMoveHandler = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const scrollDelta = (deltaX / containerWidth) * maxScroll;
      element.scrollLeft = Math.max(0, Math.min(maxScroll, startScrollLeft + scrollDelta));
    };

    const mouseUpHandler = () => {
      this.isDragging.set(false);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }

  // =============================================================================
  // PUBLIC API METHODS
  // =============================================================================

  /** Scroll to top */
  scrollToTop(): void {
    const element = this.scrollableElement().nativeElement;
    scrollToPosition(element, element.scrollLeft, 0, this.smoothScrolling() ? 'smooth' : 'auto');
  }

  /** Scroll to bottom */
  scrollToBottom(): void {
    const element = this.scrollableElement().nativeElement;
    const maxScrollTop = element.scrollHeight - element.clientHeight;
    scrollToPosition(
      element,
      element.scrollLeft,
      maxScrollTop,
      this.smoothScrolling() ? 'smooth' : 'auto',
    );
  }

  /** Scroll to left */
  scrollToLeft(): void {
    const element = this.scrollableElement().nativeElement;
    scrollToPosition(element, 0, element.scrollTop, this.smoothScrolling() ? 'smooth' : 'auto');
  }

  /** Scroll to right */
  scrollToRight(): void {
    const element = this.scrollableElement().nativeElement;
    const maxScrollLeft = element.scrollWidth - element.clientWidth;
    scrollToPosition(
      element,
      maxScrollLeft,
      element.scrollTop,
      this.smoothScrolling() ? 'smooth' : 'auto',
    );
  }

  /** Scroll to specific position */
  scrollTo(x: number, y: number, behavior: ScrollBehavior = 'smooth'): void {
    const element = this.scrollableElement().nativeElement;
    scrollToPosition(element, x, y, behavior);
  }

  /** Scroll by offset */
  scrollBy(deltaX: number, deltaY: number, behavior: ScrollBehavior = 'smooth'): void {
    const element = this.scrollableElement().nativeElement;
    scrollByOffset(element, deltaX, deltaY, behavior);
  }

  /** Focus the scrollable area */
  focus(): void {
    this.scrollableElement().nativeElement.focus();
  }

  /** Get current scroll position */
  getScrollPosition(): ScrollPosition {
    return this.scrollPosition();
  }

  /** Get scroll dimensions */
  getScrollDimensions(): ScrollDimensions {
    return this.scrollDimensions();
  }

  /** Check if can scroll in direction */
  canScrollInDirection(direction: 'up' | 'down' | 'left' | 'right'): boolean {
    return canScroll(this.scrollableElement().nativeElement, direction);
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  private setupEventListeners(): void {
    const element = this.scrollableElement().nativeElement;

    // Resize observer for dimension updates
    const resizeObserver = new ResizeObserver(() => {
      this.updateDimensions();
    });
    resizeObserver.observe(element);

    // Cleanup on destroy
    this.destroyRef.onDestroy(() => {
      resizeObserver.disconnect();
      if (this.scrollEndTimeout) {
        clearTimeout(this.scrollEndTimeout);
      }
    });
  }

  private updateScrollPosition(): void {
    const element = this.scrollableElement().nativeElement;
    const position = calculateScrollPosition(element);

    this.previousScrollPosition.set(this.scrollPosition());
    this.scrollPosition.set(position);
  }

  private updateDimensions(): void {
    const element = this.scrollableElement().nativeElement;
    const dimensions = calculateScrollDimensions(element);
    this.scrollDimensions.set(dimensions);
  }

  private emitScrollEvent(originalEvent: Event): void {
    const current = this.scrollPosition();
    const previous = this.previousScrollPosition();
    const direction = previous ? getScrollDirection(previous, current) : null;

    const scrollEvent: ScrollEvent = {
      position: current,
      dimensions: this.scrollDimensions(),
      element: this.scrollableElement().nativeElement,
      originalEvent,
      direction,
    };

    this.scrollChange.emit(scrollEvent);
  }

  private detectScrollEnd(): void {
    if (this.scrollEndTimeout) {
      clearTimeout(this.scrollEndTimeout);
    }

    const startTime = Date.now();

    this.scrollEndTimeout = window.setTimeout(() => {
      const endEvent: ScrollEndEvent = {
        position: this.scrollPosition(),
        element: this.scrollableElement().nativeElement,
        duration: Date.now() - startTime,
      };

      this.scrollEnd.emit(endEvent);
    }, 150);
  }

  private checkScrollEdges(): void {
    const position = this.scrollPosition();
    const previous = this.previousScrollPosition();

    if (!previous) return;

    // Check if we've reached any edges
    const edges: Array<'top' | 'bottom' | 'left' | 'right'> = [];

    if (position.atTop && !previous.atTop) edges.push('top');
    if (position.atBottom && !previous.atBottom) edges.push('bottom');
    if (position.atLeft && !previous.atLeft) edges.push('left');
    if (position.atRight && !previous.atRight) edges.push('right');

    edges.forEach(edge => {
      const edgeEvent: ScrollEdgeEvent = {
        edge,
        position,
        element: this.scrollableElement().nativeElement,
      };

      this.edgeReached.emit(edgeEvent);
    });
  }
}
