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
import { ShowcaseComponent, ComponentApiDocumentation } from '../../models/showcase.model';

/**
 * Select Component Showcase
 *
 * Demonstrates all variants, states, and features of the Select component
 * with interactive controls and comprehensive documentation.
 */
@Component({
  selector: 'select-showcase',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectComponent],
  template: `
    <div class="showcase-container">
      <!-- Header -->
      <div class="showcase-header">
        <h1>{{ componentName }}</h1>
        <p class="showcase-description">{{ description }}</p>
      </div>

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

      <!-- Interactive Example -->
      <section class="showcase-section">
        <h2>Interactive Example</h2>

        <div class="interactive-controls">
          <div class="control-group">
            <label>
              Variant:
              <select [(ngModel)]="demoConfigVariantValue" class="control-input">
                @for (variant of selectVariants; track variant) {
                  <option [value]="variant">{{ variant | titlecase }}</option>
                }
              </select>
            </label>
          </div>

          <div class="control-group">
            <label>
              Size:
              <select [(ngModel)]="demoConfigSizeValue" class="control-input">
                @for (size of selectSizes; track size) {
                  <option [value]="size">{{ size | uppercase }}</option>
                }
              </select>
            </label>
          </div>

          <div class="control-group">
            <label>
              Label:
              <input
                type="text"
                [(ngModel)]="demoConfigLabelValue"
                class="control-input"
                placeholder="Enter label..."
              />
            </label>
          </div>

          <div class="control-group">
            <label>
              Placeholder:
              <input
                type="text"
                [(ngModel)]="demoConfigPlaceholderValue"
                class="control-input"
                placeholder="Enter placeholder..."
              />
            </label>
          </div>

          <div class="control-group">
            <label>
              <input type="checkbox" [(ngModel)]="demoConfigDisabledValue" />
              Disabled
            </label>
          </div>

          <div class="control-group">
            <label>
              <input type="checkbox" [(ngModel)]="demoConfigRequiredValue" />
              Required
            </label>
          </div>

          <div class="control-group">
            <label>
              <input type="checkbox" [(ngModel)]="demoConfigMultipleValue" />
              Multiple
            </label>
          </div>

          <div class="control-group">
            <label>
              <input type="checkbox" [(ngModel)]="demoConfigSearchableValue" />
              Searchable
            </label>
          </div>

          <div class="control-group">
            <label>
              <input type="checkbox" [(ngModel)]="demoConfigLoadingValue" />
              Loading
            </label>
          </div>
        </div>

        <div class="interactive-preview">
          <ds-select
            [variant]="demoConfigVariant()"
            [size]="demoConfigSize()"
            [label]="demoConfigLabel()"
            [placeholder]="demoConfigPlaceholder()"
            [disabled]="demoConfigDisabled()"
            [required]="demoConfigRequired()"
            [multiple]="demoConfigMultiple()"
            [searchable]="demoConfigSearchable()"
            [loading]="demoConfigLoading()"
            [options]="demoOptions()"
            [value]="demoValue"
            [helperText]="demoConfigHelperText()"
            (selectionChange)="onSelectionChange($event)"
            (search)="onSearch($event)"
            (toggle)="onToggle($event)"
            (focus)="onFocus($event)"
          />
        </div>

        <div class="showcase-output">
          {{ lastAction || 'Interact with the select above to see events...' }}
        </div>
      </section>

      <!-- Component API -->
      <section class="showcase-section">
        <h2>Component API</h2>

        <div class="showcase-api">
          <h3>Inputs</h3>
          <ul>
            @for (input of apiDocumentation.inputs; track input.name) {
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

        <div class="showcase-api">
          <h3>Outputs</h3>
          <ul>
            @for (output of apiDocumentation.outputs; track output.name) {
              <li>
                <code>{{ output.name }}: {{ output.type }}</code>
                <p>{{ output.description }}</p>
              </li>
            }
          </ul>
        </div>

        <div class="showcase-api">
          <h3>Methods</h3>
          <ul>
            @for (method of apiDocumentation.methods || []; track method.name) {
              <li>
                <code>{{ method.signature }}</code>
                <p>{{ method.description }}</p>
              </li>
            }
          </ul>
        </div>
      </section>
    </div>
  `,
  styleUrl: '../../shared/styles/showcase.scss',
})
export class SelectShowcaseComponent implements ShowcaseComponent {
  // =============================================================================
  // SHOWCASE IMPLEMENTATION
  // =============================================================================

