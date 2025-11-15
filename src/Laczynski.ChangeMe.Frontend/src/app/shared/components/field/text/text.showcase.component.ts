import { Component } from '@angular/core';
import { TextComponent } from './text.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-text-showcase',

  imports: [TextComponent, FormsModule, JsonPipe, TableOfContentComponent],
  template: `
    <div class="showcase showcase--responsive showcase__with-toc">
      <app-table-of-content
        [sticky]="true"
        [offsetTop]="20"
        containerSelector=".showcase-content"
        [minLevel]="1"
        [maxLevel]="2"
      />
      <div class="showcase-content">
        <h1 class="showcase__title">Text Component Showcase</h1>
        <p class="showcase__description">
          Comprehensive showcase of the Text component built with Fluent 2 Design System. All
          variants are responsive and accessible.
        </p>

        <!-- Basic Examples -->
        <div class="showcase__section">
          <h2 class="showcase__section__title">Basic Examples</h2>
          <div class="showcase__grid">
            <div class="showcase__item">
              <app-text
                label="Standard Text Field"
                placeholder="Enter text"
                helpText="This is a standard text field"
              ></app-text>
            </div>
            <div class="showcase__item">
              <app-text
                label="With Default Value"
                placeholder="Enter text"
                [(ngModel)]="defaultValue"
                [ngModelOptions]="{ standalone: true }"
                helpText="Text field with default value"
              ></app-text>
            </div>
          </div>
        </div>

        <!-- Size Variants -->
        <div class="showcase__section">
          <h2 class="showcase__section__title">Size Variants</h2>
          <div class="showcase__grid">
            <div class="showcase__item">
              <app-text
                label="Small Text Field"
                placeholder="Small text input"
                size="small"
                helpText="This is a small text field"
                variant="underlined"
              ></app-text>
            </div>
            <div class="showcase__item">
              <app-text
                label="Medium Text Field"
                placeholder="Medium text input"
                size="medium"
                helpText="This is a medium text field"
                variant="filled-gray"
              ></app-text>
            </div>
            <div class="showcase__item">
              <app-text
                label="Large Text Field"
                placeholder="Large text input"
                size="large"
                helpText="This is a large text field"
                variant="filled-lighter"
              ></app-text>
            </div>
          </div>
        </div>

        <!-- State Variants -->
        <div class="showcase__section">
          <h2 class="showcase__section__title">State Variants</h2>
          <div class="showcase__grid">
            <div class="showcase__item">
              <app-text
                label="Normal State"
                placeholder="Normal state"
                helpText="This is a normal text field"
              ></app-text>
            </div>
            <div class="showcase__item">
              <app-text
                label="Error State"
                placeholder="Error state"
                state="error"
                errorText="This field has an error"
              ></app-text>
            </div>
            <div class="showcase__item">
              <app-text
                label="Warning State"
                placeholder="Warning state"
                state="warning"
                warningText="This field has a warning"
              ></app-text>
            </div>
            <div class="showcase__item">
              <app-text
                label="Success State"
                placeholder="Success state"
                state="success"
                successText="This field is valid"
              ></app-text>
            </div>
          </div>
        </div>

        <!-- Interactive States -->
        <div class="showcase__section">
          <h2 class="showcase__section__title">Interactive States</h2>
          <div class="showcase__grid">
            <div class="showcase__item">
              <app-text
                label="Disabled Field"
                placeholder="Disabled field"
                [disabled]="true"
                helpText="This field is disabled"
              ></app-text>
            </div>
            <div class="showcase__item">
              <app-text
                label="Read Only Field"
                placeholder="Read only field"
                [readonly]="true"
                [(ngModel)]="value"
                [ngModelOptions]="{ standalone: true }"
                helpText="This field is read only"
              ></app-text>
            </div>
            <div class="showcase__item">
              <app-text
                label="Required Field"
                placeholder="Required field"
                [required]="true"
                helpText="This field is required"
              ></app-text>
            </div>
          </div>
        </div>

        <!-- Form Example -->
        <div class="showcase__section">
          <h2 class="showcase__section__title">Form Example</h2>
          <div class="showcase__grid">
            <div class="showcase__item">
              <form class="showcase__form">
                <app-text
                  label="First Name"
                  placeholder="Enter first name"
                  [(ngModel)]="formData.firstName"
                  [ngModelOptions]="{ standalone: true }"
                  [required]="true"
                  helpText="Enter your first name"
                ></app-text>
                <app-text
                  label="Last Name"
                  placeholder="Enter last name"
                  [(ngModel)]="formData.lastName"
                  [ngModelOptions]="{ standalone: true }"
                  [required]="true"
                  helpText="Enter your last name"
                ></app-text>
                <app-text
                  label="Email Address"
                  placeholder="Enter email address"
                  [(ngModel)]="formData.email"
                  [ngModelOptions]="{ standalone: true }"
                  [required]="true"
                  helpText="Enter your email address"
                ></app-text>
                <app-text
                  label="Comments"
                  placeholder="Enter your comments"
                  [(ngModel)]="formData.comments"
                  [ngModelOptions]="{ standalone: true }"
                  helpText="Optional comments"
                ></app-text>
                <div class="showcase__form-output">
                  <strong>Form Values:</strong>
                  <pre>{{ formData | json }}</pre>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- All Variants Combined -->
        <div class="showcase__section">
          <h2 class="showcase__section__title">All Variants Combined</h2>
          <div class="showcase__grid showcase__grid--large">
            <div class="showcase__item">
              <app-text
                label="Small + Error"
                placeholder="Small error"
                size="small"
                state="error"
                errorText="Small error field"
              ></app-text>
            </div>
            <div class="showcase__item">
              <app-text
                label="Medium + Warning"
                placeholder="Medium warning"
                size="medium"
                state="warning"
                warningText="Medium warning field"
              ></app-text>
            </div>
            <div class="showcase__item">
              <app-text
                label="Large + Success"
                placeholder="Large success"
                size="large"
                state="success"
                successText="Large success field"
              ></app-text>
            </div>
            <div class="showcase__item">
              <app-text
                label="Small + Disabled"
                placeholder="Small disabled"
                size="small"
                [disabled]="true"
                helpText="Small disabled field"
              ></app-text>
            </div>
            <div class="showcase__item">
              <app-text
                label="Medium + Read Only"
                placeholder="Medium read only"
                size="medium"
                [readonly]="true"
                [(ngModel)]="value"
                [ngModelOptions]="{ standalone: true }"
                helpText="Medium read only field"
              ></app-text>
            </div>
            <div class="showcase__item">
              <app-text
                label="Large + Required"
                placeholder="Large required"
                size="large"
                [required]="true"
                helpText="Large required field"
              ></app-text>
            </div>
          </div>
        </div>

        <!-- Variant Examples -->
        <div class="showcase__section">
          <h2 class="showcase__section__title">Variant Examples</h2>
          <p class="showcase__section__description">
            Different visual variants of the text input component.
          </p>
          <div class="showcase__grid">
            <div class="showcase__item">
              <h3>Filled Variant</h3>
              <app-text
                label="Filled Text Field"
                placeholder="Enter text"
                variant="filled"
                helpText="Filled variant with background color"
              ></app-text>
            </div>
            <div class="showcase__item">
              <h3>Filled Gray Variant</h3>
              <app-text
                label="Filled Gray Text Field"
                placeholder="Enter text"
                variant="filled-gray"
                helpText="Filled gray variant"
              ></app-text>
            </div>
            <div class="showcase__item">
              <h3>Filled Lighter Variant</h3>
              <app-text
                label="Filled Lighter Text Field"
                placeholder="Enter text"
                variant="filled-lighter"
                helpText="Filled lighter variant"
              ></app-text>
            </div>
            <div class="showcase__item">
              <h3>Underlined Variant</h3>
              <app-text
                label="Underlined Text Field"
                placeholder="Enter text"
                variant="underlined"
                helpText="Underlined variant with bottom border"
              ></app-text>
            </div>
          </div>
        </div>

        <!-- Advanced Features -->
        <div class="showcase__section">
          <h2 class="showcase__section__title">Advanced Features</h2>
          <div class="showcase__grid">
            <div class="showcase__item">
              <h3>With Prefix</h3>
              <app-text
                label="Phone Number"
                placeholder="Enter phone number"
                helpText="Text field with prefix icon"
              ></app-text>
            </div>
            <div class="showcase__item">
              <h3>With Suffix</h3>
              <app-text
                label="Search"
                placeholder="Search..."
                helpText="Text field with suffix icon"
              ></app-text>
            </div>
            <div class="showcase__item">
              <h3>With Validation</h3>
              <app-text
                label="Email with Validation"
                placeholder="email@example.com"
                [required]="true"
                helpText="Field with email validation"
              ></app-text>
            </div>
          </div>
          <div class="showcase__item" style="margin-top: 20px;">
            <h3>Character Counter</h3>
            <app-text
              label="Limited Text"
              placeholder="Enter text (max 100 characters)"
              helpText="Text field with character limit"
              [(ngModel)]="limitedText"
              [ngModelOptions]="{ standalone: true }"
            ></app-text>
            <p style="font-size: 12px; color: #666; margin-top: 4px;">
              Characters: {{ limitedText.length }}/100
            </p>
          </div>
        </div>

        <!-- Accessibility Features -->
        <div class="showcase__section">
          <h2 class="showcase__section__title">Accessibility Features</h2>
          <div class="showcase__grid">
            <div class="showcase__item">
              <h3>ARIA Labels</h3>
              <app-text
                label="Accessible Field"
                placeholder="Enter accessible text"
                helpText="Field with proper ARIA attributes"
              ></app-text>
            </div>
            <div class="showcase__item">
              <h3>Keyboard Navigation</h3>
              <app-text
                label="Keyboard Accessible"
                placeholder="Use Tab to navigate"
                helpText="Fully keyboard accessible"
              ></app-text>
            </div>
            <div class="showcase__item">
              <h3>Screen Reader Support</h3>
              <app-text
                label="Screen Reader Friendly"
                placeholder="Screen reader text"
                helpText="Optimized for screen readers"
              ></app-text>
            </div>
          </div>
        </div>

        <!-- Performance Considerations -->
        <div class="showcase__section">
          <h2 class="showcase__section__title">Performance Considerations</h2>
          <div class="showcase__grid">
            <div class="showcase__item">
              <h3>Debounced Input</h3>
              <app-text
                label="Search with Debounce"
                placeholder="Type to search..."
                helpText="Input with debounce for performance"
              ></app-text>
            </div>
            <div class="showcase__item">
              <h3>Lazy Validation</h3>
              <app-text
                label="Lazy Validated Field"
                placeholder="Validates on blur"
                helpText="Validation occurs on blur event"
              ></app-text>
            </div>
          </div>
        </div>

        <!-- Best Practices -->
        <div class="showcase__section">
          <h2 class="showcase__section__title">Best Practices</h2>
          <div class="showcase__item">
            <h3>Label Placement</h3>
            <p class="showcase__section__description">
              Always provide clear, descriptive labels for text inputs.
            </p>
            <app-text
              label="Clear Label Example"
              placeholder="Enter your information"
              helpText="Good: Clear and descriptive label"
            ></app-text>
          </div>
          <div class="showcase__item" style="margin-top: 20px;">
            <h3>Help Text Usage</h3>
            <p class="showcase__section__description">
              Use help text to provide additional context or instructions.
            </p>
            <app-text
              label="Help Text Example"
              placeholder="Enter value"
              helpText="Help text provides additional context and guidance to users"
            ></app-text>
          </div>
          <div class="showcase__item" style="margin-top: 20px;">
            <h3>Error Handling</h3>
            <p class="showcase__section__description">
              Provide clear error messages when validation fails.
            </p>
            <app-text
              label="Error Example"
              placeholder="Enter valid email"
              state="error"
              errorText="Please enter a valid email address"
            ></app-text>
          </div>
        </div>

        <!-- Inline Edit Examples -->
        <div class="showcase__section">
          <h2 class="showcase__section__title">Inline Edit</h2>
          <p class="showcase__section__description">
            Inline edit allows users to edit text directly by clicking on it. The field displays as
            plain text and switches to an input when clicked. Changes are saved on blur or Enter, and
            can be cancelled with Escape.
          </p>
          <div class="showcase__grid">
            <div class="showcase__item">
              <h3>Basic Inline Edit</h3>
              <app-text
                label="Task Name"
                placeholder="Click to edit..."
                [inlineEdit]="true"
                [(ngModel)]="inlineEditValue1"
                [ngModelOptions]="{ standalone: true }"
                helpText="Click on the text to edit. Press Enter to save or Esc to cancel."
              ></app-text>
              <p style="font-size: 12px; color: #666; margin-top: 8px;">
                Current value: <strong>{{ inlineEditValue1 || '(empty)' }}</strong>
              </p>
            </div>
            <div class="showcase__item">
              <h3>Inline Edit with Default Value</h3>
              <app-text
                label="Project Name"
                placeholder="Enter project name..."
                [inlineEdit]="true"
                [(ngModel)]="inlineEditValue2"
                [ngModelOptions]="{ standalone: true }"
                helpText="Field with pre-filled value"
              ></app-text>
              <p style="font-size: 12px; color: #666; margin-top: 8px;">
                Current value: <strong>{{ inlineEditValue2 || '(empty)' }}</strong>
              </p>
            </div>
            <div class="showcase__item">
              <h3>Inline Edit - Different Sizes</h3>
              <app-text
                label="Small"
                placeholder="Small inline edit"
                [inlineEdit]="true"
                size="small"
                [(ngModel)]="inlineEditSmall"
                [ngModelOptions]="{ standalone: true }"
                helpText="Small size inline edit"
              ></app-text>
              <app-text
                label="Medium"
                placeholder="Medium inline edit"
                [inlineEdit]="true"
                size="medium"
                [(ngModel)]="inlineEditMedium"
                [ngModelOptions]="{ standalone: true }"
                helpText="Medium size inline edit (default)"
                style="margin-top: 12px;"
              ></app-text>
              <app-text
                label="Large"
                placeholder="Large inline edit"
                [inlineEdit]="true"
                size="large"
                [(ngModel)]="inlineEditLarge"
                [ngModelOptions]="{ standalone: true }"
                helpText="Large size inline edit"
                style="margin-top: 12px;"
              ></app-text>
            </div>
            <div class="showcase__item">
              <h3>Inline Edit - Disabled & Readonly</h3>
              <app-text
                label="Disabled Inline Edit"
                placeholder="Cannot edit"
                [inlineEdit]="true"
                [disabled]="true"
                [(ngModel)]="inlineEditDisabled"
                [ngModelOptions]="{ standalone: true }"
                helpText="Disabled inline edit field"
              ></app-text>
              <app-text
                label="Readonly Inline Edit"
                placeholder="Read only"
                [inlineEdit]="true"
                [readonly]="true"
                [(ngModel)]="inlineEditReadonly"
                [ngModelOptions]="{ standalone: true }"
                helpText="Readonly inline edit field"
                style="margin-top: 12px;"
              ></app-text>
            </div>
            <div class="showcase__item">
              <h3>Inline Edit with Save/Cancel Events</h3>
              <app-text
                label="Editable Field"
                placeholder="Edit and see events..."
                [inlineEdit]="true"
                [(ngModel)]="inlineEditWithEvents"
                [ngModelOptions]="{ standalone: true }"
                (save)="onInlineEditSave($event)"
                (cancel)="onInlineEditCancel()"
                helpText="Check console for save/cancel events"
              ></app-text>
              <p style="font-size: 12px; color: #666; margin-top: 8px;">
                Last action: <strong>{{ lastInlineEditAction || 'None' }}</strong>
              </p>
            </div>
            <div class="showcase__item">
              <h3>Multiple Inline Edit Fields</h3>
              <p class="showcase__section__description" style="margin-bottom: 16px;">
                Example of multiple inline edit fields in a form-like layout (like Jira, Confluence):
              </p>
              <app-text
                label="Task Title"
                placeholder="Enter task title..."
                [inlineEdit]="true"
                [(ngModel)]="taskForm.title"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                helpText="Click to edit task title"
              ></app-text>
              <app-text
                label="Description"
                placeholder="Enter description..."
                [inlineEdit]="true"
                [(ngModel)]="taskForm.description"
                [ngModelOptions]="{ standalone: true }"
                helpText="Click to edit description"
                style="margin-top: 12px;"
              ></app-text>
              <app-text
                label="Assignee"
                placeholder="Enter assignee name..."
                [inlineEdit]="true"
                [(ngModel)]="taskForm.assignee"
                [ngModelOptions]="{ standalone: true }"
                helpText="Click to edit assignee"
                style="margin-top: 12px;"
              ></app-text>
              <div class="showcase__form-output" style="margin-top: 16px;">
                <strong>Form Values:</strong>
                <pre>{{ taskForm | json }}</pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Integration Examples -->
        <div class="showcase__section">
          <h2 class="showcase__section__title">Integration Examples</h2>
          <div class="showcase__item">
            <h3>With Reactive Forms</h3>
            <p class="showcase__section__description">
              Example of text input integrated with Angular reactive forms.
            </p>
            <app-text
              label="Reactive Form Field"
              placeholder="Enter value"
              helpText="Works seamlessly with reactive forms"
            ></app-text>
          </div>
          <div class="showcase__item" style="margin-top: 20px;">
            <h3>With Template-Driven Forms</h3>
            <p class="showcase__section__description">
              Example of text input with template-driven forms using ngModel.
            </p>
            <app-text
              label="Template-Driven Field"
              placeholder="Enter value"
              [(ngModel)]="templateValue"
              [ngModelOptions]="{ standalone: true }"
              helpText="Works with template-driven forms"
            ></app-text>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TextShowcaseComponent {
  value = 'This is a read-only value';
  defaultValue = 'Default value';
  limitedText = '';
  templateValue = '';

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    comments: '',
  };

  // Inline edit showcase values
  inlineEditValue1 = '';
  inlineEditValue2 = 'My Awesome Project';
  inlineEditSmall = 'Small value';
  inlineEditMedium = 'Medium value';
  inlineEditLarge = 'Large value';
  inlineEditDisabled = 'Disabled value';
  inlineEditReadonly = 'Readonly value';
  inlineEditWithEvents = 'Edit me!';
  lastInlineEditAction = '';

  taskForm = {
    title: 'Implement inline edit feature',
    description: 'Add inline edit functionality to text component',
    assignee: 'John Doe',
  };

  onInlineEditSave(value: any): void {
    this.lastInlineEditAction = `Saved: ${value}`;
    console.log('Inline edit saved:', value);
  }

  onInlineEditCancel(): void {
    this.lastInlineEditAction = 'Cancelled';
    console.log('Inline edit cancelled');
  }
}
