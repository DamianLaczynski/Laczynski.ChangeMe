import {
  Component,
  computed,
  input,
  output,
  signal,
  DestroyRef,
  inject,
  ElementRef,
  viewChildren,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconComponent, IconName, IconSize } from '../shared/icon/icon.component';

import { ComponentSize, ComponentVariant, generateComponentId, mergeClasses } from '../shared';

import {
  AccordionItem,
  AccordionMode,
  AccordionItemExpandEvent,
  AccordionFocusEvent,
  AccordionState,
  createAccordionState,
  validateAccordionItem,
  getAccordionSizeDefinition,
  getAccordionVariantDefinition,
} from './accordion.model';

/**
 * Modern Angular Accordion Component
 *
 * A fully accessible accordion component supporting single and multiple expansion modes.
 * Features smooth animations, keyboard navigation, and comprehensive ARIA support.
 *
 * @example
 * ```html
 * <!-- Basic accordion -->
 * <ds-accordion [items]="accordionItems"></ds-accordion>
 *
 * <!-- Multiple expansion mode -->
 * <ds-accordion [items]="items" mode="multiple" variant="primary" size="lg">
 * </ds-accordion>
 *
 * <!-- With custom event handling -->
 * <ds-accordion
 *   [items]="items"
 *   (itemExpanded)="handleItemExpand($event)"
 *   (focused)="handleFocus($event)">
 * </ds-accordion>
 * ```
 */
