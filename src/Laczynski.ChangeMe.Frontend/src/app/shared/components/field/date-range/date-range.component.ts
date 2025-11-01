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
  output,
  untracked,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FieldComponent } from '../field/field.component';
import { ActionButtonComponent } from '../action-button.component';
import { IconComponent } from '@shared/components/icon/icon.component';

export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isDisabled: boolean;
}

type CalendarView = 'days' | 'months' | 'years';
type RangeSelection = 'start' | 'end' | null;

@Component({
  selector: 'app-date-range',

  imports: [CommonModule, FieldComponent, ActionButtonComponent, IconComponent],
  templateUrl: './date-range.component.html',
  host: {
    '[style.position]': '"relative"',
    '[style.display]': '"block"',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangeComponent),
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
export class DateRangeComponent extends FieldComponent {
  min = input<string>('');
  max = input<string>('');
  separator = input<string>(' - ');
  showMonthYearPicker = input<boolean>(true);

  rangeChange = output<DateRange>();

  isExpanded = signal<boolean>(false);
  currentMonth = signal<Date>(new Date());
  startDate = signal<Date | null>(null);
  endDate = signal<Date | null>(null);
  hoveredDate = signal<Date | null>(null);
  activeSelection = signal<RangeSelection>(null);
  calendarView = signal<CalendarView>('days');

  @ViewChild('datePanel') datePanel?: ElementRef;

  private isWritingValue = false;

  // Computed properties
  displayText = computed(() => {
    const start = this.startDate();
    const end = this.endDate();
    const separator = this.separator();

    if (!start && !end) {
      return this.placeholder() || 'Select date range...';
    }

    const startStr = start ? this.formatDate(start) : '';
    const endStr = end ? this.formatDate(end) : '';

    if (start && end) {
      return `${startStr}${separator}${endStr}`;
    } else if (start) {
      return `${startStr}${separator}...`;
    } else if (end) {
      return `...${separator}${endStr}`;
    }

    return '';
  });

  monthYearText = computed(() => {
    const month = this.currentMonth();
    return this.formatMonthYear(month);
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
      // Skip if we're currently writing value from outside
      if (this.isWritingValue) {
        return;
      }

      const start = this.startDate();
      const end = this.endDate();

      const rangeValue: DateRange = {
        startDate: start ? this.toISODate(start) : null,
        endDate: end ? this.toISODate(end) : null,
      };

      // Check if value actually changed to avoid infinite loop
      const currentValue = this.value as DateRange;
      const hasChanged =
        !currentValue ||
        currentValue.startDate !== rangeValue.startDate ||
        currentValue.endDate !== rangeValue.endDate;

      if (hasChanged) {
        this.value = rangeValue;
        this.onChange(rangeValue);
        this.rangeChange.emit(rangeValue);
      }
    });
  }

  onPanelClick(event: Event): void {
    // Stop propagation from panel to document to prevent closing
    event.stopPropagation();
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

  openPanel(): void {
    this.isExpanded.set(true);

    // Set activeSelection based on current state
    if (this.startDate() && !this.endDate()) {
      // If we have start date but no end date, select end date next
      this.activeSelection.set('end');
    } else {
      // Otherwise, start fresh with start date
      this.activeSelection.set('start');
    }

    // Navigate to the month of start date if available
    if (this.startDate()) {
      this.currentMonth.set(new Date(this.startDate()!));
    }

    this.calendarView.set('days');
  }

  closePanel(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isExpanded.set(false);
    this.hoveredDate.set(null);
    this.activeSelection.set(null);
  }

  selectDate(day: CalendarDay, event?: Event): void {
    // Stop event propagation to prevent document click handler from closing the panel
    if (event) {
      event.stopPropagation();
    }

    if (day.isDisabled) {
      return;
    }

    const selectedDate = day.date;
    const activeSelection = this.activeSelection();
    const currentStart = this.startDate();
    const currentEnd = this.endDate();

    // Scenario 1: Selecting start date (first click or resetting range)
    if (activeSelection === 'start') {
      this.startDate.set(selectedDate);
      this.endDate.set(null);
      this.activeSelection.set('end');
      // Keep panel open for end date selection
      return;
    }

    // Scenario 2: Selecting end date
    if (activeSelection === 'end' && currentStart) {
      if (selectedDate < currentStart) {
        // If end date is before start date, swap them
        this.endDate.set(currentStart);
        this.startDate.set(selectedDate);
      } else if (selectedDate.getTime() === currentStart.getTime()) {
        // If clicking the same date, treat as single day range
        this.endDate.set(selectedDate);
      } else {
        // Normal case: end date after start date
        this.endDate.set(selectedDate);
      }

      this.activeSelection.set(null);
      // Close panel after selecting end date
      setTimeout(() => this.closePanel(), 150);
      return;
    }

    // Scenario 3: Both dates selected, start new selection
    if (currentStart && currentEnd) {
      this.startDate.set(selectedDate);
      this.endDate.set(null);
      this.activeSelection.set('end');
      return;
    }

    // Fallback: treat as start date
    this.startDate.set(selectedDate);
    this.endDate.set(null);
    this.activeSelection.set('end');
  }

  onDateHover(day: CalendarDay): void {
    if (!day.isDisabled && this.startDate() && !this.endDate()) {
      this.hoveredDate.set(day.date);
    }
  }

  onDateLeave(): void {
    this.hoveredDate.set(null);
  }

  // Check if a day is in the hover range (called from template, not computed)
  isDayInHoverRange(day: CalendarDay): boolean {
    const start = this.startDate();
    const end = this.endDate();
    const hovered = this.hoveredDate();

    if (!start || end || !hovered) {
      return false;
    }

    const dateOnly = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate());
    const startOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const hoveredOnly = new Date(hovered.getFullYear(), hovered.getMonth(), hovered.getDate());

    const rangeStart = startOnly < hoveredOnly ? startOnly : hoveredOnly;
    const rangeEnd = startOnly < hoveredOnly ? hoveredOnly : startOnly;

    return dateOnly > rangeStart && dateOnly < rangeEnd;
  }

  selectMonth(monthIndex: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const newDate = new Date(this.currentMonth());
    newDate.setMonth(monthIndex);
    this.currentMonth.set(newDate);
    this.calendarView.set('days');
  }

  selectYear(year: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const newDate = new Date(this.currentMonth());
    newDate.setFullYear(year);
    this.currentMonth.set(newDate);
    this.calendarView.set('months');
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

  private generateCalendarDays(): CalendarDay[] {
    const month = this.currentMonth();
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    const firstDayOfMonth = new Date(year, monthIndex, 1);
    const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

    let firstDayWeekday = firstDayOfMonth.getDay();
    firstDayWeekday = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = this.startDate();
    const end = this.endDate();
    // Use untracked to prevent hover from triggering recomputation
    const hovered = untracked(() => this.hoveredDate());

    // Add days from previous month
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const date = new Date(year, monthIndex, -i);
      days.push(this.createCalendarDay(date, false, today, start, end, hovered));
    }

    // Add days of current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, monthIndex, day);
      days.push(this.createCalendarDay(date, true, today, start, end, hovered));
    }

    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, monthIndex + 1, day);
      days.push(this.createCalendarDay(date, false, today, start, end, hovered));
    }

    return days;
  }

  private createCalendarDay(
    date: Date,
    isCurrentMonth: boolean,
    today: Date,
    start: Date | null,
    end: Date | null,
    hovered: Date | null,
  ): CalendarDay {
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startOnly = start
      ? new Date(start.getFullYear(), start.getMonth(), start.getDate())
      : null;
    const endOnly = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate()) : null;
    const hoveredOnly = hovered
      ? new Date(hovered.getFullYear(), hovered.getMonth(), hovered.getDate())
      : null;

    const isSelected = !!(
      (startOnly && this.isSameDay(dateOnly, startOnly)) ||
      (endOnly && this.isSameDay(dateOnly, endOnly))
    );
    const isRangeStart = startOnly ? this.isSameDay(dateOnly, startOnly) : false;
    const isRangeEnd = endOnly ? this.isSameDay(dateOnly, endOnly) : false;

    // Only calculate confirmed range (start to end)
    // Hover preview range is calculated separately in isDayInHoverRange()
    const isInRange = startOnly && endOnly ? dateOnly > startOnly && dateOnly < endOnly : false;

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

  private generateCalendarMonths(): Array<{ name: string; index: number; isSelected: boolean }> {
    const currentYear = this.currentMonth().getFullYear();
    const selectedStart = this.startDate();
    const selectedEnd = this.endDate();

    return this.months.map((month, index) => ({
      name: month.substring(0, 3),
      index,
      isSelected: !!(
        (selectedStart &&
          selectedStart.getFullYear() === currentYear &&
          selectedStart.getMonth() === index) ||
        (selectedEnd &&
          selectedEnd.getFullYear() === currentYear &&
          selectedEnd.getMonth() === index)
      ),
    }));
  }

  private generateCalendarYears(): Array<{ year: number; isSelected: boolean }> {
    const currentYear = this.currentMonth().getFullYear();
    const startYear = Math.floor(currentYear / 12) * 12;
    const years: Array<{ year: number; isSelected: boolean }> = [];

    const selectedStart = this.startDate();
    const selectedEnd = this.endDate();

    for (let i = 0; i < 12; i++) {
      const year = startYear + i;
      years.push({
        year,
        isSelected: !!(
          (selectedStart && selectedStart.getFullYear() === year) ||
          (selectedEnd && selectedEnd.getFullYear() === year)
        ),
      });
    }

    return years;
  }

  getYearRangeText(): string {
    const years = this.calendarYears();
    if (years.length === 0) return '';
    return `${years[0].year} - ${years[years.length - 1].year}`;
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

  // Override ControlValueAccessor methods
  override writeValue(value: any): void {
    this.isWritingValue = true;

    if (!value || (typeof value === 'object' && !value.startDate && !value.endDate)) {
      this.startDate.set(null);
      this.endDate.set(null);
      super.writeValue(null);
      this.isWritingValue = false;
      return;
    }

    if (typeof value === 'object' && (value.startDate || value.endDate)) {
      if (value.startDate) {
        this.startDate.set(new Date(value.startDate));
      }
      if (value.endDate) {
        this.endDate.set(new Date(value.endDate));
      }
    }

    super.writeValue(value);
    this.isWritingValue = false;
  }

  trackByDate(index: number, day: CalendarDay): number {
    return day.date.getTime();
  }

  getDayClasses(day: CalendarDay): string {
    const classes = ['date-range-calendar__day'];

    if (!day.isCurrentMonth) {
      classes.push('date-range-calendar__day--other-month');
    }

    if (day.isToday) {
      classes.push('date-range-calendar__day--today');
    }

    if (day.isRangeStart) {
      classes.push('date-range-calendar__day--range-start');
    }

    if (day.isRangeEnd) {
      classes.push('date-range-calendar__day--range-end');
    }

    // Check both confirmed range and hover preview range
    if (day.isInRange || this.isDayInHoverRange(day)) {
      classes.push('date-range-calendar__day--in-range');
    }

    if (day.isSelected) {
      classes.push('date-range-calendar__day--selected');
    }

    if (day.isDisabled) {
      classes.push('date-range-calendar__day--disabled');
    }

    classes.push(`date-range-calendar__day--${this.size()}`);

    return classes.join(' ');
  }

  override clear(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.startDate.set(null);
    this.endDate.set(null);
    this.activeSelection.set('start');
    super.clear();
  }

  getMonthClasses(month: { name: string; index: number; isSelected: boolean }): string {
    const classes = ['date-range-panel__month'];

    if (month.isSelected) {
      classes.push('date-range-panel__month--selected');
    }

    return classes.join(' ');
  }

  getYearClasses(yearItem: { year: number; isSelected: boolean }): string {
    const classes = ['date-range-calendar__year'];

    if (yearItem.isSelected) {
      classes.push('date-range-calendar__year--selected');
    }

    const currentYear = new Date().getFullYear();
    if (yearItem.year === currentYear) {
      classes.push('date-range-calendar__year--current');
    }

    return classes.join(' ');
  }
}
