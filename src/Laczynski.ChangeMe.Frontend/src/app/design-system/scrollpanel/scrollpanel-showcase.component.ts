import { Component, computed, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ScrollPanelComponent } from './scrollpanel.component';
import {
  ScrollPanelSize,
  ScrollPanelState,
  ScrollDirection,
  ScrollEvent,
  ScrollEndEvent,
  ScrollEdgeEvent,
} from './scrollpanel.model';

import { ApiDocumentationComponent } from '../showcases/api-documentation';
import {
  InteractiveConfigChangeEvent,
  InteractiveExampleComponent,
  InteractiveExampleConfig,
} from '../showcases/interactive-example';
import {
  createCheckboxControl,
  createSelectControl,
  createTextControl,
} from '../showcases/interactive-example';

import {
  ShowcaseComponent,
  createShowcaseConfig,
  ComponentApiDocumentation,
  ShowcaseConfig,
} from '../showcases/showcase.model';

// =============================================================================
// SCROLLPANEL INTERACTIVE CONFIG TYPE
// =============================================================================

interface ScrollPanelInteractiveConfig {
  size: ScrollPanelSize;
  state: ScrollPanelState;
  scrollDirection: ScrollDirection;
  showScrollbars: boolean;
  autoHideScrollbars: boolean;
  customScrollbar: boolean;
  smoothScrolling: boolean;
  showScrollIndicators: boolean;
  loadingText: string;
  errorText: string;
}

/**
 * ScrollPanel Component Showcase
 *
 * Demonstrates all variants, states, and features of the ScrollPanel component
 * with interactive controls and comprehensive documentation.
 */
