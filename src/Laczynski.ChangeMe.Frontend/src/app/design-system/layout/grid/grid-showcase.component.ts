// =============================================================================
// Grid Showcase Component
// =============================================================================
// Comprehensive demonstration of the Grid layout system features

import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GridComponent } from './grid.component';
import { GridItemComponent } from './grid-item.component';
import { CardComponent } from '../../ui/card/card.component';
import { ApiDocumentationComponent } from '../../shared/components';

import {
  GridConfig,
  GridColumns,
  GridGap,
  GridHorizontalAlignment,
  GridVerticalAlignment,
  GridWidth,
  GridHeight,
  GridLayoutChangeEvent,
  createGridConfig,
  GRID_LAYOUTS,
  GRID_BREAKPOINTS,
} from './grid.model';

import {
  ShowcaseComponent,
  ComponentApiDocumentation,
  createShowcaseConfig,
  ShowcaseConfig,
} from '../../models/showcase.model';

/**
 * Grid Showcase Component
 *
 * Comprehensive demonstration of the Grid layout system including:
 * - Basic grid layouts with different column counts
 * - Responsive breakpoint configurations
 * - Auto-fit and auto-fill layouts
 * - Grid item positioning and spanning
 * - Common layout patterns (cards, dashboard, etc.)
 * - Template areas and advanced features
 */
