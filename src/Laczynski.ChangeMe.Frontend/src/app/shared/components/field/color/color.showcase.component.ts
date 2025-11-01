import { Component, signal } from '@angular/core';
import { ColorComponent, ColorFormat } from './color.component';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-color-showcase',

  imports: [ColorComponent, ReactiveFormsModule, FormsModule, JsonPipe, CommonModule],
  template: `
    <div class="showcase">
      <h2>Color Picker Component - Fluent 2 Design</h2>

      <section class="showcase__section">
        <h3>Basic Usage</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-color
              label="Pick a color"
              placeholder="Select color"
              [(disabled)]="disabled"
              [(readonly)]="readonly"
            />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>Color Formats</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-color label="HEX Format" [format]="'hex'" [formControl]="hexColorControl" />
          </div>
          <div class="showcase__item">
            <app-color label="RGB Format" [format]="'rgb'" [formControl]="rgbColorControl" />
          </div>
          <div class="showcase__item">
            <app-color label="HSL Format" [format]="'hsl'" [formControl]="hslColorControl" />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>With Alpha Channel</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-color
              label="Color with opacity"
              [format]="'hex'"
              [showAlpha]="true"
              [formControl]="alphaHexControl"
            />
          </div>
          <div class="showcase__item">
            <app-color
              label="RGBA Format"
              [format]="'rgb'"
              [showAlpha]="true"
              [formControl]="alphaRgbControl"
            />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>Without Presets or Eye Dropper</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-color label="No presets" [formControl]="noPresetsControl" />
          </div>
          <div class="showcase__item">
            <app-color
              label="No eye dropper"
              [showEyeDropper]="false"
              [formControl]="noEyeDropperControl"
            />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>Sizes</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-color label="Small" size="small" [formControl]="smallSizeControl" />
          </div>
          <div class="showcase__item">
            <app-color label="Medium" size="medium" [formControl]="mediumSizeControl" />
          </div>
          <div class="showcase__item">
            <app-color label="Large" size="large" [formControl]="largeSizeControl" />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>Variants</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-color label="Filled" variant="filled" [formControl]="filledControl" />
          </div>
          <div class="showcase__item">
            <app-color
              label="Filled Gray"
              variant="filled-gray"
              [formControl]="filledGrayControl"
            />
          </div>
          <div class="showcase__item">
            <app-color label="Underlined" variant="underlined" [formControl]="underlinedControl" />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>States</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-color label="Default" [formControl]="defaultStateControl" />
          </div>
          <div class="showcase__item">
            <app-color
              label="Error State"
              state="error"
              errorText="Invalid color"
              [formControl]="errorStateControl"
            />
          </div>
          <div class="showcase__item">
            <app-color
              label="Warning State"
              state="warning"
              warningText="Color might not be accessible"
              [formControl]="warningStateControl"
            />
          </div>
          <div class="showcase__item">
            <app-color
              label="Success State"
              state="success"
              successText="Valid color"
              [formControl]="successStateControl"
            />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>Disabled & Read-only</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-color label="Disabled" [disabled]="true" [formControl]="disabledControl" />
          </div>
          <div class="showcase__item">
            <app-color label="Read-only" [readonly]="true" [formControl]="readonlyControl" />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>Required Field</h3>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-color
              label="Favorite Color"
              [required]="true"
              helpText="Please select your favorite color"
            />
          </div>
        </div>
      </section>

      <section class="showcase__section">
        <h3>Form Integration</h3>
        <form [formGroup]="colorForm" class="showcase__form">
          <app-color
            label="Brand Primary"
            formControlName="primaryColor"
            helpText="Main brand color"
            [format]="'hex'"
          />
          <app-color
            label="Brand Secondary"
            formControlName="secondaryColor"
            helpText="Secondary brand color"
            [format]="'hex'"
          />
          <app-color
            label="Accent Color"
            formControlName="accentColor"
            helpText="Accent color with opacity"
            [format]="'hex'"
            [showAlpha]="true"
          />

          <div class="showcase__form-output">
            <h4>Form Values:</h4>
            <pre>{{ colorForm.value | json }}</pre>
          </div>
        </form>
      </section>

      <section class="showcase__section">
        <h3>Interactive Controls</h3>
        <div class="showcase__controls">
          <label>
            <input type="checkbox" [(ngModel)]="disabled" [ngModelOptions]="{ standalone: true }" />
            Disabled
          </label>
          <label>
            <input type="checkbox" [(ngModel)]="readonly" [ngModelOptions]="{ standalone: true }" />
            Read-only
          </label>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .showcase {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .showcase h2 {
        margin-bottom: 2rem;
        color: var(--color-neutral-foreground-rest);
      }

      .showcase__section {
        margin-bottom: 3rem;
      }

      .showcase__section h3 {
        margin-bottom: 1.5rem;
        color: var(--color-neutral-foreground2-rest);
        font-weight: 600;
      }

      .showcase__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }

      .showcase__item {
        display: flex;
        flex-direction: column;
      }

      .showcase__form {
        max-width: 500px;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .showcase__form-output {
        margin-top: 1rem;
        padding: 1rem;
        background: var(--color-neutral-background-hover);
        border-radius: 8px;
      }

      .showcase__form-output h4 {
        margin-bottom: 0.5rem;
      }

      .showcase__form-output pre {
        margin: 0;
        font-family: 'Courier New', monospace;
        font-size: 0.875rem;
        white-space: pre-wrap;
      }

      .showcase__controls {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .showcase__controls label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
      }
    `,
  ],
})
export class ColorShowcaseComponent {
  disabled = signal(false);
  readonly = signal(false);

  // Color format controls
  hexColorControl = new FormControl('#3B82F6');
  rgbColorControl = new FormControl('rgb(239, 68, 68)');
  hslColorControl = new FormControl('hsl(142, 71%, 45%)');

  // Alpha channel controls
  alphaHexControl = new FormControl('#FF0000CC');
  alphaRgbControl = new FormControl('rgba(0, 128, 255, 0.5)');

  // Feature controls
  noPresetsControl = new FormControl('#9C27B0');
  noEyeDropperControl = new FormControl('#4CAF50');

  // Size controls
  smallSizeControl = new FormControl('#E91E63');
  mediumSizeControl = new FormControl('#2196F3');
  largeSizeControl = new FormControl('#FF9800');

  // Variant controls
  filledControl = new FormControl('#00BCD4');
  filledGrayControl = new FormControl('#8BC34A');
  underlinedControl = new FormControl('#FFEB3B');

  // State controls
  defaultStateControl = new FormControl('#607D8B');
  errorStateControl = new FormControl('#F44336');
  warningStateControl = new FormControl('#FFC107');
  successStateControl = new FormControl('#4CAF50');

  // Disabled & readonly controls
  disabledControl = new FormControl({ value: '#9E9E9E', disabled: true }, { nonNullable: false });
  readonlyControl = new FormControl('#795548', { nonNullable: false });

  colorForm = new FormGroup({
    primaryColor: new FormControl('#0078D4'),
    secondaryColor: new FormControl('#107C10'),
    accentColor: new FormControl('#881798CC'),
  });
}
