// =============================================================================
// Card Showcase Component
// =============================================================================
// Comprehensive demonstration of the Card component features

import { Component, signal, computed, OnInit, inject, TemplateRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardComponent } from './card.component';

import {
  CardConfig,
  CardVariant,
  CardSize,
  CardElevation,
  CardBackground,
  CardHeader,
  CardFooter,
  CardMedia,
  CardAction,
  CardClickEvent,
  CardActionEvent,
  CardHoverEvent,
  createCardConfig,
  createCardHeader,
  createCardFooter,
  createCardAction,
} from './card.model';

import {
  ShowcaseComponent,
  ComponentApiDocumentation,
  createShowcaseConfig,
  ShowcaseConfig,
} from '../../models/showcase.model';

/**
 * Card Showcase Component
 *
 * Comprehensive demonstration of the Card component features including:
 * - All visual variants and sizes
 * - Different elevation levels
 * - Headers with avatars and actions
 * - Media content positioning
 * - Footer actions and content
 * - Interactive states and loading
 * - Custom templates and content
 */
@Component({
  selector: 'ds-card-showcase',
  standalone: true,
  imports: [CommonModule, CardComponent, FormsModule],
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
        <h2>Interactive Example</h2>
        <p>Try different configurations and features:</p>

        <div class="showcase-interactive">
          <!-- Configuration Panel -->
          <div class="interactive-controls">
            <div class="control-group">
              <label for="variant-select">Variant:</label>
              <select id="variant-select" [(ngModel)]="selectedVariant" class="control-input">
                @for (option of variantOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label for="size-select">Size:</label>
              <select id="size-select" [(ngModel)]="selectedSize" class="control-input">
                @for (option of sizeOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label for="elevation-select">Elevation:</label>
              <select id="elevation-select" [(ngModel)]="selectedElevation" class="control-input">
                @for (option of elevationOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label for="background-select">Background:</label>
              <select id="background-select" [(ngModel)]="selectedBackground" class="control-input">
                @for (option of backgroundOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="interactive" />
                Interactive
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="showHeader" />
                Show Header
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="showFooter" />
                Show Footer
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="showMedia" />
                Show Media
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="bordered" />
                Bordered
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="loading" />
                Loading
              </label>
            </div>
          </div>

          <!-- Interactive Card -->
          <div class="interactive-preview">
            <ds-card
              [variant]="selectedVariant()"
              [size]="selectedSize()"
              [elevation]="selectedElevation()"
              [background]="selectedBackground()"
              [interactive]="interactive()"
              [bordered]="bordered()"
              [loading]="loading()"
              [header]="showHeader() ? demoHeader() : null"
              [footer]="showFooter() ? demoFooter() : null"
              [media]="showMedia() ? demoMedia() : null"
              (cardClick)="onCardClick($event)"
              (cardAction)="onCardAction($event)"
              (cardHover)="onCardHover($event)"
            >
              <h4>Interactive Card Content</h4>
              <p>
                This is an example of card content that can be customized using the controls on the
                left.
              </p>
              <p>
                Cards can contain any content including text, images, lists, and other components.
              </p>
            </ds-card>
          </div>

          <!-- Action Info -->
          @if (lastActionSignal()) {
            <div class="showcase-output">
              <strong>Last Action:</strong> {{ lastActionSignal() }}
            </div>
          }
        </div>
      </section>

      <!-- Variants -->
      <section class="showcase-section">
        <h2>Card Variants</h2>
        <p>Different visual styles for various use cases:</p>

        <div class="showcase-grid">
          @for (variant of variants; track variant.value) {
            <div class="showcase-item">
              <h3>{{ variant.label }}</h3>
              <ds-card [variant]="variant.value" [size]="'md'">
                <h4>{{ variant.label }} Card</h4>
                <p>This is an example of a {{ variant.label.toLowerCase() }} card variant.</p>
              </ds-card>
            </div>
          }
        </div>
      </section>

      <!-- Sizes -->
      <section class="showcase-section">
        <h2>Card Sizes</h2>
        <p>Different sizes for various layouts:</p>

        <div class="showcase-grid">
          @for (size of sizes; track size.value) {
            <div class="showcase-item">
              <h3>{{ size.label }}</h3>
              <ds-card [size]="size.value" [variant]="'elevated'">
                <h4>{{ size.label }} Card</h4>
                <p>This demonstrates a {{ size.label.toLowerCase() }} sized card.</p>
              </ds-card>
            </div>
          }
        </div>
      </section>

      <!-- Elevations -->
      <section class="showcase-section">
        <h2>Elevation Levels</h2>
        <p>Different shadow depths:</p>

        <div class="showcase-grid">
          @for (elevation of elevations; track elevation.value) {
            <div class="showcase-item">
              <h3>{{ elevation.label }}</h3>
              <ds-card [elevation]="elevation.value" [variant]="'default'">
                <h4>{{ elevation.label }} Elevation</h4>
                <p>This card has {{ elevation.label.toLowerCase() }} elevation.</p>
              </ds-card>
            </div>
          }
        </div>
      </section>

      <!-- Headers & Footers -->
      <section class="showcase-section">
        <h2>Headers & Footers</h2>
        <p>Cards with different header and footer configurations:</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Simple Header</h3>
            <ds-card [header]="simpleHeader()" [size]="'md'">
              <p>Card content with a simple title header.</p>
            </ds-card>
          </div>

          <div class="showcase-item">
            <h3>Header with Avatar</h3>
            <ds-card [header]="avatarHeader()" [size]="'md'">
              <p>Card content with header including avatar and actions.</p>
            </ds-card>
          </div>

          <div class="showcase-item">
            <h3>Footer Actions</h3>
            <ds-card [footer]="actionFooter()" [size]="'md'">
              <h4>Task Card</h4>
              <p>This card has action buttons in the footer.</p>
            </ds-card>
          </div>

          <div class="showcase-item">
            <h3>Header & Footer</h3>
            <ds-card [header]="fullHeader()" [footer]="infoFooter()" [size]="'md'">
              <p>Card with both header and footer sections.</p>
            </ds-card>
          </div>
        </div>
      </section>

      <!-- Media Positions -->
      <section class="showcase-section">
        <h2>Media Positions</h2>
        <p>Cards with media content in different positions:</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Top Media</h3>
            <ds-card [media]="topMedia()" [header]="mediaHeader()" [size]="'md'">
              <p>Card with image positioned at the top.</p>
            </ds-card>
          </div>

          <div class="showcase-item">
            <h3>Left Media</h3>
            <ds-card [media]="leftMedia()" [header]="mediaHeader()" [size]="'md'">
              <p>Card with image positioned on the left side.</p>
            </ds-card>
          </div>

          <div class="showcase-item">
            <h3>Right Media</h3>
            <ds-card [media]="rightMedia()" [header]="mediaHeader()" [size]="'md'">
              <p>Card with image positioned on the right side.</p>
            </ds-card>
          </div>

          <div class="showcase-item">
            <h3>Background Media</h3>
            <ds-card [media]="backgroundMedia()" [header]="overlayHeader()" [size]="'md'">
              <p style="color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
                Card with background image and overlay content.
              </p>
            </ds-card>
          </div>
        </div>
      </section>

      <!-- Interactive States -->
      <section class="showcase-section">
        <h2>Interactive States</h2>
        <p>Cards with different interactive behaviors:</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Clickable Card</h3>
            <ds-card
              [interactive]="true"
              [variant]="'elevated'"
              [header]="clickableHeader()"
              (cardClick)="onDemoCardClick('clickable')"
            >
              <p>Click this entire card to trigger an action.</p>
            </ds-card>
          </div>

          <div class="showcase-item">
            <h3>Selected Card</h3>
            <ds-card
              [selected]="true"
              [interactive]="true"
              [variant]="'outlined'"
              [header]="selectedHeader()"
            >
              <p>This card is in a selected state.</p>
            </ds-card>
          </div>

          <div class="showcase-item">
            <h3>Loading Card</h3>
            <ds-card [loading]="true" [variant]="'elevated'" [header]="loadingHeader()">
              <p>This card is showing a loading state.</p>
            </ds-card>
          </div>

          <div class="showcase-item">
            <h3>Disabled Card</h3>
            <ds-card [disabled]="true" [variant]="'filled'" [header]="disabledHeader()">
              <p>This card is in a disabled state.</p>
            </ds-card>
          </div>
        </div>
      </section>

      <!-- Component API -->
      <section class="showcase-section">
        <h2>Component API</h2>
        <div class="showcase-api">
          <!-- Inputs -->
          <div class="api-section">
            <h3>Inputs</h3>
            <ul>
              @for (input of showcaseConfig().api.inputs; track input.name) {
                <li>
                  <code>{{ input.name }}: {{ input.type }}</code>
                  @if (input.defaultValue) {
                    <span class="default-value">= {{ input.defaultValue }}</span>
                  }
                  <p>{{ input.description }}</p>
                </li>
              }
            </ul>
          </div>

          <!-- Outputs -->
          <div class="api-section">
            <h3>Outputs</h3>
            <ul>
              @for (output of showcaseConfig().api.outputs; track output.name) {
                <li>
                  <code>{{ output.name }}: {{ output.type }}</code>
                  <p>{{ output.description }}</p>
                </li>
              }
            </ul>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrl: '../../shared/styles/showcase.scss',
})
export class CardShowcaseComponent implements ShowcaseComponent, OnInit {
  componentName = 'Card Component';
  description =
    'Flexible container component for displaying content with headers, footers, media, and actions. Supports multiple variants, sizes, and interactive states.';

  // =============================================================================
  // SHOWCASE DATA
  // =============================================================================

  readonly variantOptions = [
    { value: 'default', label: 'Default' },
    { value: 'outlined', label: 'Outlined' },
    { value: 'filled', label: 'Filled' },
    { value: 'elevated', label: 'Elevated' },
    { value: 'ghost', label: 'Ghost' },
  ];

  readonly sizeOptions = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra Large' },
  ];

  readonly elevationOptions = [
    { value: 'none', label: 'None' },
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra Large' },
  ];

  readonly backgroundOptions = [
    { value: 'default', label: 'Default' },
    { value: 'muted', label: 'Muted' },
    { value: 'accent', label: 'Accent' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'transparent', label: 'Transparent' },
  ];

  readonly variants = [
    { value: 'default' as CardVariant, label: 'Default' },
    { value: 'outlined' as CardVariant, label: 'Outlined' },
    { value: 'filled' as CardVariant, label: 'Filled' },
    { value: 'elevated' as CardVariant, label: 'Elevated' },
    { value: 'ghost' as CardVariant, label: 'Ghost' },
  ];

  readonly sizes = [
    { value: 'sm' as CardSize, label: 'Small' },
    { value: 'md' as CardSize, label: 'Medium' },
    { value: 'lg' as CardSize, label: 'Large' },
    { value: 'xl' as CardSize, label: 'Extra Large' },
  ];

  readonly elevations = [
    { value: 'none' as CardElevation, label: 'None' },
    { value: 'sm' as CardElevation, label: 'Small' },
    { value: 'md' as CardElevation, label: 'Medium' },
    { value: 'lg' as CardElevation, label: 'Large' },
    { value: 'xl' as CardElevation, label: 'Extra Large' },
  ];

  // =============================================================================
  // INTERACTIVE CONTROLS
  // =============================================================================

  selectedVariant = signal<CardVariant>('elevated');
  selectedSize = signal<CardSize>('md');
  selectedElevation = signal<CardElevation>('md');
  selectedBackground = signal<CardBackground>('default');
  interactive = signal<boolean>(true);
  showHeader = signal<boolean>(true);
  showFooter = signal<boolean>(true);
  showMedia = signal<boolean>(false);
  bordered = signal<boolean>(false);
  loading = signal<boolean>(false);

  // =============================================================================
  // SHOWCASE STATE
  // =============================================================================

  protected readonly lastActionSignal = signal<string>('');

  // Getter to implement ShowcaseComponent interface
  get lastAction(): string {
    return this.lastActionSignal();
  }

  // =============================================================================
  // DEMO DATA
  // =============================================================================

  readonly demoHeader = computed<CardHeader>(() =>
    createCardHeader({
      title: 'Interactive Card',
      subtitle: 'Configurable example',
      avatar: {
        type: 'initials',
        initials: 'IC',
        size: 'md',
        shape: 'circle',
      },
      actions: [
        createCardAction('Settings', () => this.onDemoAction('settings'), {
          icon: '⚙️',
          variant: 'ghost',
        }),
      ],
    }),
  );

  readonly demoFooter = computed<CardFooter>(() =>
    createCardFooter({
      actions: [
        createCardAction('Cancel', () => this.onDemoAction('cancel'), {
          variant: 'secondary',
        }),
        createCardAction('Save', () => this.onDemoAction('save'), {
          variant: 'primary',
        }),
      ],
      align: 'right',
    }),
  );

  readonly demoMedia = computed<CardMedia>(() => ({
    type: 'image',
    src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    alt: 'Demo image',
    position: 'top',
    aspectRatio: '16/9',
  }));

  // Static demo headers
  readonly simpleHeader = computed<CardHeader>(() =>
    createCardHeader({
      title: 'Simple Card Title',
      subtitle: 'Basic header example',
    }),
  );

  readonly avatarHeader = computed<CardHeader>(() =>
    createCardHeader({
      title: 'John Doe',
      subtitle: 'Software Engineer',
      avatar: {
        type: 'initials',
        initials: 'JD',
        size: 'md',
        shape: 'circle',
      },
      actions: [
        createCardAction('Edit', () => this.onDemoAction('edit'), {
          icon: '✏️',
          variant: 'ghost',
        }),
        createCardAction('Delete', () => this.onDemoAction('delete'), {
          icon: '🗑️',
          variant: 'ghost',
        }),
      ],
    }),
  );

  readonly fullHeader = computed<CardHeader>(() =>
    createCardHeader({
      title: 'Project Alpha',
      subtitle: 'Development phase',
      avatar: {
        type: 'icon',
        icon: '📁',
        size: 'md',
        shape: 'rounded',
      },
    }),
  );

  // Demo footers
  readonly actionFooter = computed<CardFooter>(() =>
    createCardFooter({
      actions: [
        createCardAction('Complete', () => this.onDemoAction('complete'), {
          variant: 'primary',
        }),
        createCardAction('Archive', () => this.onDemoAction('archive'), {
          variant: 'secondary',
        }),
      ],
      align: 'right',
    }),
  );

  readonly infoFooter = computed<CardFooter>(() =>
    createCardFooter({
      text: 'Created 2 days ago',
      align: 'between',
    }),
  );

  // Demo media configurations
  readonly topMedia = computed<CardMedia>(() => ({
    type: 'image',
    src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    alt: 'Top media',
    position: 'top',
    aspectRatio: '16/9',
  }));

  readonly leftMedia = computed<CardMedia>(() => ({
    type: 'image',
    src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    alt: 'Left media',
    position: 'left',
  }));

  readonly rightMedia = computed<CardMedia>(() => ({
    type: 'image',
    src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    alt: 'Right media',
    position: 'right',
  }));

  readonly backgroundMedia = computed<CardMedia>(() => ({
    type: 'image',
    src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    alt: 'Background media',
    position: 'background',
  }));

  // State headers
  readonly mediaHeader = computed<CardHeader>(() =>
    createCardHeader({
      title: 'Media Card',
      subtitle: 'With image content',
    }),
  );

  readonly overlayHeader = computed<CardHeader>(() =>
    createCardHeader({
      title: 'Overlay Card',
      subtitle: 'Background image',
    }),
  );

  readonly clickableHeader = computed<CardHeader>(() =>
    createCardHeader({
      title: 'Clickable',
      subtitle: 'Interactive card',
    }),
  );

  readonly selectedHeader = computed<CardHeader>(() =>
    createCardHeader({
      title: 'Selected',
      subtitle: 'Active state',
    }),
  );

  readonly loadingHeader = computed<CardHeader>(() =>
    createCardHeader({
      title: 'Loading',
      subtitle: 'Please wait',
    }),
  );

  readonly disabledHeader = computed<CardHeader>(() =>
    createCardHeader({
      title: 'Disabled',
      subtitle: 'Inactive state',
    }),
  );

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
          name: 'variant',
          type: 'CardVariant',
          defaultValue: 'default',
          description: 'Visual style variant of the card',
          examples: ['default', 'outlined', 'filled', 'elevated', 'ghost'],
        },
        {
          name: 'size',
          type: 'CardSize',
          defaultValue: 'md',
          description: 'Size of the card',
          examples: ['sm', 'md', 'lg', 'xl'],
        },
        {
          name: 'elevation',
          type: 'CardElevation',
          defaultValue: 'sm',
          description: 'Shadow depth level',
          examples: ['none', 'sm', 'md', 'lg', 'xl'],
        },
        {
          name: 'background',
          type: 'CardBackground',
          defaultValue: 'default',
          description: 'Background style',
          examples: ['default', 'muted', 'accent', 'gradient', 'transparent'],
        },
        {
          name: 'interactive',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether the card is clickable',
        },
        {
          name: 'selected',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether the card is selected',
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether the card is disabled',
        },
        {
          name: 'loading',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether to show loading state',
        },
        {
          name: 'bordered',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether to show enhanced border',
        },
        {
          name: 'padded',
          type: 'boolean',
          defaultValue: 'true',
          description: 'Whether card content has padding',
        },
        {
          name: 'header',
          type: 'CardHeader',
          description: 'Card header configuration',
        },
        {
          name: 'footer',
          type: 'CardFooter',
          description: 'Card footer configuration',
        },
        {
          name: 'media',
          type: 'CardMedia',
          description: 'Card media configuration',
        },
      ],
      outputs: [
        {
          name: 'cardClick',
          type: 'CardClickEvent',
          description: 'Emitted when the card is clicked',
          examples: ['{ originalEvent, cardElement }'],
        },
        {
          name: 'cardAction',
          type: 'CardActionEvent',
          description: 'Emitted when a card action is triggered',
          examples: ['{ action, originalEvent }'],
        },
        {
          name: 'cardHover',
          type: 'CardHoverEvent',
          description: 'Emitted when card hover state changes',
          examples: ['{ hovered, originalEvent }'],
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

  onCardClick(event: CardClickEvent): void {
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(`Card clicked at ${timestamp}`);
  }

  onCardAction(event: CardActionEvent): void {
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(`Action "${event.action.label}" triggered at ${timestamp}`);
  }

  onCardHover(event: CardHoverEvent): void {
    if (event.hovered) {
      const timestamp = new Date().toLocaleTimeString();
      this.lastActionSignal.set(`Card hovered at ${timestamp}`);
    }
  }

  onDemoCardClick(cardType: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(`${cardType} card clicked at ${timestamp}`);
  }

  onDemoAction(action: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(`Demo action "${action}" at ${timestamp}`);
  }
}
