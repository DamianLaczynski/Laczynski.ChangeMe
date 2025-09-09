import { Component, input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldComponent } from '../field/field.component';

export type DateTimeType =
  | 'datetime'
  | 'datetime-local'
  | 'date'
  | 'time'
  | 'week'
  | 'month';

@Component({
  selector: 'app-date-time',
  imports: [FieldComponent, CommonModule],
  templateUrl: './date-time.component.html',
})
export class DateTimeComponent
  extends FieldComponent
  implements OnInit, OnDestroy
{
  type = input<DateTimeType>('datetime');
  min = input<string>('');
  max = input<string>('');
  step = input<number | string>('');
  timezone = input<string>('local');
  locale = input<string>('en-US');
  showTimezone = input<boolean>(false);
  showRelativeDate = input<boolean>(false);
  allowPast = input<boolean>(true);
  allowFuture = input<boolean>(true);
  formatDisplay = input<boolean>(true);

  formattedValue: string = '';

  getInputType(): string {
    switch (this.type()) {
      case 'date':
        return 'date';
      case 'time':
        return 'time';
      case 'datetime':
        return 'datetime';
      case 'datetime-local':
        return 'datetime-local';
      case 'week':
        return 'week';
      case 'month':
        return 'month';
      default:
        return 'datetime-local';
    }
  }

  getPlaceholder(): string {
    if (this.placeholder()) {
      return this.placeholder();
    }

    switch (this.type()) {
      case 'date':
        return 'YYYY-MM-DD';
      case 'time':
        return 'HH:MM';
      case 'datetime':
        return 'YYYY-MM-DDTHH:MM';
      case 'datetime-local':
        return 'YYYY-MM-DDTHH:MM';
      case 'week':
        return 'YYYY-W##';
      case 'month':
        return 'YYYY-MM';
      default:
        return 'YYYY-MM-DDTHH:MM';
    }
  }

  getMinValue(): string {
    return this.min();
  }

  getMaxValue(): string {
    return this.max();
  }

  getStepValue(): string | number {
    if (this.step()) {
      return this.step();
    }

    // Default step values based on type
    switch (this.type()) {
      case 'time':
        return 60; // 1 minute
      case 'datetime':
      case 'datetime-local':
        return 60; // 1 minute
      case 'date':
        return 1; // 1 day
      case 'week':
        return 1; // 1 week
      case 'month':
        return 1; // 1 month
      default:
        return 1; // 1 day
    }
  }

  private updateFormattedValue(): void {
    if (this.value) {
      this.formattedValue = this.formatValueForInput(this.value);
    } else {
      this.formattedValue = '';
    }
  }

  private formatValueForInput(value: any): string {
    if (!value) return '';

    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'string') {
      date = new Date(value);
    } else if (typeof value === 'number') {
      date = new Date(value);
    } else {
      return '';
    }

    if (isNaN(date.getTime())) {
      return '';
    }

    switch (this.type()) {
      case 'date':
        return this.formatDate(date);
      case 'time':
        return this.formatTime(date);
      case 'datetime':
        return this.formatDateTime(date);
      case 'datetime-local':
        return this.formatDateTimeLocal(date);
      case 'week':
        return this.formatWeek(date);
      case 'month':
        return this.formatMonth(date);
      default:
        return this.formatDateTime(date);
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private formatDateTime(date: Date): string {
    const dateStr = this.formatDate(date);
    const timeStr = this.formatTime(date);
    return `${dateStr}T${timeStr}`;
  }

  private formatDateTimeLocal(date: Date): string {
    const dateStr = this.formatDate(date);
    const timeStr = this.formatTime(date);
    return `${dateStr}T${timeStr}`;
  }

  private formatWeek(date: Date): string {
    const year = date.getFullYear();
    const week = this.getWeekNumber(date);
    return `${year}-W${String(week).padStart(2, '0')}`;
  }

  private formatMonth(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  private parseInputValue(value: string): Date | null {
    if (!value) return null;

    let date: Date;

    switch (this.type()) {
      case 'date':
        // Input format: YYYY-MM-DD
        date = new Date(value + 'T00:00:00');
        break;
      case 'time':
        // Input format: HH:MM
        const today = new Date();
        const [hours, minutes] = value.split(':').map(Number);
        date = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          hours,
          minutes
        );
        break;
      case 'datetime':
        // Input format: YYYY-MM-DDTHH:MM
        date = new Date(value);
        break;
      case 'datetime-local':
        // Input format: YYYY-MM-DDTHH:MM
        date = new Date(value);
        break;
      case 'week':
        // Input format: YYYY-W##
        date = this.parseWeek(value);
        break;
      case 'month':
        // Input format: YYYY-MM
        date = this.parseMonth(value);
        break;
      default:
        // Input format: YYYY-MM-DDTHH:MM
        date = new Date(value);
        break;
    }

    return isNaN(date.getTime()) ? null : date;
  }

  private parseWeek(value: string): Date {
    // Format: YYYY-W##
    const match = value.match(/^(\d{4})-W(\d{2})$/);
    if (!match) return new Date(NaN);

    const year = parseInt(match[1], 10);
    const week = parseInt(match[2], 10);

    // Calculate the first day of the week
    const firstDayOfYear = new Date(year, 0, 1);
    const firstMonday = new Date(firstDayOfYear);
    const dayOfWeek = firstDayOfYear.getDay();
    const daysToAdd = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    firstMonday.setDate(firstDayOfYear.getDate() + daysToAdd);

    // Add weeks
    const targetDate = new Date(firstMonday);
    targetDate.setDate(firstMonday.getDate() + (week - 1) * 7);

    return targetDate;
  }

  private parseMonth(value: string): Date {
    // Format: YYYY-MM
    const match = value.match(/^(\d{4})-(\d{2})$/);
    if (!match) return new Date(NaN);

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // Month is 0-indexed

    return new Date(year, month, 1);
  }

  override onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const inputValue = target.value;

    const parsedDate = this.parseInputValue(inputValue);

    if (parsedDate) {
      this.value = parsedDate;
      this.onChange(this.value);
      this.change.emit(this.value);
    } else if (inputValue === '') {
      this.value = null;
      this.onChange(this.value);
      this.change.emit(this.value);
    }

    this.formattedValue = inputValue;
  }

  override writeValue(value: any): void {
    this.value = value;
    this.updateFormattedValue();
  }

  // Additional helper methods
  getRelativeDate(): string {
    if (!this.value || !this.showRelativeDate()) return '';

    const now = new Date();
    const diff = this.value.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days === -1) return 'Yesterday';
    if (days > 0) return `In ${days} days`;
    if (days < 0) return `${Math.abs(days)} days ago`;

    return '';
  }

  getTimezoneInfo(): string {
    if (!this.showTimezone() || !this.value) return '';

    const timezone = this.timezone();
    if (timezone === 'local') {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    return timezone;
  }

  getFormattedDisplayValue(): string {
    if (!this.value || !this.formatDisplay()) return '';

    const options: Intl.DateTimeFormatOptions = {
      timeZone: this.timezone() === 'local' ? undefined : this.timezone(),
    };

    switch (this.type()) {
      case 'date':
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
        break;
      case 'time':
        options.hour = '2-digit';
        options.minute = '2-digit';
        break;
      case 'datetime':
      case 'datetime-local':
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
        options.hour = '2-digit';
        options.minute = '2-digit';
        break;
      case 'week':
        options.year = 'numeric';
        // Note: week is not supported in all locales
        break;
      case 'month':
        options.year = 'numeric';
        options.month = 'long';
        break;
    }

    return this.value.toLocaleDateString(this.locale(), options);
  }

  isDateValid(): boolean {
    if (!this.value) return true;

    const now = new Date();

    if (!this.allowPast() && this.value < now) return false;
    if (!this.allowFuture() && this.value > now) return false;

    return true;
  }

  getValidationMessage(): string {
    if (!this.value) return '';

    if (!this.allowPast() && this.value < new Date()) {
      return 'Past dates are not allowed';
    }

    if (!this.allowFuture() && this.value > new Date()) {
      return 'Future dates are not allowed';
    }

    return '';
  }

  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
}
