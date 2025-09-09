import {
  Component,
  input,
  output,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldComponent } from '../field/field.component';
import { ClearButtonComponent } from '../clear-button.component';

export interface Country {
  code: string;
  name: string;
  flag: string;
  format?: string;
  placeholder?: string;
}

export interface PhoneValidation {
  isValid: boolean;
  type?: 'mobile' | 'landline' | 'toll-free' | 'unknown';
  country?: string;
  formatted?: string;
}

@Component({
  selector: 'app-tel',
  imports: [FieldComponent, CommonModule, FormsModule, ClearButtonComponent],
  templateUrl: './tel.component.html',
})
export class TelComponent extends FieldComponent implements OnInit, OnDestroy {
  showIcon = input<boolean>(true);
}
