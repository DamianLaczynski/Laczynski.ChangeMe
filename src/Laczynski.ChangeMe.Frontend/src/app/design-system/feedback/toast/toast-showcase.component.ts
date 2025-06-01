import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToastComponent } from './toast.component';
import { ToastVariant, TOAST_VARIANTS } from './toast.model';

import {
  ShowcaseComponent,
  createShowcaseConfig,
  ShowcaseConfig,
  ComponentApiDocumentation,
} from '../../models/showcase.model';

@Component({
  selector: 'ds-toast-showcase',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    <div class="showcase-container">
      <div class="showcase-header">
        <h1>{{ showcaseConfig().component.componentName }}</h1>
        <p class="showcase-description">
          {{ showcaseConfig().component.description }}
        </p>
      </div>

      <section class="showcase-section">
        <h2>Variants</h2>
        <div class="showcase-grid">
          @for (variant of toastVariants; track variant.name) {
            <div class="showcase-item">
              <h3>{{ variant.label }}</h3>
              <ds-toast
                [variant]="variant.name"
                title="Sample Title"
                message="This is a sample toast message."
              />
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styleUrl: '../../shared/styles/showcase.scss',
})
export class ToastShowcaseComponent implements ShowcaseComponent {
  componentName = 'Toast Component';
  description = 'Notification component for displaying temporary messages with different variants.';

  readonly toastVariants = Object.values(TOAST_VARIANTS);

  readonly showcaseConfig = computed<ShowcaseConfig>(() => {
    const componentInfo: ShowcaseComponent = {
      componentName: this.componentName,
      description: this.description,
    };

    const apiDocumentation: ComponentApiDocumentation = {
      inputs: [
        {
          name: 'variant',
          type: "'success' | 'error' | 'warning' | 'info'",
          defaultValue: "'info'",
          description: 'Toast style variant',
        },
        {
          name: 'title',
          type: 'string',
          defaultValue: "''",
          description: 'Toast title',
        },
        {
          name: 'message',
          type: 'string',
          defaultValue: "''",
          description: 'Toast message content',
        },
      ],
      outputs: [
        {
          name: 'closed',
          type: 'void',
          description: 'Emitted when toast is closed',
        },
      ],
      methods: [],
    };

    return createShowcaseConfig(componentInfo, apiDocumentation);
  });
}
