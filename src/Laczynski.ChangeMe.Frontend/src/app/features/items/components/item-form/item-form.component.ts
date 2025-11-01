import {
  Component,
  OnInit,
  inject,
  input,
  signal,
  computed,
  WritableSignal,
  OnChanges,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StateContainerComponent, State, StateService } from '@shared/state';
import { ItemsService } from '../../services/items.service';
import { Item, CreateItemRequest, UpdateItemRequest } from '../../models/item.model';
import { ApiErrorService } from '@shared/api';
import { NumberComponent } from '@shared/components/field/number/number.component';
import { TextComponent } from '@shared/components/field/text/text.component';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-item-form',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateContainerComponent,
    NumberComponent,
    TextComponent,
    ButtonComponent,
  ],
  templateUrl: './item-form.component.html',
})
export class ItemFormComponent implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly itemsService = inject(ItemsService);
  private readonly stateService = inject(StateService);
  private readonly apiErrorService = inject(ApiErrorService);

  // Input properties
  itemId = input<string>();
  updated = output();
  closed = output();

  // Form and state
  itemForm!: FormGroup;
  isEditMode = computed(() => !!this.itemId());

  // State management
  itemState: WritableSignal<State<Item>> = this.stateService.createState();
  submitState: WritableSignal<State<any>> = this.stateService.createState();

  // Form state
  isSubmitting = signal(false);

  ngOnInit(): void {
    this.initializeForm();

    if (this.isEditMode()) {
      this.loadItem();
    }
  }

  ngOnChanges(): void {
    if (this.isEditMode()) {
      this.loadItem();
    }
  }

  /**
   * Initialize the reactive form
   */
  private initializeForm(): void {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0.01), Validators.max(999999.99)]],
      image: ['', [Validators.required, this.urlValidator.bind(this)]],
    });
  }

  /**
   * Custom URL validator
   */
  private urlValidator(control: any) {
    if (!control.value) return null;

    try {
      const url = new URL(control.value);
      return url.protocol === 'http:' || url.protocol === 'https:' ? null : { invalidUrl: true };
    } catch {
      return { invalidUrl: true };
    }
  }

  /**
   * Load item data for editing
   */
  private loadItem(): void {
    if (!this.itemId()) return;

    this.itemsService.getItemWithState(this.itemState, this.itemId()!).subscribe({
      next: item => {
        this.populateForm(item);
      },
      error: error => {
        console.error('Error loading item:', error);
        this.apiErrorService.showErrorToast('Nie udało się załadować danych elementu');
      },
    });
  }

  /**
   * Populate form with item data
   */
  private populateForm(item: Item): void {
    this.itemForm.patchValue({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
    });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.itemForm.invalid || this.isSubmitting()) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting.set(true);

    if (this.isEditMode()) {
      this.updateItem();
    } else {
      this.createItem();
    }
  }

  /**
   * Create new item
   */
  private createItem(): void {
    const request: CreateItemRequest = this.itemForm.value;

    this.itemsService.createItemWithState(this.submitState, request).subscribe({
      next: () => {
        this.apiErrorService.showSuccessToast('Element został utworzony pomyślnie');
        this.updated.emit();
        this.isSubmitting.set(false);
      },
      error: error => {
        console.error('Error creating item:', error);
        this.isSubmitting.set(false);
      },
    });
  }

  /**
   * Update existing item
   */
  private updateItem(): void {
    const request: UpdateItemRequest = {
      id: this.itemId()!,
      ...this.itemForm.value,
    };

    this.itemsService.updateItemWithState(this.submitState, request).subscribe({
      next: () => {
        this.apiErrorService.showSuccessToast('Element został zaktualizowany pomyślnie');
        this.updated.emit();
        this.isSubmitting.set(false);
      },
      error: error => {
        console.error('Error updating item:', error);
        this.isSubmitting.set(false);
      },
    });
  }

  /**
   * Handle form cancellation
   */
  onCancel(): void {
    this.closed.emit();
  }

  /**
   * Mark all form fields as touched for validation display
   */
  private markFormGroupTouched(): void {
    Object.keys(this.itemForm.controls).forEach(key => {
      const control = this.itemForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Check if field has error and is touched
   */
  hasFieldError(fieldName: string, errorType?: string): boolean {
    const field = this.itemForm.get(fieldName);
    if (!field) return false;

    if (errorType) {
      return field.hasError(errorType) && field.touched;
    }
    return field.invalid && field.touched;
  }

  /**
   * Get field error message
   */
  getFieldErrorMessage(fieldName: string): string {
    const field = this.itemForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const errors = field.errors;

    if (errors['required']) return `${fieldName} jest wymagane`;
    if (errors['minlength'])
      return `${fieldName} musi mieć co najmniej ${errors['minlength'].requiredLength} znaków`;
    if (errors['maxlength'])
      return `${fieldName} może mieć maksymalnie ${errors['maxlength'].requiredLength} znaków`;
    if (errors['min']) return `${fieldName} musi być większe od ${errors['min'].min}`;
    if (errors['max']) return `${fieldName} musi być mniejsze od ${errors['max'].max}`;
    if (errors['invalidUrl']) return `${fieldName} musi być prawidłowym adresem URL`;

    return 'Pole zawiera błąd';
  }

  /**
   * Handle image preview
   */
  onImageUrlChange(): void {
    // This can be enhanced to show image preview
    const imageUrl = this.itemForm.get('image')?.value;
    if (imageUrl && this.isValidUrl(imageUrl)) {
      // Image preview logic can be added here
    }
  }

  /**
   * Handle image load error
   */
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }

  /**
   * Check if URL is valid
   */
  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }
}
