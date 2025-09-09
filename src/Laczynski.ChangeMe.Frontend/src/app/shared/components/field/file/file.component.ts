import {
  Component,
  input,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldComponent, FieldState } from '../field/field.component';
import { ButtonComponent } from '../../button/button.component';
import { Intent } from '../../utils';
import { ClearButtonComponent } from '../clear-button.component';

export interface FileValidation {
  maxSize?: number; // in bytes
  allowedTypes?: string[]; // MIME types or extensions
  maxFiles?: number;
}

@Component({
  selector: 'app-file',
  imports: [
    FieldComponent,
    CommonModule,
    ButtonComponent,
    ClearButtonComponent,
  ],
  templateUrl: './file.component.html',
})
export class FileComponent extends FieldComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // File input properties
  accept = input<string>('');
  multiple = input<boolean>(false);
  maxSize = input<number>(10 * 1024 * 1024); // 10MB default
  allowedTypes = input<string[]>([]);
  maxFiles = input<number>(1);
  browseButtonText = input<string>('Browse');

  // File handling
  selectedFiles: File[] = [];
  fileErrors: string[] = [];
  isDragOver = false;

  getSelectedFilesText(): string {
    const count = this.selectedFiles.length;
    if (count === 1) {
      return this.selectedFiles[0].name;
    } else {
      return `${count} files selected`;
    }
  }

  triggerFileInput(): void {
    if (!this.disabled()) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length > 0) {
      this.handleFiles(Array.from(files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.disabled()) {
      this.isDragOver = true;
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    // Only set dragOver to false if we're leaving the container entirely
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      this.isDragOver = false;
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.isDragOver = false;

    if (this.disabled()) {
      return;
    }

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(Array.from(files));
    }
  }

  private handleFiles(files: File[]): void {
    // Clear previous errors
    this.fileErrors = [];

    // Validate files
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const error = this.validateFile(file);

      if (error) {
        this.fileErrors[i] = error;
      } else {
        validFiles.push(file);
      }
    }

    // Check max files limit
    if (this.multiple()) {
      const totalFiles = this.selectedFiles.length + validFiles.length;
      if (totalFiles > this.maxFiles()) {
        const remaining = this.maxFiles() - this.selectedFiles.length;
        if (remaining > 0) {
          validFiles.splice(remaining);
        } else {
          validFiles.length = 0;
        }
      }
    } else {
      // Single file mode - replace existing files
      this.selectedFiles = validFiles.slice(0, 1);
    }

    // Add valid files
    if (this.multiple()) {
      this.selectedFiles.push(...validFiles);
    } else {
      this.selectedFiles = validFiles;
    }

    // Update the actual file input
    this.updateFileInput();

    // Emit change event
    this.value = this.multiple()
      ? this.selectedFiles
      : this.selectedFiles[0] || null;
    this.onChange(this.value);
    this.change.emit(this.value);
  }

  private validateFile(file: File): string | null {
    // Check file size
    if (file.size > this.maxSize()) {
      return `File size exceeds ${this.formatFileSize(this.maxSize())}`;
    }

    // Check file type
    if (this.allowedTypes().length > 0) {
      const isValidType = this.allowedTypes().some((type) => {
        if (type.startsWith('.')) {
          // Extension check
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        } else {
          // MIME type check
          return file.type === type || file.type.startsWith(type + '/');
        }
      });

      if (!isValidType) {
        return `File type not allowed. Allowed types: ${this.allowedTypes().join(
          ', '
        )}`;
      }
    }

    return null;
  }

  private updateFileInput(): void {
    // Create a new FileList-like object
    const dt = new DataTransfer();
    this.selectedFiles.forEach((file) => dt.items.add(file));
    this.fileInput.nativeElement.files = dt.files;
  }

  removeFile(index: number): void {
    if (index >= 0 && index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
      this.fileErrors.splice(index, 1);

      this.updateFileInput();

      // Emit change event
      this.value = this.multiple()
        ? this.selectedFiles
        : this.selectedFiles[0] || null;
      this.onChange(this.value);
      this.change.emit(this.value);
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  override writeValue(value: any): void {
    // For file inputs, we typically don't set initial values
    // as browsers don't allow setting file input values for security reasons
    this.value = value;
  }

  stateMap(state: FieldState): Intent {
    return state === 'error'
      ? 'danger'
      : state === 'warning'
      ? 'warning'
      : state === 'success'
      ? 'success'
      : 'primary';
  }
}
