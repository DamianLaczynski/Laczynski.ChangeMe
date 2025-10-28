import { Component, forwardRef, input, output, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioGroupDirection, RadioLayout, Size, StateType } from '../../utils';
import { CommonModule } from '@angular/common';
import { RadioComponent } from './radio.component';
import { FieldComponent } from '../field/field.component';

export interface RadioItem {
  id: string | number;
  label: string;
  value: any;
  layout?: RadioLayout;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-radio-group',
  imports: [CommonModule, FieldComponent, RadioComponent],
  templateUrl: './radio-group.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
})
export class RadioGroupComponent extends FieldComponent implements ControlValueAccessor, OnInit {
  items = input<RadioItem[]>([]);
  direction = input<RadioGroupDirection>('vertical');

  get groupClasses(): string {
    const classes = ['radio-group'];

    classes.push(`radio-group--${this.direction()}`);
    classes.push(`radio-group--${this.size()}`);
    classes.push(`radio-group--${this.state()}`);

    if (this.disabled()) {
      classes.push('radio-group--disabled');
    }

    return classes.join(' ');
  }

  /**
   * Check if specific radio button should be checked
   */
  isRadioChecked(itemValue: any): boolean {
    return this.value === itemValue;
  }

  /**
   * Handle radio button selection.
   * Called when user clicks a radio button.
   */
  onRadioSelected(selectedValue: any): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    // Update internal value
    this.value = selectedValue;

    // Notify Angular Forms
    this.onChange(selectedValue);
    this.onTouched();

    // Emit change event for parent components
    this.change.emit(selectedValue);
  }

  /**
   * Get the group name for radio buttons
   * Uses provided name or generates one based on id
   */
  getGroupName(): string {
    return this.name() || this.id()?.toString() || `radio-group-${this.items().length}`;
  }
}
