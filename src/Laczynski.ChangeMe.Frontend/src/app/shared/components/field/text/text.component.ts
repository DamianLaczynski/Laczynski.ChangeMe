import { Component, input } from '@angular/core';
import { FieldComponent } from '../field/field.component';
import { ClearButtonComponent } from '../clear-button.component';

@Component({
  selector: 'app-text',
  imports: [FieldComponent, ClearButtonComponent],
  templateUrl: './text.component.html',
})
export class TextComponent extends FieldComponent {}
