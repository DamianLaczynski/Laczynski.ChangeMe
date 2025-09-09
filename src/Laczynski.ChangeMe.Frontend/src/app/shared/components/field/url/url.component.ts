import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldComponent } from '../field/field.component';
import { ClearButtonComponent } from '../clear-button.component';

@Component({
  selector: 'app-url',
  imports: [FieldComponent, CommonModule, ClearButtonComponent],
  templateUrl: './url.component.html',
})
export class UrlComponent extends FieldComponent {}