@Component({
  selector: 'ds-accordion',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div
      [id]="componentId()"
      [class]="computedClasses()"
      [attr.aria-label]="ariaLabel() || 'Accordion'"
      [attr.role]="'region'"
      (keydown)="handleKeyDown($event)"
    >
      @for (item of validatedItems(); track trackByFn($index, item); let i = $index) {
        <div
          class="ds-accordion__item"
          [class.ds-accordion__item--expanded]="isItemExpanded(i)"
          [class.ds-accordion__item--disabled]="item.disabled"
          [attr.data-index]="i"
        >
          <!-- Accordion Header -->
          <button
            #headerRef
            type="button"
            class="ds-accordion__header"
            [id]="getItemHeaderId(i)"
            [class.ds-accordion__header--expanded]="isItemExpanded(i)"
            [disabled]="item.disabled"
            [attr.aria-expanded]="isItemExpanded(i)"
            [attr.aria-controls]="getItemContentId(i)"
            [attr.aria-label]="item.ariaLabel || item.title"
            [attr.tabindex]="getHeaderTabIndex(i)"
            (click)="toggleItem(i, $event)"
            (focus)="handleHeaderFocus(i, $event)"
            (blur)="handleHeaderBlur(i, $event)"
          >
            <!-- Custom Icon or Default Expansion Icon -->
            @if (showIcons()) {
              <app-icon
                [name]="getItemIcon(item, i)"
                [size]="getIconSize()"
                class="ds-accordion__icon"
                [class.ds-accordion__icon--expanded]="isItemExpanded(i)"
                [decorative]="true"
              >
              </app-icon>
            }

            <!-- Header Title -->
            <span class="ds-accordion__title">
              {{ item.title }}
            </span>

            <!-- Loading Spinner (if item is loading) -->
            @if (isItemLoading(i)) {
              <span class="ds-accordion__spinner" aria-hidden="true" role="status">
                <span class="ds-accordion__spinner-icon"></span>
              </span>
            }
          </button>

          <!-- Accordion Content -->
          <div
            [id]="getItemContentId(i)"
            class="ds-accordion__content"
            [class.ds-accordion__content--expanded]="isItemExpanded(i)"
            [class.ds-accordion__content--collapsed]="!isItemExpanded(i)"
            [attr.aria-labelledby]="getItemHeaderId(i)"
            [attr.role]="'region'"
            [attr.aria-hidden]="!isItemExpanded(i)"
            [attr.inert]="!isItemExpanded(i) ? '' : null"
          >
            <div class="ds-accordion__content-inner">
              <div [innerHTML]="item.content"></div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './accordion.component.scss',
  host: {
    '[class.ds-accordion-host]': 'true',
    '[class.ds-accordion-host--single]': 'mode() === "single"',
    '[class.ds-accordion-host--multiple]': 'mode() === "multiple"',
    '[class.ds-accordion-host--animated]': 'animated()',
    '[class.ds-accordion-host--disabled]': 'disabled()',
  },
})
export class AccordionComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);

  // =============================================================================
  // INPUT SIGNALS
  // =============================================================================

  /** Array of accordion items */
  items = input.required<AccordionItem[]>();

  /** Accordion expansion mode */
  mode = input<AccordionMode>('single');

  /** Component variant */
  variant = input<ComponentVariant>('primary');

  /** Component size */
  size = input<ComponentSize>('md');

  /** Whether accordion is disabled */
  disabled = input<boolean>(false);

  /** Whether to animate expansions */
  animated = input<boolean>(true);

  /** Animation duration in milliseconds */
  animationDuration = input<number>(300);

  /** Whether to show expansion icons */
  showIcons = input<boolean>(true);

  /** Icon for collapsed items */
  collapsedIcon = input<IconName>('chevron-right');

  /** Icon for expanded items */
  expandedIcon = input<IconName>('chevron-down');

  /** Initially expanded item indices */
  initialExpanded = input<number[]>([]);

  /** Custom CSS classes */
  customClasses = input<string>('');

  /** ARIA label for the accordion */
  ariaLabel = input<string>('');

  /** Whether to enable keyboard navigation */
  keyboardNavigation = input<boolean>(true);

  /** Loading state for specific items */
  loadingItems = input<number[]>([]);

  // =============================================================================
  // OUTPUT SIGNALS
  // =============================================================================

  /** Emitted when an item is expanded or collapsed */
  itemExpanded = output<AccordionItemExpandEvent>();

  /** Emitted when accordion receives focus */
  focused = output<AccordionFocusEvent>();

  /** Emitted when accordion loses focus */
  blurred = output<AccordionFocusEvent>();

  // =============================================================================
  // VIEW CHILDREN
  // =============================================================================

  /** References to header buttons */
  headerRefs = viewChildren<ElementRef<HTMLButtonElement>>('headerRef');

  // =============================================================================
  // INTERNAL SIGNALS
  // =============================================================================

  /** Unique component ID */
  componentId = signal(generateComponentId('ds-accordion'));

  /** Component state */
  componentState = signal<AccordionState>(
    createAccordionState({
      variant: this.variant(),
      size: this.size(),
      mode: this.mode(),
      animated: this.animated(),
      isDisabled: this.disabled(),
    }),
  );

  // =============================================================================
  // COMPUTED SIGNALS
  // =============================================================================

  /** Validated items (filters out invalid items) */
  validatedItems = computed(() => {
    return this.items().filter(validateAccordionItem);
  });

  /** Computed CSS classes */
  computedClasses = computed(() => {
    const variant = getAccordionVariantDefinition(this.variant());
    const size = getAccordionSizeDefinition(this.size());

    return mergeClasses(
      'ds-accordion',
      variant.className,
      size.className,
      this.disabled() ? 'ds-accordion--disabled' : null,
      this.animated() ? 'ds-accordion--animated' : null,
      this.customClasses(),
    );
  });

  /** Current icon size based on component size */
  iconSize = computed<IconSize>(() => {
    const sizeMap: Record<ComponentSize, IconSize> = {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    };
    return sizeMap[this.size()];
  });

  /** First enabled item index for roving tabindex */
  firstEnabledItemIndex = computed(() => {
    return this.validatedItems().findIndex((_, index) => !this.isItemDisabled(index));
  });

  // =============================================================================
  // CONSTRUCTOR
  // =============================================================================

  constructor() {
    // Initialize expanded items from initial state and update component state when inputs change
    effect(() => {
      const initialExpanded = this.initialExpanded();
      const validatedItems = this.validatedItems();
      const currentState = this.componentState();

      // Don't process if no items are loaded yet
      if (validatedItems.length === 0) {
        return;
      }

      // Create new state with updated input values
      const newState: AccordionState = {
        ...currentState,
        variant: this.variant(),
        size: this.size(),
        mode: this.mode(),
        animated: this.animated(),
        isDisabled: this.disabled(),
      };

      // Only set initial expanded items if they haven't been processed yet and we have initial values
      if (initialExpanded.length > 0 && !currentState.initialExpandedProcessed) {
        // Validate and filter initial expanded indices
        const validInitialExpanded = initialExpanded
          .filter(index => {
            // Check if index is a valid number
            if (typeof index !== 'number' || !Number.isInteger(index)) {
              console.warn(
                `[Accordion] Invalid initialExpanded index: ${index}. Must be a number.`,
              );
              return false;
            }

            // Check if index is in valid range
            if (!this.isValidIndex(index)) {
              console.warn(
                `[Accordion] Invalid initialExpanded index: ${index}. Must be between 0 and ${validatedItems.length - 1}.`,
              );
              return false;
            }

            // Check if item is disabled
            if (this.isItemDisabled(index)) {
              console.warn(`[Accordion] Cannot expand disabled item at index: ${index}.`);
              return false;
            }

            return true;
          })
          .filter((value, index, array) => {
            // Remove duplicates
            const firstIndex = array.indexOf(value);
            if (firstIndex !== index) {
              console.warn(
                `[Accordion] Duplicate initialExpanded index: ${value}. Removing duplicate.`,
              );
              return false;
            }
            return true;
          });

        if (validInitialExpanded.length > 0) {
          if (this.mode() === 'single') {
            // In single mode, only expand the first valid item
            newState.expandedItems = [validInitialExpanded[0]];

            if (validInitialExpanded.length > 1) {
              console.warn(
                `[Accordion] In single mode, only first item (${validInitialExpanded[0]}) will be expanded. Ignoring other indices: ${validInitialExpanded.slice(1).join(', ')}.`,
              );
            }
          } else {
            // In multiple mode, expand all valid items
            newState.expandedItems = validInitialExpanded;
          }
        } else if (initialExpanded.length > 0) {
          console.warn(
            `[Accordion] No valid items found in initialExpanded: [${initialExpanded.join(', ')}]. All items are either invalid, out of range, or disabled.`,
          );
        }

        // Mark that initialExpanded has been processed
        newState.initialExpandedProcessed = true;
      }

      // Only update if something actually changed to prevent infinite loops
      const hasChanged =
        newState.variant !== currentState.variant ||
        newState.size !== currentState.size ||
        newState.mode !== currentState.mode ||
        newState.animated !== currentState.animated ||
        newState.isDisabled !== currentState.isDisabled ||
        newState.initialExpandedProcessed !== currentState.initialExpandedProcessed ||
        newState.expandedItems.length !== currentState.expandedItems.length ||
        newState.expandedItems.some((item, index) => item !== currentState.expandedItems[index]);

      if (hasChanged) {
        this.componentState.set(newState);
      }
    });

    // Handle case when items change and existing expanded items become invalid
    effect(() => {
      const validatedItems = this.validatedItems();
      const currentState = this.componentState();

      if (validatedItems.length === 0) {
        return;
      }

      // Filter out invalid expanded items (out of bounds or disabled)
      const validExpandedItems = currentState.expandedItems.filter(
        index => this.isValidIndex(index) && !this.isItemDisabled(index),
      );

      // If any expanded items became invalid, update the state
      if (validExpandedItems.length !== currentState.expandedItems.length) {
        const invalidItems = currentState.expandedItems.filter(
          index => !this.isValidIndex(index) || this.isItemDisabled(index),
        );

        console.warn(
          `[Accordion] Removing invalid expanded items: [${invalidItems.join(', ')}]. Items changed or became disabled.`,
        );

        this.componentState.update(state => ({
          ...state,
          expandedItems: validExpandedItems,
        }));
      }
    });
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /**
   * Expand specific item by index
   */
  expandItem(index: number): void {
    if (this.isValidIndex(index) && !this.isItemDisabled(index)) {
      this.setItemExpanded(index, true);
    }
  }

  /**
   * Collapse specific item by index
   */
  collapseItem(index: number): void {
    if (this.isValidIndex(index)) {
      this.setItemExpanded(index, false);
    }
  }

  /**
   * Toggle specific item by index
   */
  toggleItem(index: number, event?: MouseEvent): void {
    if (!this.isValidIndex(index) || this.isItemDisabled(index)) {
      return;
    }

    const isExpanded = this.isItemExpanded(index);
    this.setItemExpanded(index, !isExpanded);

    // Emit expansion event
    if (event) {
      const item = this.validatedItems()[index];
      const expandEvent: AccordionItemExpandEvent = {
        event,
        element: event.target as HTMLButtonElement,
        timestamp: Date.now(),
        itemIndex: index,
        itemKey: item.key,
        expanded: !isExpanded,
        item,
      };
      this.itemExpanded.emit(expandEvent);
    }
  }

  /**
   * Expand all items (only in multiple mode)
   */
  expandAll(): void {
    if (this.mode() === 'multiple') {
      const allIndices = this.validatedItems()
        .map((_, index) => index)
        .filter(index => !this.isItemDisabled(index));

      this.componentState.update(state => ({
        ...state,
        expandedItems: allIndices,
      }));
    }
  }

  /**
   * Collapse all items
   */
  collapseAll(): void {
    this.componentState.update(state => ({
      ...state,
      expandedItems: [],
    }));
  }

  /**
   * Focus specific item header
   */
  focusItem(index: number): void {
    if (this.isValidIndex(index) && !this.isItemDisabled(index)) {
      const headers = this.headerRefs();
      const header = headers[index];
      if (header) {
        header.nativeElement.focus();
      }
    }
  }

  /**
   * Get component state
   */
  getState(): AccordionState {
    return this.componentState();
  }

  // =============================================================================
  // TEMPLATE METHODS
  // =============================================================================

  /**
   * Track by function for ngFor optimization
   */
  trackByFn(index: number, item: AccordionItem): string {
    return item.key || `item-${index}`;
  }

  /**
   * Check if item is expanded
   */
  isItemExpanded(index: number): boolean {
    return this.componentState().expandedItems.includes(index);
  }

  /**
   * Check if item is loading
   */
  isItemLoading(index: number): boolean {
    return this.loadingItems().includes(index);
  }

  /**
   * Check if item is disabled
   */
  isItemDisabled(index: number): boolean {
    const item = this.validatedItems()[index];
    return this.disabled() || (item?.disabled ?? false);
  }

  /**
   * Get item icon name
   */
  getItemIcon(item: AccordionItem, index: number): IconName {
    if (item.icon) {
      return item.icon as IconName;
    }
    return this.isItemExpanded(index) ? this.expandedIcon() : this.collapsedIcon();
  }

  /**
   * Get icon size for current component size
   */
  getIconSize(): IconSize {
    return this.iconSize();
  }

  /**
   * Generate header ID for item
   */
  getItemHeaderId(index: number): string {
    return `${this.componentId()}-header-${index}`;
  }

  /**
   * Generate content ID for item
   */
  getItemContentId(index: number): string {
    return `${this.componentId()}-content-${index}`;
  }

  /**
   * Get tab index for header button (simplified implementation)
   */
  getHeaderTabIndex(index: number): number {
    // Disabled items should not be focusable
    if (this.isItemDisabled(index)) {
      return -1;
    }

    // Only the first enabled item should be tabbable (roving tabindex pattern)
    const firstEnabledIndex = this.firstEnabledItemIndex();
    return index === firstEnabledIndex ? 0 : -1;
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  /**
   * Handle header focus
   */
  handleHeaderFocus(index: number, event: FocusEvent): void {
    const focusEvent: AccordionFocusEvent = {
      event,
      element: event.target as HTMLElement,
      timestamp: Date.now(),
      itemIndex: index,
    };
    this.focused.emit(focusEvent);
  }

  /**
   * Handle header blur
   */
  handleHeaderBlur(index: number, event: FocusEvent): void {
    const blurEvent: AccordionFocusEvent = {
      event,
      element: event.target as HTMLElement,
      timestamp: Date.now(),
      itemIndex: index,
    };
    this.blurred.emit(blurEvent);
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.keyboardNavigation()) {
      return;
    }

    // Get the currently focused element
    const activeElement = document.activeElement as HTMLElement;
    if (!activeElement || !activeElement.classList.contains('ds-accordion__header')) {
      return;
    }

    // Find the index of the currently focused header
    const headers = this.headerRefs();
    const currentIndex = headers.findIndex(header => header.nativeElement === activeElement);

    if (currentIndex === -1) {
      return;
    }

    const itemCount = this.validatedItems().length;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveFocus(1, currentIndex, itemCount);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.moveFocus(-1, currentIndex, itemCount);
        break;

      case 'Home':
        event.preventDefault();
        this.focusFirstItem();
        break;

      case 'End':
        event.preventDefault();
        this.focusLastItem();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleItem(currentIndex);
        break;
    }
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  private setItemExpanded(index: number, expanded: boolean): void {
    const currentState = this.componentState();
    let newExpandedItems: number[] = [...currentState.expandedItems];

    if (expanded) {
      if (this.mode() === 'single') {
        // In single mode, collapse all others
        newExpandedItems = [index];
      } else {
        // In multiple mode, add if not present
        if (!newExpandedItems.includes(index)) {
          newExpandedItems.push(index);
        }
      }
    } else {
      // Remove from expanded items
      newExpandedItems = newExpandedItems.filter(i => i !== index);
    }

    this.componentState.update(state => ({
      ...state,
      expandedItems: newExpandedItems,
    }));
  }

  private isValidIndex(index: number): boolean {
    return index >= 0 && index < this.validatedItems().length;
  }

  private moveFocus(direction: number, currentIndex: number, itemCount: number): void {
    if (itemCount === 0) {
      return;
    }

    let nextIndex = currentIndex + direction;
    let attempts = 0;
    const maxAttempts = itemCount;

    // Wrap around
    if (nextIndex >= itemCount) {
      nextIndex = 0;
    } else if (nextIndex < 0) {
      nextIndex = itemCount - 1;
    }

    // Skip disabled items with loop protection
    while (this.isItemDisabled(nextIndex) && attempts < maxAttempts) {
      nextIndex += direction;
      if (nextIndex >= itemCount) {
        nextIndex = 0;
      } else if (nextIndex < 0) {
        nextIndex = itemCount - 1;
      }
      attempts++;
    }

    // Only focus if we found an enabled item
    if (attempts < maxAttempts && !this.isItemDisabled(nextIndex)) {
      this.focusItem(nextIndex);
    }
  }

  private focusFirstItem(): void {
    const firstEnabledIndex = this.validatedItems().findIndex(
      (_, index) => !this.isItemDisabled(index),
    );
    if (firstEnabledIndex !== -1) {
      this.focusItem(firstEnabledIndex);
    }
  }

  private focusLastItem(): void {
    const items = this.validatedItems();
    for (let i = items.length - 1; i >= 0; i--) {
      if (!this.isItemDisabled(i)) {
        this.focusItem(i);
        break;
      }
    }
  }
}
