import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AccordionComponent } from './accordion.component';
import { ComponentVariant, ComponentSize } from '../shared';

import {
  AccordionItem,
  AccordionMode,
  AccordionItemExpandEvent,
  ACCORDION_VARIANTS,
  ACCORDION_SIZES,
} from './accordion.model';
import {
  createCheckboxControl,
  createSizeControl,
  createTextControl,
  createVariantControl,
  createSelectControl,
  InteractiveConfigChangeEvent,
  InteractiveExampleComponent,
  InteractiveExampleConfig,
} from '../showcases/interactive-example';
import {
  ComponentApiDocumentation,
  createShowcaseConfig,
  ShowcaseComponent,
  ShowcaseConfig,
} from '../showcases/showcase.model';
import { ApiDocumentationComponent } from '../showcases/api-documentation';

// =============================================================================
// ACCORDION INTERACTIVE CONFIG TYPE
// =============================================================================

interface AccordionInteractiveConfig {
  variant: ComponentVariant;
  size: ComponentSize;
  mode: AccordionMode;
  disabled: boolean;
  animated: boolean;
  showIcons: boolean;
  keyboardNavigation: boolean;
}

/**
 * Accordion Component Showcase
 *
 * Demonstrates all accordion variants, sizes, modes, and functionality.
 * Provides interactive examples and complete API documentation.
 */
