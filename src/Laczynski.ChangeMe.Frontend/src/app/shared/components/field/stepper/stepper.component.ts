import { Component, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Size, StateType } from '../../utils';
import { IconComponent } from '@shared/components/icon/icon.component';

export type StepOrientation = 'horizontal' | 'vertical';
export type StepIndicatorType = 'numeric' | 'icon';

export interface Step {
  id: string | number;
  label: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  completed?: boolean;
  error?: boolean;
  warning?: boolean;
}

@Component({
  selector: 'app-stepper',

  imports: [CommonModule, IconComponent],
  templateUrl: './stepper.component.html',
})
export class StepperComponent {
  // Inputs
  steps = input.required<Step[]>();
  activeStepIndex = input<number>(0);
  orientation = input<StepOrientation>('horizontal');
  indicatorType = input<StepIndicatorType>('numeric');
  size = input<Size>('medium');
  linear = input<boolean>(false); // Linear mode prevents skipping steps
  showLabels = input<boolean>(true);
  showDescriptions = input<boolean>(false);
  clickable = input<boolean>(true);

  // Outputs
  stepChange = output<{ step: Step; index: number }>();
  stepClick = output<{ step: Step; index: number }>();

  // Internal state
  currentStepIndex = signal<number>(0);

  // Computed properties
  currentStep = computed(() => {
    const steps = this.steps();
    const index = this.currentStepIndex();
    return steps[index] || null;
  });

  stepperClasses = computed(() => {
    const classes = ['stepper'];
    classes.push(`stepper--${this.orientation()}`);
    classes.push(`stepper--${this.size()}`);
    classes.push(`stepper--${this.indicatorType()}`);

    if (this.linear()) {
      classes.push('stepper--linear');
    }

    return classes.join(' ');
  });

  constructor() {
    // Sync external activeStepIndex with internal state
    effect(() => {
      const newIndex = this.activeStepIndex();
      if (newIndex >= 0 && newIndex < this.steps().length) {
        this.currentStepIndex.set(newIndex);
      }
    });
  }

  onStepClick(step: Step, index: number): void {
    if (!this.clickable()) {
      return;
    }

    if (step.disabled) {
      return;
    }

    // Linear mode: only allow going to completed steps or the next step
    if (this.linear()) {
      const canNavigate = this.canNavigateToStep(index);
      if (!canNavigate) {
        return;
      }
    }

    this.currentStepIndex.set(index);
    this.stepClick.emit({ step, index });
    this.stepChange.emit({ step, index });
  }

  canNavigateToStep(targetIndex: number): boolean {
    const currentIndex = this.currentStepIndex();
    const steps = this.steps();

    // Can always go to current or previous steps
    if (targetIndex <= currentIndex) {
      return true;
    }

    // In linear mode, can only go to next step if all previous steps are completed
    if (this.linear()) {
      for (let i = 0; i < targetIndex; i++) {
        if (!steps[i].completed) {
          return false;
        }
      }
    }

    return true;
  }

  getStepState(step: Step, index: number): StateType {
    if (step.error) {
      return 'error';
    }
    if (step.warning) {
      return 'warning';
    }
    if (step.completed) {
      return 'success';
    }
    if (index === this.currentStepIndex()) {
      return 'info';
    }
    return 'info';
  }

  getStepClasses(step: Step, index: number): string {
    const classes = ['stepper-step'];
    const currentIndex = this.currentStepIndex();

    classes.push(`stepper-step--${this.size()}`);

    if (index === currentIndex) {
      classes.push('stepper-step--active');
    }

    if (step.completed) {
      classes.push('stepper-step--completed');
    }

    if (step.disabled) {
      classes.push('stepper-step--disabled');
    }

    if (step.error) {
      classes.push('stepper-step--error');
    }

    if (step.warning) {
      classes.push('stepper-step--warning');
    }

    // Visited class only for steps that are before current AND not completed
    if (index < currentIndex && !step.completed) {
      classes.push('stepper-step--visited');
    }

    if (this.clickable() && !step.disabled) {
      classes.push('stepper-step--clickable');
    }

    return classes.join(' ');
  }

  getIndicatorClasses(step: Step, index: number): string {
    const classes = ['stepper-indicator'];
    const currentIndex = this.currentStepIndex();

    classes.push(`stepper-indicator--${this.size()}`);

    if (index === currentIndex) {
      classes.push('stepper-indicator--active');
    }

    if (step.completed) {
      classes.push('stepper-indicator--completed');
    }

    if (step.disabled) {
      classes.push('stepper-indicator--disabled');
    }

    if (step.error) {
      classes.push('stepper-indicator--error');
    }

    if (step.warning) {
      classes.push('stepper-indicator--warning');
    }

    return classes.join(' ');
  }

  getConnectorClasses(index: number): string {
    const classes = ['stepper-connector'];
    const currentIndex = this.currentStepIndex();
    const steps = this.steps();

    classes.push(`stepper-connector--${this.size()}`);

    // Connector is completed if current step is completed
    // This will color the line to the NEXT step
    if (steps[index]?.completed) {
      classes.push('stepper-connector--completed');
    }
    // Connector is active if we've passed this step (but it's not completed)
    else if (index < currentIndex) {
      classes.push('stepper-connector--active');
    }

    return classes.join(' ');
  }

  // Public methods for external control
  nextStep(): void {
    const currentIndex = this.currentStepIndex();
    const steps = this.steps();

    if (currentIndex < steps.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextStep = steps[nextIndex];

      if (!nextStep.disabled) {
        this.currentStepIndex.set(nextIndex);
        this.stepChange.emit({ step: nextStep, index: nextIndex });
      }
    }
  }

  previousStep(): void {
    const currentIndex = this.currentStepIndex();
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevStep = this.steps()[prevIndex];

      if (!prevStep.disabled) {
        this.currentStepIndex.set(prevIndex);
        this.stepChange.emit({ step: prevStep, index: prevIndex });
      }
    }
  }

  goToStep(index: number): void {
    const steps = this.steps();
    if (index >= 0 && index < steps.length) {
      const step = steps[index];

      if (!step.disabled && this.canNavigateToStep(index)) {
        this.currentStepIndex.set(index);
        this.stepChange.emit({ step, index });
      }
    }
  }

  isFirstStep(): boolean {
    return this.currentStepIndex() === 0;
  }

  isLastStep(): boolean {
    return this.currentStepIndex() === this.steps().length - 1;
  }

  reset(): void {
    this.currentStepIndex.set(0);
  }
}
