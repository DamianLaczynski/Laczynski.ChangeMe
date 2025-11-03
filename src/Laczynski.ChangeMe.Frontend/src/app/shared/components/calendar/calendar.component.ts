import {
  Component,
  input,
  output,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';

export type CalendarView = 'days' | 'months' | 'years';

export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isInRange?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  isDisabled: boolean;
}

export interface CalendarMonth {
  name: string;
  index: number;
  isSelected: boolean;
}

export interface CalendarYear {
  year: number;
  isSelected: boolean;
}

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, IconComponent, ButtonComponent],
  templateUrl: './calendar.component.html',
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
})
export class CalendarComponent {
  // Inputs
  currentMonth = input.required<Date>();
  selectedDate = input<Date | null>(null);
  startDate = input<Date | null>(null);
  endDate = input<Date | null>(null);
  hoveredDate = input<Date | null>(null);
  calendarView = input.required<CalendarView>();
  min = input<string>('');
  max = input<string>('');
  size = input<'small' | 'medium' | 'large'>('medium');
  showMonthYearPicker = input<boolean>(true);
  isDayInHoverRangeFn = input<(day: CalendarDay) => boolean>();
  
  // Outputs
  dateSelect = output<CalendarDay>();
  monthSelect = output<number>();
  yearSelect = output<number>();
  previousMonth = output<void>();
  nextMonth = output<void>();
  previousYear = output<void>();
  nextYear = output<void>();
  previousYearRange = output<void>();
  nextYearRange = output<void>();
  switchToMonthsView = output<void>();
  switchToYearsView = output<void>();
  switchToDaysView = output<void>();
  dateHover = output<CalendarDay>();
  dateLeave = output<void>();
  isDayInHoverRange = output<(day: CalendarDay) => boolean>();

  weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  monthYearText = computed(() => {
    const month = this.currentMonth();
    return month.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  });

  calendarDays = computed(() => {
    return this.generateCalendarDays();
  });

  calendarMonths = computed(() => {
    return this.generateCalendarMonths();
  });

  calendarYears = computed(() => {
    return this.generateCalendarYears();
  });

  getYearRangeText(): string {
    const years = this.calendarYears();
    if (years.length === 0) return '';
    return `${years[0].year} - ${years[years.length - 1].year}`;
  }

  private generateCalendarDays(): CalendarDay[] {
    const month = this.currentMonth();
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    const firstDayOfMonth = new Date(year, monthIndex, 1);
    const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    // We want Monday as first day, so adjust
    let firstDayWeekday = firstDayOfMonth.getDay();
    firstDayWeekday = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = this.selectedDate();
    const start = this.startDate();
    const end = this.endDate();
    const hovered = this.hoveredDate();

    const selectedDateOnly = selected
      ? new Date(selected.getFullYear(), selected.getMonth(), selected.getDate())
      : null;
    const startDateOnly = start
      ? new Date(start.getFullYear(), start.getMonth(), start.getDate())
      : null;
    const endDateOnly = end
      ? new Date(end.getFullYear(), end.getMonth(), end.getDate())
      : null;
    const hoveredDateOnly = hovered
      ? new Date(hovered.getFullYear(), hovered.getMonth(), hovered.getDate())
      : null;

    // Add days from previous month
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const date = new Date(year, monthIndex, -i);
      days.push(this.createCalendarDay(date, false, today, selectedDateOnly, startDateOnly, endDateOnly, hoveredDateOnly));
    }

