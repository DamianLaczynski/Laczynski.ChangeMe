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
import { NodeComponent, Node } from '../../node/node.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ActionButtonComponent } from '../action-button.component';

export interface FileInfo {
  file: File;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  id: string; // Unique identifier for tracking
}

export type FileComponentMode = 'inline' | 'area';

@Component({
  selector: 'app-file',
  standalone: true,
  imports: [
    CommonModule,
    FieldComponent,
    IconComponent,
    NodeComponent,
    ButtonComponent,
    ActionButtonComponent,
  ],
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
  mode = input<FileComponentMode>('area'); // 'inline' or 'area'
  accept = input<string>('');
  multiple = input<boolean>(false);
  maxFiles = input<number | null>(null);
  maxSize = input<number | null>(null); // in bytes
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
  private fileIdCounter = 0; // Counter for generating unique IDs

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  // Computed properties
  displayText = computed(() => {
    const files = this.selectedFiles();
    if (files.length === 0) {
      if (this.mode() === 'inline') {
        return '';
      }
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
    const variant = this.variant();
    const mode = this.mode();
    const classes = [
      mode === 'inline' ? 'file-input-wrapper' : 'file',
      mode === 'inline' ? `file-input-wrapper--${size}` : `file--${size}`,
      mode === 'inline' ? `file-input-wrapper--${variant}` : `file--${variant}`,
    ];

    if (this.disabled()) {
      classes.push(mode === 'inline' ? 'file-input-wrapper--disabled' : 'file--disabled');
    }

    if (this.readonly()) {
      classes.push(mode === 'inline' ? 'file-input-wrapper--read-only' : 'file--read-only');
    }

    if (state === 'error') {
      classes.push(mode === 'inline' ? 'file-input-wrapper--error' : 'file--error');
    } else if (state === 'warning') {
      classes.push(mode === 'inline' ? 'file-input-wrapper--warning' : 'file--warning');
    } else if (state === 'success') {
      classes.push(mode === 'inline' ? 'file-input-wrapper--success' : 'file--success');
    }

    if (mode === 'area' && this.isDragOver()) {
      classes.push('file--drag-over');
    }

    return classes.join(' ');
  });

  // Convert FileInfo to Node for display
  fileInfoToNode(fileInfo: FileInfo): Node {
    const meta = `${this.formatFileSize(fileInfo.size)}${fileInfo.type !== 'unknown' ? ` • ${fileInfo.type}` : ''}`;
    return {
      id: fileInfo.id,
      label: fileInfo.name,
      icon: this.getFileIcon(fileInfo.type),
      disabled: this.disabled() || this.readonly(),
      data: fileInfo,
    };
  }

  // Get file metadata for display
  getFileMeta(fileInfo: FileInfo): string {
    return `${this.formatFileSize(fileInfo.size)}${fileInfo.type !== 'unknown' ? ` • ${fileInfo.type}` : ''}`;
  }

  // Methods
  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    if (this.disabled() || this.mode() === 'inline') {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    if (this.disabled() || this.mode() === 'inline') {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    if (this.disabled() || this.mode() === 'inline') {
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

  override ngOnDestroy(): void {
    // Component cleanup if needed
  }

  // ControlValueAccessor implementation
  override writeValue(value: File | File[] | null): void {
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

      return fileInfo;
    });

    this.selectedFiles.set(fileInfos);
    super.writeValue(value);
  }

  override clear(): void {
    const files = this.selectedFiles();
    // Emit fileRemove for all files before clearing
    files.forEach(fileInfo => {
      this.fileRemove.emit(fileInfo.file);
    });

    super.clear();
    this.selectedFiles.set([]);
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  override onFocus(event: FocusEvent): void {
    this._isFocused = true;
    this.focus.emit(event);
  }

  override onBlur(event: FocusEvent): void {
    this._isFocused = false;
    this.onTouched();
    this.blur.emit(event);
  }
}

