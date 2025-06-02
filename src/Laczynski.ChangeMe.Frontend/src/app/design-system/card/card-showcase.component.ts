// =============================================================================
// Card Showcase Component
// =============================================================================
// Comprehensive demonstration of the Card component features

import { Component, signal, computed, OnInit, inject, TemplateRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardComponent } from './card.component';
import { ApiDocumentationComponent } from '../showcases/api-documentation';
import {
  InteractiveExampleComponent,
  InteractiveExampleConfig,
  InteractiveConfigChangeEvent,
  createSelectControl,
  createCheckboxControl,
} from '../showcases/interactive-example';

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
} from '../showcases/showcase.model';

// =============================================================================
// CARD INTERACTIVE CONFIG TYPE
// =============================================================================

interface CardInteractiveConfig {
  variant: CardVariant;
  size: CardSize;
  elevation: CardElevation;
  background: CardBackground;
  interactive: boolean;
  showHeader: boolean;
  showFooter: boolean;
  showMedia: boolean;
  bordered: boolean;
  loading: boolean;
}

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
  imports: [
    CommonModule,
    CardComponent,
    FormsModule,
    ApiDocumentationComponent,
    InteractiveExampleComponent,
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

      <!-- Interactive Example using new component -->
      <ds-interactive-example
        [config]="interactiveConfig()"
        [currentConfig]="interactiveCardConfig()"
        [lastAction]="lastAction"
        (configChange)="onInteractiveConfigChange($event)"
      >
        <ds-card
          [variant]="interactiveCardConfig().variant"
          [size]="interactiveCardConfig().size"
          [elevation]="interactiveCardConfig().elevation"
          [background]="interactiveCardConfig().background"
          [interactive]="interactiveCardConfig().interactive"
          [bordered]="interactiveCardConfig().bordered"
          [loading]="interactiveCardConfig().loading"
          [header]="interactiveCardConfig().showHeader ? demoHeader() : null"
          [footer]="interactiveCardConfig().showFooter ? demoFooter() : null"
          [media]="interactiveCardConfig().showMedia ? demoMedia() : null"
          (cardClick)="onCardClick($event)"
          (cardAction)="onCardAction($event)"
          (cardHover)="onCardHover($event)"
        >
          <h4>Interactive Card Content</h4>
          <p>
            This is an example of card content that can be customized using the controls on the
            left.
          </p>
          <p>Cards can contain any content including text, images, lists, and other components.</p>
        </ds-card>
      </ds-interactive-example>

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
        <p>Different card sizes for various layouts and content density:</p>

        <div class="showcase-grid">
          @for (size of sizes; track size.value) {
            <div class="showcase-item">
              <h3>{{ size.label }}</h3>
              <ds-card [variant]="'elevated'" [size]="size.value">
                <h4>{{ size.label }} Card</h4>
                <p>This card demonstrates the {{ size.label.toLowerCase() }} size variant.</p>
              </ds-card>
            </div>
          }
        </div>
      </section>

      <!-- Elevations -->
      <section class="showcase-section">
        <h2>Elevation Levels</h2>
        <p>Different shadow depths for creating visual hierarchy:</p>

        <div class="showcase-grid">
          @for (elevation of elevations; track elevation.value) {
            <div class="showcase-item">
              <h3>{{ elevation.label }}</h3>
              <ds-card [variant]="'elevated'" [elevation]="elevation.value" [size]="'md'">
                <h4>{{ elevation.label }} Elevation</h4>
                <p>This card shows {{ elevation.value }} elevation level.</p>
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
        <ds-api-documentation [api]="showcaseConfig().api" />
      </section>
    </div>
  `,
  styleUrl: '../showcases/showcase.scss',
})
export class CardShowcaseComponent implements ShowcaseComponent, OnInit {
  componentName = 'Card Component';
  description =
    'A flexible container component for grouping related content and actions. Supports headers, footers, media, and various visual styles.';

  // =============================================================================
  // SHOWCASE DATA
  // =============================================================================

  readonly variants = [
    { value: 'elevated' as CardVariant, label: 'Elevated' },
    { value: 'outlined' as CardVariant, label: 'Outlined' },
    { value: 'filled' as CardVariant, label: 'Filled' },
  ];

  readonly sizes = [
    { value: 'sm' as CardSize, label: 'Small' },
    { value: 'md' as CardSize, label: 'Medium' },
    { value: 'lg' as CardSize, label: 'Large' },
  ];

  readonly elevations = [
    { value: 'none' as CardElevation, label: 'None' },
    { value: 'sm' as CardElevation, label: 'Small' },
    { value: 'md' as CardElevation, label: 'Medium' },
    { value: 'lg' as CardElevation, label: 'Large' },
    { value: 'xl' as CardElevation, label: 'Extra Large' },
  ];

  // =============================================================================
  // INTERACTIVE EXAMPLE CONFIGURATION
  // =============================================================================

  private interactiveCardConfigSignal = signal<CardInteractiveConfig>({
    variant: 'elevated',
    size: 'md',
    elevation: 'md',
    background: 'default',
    interactive: true,
    showHeader: true,
    showFooter: true,
    showMedia: false,
    bordered: false,
    loading: false,
  });

  readonly interactiveCardConfig = computed(() => this.interactiveCardConfigSignal());

  readonly interactiveConfig = computed<InteractiveExampleConfig>(() => ({
    title: 'Interactive Card Example',
    description: 'Customize the card properties using the controls below.',
    controls: [
      createSelectControl('variant', 'Variant', 'variant', [
        { value: 'elevated', label: 'Elevated' },
        { value: 'outlined', label: 'Outlined' },
        { value: 'filled', label: 'Filled' },
      ]),
      createSelectControl('size', 'Size', 'size', [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
      ]),
      createSelectControl('elevation', 'Elevation', 'elevation', [
        { value: 'none', label: 'None' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' },
      ]),
      createSelectControl('background', 'Background', 'background', [
        { value: 'default', label: 'Default' },
        { value: 'paper', label: 'Paper' },
        { value: 'surface', label: 'Surface' },
      ]),
      createCheckboxControl('interactive', 'Interactive', 'interactive'),
      createCheckboxControl('showHeader', 'Show Header', 'showHeader'),
      createCheckboxControl('showFooter', 'Show Footer', 'showFooter'),
      createCheckboxControl('showMedia', 'Show Media', 'showMedia'),
      createCheckboxControl('bordered', 'Bordered', 'bordered'),
      createCheckboxControl('loading', 'Loading', 'loading'),
    ],
    showOutput: true,
  }));

  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================

  protected readonly lastActionSignal = signal<string>('');

  get lastAction(): string {
    return this.lastActionSignal();
  }

  // =============================================================================
  // COMPUTED PROPERTIES
  // =============================================================================

  readonly demoHeader = computed<CardHeader>(() =>
    createCardHeader({
      title: 'Card Title',
      subtitle: 'Card subtitle with additional information',
    }),
  );

  readonly demoFooter = computed<CardFooter>(() =>
    createCardFooter({
      text: 'Footer content with additional actions or information.',
      actions: [
        createCardAction('Cancel', () => this.onDemoAction('cancel'), { variant: 'secondary' }),
        createCardAction('Save', () => this.onDemoAction('save'), { variant: 'primary' }),
      ],
    }),
  );

  readonly demoMedia = computed<CardMedia>(() => ({
    type: 'image',
    src: 'https://via.placeholder.com/400x200',
    alt: 'Demo image',
    position: 'top',
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
          defaultValue: 'elevated',
          description: 'Visual style variant of the card',
          examples: ['elevated', 'outlined', 'filled'],
        },
        {
          name: 'size',
          type: 'CardSize',
          defaultValue: 'md',
          description: 'Size of the card',
          examples: ['sm', 'md', 'lg'],
        },
        {
          name: 'elevation',
          type: 'CardElevation',
          defaultValue: 'md',
          description: 'Shadow depth level',
          examples: ['none', 'sm', 'md', 'lg', 'xl'],
        },
        {
          name: 'interactive',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether the card is clickable',
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
  // LIFECYCLE HOOKS
  // =============================================================================

  ngOnInit(): void {
    this.lastActionSignal.set('Component initialized');
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  onCardClick(event: CardClickEvent): void {
    this.lastActionSignal.set(`Card clicked`);
  }

  onCardAction(event: CardActionEvent): void {
    this.lastActionSignal.set(`Card action: ${event.action.label}`);
  }

  onCardHover(event: CardHoverEvent): void {
    this.lastActionSignal.set(`Card hover: ${event.hovered ? 'entered' : 'left'}`);
  }

  onInteractiveConfigChange(event: InteractiveConfigChangeEvent<CardInteractiveConfig>): void {
    this.interactiveCardConfigSignal.set(event.config);
    this.lastActionSignal.set(`Configuration changed: ${event.property} = ${event.value}`);
  }

  onDemoCardClick(cardType: string): void {
    this.lastActionSignal.set(`Demo ${cardType} card clicked`);
  }

  onDemoAction(action: string): void {
    this.lastActionSignal.set(`Demo action: ${action}`);
  }
}
