import { Component } from '@angular/core';
import { TextareaComponent } from './textarea.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-textarea-showcase',
  imports: [TextareaComponent, FormsModule, JsonPipe, TableOfContentComponent],
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
        <h1 class="showcase__title">Textarea Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Textarea component built with Fluent 2 Design System. All variants
        are responsive and accessible.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-textarea
              label="Comments"
              placeholder="Enter your comments..."
              helpText="Enter your comments or feedback"
            ></app-textarea>
          </div>
          <div class="showcase__item">
            <app-textarea
              label="With Default Value"
              placeholder="Enter your text..."
              [(ngModel)]="defaultValue"
              [ngModelOptions]="{ standalone: true }"
              helpText="Textarea field with default value"
            ></app-textarea>
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-textarea
              label="Small Textarea"
              placeholder="Enter text..."
              size="small"
              [rows]="3"
              helpText="This is a small textarea"
              variant="underlined"
            ></app-textarea>
          </div>
          <div class="showcase__item">
            <app-textarea
              label="Medium Textarea"
              placeholder="Enter text..."
              size="medium"
              [rows]="4"
              helpText="This is a medium textarea"
              variant="filled-gray"
            ></app-textarea>
          </div>
          <div class="showcase__item">
            <app-textarea
              label="Large Textarea"
              placeholder="Enter text..."
              size="large"
              [rows]="6"
              helpText="This is a large textarea"
              variant="filled"
            ></app-textarea>
          </div>
        </div>
      </div>

      <!-- Rows Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Rows Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-textarea
              label="Small Textarea (3 rows)"
              placeholder="Enter text..."
              [rows]="3"
              helpText="Textarea with 3 rows"
            ></app-textarea>
          </div>
          <div class="showcase__item">
            <app-textarea
              label="Default Textarea (4 rows)"
              placeholder="Enter text..."
              [rows]="4"
              helpText="Textarea with 4 rows (default)"
            ></app-textarea>
          </div>
          <div class="showcase__item">
            <app-textarea
              label="Large Textarea (6 rows)"
              placeholder="Enter text..."
              [rows]="6"
              helpText="Textarea with 6 rows"
            ></app-textarea>
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-textarea
              label="Normal State"
              placeholder="Enter text..."
              helpText="This is a normal textarea"
            ></app-textarea>
          </div>
          <div class="showcase__item">
            <app-textarea
              label="Error State"
              placeholder="Enter text..."
              state="error"
              errorText="This field has an error"
            ></app-textarea>
          </div>
          <div class="showcase__item">
            <app-textarea
              label="Warning State"
              placeholder="Enter text..."
              state="warning"
              warningText="This field has a warning"
            ></app-textarea>
          </div>
          <div class="showcase__item">
            <app-textarea
              label="Success State"
              placeholder="Enter text..."
              state="success"
              successText="This field is valid"
            ></app-textarea>
          </div>
        </div>
      </div>

      <!-- Interactive States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-textarea
              label="Disabled Field"
              placeholder="Enter text..."
              [disabled]="true"
              helpText="This field is disabled"
            ></app-textarea>
          </div>
          <div class="showcase__item">
            <app-textarea
              label="Read Only Field"
              placeholder="Enter text..."
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              helpText="This field is read only"
            ></app-textarea>
          </div>
          <div class="showcase__item">
            <app-textarea
              label="Required Field"
              placeholder="Enter text..."
              [required]="true"
              helpText="This field is required"
            ></app-textarea>
          </div>
        </div>
      </div>

      <!-- Form Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Form Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-textarea
                label="Message"
                placeholder="Enter your message..."
                [(ngModel)]="formData.message"
                [ngModelOptions]="{ standalone: true }"
                [required]="true"
                [rows]="5"
                helpText="Enter your message"
              ></app-textarea>
              <app-textarea
                label="Notes"
                placeholder="Enter your notes..."
                [(ngModel)]="formData.notes"
                [ngModelOptions]="{ standalone: true }"
                [rows]="3"
                helpText="Optional notes"
              ></app-textarea>
              <app-textarea
                label="Description"
                placeholder="Enter description..."
                [(ngModel)]="formData.description"
                [ngModelOptions]="{ standalone: true }"
                [rows]="6"
                helpText="Detailed description"
              ></app-textarea>
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
            <app-textarea
              label="Small + Error"
              placeholder="Enter text..."
              size="small"
              state="error"
              [rows]="3"
              errorText="Small error field"
            ></app-textarea>
          </div>
          <div class="showcase__item">
            <app-textarea
              label="Medium + Warning"
              placeholder="Enter text..."
              size="medium"
              state="warning"
              [rows]="4"
              warningText="Medium warning field"
            ></app-textarea>
          </div>
          <div class="showcase__item">
            <app-textarea
              label="Large + Success"
              placeholder="Enter text..."
              size="large"
              state="success"
              [rows]="6"
              successText="Large success field"
            ></app-textarea>
          </div>
          <div class="showcase__item">
            <app-textarea
              label="Small + Disabled"
              placeholder="Enter text..."
              size="small"
              [disabled]="true"
              [rows]="3"
              helpText="Small disabled field"
            ></app-textarea>
          </div>
          <div class="showcase__item">
            <app-textarea
              label="Medium + Read Only"
              placeholder="Enter text..."
              size="medium"
              [readonly]="true"
              [(ngModel)]="value"
              [ngModelOptions]="{ standalone: true }"
              [rows]="4"
              helpText="Medium read only field"
            ></app-textarea>
          </div>
          <div class="showcase__item">
            <app-textarea
              label="Large + Required"
              placeholder="Enter text..."
              size="large"
              [required]="true"
              [rows]="6"
              helpText="Large required field"
            ></app-textarea>
          </div>
        </div>
      </div>

      <!-- Inline Edit Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Inline Edit</h2>
        <p class="showcase__section__description">
          Inline edit allows users to edit textarea directly by clicking on it. Changes are saved on
          blur or Enter, and can be cancelled with Escape.
        </p>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Basic Inline Edit</h3>
            <app-textarea
              label="Description"
              placeholder="Click to edit..."
              [inlineEdit]="true"
              [(ngModel)]="inlineEditValue1"
              [ngModelOptions]="{ standalone: true }"
              helpText="Click on the text to edit. Press Enter to save or Esc to cancel."
            ></app-textarea>
            <p style="font-size: 12px; color: #666; margin-top: 8px;">
              Current value: <strong>{{ inlineEditValue1 || '(empty)' }}</strong>
            </p>
          </div>
          <div class="showcase__item">
            <h3>Inline Edit with Default Value</h3>
            <app-textarea
              label="Notes"
              placeholder="Enter notes..."
              [inlineEdit]="true"
              [(ngModel)]="inlineEditValue2"
              [ngModelOptions]="{ standalone: true }"
              helpText="Field with pre-filled value"
            ></app-textarea>
            <p style="font-size: 12px; color: #666; margin-top: 8px;">
              Current value: <strong>{{ inlineEditValue2 || '(empty)' }}</strong>
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  `,
})
export class TextareaShowcaseComponent {
  value = 'This is a read-only textarea value that spans multiple lines.\nSecond line of text.\nThird line of text.';
  defaultValue = 'Default textarea value';

  formData = {
    message: '',
    notes: '',
    description: '',
  };

  // Inline edit showcase values
  inlineEditValue1 = '';
  inlineEditValue2 = 'This is a pre-filled textarea value.\nIt can span multiple lines.';
}

