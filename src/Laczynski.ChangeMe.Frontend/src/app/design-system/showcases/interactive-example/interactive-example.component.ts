import {
  Component,
  input,
  output,
  computed,
  signal,
  TemplateRef,
  contentChild,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  InteractiveExampleConfig,
  InteractiveControl,
  InteractiveConfigChangeEvent,
  InteractiveSelectControl,
  InteractiveTextControl,
  InteractiveNumberControl,
  InteractiveCheckboxControl,
  InteractiveRadioControl,
  InteractiveTextareaControl,
  InteractiveColorControl,
  InteractiveRangeControl,
} from './interactive-example.model';
import { SelectChangeEvent, SelectOption } from '../../select/select.model';
import { SelectComponent } from '../../select/select.component';
import { InputChangeEvent } from '../../input/input.model';
import { InputComponent } from '../../input/input.component';
import { CheckboxChangeEvent } from '../../checkbox/checkbox.model';
import { CheckboxComponent } from '../../checkbox/checkbox.component';

/**
 * Interactive Example Component
 *
 * Provides a unified interface for creating interactive configuration controls
 * in showcase components. Uses our design system components for consistency.
 */
@Component({
  selector: 'ds-interactive-example',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectComponent, InputComponent, CheckboxComponent],
  template: `
    <section class="showcase-section">
      <h2>{{ config().title || 'Interactive Example' }}</h2>
      @if (config().description) {
        <p>{{ config().description }}</p>
      }

      <div class="showcase-interactive" [class]="config().className">
        <!-- Controls Panel -->
        <div class="interactive-controls">
          @for (control of config().controls; track control.id) {
            <div class="control-group" [class]="control.className">
              @switch (control.type) {
                @case ('select') {
                  <ds-select
                    [options]="getSelectOptions(control)"
                    [value]="getControlValue(control.property)"
                    [disabled]="control.disabled || false"
                    [placeholder]="'Choose ' + control.label.toLowerCase()"
                    (selectionChange)="onSelectChange(control.property, $event)"
                  />
                }

                @case ('text') {
                  <ds-input
                    [value]="getControlValue(control.property) || ''"
                    [disabled]="control.disabled || false"
                    [placeholder]="getTextPlaceholder(control) || ''"
                    [maxLength]="getTextMaxLength(control) || null"
                    (valueChange)="onInputChange(control.property, $any($event))"
                  />
                }

                @case ('number') {
                  <ds-input
                    type="number"
                    [value]="(getControlValue(control.property) || '').toString()"
                    [disabled]="control.disabled || false"
                    [placeholder]="getNumberPlaceholder(control) || ''"
                    [min]="getNumberMin(control) || null"
                    [max]="getNumberMax(control) || null"
                    [step]="getNumberStep(control) || null"
                    (valueChange)="onInputNumberChange(control.property, $any($event))"
                  />
                }

                @case ('checkbox') {
                  <ds-checkbox
                    [label]="control.label"
                    [value]="getControlValue(control.property) || false"
                    [disabled]="control.disabled || false"
                    [helperText]="control.helpText || ''"
                    (checkedChange)="onCheckboxChange(control.property, $event)"
                  />
                }

                @case ('radio') {
                  @for (option of getRadioOptions(control); track option.value) {
                    <ds-checkbox
                      [label]="option.label"
                      [value]="getControlValue(control.property) === option.value"
                      [disabled]="control.disabled || option.disabled || false"
                      (checkedChange)="onRadioOptionChange(control.property, option.value, $event)"
                    />
                  }
                }

                @case ('textarea') {
                  <textarea
                    class="control-textarea"
                    [disabled]="control.disabled"
                    [placeholder]="getTextareaPlaceholder(control)"
                    [rows]="getTextareaRows(control)"
                    [maxLength]="getTextareaMaxLength(control)"
                    [value]="getControlValue(control.property)"
                    (input)="onTextareaChange(control.property, $event)"
                  ></textarea>
                }

                @case ('color') {
                  <input
                    type="color"
                    class="control-color"
                    [disabled]="control.disabled"
                    [value]="getControlValue(control.property)"
                    (input)="onColorChange(control.property, $event)"
                  />
                }

                @case ('range') {
                  <input
                    type="range"
                    class="control-range"
                    [disabled]="control.disabled"
                    [min]="getRangeMin(control)"
                    [max]="getRangeMax(control)"
                    [step]="getRangeStep(control)"
                    [value]="getControlValue(control.property)"
                    (input)="onRangeChange(control.property, $event)"
                  />
                }
              }

              @if (control.helpText && control.type !== 'checkbox') {
                <small class="control-help">{{ control.helpText }}</small>
              }
            </div>
          }
        </div>

        <!-- Preview Area -->
        <div class="interactive-preview">
          <ng-content />
        </div>

        <!-- Configuration Output -->
        @if (config().showOutput && lastAction()) {
          <div class="showcase-output"><strong>Last Action:</strong> {{ lastAction() }}</div>
        }
      </div>
    </section>
  `,
  styleUrl: './interactive-example.component.scss',
})
export class InteractiveExampleComponent<T extends Record<string, any> = any> {
  // =============================================================================
  // INPUTS & OUTPUTS
  // =============================================================================

  /** Configuration for the interactive example */
  config = input.required<InteractiveExampleConfig>();

