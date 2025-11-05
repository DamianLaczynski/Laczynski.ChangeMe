import { Component, signal, viewChild, TemplateRef } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItem } from './breadcrumb.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-breadcrumb-showcase',
  imports: [BreadcrumbComponent, CommonModule, ButtonComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Breadcrumb Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Breadcrumb component built with Fluent 2 Design System.
        Breadcrumbs support multiple sizes, appearances, selection indicators, quick actions, and
        can be customized with various options inherited from the Node component.
      </p>

      <!-- ========================================= -->
      <!-- BASIC BREADCRUMBS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Breadcrumbs</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Basic Breadcrumb</h3>
            <app-breadcrumb [items]="basicBreadcrumb()" />
          </div>
          <div class="showcase__item">
            <h3>Breadcrumb with Icons</h3>
            <app-breadcrumb [items]="breadcrumbWithIcons()" [showIcons]="true" />
          </div>
          <div class="showcase__item">
            <h3>Breadcrumb without Icons</h3>
            <app-breadcrumb [items]="breadcrumbWithIcons()" [showIcons]="false" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- SIZE VARIANTS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Small</h3>
            <app-breadcrumb [items]="sizeBreadcrumb()" size="small" />
          </div>
          <div class="showcase__item">
            <h3>Medium</h3>
            <app-breadcrumb [items]="sizeBreadcrumb()" size="medium" />
          </div>
          <div class="showcase__item">
            <h3>Large (Default)</h3>
            <app-breadcrumb [items]="sizeBreadcrumb()" size="large" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- APPEARANCE VARIANTS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Appearance Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Transparent (Default)</h3>
            <app-breadcrumb [items]="appearanceBreadcrumb()" variant="transparent" />
          </div>
          <div class="showcase__item">
            <h3>Subtle</h3>
            <app-breadcrumb [items]="appearanceBreadcrumb()" variant="subtle" />
          </div>
          <div class="showcase__item">
            <h3>Subtle Circular</h3>
            <app-breadcrumb [items]="appearanceBreadcrumb()" variant="subtle-circular" />
          </div>
          <div class="showcase__item">
            <h3>Filled Circular</h3>
            <app-breadcrumb [items]="appearanceBreadcrumb()" variant="filled-circular" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- SELECTION INDICATORS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Selection Indicators</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Horizontal Indicator (Selected Item)</h3>
            <app-breadcrumb
              [items]="selectedBreadcrumb()"
              [showSelectionIndicator]="true"
              indicatorPosition="horizontal"
            />
          </div>
          <div class="showcase__item">
            <h3>Vertical Indicator (Selected Item)</h3>
            <app-breadcrumb
              [items]="selectedBreadcrumb()"
              [showSelectionIndicator]="true"
              indicatorPosition="vertical"
            />
          </div>
          <div class="showcase__item">
            <h3>No Selection Indicator</h3>
            <app-breadcrumb
              [items]="selectedBreadcrumb()"
              [showSelectionIndicator]="false"
            />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- BEHAVIOR CONFIGURATION -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Behavior Configuration</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>As Button (Default: true)</h3>
            <p style="margin-bottom: 8px; font-size: 12px; color: #666;">
              Nodes are rendered as button elements
            </p>
            <app-breadcrumb [items]="behaviorBreadcrumb()" [asButton]="true" />
          </div>
          <div class="showcase__item">
            <h3>As Div (asButton: false)</h3>
            <p style="margin-bottom: 8px; font-size: 12px; color: #666;">
              Nodes are rendered as div elements
            </p>
            <app-breadcrumb [items]="behaviorBreadcrumb()" [asButton]="false" />
          </div>
          <div class="showcase__item">
            <h3>Select On Click (false - Default)</h3>
            <p style="margin-bottom: 8px; font-size: 12px; color: #666;">
              Click only - will emit only click event, not select
            </p>
            <app-breadcrumb
              [items]="selectableBreadcrumb()"
              [selectOnClick]="false"
              (itemClick)="onItemClick($event)"
            />
            <p style="margin-top: 8px; font-size: 12px;">
              Clicked: {{ lastClickedItem() }}
            </p>
          </div>
          <div class="showcase__item">
            <h3>Select On Click (true)</h3>
            <p style="margin-bottom: 8px; font-size: 12px; color: #666;">
              Click to select - will emit both click and select events
            </p>
            <app-breadcrumb
              [items]="selectableBreadcrumb()"
              [selectOnClick]="true"
              (itemClick)="onItemClick($event)"
            />
            <p style="margin-top: 8px; font-size: 12px;">
              Clicked: {{ lastClickedItem() }}
            </p>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- QUICK ACTIONS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Quick Actions</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>With Quick Actions Template</h3>
            <app-breadcrumb
              [items]="quickActionsBreadcrumb()"
              [showQuickActions]="true"
              [quickActionsTemplate]="quickActionsTemplate"
            />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- STATE VARIANTS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Normal Items</h3>
            <app-breadcrumb [items]="normalBreadcrumb()" />
          </div>
          <div class="showcase__item">
            <h3>Disabled Item</h3>
            <app-breadcrumb [items]="disabledBreadcrumb()" />
          </div>
          <div class="showcase__item">
            <h3>Selected Item</h3>
            <app-breadcrumb [items]="selectedItemBreadcrumb()" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- COMBINED EXAMPLES -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Combined Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Small + Subtle Circular</h3>
            <app-breadcrumb
              [items]="combinedBreadcrumb()"
              size="small"
              variant="subtle-circular"
            />
          </div>
          <div class="showcase__item">
            <h3>Large + Filled Circular</h3>
            <app-breadcrumb
              [items]="combinedBreadcrumb()"
              size="large"
              variant="filled-circular"
            />
          </div>
          <div class="showcase__item">
            <h3>Medium + Subtle + Selection Indicator</h3>
            <app-breadcrumb
              [items]="selectedCombinedBreadcrumb()"
              size="medium"
              variant="subtle"
              [showSelectionIndicator]="true"
              indicatorPosition="horizontal"
            />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- REAL-WORLD EXAMPLES -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Real-World Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>File System Navigation</h3>
            <app-breadcrumb [items]="fileSystemBreadcrumb()" />
          </div>
          <div class="showcase__item">
            <h3>E-commerce Category</h3>
            <app-breadcrumb [items]="ecommerceBreadcrumb()" />
          </div>
          <div class="showcase__item">
            <h3>Settings Navigation</h3>
            <app-breadcrumb [items]="settingsBreadcrumb()" size="small" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- EVENT LOGGING -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Event Logging</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Interactive Breadcrumb</h3>
            <app-breadcrumb
              [items]="interactiveBreadcrumb()"
              (itemClick)="onItemClick($event)"
            />
            <div style="margin-top: 16px;">
              <p><strong>Last Click Event:</strong> {{ lastClickEvent() }}</p>
              <p><strong>Click Count:</strong> {{ clickCount() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Template -->
      <ng-template #quickActionsTemplate let-item>
        <app-button
          variant="subtle"
          size="small"
          [iconOnly]="true"
          icon="edit"
          (click)="onQuickActionClick(item, 'edit'); $event.stopPropagation()"
        ></app-button>
        <app-button
          variant="subtle"
          size="small"
          [iconOnly]="true"
          icon="delete"
          (click)="onQuickActionClick(item, 'delete'); $event.stopPropagation()"
        ></app-button>
      </ng-template>
    </div>
  `,
})
export class BreadcrumbShowcaseComponent {
  quickActionsTemplate = viewChild<TemplateRef<any>>('quickActionsTemplate');

  lastClickEvent = signal<string>('None');
  lastClickedItem = signal<string>('None');
  clickCount = signal<number>(0);

  // Basic breadcrumbs
  basicBreadcrumb = signal<BreadcrumbItem[]>([
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'electronics', label: 'Electronics' },
  ]);

  breadcrumbWithIcons = signal<BreadcrumbItem[]>([
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'products', label: 'Products', icon: 'shopping_bag' },
    { id: 'electronics', label: 'Electronics', icon: 'devices' },
  ]);

  // Size breadcrumbs
  sizeBreadcrumb = signal<BreadcrumbItem[]>([
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'section', label: 'Section', icon: 'folder' },
    { id: 'page', label: 'Page', icon: 'description' },
  ]);

  // Appearance breadcrumbs
  appearanceBreadcrumb = signal<BreadcrumbItem[]>([
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'section', label: 'Section', icon: 'folder' },
    { id: 'page', label: 'Page', icon: 'description' },
  ]);

  // Selected breadcrumbs
  selectedBreadcrumb = signal<BreadcrumbItem[]>([
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'products', label: 'Products', icon: 'shopping_bag' },
    { id: 'electronics', label: 'Electronics', icon: 'devices', selected: true },
  ]);

  // Behavior breadcrumbs
  behaviorBreadcrumb = signal<BreadcrumbItem[]>([
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'section', label: 'Section', icon: 'folder' },
    { id: 'page', label: 'Page', icon: 'description' },
  ]);

  // Selectable breadcrumbs
  selectableBreadcrumb = signal<BreadcrumbItem[]>([
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'products', label: 'Products', icon: 'shopping_bag' },
    { id: 'electronics', label: 'Electronics', icon: 'devices' },
  ]);

  // Quick actions breadcrumb
  quickActionsBreadcrumb = signal<BreadcrumbItem[]>([
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'documents', label: 'Documents', icon: 'folder' },
    { id: 'project', label: 'Project', icon: 'description' },
  ]);

  // State breadcrumbs
  normalBreadcrumb = signal<BreadcrumbItem[]>([
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'section', label: 'Section', icon: 'folder' },
    { id: 'page', label: 'Page', icon: 'description' },
  ]);

  disabledBreadcrumb = signal<BreadcrumbItem[]>([
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'section', label: 'Section', icon: 'folder', disabled: true },
    { id: 'page', label: 'Page', icon: 'description' },
  ]);

  selectedItemBreadcrumb = signal<BreadcrumbItem[]>([
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'section', label: 'Section', icon: 'folder', selected: true },
    { id: 'page', label: 'Page', icon: 'description' },
  ]);

  // Combined breadcrumbs
  combinedBreadcrumb = signal<BreadcrumbItem[]>([
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'section', label: 'Section', icon: 'folder' },
    { id: 'page', label: 'Page', icon: 'description' },
  ]);

  selectedCombinedBreadcrumb = signal<BreadcrumbItem[]>([
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'products', label: 'Products', icon: 'shopping_bag' },
    { id: 'electronics', label: 'Electronics', icon: 'devices', selected: true },
  ]);

  // Real-world examples
  fileSystemBreadcrumb = signal<BreadcrumbItem[]>([
    { id: 'root', label: 'My Computer', icon: 'computer' },
    { id: 'users', label: 'Users', icon: 'people' },
    { id: 'john', label: 'John', icon: 'person' },
    { id: 'documents', label: 'Documents', icon: 'folder' },
    { id: 'projects', label: 'Projects', icon: 'folder_special' },
  ]);

  ecommerceBreadcrumb = signal<BreadcrumbItem[]>([
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'shop', label: 'Shop', icon: 'store' },
    { id: 'electronics', label: 'Electronics', icon: 'devices' },
    { id: 'phones', label: 'Phones', icon: 'phone_iphone' },
    { id: 'smartphones', label: 'Smartphones', icon: 'smartphone' },
  ]);

  settingsBreadcrumb = signal<BreadcrumbItem[]>([
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'account', label: 'Account', icon: 'account_circle' },
    { id: 'security', label: 'Security', icon: 'lock' },
  ]);

  // Interactive breadcrumb
  interactiveBreadcrumb = signal<BreadcrumbItem[]>([
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'products', label: 'Products', icon: 'shopping_bag' },
    { id: 'electronics', label: 'Electronics', icon: 'devices' },
    { id: 'laptops', label: 'Laptops', icon: 'laptop' },
  ]);

  // Event handlers
  onItemClick(item: BreadcrumbItem): void {
    this.lastClickEvent.set(`Clicked: ${item.label} (${item.id})`);
    this.lastClickedItem.set(item.label);
    this.clickCount.update(count => count + 1);
  }

  onQuickActionClick(item: BreadcrumbItem, action: string): void {
    this.lastClickEvent.set(`Quick Action: ${action} on ${item.label}`);
    this.clickCount.update(count => count + 1);
  }
}

