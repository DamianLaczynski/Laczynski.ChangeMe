import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from './progress-bar.component';

@Component({
  selector: 'app-progress-bar-showcase',
  imports: [ProgressBarComponent, CommonModule],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Progress Bar Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Progress Bar component built with Fluent 2 Design System.
        Supports determinate and indeterminate progress with multiple states and sizes.
      </p>

      <!-- Determinate Progress - Default State -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Determinate Progress - Default State</h2>
        <div class="showcase__grid showcase__grid--vertical">
          <div class="showcase__item">
            <span class="showcase__label">Medium (0%)</span>
            <app-progress-bar
              type="determinate"
              size="medium"
              state="default"
              [value]="0"
            ></app-progress-bar>
          </div>
          <div class="showcase__item">
            <span class="showcase__label">Medium (50%)</span>
            <app-progress-bar
              type="determinate"
              size="medium"
              state="default"
              [value]="50"
            ></app-progress-bar>
          </div>
          <div class="showcase__item">
            <span class="showcase__label">Medium (80% - Animated)</span>
            <app-progress-bar
              type="determinate"
              size="medium"
              state="default"
              [value]="animatedProgress"
            ></app-progress-bar>
          </div>
          <div class="showcase__item">
            <span class="showcase__label">Medium (100%)</span>
            <app-progress-bar
              type="determinate"
              size="medium"
              state="default"
              [value]="100"
            ></app-progress-bar>
          </div>
        </div>
      </div>

      <!-- Determinate Progress - Large Size -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Determinate Progress - Large Size</h2>
        <div class="showcase__grid showcase__grid--vertical">
          <div class="showcase__item">
            <span class="showcase__label">Large (0%)</span>
            <app-progress-bar
              type="determinate"
              size="large"
              state="default"
              [value]="0"
            ></app-progress-bar>
          </div>
          <div class="showcase__item">
            <span class="showcase__label">Large (65%)</span>
            <app-progress-bar
              type="determinate"
              size="large"
              state="default"
              [value]="65"
            ></app-progress-bar>
          </div>
          <div class="showcase__item">
            <span class="showcase__label">Large (100%)</span>
            <app-progress-bar
              type="determinate"
              size="large"
              state="default"
              [value]="100"
            ></app-progress-bar>
          </div>
        </div>
      </div>

      <!-- Determinate Progress - Success State -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Determinate Progress - Success State</h2>
        <div class="showcase__grid showcase__grid--vertical">
          <div class="showcase__item">
            <span class="showcase__label">Medium (100% - Success)</span>
            <app-progress-bar
              type="determinate"
              size="medium"
              state="success"
              [value]="100"
            ></app-progress-bar>
          </div>
          <div class="showcase__item">
            <span class="showcase__label">Large (100% - Success)</span>
            <app-progress-bar
              type="determinate"
              size="large"
              state="success"
              [value]="100"
            ></app-progress-bar>
          </div>
        </div>
      </div>

      <!-- Determinate Progress - Error State -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Determinate Progress - Error State</h2>
        <div class="showcase__grid showcase__grid--vertical">
          <div class="showcase__item">
            <span class="showcase__label">Medium (75% - Error)</span>
            <app-progress-bar
              type="determinate"
              size="medium"
              state="error"
              [value]="75"
            ></app-progress-bar>
          </div>
          <div class="showcase__item">
            <span class="showcase__label">Medium (100% - Error)</span>
            <app-progress-bar
              type="determinate"
              size="medium"
              state="error"
              [value]="100"
            ></app-progress-bar>
          </div>
          <div class="showcase__item">
            <span class="showcase__label">Large (100% - Error)</span>
            <app-progress-bar
              type="determinate"
              size="large"
              state="error"
              [value]="100"
            ></app-progress-bar>
          </div>
        </div>
      </div>

      <!-- Determinate Progress - Warning State -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Determinate Progress - Warning State</h2>
        <div class="showcase__grid showcase__grid--vertical">
          <div class="showcase__item">
            <span class="showcase__label">Medium (90% - Warning)</span>
            <app-progress-bar
              type="determinate"
              size="medium"
              state="warning"
              [value]="90"
            ></app-progress-bar>
          </div>
          <div class="showcase__item">
            <span class="showcase__label">Medium (100% - Warning)</span>
            <app-progress-bar
              type="determinate"
              size="medium"
              state="warning"
              [value]="100"
            ></app-progress-bar>
          </div>
          <div class="showcase__item">
            <span class="showcase__label">Large (100% - Warning)</span>
            <app-progress-bar
              type="determinate"
              size="large"
              state="warning"
              [value]="100"
            ></app-progress-bar>
          </div>
        </div>
      </div>

      <!-- Indeterminate Progress -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Indeterminate Progress</h2>
        <div class="showcase__grid showcase__grid--vertical">
          <div class="showcase__item">
            <span class="showcase__label">Medium - Indeterminate</span>
            <app-progress-bar
              type="indeterminate"
              size="medium"
              state="default"
            ></app-progress-bar>
          </div>
          <div class="showcase__item">
            <span class="showcase__label">Large - Indeterminate</span>
            <app-progress-bar
              type="indeterminate"
              size="large"
              state="default"
            ></app-progress-bar>
          </div>
        </div>
      </div>

      <!-- Real-world Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Real-world Examples</h2>
        <div class="showcase__grid showcase__grid--vertical">
          <div class="showcase__item">
            <span class="showcase__label">File Upload ({{ fileUploadProgress }}%)</span>
            <app-progress-bar
              type="determinate"
              size="medium"
              state="default"
              [value]="fileUploadProgress"
              ariaLabel="File upload progress"
              [ariaValueText]="'Uploading file: ' + fileUploadProgress + '%'"
            ></app-progress-bar>
          </div>
          <div class="showcase__item">
            <span class="showcase__label">Processing (Indeterminate)</span>
            <app-progress-bar
              type="indeterminate"
              size="medium"
              state="default"
              ariaLabel="Processing your request"
            ></app-progress-bar>
          </div>
          <div class="showcase__item">
            <span class="showcase__label">Download Complete</span>
            <app-progress-bar
              type="determinate"
              size="large"
              state="success"
              [value]="100"
              ariaLabel="Download complete"
              ariaValueText="Download completed successfully"
            ></app-progress-bar>
          </div>
          <div class="showcase__item">
            <span class="showcase__label">Upload Failed</span>
            <app-progress-bar
              type="determinate"
              size="medium"
              state="error"
              [value]="45"
              ariaLabel="Upload failed"
              ariaValueText="Upload failed at 45%"
            ></app-progress-bar>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProgressBarShowcaseComponent implements OnInit, OnDestroy {
  animatedProgress = 0;
  fileUploadProgress = 0;
  private intervalId: any;

  ngOnInit(): void {
    // Animate progress bars
    this.intervalId = setInterval(() => {
      this.animatedProgress = (this.animatedProgress + 1) % 101;
      this.fileUploadProgress = (this.fileUploadProgress + 2) % 101;
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

