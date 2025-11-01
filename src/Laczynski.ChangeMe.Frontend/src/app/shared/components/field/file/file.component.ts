import {
  Component,
  forwardRef,
  signal,
  computed,
  input,
  output,
  ElementRef,
  ViewChild,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FieldComponent } from '../field/field.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ActionButtonComponent } from '../action-button.component';

export interface FileInfo {
  file: File;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  id: string; // Unique identifier for tracking
  previewUrl?: string; // Cached preview URL for images
}

@Component({
  selector: 'app-file',

  imports: [CommonModule, FieldComponent, IconComponent, ActionButtonComponent],
  templateUrl: './file.component.html',
  host: {
    '[style.position]': '"relative"',
    '[style.display]': '"block"',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileComponent),
      multi: true,
    },
  ],
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
})
export class FileComponent extends FieldComponent implements ControlValueAccessor, OnDestroy {
  // Inputs
  accept = input<string>('');
  multiple = input<boolean>(false);
  maxFiles = input<number | null>(null);
  maxSize = input<number | null>(null); // in bytes
  showPreview = input<boolean>(false);
  uploadText = input<string>('Click to upload or drag and drop');
  uploadHint = input<string>('');

  // Outputs
  fileSelect = output<File[]>();
  fileRemove = output<File>();

  // Internal state
  selectedFiles = signal<FileInfo[]>([]);
  isDragOver = signal<boolean>(false);
  isUploading = signal<boolean>(false);
  uploadProgress = signal<number>(0);
  private previewUrls: Map<string, string> = new Map(); // Map by file ID
  private fileIdCounter = 0; // Counter for generating unique IDs

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  // Computed properties
  displayText = computed(() => {
    const files = this.selectedFiles();
    if (files.length === 0) {
      return this.uploadText() || 'Click to upload or drag and drop';
    }
    if (files.length === 1) {
      return files[0].name;
    }
    return `${files.length} files selected`;
  });

  displayHint = computed(() => {
    const files = this.selectedFiles();
    if (files.length === 0) {
      return this.uploadHint() || (this.multiple() ? 'Multiple files allowed' : 'Single file only');
    }
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    return this.formatFileSize(totalSize);
  });

  fileWrapperClasses = computed(() => {
    const size = this.size();
    const state = this.state();
    const classes = [`file-input-area--${size}`];

    if (this.disabled()) {
      classes.push('file-input-area--disabled');
    }

    if (state === 'error') {
      classes.push('file-input-area--error');
    } else if (state === 'warning') {
      classes.push('file-input-area--warning');
    } else if (state === 'success') {
      classes.push('file-input-area--success');
    }

    if (this.isDragOver()) {
      classes.push('file-input-area--drag-over');
    }

    return classes.join(' ');
  });

  fileItemClasses = computed(() => {
    return `file-item--${this.size()}`;
  });

