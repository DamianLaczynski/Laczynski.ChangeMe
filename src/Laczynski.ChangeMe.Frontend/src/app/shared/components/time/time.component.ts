import {
  Component,
  input,
  output,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-time',
  imports: [CommonModule, IconComponent, ButtonComponent],
  templateUrl: './time.component.html',
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
})
export class TimeComponent {
  // Inputs
  value = input<string>('');
  step = input<number | string>('');
  size = input<'small' | 'medium' | 'large'>('medium');
  use24HourFormat = input<boolean>(true);
  inline = input<boolean>(false);
  showLabel = input<boolean>(false);
  label = input<string>('Time');
  disabled = input<boolean>(false);

  // Outputs
  timeChange = output<string>();

  // Internal state
  selectedHour = signal<number>(12);
  selectedMinute = signal<number>(0);

  constructor() {
    // Initialize from value if provided
    const initialValue = this.value();
    if (initialValue) {
      const parsed = this.parseTimeString(initialValue);
      this.selectedHour.set(parsed.hour);
      this.selectedMinute.set(parsed.minute);
    } else {
      // Default to current time if no value
      const now = new Date();
      this.selectedHour.set(now.getHours());
      this.selectedMinute.set(now.getMinutes());
    }

    // Update when value changes from outside
    effect(() => {
      const timeValue = this.value();
      if (timeValue) {
        const parsed = this.parseTimeString(timeValue);
        const currentHour = this.selectedHour();
        const currentMinute = this.selectedMinute();
        // Only update if different to avoid loops
        if (currentHour !== parsed.hour || currentMinute !== parsed.minute) {
          this.selectedHour.set(parsed.hour);
          this.selectedMinute.set(parsed.minute);
        }
      }
    });

    // Emit time change when hour or minute changes (but skip during initialization)
    let isInitialized = false;
    effect(() => {
      if (!isInitialized) {
        isInitialized = true;
        return;
      }
      const hour = this.selectedHour();
      const minute = this.selectedMinute();
      const timeStr = this.formatTime(hour, minute);
      this.timeChange.emit(timeStr);
    });
  }

  incrementHour(): void {
    if (this.disabled()) return;

    const currentHour = this.selectedHour();
    const maxHour = this.use24HourFormat() ? 23 : 12;
    const minHour = this.use24HourFormat() ? 0 : 1;

    if (currentHour >= maxHour) {
      this.selectedHour.set(minHour);
    } else {
      this.selectedHour.set(currentHour + 1);
    }
  }

  decrementHour(): void {
    if (this.disabled()) return;

    const currentHour = this.selectedHour();
    const maxHour = this.use24HourFormat() ? 23 : 12;
    const minHour = this.use24HourFormat() ? 0 : 1;

    if (currentHour <= minHour) {
      this.selectedHour.set(maxHour);
    } else {
      this.selectedHour.set(currentHour - 1);
    }
  }

  incrementMinute(): void {
    if (this.disabled()) return;

    const currentMinute = this.selectedMinute();
    const step = this.getMinuteStep();

    if (currentMinute + step >= 60) {
      this.selectedMinute.set(0);
      this.incrementHour();
    } else {
      this.selectedMinute.set(currentMinute + step);
    }
  }

  decrementMinute(): void {
    if (this.disabled()) return;

    const currentMinute = this.selectedMinute();
    const step = this.getMinuteStep();

    if (currentMinute - step < 0) {
      this.selectedMinute.set(60 - step);
      this.decrementHour();
    } else {
      this.selectedMinute.set(currentMinute - step);
    }
  }

  onHourInput(event: Event): void {
    if (this.disabled()) return;

    const target = event.target as HTMLInputElement;
    let hour = parseInt(target.value) || 0;

    if (this.use24HourFormat()) {
      hour = Math.max(0, Math.min(23, hour));
    } else {
      hour = Math.max(1, Math.min(12, hour));
    }

    this.selectedHour.set(hour);
  }

  onMinuteInput(event: Event): void {
    if (this.disabled()) return;

    const target = event.target as HTMLInputElement;
    let minute = parseInt(target.value) || 0;
    minute = Math.max(0, Math.min(59, minute));

    this.selectedMinute.set(minute);
  }


  private formatTime(hour: number, minute: number): string {
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  private getMinuteStep(): number {
    const step = this.step();
    if (!step) return 1;

    const stepNum = typeof step === 'string' ? parseInt(step) : step;
    // Convert seconds to minutes if step is in seconds
    return Math.max(1, Math.floor(stepNum / 60)) || 1;
  }

  private parseTimeString(timeStr: string): { hour: number; minute: number } {
    const [hourStr, minuteStr] = timeStr.split(':');
    return {
      hour: parseInt(hourStr) || 0,
      minute: parseInt(minuteStr) || 0,
    };
  }
}

