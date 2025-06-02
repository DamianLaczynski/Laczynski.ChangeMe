// =============================================================================
// List Component
// =============================================================================
// Modern, comprehensive list component for the design system
// Supports virtual scrolling, infinite scroll, selection, and custom templates

import {
  Component,
  input,
  output,
  computed,
  signal,
  effect,
  TemplateRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, fromEvent, debounceTime, takeUntil } from 'rxjs';

import { ComponentSize } from '../shared';
import { LoadingIndicatorComponent } from '../../shared/components/loading-indicator/loading-indicator.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';

import {
  ListConfig,
  ListItem,
  ListData,
  ListState,
  ListVariant,
  ListLayout,
  ListSelectionMode,
  ListItemSelectEvent,
  ListItemClickEvent,
  ListScrollEvent,
  ListLoadMoreEvent,
  createListConfig,
  createListItem,
  getListClasses,
  getListItemClasses,
  filterListData,
  sortListData,
  calculateVisibleItems,
  generateListId,
  PaginationResult,
  State,
} from './list.model';
import { ButtonComponent } from '../button';

/**
 * List Component
 *
 * A flexible and powerful list component that supports:
 * - Multiple visual variants and layouts
 * - Virtual scrolling for performance
 * - Infinite scrolling with pagination
 * - Single and multiple selection
 * - Custom item templates
 * - Search and filtering
 * - Empty states and loading indicators
 * - Responsive design
 *
 * @example
 * ```html
 * <ds-list
 *   variant="bordered"
 *   size="md"
 *   [items]="items"
 *   [selection]="{ mode: 'multiple' }"
 *   [itemTemplate]="customTemplate"
 *   (itemClick)="onItemClick($event)"
 *   (itemSelect)="onItemSelect($event)"
 * />
 * ```
 */