@Component({
  selector: 'ds-grid-showcase',
  standalone: true,
  imports: [
    CommonModule,
    GridComponent,
    GridItemComponent,
    CardComponent,
    FormsModule,
    ApiDocumentationComponent,
  ],
  template: `
    <div class="showcase-container">
      <!-- Header -->
      <div class="showcase-header">
        <h1>{{ showcaseConfig().component.componentName }}</h1>
        <p class="showcase-description">
          {{ showcaseConfig().component.description }}
        </p>
      </div>

      <!-- Interactive Example -->
      <section class="showcase-section">
        <h2>Interactive Grid Configuration</h2>
        <p>Configure the grid and see how it responds:</p>

        <div class="showcase-interactive">
          <!-- Configuration Panel -->
          <div class="interactive-controls">
            <div class="control-group">
              <label for="columns-input">Columns:</label>
              <input
                id="columns-input"
                type="number"
                [(ngModel)]="interactiveColumns"
                min="1"
                max="12"
                class="control-input"
              />
            </div>

            <div class="control-group">
              <label for="gap-select">Gap:</label>
              <select id="gap-select" [(ngModel)]="interactiveGap" class="control-input">
                @for (option of gapOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label for="horizontal-align-select">Horizontal Align:</label>
              <select
                id="horizontal-align-select"
                [(ngModel)]="interactiveHorizontalAlign"
                class="control-input"
              >
                @for (option of horizontalAlignOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label for="vertical-align-select">Vertical Align:</label>
              <select
                id="vertical-align-select"
                [(ngModel)]="interactiveVerticalAlign"
                class="control-input"
              >
                @for (option of verticalAlignOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="interactiveAutoFit" />
                Auto Fit
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="interactiveDense" />
                Dense Layout
              </label>
            </div>

            <div class="control-group">
              <label for="min-width-input">Min Column Width:</label>
              <input
                id="min-width-input"
                type="text"
                [(ngModel)]="interactiveMinWidth"
                placeholder="250px"
                class="control-input"
              />
            </div>
          </div>

          <!-- Interactive Grid -->
          <div class="interactive-preview">
            <ds-grid
              [columns]="interactiveAutoFit() ? 'auto-fit' : interactiveColumns()"
              [gap]="interactiveGap()"
              [horizontalAlign]="interactiveHorizontalAlign()"
              [verticalAlign]="interactiveVerticalAlign()"
              [autoFit]="interactiveAutoFit()"
              [dense]="interactiveDense()"
              [minColumnWidth]="interactiveMinWidth()"
              (layoutChange)="onLayoutChange($event)"
              class="demo-grid"
            >
              @for (item of demoItems(); track item.id) {
                <ds-card
                  [variant]="item.variant"
                  [size]="'sm'"
                  [class]="'demo-grid-item demo-grid-item--' + item.size"
                >
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.content }}</p>
                </ds-card>
              }
            </ds-grid>
          </div>

          <!-- Layout Info -->
          @if (lastLayoutInfoSignal()) {
            <div class="showcase-output">
              <strong>Current Layout:</strong>
              {{ lastLayoutInfoSignal()!.columns }} columns on
              {{ lastLayoutInfoSignal()!.breakpoint }} breakpoint ({{
                lastLayoutInfoSignal()!.dimensions.width
              }}x{{ lastLayoutInfoSignal()!.dimensions.height }})
            </div>
          }
        </div>
      </section>

      <!-- Basic Layouts -->
      <section class="showcase-section">
        <h2>Basic Grid Layouts</h2>
        <p>Common grid configurations for different use cases:</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Two Columns</h3>
            <ds-grid [columns]="2" gap="md" class="demo-grid demo-grid--small">
              @for (item of basicItems().slice(0, 4); track item) {
                <div class="demo-grid-item">{{ item }}</div>
              }
            </ds-grid>
          </div>

          <div class="showcase-item">
            <h3>Three Columns</h3>
            <ds-grid [columns]="3" gap="md" class="demo-grid demo-grid--small">
              @for (item of basicItems().slice(0, 6); track item) {
                <div class="demo-grid-item">{{ item }}</div>
              }
            </ds-grid>
          </div>

          <div class="showcase-item">
            <h3>Four Columns</h3>
            <ds-grid [columns]="4" gap="md" class="demo-grid demo-grid--small">
              @for (item of basicItems().slice(0, 8); track item) {
                <div class="demo-grid-item">{{ item }}</div>
              }
            </ds-grid>
          </div>

          <div class="showcase-item">
            <h3>Six Columns</h3>
            <ds-grid [columns]="6" gap="sm" class="demo-grid demo-grid--small">
              @for (item of basicItems(); track item) {
                <div class="demo-grid-item">{{ item }}</div>
              }
            </ds-grid>
          </div>
        </div>
      </section>

      <!-- Auto Layouts -->
      <section class="showcase-section">
        <h2>Auto Layouts</h2>
        <p>Responsive grids that adapt to content and container size:</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Auto Fit (250px min)</h3>
            <ds-grid [autoFit]="true" gap="md" minColumnWidth="250px" class="demo-grid">
              @for (item of autoItems(); track item.id) {
                <ds-card [size]="'sm'" [variant]="'outlined'">
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.content }}</p>
                </ds-card>
              }
            </ds-grid>
          </div>

          <div class="showcase-item">
            <h3>Auto Fill (200px min)</h3>
            <ds-grid [autoFill]="true" gap="md" minColumnWidth="200px" class="demo-grid">
              @for (item of autoItems().slice(0, 6); track item.id) {
                <ds-card [size]="'sm'" [variant]="'filled'">
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.content }}</p>
                </ds-card>
              }
            </ds-grid>
          </div>
        </div>
      </section>

      <!-- Grid Item Positioning -->
      <section class="showcase-section">
        <h2>Grid Item Positioning</h2>
        <p>Advanced positioning with spans and coordinates:</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Column & Row Spans</h3>
            <ds-grid [columns]="4" gap="md" class="demo-grid demo-grid--positioned">
              <ds-grid-item [columnSpan]="2" [rowSpan]="2">
                <div class="demo-grid-item demo-grid-item--large">2x2 Span</div>
              </ds-grid-item>
              <ds-grid-item>
                <div class="demo-grid-item">1x1</div>
              </ds-grid-item>
              <ds-grid-item>
                <div class="demo-grid-item">1x1</div>
              </ds-grid-item>
              <ds-grid-item [columnSpan]="2">
                <div class="demo-grid-item">2x1 Span</div>
              </ds-grid-item>
              <ds-grid-item>
                <div class="demo-grid-item">1x1</div>
              </ds-grid-item>
              <ds-grid-item>
                <div class="demo-grid-item">1x1</div>
              </ds-grid-item>
            </ds-grid>
          </div>

          <div class="showcase-item">
            <h3>Precise Positioning</h3>
            <ds-grid [columns]="6" gap="md" class="demo-grid demo-grid--positioned">
              <ds-grid-item [columnStart]="1" [columnEnd]="4" [rowStart]="1" [rowEnd]="2">
                <div class="demo-grid-item">Header (1-4, 1-2)</div>
              </ds-grid-item>
              <ds-grid-item [columnStart]="4" [columnEnd]="7" [rowStart]="1" [rowEnd]="3">
                <div class="demo-grid-item demo-grid-item--large">Sidebar (4-7, 1-3)</div>
              </ds-grid-item>
              <ds-grid-item [columnStart]="1" [columnEnd]="4" [rowStart]="2" [rowEnd]="4">
                <div class="demo-grid-item demo-grid-item--large">Main (1-4, 2-4)</div>
              </ds-grid-item>
            </ds-grid>
          </div>
        </div>
      </section>

      <!-- Responsive Layouts -->
      <section class="showcase-section">
        <h2>Responsive Layouts</h2>
        <p>Grids that adapt to different screen sizes:</p>

        <div class="showcase-item">
          <h3>Responsive Card Grid</h3>
          <p>1 column on mobile, 2 on tablet, 3 on desktop, 4 on large screens</p>
          <ds-grid
            [columns]="1"
            gap="lg"
            [responsive]="{
              sm: { columns: 2, gap: 'md' },
              md: { columns: 3, gap: 'md' },
              lg: { columns: 4, gap: 'lg' },
            }"
            class="demo-grid"
          >
            @for (item of responsiveItems(); track item.id) {
              <ds-card [variant]="'elevated'" [size]="'md'">
                <h4>{{ item.title }}</h4>
                <p>{{ item.content }}</p>
                <p>
                  <small>{{ item.category }}</small>
                </p>
              </ds-card>
            }
          </ds-grid>
        </div>
      </section>

      <!-- Layout Patterns -->
      <section class="showcase-section">
        <h2>Common Layout Patterns</h2>
        <p>Pre-configured layouts for common use cases:</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Dashboard Layout</h3>
            <ds-grid
              [templateAreas]="[
                'header header header',
                'sidebar main aside',
                'footer footer footer',
              ]"
              gap="md"
              class="demo-grid demo-grid--dashboard"
              [style]="'grid-template-columns: 200px 1fr 200px; grid-template-rows: 60px 1fr 60px;'"
            >
              <ds-grid-item area="header">
                <div class="demo-grid-item demo-grid-item--header">Header</div>
              </ds-grid-item>
              <ds-grid-item area="sidebar">
                <div class="demo-grid-item demo-grid-item--sidebar">Sidebar</div>
              </ds-grid-item>
              <ds-grid-item area="main">
                <div class="demo-grid-item demo-grid-item--main">Main Content</div>
              </ds-grid-item>
              <ds-grid-item area="aside">
                <div class="demo-grid-item demo-grid-item--aside">Aside</div>
              </ds-grid-item>
              <ds-grid-item area="footer">
                <div class="demo-grid-item demo-grid-item--footer">Footer</div>
              </ds-grid-item>
            </ds-grid>
          </div>

          <div class="showcase-item">
            <h3>Masonry-like Layout</h3>
            <ds-grid
              [autoFit]="true"
              [dense]="true"
              gap="md"
              minColumnWidth="250px"
              class="demo-grid"
            >
              @for (item of masonryItems(); track item.id) {
                <ds-card
                  [variant]="'outlined'"
                  [size]="'sm'"
                  [class]="'demo-masonry-item demo-masonry-item--' + item.height"
                >
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.content }}</p>
                  @if (item.height === 'tall') {
                    <p>This is additional content that makes this card taller than others.</p>
                  }
                </ds-card>
              }
            </ds-grid>
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
  styleUrl: '../../shared/styles/showcase.scss',
})
export class GridShowcaseComponent implements ShowcaseComponent, OnInit {
  componentName = 'Grid Layout System';
  description =
    'Flexible grid layout system supporting responsive design, CSS Grid features, auto-layouts, and advanced positioning. Perfect for creating modern, adaptive layouts.';

  // =============================================================================
  // SHOWCASE DATA
  // =============================================================================

  readonly gapOptions = [
    { value: 'none', label: 'None' },
    { value: 'xs', label: 'Extra Small' },
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra Large' },
    { value: 'xxl', label: 'Extra Extra Large' },
  ];

  readonly horizontalAlignOptions = [
    { value: 'start', label: 'Start' },
    { value: 'end', label: 'End' },
    { value: 'center', label: 'Center' },
    { value: 'stretch', label: 'Stretch' },
  ];

  readonly verticalAlignOptions = [
    { value: 'start', label: 'Start' },
    { value: 'end', label: 'End' },
    { value: 'center', label: 'Center' },
    { value: 'stretch', label: 'Stretch' },
    { value: 'baseline', label: 'Baseline' },
  ];

  // =============================================================================
  // INTERACTIVE CONTROLS
  // =============================================================================

  interactiveColumns = signal<number>(3);
  interactiveGap = signal<GridGap>('md');
  interactiveHorizontalAlign = signal<GridHorizontalAlignment>('start');
  interactiveVerticalAlign = signal<GridVerticalAlignment>('start');
  interactiveAutoFit = signal<boolean>(false);
  interactiveDense = signal<boolean>(false);
  interactiveMinWidth = signal<string>('250px');

  // =============================================================================
  // SHOWCASE STATE
  // =============================================================================

  protected readonly lastLayoutInfoSignal = signal<GridLayoutChangeEvent | null>(null);
  protected readonly lastActionSignal = signal<string>('');

  // Getter to implement ShowcaseComponent interface
  get lastAction(): string {
    return this.lastActionSignal();
  }

  get lastLayoutInfo(): GridLayoutChangeEvent | null {
    return this.lastLayoutInfoSignal();
  }

  // =============================================================================
  // DEMO DATA
  // =============================================================================

  readonly demoItems = computed(() => [
    {
      id: 1,
      title: 'Item 1',
      content: 'First demo item',
      variant: 'default' as const,
      size: 'normal',
    },
    {
      id: 2,
      title: 'Item 2',
      content: 'Second demo item',
      variant: 'outlined' as const,
      size: 'normal',
    },
    {
      id: 3,
      title: 'Item 3',
      content: 'Third demo item',
      variant: 'filled' as const,
      size: 'large',
    },
    {
      id: 4,
      title: 'Item 4',
      content: 'Fourth demo item',
      variant: 'elevated' as const,
      size: 'normal',
    },
    {
      id: 5,
      title: 'Item 5',
      content: 'Fifth demo item',
      variant: 'ghost' as const,
      size: 'small',
    },
    {
      id: 6,
      title: 'Item 6',
      content: 'Sixth demo item',
      variant: 'default' as const,
      size: 'normal',
    },
    {
      id: 7,
      title: 'Item 7',
      content: 'Seventh demo item',
      variant: 'outlined' as const,
      size: 'large',
    },
    {
      id: 8,
      title: 'Item 8',
      content: 'Eighth demo item',
      variant: 'filled' as const,
      size: 'normal',
    },
  ]);

  readonly basicItems = computed(() => [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6',
    'Item 7',
    'Item 8',
    'Item 9',
    'Item 10',
    'Item 11',
    'Item 12',
  ]);

  readonly autoItems = computed(() => [
    { id: 1, title: 'Auto Item 1', content: 'This item adapts to available space' },
    { id: 2, title: 'Auto Item 2', content: 'Responsive grid item' },
    { id: 3, title: 'Auto Item 3', content: 'Flexible layout' },
    { id: 4, title: 'Auto Item 4', content: 'Auto-sizing content' },
    { id: 5, title: 'Auto Item 5', content: 'Grid adaptation' },
    { id: 6, title: 'Auto Item 6', content: 'Dynamic columns' },
    { id: 7, title: 'Auto Item 7', content: 'Smart layout' },
    { id: 8, title: 'Auto Item 8', content: 'Responsive design' },
  ]);

  readonly responsiveItems = computed(() => [
    {
      id: 1,
      title: 'News Article',
      content: 'Latest breaking news from around the world',
      category: 'News',
    },
    {
      id: 2,
      title: 'Tech Review',
      content: 'In-depth review of the latest gadget',
      category: 'Technology',
    },
    { id: 3, title: 'Recipe', content: 'Delicious home-cooked meal recipe', category: 'Food' },
    { id: 4, title: 'Travel Guide', content: 'Explore amazing destinations', category: 'Travel' },
    { id: 5, title: 'Health Tips', content: 'Stay healthy with these tips', category: 'Health' },
    { id: 6, title: 'Sports Update', content: 'Latest scores and highlights', category: 'Sports' },
    { id: 7, title: 'Art Gallery', content: 'Beautiful artwork collection', category: 'Art' },
    { id: 8, title: 'Science News', content: 'Latest scientific discoveries', category: 'Science' },
  ]);

  readonly masonryItems = computed(() => [
    { id: 1, title: 'Short Card', content: 'Brief content', height: 'short' },
    { id: 2, title: 'Tall Card', content: 'Extended content with more details', height: 'tall' },
    { id: 3, title: 'Normal Card', content: 'Regular amount of content', height: 'normal' },
    { id: 4, title: 'Short Card', content: 'Compact info', height: 'short' },
    { id: 5, title: 'Tall Card', content: 'Lots of information here', height: 'tall' },
    { id: 6, title: 'Normal Card', content: 'Standard content length', height: 'normal' },
    { id: 7, title: 'Short Card', content: 'Quick info', height: 'short' },
    { id: 8, title: 'Normal Card', content: 'Balanced content', height: 'normal' },
  ]);

  // =============================================================================
  // SHOWCASE CONFIGURATION
  // =============================================================================

  readonly showcaseConfig = computed<ShowcaseConfig>(() => {
    const componentInfo: ShowcaseComponent = {
      componentName: this.componentName,
      description: this.description,
      lastAction: this.lastAction,
    };

    const apiDocumentation: ComponentApiDocumentation = {
      inputs: [
        {
          name: 'columns',
          type: 'GridColumns',
          defaultValue: '12',
          description: 'Number of columns or auto configuration',
          examples: ['3', '12', '"auto-fit"', '"auto-fill"'],
        },
        {
          name: 'gap',
          type: 'GridGap',
          defaultValue: 'md',
          description: 'Gap between grid items',
          examples: ['sm', 'md', 'lg', '"16px"'],
        },
        {
          name: 'horizontalAlign',
          type: 'GridHorizontalAlignment',
          defaultValue: 'start',
          description: 'Horizontal alignment of grid items',
          examples: ['start', 'center', 'end', 'stretch'],
        },
        {
          name: 'verticalAlign',
          type: 'GridVerticalAlignment',
          defaultValue: 'start',
          description: 'Vertical alignment of grid items',
          examples: ['start', 'center', 'end', 'stretch'],
        },
        {
          name: 'autoFit',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether to use auto-fit columns',
        },
        {
          name: 'autoFill',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether to use auto-fill columns',
        },
        {
          name: 'minColumnWidth',
          type: 'string',
          defaultValue: '250px',
          description: 'Minimum column width for auto layouts',
        },
        {
          name: 'dense',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether to use dense grid packing',
        },
        {
          name: 'responsive',
          type: 'Record<string, Partial<GridConfig>>',
          description: 'Responsive breakpoint configurations',
        },
      ],
      outputs: [
        {
          name: 'layoutChange',
          type: 'GridLayoutChangeEvent',
          description: 'Emitted when grid layout changes',
          examples: ['{ breakpoint, columns, dimensions }'],
        },
      ],
    };

    return createShowcaseConfig(componentInfo, apiDocumentation);
  });

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  ngOnInit(): void {
    // Initialize component
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  onLayoutChange(event: GridLayoutChangeEvent): void {
    this.lastLayoutInfoSignal.set(event);
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(`Layout changed to ${event.columns} columns at ${timestamp}`);
  }
}
