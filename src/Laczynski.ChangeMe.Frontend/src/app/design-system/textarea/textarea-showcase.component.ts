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
  TextareaVariant,
  TextareaResize,
  TextareaChangeEvent,
  TextareaFocusEvent,
  TextareaKeyboardEvent,
  TextareaResizeEvent,
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
  templateUrl: './textarea-showcase.component.html',
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
