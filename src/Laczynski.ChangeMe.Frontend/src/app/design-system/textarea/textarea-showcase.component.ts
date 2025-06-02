import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TextareaComponent } from './textarea.component';
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
  createNumberControl,
} from '../showcases/interactive-example';
import { ComponentSize } from '../shared';

import {
  TextareaConfig,
  TextareaVariant,
  TextareaResize,
  TextareaState,
  TextareaChangeEvent,
  TextareaFocusEvent,
  TextareaKeyboardEvent,
  TextareaResizeEvent,
  createTextareaConfig,
  getTextareaSizeLabel,
  getTextareaVariantLabel,
  getTextareaResizeLabel,
} from './textarea.model';
import {
  ShowcaseComponent,
  createShowcaseConfig,
  ComponentApiDocumentation,
  ShowcaseConfig,
} from '../showcases/showcase.model';

// =============================================================================
// TEXTAREA INTERACTIVE CONFIG TYPE
// =============================================================================

interface TextareaInteractiveConfig {
  size: ComponentSize;
  variant: TextareaVariant;
  label: string;
  placeholder: string;
  helperText: string;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  rows: number;
  maxLength: number;
  showCounter: boolean;
  resizable: boolean;
  resize: TextareaResize;
  autoResize: boolean;
  value: string;
}

/**
 * Textarea Component Showcase
 *
 * Demonstrates all variants, states, and features of the Textarea component
 * with interactive controls and comprehensive documentation.
 */
