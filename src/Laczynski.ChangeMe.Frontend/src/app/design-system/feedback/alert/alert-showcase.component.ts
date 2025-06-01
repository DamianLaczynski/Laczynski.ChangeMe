import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert.component';
import { ALERT_VARIANTS } from './alert.model';
import {
  ShowcaseComponent,
  createShowcaseConfig,
  ShowcaseConfig,
  ComponentApiDocumentation,
} from '../../models/showcase.model';

@Component({
  selector: 'ds-alert-showcase',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  template: `
    <div class="showcase-container">
      <div class="showcase-header">
        <h1>{{ showcaseConfig().component.componentName }}</h1>
        <p class="showcase-description">{{ showcaseConfig().component.description }}</p>
      </div>

      <section class="showcase-section">
        <h2>Variants</h2>
        <div class="showcase-grid">
          @for (variant of alertVariants; track variant.name) {
            <div class="showcase-item">
              <h3>{{ variant.label }}</h3>
              <ds-alert [variant]="variant.name" title="Sample Alert">
                This is a sample {{ variant.label.toLowerCase() }} alert message.
              </ds-alert>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styleUrl: '../../shared/styles/showcase.scss',
})
export class AlertShowcaseComponent implements ShowcaseComponent {
  componentName = 'Alert Component';
  description = 'Alert component for displaying important messages and notifications.';

  readonly alertVariants = Object.values(ALERT_VARIANTS);

  readonly showcaseConfig = computed<ShowcaseConfig>(() => {
    const componentInfo: ShowcaseComponent = {
      componentName: this.componentName,
      description: this.description,
    };

    const apiDocumentation: ComponentApiDocumentation = {
      inputs: [
        {
          name: 'variant',
          type: 'AlertVariant',
          defaultValue: "'info'",
          description: 'Alert style variant',
        },
        {
          name: 'title',
          type: 'string',
          defaultValue: "''",
          description: 'Alert title',
        },
        {
          name: 'dismissible',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether alert can be dismissed',
        },
      ],
      outputs: [
        {
          name: 'dismissed',
          type: 'void',
          description: 'Emitted when alert is dismissed',
        },
      ],
      methods: [],
    };

    return createShowcaseConfig(componentInfo, apiDocumentation);
  });
}
