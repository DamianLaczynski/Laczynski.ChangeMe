import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CheckboxComponent } from './checkbox.component';
import { ApiDocumentationComponent } from '../showcases/api-documentation';
import {
  InteractiveConfigChangeEvent,
  InteractiveExampleComponent,
  InteractiveExampleConfig,
  createCheckboxControl,
  createSelectControl,
  createTextControl,
} from '../showcases/interactive-example';

import { ComponentSize } from '../shared';
import {
  CheckboxOption,
  CheckboxVariant,
  CheckboxGroupLayout,
  CheckboxChangeEvent,
  CheckboxFocusEvent,
  createCheckboxOption,
} from './checkbox.model';
import {
  ShowcaseComponent,
  ComponentApiDocumentation,
  createShowcaseConfig,
  ShowcaseConfig,
} from '../showcases/showcase.model';

// =============================================================================
// CHECKBOX INTERACTIVE CONFIG TYPE
// =============================================================================

interface CheckboxInteractiveConfig {
  variant: CheckboxVariant;
  size: ComponentSize;
  label: string;
  helperText: string;
  disabled: boolean;
  required: boolean;
  indeterminate: boolean;
  isGroup: boolean;
  groupLayout: CheckboxGroupLayout;
  showSelectAll: boolean;
  value: boolean | any[];
}

/**
 * Checkbox Component Showcase
 *
 * Demonstrates all variants, states, and features of the Checkbox component
 * with interactive controls and comprehensive documentation.
 */
