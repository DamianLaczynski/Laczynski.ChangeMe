import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SelectComponent } from './select.component';

import {
  SelectOption,
  SelectVariant,
  SelectSize,
  SelectChangeEvent,
  SelectSearchEvent,
  SelectToggleEvent,
  SelectFocusEvent,
  createSelectOption,
} from './select.model';
import {
  ShowcaseComponent,
  ComponentApiDocumentation,
  createShowcaseConfig,
  ShowcaseConfig,
} from '../showcases/showcase.model';
import { ApiDocumentationComponent } from '../showcases/api-documentation';
import {
  createCheckboxControl,
  createSelectControl,
  createTextControl,
  InteractiveConfigChangeEvent,
  InteractiveExampleComponent,
  InteractiveExampleConfig,
} from '../showcases/interactive-example';

// =============================================================================
// SELECT INTERACTIVE CONFIG TYPE
// =============================================================================

interface SelectInteractiveConfig {
  variant: SelectVariant;
  size: SelectSize;
  label: string;
  placeholder: string;
  disabled: boolean;
  required: boolean;
  multiple: boolean;
  searchable: boolean;
  loading: boolean;
  helperText: string;
  value: any;
}

/**
 * Select Component Showcase
 *
 * Demonstrates all variants, states, and features of the Select component
 * with interactive controls and comprehensive documentation.
 */
