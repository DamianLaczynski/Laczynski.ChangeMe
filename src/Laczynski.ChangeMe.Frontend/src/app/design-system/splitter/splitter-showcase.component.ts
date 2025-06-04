// =============================================================================
// Splitter Showcase Component
// =============================================================================
// Interactive demonstrations and documentation for the Splitter component

import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SplitterComponent } from './splitter.component';
import {
  SplitterOrientation,
  SplitterHandleVariant,
  SplitterResizeEvent,
  SplitterResizeStartEvent,
  SplitterResizeEndEvent,
} from './splitter.model';

import { ApiDocumentationComponent } from '../showcases/api-documentation';
import {
  InteractiveConfigChangeEvent,
  InteractiveExampleComponent,
  InteractiveExampleConfig,
} from '../showcases/interactive-example';
import {
  createCheckboxControl,
  createSelectControl,
  createNumberControl,
} from '../showcases/interactive-example';

import {
  ShowcaseComponent,
  createShowcaseConfig,
  ComponentApiDocumentation,
  ShowcaseConfig,
} from '../showcases/showcase.model';

// =============================================================================
// SPLITTER INTERACTIVE CONFIG TYPE
// =============================================================================

interface SplitterInteractiveConfig {
  orientation: SplitterOrientation;
  handleVariant: SplitterHandleVariant;
  resizable: boolean;
  minSize: number;
  maxSize: number;
  showHandle: boolean;
  panelCount: number;
}

/**
 * Splitter Component Showcase
 *
 * Demonstrates all variants, states, and features of the Splitter component
 * with interactive controls and comprehensive documentation.
 */
