import { Component, forwardRef, input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FieldComponent } from '../field/field.component';
import { ActionButtonComponent } from '../action-button.component';

@Component({
  selector: 'app-textarea',
  imports: [FieldComponent, ActionButtonComponent],
  templateUrl: './textarea.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
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
export class TextareaComponent extends FieldComponent implements AfterViewInit {
  @ViewChild('textareaElement') textareaElement?: ElementRef<HTMLTextAreaElement>;
  rows = input<number>(4);
  cols = input<number | null>(null);

  ngAfterViewInit(): void {
    // Initial focus if in edit mode (for programmatic edit mode activation)
    if (this.isEditMode()) {
      this.focusAndSelectTextarea();
    }
  }

  /**
   * Focuses and selects all text in the textarea element.
   * Uses requestAnimationFrame + setTimeout to ensure DOM is updated and textarea is rendered before focusing.
   */
  protected focusAndSelectTextarea(): void {
    requestAnimationFrame(() => {
      setTimeout(() => {
        const textarea = this.getTextareaElement();
        if (textarea) {
          textarea.focus();
          textarea.select();
        }
      }, 0);
    });
  }

  /**
   * Gets the textarea element, trying ViewChild first, then falling back to DOM lookup.
   */
  private getTextareaElement(): HTMLTextAreaElement | null {
    if (this.textareaElement?.nativeElement) {
      return this.textareaElement.nativeElement;
    }
    // Fallback: try to find textarea by ID if ViewChild is not ready
    const textarea = document.getElementById(String(this.id()));
    return textarea instanceof HTMLTextAreaElement ? textarea : null;
  }

  /**
   * Hook called after entering edit mode to focus and select the textarea.
   */
  protected override afterEnterEditMode(): void {
    this.focusAndSelectTextarea();
  }
}