@Component({
  selector: 'ds-list',
  standalone: true,
  imports: [CommonModule, LoadingIndicatorComponent, ButtonComponent, CheckboxComponent],
  template: `
    <div
      #listContainer
      [class]="containerClasses()"
      [id]="listId()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-multiselectable]="isMultiSelect()"
      role="list"
    >
      <!-- Header with search and actions -->
      @if (showHeader()) {
        <div class="ds-list__header">
          <!-- Search -->
          @if (showSearch()) {
            <div class="ds-list__search">
              <input
                type="text"
                class="ds-list__search-input"
                [value]="searchTerm()"
                (input)="onSearchChange($event)"
                [placeholder]="searchPlaceholder()"
                [attr.aria-label]="searchAriaLabel()"
              />
            </div>
          }

          <!-- Selection controls -->
          @if (showSelectAll()) {
            <div class="ds-list__selection-controls">
              <ds-checkbox
                [value]="isAllSelected()"
                [indeterminate]="isSomeSelected()"
                [disabled]="isSelectionDisabled()"
                (checkedChange)="onSelectAllChange($event.checked)"
                [label]="selectAllLabel()"
              />
            </div>
          }

          <!-- Custom header template -->
          @if (headerTemplate()) {
            <div class="ds-list__custom-header">
              <ng-container *ngTemplateOutlet="headerTemplate()!" />
            </div>
          }
        </div>
      }

      <!-- List content -->
      <div
        #scrollContainer
        class="ds-list__content"
        [style.height]="containerHeight()"
        (scroll)="onScroll($event)"
        role="presentation"
      >
        <!-- Loading state -->
        @if (isLoading()) {
          <div class="ds-list__loading">
            @if (loadingTemplate()) {
              <ng-container *ngTemplateOutlet="loadingTemplate()!" />
            } @else {
              <app-loading-indicator />
            }
          </div>
        }

        <!-- Empty state -->
        @if (isEmpty() && !isLoading()) {
          <div class="ds-list__empty" role="status">
            @if (emptyTemplate()) {
              <ng-container *ngTemplateOutlet="emptyTemplate()!" />
            } @else {
              <div class="ds-list__empty-content">
                @if (emptyState().icon) {
                  <div class="ds-list__empty-icon">{{ emptyState().icon }}</div>
                }
                @if (emptyState().title) {
                  <h3 class="ds-list__empty-title">{{ emptyState().title }}</h3>
                }
                @if (emptyState().message) {
                  <p class="ds-list__empty-message">{{ emptyState().message }}</p>
                }
                @if (emptyState().action) {
                  <ds-button
                    [variant]="emptyState().action!.variant || 'primary'"
                    [iconStart]="emptyState().action!.icon || ''"
                    (clicked)="emptyState().action!.handler()"
                  >
                    {{ emptyState().action!.label }}
                  </ds-button>
                }
              </div>
            }
          </div>
        }

        <!-- List items -->
        @if (!isEmpty() && !isLoading()) {
          <div class="ds-list__items" [style.height]="itemsContainerHeight()">
            <!-- Virtual scrolling spacer (top) -->
            @if (useVirtualScroll()) {
              <div
                class="ds-list__virtual-spacer"
                [style.height.px]="virtualScrollState().topSpacer"
              ></div>
            }

            <!-- Rendered items -->
            @for (item of visibleItems(); track trackByFn($index, item)) {
              <div
                [class]="getItemClasses(item)"
                [attr.aria-selected]="item.selected"
                [attr.aria-disabled]="item.disabled"
                [attr.data-item-id]="item.id"
                role="listitem"
                (click)="onItemClick(item, $event)"
              >
                <!-- Selection checkbox -->
                @if (showItemSelection()) {
                  <div class="ds-list__item-selection">
                    <ds-checkbox
                      [value]="item.selected || false"
                      [disabled]="item.disabled || isSelectionDisabled()"
                      (checkedChange)="onItemSelectionChange(item, $event.checked)"
                      [label]="getSelectionAriaLabel(item)"
                    />
                  </div>
                }

                <!-- Item content -->
                <div class="ds-list__item-content">
                  @if (itemTemplate()) {
                    <ng-container
                      *ngTemplateOutlet="itemTemplate()!; context: getItemContext(item)"
                    />
                  } @else if (item.template && itemTemplates()[item.template]) {
                    <ng-container
                      *ngTemplateOutlet="
                        itemTemplates()[item.template];
                        context: getItemContext(item)
                      "
                    />
                  } @else {
                    <!-- Default item template -->
                    <div class="ds-list__item-default">
                      {{ getDefaultItemText(item) }}
                    </div>
                  }
                </div>

                <!-- Item actions -->
                @if (showItemActions() && itemActionsTemplate()) {
                  <div class="ds-list__item-actions">
                    <ng-container
                      *ngTemplateOutlet="itemActionsTemplate()!; context: getItemContext(item)"
                    />
                  </div>
                }
              </div>
            }

            <!-- Virtual scrolling spacer (bottom) -->
            @if (useVirtualScroll()) {
              <div
                class="ds-list__virtual-spacer"
                [style.height.px]="virtualScrollState().bottomSpacer"
              ></div>
            }
          </div>

          <!-- Infinite scroll loading indicator -->
          @if (showInfiniteLoading()) {
            <div class="ds-list__infinite-loading">
              @if (infiniteLoadingTemplate()) {
                <ng-container *ngTemplateOutlet="infiniteLoadingTemplate()!" />
              } @else {
                <app-loading-indicator size="small" />
              }
            </div>
          }
        }
      </div>

      <!-- Footer -->
      @if (footerTemplate()) {
        <div class="ds-list__footer">
          <ng-container *ngTemplateOutlet="footerTemplate()!" />
        </div>
      }
    </div>
  `,
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent<T = any> implements AfterViewInit, OnDestroy {
  // =============================================================================
  // INPUTS
  // =============================================================================

  // Configuration
  variant = input<ListVariant>('default');
  size = input<ComponentSize>('md');
  layout = input<ListLayout>('vertical');
  striped = input<boolean>(false);
  hoverable = input<boolean>(true);
  scrollable = input<boolean>(true);
  showDividers = input<boolean>(true);

  // Data
  items = input<T[]>([]);
  dataState = input<State<PaginationResult<T>> | null>(null);
  loading = input<boolean>(false);
  error = input<string | null>(null);

  // Selection
  selectionMode = input<ListSelectionMode>('none');
  selectedItems = input<T[]>([]);
  showSelectAll = input<boolean>(false);
  selectionDisabled = input<boolean>(false);

  // Search and filtering
  showSearch = input<boolean>(false);
  searchTerm = input<string>('');
  searchPlaceholder = input<string>('Search...');
  searchFields = input<string[]>([]);

  // Virtual scrolling
  virtualScroll = input<boolean>(false);
  itemHeight = input<number>(48);
  containerHeight = input<string>('400px');
  bufferSize = input<number>(10);

  // Infinite scrolling
  infiniteScroll = input<boolean>(false);
  infiniteThreshold = input<number>(200);

  // Templates
  itemTemplate = input<TemplateRef<any> | null>(null);
  itemTemplates = input<Record<string, TemplateRef<any>>>({});
  headerTemplate = input<TemplateRef<any> | null>(null);
  footerTemplate = input<TemplateRef<any> | null>(null);
  emptyTemplate = input<TemplateRef<any> | null>(null);
  loadingTemplate = input<TemplateRef<any> | null>(null);
  itemActionsTemplate = input<TemplateRef<any> | null>(null);
  infiniteLoadingTemplate = input<TemplateRef<any> | null>(null);

  // Empty state
  emptyTitle = input<string>('No items found');
  emptyMessage = input<string>('There are no items to display');
  emptyIcon = input<string>('📝');

  // Accessibility
  ariaLabel = input<string>('List');
  searchAriaLabel = input<string>('Search items');

  // Display options
  showHeader = input<boolean>(true);
  showItemActions = input<boolean>(false);
  showItemSelection = input<boolean>(true);

  // =============================================================================
  // OUTPUTS
  // =============================================================================

  itemClick = output<ListItemClickEvent<T>>();
  itemSelect = output<ListItemSelectEvent<T>>();
  scroll = output<ListScrollEvent>();
  loadMore = output<ListLoadMoreEvent>();
  searchChange = output<string>();

  // =============================================================================
  // VIEW CHILDREN
  // =============================================================================

  listContainer = viewChild<ElementRef<HTMLDivElement>>('listContainer');
  scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  // =============================================================================
  // INTERNAL STATE
  // =============================================================================

  private readonly destroy$ = new Subject<void>();
  readonly listId = signal(generateListId());
  private readonly internalSearchTerm = signal('');
  private readonly internalSelectedItems = signal<T[]>([]);

  // Virtual scrolling state
  readonly virtualScrollState = signal({
    startIndex: 0,
    endIndex: 0,
    topSpacer: 0,
    bottomSpacer: 0,
  });

  // =============================================================================
  // COMPUTED PROPERTIES
  // =============================================================================

  // Configuration
  readonly config = computed(() =>
    createListConfig({
      variant: this.variant(),
      size: this.size(),
      layout: this.layout(),
      striped: this.striped(),
      hoverable: this.hoverable(),
      scrollable: this.scrollable(),
      showDividers: this.showDividers(),
      showLoading: this.loading(),
      showEmptyState: true,
      emptyState: {
        title: this.emptyTitle(),
        message: this.emptyMessage(),
        icon: this.emptyIcon(),
      },
      selection: {
        mode: this.selectionMode(),
        showSelectAll: this.showSelectAll(),
        disabled: this.selectionDisabled(),
      },
      virtualScroll: {
        enabled: this.virtualScroll(),
        itemHeight: this.itemHeight(),
        containerHeight: this.containerHeight(),
        bufferSize: this.bufferSize(),
      },
      infiniteScroll: {
        enabled: this.infiniteScroll(),
        threshold: this.infiniteThreshold(),
        showLoadingIndicator: true,
      },
    }),
  );

  // CSS classes
  readonly containerClasses = computed(() => getListClasses(this.config()).join(' '));

  // Data processing
  readonly processedItems = computed(() => {
    let data = this.items();

    // Apply search filter
    const searchTerm = this.internalSearchTerm() || this.searchTerm();
    if (searchTerm) {
      data = filterListData(data, searchTerm, this.searchFields());
    }

    return data;
  });

  // Convert items to ListItem format
  readonly listItems = computed(() =>
    this.processedItems().map((item, index) =>
      createListItem(this.getItemId(item, index), item, {
        selected: this.isItemSelected(item),
        disabled: this.isItemDisabled(item),
      }),
    ),
  );

  // Virtual scrolling
  readonly visibleItems = computed(() => {
    const items = this.listItems();

    if (!this.useVirtualScroll()) {
      return items;
    }

    const { startIndex, endIndex } = this.virtualScrollState();
    return items.slice(startIndex, endIndex);
  });

  // State checks
  readonly isLoading = computed(() => {
    const dataState = this.dataState();
    return this.loading() || (dataState?.isLoading ?? false);
  });

  readonly isEmpty = computed(() => this.listItems().length === 0);

  readonly isMultiSelect = computed(() => this.selectionMode() === 'multiple');

  readonly isSelectionDisabled = computed(() => this.selectionDisabled());

  readonly emptyState = computed(() => this.config().emptyState);

  readonly useVirtualScroll = computed(() => this.config().virtualScroll.enabled);

  readonly showInfiniteLoading = computed(() => {
    const dataState = this.dataState();
    return (
      this.config().infiniteScroll.enabled &&
      this.isLoading() &&
      dataState?.data?.hasNext &&
      !this.isEmpty()
    );
  });

  // Selection state
  readonly selectedItemsInternal = computed(() => {
    return this.internalSelectedItems().length > 0
      ? this.internalSelectedItems()
      : this.selectedItems();
  });

  readonly isAllSelected = computed(() => {
    if (this.isEmpty()) return false;
    const selectableItems = this.listItems().filter(item => !item.disabled);
    return selectableItems.length > 0 && selectableItems.every(item => item.selected);
  });

  readonly isSomeSelected = computed(() => {
    if (this.isEmpty()) return false;
    const selectableItems = this.listItems().filter(item => !item.disabled);
    const selectedCount = selectableItems.filter(item => item.selected).length;
    return selectedCount > 0 && selectedCount < selectableItems.length;
  });

  readonly selectAllLabel = computed(() => {
    if (this.isAllSelected()) return 'Deselect all';
    if (this.isSomeSelected()) return 'Select all';
    return 'Select all';
  });

  readonly itemsContainerHeight = computed(() => {
    if (!this.useVirtualScroll()) return 'auto';

    const itemCount = this.listItems().length;
    const itemHeight = this.config().virtualScroll.itemHeight || 48;
    return `${itemCount * itemHeight}px`;
  });

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  constructor() {
    // Sync internal state with external state
    effect(() => {
      this.internalSelectedItems.set(this.selectedItems());
    });

    // Sync search term
    effect(() => {
      this.internalSearchTerm.set(this.searchTerm());
    });

    // Update virtual scroll when items change
    effect(() => {
      if (this.useVirtualScroll()) {
        this.updateVirtualScroll();
      }
    });
  }

  ngAfterViewInit(): void {
    this.setupScrollListener();
    this.updateVirtualScroll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  onItemClick(item: ListItem<T>, event: Event): void {
    if (item.disabled) return;

    // Handle selection if enabled
    if (this.selectionMode() !== 'none') {
      this.toggleItemSelection(item);
    }

    // Emit click event
    this.itemClick.emit({
      item: item.data,
      index: this.listItems().indexOf(item),
      originalEvent: event,
    });
  }

  onItemSelectionChange(item: ListItem<T>, checked: boolean | any[]): void {
    if (item.disabled) return;

    const isChecked = typeof checked === 'boolean' ? checked : false;
    this.setItemSelection(item, isChecked);
  }

  onSelectAllChange(checked: boolean | any[]): void {
    if (this.isSelectionDisabled()) return;

    const isChecked = typeof checked === 'boolean' ? checked : false;
    const selectableItems = this.listItems().filter(item => !item.disabled);

    if (isChecked) {
      // Select all selectable items
      const selectedData = selectableItems.map(item => item.data);
      this.internalSelectedItems.set(selectedData);
    } else {
      // Deselect all
      this.internalSelectedItems.set([]);
    }

    this.emitSelectionChange();
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    this.internalSearchTerm.set(value);
    this.searchChange.emit(value);
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const { scrollTop, scrollHeight, clientHeight } = element;

    // Update virtual scroll
    if (this.useVirtualScroll()) {
      this.updateVirtualScroll(scrollTop);
    }

    // Check for infinite scroll
    if (this.config().infiniteScroll.enabled) {
      const threshold = this.config().infiniteScroll.threshold || 200;
      const nearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

      if (nearBottom && !this.isLoading()) {
        const dataState = this.dataState();
        if (dataState?.data?.hasNext) {
          this.loadMore.emit({
            currentPage: dataState.data.currentPage,
            nextPage: dataState.data.currentPage + 1,
            totalPages: dataState.data.totalPages,
            originalEvent: event,
          });
        }
      }
    }

    // Emit scroll event
    this.scroll.emit({
      scrollTop,
      direction: this.getScrollDirection(scrollTop),
      atTop: scrollTop === 0,
      atBottom: scrollTop + clientHeight >= scrollHeight - 1,
      originalEvent: event,
    });
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  trackByFn(index: number, item: ListItem<T>): any {
    return item.id;
  }

  getItemClasses(item: ListItem<T>): string {
    return getListItemClasses(item, this.config()).join(' ');
  }

  getItemContext(item: ListItem<T>) {
    return {
      $implicit: item.data,
      item: item.data,
      index: this.listItems().indexOf(item),
      selected: item.selected,
      disabled: item.disabled,
    };
  }

  getDefaultItemText(item: ListItem<T>): string {
    const data = item.data;
    if (typeof data === 'string') return data;
    if (typeof data === 'object' && data !== null) {
      // Try common text fields
      const textFields = ['name', 'title', 'label', 'text', 'value'];
      for (const field of textFields) {
        if (field in data && typeof (data as any)[field] === 'string') {
          return (data as any)[field];
        }
      }
      return JSON.stringify(data);
    }
    return String(data);
  }

  getSelectionAriaLabel(item: ListItem<T>): string {
    const text = this.getDefaultItemText(item);
    return `${item.selected ? 'Deselect' : 'Select'} ${text}`;
  }

  private getItemId(item: T, index: number): string | number {
    if (typeof item === 'object' && item !== null) {
      // Try common ID fields
      const idFields = ['id', '_id', 'key', 'uuid'];
      for (const field of idFields) {
        if (field in item) {
          const value = (item as any)[field];
          if (typeof value === 'string' || typeof value === 'number') {
            return value;
          }
        }
      }
    }
    return index;
  }

  private isItemSelected(item: T): boolean {
    return this.selectedItemsInternal().includes(item);
  }

  private isItemDisabled(item: T): boolean {
    if (typeof item === 'object' && item !== null && 'disabled' in item) {
      return Boolean((item as any).disabled);
    }
    return false;
  }

  private toggleItemSelection(item: ListItem<T>): void {
    this.setItemSelection(item, !item.selected);
  }

  private setItemSelection(item: ListItem<T>, selected: boolean): void {
    const currentSelection = [...this.selectedItemsInternal()];

    if (selected) {
      // Add to selection
      if (this.selectionMode() === 'single') {
        // Single selection - replace current selection
        this.internalSelectedItems.set([item.data]);
      } else if (this.selectionMode() === 'multiple') {
        // Multiple selection - add if not already selected
        if (!currentSelection.includes(item.data)) {
          currentSelection.push(item.data);
          this.internalSelectedItems.set(currentSelection);
        }
      }
    } else {
      // Remove from selection
      const index = currentSelection.indexOf(item.data);
      if (index > -1) {
        currentSelection.splice(index, 1);
        this.internalSelectedItems.set(currentSelection);
      }
    }

    this.emitSelectionChange();
  }

  private emitSelectionChange(): void {
    this.itemSelect.emit({
      item: this.selectedItemsInternal()[this.selectedItemsInternal().length - 1],
      selectedItems: this.selectedItemsInternal(),
      originalEvent: new Event('selection'),
    });
  }

  private setupScrollListener(): void {
    const scrollContainer = this.scrollContainer()?.nativeElement;
    if (!scrollContainer) return;

    fromEvent(scrollContainer, 'scroll')
      .pipe(debounceTime(16), takeUntil(this.destroy$))
      .subscribe((event: Event) => {
        this.onScroll(event);
      });
  }

  private updateVirtualScroll(scrollTop?: number): void {
    if (!this.useVirtualScroll()) return;

    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;

    const currentScrollTop = scrollTop ?? container.scrollTop;
    const containerHeight = container.clientHeight;
    const itemHeight = this.config().virtualScroll.itemHeight || 48;
    const totalItems = this.listItems().length;
    const bufferSize = this.config().virtualScroll.bufferSize || 10;

    const { startIndex, endIndex } = calculateVisibleItems(
      currentScrollTop,
      containerHeight,
      itemHeight,
      totalItems,
      bufferSize,
    );

    this.virtualScrollState.set({
      startIndex,
      endIndex,
      topSpacer: startIndex * itemHeight,
      bottomSpacer: (totalItems - endIndex) * itemHeight,
    });
  }

  private lastScrollTop = 0;

  private getScrollDirection(scrollTop: number): 'up' | 'down' {
    const direction = scrollTop > this.lastScrollTop ? 'down' : 'up';
    this.lastScrollTop = scrollTop;
    return direction;
  }
}
