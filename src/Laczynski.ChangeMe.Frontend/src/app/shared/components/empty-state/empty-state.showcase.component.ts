import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent } from './empty-state.component';
import { QuickAction } from '../utils';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-empty-state-showcase',
  imports: [CommonModule, EmptyStateComponent, ButtonComponent, IconComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Empty State Component</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Empty State component built with Fluent 2 Design System. The
        Empty State component is used to display a message when there is no data to show, guiding
        users on what to do next.
      </p>

      <!-- Basic Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Empty State</h2>
        <p class="showcase__section__description">Simple empty state with title and description.</p>
        <div class="showcase__preview">
          <app-empty-state
            title="No items found"
            description="There are no items to display at this time."
          />
        </div>
      </div>

      <!-- With Icon -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Empty State with Icon</h2>
        <p class="showcase__section__description">
          Empty state with an icon to provide visual context.
        </p>
        <div class="showcase__preview">
          <app-empty-state
            title="No documents"
            description="You don't have any documents yet. Start by creating your first document."
            icon="document"
          />
        </div>
      </div>

      <!-- With Primary Action -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Empty State with Primary Action</h2>
        <p class="showcase__section__description">
          Empty state with a primary action button to guide users.
        </p>
        <div class="showcase__preview">
          <app-empty-state
            title="No items yet"
            description="Get started by adding your first item to the list."
            icon="add"
            [primaryAction]="primaryActionOnly()"
            (actionClick)="onActionClick($event)"
          />
        </div>
      </div>

      <!-- With Both Actions -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Empty State with Primary and Secondary Actions</h2>
        <p class="showcase__section__description">
          Empty state with both primary and secondary action buttons.
        </p>
        <div class="showcase__preview">
          <app-empty-state
            title="No data available"
            description="You can import data from a file or create new entries manually."
            icon="database"
            [primaryAction]="primaryAction()"
            [secondaryAction]="secondaryAction()"
            (actionClick)="onActionClick($event)"
          />
        </div>
      </div>

      <!-- Different Sizes -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Empty State Sizes</h2>
        <p class="showcase__section__description">
          Empty state component in different sizes: small, medium, and large.
        </p>
        <div class="showcase__preview">
          <div class="showcase__preview-item">
            <h3>Small</h3>
            <app-empty-state
              title="No results"
              description="Try adjusting your search criteria."
              icon="search"
              size="small"
            />
          </div>
          <div class="showcase__preview-item">
            <h3>Medium</h3>
            <app-empty-state
              title="No results"
              description="Try adjusting your search criteria."
              icon="search"
              size="medium"
            />
          </div>
          <div class="showcase__preview-item">
            <h3>Large</h3>
            <app-empty-state
              title="No results"
              description="Try adjusting your search criteria."
              icon="search"
              size="large"
            />
          </div>
        </div>
      </div>

      <!-- With Custom Icon -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Empty State with Custom Icon</h2>
        <p class="showcase__section__description">
          Empty state with a custom icon template for more complex visuals.
        </p>
        <div class="showcase__preview">
          <app-empty-state
            title="No notifications"
            description="You're all caught up! No new notifications."
          >
            <ng-template #customIcon>
              <div
                style="width: 64px; height: 64px; border-radius: 50%; background: var(--Neutral-Background-hover, #F3F2F1); display: flex; align-items: center; justify-content: center;"
              >
                <app-icon icon="checkmark_circle" size="large" />
              </div>
            </ng-template>
          </app-empty-state>
        </div>
      </div>

      <!-- With Custom Content -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Empty State with Custom Content</h2>
        <p class="showcase__section__description">
          Empty state with custom content projection for advanced use cases.
        </p>
        <div class="showcase__preview">
          <app-empty-state title="Custom layout">
            <ng-template #customContent>
              <div style="text-align: center; padding: 16px;">
                <p style="margin-bottom: 16px;">You can add any custom content here</p>
                <div style="display: flex; gap: 8px; justify-content: center;">
                  <app-button variant="outline" size="small">Learn More</app-button>
                  <app-button variant="primary" size="small">Get Started</app-button>
                </div>
              </div>
            </ng-template>
          </app-empty-state>
        </div>
      </div>

      <!-- Different Use Cases -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Use Case Examples</h2>
        <p class="showcase__section__description">
          Various empty state examples for different scenarios.
        </p>
        <div class="showcase__preview">
          <div class="showcase__preview-item">
            <h3>No Search Results</h3>
            <app-empty-state
              title="No results found"
              description="We couldn't find anything matching your search. Try different keywords."
              icon="search_off"
              [primaryAction]="searchAction()"
              (actionClick)="onActionClick($event)"
            />
          </div>
          <div class="showcase__preview-item">
            <h3>Empty List</h3>
            <app-empty-state
              title="Your list is empty"
              description="Add items to get started."
              icon="list"
              [primaryAction]="addAction()"
              (actionClick)="onActionClick($event)"
            />
          </div>
          <div class="showcase__preview-item">
            <h3>No Permissions</h3>
            <app-empty-state
              title="Access restricted"
              description="You don't have permission to view this content. Contact your administrator for access."
              icon="lock"
            />
          </div>
        </div>
      </div>

      <!-- Usage Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Usage Example</h2>
        <p class="showcase__section__description">
          Example of how to use the Empty State component in your application:
        </p>
        <div class="showcase__code">
          <pre><code>{{ usageExample }}</code></pre>
        </div>
      </div>
    </div>
  `,
})
export class EmptyStateShowcaseComponent {
  primaryActionOnly = signal<QuickAction>({
    label: 'Add Item',
    variant: 'primary',
    icon: 'add',
    action: () => {
      console.log('Primary action clicked');
      alert('Primary action clicked!');
    },
  });

  primaryAction = signal<QuickAction>({
    label: 'Import Data',
    variant: 'primary',
    icon: 'upload',
    action: () => {
      console.log('Import action clicked');
      alert('Import action clicked!');
    },
  });

  secondaryAction = signal<QuickAction>({
    label: 'Create Manually',
    variant: 'secondary',
    icon: 'add',
    action: () => {
      console.log('Create manually clicked');
      alert('Create manually clicked!');
    },
  });

  searchAction = signal<QuickAction>({
    label: 'Clear Search',
    variant: 'secondary',
    action: () => {
      console.log('Clear search clicked');
      alert('Clear search clicked!');
    },
  });

  addAction = signal<QuickAction>({
    label: 'Add First Item',
    variant: 'primary',
    icon: 'add',
    action: () => {
      console.log('Add item clicked');
      alert('Add item clicked!');
    },
  });

  usageExample = `// In your component
import { EmptyStateComponent } from '@shared/components/empty-state';
import { QuickAction } from '@shared/components/utils';

@Component({
  template: \`
    @if (items().length === 0) {
      <app-empty-state
        title="No items found"
        description="There are no items to display at this time."
        icon="document"
        [primaryAction]="addAction()"
        (actionClick)="onActionClick($event)"
      />
    } @else {
      <!-- Your content here -->
    }
  \`
})
export class MyComponent {
  items = signal([]);

  addAction = signal<QuickAction>({
    label: 'Add Item',
    variant: 'primary',
    icon: 'add',
    action: () => {
      // Handle add action
    },
  });

  onActionClick(action: QuickAction): void {
    console.log('Action clicked:', action.label);
  }
}`;

  onActionClick(action: QuickAction): void {
    console.log('Action clicked:', action.label);
  }
}

