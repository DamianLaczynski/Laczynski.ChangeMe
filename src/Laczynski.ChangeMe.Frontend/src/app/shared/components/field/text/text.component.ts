import { Component, forwardRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldComponent } from '../field/field.component';
import { ActionButtonComponent } from '../action-button.component';

@Component({
  selector: 'app-text',
  imports: [FieldComponent, ActionButtonComponent],
  templateUrl: './text.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextComponent),
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
export class TextComponent extends FieldComponent implements AfterViewInit {
  @ViewChild('inputElement') inputElement?: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    // Initial focus if in edit mode (for programmatic edit mode activation)
    if (this.isEditMode()) {
      this.focusAndSelectInput();
    }
  }

  /**
   * Focuses and selects all text in the input element.
   * Uses requestAnimationFrame + setTimeout to ensure DOM is updated and input is rendered before focusing.
   */
  protected focusAndSelectInput(): void {
    requestAnimationFrame(() => {
      setTimeout(() => {
        const input = this.getInputElement();
        if (input) {
          input.focus();
          input.select();
        }
      }, 0);
    });
  }

  /**
   * Gets the input element, trying ViewChild first, then falling back to DOM lookup.
   */
  private getInputElement(): HTMLInputElement | null {
    if (this.inputElement?.nativeElement) {
      return this.inputElement.nativeElement;
    }
    // Fallback: try to find input by ID if ViewChild is not ready
    const input = document.getElementById(String(this.id()));
    return input instanceof HTMLInputElement ? input : null;
  }

  /**
   * Hook called after entering edit mode to focus and select the input.
   */
  protected override afterEnterEditMode(): void {
    this.focusAndSelectInput();
  }
}
