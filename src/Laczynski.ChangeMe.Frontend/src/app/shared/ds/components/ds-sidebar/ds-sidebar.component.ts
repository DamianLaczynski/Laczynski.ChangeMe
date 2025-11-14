import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavComponent, NavNode } from '@shared/components/nav';
import { filter } from 'rxjs/operators';
import { LayoutService } from '@core/layout/services/layout.service';
import { NodeComponent, Node } from '@shared/components/node';
import { SearchComponent } from '@shared/components/field/search';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ds-sidebar',
  imports: [NavComponent, NodeComponent, SearchComponent, FormsModule],
  templateUrl: './ds-sidebar.component.html',
})
export class DsSidebarComponent {
  private readonly router = inject(Router);
  private readonly layoutService = inject(LayoutService);
  selectedItemId = signal<string | null>(null);
  private _searchQuery = signal<string>('');

  get searchQuery(): string {
    return this._searchQuery();
  }

  set searchQuery(value: string) {
    this._searchQuery.set(value);
  }

  // Dark mode state - computed from layout service
  isDarkMode = computed(() => this.layoutService.$themeMode() === 'dark');
  themeLabel = computed(() => (this.isDarkMode() ? 'Light mode' : 'Dark mode'));
  themeIcon = computed(() => (this.isDarkMode() ? 'weather_sunny' : 'weather_moon'));

  // Theme toggle node
  themeNode = computed<Node>(() => ({
    id: 'theme-toggle',
    label: this.themeLabel(),
    icon: this.themeIcon(),
  }));

