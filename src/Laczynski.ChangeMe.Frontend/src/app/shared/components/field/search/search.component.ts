import {
  Component,
  input,
  output,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldComponent } from '../field/field.component';
import { ClearButtonComponent } from '../clear-button.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [FieldComponent, CommonModule, ClearButtonComponent],
  templateUrl: './search.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchComponent),
      multi: true,
    },
  ],
})
export class SearchComponent extends FieldComponent implements OnInit, OnDestroy {
  // Search input properties
  debounceTime = input<number>(300);

  private debounceTimer: any;

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  override onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;

    // Debounce search
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.onChange(this.value);
      this.change.emit(this.value);
    }, this.debounceTime());
  }
}
