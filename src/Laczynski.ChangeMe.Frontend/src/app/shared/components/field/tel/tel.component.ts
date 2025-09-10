import { Component, input, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldComponent } from '../field/field.component';
import { ClearButtonComponent } from '../clear-button.component';

@Component({
  selector: 'app-tel',
  imports: [FieldComponent, CommonModule, FormsModule, ClearButtonComponent],
  templateUrl: './tel.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TelComponent),
      multi: true,
    },
  ],
})
export class TelComponent extends FieldComponent implements OnInit, OnDestroy {
  showIcon = input<boolean>(true);
}
