import { Component, signal } from '@angular/core';
import { ColorComponent, ColorFormat } from './color.component';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-color-showcase',

  imports: [ColorComponent, ReactiveFormsModule, FormsModule, JsonPipe, CommonModule, TableOfContentComponent],
  template: `
    <div class="showcase showcase--responsive showcase__with-toc">
      <app-table-of-content
        [sticky]="true"
        [offsetTop]="20"
        containerSelector=".showcase-content"
        [minLevel]="1"
        [maxLevel]="2"
      />
      <div class="showcase-content">
        <h1 class="showcase__title">Color Picker Component - Fluent 2 Design</h1>

      <section class="showcase__section">
        <h2 class="showcase__section__title">Basic Usage</h2>
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
        <h2 class="showcase__section__title">Color Formats</h2>
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
        <h2 class="showcase__section__title">With Alpha Channel</h2>
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
        <h2 class="showcase__section__title">Without Presets or Eye Dropper</h2>
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
        <h2 class="showcase__section__title">Sizes</h2>
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
        <h2 class="showcase__section__title">Variants</h2>
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
        <h2 class="showcase__section__title">States</h2>
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
        <h2 class="showcase__section__title">Disabled & Read-only</h2>
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
        <h2 class="showcase__section__title">Required Field</h2>
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
        <h2 class="showcase__section__title">Form Integration</h2>
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
        <h2 class="showcase__section__title">Interactive Controls</h2>
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
    </div>
  `,
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
