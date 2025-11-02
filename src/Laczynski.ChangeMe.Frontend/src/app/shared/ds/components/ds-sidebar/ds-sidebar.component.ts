import { Component, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavComponent, NavNodeConfig } from '@shared/components/nav';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-ds-sidebar',
  imports: [NavComponent],
  templateUrl: './ds-sidebar.component.html',
})
export class DsSidebarComponent {
  private readonly router = inject(Router);
  selectedItemId = signal<string | null>(null);

  navItems: NavNodeConfig[] = [
    {
      id: 'form',
      label: 'Forms',
      icon: 'form',
      children: [
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
      ],
    },
    { id: 'accordion', label: 'Accordion', icon: 'slide_text' },
    { id: 'badge', label: 'Badge', icon: 'badge' },
    { id: 'breadcrumb', label: 'Breadcrumb', icon: 'arrow_routing' },
    { id: 'button', label: 'Button', icon: 'button' },
    { id: 'card', label: 'Card', icon: 'contact_card' },
    { id: 'data-grid', label: 'Data Grid', icon: 'grid' },
    { id: 'dialog', label: 'Dialog', icon: 'window' },
    { id: 'divider', label: 'Divider', icon: 'divider_tall' },
    { id: 'tabs', label: 'Tabs', icon: 'tabs' },
    { id: 'menu', label: 'Menu', icon: 'group_list' },
    { id: 'nav', label: 'Nav', icon: 'navigation' },
    { id: 'progress-bar', label: 'Progress Bar', icon: 'spacebar' },
    { id: 'scroll-panel', label: 'Scroll Panel', icon: 'dual_screen_vertical_scroll' },
    { id: 'skeleton', label: 'Skeleton', icon: 'checkbox_indeterminate' },
    { id: 'spinner', label: 'Spinner', icon: 'replay' },
    { id: 'stepper', label: 'Stepper', icon: 'timeline' },
    { id: 'splitter', label: 'Splitter', icon: 'split_vertical' },
    { id: 'tag', label: 'Tag', icon: 'tag' },
    { id: 'toast', label: 'Toast', icon: 'alert' },
    { id: 'tree', label: 'Tree', icon: 'text_bullet_list_tree' },
    { id: 'tree-node', label: 'Tree Node', icon: 'rectangle_landscape' },
  ];

  constructor() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      const url = event.url;
      const item = this.navItems.find(item => item.id === url.split('/').pop());
      if (item) {
        this.selectedItemId.set(item.id as string);
      }
    });
    // Set onClick handlers for all items
    effect(() => {
      this.navItems = this.navItems.map(item => ({
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
    // Set onClick handlers for all items
  }
}
