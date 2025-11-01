import { Component } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumb.component';
import { BreadcrumbItem } from './breadcrumb.component';

@Component({
  selector: 'app-breadcrumb-showcase',

  imports: [BreadcrumbComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Breadcrumb Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Breadcrumb component built with Fluent 2 Design System. All
        variants are responsive and accessible.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-breadcrumb
              [items]="breadcrumbsWithIcons"
              [size]="'large'"
              [showIcons]="true"
              (itemClick)="onBreadcrumbClick($event)"
            />
          </div>
          <div class="showcase__item">
            <app-breadcrumb
              [items]="breadcrumbsWithoutIcons"
              [size]="'large'"
              [showIcons]="false"
              (itemClick)="onBreadcrumbClick($event)"
            />
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Large Size</h3>
            <app-breadcrumb
              [items]="breadcrumbsMedium"
              [size]="'large'"
              [showIcons]="true"
              (itemClick)="onBreadcrumbClick($event)"
            />
          </div>
          <div class="showcase__item">
            <h3>Medium Size</h3>
            <app-breadcrumb
              [items]="breadcrumbsMedium"
              [size]="'medium'"
              [showIcons]="true"
              (itemClick)="onBreadcrumbClick($event)"
            />
          </div>
          <div class="showcase__item">
            <h3>Small Size</h3>
            <app-breadcrumb
              [items]="breadcrumbsSmall"
              [size]="'small'"
              [showIcons]="true"
              (itemClick)="onBreadcrumbClick($event)"
            />
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>With Disabled Item</h3>
            <app-breadcrumb
              [items]="breadcrumbsWithDisabled"
              [size]="'large'"
              [showIcons]="true"
              (itemClick)="onBreadcrumbClick($event)"
            />
          </div>
        </div>
      </div>

      <!-- Complex Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Complex Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Long Breadcrumb Path</h3>
            <app-breadcrumb
              [items]="longBreadcrumbs"
              [size]="'large'"
              [showIcons]="false"
              (itemClick)="onBreadcrumbClick($event)"
            />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BreadcrumbShowcaseComponent {
  // Breadcrumbs with icons
  breadcrumbsWithIcons: BreadcrumbItem[] = [
    { id: 1, label: 'Home', icon: 'home', url: '/' },
    { id: 2, label: 'Products', icon: 'projection_screen', url: '/products' },
    { id: 3, label: 'Electronics', icon: 'laptop', url: '/products/electronics' },
    { id: 4, label: 'Current Page', icon: 'star', current: true },
  ];

  // Breadcrumbs without icons
  breadcrumbsWithoutIcons: BreadcrumbItem[] = [
    { id: 1, label: 'Home', url: '/' },
    { id: 2, label: 'Products', url: '/products' },
    { id: 3, label: 'Current Page', current: true },
  ];

  // Medium size breadcrumbs
  breadcrumbsMedium: BreadcrumbItem[] = [
    { id: 1, label: 'Dashboard', icon: 'home' },
    { id: 2, label: 'Settings', icon: 'settings' },
    { id: 3, label: 'Profile', icon: 'person', current: true },
  ];

  // Small size breadcrumbs
  breadcrumbsSmall: BreadcrumbItem[] = [
    { id: 1, label: 'Root', icon: 'home' },
    { id: 2, label: 'Folder', icon: 'folder_open' },
    { id: 3, label: 'File', icon: 'document', current: true },
  ];

  // Breadcrumbs with disabled item
  breadcrumbsWithDisabled: BreadcrumbItem[] = [
    { id: 1, label: 'Home', icon: 'home', url: '/' },
    { id: 2, label: 'Disabled', icon: 'subtract_circle', disabled: true },
    { id: 3, label: 'Current Page', icon: 'star', current: true },
  ];

  // Long breadcrumb path
  longBreadcrumbs: BreadcrumbItem[] = [
    { id: 1, label: 'Home', url: '/' },
    { id: 2, label: 'Category', url: '/category' },
    { id: 3, label: 'Subcategory', url: '/category/sub' },
    { id: 4, label: 'Product Type', url: '/category/sub/type' },
    { id: 5, label: 'Product Details', url: '/category/sub/type/details' },
    { id: 6, label: 'Current Product', current: true },
  ];

  /**
   * Handle breadcrumb click event
   */
  onBreadcrumbClick(item: BreadcrumbItem): void {
    console.log('Breadcrumb clicked:', item);

    // In a real application, you would navigate to the URL
    if (item.url) {
      // this.router.navigate([item.url]);
      alert(`Navigating to: ${item.url}`);
    }
  }
}