@Component({
  selector: 'splitter-showcase',
  standalone: true,
  imports: [
    CommonModule,
    SplitterComponent,
    ApiDocumentationComponent,
    InteractiveExampleComponent,
  ],
  template: `
    <div class="showcase-container">
      <!-- Header -->
      <div class="showcase-header">
        <h1>{{ showcaseConfig().component.componentName }}</h1>
        <p class="showcase-description">{{ showcaseConfig().component.description }}</p>
      </div>

      <!-- Interactive Example -->
      <ds-interactive-example
        [config]="interactiveConfig()"
        [currentConfig]="currentInteractiveConfig()"
        [lastAction]="lastAction"
        (configChange)="onInteractiveConfigChange($event)"
      >
        <div class="interactive-splitter-container">
          <ds-splitter
            [orientation]="currentInteractiveConfig().orientation"
            [handleVariant]="currentInteractiveConfig().handleVariant"
            [resizable]="currentInteractiveConfig().resizable"
            [minSize]="currentInteractiveConfig().minSize"
            [maxSize]="currentInteractiveConfig().maxSize"
            [showHandle]="currentInteractiveConfig().showHandle"
            [panelCount]="currentInteractiveConfig().panelCount"
            [initialSizes]="[50, 50]"
            (panelResize)="onPlaygroundPanelResize($event)"
            (resizeStart)="onPlaygroundResizeStart($event)"
            (resizeEnd)="onPlaygroundResizeEnd($event)"
          >
            <div data-panel-index="0" class="demo-panel demo-panel--primary">
              <h5>Panel 1</h5>
              <p>Interactive Panel Content</p>
              <p>Current size: {{ playgroundPanelSizes()[0] | number: '1.1-1' }}%</p>
            </div>
            <div data-panel-index="1" class="demo-panel demo-panel--secondary">
              <h5>Panel 2</h5>
              <p>Responds to Panel 1 changes</p>
              <p>Current size: {{ playgroundPanelSizes()[1] | number: '1.1-1' }}%</p>
              <div class="event-log">
                <h6>Recent Events:</h6>
                <div class="event-list">
                  @for (event of eventLog(); track $index) {
                    <div class="event-item">{{ event }}</div>
                  }
                </div>
              </div>
            </div>
            @if (currentInteractiveConfig().panelCount > 2) {
              <div data-panel-index="2" class="demo-panel demo-panel--accent">
                <h5>Panel 3</h5>
                <p>Third panel content</p>
              </div>
            }
          </ds-splitter>
        </div>
      </ds-interactive-example>

      <!-- Orientations Section -->
      <section class="showcase-section">
        <h2>Orientations</h2>
        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Horizontal</h3>
            <div class="example-container">
              <ds-splitter orientation="horizontal" [initialSizes]="[60, 40]" [resizable]="true">
                <div data-panel-index="0" class="example-panel example-panel--primary">
                  <h5>Left Panel</h5>
                  <p>Horizontal splitter content</p>
                </div>
                <div data-panel-index="1" class="example-panel example-panel--secondary">
                  <h5>Right Panel</h5>
                  <p>Adjusts automatically</p>
                </div>
              </ds-splitter>
            </div>
          </div>

          <div class="showcase-item">
            <h3>Vertical</h3>
            <div class="example-container">
              <ds-splitter orientation="vertical" [initialSizes]="[70, 30]" [resizable]="true">
                <div data-panel-index="0" class="example-panel example-panel--primary">
                  <h5>Top Panel</h5>
                  <p>Vertical splitter content</p>
                </div>
                <div data-panel-index="1" class="example-panel example-panel--secondary">
                  <h5>Bottom Panel</h5>
                  <p>Bottom content area</p>
                </div>
              </ds-splitter>
            </div>
          </div>
        </div>
      </section>

      <!-- Handle Variants Section -->
      <section class="showcase-section">
        <h2>Handle Variants</h2>
        <div class="showcase-grid">
          @for (variant of handleVariants; track variant) {
            <div class="showcase-item">
              <h3>{{ variant | titlecase }}</h3>
              <div class="example-container">
                <ds-splitter
                  orientation="horizontal"
                  [handleVariant]="variant"
                  [initialSizes]="[50, 50]"
                  [resizable]="true"
                >
                  <div data-panel-index="0" class="example-panel example-panel--primary">
                    <p>Panel 1</p>
                  </div>
                  <div data-panel-index="1" class="example-panel example-panel--secondary">
                    <p>Panel 2</p>
                  </div>
                </ds-splitter>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Multi-Panel Layouts Section -->
      <section class="showcase-section">
        <h2>Multi-Panel Layouts</h2>
        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Three Panel Layout</h3>
            <div class="example-container">
              <ds-splitter
                orientation="horizontal"
                [panelCount]="3"
                [initialSizes]="[25, 50, 25]"
                [resizable]="true"
              >
                <div data-panel-index="0" class="example-panel example-panel--primary">
                  <h5>Sidebar</h5>
                  <p>Navigation</p>
                </div>
                <div data-panel-index="1" class="example-panel example-panel--secondary">
                  <h5>Main</h5>
                  <p>Content area</p>
                </div>
                <div data-panel-index="2" class="example-panel example-panel--accent">
                  <h5>Tools</h5>
                  <p>Tool panel</p>
                </div>
              </ds-splitter>
            </div>
          </div>

          <div class="showcase-item">
            <h3>Four Panel Layout</h3>
            <div class="example-container">
              <ds-splitter
                orientation="horizontal"
                [panelCount]="4"
                [initialSizes]="[20, 30, 30, 20]"
                [resizable]="true"
              >
                <div data-panel-index="0" class="example-panel example-panel--primary">
                  <h5>Nav</h5>
                  <p>Navigation</p>
                </div>
                <div data-panel-index="1" class="example-panel example-panel--secondary">
                  <h5>Sidebar</h5>
                  <p>Tools panel</p>
                </div>
                <div data-panel-index="2" class="example-panel example-panel--accent">
                  <h5>Main</h5>
                  <p>Content area</p>
                </div>
                <div data-panel-index="3" class="example-panel example-panel--primary">
                  <h5>Info</h5>
                  <p>Details panel</p>
                </div>
              </ds-splitter>
            </div>
          </div>
        </div>
      </section>

      <!-- API Documentation -->
      <ds-api-documentation [api]="showcaseConfig().api"></ds-api-documentation>
    </div>
  `,
  styles: [
    `
      .showcase-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .showcase-header {
        text-align: center;
        margin-bottom: 3rem;

        h1 {
          font-size: 2.5rem;
          font-weight: var(--font-weight-bold);
          color: var(--color-text);
          margin-bottom: 1rem;
        }

        .showcase-description {
          font-size: 1.125rem;
          color: var(--color-text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }
      }

      .showcase-section {
        margin-bottom: 3rem;

        h2 {
          font-size: 1.75rem;
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
          margin-bottom: 1.5rem;
          border-bottom: 2px solid var(--color-border);
          padding-bottom: 0.5rem;
        }
      }

      .showcase-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2rem;
      }

      .showcase-item {
        h3 {
          font-size: 1.25rem;
          font-weight: var(--font-weight-medium);
          color: var(--color-text);
          margin-bottom: 1rem;
        }
      }

      .example-container,
      .interactive-splitter-container {
        height: 300px;
        border: 2px solid var(--color-border);
        border-radius: var(--border-radius-md);
        overflow: hidden;
      }

      .example-panel,
      .demo-panel {
        padding: 1rem;
        height: 100%;

        &--primary {
          background-color: var(--color-primary-light);
          border-color: var(--color-primary);
        }

        &--secondary {
          background-color: var(--color-secondary-light);
          border-color: var(--color-secondary);
        }

        &--accent {
          background-color: var(--color-info-light);
          border-color: var(--color-info);
        }

        h5 {
          margin: 0 0 0.5rem 0;
          font-weight: var(--font-weight-medium);
          color: var(--color-text);
        }

        p {
          margin: 0 0 0.5rem 0;
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
        }
      }

      .event-log {
        margin-top: 1rem;
        padding: 0.75rem;
        background-color: var(--color-gray-50);
        border-radius: var(--border-radius-sm);

        h6 {
          margin: 0 0 0.5rem 0;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
        }
      }

      .event-list {
        max-height: 100px;
        overflow-y: auto;
      }

      .event-item {
        font-size: var(--font-size-xs);
        color: var(--color-text-muted);
        margin-bottom: 0.25rem;
        font-family: var(--font-family-mono);
      }
    `,
  ],
})
export class SplitterShowcaseComponent implements ShowcaseComponent {
  // =============================================================================
  // SHOWCASE COMPONENT IMPLEMENTATION
  // =============================================================================