  /** Current configuration values */
  currentConfig = input.required<T>();

  /** Last action message to display */
  lastAction = input<string>('');

  /** Emitted when configuration changes */
  configChange = output<InteractiveConfigChangeEvent<T>>();

  // =============================================================================
  // INTERNAL STATE
  // =============================================================================

  private internalConfig = signal<T>({} as T);
  private controlSignals = new Map<string, any>();

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  constructor() {
    // Sync external config changes to internal state
    effect(() => {
      const currentConfigValue = this.currentConfig();
      // Ensure we have proper deep copy and check if values actually changed
      const currentInternal = this.internalConfig();

      // Deep comparison to prevent unnecessary updates
      const configChanged = JSON.stringify(currentConfigValue) !== JSON.stringify(currentInternal);

      if (configChanged) {
        this.internalConfig.set({ ...currentConfigValue });
        // Update individual control signals
        this.updateControlSignals(currentConfigValue);
      }
    });
  }

  private updateControlSignals(config: T): void {
    for (const [key, value] of Object.entries(config)) {
      if (!this.controlSignals.has(key)) {
        this.controlSignals.set(key, signal(value));
      } else {
        this.controlSignals.get(key).set(value);
      }
    }
  }

  // =============================================================================
  // CONTROL VALUE ACCESSORS
  // =============================================================================

  getControlValue(property: string): any {
    return this.internalConfig()[property];
  }

  getControlValueSignal(property: string) {
    if (!this.controlSignals.has(property)) {
      this.controlSignals.set(property, signal(this.internalConfig()[property]));
    }
    return this.controlSignals.get(property);
  }

  setControlValue(property: string, value: any): void {
    const updatedConfig = {
      ...this.internalConfig(),
      [property]: value,
    };
    this.internalConfig.set(updatedConfig);
  }

  // =============================================================================
  // TYPE-SAFE GETTERS FOR CONTROL PROPERTIES
  // =============================================================================

  getSelectOptions(control: InteractiveControl): SelectOption[] {
    const selectControl = control as InteractiveSelectControl;
    return selectControl.options.map(opt => ({
      value: opt.value,
      label: opt.label,
      disabled: opt.disabled || false,
    }));
  }

  getRadioOptions(
    control: InteractiveControl,
  ): Array<{ value: any; label: string; disabled?: boolean }> {
    return (control as InteractiveRadioControl).options || [];
  }

  getTextPlaceholder(control: InteractiveControl): string | undefined {
    return (control as InteractiveTextControl).placeholder;
  }

  getTextMaxLength(control: InteractiveControl): number | undefined {
    return (control as InteractiveTextControl).maxLength;
  }

  getNumberPlaceholder(control: InteractiveControl): string | undefined {
    return (control as InteractiveNumberControl).placeholder;
  }

  getNumberMin(control: InteractiveControl): number | undefined {
    return (control as InteractiveNumberControl).min;
  }

  getNumberMax(control: InteractiveControl): number | undefined {
    return (control as InteractiveNumberControl).max;
  }

  getNumberStep(control: InteractiveControl): number | undefined {
    return (control as InteractiveNumberControl).step;
  }

  getTextareaPlaceholder(control: InteractiveControl): string | undefined {
    return (control as InteractiveTextareaControl).placeholder;
  }

  getTextareaRows(control: InteractiveControl): number | undefined {
    return (control as InteractiveTextareaControl).rows;
  }

  getTextareaMaxLength(control: InteractiveControl): number | undefined {
    return (control as InteractiveTextareaControl).maxLength;
  }

  getRangeMin(control: InteractiveControl): number {
    return (control as InteractiveRangeControl).min;
  }

  getRangeMax(control: InteractiveControl): number {
    return (control as InteractiveRangeControl).max;
  }

  getRangeStep(control: InteractiveControl): number | undefined {
    return (control as InteractiveRangeControl).step;
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  onSelectChange(property: string, event: SelectChangeEvent): void {
    this.updateConfig(property, event.value);
  }

  onInputChange(property: string, event: InputChangeEvent): void {
    this.updateConfig(property, event.value);
  }

  onInputNumberChange(property: string, event: InputChangeEvent): void {
    const numValue = event.value === '' ? null : Number(event.value);
    this.updateConfig(property, numValue);
  }

  onCheckboxChange(property: string, event: CheckboxChangeEvent): void {
    this.updateConfig(property, event.checked);
  }

  onRadioOptionChange(property: string, optionValue: any, event: CheckboxChangeEvent): void {
    if (event.checked) {
      this.updateConfig(property, optionValue);
    }
  }

  onTextareaChange(property: string, event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.updateConfig(property, target.value);
  }

  onColorChange(property: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.updateConfig(property, target.value);
  }

  onRangeChange(property: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const numValue = Number(target.value);
    this.updateConfig(property, numValue);
  }

  private updateConfig(property: string, newValue: any): void {
    const previousValue = this.internalConfig()[property];

    // Update internal config
    const updatedConfig = {
      ...this.internalConfig(),
      [property]: newValue,
    };
    this.internalConfig.set(updatedConfig);

    // Emit change event
    this.configChange.emit({
      config: updatedConfig,
      property,
      value: newValue,
      previousValue,
    });
  }
}