@Component({
  selector: 'checkbox-showcase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CheckboxComponent,
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

      <!-- Interactive Example using new component -->
      <ds-interactive-example
        [config]="interactiveConfig()"
        [currentConfig]="interactiveCheckboxConfig()"
        [lastAction]="lastAction"
        (configChange)="onInteractiveConfigChange($event)"
      >
        <ds-checkbox
          [variant]="interactiveCheckboxConfig().variant"
          [size]="interactiveCheckboxConfig().size"
          [label]="interactiveCheckboxConfig().label"
          [helperText]="interactiveCheckboxConfig().helperText"
          [disabled]="interactiveCheckboxConfig().disabled"
          [required]="interactiveCheckboxConfig().required"
          [indeterminate]="interactiveCheckboxConfig().indeterminate"
          [isGroup]="interactiveCheckboxConfig().isGroup"
          [groupLayout]="interactiveCheckboxConfig().groupLayout"
          [showSelectAll]="interactiveCheckboxConfig().showSelectAll"
          [value]="interactiveCheckboxConfig().value"
          [options]="interactiveCheckboxConfig().isGroup ? demoOptions() : []"
          (checkedChange)="onCheckedChange($event)"
          (focus)="onFocus($event)"
        />
      </ds-interactive-example>

      <!-- Single Checkboxes Section -->
      <section class="showcase-section">
        <h2>Single Checkboxes</h2>

        <!-- Variants -->
        <div class="showcase-subsection">
          <h3>Variants</h3>
          <div class="showcase-grid">
            @for (variant of checkboxVariants; track variant) {
              <div class="showcase-item">
                <h4>{{ variant | titlecase }}</h4>
                <ds-checkbox
                  [variant]="variant"
                  label="Checkbox Option"
                  [value]="false"
                  size="md"
                />
              </div>
            }
          </div>
        </div>

        <!-- Sizes -->
        <div class="showcase-subsection">
          <h3>Sizes</h3>
          <div class="showcase-grid">
            @for (size of checkboxSizes; track size) {
              <div class="showcase-item">
                <h4>{{ getSizeLabel(size) }}</h4>
                <ds-checkbox
                  variant="default"
                  [label]="getSizeLabel(size)"
                  [value]="false"
                  [size]="size"
                />
              </div>
            }
          </div>
        </div>

        <!-- States -->
        <div class="showcase-subsection">
          <h3>States</h3>
          <div class="showcase-grid">
            <!-- Default -->
            <div class="showcase-item">
              <h4>Default</h4>
              <ds-checkbox label="Default checkbox" [value]="false" size="md" />
            </div>

            <!-- Checked -->
            <div class="showcase-item">
              <h4>Checked</h4>
              <ds-checkbox label="Checked checkbox" [value]="true" size="md" />
            </div>

            <!-- Indeterminate -->
            <div class="showcase-item">
              <h4>Indeterminate</h4>
              <ds-checkbox
                label="Indeterminate checkbox"
                [value]="false"
                [indeterminate]="true"
                size="md"
              />
            </div>

            <!-- Disabled -->
            <div class="showcase-item">
              <h4>Disabled</h4>
              <ds-checkbox label="Disabled checkbox" [value]="false" [disabled]="true" size="md" />
            </div>

            <!-- Disabled Checked -->
            <div class="showcase-item">
              <h4>Disabled Checked</h4>
              <ds-checkbox label="Disabled checked" [value]="true" [disabled]="true" size="md" />
            </div>

            <!-- Required -->
            <div class="showcase-item">
              <h4>Required</h4>
              <ds-checkbox label="Required checkbox" [value]="false" [required]="true" size="md" />
            </div>

            <!-- With Helper Text -->
            <div class="showcase-item">
              <h4>With Helper Text</h4>
              <ds-checkbox
                label="Checkbox with help"
                helperText="This is helpful information"
                [value]="false"
                size="md"
              />
            </div>

            <!-- No Label -->
            <div class="showcase-item">
              <h4>No Label</h4>
              <ds-checkbox [value]="false" size="md" />
            </div>
          </div>
        </div>
      </section>

      <!-- Checkbox Groups Section -->
      <section class="showcase-section">
        <h2>Checkbox Groups</h2>

        <!-- Basic Group -->
        <div class="showcase-subsection">
          <h3>Basic Group</h3>
          <ds-checkbox
            [isGroup]="true"
            label="Select Programming Languages"
            [options]="programmingLanguages"
            [value]="[]"
            groupLayout="vertical"
          />
        </div>

        <!-- Group with Select All -->
        <div class="showcase-subsection">
          <h3>With Select All</h3>
          <ds-checkbox
            [isGroup]="true"
            label="Select Skills"
            [options]="skillOptions"
            [value]="[]"
            [showSelectAll]="true"
            selectAllText="Select All Skills"
            groupLayout="vertical"
          />
        </div>

        <!-- Group Layouts -->
        <div class="showcase-subsection">
          <h3>Group Layouts</h3>

          <div class="layout-demo">
            <h4>Vertical Layout</h4>
            <ds-checkbox
              [isGroup]="true"
              label="Vertical Options"
              [options]="layoutOptions"
              [value]="[]"
              groupLayout="vertical"
            />
          </div>

          <div class="layout-demo">
            <h4>Horizontal Layout</h4>
            <ds-checkbox
              [isGroup]="true"
              label="Horizontal Options"
              [options]="layoutOptions"
              [value]="[]"
              groupLayout="horizontal"
            />
          </div>

          <div class="layout-demo">
            <h4>Grid Layout</h4>
            <ds-checkbox
              [isGroup]="true"
              label="Grid Options"
              [options]="gridOptions"
              [value]="[]"
              groupLayout="grid"
            />
          </div>
        </div>

        <!-- Options with Descriptions -->
        <div class="showcase-subsection">
          <h3>Options with Descriptions</h3>
          <ds-checkbox
            [isGroup]="true"
            label="Select Features"
            [options]="featureOptions"
            [value]="[]"
            groupLayout="vertical"
          />
        </div>

        <!-- Disabled Options -->
        <div class="showcase-subsection">
          <h3>Mixed Disabled Options</h3>
          <ds-checkbox
            [isGroup]="true"
            label="Available Services"
            [options]="serviceOptions"
            [value]="[]"
            groupLayout="vertical"
          />
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
export class CheckboxShowcaseComponent implements ShowcaseComponent {
  // =============================================================================
  // SHOWCASE IMPLEMENTATION
  // =============================================================================

  componentName = 'Checkbox Component';
  description =
    'Flexible checkbox component supporting single selections, groups, and advanced features like indeterminate state. Built with accessibility in mind.';

  private lastActionSignal = signal<string>('');

  get lastAction(): string {
    return this.lastActionSignal();
  }

  // =============================================================================
  // DEMO CONFIGURATION
  // =============================================================================

  checkboxVariants: CheckboxVariant[] = [
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
  ];
  checkboxSizes: ComponentSize[] = ['sm', 'md', 'lg'];
  groupLayouts: CheckboxGroupLayout[] = ['vertical', 'horizontal', 'grid'];

  // =============================================================================
  // INTERACTIVE EXAMPLE CONFIGURATION
  // =============================================================================

  private interactiveCheckboxConfigSignal = signal<CheckboxInteractiveConfig>({
    variant: 'default',
    size: 'md',
    label: 'Demo Checkbox',
    helperText: '',
    disabled: false,
    required: false,
    indeterminate: false,
    isGroup: false,
    groupLayout: 'vertical',
    showSelectAll: false,
    value: false,
  });

  readonly interactiveCheckboxConfig = computed(() => this.interactiveCheckboxConfigSignal());

  readonly interactiveConfig = computed<InteractiveExampleConfig>(() => ({
    title: 'Interactive Checkbox Configuration',
    description: 'Customize the checkbox properties using the controls below.',
    controls: [
      createSelectControl('variant', 'Variant', 'variant', [
        { value: 'default', label: 'Default' },
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'success', label: 'Success' },
        { value: 'warning', label: 'Warning' },
        { value: 'danger', label: 'Danger' },
      ]),
      createSelectControl('size', 'Size', 'size', [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
      ]),
      createTextControl('label', 'Label', 'label', { placeholder: 'Enter label...' }),
      createTextControl('helperText', 'Helper Text', 'helperText', {
        placeholder: 'Enter helper text...',
      }),
      createCheckboxControl('disabled', 'Disabled', 'disabled'),
      createCheckboxControl('required', 'Required', 'required'),
      createCheckboxControl('indeterminate', 'Indeterminate', 'indeterminate'),
      createCheckboxControl('isGroup', 'Is Group', 'isGroup'),
      createSelectControl('groupLayout', 'Group Layout', 'groupLayout', [
        { value: 'vertical', label: 'Vertical' },
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'grid', label: 'Grid' },
      ]),
      createCheckboxControl('showSelectAll', 'Show Select All', 'showSelectAll'),
    ],
    showOutput: true,
  }));

  // =============================================================================
  // LEGACY DEMO CONFIG (keeping for backward compatibility)
  // =============================================================================

  demoConfigVariant = signal<CheckboxVariant>('default');
  demoConfigSize = signal<ComponentSize>('md');
  demoConfigLabel = signal<string>('Demo Checkbox');
  demoConfigHelperText = signal<string>('');
  demoConfigDisabled = signal<boolean>(false);
  demoConfigRequired = signal<boolean>(false);
  demoConfigIndeterminate = signal<boolean>(false);
  demoConfigIsGroup = signal<boolean>(false);
  demoConfigGroupLayout = signal<CheckboxGroupLayout>('vertical');
  demoConfigShowSelectAll = signal<boolean>(false);

  demoValue = signal<boolean | any[]>(false);

  // Computed properties for two-way binding with ngModel
  get demoConfigVariantValue(): CheckboxVariant {
    return this.demoConfigVariant();
  }
  set demoConfigVariantValue(value: CheckboxVariant) {
    this.demoConfigVariant.set(value);
  }

  get demoConfigSizeValue(): ComponentSize {
    return this.demoConfigSize();
  }
  set demoConfigSizeValue(value: ComponentSize) {
    this.demoConfigSize.set(value);
  }

  get demoConfigLabelValue(): string {
    return this.demoConfigLabel();
  }
  set demoConfigLabelValue(value: string) {
    this.demoConfigLabel.set(value);
  }

  get demoConfigHelperTextValue(): string {
    return this.demoConfigHelperText();
  }
  set demoConfigHelperTextValue(value: string) {
    this.demoConfigHelperText.set(value);
  }

  get demoConfigDisabledValue(): boolean {
    return this.demoConfigDisabled();
  }
  set demoConfigDisabledValue(value: boolean) {
    this.demoConfigDisabled.set(value);
  }

  get demoConfigRequiredValue(): boolean {
    return this.demoConfigRequired();
  }
  set demoConfigRequiredValue(value: boolean) {
    this.demoConfigRequired.set(value);
  }

  get demoConfigIndeterminateValue(): boolean {
    return this.demoConfigIndeterminate();
  }
  set demoConfigIndeterminateValue(value: boolean) {
    this.demoConfigIndeterminate.set(value);
  }

  get demoConfigIsGroupValue(): boolean {
    return this.demoConfigIsGroup();
  }
  set demoConfigIsGroupValue(value: boolean) {
    this.demoConfigIsGroup.set(value);
    // Reset value when changing mode
    this.demoValue.set(value ? [] : false);
  }

  get demoConfigGroupLayoutValue(): CheckboxGroupLayout {
    return this.demoConfigGroupLayout();
  }
  set demoConfigGroupLayoutValue(value: CheckboxGroupLayout) {
    this.demoConfigGroupLayout.set(value);
  }

  get demoConfigShowSelectAllValue(): boolean {
    return this.demoConfigShowSelectAll();
  }
  set demoConfigShowSelectAllValue(value: boolean) {
    this.demoConfigShowSelectAll.set(value);
  }

  // Computed demo options
  demoOptions = computed(() => {
    return this.demoConfigIsGroup() ? this.programmingLanguages : [];
  });

  // =============================================================================
  // SAMPLE DATA
  // =============================================================================

  programmingLanguages: CheckboxOption[] = [
    createCheckboxOption('js', 'JavaScript'),
    createCheckboxOption('ts', 'TypeScript'),
    createCheckboxOption('angular', 'Angular'),
    createCheckboxOption('react', 'React'),
    createCheckboxOption('vue', 'Vue.js'),
  ];

  skillOptions: CheckboxOption[] = [
    createCheckboxOption('communication', 'Communication'),
    createCheckboxOption('leadership', 'Leadership'),
    createCheckboxOption('teamwork', 'Teamwork'),
    createCheckboxOption('problem-solving', 'Problem Solving'),
  ];

  layoutOptions: CheckboxOption[] = [
    createCheckboxOption('option1', 'Option 1'),
    createCheckboxOption('option2', 'Option 2'),
    createCheckboxOption('option3', 'Option 3'),
  ];

  gridOptions: CheckboxOption[] = [
    createCheckboxOption('grid1', 'Grid Item 1'),
    createCheckboxOption('grid2', 'Grid Item 2'),
    createCheckboxOption('grid3', 'Grid Item 3'),
    createCheckboxOption('grid4', 'Grid Item 4'),
    createCheckboxOption('grid5', 'Grid Item 5'),
    createCheckboxOption('grid6', 'Grid Item 6'),
  ];

  featureOptions: CheckboxOption[] = [
    createCheckboxOption('notifications', 'Push Notifications', {
      description: 'Receive real-time notifications about important updates',
    }),
    createCheckboxOption('analytics', 'Analytics Tracking', {
      description: 'Help us improve the app by sharing anonymous usage data',
    }),
    createCheckboxOption('location', 'Location Services', {
      description: 'Allow location access for personalized content',
    }),
    createCheckboxOption('sync', 'Cloud Sync', {
      description: 'Automatically backup and sync your data across devices',
    }),
  ];

  serviceOptions: CheckboxOption[] = [
    createCheckboxOption('basic', 'Basic Plan'),
    createCheckboxOption('premium', 'Premium Plan'),
    createCheckboxOption('enterprise', 'Enterprise Plan', { disabled: true }),
    createCheckboxOption('addon1', 'Extra Storage'),
    createCheckboxOption('addon2', 'Priority Support', { disabled: true }),
  ];

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
          type: 'CheckboxVariant',
          defaultValue: "'default'",
          required: false,
          description: 'Visual style variant of the checkbox',
          examples: ['default', 'filled', 'outlined'],
        },
        {
          name: 'size',
          type: 'CheckboxSize',
          defaultValue: "'md'",
          required: false,
          description: 'Size of the checkbox',
          examples: ['sm', 'md', 'lg'],
        },
        {
          name: 'label',
          type: 'string',
          required: false,
          description: 'Label text for the checkbox',
        },
        {
          name: 'value',
          type: 'boolean | any[]',
          defaultValue: 'false',
          required: false,
          description: 'Checkbox value (boolean for single, array for groups)',
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether the checkbox is disabled',
        },
        {
          name: 'required',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether the checkbox is required',
        },
        {
          name: 'indeterminate',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether the checkbox is in indeterminate state',
        },
        {
          name: 'helperText',
          type: 'string',
          required: false,
          description: 'Helper text to display below the checkbox',
        },
        {
          name: 'isGroup',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether this is a checkbox group',
        },
        {
          name: 'options',
          type: 'CheckboxOption[]',
          required: false,
          description: 'Options for checkbox group',
        },
        {
          name: 'groupLayout',
          type: 'CheckboxGroupLayout',
          defaultValue: "'vertical'",
          required: false,
          description: 'Layout for checkbox group',
          examples: ['vertical', 'horizontal', 'grid'],
        },
        {
          name: 'showSelectAll',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether to show select all option in groups',
        },
        {
          name: 'selectAllText',
          type: 'string',
          defaultValue: "'Select All'",
          required: false,
          description: 'Text for select all option',
        },
      ],
      outputs: [
        {
          name: 'valueChange',
          type: 'CheckboxChangeEvent',
          description: 'Emitted when checkbox value changes',
          examples: ['{ value, checked, checkboxElement, originalEvent }'],
        },
        {
          name: 'focused',
          type: 'CheckboxFocusEvent',
          description: 'Emitted when checkbox receives focus',
        },
        {
          name: 'blurred',
          type: 'CheckboxFocusEvent',
          description: 'Emitted when checkbox loses focus',
        },
      ],
      methods: [
        {
          name: 'focus',
          signature: 'focus(): void',
          description: 'Programmatically focus the checkbox',
        },
        {
          name: 'blur',
          signature: 'blur(): void',
          description: 'Programmatically blur the checkbox',
        },
        {
          name: 'toggle',
          signature: 'toggle(): void',
          description: 'Toggle the checkbox state',
        },
        {
          name: 'selectAll',
          signature: 'selectAll(): void',
          description: 'Select all options in group (group mode only)',
        },
        {
          name: 'deselectAll',
          signature: 'deselectAll(): void',
          description: 'Deselect all options in group (group mode only)',
        },
      ],
    };

    return createShowcaseConfig(componentInfo, apiDocumentation);
  });

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  onCheckedChange(event: CheckboxChangeEvent): void {
    if (this.demoConfigIsGroup()) {
      const values = event.checked as any[];
      const count = values.length;
      this.lastActionSignal.set(`Group selection changed: ${count} items selected`);
    } else {
      const checked = event.checked as boolean;
      this.lastActionSignal.set(`Checkbox ${checked ? 'checked' : 'unchecked'}`);
    }
  }

  onFocus(event: CheckboxFocusEvent): void {
    this.lastActionSignal.set(`Checkbox ${event.direction === 'in' ? 'focused' : 'blurred'}`);
  }

  onInteractiveConfigChange(event: InteractiveConfigChangeEvent<CheckboxInteractiveConfig>): void {
    this.interactiveCheckboxConfigSignal.set(event.config);
    this.lastActionSignal.set(`Configuration changed: ${event.property} = ${event.value}`);
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  getSizeLabel(size: ComponentSize): string {
    return `${size.toUpperCase()} Size`;
  }
}
