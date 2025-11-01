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
        { id: 'checkbox', label: 'Checkbox', icon: 'checkbox' },
        { id: 'color', label: 'Color', icon: 'color' },
        { id: 'date', label: 'Date', icon: 'date' },
        { id: 'date-range', label: 'Date Range', icon: 'date-range' },
        { id: 'dropdown', label: 'Dropdown', icon: 'dropdown' },
        { id: 'file', label: 'File', icon: 'file' },
        { id: 'number', label: 'Number', icon: 'number' },
        { id: 'password', label: 'Password', icon: 'password' },
        { id: 'radio', label: 'Radio', icon: 'radio' },
        { id: 'slider', label: 'Slider', icon: 'slider' },
        { id: 'switch', label: 'Switch', icon: 'switch' },
        { id: 'text', label: 'Text', icon: 'text' },
      ],
    },
    { id: 'accordion', label: 'Accordion', icon: 'accordion' },
    { id: 'badge', label: 'Badge', icon: 'badge' },
    { id: 'breadcrumb', label: 'Breadcrumb', icon: 'breadcrumb' },
    { id: 'button', label: 'Button', icon: 'button' },
    { id: 'card', label: 'Card', icon: 'card' },
    { id: 'data-grid', label: 'Data Grid', icon: 'data-grid' },
    { id: 'dialog', label: 'Dialog', icon: 'dialog' },
    { id: 'divider', label: 'Divider', icon: 'divider' },
    { id: 'tabs', label: 'Tabs', icon: 'tabs' },
    { id: 'menu', label: 'Menu', icon: 'menu' },
    { id: 'nav', label: 'Nav', icon: 'nav' },
    { id: 'progress-bar', label: 'Progress Bar', icon: 'progress-bar' },
    { id: 'scroll-panel', label: 'Scroll Panel', icon: 'scroll-panel' },
    { id: 'skeleton', label: 'Skeleton', icon: 'skeleton' },
    { id: 'spinner', label: 'Spinner', icon: 'spinner' },
    { id: 'stepper', label: 'Stepper', icon: 'stepper' },
    { id: 'splitter', label: 'Splitter', icon: 'splitter' },
    { id: 'tag', label: 'Tag', icon: 'tag' },
    { id: 'toast', label: 'Toast', icon: 'toast' },
    { id: 'tree', label: 'Tree', icon: 'tree' },
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
