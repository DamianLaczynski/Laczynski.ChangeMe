import {
  Component,
  input,
  output,
  model,
  computed,
  signal,
  viewChild,
  viewChildren,
  inject,
  DestroyRef,
  OnInit,
  AfterViewInit,
  ElementRef,
  HostListener,
  effect,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentSize } from '../shared';
import { IconComponent } from '../shared/icon/icon.component';

import {
  TabItem,
  TabsConfig,
  TabsVariant,
  TabsOrientation,
  TabsAlignment,
  TabsComponentState,
  TabChangeEvent,
  TabCloseEvent,
  TabFocusEvent,
  TabReorderEvent,
  TabsValidation,
  createTabsConfig,
  createTabsState,
  findTabById,
  findTabIndexById,
  getNextEnabledTab,
  getPreviousEnabledTab,
  getFirstEnabledTab,
  getLastEnabledTab,
  validateTabs,
  getTabsClasses,
  generateTabsId,
  generateTabId,
  generateTabPanelId,
} from './tabs.model';

/**
 * Tabs Component
 *
 * Advanced tabs component with support for text and template content,
 * scrolling, accessibility, and keyboard navigation. Built with Angular Signals API.
 */
@Component({
  selector: 'ds-tabs',
  standalone: true,
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="ds-tabs-container" [class]="containerClasses()">
      <!-- Tab List -->
      <div
        #tabList
        class="ds-tabs-list"
        [class]="tabListClasses()"
        role="tablist"
        [attr.aria-orientation]="orientation()"
        [attr.aria-label]="ariaLabel() || 'Tabs'"
        [attr.data-orientation]="orientation()"
        (keydown)="onTabListKeydown($event)"
      >
        <!-- Scroll Left Button -->
        @if (showScrollButtons() && canScrollLeft()) {
          <button
            type="button"
            class="ds-tabs-scroll-button ds-tabs-scroll-button--left"
            (click)="scrollLeft()"
            [attr.aria-label]="'Scroll tabs left'"
            tabindex="-1"
          >
            <app-icon name="chevron-left" size="sm" [decorative]="true"></app-icon>
          </button>
        }

        <!-- Tabs Scrollable Container -->
        <div
          #tabsContainer
          class="ds-tabs-container-scroll"
          [class.ds-tabs-container-scroll--scrollable]="isScrollable()"
          (scroll)="onTabsScroll($event)"
        >
          <!-- Tab Items -->
          @for (tab of tabs(); track tab.id; let i = $index) {
            <button
              #tabButton
              type="button"
              class="ds-tabs-tab"
              [class]="getTabClasses(tab, i)"
              [id]="generateTabId(componentId(), i)"
              role="tab"
              [attr.aria-selected]="isActiveTab(tab.id)"
              [attr.aria-controls]="generateTabPanelId(componentId(), i)"
              [attr.aria-disabled]="tab.disabled || tab.loading"
              [attr.tabindex]="getTabTabIndex(tab, i)"
              [disabled]="tab.disabled || tab.loading"
              (click)="selectTab(tab, i, $event)"
              (focus)="onTabFocus(tab, i, $event)"
              (blur)="onTabBlur(tab, i, $event)"
              (keydown)="onTabKeydown(tab, i, $event)"
            >
              <!-- Tab Icon -->
              @if (tab.icon) {
                <span class="ds-tabs-tab-icon" [innerHTML]="tab.icon"></span>
              }

              <!-- Tab Loading -->
              @if (tab.loading) {
                <span class="ds-tabs-tab-loading" aria-label="Loading">
                  <app-icon name="cog" size="sm" [decorative]="true"></app-icon>
                </span>
              }

              <!-- Tab Label -->
              <span
                class="ds-tabs-tab-label"
                [class.ds-tabs-tab-label--has-close]="showCloseButton(tab)"
              >
                {{ tab.label }}
              </span>

              <!-- Tab Badge -->
              @if (tab.badge) {
                <span class="ds-tabs-tab-badge">{{ tab.badge }}</span>
              }

              <!-- Tab Close Button - Inside tab button like clearable select -->
              @if (showCloseButton(tab)) {
                <button
                  type="button"
                  class="ds-tabs-tab-close"
                  (click)="closeTab(tab, i, $event)"
                  (keydown)="onCloseButtonKeydown(tab, i, $event)"
                  [attr.aria-label]="'Close ' + tab.label"
                  tabindex="-1"
                >
                  <app-icon name="x-mark" size="sm" [decorative]="true"></app-icon>
                </button>
              }
            </button>
          }
        </div>

        <!-- Scroll Right Button -->
        @if (showScrollButtons() && canScrollRight()) {
          <button
            type="button"
            class="ds-tabs-scroll-button ds-tabs-scroll-button--right"
            (click)="scrollRight()"
            [attr.aria-label]="'Scroll tabs right'"
            tabindex="-1"
          >
            <app-icon name="chevron-right" size="sm" [decorative]="true"></app-icon>
          </button>
        }
      </div>

      <!-- Tab Panels -->
      <div class="ds-tabs-panels" [class]="tabPanelsClasses()">
        @for (tab of tabs(); track tab.id; let i = $index) {
          <div
            class="ds-tabs-panel"
            [class]="getPanelClasses(tab, i)"
            [id]="generateTabPanelId(componentId(), i)"
            role="tabpanel"
            [attr.aria-labelledby]="generateTabId(componentId(), i)"
            [attr.aria-hidden]="!isActiveTab(tab.id)"
            [attr.tabindex]="isActiveTab(tab.id) ? '0' : '-1'"
            [attr.inert]="!isActiveTab(tab.id) ? true : null"
          >
            @if (isActiveTab(tab.id) || !lazy()) {
              @if (tab.template) {
                <!-- Template Content -->
                <ng-container [ngTemplateOutlet]="tab.template"></ng-container>
              } @else if (tab.content) {
                <!-- Text Content -->
                <div class="ds-tabs-panel-content">{{ tab.content }}</div>
              } @else {
                <!-- Empty Content -->
                <div class="ds-tabs-panel-empty">No content available</div>
              }
            }
          </div>
        }
      </div>
    </div>
  `,
  styleUrl: './tabs.component.scss',
})
export class TabsComponent implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);

  // =============================================================================
  // INPUT SIGNALS
  // =============================================================================

  /** Tabs variant */
  variant = input<TabsVariant>('default');

  /** Component size */
  size = input<ComponentSize>('md');

  /** Tabs orientation */
  orientation = input<TabsOrientation>('horizontal');

  /** Tab alignment */
  alignment = input<TabsAlignment>('start');

  /** ARIA label for the tab list */
  ariaLabel = input<string>('');

  /** Whether tabs can be closed */
  closable = input<boolean>(false);

  /** Whether tabs support lazy loading */
  lazy = input<boolean>(false);

  /** Whether to show scroll buttons */
  scrollable = input<boolean>(true);

  /** Animation duration in milliseconds */
  animationDuration = input<number>(300);

  /** Maximum number of visible tabs */
  maxVisibleTabs = input<number | undefined>(undefined);

  /** Custom CSS classes */
  customClasses = input<string>('');

  /** Tabs data */
  tabs = input.required<TabItem[]>();

  // =============================================================================
  // MODEL SIGNALS
  // =============================================================================

  /** Currently active tab ID */
  activeTabId = model<string | null>(null);

  // =============================================================================
  // OUTPUT SIGNALS
  // =============================================================================

  /** Tab change event */
  tabChange = output<TabChangeEvent>();

  /** Tab close event */
  tabClose = output<TabCloseEvent>();

  /** Tab focus event */
  tabFocus = output<TabFocusEvent>();

  /** Tab reorder event */
  tabReorder = output<TabReorderEvent>();

  // =============================================================================
  // VIEW CHILDREN
  // =============================================================================

  /** Tab list element */
  private tabList = viewChild.required<ElementRef<HTMLDivElement>>('tabList');

  /** Tabs container element */
  private tabsContainer = viewChild.required<ElementRef<HTMLDivElement>>('tabsContainer');

  /** Tab button elements */
  private tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabButton');

  // =============================================================================
  // PRIVATE SIGNALS
  // =============================================================================

  /** Component unique ID */
  protected componentId = signal<string>(generateTabsId());

  /** Component configuration */
  private config = signal<TabsConfig>(createTabsConfig());

  /** Component state */
  private state = signal<TabsComponentState>(createTabsState());

  /** Validation state */
  private validationState = signal<TabsValidation>({ valid: true });

  /** Currently focused tab index */
  private focusedTabIndex = signal<number>(-1);

  /** Scroll position */
  private scrollPosition = signal<number>(0);

  /** Whether scrolling is available */
  protected isScrollable = signal<boolean>(false);

  /** Whether can scroll left */
  protected canScrollLeft = signal<boolean>(false);

  /** Whether can scroll right */
  protected canScrollRight = signal<boolean>(false);

  constructor() {
    // Update config when inputs change
    effect(() => {
      const newConfig = createTabsConfig({
        variant: this.variant(),
        size: this.size(),
        orientation: this.orientation(),
        alignment: this.alignment(),
        closable: this.closable(),
        lazy: this.lazy(),
        scrollable: this.scrollable(),
        animationDuration: this.animationDuration(),
        maxVisibleTabs: this.maxVisibleTabs(),
      });
      this.config.set(newConfig);
    });

    // Update state when tabs or activeTabId change
    effect(() => {
      const tabs = this.tabs();
      const activeTabId = this.activeTabId();

      // Validate tabs
      const validation = validateTabs(tabs, activeTabId);
      this.validationState.set(validation);

      // Set default active tab if none is set
      if (!activeTabId && tabs.length > 0) {
        const firstEnabledTab = getFirstEnabledTab(tabs);
        if (firstEnabledTab) {
          this.activeTabId.set(firstEnabledTab.id);
        }
      }
    });

    // Update scroll state and indicator position
    effect(() => {
      this.updateScrollState();
    });
  }

  // =============================================================================
  // COMPUTED SIGNALS
  // =============================================================================

  /** Container CSS classes */
  protected containerClasses = computed(() => {
    const config = this.config();
    const state = this.state();
    const classes = getTabsClasses(config, state);

    if (this.customClasses()) {
      classes.push(...this.customClasses().split(' ').filter(Boolean));
    }

    return classes.join(' ');
  });

  /** Tab list CSS classes */
  protected tabListClasses = computed(() => {
    const classes = ['ds-tabs-list'];

    if (this.isScrollable()) {
      classes.push('ds-tabs-list--scrollable');
    }

    return classes.join(' ');
  });

  /** Tab panels CSS classes */
  protected tabPanelsClasses = computed(() => {
    return 'ds-tabs-panels';
  });

  /** Whether to show scroll buttons */
  protected showScrollButtons = computed(() => {
    return this.scrollable() && this.isScrollable();
  });

  /** Active tab */
  protected activeTab = computed(() => {
    const activeTabId = this.activeTabId();
    return activeTabId ? (findTabById(this.tabs(), activeTabId) ?? null) : null;
  });

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  ngOnInit(): void {
    // Initialize component
    this.updateScrollState();
  }

  ngAfterViewInit(): void {
    // Additional initialization after view is fully initialized
    this.updateScrollState();
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    // Handle escape key if needed
    event.preventDefault();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event): void {
    // Update scroll state on window resize
    this.updateScrollState();
  }

  /** Handle tab list keydown */
  onTabListKeydown(event: KeyboardEvent): void {
    const key = event.key;
    const isHorizontal = this.orientation() === 'horizontal';

    switch (key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        if ((isHorizontal && key === 'ArrowLeft') || (!isHorizontal && key === 'ArrowUp')) {
          event.preventDefault();
          this.navigateToPreviousTab();
        }
        break;

      case 'ArrowRight':
      case 'ArrowDown':
        if ((isHorizontal && key === 'ArrowRight') || (!isHorizontal && key === 'ArrowDown')) {
          event.preventDefault();
          this.navigateToNextTab();
        }
        break;

      case 'Home':
        event.preventDefault();
        this.navigateToFirstTab();
        break;

      case 'End':
        event.preventDefault();
        this.navigateToLastTab();
        break;
    }
  }

  /** Handle tab keydown */
  onTabKeydown(tab: TabItem, index: number, event: KeyboardEvent): void {
    const key = event.key;

    switch (key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectTab(tab, index, event);
        break;

      case 'Delete':
      case 'Backspace':
        if (this.showCloseButton(tab)) {
          event.preventDefault();
          this.closeTab(tab, index, event);
        }
        break;
    }
  }

  /** Handle tab focus */
  onTabFocus(tab: TabItem, index: number, event: FocusEvent): void {
    this.focusedTabIndex.set(index);

    const focusEvent: TabFocusEvent = {
      tab,
      index,
      direction: 'in',
      event,
      element: event.target as HTMLElement,
      timestamp: Date.now(),
    };

    this.tabFocus.emit(focusEvent);
  }

  /** Handle tab blur */
  onTabBlur(tab: TabItem, index: number, event: FocusEvent): void {
    const focusEvent: TabFocusEvent = {
      tab,
      index,
      direction: 'out',
      event,
      element: event.target as HTMLElement,
      timestamp: Date.now(),
    };

    this.tabFocus.emit(focusEvent);
  }

  /** Handle close button keydown */
  onCloseButtonKeydown(tab: TabItem, index: number, event: KeyboardEvent): void {
    const key = event.key;

    switch (key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        event.stopPropagation();
        this.closeTab(tab, index, event);
        break;
    }
  }

  /** Handle tabs container scroll */
  onTabsScroll(event: Event): void {
    const target = event.target as HTMLElement;
    this.scrollPosition.set(target.scrollLeft);
    this.updateScrollState();
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /** Select a tab */
  selectTab(tab: TabItem, index: number, event?: Event): void {
    if (tab.disabled || tab.loading) {
      return;
    }

    const previousTab = this.activeTab();
    const previousTabId = this.activeTabId();

    this.activeTabId.set(tab.id);

    const changeEvent: TabChangeEvent = {
      previousTab,
      currentTab: tab,
      index,
      value: tab.id,
      previousValue: previousTabId ?? undefined,
      event: event || new Event('change'),
      element: this.elementRef.nativeElement,
      timestamp: Date.now(),
    };

    this.tabChange.emit(changeEvent);
  }

  /** Close a tab */
  closeTab(tab: TabItem, index: number, event: Event): void {
    event.stopPropagation();

    let canClose = true;

    const closeEvent: TabCloseEvent = {
      tab,
      index,
      originalEvent: event,
      preventDefault: () => {
        canClose = false;
      },
    };

    this.tabClose.emit(closeEvent);

    if (!canClose) {
      return;
    }

    // If closing active tab, select another tab
    if (this.activeTabId() === tab.id) {
      const nextTab = this.getNextTabToActivate(index);
      this.activeTabId.set(nextTab?.id || null);
    }
  }

  /** Navigate to previous tab */
  navigateToPreviousTab(): void {
    const currentIndex = this.focusedTabIndex();
    const tabs = this.tabs();
    const previousTab = getPreviousEnabledTab(tabs, currentIndex);

    if (previousTab) {
      const newIndex = findTabIndexById(tabs, previousTab.id);
      this.focusTab(newIndex);
    }
  }

  /** Navigate to next tab */
  navigateToNextTab(): void {
    const currentIndex = this.focusedTabIndex();
    const tabs = this.tabs();
    const nextTab = getNextEnabledTab(tabs, currentIndex);

    if (nextTab) {
      const newIndex = findTabIndexById(tabs, nextTab.id);
      this.focusTab(newIndex);
    }
  }

  /** Navigate to first tab */
  navigateToFirstTab(): void {
    const firstTab = getFirstEnabledTab(this.tabs());
    if (firstTab) {
      const index = findTabIndexById(this.tabs(), firstTab.id);
      this.focusTab(index);
    }
  }

  /** Navigate to last tab */
  navigateToLastTab(): void {
    const lastTab = getLastEnabledTab(this.tabs());
    if (lastTab) {
      const index = findTabIndexById(this.tabs(), lastTab.id);
      this.focusTab(index);
    }
  }

  /** Scroll tabs left */
  scrollLeft(): void {
    const container = this.tabsContainer().nativeElement;
    const scrollAmount = container.clientWidth / 2;
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  }

  /** Scroll tabs right */
  scrollRight(): void {
    const container = this.tabsContainer().nativeElement;
    const scrollAmount = container.clientWidth / 2;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  /** Check if tab is active */
  isActiveTab(tabId: string): boolean {
    return this.activeTabId() === tabId;
  }

  /** Get tab CSS classes */
  getTabClasses(tab: TabItem, index: number): string {
    const classes = ['ds-tabs-tab'];

    if (this.isActiveTab(tab.id)) {
      classes.push('ds-tabs-tab--active');
    }

    if (tab.disabled) {
      classes.push('ds-tabs-tab--disabled');
    }

    if (tab.loading) {
      classes.push('ds-tabs-tab--loading');
    }

    if (this.focusedTabIndex() === index) {
      classes.push('ds-tabs-tab--focused');
    }

    if (this.showCloseButton(tab)) {
      classes.push('ds-tabs-tab--closable');
    }

    if (tab.customClasses) {
      classes.push(...tab.customClasses.split(' ').filter(Boolean));
    }

    return classes.join(' ');
  }

  /** Get panel CSS classes */
  getPanelClasses(tab: TabItem, index: number): string {
    const classes = ['ds-tabs-panel'];

    if (this.isActiveTab(tab.id)) {
      classes.push('ds-tabs-panel--active');
    }

    return classes.join(' ');
  }

  /** Get tab tabindex */
  getTabTabIndex(tab: TabItem, index: number): string {
    if (tab.disabled || tab.loading) {
      return '-1';
    }

    // First tab or active tab gets tabindex 0
    const activeIndex = this.activeTab() ? findTabIndexById(this.tabs(), this.activeTab()!.id) : 0;
    return index === activeIndex ? '0' : '-1';
  }

  /** Show close button for tab */
  showCloseButton(tab: TabItem): boolean {
    return (this.closable() || !!tab.closable) && !tab.disabled && !tab.loading;
  }

  /** Focus specific tab */
  private focusTab(index: number): void {
    const buttons = this.tabButtons();
    if (buttons && buttons[index]) {
      buttons[index].nativeElement.focus();
      this.focusedTabIndex.set(index);
    }
  }

  /** Get next tab to activate when closing current tab */
  private getNextTabToActivate(closingIndex: number): TabItem | null {
    const tabs = this.tabs();

    // Try next tab
    if (closingIndex < tabs.length - 1) {
      const nextTab = tabs[closingIndex + 1];
      if (!nextTab.disabled && !nextTab.loading) {
        return nextTab;
      }
    }

    // Try previous tab
    if (closingIndex > 0) {
      const prevTab = tabs[closingIndex - 1];
      if (!prevTab.disabled && !prevTab.loading) {
        return prevTab;
      }
    }

    // Find any enabled tab
    return getFirstEnabledTab(tabs) ?? null;
  }

  /** Update scroll state */
  private updateScrollState(): void {
    const container = this.tabsContainer()?.nativeElement;
    if (!container) return;

    const isScrollable = container.scrollWidth > container.clientWidth;
    const canScrollLeft = container.scrollLeft > 0;
    const canScrollRight = container.scrollLeft < container.scrollWidth - container.clientWidth;

    this.isScrollable.set(isScrollable);
    this.canScrollLeft.set(canScrollLeft);
    this.canScrollRight.set(canScrollRight);
  }

  /** Generate tab ID */
  generateTabId(componentId: string, index: number): string {
    return generateTabId(componentId, index);
  }

  /** Generate tab panel ID */
  generateTabPanelId(componentId: string, index: number): string {
    return generateTabPanelId(componentId, index);
  }
}