  private readonly allNavItems: NavNode[] = [
    // Design System Section
    { id: 'design-system', isSectionHeader: true, label: 'Design System' },
    { id: 'colors', label: 'Colors', icon: 'color' },
    // Form Components Section
    { id: 'form-components', isSectionHeader: true, label: 'Form Components' },
    { id: 'checkbox', label: 'Checkbox', icon: 'checkbox_checked' },
    { id: 'color', label: 'Color', icon: 'color' },
    { id: 'date', label: 'Date', icon: 'calendar' },
    { id: 'date-range', label: 'Date Range', icon: 'calendar_month' },
    { id: 'dropdown', label: 'Dropdown', icon: 'apps_list' },
    { id: 'file', label: 'File', icon: 'document' },
    { id: 'number', label: 'Number', icon: 'number_row' },
    { id: 'password', label: 'Password', icon: 'password' },
    { id: 'radio', label: 'Radio', icon: 'checkmark_circle' },
    { id: 'slider', label: 'Slider', icon: 'arrow_maximize' },
    { id: 'switch', label: 'Switch', icon: 'tap_single' },
    { id: 'text', label: 'Text', icon: 'text_align_left' },
    { id: 'email', label: 'Email', icon: 'mail' },
    { id: 'search', label: 'Search', icon: 'search' },
    { id: 'tel', label: 'Tel', icon: 'call' },
    { id: 'textarea', label: 'Textarea', icon: 'text_field' },
    { id: 'totp', label: 'TOTP', icon: 'lock_closed' },
    { id: 'url', label: 'URL', icon: 'link' },
    // Layout Components Section
    { id: 'layout-components', isSectionHeader: true, label: 'Layout Components' },
    { id: 'accordion', label: 'Accordion', icon: 'slide_text' },
    { id: 'card', label: 'Card', icon: 'contact_card' },
    { id: 'dialog', label: 'Dialog', icon: 'window' },
    { id: 'divider', label: 'Divider', icon: 'divider_tall' },
    {
      id: 'scroll-panel',
      label: 'Scroll Panel',
      icon: 'dual_screen_vertical_scroll',
    },
    { id: 'splitter', label: 'Splitter', icon: 'split_vertical' },
    // Navigation Section
    { id: 'navigation', isSectionHeader: true, label: 'Navigation' },
    { id: 'breadcrumb', label: 'Breadcrumb', icon: 'arrow_routing' },
    { id: 'menu', label: 'Menu', icon: 'group_list' },
    { id: 'nav', label: 'Nav', icon: 'navigation' },
    { id: 'table-of-content', label: 'Table of Content', icon: 'list' },
    { id: 'tabs', label: 'Tabs', icon: 'tabs' },
    // Feedback Section
    { id: 'feedback', isSectionHeader: true, label: 'Feedback' },
    { id: 'progress-bar', label: 'Progress Bar', icon: 'spacebar' },
    { id: 'skeleton', label: 'Skeleton', icon: 'checkbox_indeterminate' },
    { id: 'spinner', label: 'Spinner', icon: 'replay' },
    { id: 'toast', label: 'Toast', icon: 'alert' },
    // Data Display Section
    { id: 'data-display', isSectionHeader: true, label: 'Data Display' },
    { id: 'data-grid', label: 'Data Grid', icon: 'table' },
    { id: 'pagination', label: 'Pagination', icon: 'page_fit' },
    { id: 'toolbar', label: 'Toolbar', icon: 'navigation' },
    { id: 'tree', label: 'Tree', icon: 'text_bullet_list_tree' },
    { id: 'tree-node', label: 'Tree Node', icon: 'rectangle_landscape' },
    { id: 'node', label: 'Node', icon: 'circle' },
    { id: 'badge', label: 'Badge', icon: 'badge' },
    { id: 'tag', label: 'Tag', icon: 'tag' },
    { id: 'empty-state', label: 'Empty State', icon: 'document_dismiss' },
    { id: 'error-state', label: 'Error State', icon: 'error_circle' },
    { id: 'loading-state', label: 'Loading State', icon: 'arrow_sync' },
    { id: 'state-container', label: 'State Container', icon: 'database' },
    { id: 'icon', label: 'Icon', icon: 'star' },
    // Actions Section
    { id: 'actions', isSectionHeader: true, label: 'Actions' },
    { id: 'button', label: 'Button', icon: 'button' },
    { id: 'stepper', label: 'Stepper', icon: 'timeline' },
    // Calendar Section
    { id: 'calendar-components', isSectionHeader: true, label: 'Calendar Components' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar_month' },
    { id: 'time', label: 'Time', icon: 'clock' },
  ];

  // Filtered nav items based on search query
  filteredNavItems = computed<NavNode[]>(() => {
    const query = this._searchQuery().toLowerCase().trim();
    if (!query) {
      return this.allNavItems;
    }

    return this.allNavItems.filter(item => {
      // Always show section headers if any item in section matches
      if (item.isSectionHeader) {
        // Check if any item after this header matches
        const headerIndex = this.allNavItems.indexOf(item);
        const nextHeaderIndex = this.allNavItems.findIndex(
          (navItem, idx) => idx > headerIndex && navItem.isSectionHeader,
        );
        const sectionItems = this.allNavItems.slice(
          headerIndex + 1,
          nextHeaderIndex === -1 ? undefined : nextHeaderIndex,
        );
        return sectionItems.some(sectionItem => sectionItem.label.toLowerCase().includes(query));
      }
      // Filter regular items by label
      return item.label.toLowerCase().includes(query);
    });
  });

  // Nav items with handlers applied
  navItems = computed<NavNode[]>(() => {
    return this.filteredNavItems().map(item => ({
      ...item,
      onClick: item.children
        ? undefined
        : () => {
            this.selectedItemId.set(item.id as string);
            this.router.navigate(['ds', item.id]);
          },
      selected: this.selectedItemId() === item.id,
      children: item.children?.map(child => ({
        ...child,
        onClick: () => {
          this.selectedItemId.set(child.id as string);
          this.router.navigate(['ds', child.id]);
        },
        selected: this.selectedItemId() === child.id,
      })),
    }));
  });

  constructor() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      const url = event.url;
      const item = this.navItems().find(item => item.id === url.split('/').pop());
      if (item) {
        this.selectedItemId.set(item.id as string);
      }
    });
  }

  onDarkModeToggle(): void {
    this.layoutService.toggleTheme();
  }
}
