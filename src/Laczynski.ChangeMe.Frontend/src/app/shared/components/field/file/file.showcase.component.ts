import { Component, signal } from '@angular/core';
import { FileComponent } from './file.component';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-file-showcase',

  imports: [FileComponent, ReactiveFormsModule, FormsModule, JsonPipe, CommonModule, TableOfContentComponent],
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
        <h1 class="showcase__title">File Input Component - Fluent 2 Design</h1>

      <section class="showcase__section">
        <h2 class="showcase__section__title">Basic Usage</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-file label="Upload File" />
          </div>
          <div class="showcase__item">
            <app-file
              label="Upload File (Inline Mode)"
              [mode]="'inline'"
              placeholder="Click to select a file"
            />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h2 class="showcase__section__title">Component Modes</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h4>Area Mode (Default)</h4>
            <app-file
              label="Drag & Drop Area"
              mode="area"
              uploadText="Click to upload or drag and drop"
              helpText="Area mode with drag and drop support"
            />
          </div>
          <div class="showcase__item">
            <h4>Inline Mode</h4>
            <app-file
              label="Inline File Input"
              [mode]="'inline'"
              placeholder="Click to select a file"
              helpText="Inline mode that looks like a text input"
            />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h2 class="showcase__section__title">Multiple Files</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-file
              label="Upload Multiple Files"
              [multiple]="true"
              uploadText="Click to upload or drag and drop multiple files"
              uploadHint="PDF, DOC, DOCX files up to 10MB"
            />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h2 class="showcase__section__title">Accept Types</h2>
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
        <h2 class="showcase__section__title">File Size Limit</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-file label="Max 5MB" [maxSize]="5 * 1024 * 1024" uploadHint="Files up to 5MB" />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h2 class="showcase__section__title">Max Files Limit</h2>
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
        <h2 class="showcase__section__title">Sizes</h2>
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
        <h2 class="showcase__section__title">Variants</h2>
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
        <h2 class="showcase__section__title">States</h2>
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
        <h2 class="showcase__section__title">Disabled & Read-only</h2>
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
        <h2 class="showcase__section__title">Required Field</h2>
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
        <h2 class="showcase__section__title">Form Integration</h2>
        <form [formGroup]="fileForm" class="showcase__form">
          <app-file
            label="Avatar"
            formControlName="avatar"
            accept="image/*"
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
        <h2 class="showcase__section__title">Event Handlers</h2>
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
        <h2 class="showcase__section__title">All Features Combined</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-file
              label="Full Featured File Input"
              [multiple]="true"
              [maxFiles]="5"
              [maxSize]="10 * 1024 * 1024"
              accept="image/*,.pdf"
              size="large"
              variant="filled"
              [required]="true"
              helpText="Upload up to 5 images or PDFs, max 10MB each"
            />
          </div>
        </div>
      </section>
      </div>
    </div>
  `,
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
