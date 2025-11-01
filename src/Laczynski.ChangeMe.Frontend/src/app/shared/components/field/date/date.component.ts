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

export type DateFieldType = 'date' | 'datetime-local' | 'time' | 'month' | 'week';
export type CalendarView = 'days' | 'months' | 'years';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

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

  imports: [CommonModule, FieldComponent, ActionButtonComponent, IconComponent],
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
  selectedHour = signal<number>(12);
  selectedMinute = signal<number>(0);
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

  monthYearText = computed(() => {
    const month = this.currentMonth();
    return this.formatMonthYear(month);
  });

  calendarDays = computed(() => {
    return this.generateCalendarDays();
  });

  calendarWeeks = computed(() => {
    return this.generateCalendarWeeks();
  });

  calendarYears = computed(() => {
    return this.generateCalendarYears();
  });

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

  selectDate(day: CalendarDay): void {
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

  selectMonth(monthIndex: number): void {
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

  selectYear(year: number): void {
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

  switchToMonthsView(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.calendarView.set('months');
  }

  switchToYearsView(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.calendarView.set('years');
  }

  switchToDaysView(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.calendarView.set('days');
  }

  previousMonth(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const newMonth = new Date(this.currentMonth());
    newMonth.setMonth(newMonth.getMonth() - 1);
    this.currentMonth.set(newMonth);
  }

  nextMonth(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const newMonth = new Date(this.currentMonth());
    newMonth.setMonth(newMonth.getMonth() + 1);
    this.currentMonth.set(newMonth);
  }

  previousYear(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const newMonth = new Date(this.currentMonth());
    newMonth.setFullYear(newMonth.getFullYear() - 1);
    this.currentMonth.set(newMonth);
  }

  nextYear(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const newMonth = new Date(this.currentMonth());
    newMonth.setFullYear(newMonth.getFullYear() + 1);
    this.currentMonth.set(newMonth);
  }

  previousYearRange(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const newMonth = new Date(this.currentMonth());
    newMonth.setFullYear(newMonth.getFullYear() - 12);
    this.currentMonth.set(newMonth);
  }

  nextYearRange(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
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

  onTimeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedTime.set(target.value);
  }

  incrementHour(): void {
    const currentHour = this.selectedHour();
    const maxHour = this.use24HourFormat() ? 23 : 12;
    const minHour = this.use24HourFormat() ? 0 : 1;

    if (currentHour >= maxHour) {
      this.selectedHour.set(minHour);
    } else {
      this.selectedHour.set(currentHour + 1);
    }
    this.updateTimeFromSpinner();
  }

  decrementHour(): void {
    const currentHour = this.selectedHour();
    const maxHour = this.use24HourFormat() ? 23 : 12;
    const minHour = this.use24HourFormat() ? 0 : 1;

    if (currentHour <= minHour) {
      this.selectedHour.set(maxHour);
    } else {
      this.selectedHour.set(currentHour - 1);
    }
    this.updateTimeFromSpinner();
  }

  incrementMinute(): void {
    const currentMinute = this.selectedMinute();
    const step = this.getMinuteStep();

    if (currentMinute + step >= 60) {
      this.selectedMinute.set(0);
      this.incrementHour();
    } else {
      this.selectedMinute.set(currentMinute + step);
    }
    this.updateTimeFromSpinner();
  }

  decrementMinute(): void {
    const currentMinute = this.selectedMinute();
    const step = this.getMinuteStep();

    if (currentMinute - step < 0) {
      this.selectedMinute.set(60 - step);
      this.decrementHour();
    } else {
      this.selectedMinute.set(currentMinute - step);
    }
    this.updateTimeFromSpinner();
  }

  onHourInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    let hour = parseInt(target.value) || 0;

    if (this.use24HourFormat()) {
      hour = Math.max(0, Math.min(23, hour));
    } else {
      hour = Math.max(1, Math.min(12, hour));
    }

    this.selectedHour.set(hour);
    this.updateTimeFromSpinner();
  }

  onMinuteInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    let minute = parseInt(target.value) || 0;
    minute = Math.max(0, Math.min(59, minute));

    this.selectedMinute.set(minute);
    this.updateTimeFromSpinner();
  }

  updateTimeFromSpinner(): void {
    const hour = this.selectedHour();
    const minute = this.selectedMinute();
    const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    this.selectedTime.set(timeStr);
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
    const selectedDateOnly = selected
      ? new Date(selected.getFullYear(), selected.getMonth(), selected.getDate())
      : null;

    // Add days from previous month
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const date = new Date(year, monthIndex, -i);
      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth: false,
        isToday: this.isSameDay(date, today),
        isSelected: selectedDateOnly ? this.isSameDay(date, selectedDateOnly) : false,
        isDisabled: this.isDateDisabled(date),
      });
    }

    // Add days of current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, monthIndex, day);
      days.push({
        date,
        day,
        isCurrentMonth: true,
        isToday: this.isSameDay(date, today),
        isSelected: selectedDateOnly ? this.isSameDay(date, selectedDateOnly) : false,
        isDisabled: this.isDateDisabled(date),
      });
    }

    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, monthIndex + 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isToday: this.isSameDay(date, today),
        isSelected: selectedDateOnly ? this.isSameDay(date, selectedDateOnly) : false,
        isDisabled: this.isDateDisabled(date),
      });
    }

    return days;
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
      this.selectedHour.set(12);
      this.selectedMinute.set(0);
      super.writeValue('');
      return;
    }

    const type = this.dateType();

    if (type === 'time') {
      this.selectedTime.set(value);
      const parsed = this.parseTimeString(value);
      this.selectedHour.set(parsed.hour);
      this.selectedMinute.set(parsed.minute);
    } else if (type === 'datetime-local') {
      const [datePart, timePart] = value.split('T');
      this.selectedDate.set(new Date(datePart));
      if (timePart) {
        this.selectedTime.set(timePart);
        const parsed = this.parseTimeString(timePart);
        this.selectedHour.set(parsed.hour);
        this.selectedMinute.set(parsed.minute);
      }
    } else {
      this.selectedDate.set(new Date(value));
    }

    super.writeValue(value);
  }

  getDayClasses(day: CalendarDay): string {
    const classes = ['date-calendar__day'];

    if (!day.isCurrentMonth) {
      classes.push('date-calendar__day--other-month');
    }

    if (day.isToday) {
      classes.push('date-calendar__day--today');
    }

    if (day.isSelected) {
      classes.push('date-calendar__day--selected');
    }

    if (day.isDisabled) {
      classes.push('date-calendar__day--disabled');
    }

    classes.push(`date-calendar__day--${this.size()}`);

    return classes.join(' ');
  }

  override clear(): void {
    this.selectedDate.set(null);
    this.selectedTime.set('');
    this.selectedHour.set(12);
    this.selectedMinute.set(0);
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
    // Initialize time if empty
    if (
      !this.selectedTime() &&
      (this.dateType() === 'time' || this.dateType() === 'datetime-local')
    ) {
      const now = new Date();
      this.selectedHour.set(now.getHours());
      this.selectedMinute.set(now.getMinutes());
      this.updateTimeFromSpinner();
    }
  }

  getWeekClasses(week: CalendarWeek): string {
    const classes = ['date-calendar__week'];

    if (week.isSelected) {
      classes.push('date-calendar__week--selected');
    }

    return classes.join(' ');
  }

  getYearClasses(yearItem: CalendarYear): string {
    const classes = ['date-calendar__year'];

    if (yearItem.isSelected) {
      classes.push('date-calendar__year--selected');
    }

    const currentYear = new Date().getFullYear();
    if (yearItem.year === currentYear) {
      classes.push('date-calendar__year--current');
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
