import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Size, Appearance, Orientation } from '../utils';
import { Node } from '../node/node.component';
import { NodeComponent } from '../node/node.component';

@Component({
  selector: 'app-tabs',
  imports: [CommonModule, NodeComponent],
  template: `
    <div
      [class]="tabsClasses()"
      role="tablist"
      [attr.aria-orientation]="orientation()"
      (keydown)="onKeyDown($event)"
    >
      @for (tab of tabs(); track tab.id) {
        <app-node
          [node]="getNodeWithSelection(tab)"
          [size]="size()"
          [variant]="appearance()"
          [asButton]="true"
          [showSelectionIndicator]="true"
          [indicatorPosition]="orientation()"
          [selectOnClick]="false"
          (nodeClick)="onTabClick(tab)"
        />
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
  appearance = input<Appearance>('transparent');
  circular = input<boolean>(false);
  showMoreButton = input<boolean>(false);
  orientation = input<Orientation>('horizontal');

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
    classes.push(`tabs--${this.appearance()}`);
    classes.push(`tabs--${this.orientation()}`);

    if (this.circular()) {
      classes.push('tabs--circular');
    }

    return classes.join(' ');
  }

  /**
   * Get node data with selection state
   */
  getNodeWithSelection(tab: T): T {
    return {
      ...tab,
      selected: this.isSelected(tab),
    };
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
  onKeyDown(event: KeyboardEvent): void {
    const tabs = this.tabs().filter(t => !t.disabled);
    const currentSelectedId = this._selectedTabId();
    const currentIndex = tabs.findIndex(t => t.id === currentSelectedId);
    const isVertical = this.orientation() === 'vertical';

    // Only handle if there's a selected tab
    if (currentIndex === -1 && tabs.length > 0) {
      return;
    }

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
        if (tabs.length > 0) {
          this.onTabClick(tabs[0]);
        }
        break;

      case 'End':
        event.preventDefault();
        if (tabs.length > 0) {
          this.onTabClick(tabs[tabs.length - 1]);
        }
        break;
    }
  }
}