@Component({
  selector: 'ds-scrollpanel-showcase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollPanelComponent,
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

      <!-- Size Variants -->
      <section class="showcase-section">
        <h2>Size Variants</h2>
        <p>Different size variants for various contexts and content amounts.</p>
        <div class="showcase-grid">
          @for (size of sizes; track size) {
            <div class="showcase-item">
              <h3>{{ size | titlecase }}</h3>
              <ds-scrollpanel [size]="size">
                <div class="sample-content">
                  <p>Sample content for {{ size }} size variant.</p>
                  <p>Content that demonstrates scrolling behavior.</p>
                  <p>More content to enable vertical scrolling.</p>
                  <p>Additional content for testing purposes.</p>
                  <p>Extra content to show overflow handling.</p>
                </div>
              </ds-scrollpanel>
            </div>
          }
        </div>
      </section>

      <!-- State Variants -->
      <section class="showcase-section">
        <h2>State Variants</h2>
        <p>Different states including loading, error, and disabled states.</p>
        <div class="showcase-grid">
          @for (state of states; track state) {
            <div class="showcase-item">
              <h3>{{ state | titlecase }}</h3>
              <ds-scrollpanel [state]="state" [maxHeight]="'150px'">
                <div class="sample-content">
                  <p>Content in {{ state }} state.</p>
                  <p>Demonstrates how content appears in different states.</p>
                  <p>State-specific styling and behavior.</p>
                  <p>Additional content for demonstration.</p>
                </div>
              </ds-scrollpanel>
            </div>
          }
        </div>
      </section>

      <!-- Scroll Direction Variants -->
      <section class="showcase-section">
        <h2>Scroll Direction Variants</h2>
        <p>Support for different scroll directions to control overflow behavior.</p>
        <div class="showcase-grid">
          @for (direction of scrollDirections; track direction) {
            <div class="showcase-item">
              <h3>{{ direction | titlecase }}</h3>
              <ds-scrollpanel [scrollDirection]="direction" [maxHeight]="'150px'">
                <div
                  class="sample-content"
                  [style.width]="
                    direction === 'horizontal' || direction === 'both' ? '600px' : 'auto'
                  "
                >
                  <p>Content with {{ direction }} scrolling.</p>
                  <p>Demonstrates scroll direction behavior.</p>
                  @if (direction === 'horizontal' || direction === 'both') {
                    <div class="wide-content-demo">
                      Wide content for horizontal scrolling demonstration
                    </div>
                  }
                  <p>Additional content for demonstration.</p>
                  <p>More content to show scrolling capabilities.</p>
                </div>
              </ds-scrollpanel>
            </div>
          }
        </div>
      </section>

      <!-- Interactive Example -->
      <ds-interactive-example
        [config]="interactiveConfig()"
        [currentConfig]="interactiveScrollPanelConfig()"
        [lastAction]="lastAction"
        (configChange)="onInteractiveConfigChange($event)"
      >
        <ds-scrollpanel
          [size]="interactiveScrollPanelConfig().size"
          [state]="interactiveScrollPanelConfig().state"
          [scrollDirection]="interactiveScrollPanelConfig().scrollDirection"
          [showScrollbars]="interactiveScrollPanelConfig().showScrollbars"
          [autoHideScrollbars]="interactiveScrollPanelConfig().autoHideScrollbars"
          [customScrollbar]="interactiveScrollPanelConfig().customScrollbar"
          [smoothScrolling]="interactiveScrollPanelConfig().smoothScrolling"
          [showScrollIndicators]="interactiveScrollPanelConfig().showScrollIndicators"
          [loadingText]="interactiveScrollPanelConfig().loadingText"
          [errorText]="interactiveScrollPanelConfig().errorText"
          [maxHeight]="'300px'"
          (scrollChange)="onScrollChange($event)"
          (scrollEnd)="onScrollEnd($event)"
          (edgeReached)="onEdgeReached($event)"
          (focusChange)="onFocusChange($event)"
        >
          <div class="demo-content">
            <h3>Interactive ScrollPanel Demo</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
            <div class="wide-content">
              <p>
                This content is wider than the container to demonstrate horizontal scrolling
                capabilities.
              </p>
              <div class="wide-content-demo">
                Wide content that requires horizontal scrolling when enabled
              </div>
            </div>
            <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.</p>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.</p>
            <p>Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi.</p>
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
          </div>
        </ds-scrollpanel>
      </ds-interactive-example>

      <!-- Custom Features -->
      <section class="showcase-section">
        <h2>Custom Features</h2>
        <p>Advanced features like scroll indicators and auto-hiding scrollbars.</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Scroll Indicators</h3>
            <ds-scrollpanel [showScrollIndicators]="true" [maxHeight]="'200px'" size="md">
              <div class="sample-content">
                <p>Content with scroll indicators enabled.</p>
                <p>The indicators show current scroll position.</p>
                <p>Scroll to see the indicators in action.</p>
                <p>Vertical and horizontal indicators are supported.</p>
                <p>They provide visual feedback about scroll state.</p>
                <p>Useful for long content areas.</p>
                <p>More content to demonstrate scrolling.</p>
              </div>
            </ds-scrollpanel>
          </div>

          <div class="showcase-item">
            <h3>Auto-hide Scrollbars</h3>
            <ds-scrollpanel [autoHideScrollbars]="true" [maxHeight]="'200px'" size="md">
              <div class="sample-content">
                <p>Content with auto-hiding scrollbars.</p>
                <p>Hover or focus to reveal scrollbars.</p>
                <p>Provides cleaner visual appearance.</p>
                <p>Scrollbars appear when needed.</p>
                <p>Better for content-focused interfaces.</p>
                <p>Maintains accessibility standards.</p>
                <p>Additional content for scrolling.</p>
              </div>
            </ds-scrollpanel>
          </div>
        </div>
      </section>

      <!-- API Methods -->
      <section class="showcase-section">
        <h2>API Methods</h2>
        <p>Programmatic control methods for scrolling behavior.</p>

        <div class="showcase-item">
          <h3>Scroll Control</h3>
          <div class="api-controls">
            <button (click)="scrollToTop()" class="showcase-button">Scroll to Top</button>
            <button (click)="scrollToBottom()" class="showcase-button">Scroll to Bottom</button>
            <button (click)="scrollToLeft()" class="showcase-button">Scroll to Left</button>
            <button (click)="scrollToRight()" class="showcase-button">Scroll to Right</button>
            <button (click)="scrollByAmount()" class="showcase-button">Scroll by 100px</button>
          </div>

          <ds-scrollpanel
            #apiScrollPanel
            [maxHeight]="'200px'"
            [scrollDirection]="'both'"
            size="md"
          >
            <div class="sample-content" style="width: 600px;">
              <p>Use the buttons above to test API methods.</p>
              <p>Programmatic scrolling capabilities.</p>
              <p>Smooth scrolling animations.</p>
              <p>Position control methods.</p>
              <p>Offset-based scrolling.</p>
              <div class="wide-content-demo">Wide content for horizontal scrolling tests</div>
              <p>More content for vertical scrolling.</p>
              <p>Test the various scroll methods.</p>
              <p>Each method provides smooth animation.</p>
            </div>
          </ds-scrollpanel>
        </div>
      </section>

      <!-- Event Log -->
      <section class="showcase-section">
        <h2>Event Tracking</h2>
        <p>Real-time monitoring of scroll events and interactions.</p>

        <div class="showcase-item">
          <div class="event-log">
            <h3>Event Log</h3>
            <div class="log-container">
              @for (event of recentEvents(); track $index) {
                <div class="log-entry" [class]="'log-' + event.type">
                  <span class="log-time">{{ event.timestamp | date: 'HH:mm:ss.SSS' }}</span>
                  <span class="log-type">{{ event.type }}</span>
                  <span class="log-message">{{ event.message }}</span>
                </div>
              }
            </div>
            <button (click)="clearEvents()" class="showcase-button">Clear Log</button>
          </div>
        </div>
      </section>

      <!-- Component API -->
      <section class="showcase-section">
        <h2>Component API</h2>
        <ds-api-documentation [api]="showcaseConfig().api" />
      </section>
    </div>
  `,
  styleUrl: '../showcases/showcase.scss',
  styles: [
    `
      .sample-content {
        padding: var(--spacing-md);
        line-height: 1.6;
      }

      .demo-content {
        padding: var(--spacing-lg);
        line-height: 1.6;
      }

      .wide-content {
        margin: var(--spacing-md) 0;
      }

      .wide-content-demo {
        width: 400px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: var(--spacing-md);
        border-radius: var(--border-radius-md);
        margin: var(--spacing-sm) 0;
        text-align: center;
        font-weight: 500;
      }

      .api-controls {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-lg);
      }

      .showcase-button {
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--color-primary);
        color: var(--color-white);
        border: none;
        border-radius: var(--border-radius-md);
        cursor: pointer;
        font-size: var(--font-size-sm);
        font-weight: 500;
        transition: all var(--transition-fast);

        &:hover {
          background: var(--color-primary-dark);
          transform: translateY(-1px);
        }

        &:active {
          transform: translateY(0);
        }
      }

      .event-log {
        width: 100%;
      }

      .log-container {
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-md);
        background: var(--color-surface);
        font-family: monospace;
        font-size: var(--font-size-sm);
        margin-bottom: var(--spacing-md);
      }

      .log-entry {
        padding: var(--spacing-xs) var(--spacing-sm);
        border-bottom: 1px solid var(--color-border-light);
        display: flex;
        gap: var(--spacing-sm);

        &:last-child {
          border-bottom: none;
        }

        &.log-scroll {
          background: rgba(59, 130, 246, 0.1);
        }

        &.log-scroll-end {
          background: rgba(34, 197, 94, 0.1);
        }

        &.log-edge-reached {
          background: rgba(251, 146, 60, 0.1);
        }

        &.log-focus {
          background: rgba(139, 92, 246, 0.1);
        }

        &.log-api {
          background: rgba(236, 72, 153, 0.1);
        }
      }

      .log-time {
        color: var(--color-text-secondary);
        font-weight: 400;
        min-width: 80px;
      }

      .log-type {
        color: var(--color-primary);
        font-weight: 500;
        min-width: 100px;
        text-transform: uppercase;
      }

      .log-message {
        color: var(--color-text);
        flex: 1;
      }
    `,
  ],
})
export class ScrollPanelShowcaseComponent implements ShowcaseComponent {
  // =============================================================================
  // SHOWCASE COMPONENT INTERFACE
  // =============================================================================

  componentName = 'ScrollPanel Component';
  description =
    'Modern scroll panel component with custom scrollbars, scroll tracking, and accessibility features. Perfect for displaying scrollable content with enhanced user experience.';

  private lastActionSignal = signal<string>('');

  get lastAction(): string {
    return this.lastActionSignal();
  }

  private updateLastAction(action: string): void {
    this.lastActionSignal.set(action);
  }

  // =============================================================================
  // SHOWCASE DATA
  // =============================================================================

  sizes: ScrollPanelSize[] = ['sm', 'md', 'lg', 'full'];
  states: ScrollPanelState[] = ['default', 'loading', 'error', 'disabled'];
  scrollDirections: ScrollDirection[] = ['both', 'vertical', 'horizontal', 'none'];

  // =============================================================================
  // INTERACTIVE EXAMPLE CONFIGURATION
  // =============================================================================

  private interactiveScrollPanelConfigSignal = signal<ScrollPanelInteractiveConfig>({
    size: 'md',
    state: 'default',
    scrollDirection: 'both',
    showScrollbars: true,
    autoHideScrollbars: false,
    customScrollbar: true,
    smoothScrolling: true,
    showScrollIndicators: false,
    loadingText: 'Loading...',
    errorText: 'An error occurred',
  });

  readonly interactiveScrollPanelConfig = computed(() => this.interactiveScrollPanelConfigSignal());

  readonly interactiveConfig = computed<InteractiveExampleConfig>(() => ({
    title: 'Interactive ScrollPanel Configuration',
    description: 'Try different configurations and see real-time behavior.',
    showOutput: true,
    controls: [
      createSelectControl('size-control', 'Size', 'size', [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'full', label: 'Full' },
      ]),
      createSelectControl('state-control', 'State', 'state', [
        { value: 'default', label: 'Default' },
        { value: 'loading', label: 'Loading' },
        { value: 'error', label: 'Error' },
        { value: 'disabled', label: 'Disabled' },
      ]),
      createSelectControl('scroll-direction-control', 'Scroll Direction', 'scrollDirection', [
        { value: 'both', label: 'Both' },
        { value: 'vertical', label: 'Vertical' },
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'none', label: 'None' },
      ]),
      createCheckboxControl('showScrollbars', 'Show Scrollbars', 'showScrollbars', {
        helpText: 'Display scrollbars',
      }),
      createCheckboxControl('autoHideScrollbars', 'Auto-hide Scrollbars', 'autoHideScrollbars', {
        helpText: 'Automatically hide scrollbars when not needed',
      }),
      createCheckboxControl('customScrollbar', 'Custom Scrollbar', 'customScrollbar', {
        helpText: 'Use custom styled scrollbars',
      }),
      createCheckboxControl('smoothScrolling', 'Smooth Scrolling', 'smoothScrolling', {
        helpText: 'Enable smooth scrolling animations',
      }),
      createCheckboxControl(
        'showScrollIndicators',
        'Show Scroll Indicators',
        'showScrollIndicators',
        {
          helpText: 'Display scroll position indicators',
        },
      ),
      createTextControl('loadingText', 'Loading Text', 'loadingText', {
        helpText: 'Text shown in loading state',
      }),
      createTextControl('errorText', 'Error Text', 'errorText', {
        helpText: 'Text shown in error state',
      }),
    ],
  }));

  // =============================================================================
  // EVENT TRACKING
  // =============================================================================

  events = signal<Array<{ type: string; message: string; timestamp: Date }>>([]);
  recentEvents = computed(() => this.events().slice(-10));

  // =============================================================================
  // VIEW REFERENCES
  // =============================================================================

  private apiScrollPanel = viewChild<ScrollPanelComponent>('apiScrollPanel');

  // =============================================================================
  // SHOWCASE CONFIGURATION
  // =============================================================================

  readonly showcaseConfig = computed<ShowcaseConfig>(() => {
    const api: ComponentApiDocumentation = {
      inputs: [
        {
          name: 'size',
          type: 'ScrollPanelSize',
          defaultValue: 'md',
          description: 'Size variant of the scroll panel',
          examples: ['sm', 'md', 'lg', 'full'],
        },
        {
          name: 'state',
          type: 'ScrollPanelState',
          defaultValue: 'default',
          description: 'Current state of the scroll panel',
          examples: ['default', 'loading', 'error', 'disabled'],
        },
        {
          name: 'scrollDirection',
          type: 'ScrollDirection',
          defaultValue: 'both',
          description: 'Allowed scroll direction',
          examples: ['vertical', 'horizontal', 'both', 'none'],
        },
        {
          name: 'showScrollbars',
          type: 'boolean',
          defaultValue: 'true',
          description: 'Whether to show scrollbars',
        },
        {
          name: 'autoHideScrollbars',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether scrollbars should auto-hide when not in use',
        },
        {
          name: 'customScrollbar',
          type: 'boolean',
          defaultValue: 'true',
          description: 'Whether to use custom styled scrollbars',
        },
        {
          name: 'smoothScrolling',
          type: 'boolean',
          defaultValue: 'true',
          description: 'Whether to enable smooth scrolling animations',
        },
        {
          name: 'showScrollIndicators',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether to show scroll position indicators',
        },
        {
          name: 'loadingText',
          type: 'string',
          defaultValue: 'Loading...',
          description: 'Text displayed in loading state',
        },
        {
          name: 'errorText',
          type: 'string',
          defaultValue: 'An error occurred',
          description: 'Text displayed in error state',
        },
        {
          name: 'maxHeight',
          type: 'string | null',
          defaultValue: 'null',
          description: 'Maximum height constraint for the scroll panel',
        },
        {
          name: 'maxWidth',
          type: 'string | null',
          defaultValue: 'null',
          description: 'Maximum width constraint for the scroll panel',
        },
      ],
      outputs: [
        {
          name: 'scrollChange',
          type: 'ScrollEvent',
          description: 'Emitted when scroll position changes',
          examples: [
            '{ position: ScrollPosition, dimensions: ScrollDimensions, direction: "down" }',
          ],
        },
        {
          name: 'scrollEnd',
          type: 'ScrollEndEvent',
          description: 'Emitted when scrolling stops',
          examples: ['{ position: ScrollPosition, duration: 150 }'],
        },
        {
          name: 'edgeReached',
          type: 'ScrollEdgeEvent',
          description: 'Emitted when reaching scroll edges',
          examples: ['{ edge: "bottom", position: ScrollPosition }'],
        },
        {
          name: 'focusChange',
          type: '{ focused: boolean; element: HTMLElement }',
          description: 'Emitted when focus state changes',
          examples: ['{ focused: true, element: HTMLElement }'],
        },
      ],
      methods: [
        {
          name: 'scrollToTop',
          signature: 'scrollToTop(): void',
          description: 'Scrolls to the top of the content',
        },
        {
          name: 'scrollToBottom',
          signature: 'scrollToBottom(): void',
          description: 'Scrolls to the bottom of the content',
        },
        {
          name: 'scrollToLeft',
          signature: 'scrollToLeft(): void',
          description: 'Scrolls to the left edge of the content',
        },
        {
          name: 'scrollToRight',
          signature: 'scrollToRight(): void',
          description: 'Scrolls to the right edge of the content',
        },
        {
          name: 'scrollTo',
          signature: 'scrollTo(x: number, y: number, behavior?: ScrollBehavior): void',
          description: 'Scrolls to specific coordinates',
          parameters: [
            { name: 'x', type: 'number', required: true, description: 'Horizontal position' },
            { name: 'y', type: 'number', required: true, description: 'Vertical position' },
            { name: 'behavior', type: 'ScrollBehavior', description: 'Scroll behavior' },
          ],
        },
        {
          name: 'scrollBy',
          signature: 'scrollBy(deltaX: number, deltaY: number, behavior?: ScrollBehavior): void',
          description: 'Scrolls by offset amounts',
          parameters: [
            { name: 'deltaX', type: 'number', required: true, description: 'Horizontal offset' },
            { name: 'deltaY', type: 'number', required: true, description: 'Vertical offset' },
            { name: 'behavior', type: 'ScrollBehavior', description: 'Scroll behavior' },
          ],
        },
        {
          name: 'focus',
          signature: 'focus(): void',
          description: 'Focuses the scrollable area for keyboard navigation',
        },
        {
          name: 'getScrollPosition',
          signature: 'getScrollPosition(): ScrollPosition',
          description: 'Gets current scroll position information',
          returnType: 'ScrollPosition',
        },
        {
          name: 'getScrollDimensions',
          signature: 'getScrollDimensions(): ScrollDimensions',
          description: 'Gets scroll dimensions information',
          returnType: 'ScrollDimensions',
        },
      ],
    };

    return createShowcaseConfig(
      {
        componentName: this.componentName,
        description: this.description,
        lastAction: this.lastAction,
      },
      api,
    );
  });

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  onScrollChange(event: ScrollEvent): void {
    this.addEvent(
      'scroll',
      `Position: ${Math.round(event.position.scrollTop)}px, Direction: ${event.direction || 'none'}`,
    );
    this.updateLastAction(`Scroll: ${Math.round(event.position.scrollTop)}px`);
  }

  onScrollEnd(event: ScrollEndEvent): void {
    this.addEvent('scroll-end', `Duration: ${event.duration}ms`);
    this.updateLastAction(`Scroll ended after ${event.duration}ms`);
  }

  onEdgeReached(event: ScrollEdgeEvent): void {
    this.addEvent('edge-reached', `Edge: ${event.edge}`);
    this.updateLastAction(`Reached ${event.edge} edge`);
  }

  onFocusChange(event: { focused: boolean; element: HTMLElement }): void {
    this.addEvent('focus', `Focused: ${event.focused}`);
    this.updateLastAction(`Focus: ${event.focused ? 'gained' : 'lost'}`);
  }

  onInteractiveConfigChange(
    event: InteractiveConfigChangeEvent<ScrollPanelInteractiveConfig>,
  ): void {
    this.interactiveScrollPanelConfigSignal.set({ ...event.config });
    this.updateLastAction(`Config changed: ${event.property} = ${event.value}`);
  }

  // =============================================================================
  // API METHOD DEMONSTRATIONS
  // =============================================================================

  scrollToTop(): void {
    this.apiScrollPanel()?.scrollToTop();
    this.addEvent('api', 'scrollToTop() called');
    this.updateLastAction('scrollToTop() method called');
  }

  scrollToBottom(): void {
    this.apiScrollPanel()?.scrollToBottom();
    this.addEvent('api', 'scrollToBottom() called');
    this.updateLastAction('scrollToBottom() method called');
  }

  scrollToLeft(): void {
    this.apiScrollPanel()?.scrollToLeft();
    this.addEvent('api', 'scrollToLeft() called');
    this.updateLastAction('scrollToLeft() method called');
  }

  scrollToRight(): void {
    this.apiScrollPanel()?.scrollToRight();
    this.addEvent('api', 'scrollToRight() called');
    this.updateLastAction('scrollToRight() method called');
  }

  scrollByAmount(): void {
    this.apiScrollPanel()?.scrollBy(100, 100);
    this.addEvent('api', 'scrollBy(100, 100) called');
    this.updateLastAction('scrollBy(100, 100) method called');
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  private addEvent(type: string, message: string): void {
    const currentEvents = this.events();
    this.events.set([...currentEvents, { type, message, timestamp: new Date() }]);
  }

  clearEvents(): void {
    this.events.set([]);
    this.updateLastAction('Event log cleared');
  }
}