@Component({
  selector: 'select-showcase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectComponent,
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
        [currentConfig]="interactiveSelectConfig()"
        [lastAction]="lastAction"
        (configChange)="onInteractiveConfigChange($event)"
      >
        <ds-select
          [variant]="interactiveSelectConfig().variant"
          [size]="interactiveSelectConfig().size"
          [label]="interactiveSelectConfig().label"
          [placeholder]="interactiveSelectConfig().placeholder"
          [disabled]="interactiveSelectConfig().disabled"
          [required]="interactiveSelectConfig().required"
          [multiple]="interactiveSelectConfig().multiple"
          [searchable]="interactiveSelectConfig().searchable"
          [loading]="interactiveSelectConfig().loading"
          [helperText]="interactiveSelectConfig().helperText"
          [value]="interactiveSelectConfig().value"
          [options]="demoOptions()"
          (selectionChange)="onSelectionChange($event)"
          (search)="onSearch($event)"
          (toggle)="onToggle($event)"
          (focus)="onFocus($event)"
        />
      </ds-interactive-example>

      <!-- Variants Section -->
      <section class="showcase-section">
        <h2>Select Variants</h2>
        <div class="showcase-grid">
          @for (variant of selectVariants; track variant) {
            <div class="showcase-item">
              <h3>{{ variant | titlecase }}</h3>
              <ds-select
                [variant]="variant"
                label="Select Option"
                placeholder="Choose..."
                [options]="basicOptions"
                [value]="null"
                size="md"
              />
            </div>
          }
        </div>
      </section>

      <!-- Sizes Section -->
      <section class="showcase-section">
        <h2>Sizes</h2>
        <div class="showcase-grid">
          @for (size of selectSizes; track size) {
            <div class="showcase-item">
              <h3>{{ getSizeLabel(size) }}</h3>
              <ds-select
                variant="default"
                [label]="getSizeLabel(size)"
                placeholder="Choose..."
                [options]="basicOptions"
                [value]="null"
                [size]="size"
              />
            </div>
          }
        </div>
      </section>

      <!-- States Section -->
      <section class="showcase-section">
        <h2>States</h2>
        <div class="showcase-grid">
          <!-- Default -->
          <div class="showcase-item">
            <h3>Default</h3>
            <ds-select
              label="Default Select"
              placeholder="Choose an option..."
              [options]="basicOptions"
              [value]="null"
              size="md"
            />
          </div>

          <!-- With Selection -->
          <div class="showcase-item">
            <h3>With Selection</h3>
            <ds-select
              label="Selected Value"
              placeholder="Choose an option..."
              [options]="basicOptions"
              [value]="basicOptions[1].value"
              size="md"
            />
          </div>

          <!-- Disabled -->
          <div class="showcase-item">
            <h3>Disabled</h3>
            <ds-select
              label="Disabled Select"
              placeholder="Cannot select..."
              [options]="basicOptions"
              [value]="null"
              size="md"
              [disabled]="true"
            />
          </div>

          <!-- Required -->
          <div class="showcase-item">
            <h3>Required</h3>
            <ds-select
              label="Required Select"
              placeholder="This field is required"
              [options]="basicOptions"
              [value]="null"
              size="md"
              [required]="true"
            />
          </div>

          <!-- With Helper Text -->
          <div class="showcase-item">
            <h3>With Helper Text</h3>
            <ds-select
              label="Select with Help"
              placeholder="Choose an option..."
              helperText="This is helpful information about the select"
              [options]="basicOptions"
              [value]="null"
              size="md"
            />
          </div>

          <!-- Loading -->
          <div class="showcase-item">
            <h3>Loading</h3>
            <ds-select
              label="Loading Select"
              placeholder="Loading options..."
              [options]="[]"
              [value]="null"
              size="md"
              [loading]="true"
            />
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="showcase-section">
        <h2>Features</h2>
        <div class="showcase-grid">
          <!-- Searchable -->
          <div class="showcase-item">
            <h3>Searchable</h3>
            <ds-select
              label="Search Countries"
              placeholder="Search and select..."
              [options]="countryOptions"
              [value]="null"
              size="md"
              [searchable]="true"
            />
          </div>

          <!-- Multi-select -->
          <div class="showcase-item">
            <h3>Multi-select</h3>
            <ds-select
              label="Multiple Technologies"
              placeholder="Select technologies..."
              [options]="techOptions"
              [value]="[]"
              size="md"
              [multiple]="true"
              [showSelectedItems]="true"
            />
          </div>

          <!-- With Groups -->
          <div class="showcase-item">
            <h3>Grouped Options</h3>
            <ds-select
              label="Programming Languages"
              placeholder="Select language..."
              [options]="groupedOptions"
              [value]="null"
              size="md"
            />
          </div>

          <!-- With Icons & Descriptions -->
          <div class="showcase-item">
            <h3>Rich Options</h3>
            <ds-select
              label="Select User"
              placeholder="Choose user..."
              [options]="userOptions"
              [value]="null"
              size="md"
            />
          </div>

          <!-- Limited Multi-select -->
          <div class="showcase-item">
            <h3>Limited Multi-select</h3>
            <ds-select
              label="Max 3 Skills"
              placeholder="Select up to 3 skills..."
              [options]="skillOptions"
              [value]="[]"
              size="md"
              [multiple]="true"
              [maxSelections]="3"
              [showSelectedItems]="true"
            />
          </div>

          <!-- Searchable Multi-select -->
          <div class="showcase-item">
            <h3>Searchable Multi-select</h3>
            <ds-select
              label="Select Cities"
              placeholder="Search and select cities..."
              [options]="cityOptions"
              [value]="[]"
              size="md"
              [multiple]="true"
              [searchable]="true"
              [showSelectedItems]="true"
            />
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
export class SelectShowcaseComponent implements ShowcaseComponent {
  // =============================================================================
  // SHOWCASE IMPLEMENTATION
  // =============================================================================

  componentName = 'Select Component';
  description =
    'Advanced select component with search, multi-selection, grouping, and virtualization support. Highly customizable and accessible.';

  private lastActionSignal = signal<string>('');

  get lastAction(): string {
    return this.lastActionSignal();
  }

  // =============================================================================
  // DEMO CONFIGURATION
  // =============================================================================

  selectVariants: SelectVariant[] = ['default', 'filled', 'outlined'];
  selectSizes: SelectSize[] = ['sm', 'md', 'lg'];

  // =============================================================================
  // INTERACTIVE EXAMPLE CONFIGURATION
  // =============================================================================

  private interactiveSelectConfigSignal = signal<SelectInteractiveConfig>({
    variant: 'default',
    size: 'md',
    label: 'Demo Select',
    placeholder: 'Choose an option...',
    disabled: false,
    required: false,
    multiple: false,
    searchable: false,
    loading: false,
    helperText: '',
    value: null,
  });

  readonly interactiveSelectConfig = computed(() => this.interactiveSelectConfigSignal());

  readonly interactiveConfig = computed<InteractiveExampleConfig>(() => ({
    title: 'Interactive Select Example',
    description: 'Customize the select properties using the controls below.',
    controls: [
      createSelectControl('variant', 'Variant', 'variant', [
        { value: 'default', label: 'Default' },
        { value: 'filled', label: 'Filled' },
        { value: 'outlined', label: 'Outlined' },
      ]),
      createSelectControl('size', 'Size', 'size', [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
      ]),
      createTextControl('label', 'Label', 'label', { placeholder: 'Enter label...' }),
      createTextControl('placeholder', 'Placeholder', 'placeholder', {
        placeholder: 'Enter placeholder...',
      }),
      createTextControl('helperText', 'Helper Text', 'helperText', {
        placeholder: 'Enter helper text...',
      }),
      createCheckboxControl('disabled', 'Disabled', 'disabled'),
      createCheckboxControl('required', 'Required', 'required'),
      createCheckboxControl('multiple', 'Multiple', 'multiple'),
      createCheckboxControl('searchable', 'Searchable', 'searchable'),
      createCheckboxControl('loading', 'Loading', 'loading'),
    ],
    showOutput: true,
  }));

  // =============================================================================
  // LEGACY DEMO CONFIG (keeping for backward compatibility)
  // =============================================================================

  demoConfigVariant = signal<SelectVariant>('default');
  demoConfigSize = signal<SelectSize>('md');
  demoConfigLabel = signal<string>('Demo Select');
  demoConfigPlaceholder = signal<string>('Choose an option...');
  demoConfigDisabled = signal<boolean>(false);
  demoConfigRequired = signal<boolean>(false);
  demoConfigMultiple = signal<boolean>(false);
  demoConfigSearchable = signal<boolean>(false);
  demoConfigLoading = signal<boolean>(false);
  demoConfigHelperText = signal<string>('');

  demoValue = signal<any>(null);

  // Computed properties for two-way binding with ngModel
  get demoConfigVariantValue(): SelectVariant {
    return this.demoConfigVariant();
  }
  set demoConfigVariantValue(value: SelectVariant) {
    this.demoConfigVariant.set(value);
  }

  get demoConfigSizeValue(): SelectSize {
    return this.demoConfigSize();
  }
  set demoConfigSizeValue(value: SelectSize) {
    this.demoConfigSize.set(value);
  }

  get demoConfigLabelValue(): string {
    return this.demoConfigLabel();
  }
  set demoConfigLabelValue(value: string) {
    this.demoConfigLabel.set(value);
  }

  get demoConfigPlaceholderValue(): string {
    return this.demoConfigPlaceholder();
  }
  set demoConfigPlaceholderValue(value: string) {
    this.demoConfigPlaceholder.set(value);
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

  get demoConfigMultipleValue(): boolean {
    return this.demoConfigMultiple();
  }
  set demoConfigMultipleValue(value: boolean) {
    this.demoConfigMultiple.set(value);
    // Reset value when changing multiple mode
    this.demoValue.set(value ? [] : null);
  }

  get demoConfigSearchableValue(): boolean {
    return this.demoConfigSearchable();
  }
  set demoConfigSearchableValue(value: boolean) {
    this.demoConfigSearchable.set(value);
  }

  get demoConfigLoadingValue(): boolean {
    return this.demoConfigLoading();
  }
  set demoConfigLoadingValue(value: boolean) {
    this.demoConfigLoading.set(value);
  }

  // Computed demo options
  demoOptions = computed(() => {
    if (this.demoConfigLoading()) return [];
    return this.basicOptions;
  });

  // =============================================================================
  // SAMPLE DATA
  // =============================================================================

  basicOptions: SelectOption[] = [
    createSelectOption('option1', 'Option 1'),
    createSelectOption('option2', 'Option 2'),
    createSelectOption('option3', 'Option 3'),
    createSelectOption('option4', 'Option 4', { disabled: true }),
    createSelectOption('option5', 'Option 5'),
  ];

  countryOptions: SelectOption[] = [
    createSelectOption('us', 'United States'),
    createSelectOption('ca', 'Canada'),
    createSelectOption('uk', 'United Kingdom'),
    createSelectOption('de', 'Germany'),
    createSelectOption('fr', 'France'),
    createSelectOption('jp', 'Japan'),
    createSelectOption('au', 'Australia'),
    createSelectOption('br', 'Brazil'),
    createSelectOption('mx', 'Mexico'),
    createSelectOption('in', 'India'),
  ];

  techOptions: SelectOption[] = [
    createSelectOption('angular', 'Angular'),
    createSelectOption('react', 'React'),
    createSelectOption('vue', 'Vue.js'),
    createSelectOption('typescript', 'TypeScript'),
    createSelectOption('javascript', 'JavaScript'),
    createSelectOption('nodejs', 'Node.js'),
    createSelectOption('python', 'Python'),
    createSelectOption('csharp', 'C#'),
  ];

  groupedOptions: SelectOption[] = [
    createSelectOption('js', 'JavaScript', { group: 'Frontend' }),
    createSelectOption('ts', 'TypeScript', { group: 'Frontend' }),
    createSelectOption('angular', 'Angular', { group: 'Frontend' }),
    createSelectOption('react', 'React', { group: 'Frontend' }),
    createSelectOption('nodejs', 'Node.js', { group: 'Backend' }),
    createSelectOption('python', 'Python', { group: 'Backend' }),
    createSelectOption('csharp', 'C#', { group: 'Backend' }),
    createSelectOption('java', 'Java', { group: 'Backend' }),
    createSelectOption('mysql', 'MySQL', { group: 'Database' }),
    createSelectOption('postgresql', 'PostgreSQL', { group: 'Database' }),
    createSelectOption('mongodb', 'MongoDB', { group: 'Database' }),
  ];

  userOptions: SelectOption[] = [
    createSelectOption('user1', 'John Doe', {
      description: 'Software Engineer',
      icon: '👨‍💻',
    }),
    createSelectOption('user2', 'Jane Smith', {
      description: 'Product Manager',
      icon: '👩‍💼',
    }),
    createSelectOption('user3', 'Mike Johnson', {
      description: 'UX Designer',
      icon: '🎨',
    }),
    createSelectOption('user4', 'Sarah Wilson', {
      description: 'Data Scientist',
      icon: '📊',
    }),
  ];

  skillOptions: SelectOption[] = [
    createSelectOption('communication', 'Communication'),
    createSelectOption('leadership', 'Leadership'),
    createSelectOption('problem-solving', 'Problem Solving'),
    createSelectOption('teamwork', 'Teamwork'),
    createSelectOption('creativity', 'Creativity'),
    createSelectOption('adaptability', 'Adaptability'),
    createSelectOption('time-management', 'Time Management'),
    createSelectOption('critical-thinking', 'Critical Thinking'),
  ];

  cityOptions: SelectOption[] = [
    createSelectOption('nyc', 'New York City'),
    createSelectOption('london', 'London'),
    createSelectOption('tokyo', 'Tokyo'),
    createSelectOption('paris', 'Paris'),
    createSelectOption('berlin', 'Berlin'),
    createSelectOption('sydney', 'Sydney'),
    createSelectOption('toronto', 'Toronto'),
    createSelectOption('dubai', 'Dubai'),
    createSelectOption('singapore', 'Singapore'),
    createSelectOption('amsterdam', 'Amsterdam'),
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
          type: 'SelectVariant',
          defaultValue: "'default'",
          required: false,
          description: 'Visual style variant of the select',
          examples: ['default', 'filled', 'outlined'],
        },
        {
          name: 'size',
          type: 'SelectSize',
          defaultValue: "'md'",
          required: false,
          description: 'Size of the select',
          examples: ['sm', 'md', 'lg'],
        },
        {
          name: 'label',
          type: 'string',
          required: false,
          description: 'Label text for the select',
        },
        {
          name: 'placeholder',
          type: 'string',
          required: false,
          description: 'Placeholder text when no option is selected',
        },
        {
          name: 'value',
          type: 'any | any[]',
          required: false,
          description: 'Selected value(s) - single value or array for multiple selection',
        },
        {
          name: 'options',
          type: 'SelectOption[]',
          defaultValue: '[]',
          required: false,
          description: 'Array of available options',
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether the select is disabled',
        },
        {
          name: 'required',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether the select is required',
        },
        {
          name: 'multiple',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether multiple options can be selected',
        },
        {
          name: 'searchable',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether options can be searched/filtered',
        },
        {
          name: 'loading',
          type: 'boolean',
          defaultValue: 'false',
          required: false,
          description: 'Whether the select is in loading state',
        },
        {
          name: 'helperText',
          type: 'string',
          required: false,
          description: 'Helper text to display below the select',
        },
        {
          name: 'showSelectedItems',
          type: 'boolean',
          defaultValue: 'true',
          required: false,
          description: 'Whether to show selected items as chips in multiple mode',
        },
      ],
      outputs: [
        {
          name: 'valueChange',
          type: 'SelectChangeEvent',
          description: 'Emitted when selection changes',
          examples: ['{ value, option, options, selectElement, originalEvent }'],
        },
        {
          name: 'search',
          type: 'SelectSearchEvent',
          description: 'Emitted when user searches for options',
        },
        {
          name: 'toggle',
          type: 'SelectToggleEvent',
          description: 'Emitted when dropdown is opened or closed',
        },
        {
          name: 'focused',
          type: 'SelectFocusEvent',
          description: 'Emitted when select receives focus',
        },
        {
          name: 'blurred',
          type: 'SelectFocusEvent',
          description: 'Emitted when select loses focus',
        },
      ],
      methods: [
        {
          name: 'focus',
          signature: 'focus(): void',
          description: 'Programmatically focus the select',
        },
        {
          name: 'blur',
          signature: 'blur(): void',
          description: 'Programmatically blur the select',
        },
        {
          name: 'open',
          signature: 'open(): void',
          description: 'Open the dropdown',
        },
        {
          name: 'close',
          signature: 'close(): void',
          description: 'Close the dropdown',
        },
        {
          name: 'clear',
          signature: 'clear(): void',
          description: 'Clear all selections',
        },
        {
          name: 'selectOption',
          signature: 'selectOption(value: any): void',
          description: 'Programmatically select an option',
        },
      ],
    };

    return createShowcaseConfig(componentInfo, apiDocumentation);
  });

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  onSelectionChange(event: SelectChangeEvent): void {
    const selectedLabels = Array.isArray(event.option)
      ? event.option.map(opt => opt.label).join(', ')
      : event.option.label;
    this.lastActionSignal.set(`Selection changed: ${selectedLabels}`);
  }

  onSearch(event: SelectSearchEvent): void {
    this.lastActionSignal.set(`Search query: "${event.query}"`);
  }

  onToggle(event: SelectToggleEvent): void {
    this.lastActionSignal.set(`Dropdown ${event.isOpen ? 'opened' : 'closed'} (${event.reason})`);
  }

  onFocus(event: SelectFocusEvent): void {
    this.lastActionSignal.set(`Select ${event.direction === 'in' ? 'focused' : 'blurred'}`);
  }

  onInteractiveConfigChange(event: InteractiveConfigChangeEvent<SelectInteractiveConfig>): void {
    this.interactiveSelectConfigSignal.set(event.config);
    this.lastActionSignal.set(`Configuration changed: ${event.property} = ${event.value}`);
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  getSizeLabel(size: SelectSize): string {
    return `${size.toUpperCase()} Size`;
  }
}