@Component({
  selector: 'ds-accordion-showcase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AccordionComponent,
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

      <!-- Variants Section -->
      <section class="showcase-section">
        <h2>Variants</h2>
        <p>Different visual styles for various use cases and semantic meanings.</p>

        <div class="showcase-grid">
          @for (variant of accordionVariants; track variant.name) {
            <div class="showcase-item">
              <h3>{{ variant.label }}</h3>
              <p>{{ variant.description }}</p>
              <ds-accordion
                [items]="basicAccordionItems"
                [variant]="variant.name"
                [initialExpanded]="[0]"
                (itemExpanded)="handleVariantExpand(variant.name, $event)"
              ></ds-accordion>
            </div>
          }
        </div>
      </section>

      <!-- Sizes Section -->
      <section class="showcase-section">
        <h2>Sizes</h2>
        <p>Different accordion sizes for various contexts and hierarchies.</p>

        <div class="showcase-grid">
          @for (size of accordionSizes; track size.name) {
            <div class="showcase-item">
              <h3>{{ size.label }}</h3>
              <ds-accordion
                [items]="basicAccordionItems"
                [variant]="'primary'"
                [size]="size.name"
                [initialExpanded]="[0]"
                (itemExpanded)="handleSizeExpand(size.name, $event)"
              ></ds-accordion>
            </div>
          }
        </div>
      </section>

      <!-- Modes Section -->
      <section class="showcase-section">
        <h2>Expansion Modes</h2>
        <p>Single vs multiple item expansion modes.</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Single Mode</h3>
            <p>Only one item can be expanded at a time.</p>
            <ds-accordion
              [items]="modeExampleItems"
              mode="single"
              variant="primary"
              [initialExpanded]="[0]"
              (itemExpanded)="handleModeExpand('single', $event)"
            ></ds-accordion>
          </div>

          <div class="showcase-item">
            <h3>Multiple Mode</h3>
            <p>Multiple items can be expanded simultaneously.</p>
            <ds-accordion
              [items]="modeExampleItems"
              mode="multiple"
              variant="secondary"
              [initialExpanded]="[0, 2]"
              (itemExpanded)="handleModeExpand('multiple', $event)"
            ></ds-accordion>
          </div>
        </div>
      </section>

      <!-- States Section -->
      <section class="showcase-section">
        <h2>States</h2>
        <p>Different accordion states including disabled items and loading states.</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Normal</h3>
            <ds-accordion [items]="basicAccordionItems" variant="primary"></ds-accordion>
          </div>

          <div class="showcase-item">
            <h3>Disabled</h3>
            <ds-accordion
              [items]="basicAccordionItems"
              variant="primary"
              [disabled]="true"
            ></ds-accordion>
          </div>

          <div class="showcase-item">
            <h3>With Disabled Items</h3>
            <ds-accordion [items]="statesExampleItems" variant="primary"></ds-accordion>
          </div>

          <div class="showcase-item">
            <h3>Loading Items</h3>
            <ds-accordion
              [items]="basicAccordionItems"
              variant="primary"
              [loadingItems]="[1]"
            ></ds-accordion>
          </div>

          <div class="showcase-item">
            <h3>Without Icons</h3>
            <ds-accordion
              [items]="basicAccordionItems"
              variant="primary"
              [showIcons]="false"
            ></ds-accordion>
          </div>

          <div class="showcase-item">
            <h3>Without Animations</h3>
            <ds-accordion
              [items]="basicAccordionItems"
              variant="primary"
              [animated]="false"
            ></ds-accordion>
          </div>
        </div>
      </section>

      <!-- Interactive Example -->
      <ds-interactive-example
        [config]="interactiveConfig()"
        [currentConfig]="interactiveAccordionConfig()"
        [lastAction]="lastAction"
        (configChange)="onInteractiveConfigChange($event)"
      >
        <ds-accordion
          [items]="richContentItems"
          [variant]="interactiveAccordionConfig().variant"
          [size]="interactiveAccordionConfig().size"
          [mode]="interactiveAccordionConfig().mode"
          [disabled]="interactiveAccordionConfig().disabled"
          [animated]="interactiveAccordionConfig().animated"
          [showIcons]="interactiveAccordionConfig().showIcons"
          [keyboardNavigation]="interactiveAccordionConfig().keyboardNavigation"
          (itemExpanded)="handleInteractiveExpand($event)"
        ></ds-accordion>
      </ds-interactive-example>

      <!-- Component API -->
      <section class="showcase-section">
        <h2>Component API</h2>
        <ds-api-documentation [api]="showcaseConfig().api" />
      </section>
    </div>
  `,
  styleUrl: '../showcases/showcase.scss',
})
export class AccordionShowcaseComponent implements ShowcaseComponent {
  componentName = 'Accordion Component';
  description =
    'A fully accessible accordion component supporting single and multiple expansion modes. Features smooth animations, keyboard navigation, and comprehensive ARIA support.';

  // =============================================================================
  // SHOWCASE DATA
  // =============================================================================

  readonly accordionVariants = Object.values(ACCORDION_VARIANTS);
  readonly accordionSizes = Object.values(ACCORDION_SIZES);

  // Sample accordion items for basic demonstrations
  readonly basicAccordionItems: AccordionItem[] = [
    {
      key: 'getting-started',
      title: 'Getting Started',
      content: `
        <p>Welcome to our platform! This section will help you get started quickly.</p>
        <ul>
          <li>Create your account</li>
          <li>Set up your profile</li>
          <li>Explore the features</li>
        </ul>
      `,
    },
    {
      key: 'features',
      title: 'Key Features',
      content: `
        <p>Discover the powerful features that make our platform unique:</p>
        <ul>
          <li><strong>Real-time collaboration</strong> - Work together seamlessly</li>
          <li><strong>Advanced analytics</strong> - Get insights into your data</li>
          <li><strong>Secure infrastructure</strong> - Your data is protected</li>
        </ul>
      `,
    },
    {
      key: 'support',
      title: 'Support & Help',
      content: `
        <p>Need help? We're here for you!</p>
        <p>Contact our support team at <a href="mailto:support@example.com">support@example.com</a> 
        or visit our <a href="/help">help center</a> for detailed guides and tutorials.</p>
      `,
    },
  ];

  // Sample items for mode demonstration
  readonly modeExampleItems: AccordionItem[] = [
    {
      key: 'section-1',
      title: 'Section 1',
      content:
        '<p>This is the content of the first section. You can expand multiple sections in multiple mode.</p>',
    },
    {
      key: 'section-2',
      title: 'Section 2',
      content:
        '<p>This is the content of the second section. Try expanding this along with others in multiple mode.</p>',
    },
    {
      key: 'section-3',
      title: 'Section 3',
      content:
        '<p>This is the content of the third section. In single mode, expanding this will collapse others.</p>',
    },
  ];

  // Sample items with different states
  readonly statesExampleItems: AccordionItem[] = [
    {
      key: 'enabled',
      title: 'Enabled Item',
      content: '<p>This item is enabled and can be clicked.</p>',
    },
    {
      key: 'disabled',
      title: 'Disabled Item',
      content: "<p>This content won't be accessible because the item is disabled.</p>",
      disabled: true,
    },
    {
      key: 'custom-icon',
      title: 'Custom Icon Item',
      content: '<p>This item has a custom icon instead of the default chevron.</p>',
      icon: 'star',
    },
  ];

  // Rich content items for interactive example
  readonly richContentItems: AccordionItem[] = [
    {
      key: 'advanced-config',
      title: 'Advanced Configuration',
      content: `
        <h4>Configuration Options</h4>
        <p>The accordion component supports extensive configuration:</p>
        <pre><code>&lt;ds-accordion
  [items]="accordionItems"
  mode="multiple"
  variant="primary"
  size="lg"
  [animated]="true"
  [showIcons]="true"
  [keyboardNavigation]="true"
  (itemExpanded)="handleExpansion($event)"&gt;
&lt;/ds-accordion&gt;</code></pre>
      `,
    },
    {
      key: 'accessibility',
      title: 'Accessibility Features',
      content: `
        <h4>WCAG 2.1 AA Compliance</h4>
        <ul>
          <li>Full keyboard navigation support</li>
          <li>Screen reader announcements</li>
          <li>High contrast mode support</li>
          <li>Focus management</li>
          <li>ARIA attributes</li>
        </ul>
        <p>Use <kbd>Arrow Keys</kbd> to navigate, <kbd>Enter</kbd> or <kbd>Space</kbd> to expand/collapse.</p>
      `,
    },
    {
      key: 'animations',
      title: 'Animation System',
      content: `
        <h4>Smooth Transitions</h4>
        <p>The accordion features CSS-based animations that respect user preferences:</p>
        <ul>
          <li>Smooth expand/collapse transitions</li>
          <li>Icon rotation animations</li>
          <li>Reduced motion support</li>
          <li>Customizable timing</li>
        </ul>
      `,
    },
  ];

  // =============================================================================
  // INTERACTIVE EXAMPLE CONFIGURATION
  // =============================================================================

  private interactiveAccordionConfigSignal = signal<AccordionInteractiveConfig>({
    variant: 'primary',
    size: 'md',
    mode: 'single',
    disabled: false,
    animated: true,
    showIcons: true,
    keyboardNavigation: true,
  });

  readonly interactiveAccordionConfig = computed(() => this.interactiveAccordionConfigSignal());

  readonly interactiveConfig = computed<InteractiveExampleConfig>(() => ({
    title: 'Interactive Accordion Configuration',
    description: 'Try different configurations and see real-time behavior.',
    showOutput: true,
    controls: [
      createVariantControl(this.accordionVariants.map(v => ({ value: v.name, label: v.label }))),
      createSizeControl(this.accordionSizes.map(s => ({ value: s.name, label: s.label }))),
      createSelectControl('mode', 'Expansion mode', 'mode', [
        { value: 'single', label: 'Single' },
        { value: 'multiple', label: 'Multiple' },
      ]),
      createCheckboxControl('disabled', 'Disabled', 'disabled'),
      createCheckboxControl('animated', 'Animated', 'animated'),
      createCheckboxControl('showIcons', 'Show Icons', 'showIcons'),
      createCheckboxControl('keyboardNavigation', 'Keyboard Navigation', 'keyboardNavigation'),
    ],
  }));

  // =============================================================================
  // ACTION TRACKING
  // =============================================================================

  protected readonly lastActionSignal = signal<string>('');

  get lastAction(): string {
    return this.lastActionSignal();
  }

  // =============================================================================
  // SHOWCASE CONFIG
  // =============================================================================

  readonly showcaseConfig = computed<ShowcaseConfig>(() => {
    const api: ComponentApiDocumentation = {
      inputs: [
        {
          name: 'items',
          type: 'AccordionItem[]',
          required: true,
          description: 'Array of accordion items to display',
          defaultValue: '[]',
        },
        {
          name: 'mode',
          type: 'AccordionMode',
          required: false,
          description: 'Expansion mode: single or multiple items',
          defaultValue: 'single',
        },
        {
          name: 'variant',
          type: 'ComponentVariant',
          required: false,
          description: 'Visual variant of the accordion',
          defaultValue: 'primary',
        },
        {
          name: 'size',
          type: 'ComponentSize',
          required: false,
          description: 'Size of the accordion',
          defaultValue: 'md',
        },
        {
          name: 'disabled',
          type: 'boolean',
          required: false,
          description: 'Whether the entire accordion is disabled',
          defaultValue: 'false',
        },
        {
          name: 'animated',
          type: 'boolean',
          required: false,
          description: 'Whether to animate expansions and collapses',
          defaultValue: 'true',
        },
        {
          name: 'showIcons',
          type: 'boolean',
          required: false,
          description: 'Whether to show expansion icons',
          defaultValue: 'true',
        },
        {
          name: 'collapsedIcon',
          type: 'IconName',
          required: false,
          description: 'Icon to show for collapsed items',
          defaultValue: 'chevron-right',
        },
        {
          name: 'expandedIcon',
          type: 'IconName',
          required: false,
          description: 'Icon to show for expanded items',
          defaultValue: 'chevron-down',
        },
        {
          name: 'initialExpanded',
          type: 'number[]',
          required: false,
          description: 'Array of initially expanded item indices',
          defaultValue: '[]',
        },
        {
          name: 'keyboardNavigation',
          type: 'boolean',
          required: false,
          description: 'Whether to enable keyboard navigation',
          defaultValue: 'true',
        },
        {
          name: 'loadingItems',
          type: 'number[]',
          required: false,
          description: 'Array of item indices in loading state',
          defaultValue: '[]',
        },
        {
          name: 'ariaLabel',
          type: 'string',
          required: false,
          description: 'ARIA label for the accordion',
          defaultValue: '',
        },
        {
          name: 'customClasses',
          type: 'string',
          required: false,
          description: 'Additional CSS classes',
          defaultValue: '',
        },
      ],
      outputs: [
        {
          name: 'itemExpanded',
          type: 'AccordionItemExpandEvent',
          description: 'Emitted when an item is expanded or collapsed',
        },
        {
          name: 'focused',
          type: 'AccordionFocusEvent',
          description: 'Emitted when the accordion receives focus',
        },
        {
          name: 'blurred',
          type: 'AccordionFocusEvent',
          description: 'Emitted when the accordion loses focus',
        },
      ],
      methods: [
        {
          name: 'expandItem(index: number)',
          signature: 'expandItem(index: number): void',
          description: 'Programmatically expand a specific item',
        },
        {
          name: 'collapseItem(index: number)',
          signature: 'collapseItem(index: number): void',
          description: 'Programmatically collapse a specific item',
        },
        {
          name: 'toggleItem(index: number)',
          signature: 'toggleItem(index: number): void',
          description: 'Toggle the expansion state of a specific item',
        },
        {
          name: 'expandAll()',
          signature: 'expandAll(): void',
          description: 'Expand all items (only in multiple mode)',
        },
        {
          name: 'collapseAll()',
          signature: 'collapseAll(): void',
          description: 'Collapse all items',
        },
        {
          name: 'focusItem(index: number)',
          signature: 'focusItem(index: number): void',
          description: 'Focus a specific item header',
        },
        {
          name: 'getState()',
          signature: 'getState(): AccordionState',
          description: 'Get the current component state',
        },
      ],
    };

    return createShowcaseConfig(
      {
        componentName: this.componentName,
        description: this.description,
      },
      api,
    );
  });

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  handleVariantExpand(variant: ComponentVariant, event: AccordionItemExpandEvent): void {
    this.lastActionSignal.set(
      `${variant} variant - item ${event.itemIndex} ${event.expanded ? 'expanded' : 'collapsed'}`,
    );
  }

  handleSizeExpand(size: ComponentSize, event: AccordionItemExpandEvent): void {
    this.lastActionSignal.set(
      `${size} size - item ${event.itemIndex} ${event.expanded ? 'expanded' : 'collapsed'}`,
    );
  }

  handleModeExpand(mode: string, event: AccordionItemExpandEvent): void {
    this.lastActionSignal.set(
      `${mode} mode - item ${event.itemIndex} ${event.expanded ? 'expanded' : 'collapsed'}`,
    );
  }

  handleInteractiveExpand(event: AccordionItemExpandEvent): void {
    const itemTitle = event.item.title;
    this.lastActionSignal.set(
      `Interactive: "${itemTitle}" ${event.expanded ? 'expanded' : 'collapsed'} at ${new Date().toLocaleTimeString()}`,
    );
  }

  onInteractiveConfigChange(event: InteractiveConfigChangeEvent<AccordionInteractiveConfig>): void {
    this.interactiveAccordionConfigSignal.set(event.config);
    this.lastActionSignal.set(`Config changed: ${event.property} = ${event.value}`);
  }
}