@Component({
  selector: 'textarea-showcase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TextareaComponent,
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
        [currentConfig]="interactiveTextareaConfig()"
        [lastAction]="lastAction"
        (configChange)="onInteractiveConfigChange($event)"
      >
        <ds-textarea
          [size]="interactiveTextareaConfig().size"
          [variant]="interactiveTextareaConfig().variant"
          [label]="interactiveTextareaConfig().label"
          [placeholder]="interactiveTextareaConfig().placeholder"
          [helperText]="interactiveTextareaConfig().helperText"
          [disabled]="interactiveTextareaConfig().disabled"
          [readonly]="interactiveTextareaConfig().readonly"
          [required]="interactiveTextareaConfig().required"
          [rows]="interactiveTextareaConfig().rows"
          [maxLength]="interactiveTextareaConfig().maxLength || undefined"
          [showCounter]="interactiveTextareaConfig().showCounter"
          [resizable]="interactiveTextareaConfig().resizable"
          [resize]="interactiveTextareaConfig().resize"
          [autoResize]="interactiveTextareaConfig().autoResize"
          [value]="interactiveTextareaConfig().value"
          (valueChange)="onValueChange($event)"
          (focusChange)="onFocusChange($event)"
          (keyboardEvent)="onKeyboardEvent($event)"
          (resizeEvent)="onResizeEvent($event)"
        />
      </ds-interactive-example>

      <!-- Variants Section -->
      <section class="showcase-section">
        <h2>Variants</h2>
        <div class="showcase-grid">
          @for (variant of textareaVariants; track variant) {
            <div class="showcase-item">
              <h3>{{ getTextareaVariantLabel(variant) }}</h3>
              <ds-textarea
                [variant]="variant"
                [label]="getTextareaVariantLabel(variant) + ' Textarea'"
                [placeholder]="
                  'Enter ' + getTextareaVariantLabel(variant).toLowerCase() + ' text...'
                "
                size="md"
                [rows]="3"
              />
            </div>
          }
        </div>
      </section>

      <!-- Sizes Section -->
      <section class="showcase-section">
        <h2>Sizes</h2>
        <div class="showcase-grid">
          @for (size of textareaSizes; track size) {
            <div class="showcase-item">
              <h3>{{ getTextareaSizeLabel(size) }}</h3>
              <ds-textarea
                [size]="size"
                [label]="getTextareaSizeLabel(size) + ' Textarea'"
                [placeholder]="'Enter text...'"
                variant="default"
                [rows]="3"
              />
            </div>
          }
        </div>
      </section>

      <!-- Features Section -->
      <section class="showcase-section">
        <h2>Features</h2>
        <div class="showcase-grid">
          <!-- Character Counter -->
          <div class="showcase-item">
            <h3>Character Counter</h3>
            <ds-textarea
              label="Description with Counter"
              placeholder="Type to see character count..."
              [maxLength]="100"
              [showCounter]="true"
              [rows]="3"
              size="md"
              variant="default"
            />
          </div>

          <!-- Auto Resize -->
          <div class="showcase-item">
            <h3>Auto Resize</h3>
            <ds-textarea
              label="Auto-resizing Textarea"
              placeholder="Type multiple lines to see auto-resize..."
              [autoResize]="true"
              [minRows]="2"
              [maxRows]="6"
              size="md"
              variant="default"
            />
          </div>

          <!-- Resize Controls -->
          <div class="showcase-item">
            <h3>Manual Resize</h3>
            <ds-textarea
              label="Resizable Textarea"
              placeholder="Drag corner to resize..."
              [resizable]="true"
              [resize]="'both'"
              [rows]="4"
              size="md"
              variant="default"
            />
          </div>

          <!-- No Resize -->
          <div class="showcase-item">
            <h3>No Resize</h3>
            <ds-textarea
              label="Fixed Size Textarea"
              placeholder="Cannot be resized..."
              [resizable]="false"
              [rows]="3"
              size="md"
              variant="default"
            />
          </div>
        </div>
      </section>

      <!-- States Section -->
      <section class="showcase-section">
        <h2>States</h2>
        <div class="showcase-grid">
          <!-- Default -->
          <div class="showcase-item">
            <h3>Default</h3>
            <ds-textarea
              label="Default Textarea"
              placeholder="Enter text..."
              [rows]="3"
              size="md"
              variant="default"
            />
          </div>

          <!-- With Value -->
          <div class="showcase-item">
            <h3>With Value</h3>
            <ds-textarea
              label="Textarea with Content"
              value="This textarea has some initial content that demonstrates how text appears in the component."
              [rows]="3"
              size="md"
              variant="default"
            />
          </div>

          <!-- Disabled -->
          <div class="showcase-item">
            <h3>Disabled</h3>
            <ds-textarea
              label="Disabled Textarea"
              value="This textarea is disabled"
              [disabled]="true"
              [rows]="3"
              size="md"
              variant="default"
            />
          </div>

          <!-- Readonly -->
          <div class="showcase-item">
            <h3>Readonly</h3>
            <ds-textarea
              label="Readonly Textarea"
              value="This textarea is readonly and cannot be edited"
              [readonly]="true"
              [rows]="3"
              size="md"
              variant="default"
            />
          </div>

          <!-- Required -->
          <div class="showcase-item">
            <h3>Required</h3>
            <ds-textarea
              label="Required Textarea"
              placeholder="This field is required..."
              [required]="true"
              [rows]="3"
              size="md"
              variant="default"
            />
          </div>

          <!-- With Helper Text -->
          <div class="showcase-item">
            <h3>With Helper Text</h3>
            <ds-textarea
              label="Textarea with Help"
              placeholder="Enter description..."
              helperText="Please provide a detailed description"
              [rows]="3"
              size="md"
              variant="default"
            />
          </div>

          <!-- Error State -->
          <div class="showcase-item">
            <h3>Error State</h3>
            <ds-textarea
              label="Textarea with Error"
              placeholder="Enter text..."
              helperText="This field contains an error"
              [rows]="3"
              size="md"
              variant="default"
            />
          </div>

          <!-- Large Content -->
          <div class="showcase-item">
            <h3>Large Content</h3>
            <ds-textarea
              label="Large Textarea"
              value="This is a larger textarea with more rows to demonstrate how the component handles longer content. It can accommodate multiple paragraphs and longer text inputs."
              [rows]="6"
              [maxLength]="500"
              [showCounter]="true"
              size="md"
              variant="default"
            />
          </div>
        </div>
      </section>

      <!-- API Documentation -->
      <ds-api-documentation [api]="showcaseConfig().api" />
    </div>
  `,
  styles: [
    `
      @use '../showcases/showcase.scss';

      .showcase-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }
    `,
  ],
})
export class TextareaShowcaseComponent implements ShowcaseComponent {
  // =============================================================================
  // SHOWCASE COMPONENT INTERFACE
  // =============================================================================

  componentName = 'Textarea Component';
  description =
    'A multiline text input component with advanced features like auto-resize, character counting, and enhanced styling for forms and content creation.';

  private lastActionSignal = signal<string>('');

  get lastAction(): string {
    return this.lastActionSignal();
  }

  // =============================================================================
  // COMPONENT DATA
  // =============================================================================

  textareaSizes: ComponentSize[] = ['sm', 'md', 'lg'];
  textareaVariants: TextareaVariant[] = [
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
  ];
  textareaResizeOptions: TextareaResize[] = ['none', 'vertical', 'horizontal', 'both'];

  // =============================================================================
  // INTERACTIVE CONFIGURATION
  // =============================================================================

  private interactiveTextareaConfigSignal = signal<TextareaInteractiveConfig>({
    size: 'md',
    variant: 'default',
    label: 'Interactive Textarea',
    placeholder: 'Type here to test features...',
    helperText: 'This textarea responds to your configuration changes',
    disabled: false,
    readonly: false,
    required: false,
    rows: 4,
    maxLength: 200,
    showCounter: true,
    resizable: true,
    resize: 'vertical',
    autoResize: false,
    value: '',
  });

  readonly interactiveTextareaConfig = computed(() => this.interactiveTextareaConfigSignal());

  readonly interactiveConfig = computed<InteractiveExampleConfig>(() => ({
    title: 'Interactive Textarea',
    description: 'Customize the textarea properties and see real-time changes',
    controls: [
      createSelectControl(
        'size',
        'Size',
        'size',
        this.textareaSizes.map(size => ({
          label: getTextareaSizeLabel(size),
          value: size,
        })),
      ),
      createSelectControl(
        'variant',
        'Variant',
        'variant',
        this.textareaVariants.map(variant => ({
          label: getTextareaVariantLabel(variant),
          value: variant,
        })),
      ),
      createTextControl('label', 'Label', 'label', {
        placeholder: 'Enter textarea label...',
      }),
      createTextControl('placeholder', 'Placeholder', 'placeholder', {
        placeholder: 'Enter placeholder text...',
      }),
      createTextControl('helperText', 'Helper Text', 'helperText', {
        placeholder: 'Enter helper text...',
      }),
      createNumberControl('rows', 'Rows', 'rows', {
        min: 1,
        max: 10,
      }),
      createNumberControl('maxLength', 'Max Length', 'maxLength', {
        min: 10,
        max: 1000,
      }),
      createCheckboxControl('disabled', 'Disabled', 'disabled'),
      createCheckboxControl('readonly', 'Readonly', 'readonly'),
      createCheckboxControl('required', 'Required', 'required'),
      createCheckboxControl('showCounter', 'Show Counter', 'showCounter'),
      createCheckboxControl('resizable', 'Resizable', 'resizable'),
      createSelectControl(
        'resize',
        'Resize Direction',
        'resize',
        this.textareaResizeOptions.map(option => ({
          label: getTextareaResizeLabel(option),
          value: option,
        })),
      ),
      createCheckboxControl('autoResize', 'Auto Resize', 'autoResize'),
    ],
    showOutput: true,
  }));

  // =============================================================================
  // SHOWCASE CONFIGURATION
  // =============================================================================

  readonly showcaseConfig = computed<ShowcaseConfig>(() => {
    const apiDocumentation: ComponentApiDocumentation = {
      inputs: [
        {
          name: 'size',
          type: 'TextareaSize',
          defaultValue: 'md',
          description: 'Size of the textarea',
          examples: ['sm', 'md', 'lg'],
        },
        {
          name: 'variant',
          type: 'TextareaVariant',
          defaultValue: 'default',
          description: 'Visual variant of the textarea',
          examples: ['default', 'filled', 'outlined'],
        },
        {
          name: 'label',
          type: 'string',
          description: 'Label text displayed above the textarea',
          examples: ['Description', 'Comments', 'Message'],
        },
        {
          name: 'placeholder',
          type: 'string',
          description: 'Placeholder text shown when empty',
          examples: ['Enter description...', 'Type your message here...'],
        },
        {
          name: 'helperText',
          type: 'string',
          description: 'Helper text displayed below the textarea',
          examples: ['Maximum 500 characters'],
        },
        {
          name: 'disabled',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether the textarea is disabled',
        },
        {
          name: 'readonly',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether the textarea is readonly',
        },
        {
          name: 'required',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether the textarea is required in forms',
        },
        {
          name: 'rows',
          type: 'number',
          defaultValue: '4',
          description: 'Number of visible rows',
          examples: ['3', '5', '8'],
        },
        {
          name: 'maxLength',
          type: 'number',
          description: 'Maximum character length',
          examples: ['100', '500', '1000'],
        },
        {
          name: 'showCounter',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether to show character counter',
        },
        {
          name: 'resizable',
          type: 'boolean',
          defaultValue: 'true',
          description: 'Whether textarea can be resized',
        },
        {
          name: 'resize',
          type: 'TextareaResize',
          defaultValue: 'vertical',
          description: 'Resize direction when resizable',
          examples: ['none', 'vertical', 'horizontal', 'both'],
        },
        {
          name: 'autoResize',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether textarea should auto-resize with content',
        },
        {
          name: 'value',
          type: 'string',
          defaultValue: "''",
          description: 'Current text value (two-way binding)',
        },
      ],
      outputs: [
        {
          name: 'valueChange',
          type: 'TextareaChangeEvent',
          description: 'Emitted when textarea value changes',
          examples: [
            '{ value: "text", characterCount: 4, lineCount: 1, originalEvent: Event, timestamp: 1234567890 }',
          ],
        },
        {
          name: 'focusChange',
          type: 'TextareaFocusEvent',
          description: 'Emitted when textarea gains or loses focus',
          examples: [
            '{ value: "text", type: "focus", originalEvent: FocusEvent, timestamp: 1234567890 }',
          ],
        },
        {
          name: 'keyboardEvent',
          type: 'TextareaKeyboardEvent',
          description: 'Emitted on keyboard interactions',
          examples: [
            '{ value: "text", key: "Enter", keyCode: 13, ctrlKey: false, originalEvent: KeyboardEvent, timestamp: 1234567890 }',
          ],
        },
        {
          name: 'resizeEvent',
          type: 'TextareaResizeEvent',
          description: 'Emitted when textarea is resized',
          examples: ['{ width: 300, height: 100, type: "manual", timestamp: 1234567890 }'],
        },
      ],
      methods: [
        {
          name: 'focus',
          signature: 'focus(): void',
          description: 'Programmatically focus the textarea',
        },
        {
          name: 'blur',
          signature: 'blur(): void',
          description: 'Programmatically blur the textarea',
        },
        {
          name: 'selectAll',
          signature: 'selectAll(): void',
          description: 'Select all text in the textarea',
        },
        {
          name: 'setError',
          signature: 'setError(hasError: boolean): void',
          description: 'Set the error state of the textarea',
          parameters: [
            {
              name: 'hasError',
              type: 'boolean',
              required: true,
              description: 'Whether the textarea has an error',
            },
          ],
        },
        {
          name: 'getSelection',
          signature: 'getSelection(): { start: number; end: number }',
          description: 'Get current text selection',
        },
        {
          name: 'setSelection',
          signature: 'setSelection(start: number, end: number): void',
          description: 'Set text selection range',
          parameters: [
            {
              name: 'start',
              type: 'number',
              required: true,
              description: 'Start position of selection',
            },
            {
              name: 'end',
              type: 'number',
              required: true,
              description: 'End position of selection',
            },
          ],
        },
      ],
    };

    return createShowcaseConfig(
      {
        componentName: this.componentName,
        description: this.description,
        lastAction: this.lastAction,
      },
      apiDocumentation,
    );
  });

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  onValueChange(event: TextareaChangeEvent | string): void {
    if (typeof event === 'string') {
      // Handle case where model emits string directly
      this.lastActionSignal.set(
        `Value changed: "${event.substring(0, 30)}${event.length > 30 ? '...' : ''}" (${event.length} chars) at ${new Date().toLocaleTimeString()}`,
      );
      console.log('Textarea value change (string):', event);
    } else {
      // Handle TextareaChangeEvent object
      this.lastActionSignal.set(
        `Value changed: "${event.value.substring(0, 30)}${event.value.length > 30 ? '...' : ''}" (${event.characterCount} chars) at ${new Date(event.timestamp).toLocaleTimeString()}`,
      );
      console.log('Textarea value change:', event);
    }
  }

  onFocusChange(event: TextareaFocusEvent): void {
    this.lastActionSignal.set(
      `Textarea ${event.direction} at ${new Date(event.timestamp).toLocaleTimeString()}`,
    );
  }

  onKeyboardEvent(event: TextareaKeyboardEvent): void {
    this.lastActionSignal.set(
      `Key "${event.key}" pressed at ${new Date(event.timestamp).toLocaleTimeString()}`,
    );
    console.log('Textarea keyboard event:', event);
  }

  onResizeEvent(event: TextareaResizeEvent): void {
    this.lastActionSignal.set(
      `Textarea resized to ${event.width}x${event.height} (${event.type}) at ${new Date(event.timestamp).toLocaleTimeString()}`,
    );
    console.log('Textarea resize event:', event);
  }

  onInteractiveConfigChange(event: InteractiveConfigChangeEvent<TextareaInteractiveConfig>): void {
    this.interactiveTextareaConfigSignal.set({
      ...this.interactiveTextareaConfigSignal(),
      ...event.config,
    });
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  getTextareaSizeLabel = getTextareaSizeLabel;
  getTextareaVariantLabel = getTextareaVariantLabel;
  getTextareaResizeLabel = getTextareaResizeLabel;
}
