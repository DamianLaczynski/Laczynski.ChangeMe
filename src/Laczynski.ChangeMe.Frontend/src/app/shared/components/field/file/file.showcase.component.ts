import { Component, signal } from '@angular/core';
import { FileComponent } from './file.component';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-file-showcase',

  imports: [FileComponent, ReactiveFormsModule, FormsModule, JsonPipe, CommonModule],
  template: `
    <div class="showcase">
      <h2>File Input Component - Fluent 2 Design</h2>

      <section class="showcase__section">
        <h3>Basic Usage</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-file label="Upload File" [showPreview]="true" />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>Multiple Files</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-file
              label="Upload Multiple Files"
              [multiple]="true"
              [showPreview]="true"
              uploadText="Click to upload or drag and drop multiple files"
              uploadHint="PDF, DOC, DOCX files up to 10MB"
            />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>Accept Types</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-file
              label="Images Only"
              accept="image/*"
              uploadText="Upload images"
              uploadHint="PNG, JPG, GIF up to 5MB"
            />
          </div>
          <div class="showcase__item">
            <app-file
              label="Documents Only"
              accept=".pdf,.doc,.docx"
              uploadText="Upload documents"
              uploadHint="PDF, DOC, DOCX files"
            />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>File Size Limit</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-file label="Max 5MB" [maxSize]="5 * 1024 * 1024" uploadHint="Files up to 5MB" />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>Max Files Limit</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-file
              label="Max 3 Files"
              [multiple]="true"
              [maxFiles]="3"
              uploadHint="Maximum 3 files"
            />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>With Preview</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-file
              label="Upload Images with Preview"
              accept="image/*"
              [multiple]="true"
              [showPreview]="true"
              uploadText="Upload images"
            />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>Sizes</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-file label="Small" size="small" />
          </div>
          <div class="showcase__item">
            <app-file label="Medium" size="medium" />
          </div>
          <div class="showcase__item">
            <app-file label="Large" size="large" />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>Variants</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-file label="Filled" variant="filled" />
          </div>
          <div class="showcase__item">
            <app-file label="Filled Gray" variant="filled-gray" />
          </div>
          <div class="showcase__item">
            <app-file label="Underlined" variant="underlined" />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>States</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-file label="Default" />
          </div>
          <div class="showcase__item">
            <app-file label="Error State" state="error" errorText="File upload failed" />
          </div>
          <div class="showcase__item">
            <app-file label="Warning State" state="warning" warningText="File size is large" />
          </div>
          <div class="showcase__item">
            <app-file
              label="Success State"
              state="success"
              successText="File uploaded successfully"
            />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>Disabled & Read-only</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-file label="Disabled" [disabled]="true" />
          </div>
          <div class="showcase__item">
            <app-file label="Read-only" [readonly]="true" />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>Required Field</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-file
              label="Required File Upload"
              [required]="true"
              helpText="Please upload a file"
            />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>Form Integration</h3>
        <form [formGroup]="fileForm" class="showcase__form">
          <app-file
            label="Avatar"
            formControlName="avatar"
            accept="image/*"
            [showPreview]="true"
            helpText="Upload your profile picture"
          />
          <app-file
            label="Documents"
            formControlName="documents"
            [multiple]="true"
            accept=".pdf,.doc,.docx"
            helpText="Upload supporting documents"
            [maxSize]="10 * 1024 * 1024"
          />

          <div class="showcase__form-output">
            <h4>Form Values:</h4>
            <pre>{{ fileForm.value | json }}</pre>
          </div>
        </form>
      </section>

      <section class="showcase__section">
        <h3>Event Handlers</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-file
              label="File Upload with Events"
              [multiple]="true"
              (fileSelect)="onFileSelect($event)"
              (fileRemove)="onFileRemove($event)"
              helpText="Check console for events"
            />
          </div>
        </div>
        @if (eventLogs().length > 0) {
          <div class="showcase__event-log">
            <h4>Event Log:</h4>
            <ul>
              @for (log of eventLogs(); track log.id) {
                <li>{{ log.message }}</li>
              }
            </ul>
          </div>
        }
      </section>

      <section class="showcase__section">
        <h3>All Features Combined</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-file
              label="Full Featured File Input"
              [multiple]="true"
              [maxFiles]="5"
              [maxSize]="10 * 1024 * 1024"
              accept="image/*,.pdf"
              [showPreview]="true"
              size="large"
              variant="filled"
              [required]="true"
              helpText="Upload up to 5 images or PDFs, max 10MB each"
            />
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .showcase {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .showcase h2 {
        margin-bottom: 2rem;
        color: var(--color-neutral-foreground-rest);
      }

      .showcase__section {
        margin-bottom: 3rem;
      }

      .showcase__section h3 {
        margin-bottom: 1.5rem;
        color: var(--color-neutral-foreground2-rest);
        font-weight: 600;
      }

      .showcase__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }

      .showcase__item {
        display: flex;
        flex-direction: column;
      }

      .showcase__form {
        max-width: 600px;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .showcase__form-output {
        margin-top: 1rem;
        padding: 1rem;
        background: var(--color-neutral-background-hover);
        border-radius: 8px;
      }

      .showcase__form-output h4 {
        margin-bottom: 0.5rem;
      }

      .showcase__form-output pre {
        margin: 0;
        font-family: 'Courier New', monospace;
        font-size: 0.875rem;
        white-space: pre-wrap;
      }

      .showcase__event-log {
        margin-top: 1rem;
        padding: 1rem;
        background: var(--color-neutral-background-hover);
        border-radius: 8px;
      }

      .showcase__event-log h4 {
        margin-bottom: 0.5rem;
      }

      .showcase__event-log ul {
        margin: 0;
        padding-left: 1.5rem;
      }

      .showcase__event-log li {
        margin-bottom: 0.25rem;
        font-family: 'Courier New', monospace;
        font-size: 0.875rem;
      }
    `,
  ],
})
export class FileShowcaseComponent {
  eventLogs = signal<Array<{ id: number; message: string }>>([]);
  private eventId = 0;

  fileForm = new FormGroup({
    avatar: new FormControl<File | null>(null),
    documents: new FormControl<File[] | null>(null),
  });

  onFileSelect(files: File[]): void {
    const fileNames = files.map(f => f.name).join(', ');
    this.addEventLog(`Files selected: ${fileNames}`);
  }

  onFileRemove(file: File): void {
    this.addEventLog(`File removed: ${file.name}`);
  }

  private addEventLog(message: string): void {
    this.eventLogs.set([
      ...this.eventLogs(),
      { id: ++this.eventId, message: `${new Date().toLocaleTimeString()}: ${message}` },
    ]);
  }
}
