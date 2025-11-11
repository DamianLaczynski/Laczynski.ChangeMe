import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingStateComponent } from './loading-state.component';
import { CardComponent } from '../card/card.component';
import { ButtonComponent } from '../button/button.component';
import { QuickAction } from '../utils';

@Component({
  selector: 'app-loading-state-showcase',
  imports: [CommonModule, LoadingStateComponent, CardComponent, ButtonComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Loading State Component</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Loading State component built with Fluent 2 Design System. The
        Loading State component is used to indicate that content is being loaded, providing visual
        feedback to users during asynchronous operations.
      </p>

      <!-- Basic Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Loading State</h2>
        <p class="showcase__section__description">Simple loading state with just a spinner.</p>
        <div class="showcase__preview">
          <app-loading-state />
        </div>
      </div>

      <!-- With Title -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Loading State with Title</h2>
        <p class="showcase__section__description">
          Loading state with a title to provide context about what is loading.
        </p>
        <div class="showcase__preview">
          <app-loading-state title="Loading data..." />
        </div>
      </div>

      <!-- With Title and Description -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Loading State with Title and Description</h2>
        <p class="showcase__section__description">
          Loading state with both title and description for more detailed information.
        </p>
        <div class="showcase__preview">
          <app-loading-state
            title="Loading your content"
            description="Please wait while we fetch the latest information for you."
          />
        </div>
      </div>

      <!-- Different Spinner Sizes -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Loading State with Different Spinner Sizes</h2>
        <p class="showcase__section__description">
          Loading state with different spinner sizes: small, medium, and large.
        </p>
        <div class="showcase__preview">
          <div class="showcase__preview-item">
            <h3>Small Spinner</h3>
            <app-loading-state title="Loading..." description="Fetching data" spinnerSize="small" />
          </div>
          <div class="showcase__preview-item">
            <h3>Medium Spinner</h3>
            <app-loading-state
              title="Loading..."
              description="Fetching data"
              spinnerSize="medium"
            />
          </div>
          <div class="showcase__preview-item">
            <h3>Large Spinner</h3>
            <app-loading-state title="Loading..." description="Fetching data" spinnerSize="large" />
          </div>
        </div>
      </div>

      <!-- Different Component Sizes -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Loading State Component Sizes</h2>
        <p class="showcase__section__description">
          Loading state component in different sizes: small, medium, and large.
        </p>
        <div class="showcase__preview">
          <div class="showcase__preview-item">
            <h3>Small</h3>
            <app-loading-state title="Loading data" description="Please wait..." size="small" />
          </div>
          <div class="showcase__preview-item">
            <h3>Medium</h3>
            <app-loading-state title="Loading data" description="Please wait..." size="medium" />
          </div>
          <div class="showcase__preview-item">
            <h3>Large</h3>
            <app-loading-state title="Loading data" description="Please wait..." size="large" />
          </div>
        </div>
      </div>

      <!-- With Custom Content -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Loading State with Custom Content</h2>
        <p class="showcase__section__description">
          Loading state with custom content projection for advanced use cases.
        </p>
        <div class="showcase__preview">
          <app-loading-state title="Initializing application">
            <ng-template #content>
              <div style="text-align: center; padding: 16px;">
                <p style="margin-bottom: 16px;">Setting up your environment...</p>
                <div style="display: flex; gap: 8px; justify-content: center;">
                  <span
                    style="font-size: 12px; color: var(--color-neutral-foreground2-rest, #605E5C);"
                    >Step 1 of 3</span
                  >
                </div>
              </div>
            </ng-template>
          </app-loading-state>
        </div>
      </div>

      <!-- Overlay Mode -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Overlay Mode</h2>
        <p class="showcase__section__description">
          Loading state can be displayed as an overlay on top of existing content, providing visual
          feedback while maintaining context of the content being loaded.
        </p>
        <div class="showcase__preview">
          <div class="showcase__preview-item">
            <h3>Overlay with Blur</h3>
            <app-loading-state
              [overlay]="true"
              [blurContent]="true"
              title="Loading content"
              description="Please wait..."
            >
              <app-card
                title="Sample Content"
                bodyText="This content will be covered by the loading overlay. The blur effect helps draw attention to the loading state."
                [showFooter]="false"
                style="filled"
              />
            </app-loading-state>
          </div>
          <div class="showcase__preview-item">
            <h3>Overlay without Blur</h3>
            <app-loading-state
              [overlay]="true"
              [blurContent]="false"
              title="Processing..."
              description="This may take a moment"
            >
              <app-card
                title="Sample Content"
                bodyText="This content is visible through the overlay without blur, allowing users to see what's being loaded."
                [showFooter]="false"
                style="outline"
              />
            </app-loading-state>
          </div>
        </div>
      </div>

      <!-- Overlay with Table -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Overlay on Table</h2>
        <p class="showcase__section__description">
          Loading overlay can be applied to tables while data is being fetched or updated.
        </p>
        <div class="showcase__preview">
          <app-loading-state [overlay]="true" title="Loading data" spinnerSize="medium">
            <table
              style="width: 100%; border-collapse: collapse; background: var(--Neutral-Background-rest, #FFFFFF);"
            >
              <thead>
                <tr style="background: var(--Neutral-Background-hover, #F3F2F1);">
                  <th
                    style="padding: 12px; text-align: left; border-bottom: 1px solid var(--Neutral-Stroke-rest, #EDEBE9);"
                  >
                    Name
                  </th>
                  <th
                    style="padding: 12px; text-align: left; border-bottom: 1px solid var(--Neutral-Stroke-rest, #EDEBE9);"
                  >
                    Email
                  </th>
                  <th
                    style="padding: 12px; text-align: left; border-bottom: 1px solid var(--Neutral-Stroke-rest, #EDEBE9);"
                  >
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style="padding: 12px; border-bottom: 1px solid var(--Neutral-Stroke-rest, #EDEBE9);"
                  >
                    John Doe
                  </td>
                  <td
                    style="padding: 12px; border-bottom: 1px solid var(--Neutral-Stroke-rest, #EDEBE9);"
                  >
                    john&#64;example.com
                  </td>
                  <td
                    style="padding: 12px; border-bottom: 1px solid var(--Neutral-Stroke-rest, #EDEBE9);"
                  >
                    Admin
                  </td>
                </tr>
                <tr>
                  <td
                    style="padding: 12px; border-bottom: 1px solid var(--Neutral-Stroke-rest, #EDEBE9);"
                  >
                    Jane Smith
                  </td>
                  <td
                    style="padding: 12px; border-bottom: 1px solid var(--Neutral-Stroke-rest, #EDEBE9);"
                  >
                    jane&#64;example.com
                  </td>
                  <td
                    style="padding: 12px; border-bottom: 1px solid var(--Neutral-Stroke-rest, #EDEBE9);"
                  >
                    User
                  </td>
                </tr>
              </tbody>
            </table>
          </app-loading-state>
        </div>
      </div>

      <!-- Overlay with Card -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Overlay on Card</h2>
        <p class="showcase__section__description">
          Loading overlay can be applied to cards or other content containers.
        </p>
        <div class="showcase__preview">
          <div
            style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;"
          >
            <app-loading-state
              [overlay]="true"
              title="Updating..."
              description="Saving your changes"
              spinnerSize="small"
              size="small"
            >
              <app-card
                title="Card Title"
                bodyText="This is a sample card with content that will be covered by the loading overlay."
                [primaryAction]="cardAction()"
                style="filled"
              />
            </app-loading-state>
          </div>
        </div>
      </div>

      <!-- Full Screen Overlay -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Full Screen Overlay</h2>
        <p class="showcase__section__description">
          Loading state can be displayed as a full screen overlay that covers the entire viewport,
          useful for page-level loading states or blocking operations.
        </p>
        <div class="showcase__preview">
          <div class="showcase__preview-item">
            <h3>Full Screen Loading</h3>
            <p style="margin-bottom: 16px; color: var(--color-neutral-foreground2-rest, #605E5C);">
              Click the button below to demonstrate full screen loading overlay:
            </p>
            <app-button variant="primary" (click)="showFullScreenDemo()">
              Show Full Screen Loading
            </app-button>
            @if (showFullScreen()) {
              <app-loading-state
                [overlay]="true"
                [fullScreen]="true"
                [blurContent]="true"
                title="Loading application"
                description="Please wait while we initialize everything for you..."
                spinnerSize="large"
                size="large"
              />
            }
          </div>
        </div>
      </div>

      <!-- Different Use Cases -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Use Case Examples</h2>
        <p class="showcase__section__description">
          Various loading state examples for different scenarios.
        </p>
        <div class="showcase__preview">
          <div class="showcase__preview-item">
            <h3>Page Loading</h3>
            <app-loading-state
              title="Loading page"
              description="Please wait while we load the content"
              spinnerSize="large"
              size="large"
            />
          </div>
          <div class="showcase__preview-item">
            <h3>Data Fetching</h3>
            <app-loading-state
              title="Fetching data"
              description="Retrieving information from the server"
              spinnerSize="medium"
            />
          </div>
          <div class="showcase__preview-item">
            <h3>Form Submission</h3>
            <app-loading-state
              title="Submitting form"
              description="Please wait while we process your request"
              spinnerSize="small"
              size="small"
            />
          </div>
        </div>
      </div>

      <!-- Usage Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Usage Example</h2>
        <p class="showcase__section__description">
          Example of how to use the Loading State component in your application:
        </p>
        <div class="showcase__code">
          <pre><code>{{ usageExample }}</code></pre>
        </div>
      </div>
    </div>
  `,
})
export class LoadingStateShowcaseComponent {
  showFullScreen = signal<boolean>(false);

  cardAction = signal<QuickAction>({
    label: 'Action Button',
    variant: 'primary',
    action: () => {
      console.log('Card action clicked');
    },
  });

  showFullScreenDemo(): void {
    this.showFullScreen.set(true);
    // Simulate loading for 3 seconds
    setTimeout(() => {
      this.showFullScreen.set(false);
    }, 3000);
  }

  usageExample = `// In your component
import { LoadingStateComponent } from '@shared/components/loading-state';

@Component({
  template: \`
    <!-- Standard loading state -->
    @if (isLoading() && !showContent()) {
      <app-loading-state
        title="Loading data"
        description="Please wait while we fetch the information"
        spinnerSize="medium"
        size="medium"
      />
    }

    <!-- Container overlay loading state -->
    @if (isLoading() && showContent() && !fullScreen()) {
      <app-loading-state
        [overlay]="true"
        [blurContent]="true"
        title="Loading..."
        description="Updating content"
        spinnerSize="medium"
      >
        <!-- Your existing content -->
        <div class="content">
          <h2>Content Title</h2>
          <p>This content will be covered by the loading overlay.</p>
        </div>
      </app-loading-state>
    }

    <!-- Full screen loading state -->
    @if (isLoading() && fullScreen()) {
      <app-loading-state
        [overlay]="true"
        [fullScreen]="true"
        [blurContent]="true"
        title="Loading application"
        description="Please wait while we initialize everything..."
        spinnerSize="large"
        size="large"
      />
    }

    @if (!isLoading()) {
      <!-- Your loaded content -->
      <div class="content">
        <!-- Content here -->
      </div>
    }
  \`
})
export class MyComponent {
  isLoading = signal(false);
  showContent = signal(true);
  fullScreen = signal(false);

  loadData(): void {
    this.isLoading.set(true);
    this.fullScreen.set(true); // Use full screen for initial page load
    // Load data logic
    this.dataService.getData().subscribe({
      next: (data) => {
        this.data.set(data);
        this.isLoading.set(false);
        this.fullScreen.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.fullScreen.set(false);
        // Handle error
      }
    });
  }

  updateData(): void {
    this.isLoading.set(true);
    this.fullScreen.set(false); // Use container overlay for updates
    // Update data logic
    this.dataService.updateData().subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        // Handle error
      }
    });
  }
}`;
}
