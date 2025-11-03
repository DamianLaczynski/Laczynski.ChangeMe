import {
  Component,
  forwardRef,
  input,
  signal,
  computed,
  ElementRef,
  ViewChild,
  HostListener,
  effect,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FieldComponent } from '../field/field.component';
import { ActionButtonComponent } from '../action-button.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { CalendarComponent, CalendarDay, CalendarView } from '@shared/components/calendar';
import { TimeComponent } from '@shared/components/time';

export type DateFieldType = 'date' | 'datetime-local' | 'time' | 'month' | 'week';

interface CalendarWeek {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  year: number;
  isSelected: boolean;
}

interface CalendarYear {
  year: number;
  isSelected: boolean;
}

@Component({
  selector: 'app-date',

  imports: [CommonModule, FieldComponent, ActionButtonComponent, IconComponent, CalendarComponent, TimeComponent],
  templateUrl: './date.component.html',
  host: {
    '[style.position]': '"relative"',
    '[style.display]': '"block"',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateComponent),
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
export class DateComponent extends FieldComponent {
  dateType = input<DateFieldType>('date');
  min = input<string>('');
  max = input<string>('');
  step = input<number | string>('');

  isExpanded = signal<boolean>(false);
  currentMonth = signal<Date>(new Date());
  selectedDate = signal<Date | null>(null);
  selectedTime = signal<string>('');
  use24HourFormat = signal<boolean>(true);
  calendarView = signal<CalendarView>('days');
  selectedWeek = signal<number | null>(null);
  selectedYear = signal<number | null>(null);

  @ViewChild('datePanel') datePanel?: ElementRef;

  // Computed properties
  displayText = computed(() => {
    const date = this.selectedDate();
    const time = this.selectedTime();
    const type = this.dateType();

    if (!date && !time) {
      return this.placeholder() || 'Select date...';
    }

    if (type === 'time') {
      return time || '';
    }

    if (type === 'month') {
      return date ? this.formatMonth(date) : '';
    }

    if (type === 'week') {
      return date ? this.formatWeek(date) : '';
    }

    if (type === 'datetime-local') {
      return date && time ? `${this.formatDate(date)} ${time}` : '';
    }

    return date ? this.formatDate(date) : '';
  });

  calendarWeeks = computed(() => {
    return this.generateCalendarWeeks();
  });

  constructor(private elementRef: ElementRef) {
    super();

    // Effect to update field value when selection changes
    effect(() => {
      const date = this.selectedDate();
      const time = this.selectedTime();
      const type = this.dateType();

      if (type === 'time') {
        this.value = time;
      } else if (type === 'datetime-local' && date && time) {
        this.value = `${this.toISODate(date)}T${time}`;
      } else if (date) {
        if (type === 'month') {
          this.value = this.toISOMonth(date);
        } else if (type === 'week') {
          this.value = this.toISOWeek(date);
        } else {
          this.value = this.toISODate(date);
        }
      } else {
        this.value = '';
      }

      this.onChange(this.value);
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isExpanded()) {
      return;
    }

    const target = event.target as HTMLElement;
    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside) {
      this.closePanel();
    }
  }

  togglePanel(): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    if (this.isExpanded()) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  closePanel(): void {
    this.isExpanded.set(false);
  }

  onCalendarDateSelect(day: CalendarDay): void {
    if (day.isDisabled) {
      return;
    }

    this.selectedDate.set(day.date);

    const type = this.dateType();
    if (type === 'date') {
      this.closePanel();
    }
    // For datetime-local, keep panel open to select time
  }

  onCalendarMonthSelect(monthIndex: number): void {
    const newDate = new Date(this.currentMonth());
    newDate.setMonth(monthIndex);

    if (this.dateType() === 'month') {
      this.selectedDate.set(newDate);
      this.closePanel();
    } else {
      // Switch to days view with selected month
      this.currentMonth.set(newDate);
      this.calendarView.set('days');
    }
  }

  onCalendarYearSelect(year: number): void {
    const newDate = new Date(this.currentMonth());
    newDate.setFullYear(year);
    this.currentMonth.set(newDate);
    this.calendarView.set('months');
  }

  selectWeek(week: CalendarWeek): void {
    this.selectedWeek.set(week.weekNumber);
    this.selectedYear.set(week.year);
    this.selectedDate.set(week.startDate);
    this.closePanel();
  }

  onCalendarSwitchToMonthsView(): void {
    this.calendarView.set('months');
  }

  onCalendarSwitchToYearsView(): void {
    this.calendarView.set('years');
  }

  onCalendarSwitchToDaysView(): void {
    this.calendarView.set('days');
  }

  onCalendarPreviousMonth(): void {
    const newMonth = new Date(this.currentMonth());
    newMonth.setMonth(newMonth.getMonth() - 1);
    this.currentMonth.set(newMonth);
  }

  onCalendarNextMonth(): void {
    const newMonth = new Date(this.currentMonth());
    newMonth.setMonth(newMonth.getMonth() + 1);
    this.currentMonth.set(newMonth);
  }

  onCalendarPreviousYear(): void {
    const newMonth = new Date(this.currentMonth());
    newMonth.setFullYear(newMonth.getFullYear() - 1);
    this.currentMonth.set(newMonth);
  }

  onCalendarNextYear(): void {
    const newMonth = new Date(this.currentMonth());
    newMonth.setFullYear(newMonth.getFullYear() + 1);
    this.currentMonth.set(newMonth);
  }

  onCalendarPreviousYearRange(): void {
    const newMonth = new Date(this.currentMonth());
    newMonth.setFullYear(newMonth.getFullYear() - 12);
    this.currentMonth.set(newMonth);
  }

  onCalendarNextYearRange(): void {
    const newMonth = new Date(this.currentMonth());
    newMonth.setFullYear(newMonth.getFullYear() + 12);
    this.currentMonth.set(newMonth);
  }

  goToToday(): void {
    const today = new Date();
    this.currentMonth.set(today);
    this.selectedDate.set(today);
    if (this.dateType() === 'date') {
      this.closePanel();
    }
  }

  onTimeChange(timeStr: string): void {
    this.selectedTime.set(timeStr);
  }

  private generateCalendarWeeks(): CalendarWeek[] {
    const currentYear = this.currentMonth().getFullYear();
    const weeks: CalendarWeek[] = [];

    // Start from first week of the year
    const firstDay = new Date(currentYear, 0, 1);
    const lastDay = new Date(currentYear, 11, 31);

    let currentDate = new Date(firstDay);
    // Adjust to Monday of the first week
    const dayOfWeek = currentDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    currentDate.setDate(currentDate.getDate() + daysToMonday);

    while (currentDate <= lastDay || currentDate.getFullYear() === currentYear) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekNumber = this.getWeekNumber(weekStart);

      const isSelected = this.selectedWeek() === weekNumber && this.selectedYear() === currentYear;

      weeks.push({
        weekNumber,
        startDate: weekStart,
        endDate: weekEnd,
        year: currentYear,
        isSelected,
      });

      currentDate.setDate(currentDate.getDate() + 7);

      // Stop if we've gone past the year
      if (currentDate.getFullYear() > currentYear) {
        break;
      }
    }

    return weeks;
  }

  private generateCalendarYears(): CalendarYear[] {
    const currentYear = this.currentMonth().getFullYear();
    const startYear = Math.floor(currentYear / 12) * 12;
    const years: CalendarYear[] = [];

    for (let i = 0; i < 12; i++) {
      const year = startYear + i;
      years.push({
        year,
        isSelected: this.selectedDate() ? this.selectedDate()!.getFullYear() === year : false,
      });
    }

    return years;
  }


  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  private formatMonth(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  }

  private formatWeek(date: Date): string {
    const week = this.getWeekNumber(date);
    return `Week ${week}, ${date.getFullYear()}`;
  }

  private formatMonthYear(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  }

  private toISODate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toISOMonth(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  private toISOWeek(date: Date): string {
    const week = this.getWeekNumber(date);
    return `${date.getFullYear()}-W${String(week).padStart(2, '0')}`;
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  // Override ControlValueAccessor methods
  override writeValue(value: any): void {
    if (!value) {
      this.selectedDate.set(null);
      this.selectedTime.set('');
      super.writeValue('');
      return;
    }

    const type = this.dateType();

    if (type === 'time') {
      this.selectedTime.set(value);
    } else if (type === 'datetime-local') {
      const [datePart, timePart] = value.split('T');
      this.selectedDate.set(new Date(datePart));
      if (timePart) {
        this.selectedTime.set(timePart);
      }
    } else {
      this.selectedDate.set(new Date(value));
    }

    super.writeValue(value);
  }

  override clear(): void {
    this.selectedDate.set(null);
    this.selectedTime.set('');
    super.clear();
  }

  openPanel(): void {
    this.isExpanded.set(true);
    // Reset to current month or selected month
    if (this.selectedDate()) {
      this.currentMonth.set(new Date(this.selectedDate()!));
    }
    // Reset calendar view based on dateType
    if (this.dateType() === 'week') {
      this.calendarView.set('days'); // Show weeks in days view
    } else if (this.dateType() === 'month') {
      this.calendarView.set('months');
    } else {
      this.calendarView.set('days');
    }
    // Time component will initialize itself from value
  }

  getWeekClasses(week: CalendarWeek): string {
    const classes = ['date-calendar__week'];

    if (week.isSelected) {
      classes.push('date-calendar__week--selected');
    }

    return classes.join(' ');
  }


  getIcon(): string {
    if (this.dateType() === 'date') {
      return 'calendar';
    } else if (this.dateType() === 'month') {
      return 'calendar_month';
    } else if (this.dateType() === 'week') {
      return 'calendar_week_numbers';
    } else if (this.dateType() === 'time') {
      return 'clock';
    } else if (this.dateType() === 'datetime-local') {
      return 'calendar_clock';
    }
    return 'calendar';
  }
}