  componentName = 'Select Component';
  description =
    'Advanced select component with single/multi-select, search, grouping, and accessibility features. Built with Angular Signals and modern web standards.';

  private lastActionSignal = signal<string>('');

  get lastAction(): string {
    return this.lastActionSignal();
  }

  // =============================================================================
  // DEMO CONFIGURATION
  // =============================================================================

  selectVariants: SelectVariant[] = ['default', 'filled', 'outlined'];
  selectSizes: SelectSize[] = ['sm', 'md', 'lg'];

  // Individual signals for demo configuration
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
  // API DOCUMENTATION
  // =============================================================================

  apiDocumentation: ComponentApiDocumentation = {
    inputs: [
      {
        name: 'variant',
        type: 'SelectVariant',
        defaultValue: "'default'",
        description: 'Select variant (default, filled, outlined)',
        examples: ['default', 'filled', 'outlined'],
      },
      {
        name: 'size',
        type: 'SelectSize',
        defaultValue: "'md'",
        description: 'Select size variant',
        examples: ['sm', 'md', 'lg'],
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: "''",
        description: 'Select label text',
      },
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: "'Select...'",
        description: 'Placeholder text when no option is selected',
      },
      {
        name: 'options',
        type: 'SelectOption<T>[]',
        defaultValue: '[]',
        description: 'Available options for selection',
      },
      {
        name: 'value',
        type: 'T | T[] | null',
        defaultValue: 'null',
        description: 'Selected value(s) - two-way binding',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Whether select is disabled',
      },
      {
        name: 'required',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Whether select is required',
      },
      {
        name: 'multiple',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Whether multiple selection is allowed',
      },
      {
        name: 'searchable',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Whether search functionality is enabled',
      },
      {
        name: 'loading',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Whether to show loading state',
      },
      {
        name: 'maxSelections',
        type: 'number | null',
        defaultValue: 'null',
        description: 'Maximum number of selections (for multiple)',
      },
      {
        name: 'showSelectedItems',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Whether to show selected items below select (for multiple)',
      },
      {
        name: 'helperText',
        type: 'string',
        defaultValue: "''",
        description: 'Helper text shown below select',
      },
    ],
    outputs: [
      {
        name: 'selectionChange',
        type: 'EventEmitter<SelectChangeEvent<T>>',
        description: 'Emitted when selection changes',
        examples: ['(selectionChange)="onSelectionChange($event)"'],
      },
      {
        name: 'search',
        type: 'EventEmitter<SelectSearchEvent>',
        description: 'Emitted when user searches (if searchable)',
        examples: ['(search)="onSearch($event)"'],
      },
      {
        name: 'toggle',
        type: 'EventEmitter<SelectToggleEvent>',
        description: 'Emitted when dropdown is opened or closed',
        examples: ['(toggle)="onToggle($event)"'],
      },
      {
        name: 'focus',
        type: 'EventEmitter<SelectFocusEvent>',
        description: 'Emitted when select gains or loses focus',
        examples: ['(focus)="onFocus($event)"'],
      },
    ],
    methods: [
      {
        name: 'clear',
        signature: 'clear(): void',
        description: 'Clear all selections',
      },
      {
        name: 'open',
        signature: 'open(): void',
        description: 'Open dropdown programmatically',
      },
      {
        name: 'close',
        signature: 'close(): void',
        description: 'Close dropdown programmatically',
      },
      {
        name: 'focusSelect',
        signature: 'focusSelect(): void',
        description: 'Focus the select trigger',
      },
      {
        name: 'getValidationState',
        signature: 'getValidationState(): SelectValidation',
        description: 'Get current validation state',
      },
    ],
  };

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

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  getSizeLabel(size: SelectSize): string {
    return `${size.toUpperCase()} Size`;
  }
}
