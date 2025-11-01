import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Node, Size, TabAppearance, TabLayout, TabOrientation } from '../utils';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-tabs',

  imports: [CommonModule, IconComponent],
  template: `
    <div [class]="tabsClasses()" role="tablist" [attr.aria-orientation]="orientation()">
      @for (tab of tabs(); track tab.id) {
        <button
          [class]="tabClasses(tab)"
          [attr.role]="'tab'"
          [attr.aria-selected]="isSelected(tab)"
          [attr.aria-disabled]="tab.disabled"
          [attr.tabindex]="isSelected(tab) ? 0 : -1"
          [disabled]="tab.disabled"
          (click)="onTabClick(tab)"
          (keydown)="onKeyDown($event, tab)"
        >
          <!-- Icon -->
          @if (layout() !== 'text-only' && tab.icon) {
            <div class="tabs__icon">
              @if (isSelected(tab)) {
                <!-- Filled icon for selected state - Size 20 for medium/small -->
                <app-icon [icon]="tab.icon" [size]="size()" variant="filled" />
              } @else {
                <!-- Regular icon for unselected state -->
                <app-icon [icon]="tab.icon" [size]="size()" variant="regular" />
              }
            </div>
          }

          <!-- Tab title -->
          @if (layout() !== 'icon-only') {
            <div class="tabs__title">
              <div class="tabs__text">
                {{ tab.label }}
              </div>
            </div>
          }

          <!-- Selection indicator -->
          <div class="tabs__indicator">
            @if (isSelected(tab) && orientation() === 'horizontal') {
              <div class="tabs__selector" [style.width]="getSelectorWidth()"></div>
            }
            @if (isSelected(tab) && orientation() === 'vertical') {
              <svg
                width="3"
                [attr.height]="getSelectorHeight()"
                [attr.viewBox]="'0 0 3 ' + getSelectorHeightValue()"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  [attr.d]="getVerticalIndicatorPath()"
                  fill="var(--Brand-Stroke-Compound-Rest, #0F6CBD)"
                />
              </svg>
            }
          </div>
        </button>
      }

      <!-- More button (overflow menu) -->
      @if (showMoreButton()) {
        <div class="tabs__more-button">
          <ng-content select="[moreButton]"></ng-content>
        </div>
      }
    </div>
  `,
})
export class TabsComponent<T extends Node> {
  // Inputs
  tabs = input.required<T[]>();
  selectedTabId = input<string | number>();
  size = input<Size>('medium');
  layout = input<TabLayout>('icon-before');
  appearance = input<TabAppearance>('transparent');
  circular = input<boolean>(false);
  showMoreButton = input<boolean>(false);
  orientation = input<TabOrientation>('horizontal');

  // Outputs
  tabChange = output<T>();
  selectedTabIdChange = output<string | number>();

  // Local state
  private _selectedTabId = signal<string | number | undefined>(undefined);

  constructor() {
    // Sync selectedTabId input with internal state
    effect(() => {
      const id = this.selectedTabId();
      if (id !== undefined) {
        this._selectedTabId.set(id);
      } else if (this.tabs().length > 0) {
        // Auto-select first tab if none selected
        this._selectedTabId.set(this.tabs()[0].id);
      }
    });
  }

  /**
   * Get tabs container classes
   */
  tabsClasses(): string {
    const classes = ['tabs'];

    classes.push(`tabs--${this.size()}`);
    classes.push(`tabs--${this.layout()}`);
    classes.push(`tabs--${this.appearance()}`);
    classes.push(`tabs--${this.orientation()}`);

    if (this.circular()) {
      classes.push('tabs--circular');
    }

    return classes.join(' ');
  }

  /**
   * Get tab button classes
   */
  tabClasses(tab: T): string {
    const classes = ['tabs__tab'];

    if (this.isSelected(tab)) {
      classes.push('tabs__tab--selected');
    }

    if (tab.disabled) {
      classes.push('tabs__tab--disabled');
    }

    return classes.join(' ');
  }

  /**
   * Check if tab is selected
   */
  isSelected(tab: T): boolean {
    return this._selectedTabId() === tab.id;
  }

  /**
   * Handle tab click
   */
  onTabClick(tab: T): void {
    if (tab.disabled) {
      return;
    }

    this._selectedTabId.set(tab.id);
    this.tabChange.emit(tab);
    this.selectedTabIdChange.emit(tab.id);
  }

  /**
   * Handle keyboard navigation
   */
  onKeyDown(event: KeyboardEvent, currentTab: T): void {
    const tabs = this.tabs().filter(t => !t.disabled);
    const currentIndex = tabs.findIndex(t => t.id === currentTab.id);
    const isVertical = this.orientation() === 'vertical';

    switch (event.key) {
      case 'ArrowLeft':
        if (!isVertical) {
          event.preventDefault();
          if (currentIndex > 0) {
            this.onTabClick(tabs[currentIndex - 1]);
          }
        }
        break;

      case 'ArrowRight':
        if (!isVertical) {
          event.preventDefault();
          if (currentIndex < tabs.length - 1) {
            this.onTabClick(tabs[currentIndex + 1]);
          }
        }
        break;

      case 'ArrowUp':
        if (isVertical) {
          event.preventDefault();
          if (currentIndex > 0) {
            this.onTabClick(tabs[currentIndex - 1]);
          }
        }
        break;

      case 'ArrowDown':
        if (isVertical) {
          event.preventDefault();
          if (currentIndex < tabs.length - 1) {
            this.onTabClick(tabs[currentIndex + 1]);
          }
        }
        break;

      case 'Home':
        event.preventDefault();
        this.onTabClick(tabs[0]);
        break;

      case 'End':
        event.preventDefault();
        this.onTabClick(tabs[tabs.length - 1]);
        break;
    }
  }

  /**
   * Get selector width based on layout (for horizontal tabs)
   */
  getSelectorWidth(): string {
    // This is approximate - in a real implementation, you'd measure the actual content width
    switch (this.layout()) {
      case 'icon-only':
        return '16px';
      case 'text-only':
        return '80%';
      default: // icon-before
        return '70%';
    }
  }

  /**
   * Get selector height for vertical tabs
   */
  getSelectorHeight(): string {
    if (this.size() === 'small') {
      return '24';
    }
    return '32';
  }

  /**
   * Get selector height numeric value for viewBox
   */
  getSelectorHeightValue(): number {
    if (this.size() === 'small') {
      return 24;
    }
    return 32;
  }

  /**
   * Get vertical indicator SVG path
   */
  getVerticalIndicatorPath(): string {
    if (this.size() === 'small') {
      // Small: 24px height
      return 'M0 5.5C0 4.67157 0.671573 4 1.5 4C2.32843 4 3 4.67157 3 5.5V18.5C3 19.3284 2.32843 20 1.5 20C0.671573 20 0 19.3284 0 18.5V5.5Z';
    }
    // Medium: 32px height
    return 'M0 9.5C0 8.67157 0.671573 8 1.5 8C2.32843 8 3 8.67157 3 9.5V22.5C3 23.3284 2.32843 24 1.5 24C0.671573 24 0 23.3284 0 22.5V9.5Z';
  }
}