  componentName = 'Splitter Component';
  description =
    'Resizable panel splitter component with horizontal and vertical orientations, supporting multiple panels and keyboard navigation.';

  private lastActionSignal = signal<string>('');

  get lastAction(): string {
    return this.lastActionSignal();
  }

  // =============================================================================
  // COMPONENT VARIANTS
  // =============================================================================

  handleVariants: SplitterHandleVariant[] = ['default', 'ghost', 'accent'];
  orientations: SplitterOrientation[] = ['horizontal', 'vertical'];

  // =============================================================================
  // INTERACTIVE CONFIG
  // =============================================================================

  private interactiveConfigSignal = signal<SplitterInteractiveConfig>({
    orientation: 'horizontal',
    handleVariant: 'default',
    resizable: true,
    minSize: 10,
    maxSize: 90,
    showHandle: true,
    panelCount: 2,
  });

  readonly currentInteractiveConfig = computed(() => this.interactiveConfigSignal());

  readonly interactiveConfig = computed<InteractiveExampleConfig>(() => ({
    title: 'Interactive Splitter Example',
    description:
      'Adjust the controls below to see how the splitter behaves with different configurations.',
    controls: [
      createSelectControl('orientation', 'Orientation', 'orientation', [
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'vertical', label: 'Vertical' },
      ]),
      createSelectControl('handleVariant', 'Handle Variant', 'handleVariant', [
        { value: 'default', label: 'Default' },
        { value: 'ghost', label: 'Ghost' },
        { value: 'accent', label: 'Accent' },
      ]),
      createCheckboxControl('resizable', 'Resizable', 'resizable'),
      createNumberControl('minSize', 'Min Size (%)', 'minSize', { min: 5, max: 50 }),
      createNumberControl('maxSize', 'Max Size (%)', 'maxSize', { min: 50, max: 95 }),
      createNumberControl('panelCount', 'Panel Count', 'panelCount', { min: 2, max: 4 }),
    ],
  }));

  // =============================================================================
  // PLAYGROUND STATE
  // =============================================================================

  playgroundPanelSizes = signal<number[]>([50, 50]);
  eventLog = signal<string[]>([]);

  // =============================================================================
  // SHOWCASE CONFIG
  // =============================================================================

  readonly showcaseConfig = computed<ShowcaseConfig>(() => {
    const apiDocumentation: ComponentApiDocumentation = {
      inputs: [
        {
          name: 'orientation',
          type: 'SplitterOrientation',
          defaultValue: "'horizontal'",
          description: 'Orientation of the splitter (horizontal or vertical)',
          required: false,
        },
        {
          name: 'resizable',
          type: 'boolean',
          defaultValue: 'true',
          description: 'Whether the splitter panels can be resized',
          required: false,
        },
        {
          name: 'minSize',
          type: 'number',
          defaultValue: '10',
          description: 'Minimum panel size as percentage',
          required: false,
        },
        {
          name: 'maxSize',
          type: 'number',
          defaultValue: '90',
          description: 'Maximum panel size as percentage',
          required: false,
        },
        {
          name: 'initialSizes',
          type: 'number[]',
          defaultValue: '[50, 50]',
          description: 'Initial sizes for panels as percentages',
          required: false,
        },
        {
          name: 'handleSize',
          type: 'number',
          defaultValue: '4',
          description: 'Size of the resize handle in pixels',
          required: false,
        },
        {
          name: 'showHandle',
          type: 'boolean',
          defaultValue: 'true',
          description: 'Whether to show the resize handle',
          required: false,
        },
        {
          name: 'handleVariant',
          type: 'SplitterHandleVariant',
          defaultValue: "'default'",
          description: 'Visual variant of the resize handle',
          required: false,
        },
        {
          name: 'panelCount',
          type: 'number',
          defaultValue: '2',
          description: 'Number of panels in the splitter',
          required: false,
        },
      ],
      outputs: [
        {
          name: 'panelResize',
          type: 'SplitterResizeEvent',
          description: 'Emitted when a panel is resized',
        },
        {
          name: 'resizeStart',
          type: 'SplitterResizeStartEvent',
          description: 'Emitted when resize operation starts',
        },
        {
          name: 'resizeEnd',
          type: 'SplitterResizeEndEvent',
          description: 'Emitted when resize operation ends',
        },
      ],
    };

    return createShowcaseConfig(this, apiDocumentation);
  });

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  onInteractiveConfigChange(event: InteractiveConfigChangeEvent<SplitterInteractiveConfig>): void {
    this.interactiveConfigSignal.set(event.config);
    this.lastActionSignal.set(`Changed ${event.property} to ${event.value}`);
  }

  onPlaygroundPanelResize(event: SplitterResizeEvent): void {
    this.playgroundPanelSizes.set([...event.allSizes]);
    this.addEventLog(`Panel ${event.panelIndex + 1} resized to ${event.newSize.toFixed(1)}%`);
  }

  onPlaygroundResizeStart(event: SplitterResizeStartEvent): void {
    this.addEventLog(`Resize started on panel ${event.panelIndex + 1}`);
  }

  onPlaygroundResizeEnd(event: SplitterResizeEndEvent): void {
    this.addEventLog(
      `Resize ended on panel ${event.panelIndex + 1} at ${event.finalSize.toFixed(1)}%`,
    );
  }

  // =============================================================================
  // UTILITIES
  // =============================================================================

  private addEventLog(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `${timestamp}: ${message}`;

    this.eventLog.update(log => {
      const newLog = [logMessage, ...log];
      return newLog.slice(0, 10); // Keep only last 10 events
    });
  }
}