    // Add days of current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, monthIndex, day);
      days.push(this.createCalendarDay(date, true, today, selectedDateOnly, startDateOnly, endDateOnly, hoveredDateOnly));
    }

    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, monthIndex + 1, day);
      days.push(this.createCalendarDay(date, false, today, selectedDateOnly, startDateOnly, endDateOnly, hoveredDateOnly));
    }

    return days;
  }

  private createCalendarDay(
    date: Date,
    isCurrentMonth: boolean,
    today: Date,
    selected: Date | null,
    start: Date | null,
    end: Date | null,
    hovered: Date | null,
  ): CalendarDay {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // Determine selection state
    let isSelected = false;
    let isRangeStart = false;
    let isRangeEnd = false;
    let isInRange = false;

    if (selected && this.isSameDay(dateOnly, selected)) {
      isSelected = true;
    }

    if (start && this.isSameDay(dateOnly, start)) {
      isSelected = true;
      isRangeStart = true;
    }

    if (end && this.isSameDay(dateOnly, end)) {
      isSelected = true;
      isRangeEnd = true;
    }

    // Only calculate confirmed range (start to end)
    if (start && end) {
      isInRange = dateOnly > start && dateOnly < end;
    }

    const isDisabled = this.isDateDisabled(dateOnly);

    return {
      date: dateOnly,
      day: date.getDate(),
      isCurrentMonth,
      isToday: this.isSameDay(dateOnly, today),
      isSelected,
      isInRange,
      isRangeStart,
      isRangeEnd,
      isDisabled,
    };
  }

  private generateCalendarMonths(): CalendarMonth[] {
    const currentYear = this.currentMonth().getFullYear();
    const selected = this.selectedDate();
    const start = this.startDate();
    const end = this.endDate();

    return this.months.map((month, index) => {
      let isSelected = false;

      if (selected && selected.getFullYear() === currentYear && selected.getMonth() === index) {
        isSelected = true;
      }

      if (start && start.getFullYear() === currentYear && start.getMonth() === index) {
        isSelected = true;
      }

      if (end && end.getFullYear() === currentYear && end.getMonth() === index) {
        isSelected = true;
      }

      return {
        name: month.substring(0, 3),
        index,
        isSelected,
      };
    });
  }

  private generateCalendarYears(): CalendarYear[] {
    const currentYear = this.currentMonth().getFullYear();
    const startYear = Math.floor(currentYear / 12) * 12;
    const years: CalendarYear[] = [];

    const selected = this.selectedDate();
    const start = this.startDate();
    const end = this.endDate();

    for (let i = 0; i < 12; i++) {
      const year = startYear + i;
      let isSelected = false;

      if (selected && selected.getFullYear() === year) {
        isSelected = true;
      }

      if (start && start.getFullYear() === year) {
        isSelected = true;
      }

      if (end && end.getFullYear() === year) {
        isSelected = true;
      }

      years.push({
        year,
        isSelected,
      });
    }

    return years;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private isDateDisabled(date: Date): boolean {
    const dateStr = this.toISODate(date);

    if (this.min() && dateStr < this.min()) {
      return true;
    }

    if (this.max() && dateStr > this.max()) {
      return true;
    }

    return false;
  }

  private toISODate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getDayClasses(day: CalendarDay): string {
    const classes = ['calendar__day'];

    if (!day.isCurrentMonth) {
      classes.push('calendar__day--other-month');
    }

    if (day.isToday) {
      classes.push('calendar__day--today');
    }

    if (day.isRangeStart) {
      classes.push('calendar__day--range-start');
    }

    if (day.isRangeEnd) {
      classes.push('calendar__day--range-end');
    }

    // Check both confirmed range and hover preview range
    const hoverFn = this.isDayInHoverRangeFn();
    const isInHoverRange = hoverFn ? hoverFn(day) : false;
    if (day.isInRange || isInHoverRange) {
      classes.push('calendar__day--in-range');
    }

    if (day.isSelected) {
      classes.push('calendar__day--selected');
    }

    if (day.isDisabled) {
      classes.push('calendar__day--disabled');
    }

    classes.push(`calendar__day--${this.size()}`);

    return classes.join(' ');
  }

  getMonthClasses(month: CalendarMonth): string {
    const classes = ['calendar__month'];

    if (month.isSelected) {
      classes.push('calendar__month--selected');
    }

    return classes.join(' ');
  }

  getYearClasses(yearItem: CalendarYear): string {
    const classes = ['calendar__year'];

    if (yearItem.isSelected) {
      classes.push('calendar__year--selected');
    }

    const currentYear = new Date().getFullYear();
    if (yearItem.year === currentYear) {
      classes.push('calendar__year--current');
    }

    return classes.join(' ');
  }

  onDateClick(day: CalendarDay, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.dateSelect.emit(day);
  }

  onMonthClick(monthIndex: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.monthSelect.emit(monthIndex);
  }

  onYearClick(year: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.yearSelect.emit(year);
  }

  onDateHover(day: CalendarDay): void {
    this.dateHover.emit(day);
  }

  onDateLeave(): void {
    this.dateLeave.emit();
  }

  onPreviousMonth(event?: MouseEvent | Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.previousMonth.emit();
  }

  onNextMonth(event?: MouseEvent | Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.nextMonth.emit();
  }

  onPreviousYear(event?: MouseEvent | Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.previousYear.emit();
  }

  onNextYear(event?: MouseEvent | Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.nextYear.emit();
  }

  onPreviousYearRange(event?: MouseEvent | Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.previousYearRange.emit();
  }

  onNextYearRange(event?: MouseEvent | Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.nextYearRange.emit();
  }

  onSwitchToMonthsView(event?: MouseEvent | Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.switchToMonthsView.emit();
  }

  onSwitchToYearsView(event?: MouseEvent | Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.switchToYearsView.emit();
  }

  onSwitchToDaysView(event?: MouseEvent | Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.switchToDaysView.emit();
  }

  trackByDate(index: number, day: CalendarDay): number {
    return day.date.getTime();
  }
}