  // Methods
  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    if (this.disabled()) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    if (this.disabled()) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    if (this.disabled()) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileInputChange(event: Event): void {
    if (this.disabled()) {
      return;
    }
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.handleFiles(Array.from(files));
    }
    // Reset input value to allow selecting the same file again
    input.value = '';
  }

  private handleFiles(files: File[]): void {
    let filesToAdd = files;

    // Check max files limit
    if (this.maxFiles() !== null && this.maxFiles()! > 0) {
      const currentCount = this.selectedFiles().length;
      const remaining = this.maxFiles()! - currentCount;
      if (remaining <= 0) {
        return;
      }
      filesToAdd = files.slice(0, remaining);
    }

    // Filter by accept types if specified
    if (this.accept()) {
      const acceptTypes = this.accept()
        .split(',')
        .map(t => t.trim());
      filesToAdd = filesToAdd.filter(file => {
        return acceptTypes.some(acceptType => {
          if (acceptType.startsWith('.')) {
            // Extension match
            return file.name.toLowerCase().endsWith(acceptType.toLowerCase());
          } else {
            // MIME type match
            const regex = new RegExp(
              '^' + acceptType.replace(/\*/g, '.*').replace(/\./g, '\\.') + '$',
            );
            return regex.test(file.type);
          }
        });
      });
    }

    // Check file size
    if (this.maxSize() !== null && this.maxSize()! > 0) {
      filesToAdd = filesToAdd.filter(file => file.size <= this.maxSize()!);
    }

    // Convert to FileInfo
    const fileInfos: FileInfo[] = filesToAdd.map(file => {
      const id = `file-${++this.fileIdCounter}-${file.name}-${file.size}-${file.lastModified}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const fileInfo: FileInfo = {
        file,
        name: file.name,
        size: file.size,
        type: file.type || 'unknown',
        lastModified: file.lastModified,
        id,
      };

      // Generate preview URL for images immediately
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        this.previewUrls.set(id, url);
        fileInfo.previewUrl = url;
      }

      return fileInfo;
    });

    // Update selected files
    if (this.multiple()) {
      this.selectedFiles.set([...this.selectedFiles(), ...fileInfos]);
    } else {
      this.selectedFiles.set(fileInfos.slice(0, 1));
    }

    // Update value and emit
    this.updateValue();
    this.fileSelect.emit(fileInfos.map(fi => fi.file));
  }

  removeFile(index: number): void {
    if (this.disabled()) {
      return;
    }
    const files = this.selectedFiles();
    if (index < 0 || index >= files.length) {
      return;
    }
    const removedFile = files[index];

    // Clean up preview URL if exists
    if (removedFile.id && this.previewUrls.has(removedFile.id)) {
      const url = this.previewUrls.get(removedFile.id)!;
      URL.revokeObjectURL(url);
      this.previewUrls.delete(removedFile.id);
    }

    const newFiles = files.filter((_, i) => i !== index);
    this.selectedFiles.set(newFiles);
    this.updateValue();
    this.fileRemove.emit(removedFile.file);
  }

  removeFileByFile(file: File): void {
    if (this.disabled()) {
      return;
    }
    const files = this.selectedFiles();
    const index = files.findIndex(f => f.file === file);
    if (index !== -1) {
      this.removeFile(index);
    }
  }

  triggerFileInput(): void {
    if (this.disabled() || this.readonly()) {
      return;
    }
    this.fileInput?.nativeElement.click();
  }

  private updateValue(): void {
    const files = this.selectedFiles();
    if (files.length === 0) {
      this.value = null;
    } else if (this.multiple()) {
      this.value = files.map(fi => fi.file);
    } else {
      this.value = files[0].file;
    }
    this.onChange(this.value);
    this.change.emit(this.value);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  getFileIcon(fileType: string): string {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video';
    if (fileType.startsWith('audio/')) return 'audio';
    if (
      fileType.includes('pdf') ||
      fileType.includes('document') ||
      fileType.includes('word') ||
      fileType.includes('excel') ||
      fileType.includes('powerpoint')
    ) {
      return 'document';
    }
    if (fileType.includes('zip') || fileType.includes('archive')) return 'archive';
    return 'file';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = '';
      img.style.display = 'none';
    }
  }

  getImagePreview(fileInfo: FileInfo): string {
    if (!fileInfo.file.type.startsWith('image/')) {
      return '';
    }

    // Return cached preview URL if exists
    if (fileInfo.previewUrl) {
      return fileInfo.previewUrl;
    }

    // Check if URL already exists in map
    if (fileInfo.id && this.previewUrls.has(fileInfo.id)) {
      const url = this.previewUrls.get(fileInfo.id)!;
      fileInfo.previewUrl = url;
      return url;
    }

    // Create new URL and cache it
    const url = URL.createObjectURL(fileInfo.file);
    if (fileInfo.id) {
      this.previewUrls.set(fileInfo.id, url);
      fileInfo.previewUrl = url;
    }
    return url;
  }

  override ngOnDestroy(): void {
    // Clean up preview URLs to prevent memory leaks
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
    this.previewUrls.clear();
  }

  // ControlValueAccessor implementation
  override writeValue(value: File | File[] | null): void {
    // Clean up old preview URLs before setting new files
    const currentFiles = this.selectedFiles();
    currentFiles.forEach(fileInfo => {
      if (fileInfo.id && this.previewUrls.has(fileInfo.id)) {
        const url = this.previewUrls.get(fileInfo.id)!;
        URL.revokeObjectURL(url);
        this.previewUrls.delete(fileInfo.id);
      }
    });

    if (!value) {
      this.selectedFiles.set([]);
      super.writeValue(null);
      return;
    }

    const files = Array.isArray(value) ? value : [value];
    const fileInfos: FileInfo[] = files.map(file => {
      const id = `file-${++this.fileIdCounter}-${file.name}-${file.size}-${file.lastModified}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const fileInfo: FileInfo = {
        file,
        name: file.name,
        size: file.size,
        type: file.type || 'unknown',
        lastModified: file.lastModified,
        id,
      };

      // Generate preview URL for images
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        this.previewUrls.set(id, url);
        fileInfo.previewUrl = url;
      }

      return fileInfo;
    });

    this.selectedFiles.set(fileInfos);
    super.writeValue(value);
  }

  override clear(): void {
    // Clean up all preview URLs
    this.previewUrls.forEach(url => URL.revokeObjectURL(url));
    this.previewUrls.clear();

    super.clear();
    this.selectedFiles.set([]);
  }
}
