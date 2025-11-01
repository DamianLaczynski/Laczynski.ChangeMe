import { Component, signal } from '@angular/core';
import { StepperComponent, Step } from './stepper.component';
import { ButtonComponent } from '../../button/button.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-stepper-showcase',

  imports: [StepperComponent, ButtonComponent, FormsModule, JsonPipe],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Stepper Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Stepper component built with Fluent 2 Design System. A step
        indicator component for multi-step processes, forms, and workflows.
      </p>

      <!-- Basic Horizontal Stepper -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Horizontal Stepper</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-stepper
              [steps]="basicSteps()"
              [activeStepIndex]="activeStep1()"
              (stepChange)="onStepChange($event, 1)"
            />
            <div class="showcase__controls">
              <app-button
                variant="secondary"
                (click)="previousStep(1)"
                [disabled]="activeStep1() === 0"
              >
                Previous
              </app-button>
              <app-button
                variant="primary"
                (click)="nextStep(1)"
                [disabled]="activeStep1() === basicSteps().length - 1"
              >
                Next
              </app-button>
              <app-button variant="outline" (click)="resetStepper(1)">Reset</app-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Vertical Stepper -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Vertical Stepper</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-stepper
              [steps]="verticalSteps()"
              [activeStepIndex]="activeStep2()"
              orientation="vertical"
              [showDescriptions]="true"
              (stepChange)="onStepChange($event, 2)"
            />
            <div class="showcase__controls">
              <app-button
                variant="secondary"
                (click)="previousStep(2)"
                [disabled]="activeStep2() === 0"
              >
                Previous
              </app-button>
              <app-button
                variant="primary"
                (click)="nextStep(2)"
                [disabled]="activeStep2() === verticalSteps().length - 1"
              >
                Next
              </app-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h4>Small</h4>
            <app-stepper [steps]="sizeSteps()" size="small" />
          </div>
          <div class="showcase__item">
            <h4>Medium (Default)</h4>
            <app-stepper [steps]="sizeSteps()" size="medium" />
          </div>
          <div class="showcase__item">
            <h4>Large</h4>
            <app-stepper [steps]="sizeSteps()" size="large" />
          </div>
        </div>
      </div>

      <!-- Linear Mode -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Linear Mode</h2>
        <p class="showcase__description">
          Linear mode prevents users from skipping steps. Steps must be completed in order.
        </p>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-stepper
              [steps]="linearSteps()"
              [activeStepIndex]="activeStep3()"
              [linear]="true"
              [clickable]="true"
              (stepChange)="onStepChange($event, 3)"
            />
            <div class="showcase__controls">
              <app-button
                variant="subtle"
                (click)="previousStep(3)"
                [disabled]="activeStep3() === 0"
              >
                Previous
              </app-button>
              <app-button
                variant="primary"
                (click)="completeAndNext(3)"
                [disabled]="activeStep3() === linearSteps().length - 1"
              >
                Complete & Next
              </app-button>
              <app-button variant="outline" (click)="resetLinearStepper()">Reset</app-button>
            </div>
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">State Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-stepper [steps]="stateSteps()" />
          </div>
        </div>
      </div>

      <!-- Without Labels -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Without Labels (Compact)</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-stepper
              [steps]="basicSteps()"
              [showLabels]="false"
              [activeStepIndex]="activeStep4()"
              (stepChange)="onStepChange($event, 4)"
            />
          </div>
        </div>
      </div>

      <!-- Non-clickable Stepper -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Non-clickable (Display Only)</h2>
        <p class="showcase__description">
          Steps cannot be clicked - useful for progress indication only.
        </p>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-stepper [steps]="basicSteps()" [clickable]="false" [activeStepIndex]="2" />
          </div>
        </div>
      </div>

      <!-- Interactive Demo -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive Demo</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <form class="showcase__form">
              <app-stepper
                [steps]="demoSteps()"
                [activeStepIndex]="demoActiveStep()"
                [linear]="true"
                [clickable]="true"
                (stepChange)="onDemoStepChange($event)"
              />
              <div class="showcase__form-output">
                <strong>Demo Progress:</strong>
                <pre>{{ demoData | json }}</pre>
              </div>
              <div class="showcase__controls">
                <app-button
                  variant="secondary"
                  (click)="demoPreviousStep()"
                  [disabled]="demoActiveStep() === 0"
                >
                  Previous
                </app-button>
                <app-button
                  variant="primary"
                  (click)="demoCompleteAndNext()"
                  [disabled]="demoActiveStep() === demoSteps().length - 1"
                >
                  Complete & Next
                </app-button>
                <app-button variant="outline" (click)="demoReset()">Reset Demo</app-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class StepperShowcaseComponent {
  // Active step indices for different examples
  activeStep1 = signal<number>(0);
  activeStep2 = signal<number>(0);
  activeStep3 = signal<number>(0);
  activeStep4 = signal<number>(0);

  // Demo active step
  demoActiveStep = signal<number>(0);

  // Demo progress data
  demoData = {
    currentStep: 0,
    totalSteps: 4,
    completedSteps: [] as number[],
    currentStepName: 'Personal Information',
  };

  // Basic steps
  basicSteps = signal<Step[]>([
    {
      id: 1,
      label: 'Personal Info',
      completed: false,
    },
    {
      id: 2,
      label: 'Account Details',
      completed: false,
    },
    {
      id: 3,
      label: 'Verification',
      completed: false,
    },
    {
      id: 4,
      label: 'Complete',
      completed: false,
    },
  ]);

  // Vertical steps with descriptions
  verticalSteps = signal<Step[]>([
    {
      id: 1,
      label: 'Select Campaign Settings',
      description: 'Choose your campaign type and set your budget',
      completed: true,
    },
    {
      id: 2,
      label: 'Create Ad Group',
      description: 'Define your target audience and keywords',
      completed: false,
    },
    {
      id: 3,
      label: 'Create Ads',
      description: 'Design your ad creative and messaging',
      completed: false,
    },
    {
      id: 4,
      label: 'Review & Launch',
      description: 'Review your campaign and launch it',
      completed: false,
    },
  ]);

  // Size demonstration steps
  sizeSteps = signal<Step[]>([
    {
      id: 1,
      label: 'Step 1',
      completed: true,
    },
    {
      id: 2,
      label: 'Step 2',
      completed: false,
    },
    {
      id: 3,
      label: 'Step 3',
      completed: false,
    },
  ]);

  // Linear mode steps
  linearSteps = signal<Step[]>([
    {
      id: 1,
      label: 'Basic Information',
      completed: false,
    },
    {
      id: 2,
      label: 'Address Details',
      completed: false,
    },
    {
      id: 3,
      label: 'Payment Method',
      completed: false,
    },
    {
      id: 4,
      label: 'Confirmation',
      completed: false,
    },
  ]);

  // State variants
  stateSteps = signal<Step[]>([
    {
      id: 1,
      label: 'Completed',
      completed: true,
    },
    {
      id: 2,
      label: 'Active',
      completed: false,
    },
    {
      id: 3,
      label: 'Error',
      error: true,
      completed: false,
    },
    {
      id: 4,
      label: 'Warning',
      warning: true,
      completed: false,
    },
    {
      id: 5,
      label: 'Disabled',
      disabled: true,
      completed: false,
    },
  ]);

  // Demo steps for interactive form
  demoSteps = signal<Step[]>([
    {
      id: 1,
      label: 'Personal Information',
      description: 'Enter your basic details',
      completed: false,
    },
    {
      id: 2,
      label: 'Address Details',
      description: 'Provide your address information',
      completed: false,
    },
    {
      id: 3,
      label: 'Review & Confirm',
      description: 'Review your information before submission',
      completed: false,
    },
    {
      id: 4,
      label: 'Complete',
      description: 'Your registration is complete',
      completed: false,
    },
  ]);

  onStepChange(event: { step: Step; index: number }, stepperIndex: number): void {
    console.log('Step changed:', event);

    switch (stepperIndex) {
      case 1:
        this.activeStep1.set(event.index);
        break;
      case 2:
        this.activeStep2.set(event.index);
        break;
      case 3:
        this.activeStep3.set(event.index);
        break;
      case 4:
        this.activeStep4.set(event.index);
        break;
    }
  }

  nextStep(stepperIndex: number): void {
    switch (stepperIndex) {
      case 1:
        if (this.activeStep1() < this.basicSteps().length - 1) {
          const newIndex = this.activeStep1() + 1;
          this.activeStep1.set(newIndex);
          // Mark previous step as completed
          const steps = [...this.basicSteps()];
          steps[this.activeStep1() - 1].completed = true;
          this.basicSteps.set(steps);
        }
        break;
      case 2:
        if (this.activeStep2() < this.verticalSteps().length - 1) {
          const newIndex = this.activeStep2() + 1;
          this.activeStep2.set(newIndex);
          // Mark previous step as completed
          const steps = [...this.verticalSteps()];
          steps[this.activeStep2() - 1].completed = true;
          this.verticalSteps.set(steps);
        }
        break;
      case 3:
        if (this.activeStep3() < this.linearSteps().length - 1) {
          this.activeStep3.set(this.activeStep3() + 1);
        }
        break;
    }
  }

  previousStep(stepperIndex: number): void {
    switch (stepperIndex) {
      case 1:
        if (this.activeStep1() > 0) {
          this.activeStep1.set(this.activeStep1() - 1);
        }
        break;
      case 2:
        if (this.activeStep2() > 0) {
          this.activeStep2.set(this.activeStep2() - 1);
        }
        break;
      case 3:
        if (this.activeStep3() > 0) {
          this.activeStep3.set(this.activeStep3() - 1);
        }
        break;
    }
  }

  completeAndNext(stepperIndex: number): void {
    if (stepperIndex === 3) {
      const steps = [...this.linearSteps()];
      const currentIndex = this.activeStep3();

      // Mark current step as completed
      steps[currentIndex].completed = true;
      this.linearSteps.set(steps);

      // Move to next step if not last
      if (currentIndex < steps.length - 1) {
        this.activeStep3.set(currentIndex + 1);
      }
    }
  }

  resetStepper(stepperIndex: number): void {
    switch (stepperIndex) {
      case 1:
        this.activeStep1.set(0);
        const basicSteps = this.basicSteps().map(step => ({ ...step, completed: false }));
        this.basicSteps.set(basicSteps);
        break;
      case 2:
        this.activeStep2.set(0);
        const verticalSteps = this.verticalSteps().map(step => ({ ...step, completed: false }));
        this.verticalSteps.set(verticalSteps);
        break;
    }
  }

  resetLinearStepper(): void {
    this.activeStep3.set(0);
    const linearSteps = this.linearSteps().map(step => ({ ...step, completed: false }));
    this.linearSteps.set(linearSteps);
  }

  onDemoStepChange(event: { step: Step; index: number }): void {
    this.demoActiveStep.set(event.index);
    this.updateDemoData(event.index);
  }

  demoPreviousStep(): void {
    if (this.demoActiveStep() > 0) {
      const newIndex = this.demoActiveStep() - 1;
      this.demoActiveStep.set(newIndex);
      this.updateDemoData(newIndex);
    }
  }

  demoCompleteAndNext(): void {
    const steps = [...this.demoSteps()];
    const currentIndex = this.demoActiveStep();

    // Mark current step as completed
    steps[currentIndex].completed = true;
    this.demoSteps.set(steps);

    // Move to next step if not last
    if (currentIndex < steps.length - 1) {
      const newIndex = currentIndex + 1;
      this.demoActiveStep.set(newIndex);
      this.updateDemoData(newIndex);
    }
  }

  demoReset(): void {
    this.demoActiveStep.set(0);
    const demoSteps = this.demoSteps().map(step => ({ ...step, completed: false }));
    this.demoSteps.set(demoSteps);
    this.updateDemoData(0);
  }

  private updateDemoData(stepIndex: number): void {
    const stepNames = ['Personal Information', 'Address Details', 'Review & Confirm', 'Complete'];
    this.demoData = {
      currentStep: stepIndex,
      totalSteps: 4,
      completedSteps: Array.from({ length: stepIndex }, (_, i) => i),
      currentStepName: stepNames[stepIndex] || 'Unknown',
    };
  }
}
