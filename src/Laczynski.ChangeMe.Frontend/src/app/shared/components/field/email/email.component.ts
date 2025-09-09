import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldComponent } from '../field/field.component';
import { ClearButtonComponent } from '../clear-button.component';

@Component({
  selector: 'app-email',
  imports: [FieldComponent, CommonModule, ClearButtonComponent],
  templateUrl: './email.component.html',
})
export class EmailComponent extends FieldComponent {}
