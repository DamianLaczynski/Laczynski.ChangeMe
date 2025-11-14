import { Component, signal } from '@angular/core';
import { CalendarComponent, CalendarView, CalendarDay } from './calendar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-showcase',
  imports: [CalendarComponent, CommonModule],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Calendar Component Showcase</h1>
      <p class="showcase__description">
        Standalone calendar component built with Fluent 2 Design System. Provides date selection
        capabilities with multiple views (days, months, years) and flexible configuration options.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Days View (Default)</h3>
            <app-calendar
              [currentMonth]="currentMonth()"
              [selectedDate]="selectedDate()"
              [calendarView]="'days'"
              (dateSelect)="onDateSelect($event)"
              (previousMonth)="onPreviousMonth()"
              (nextMonth)="onNextMonth()"
              (switchToMonthsView)="onSwitchToMonthsView()"
            ></app-calendar>
          </div>
          <div class="showcase__item">
            <h3>Months View</h3>
            <app-calendar
              [currentMonth]="currentMonth()"
              [selectedDate]="selectedDate()"
              [calendarView]="'months'"
              (monthSelect)="onMonthSelect($event)"
              (previousYear)="onPreviousYear()"
              (nextYear)="onNextYear()"
              (switchToYearsView)="onSwitchToYearsView()"
              (switchToDaysView)="onSwitchToDaysView()"
            ></app-calendar>
          </div>
          <div class="showcase__item">
            <h3>Years View</h3>
            <app-calendar
              [currentMonth]="currentMonth()"
              [selectedDate]="selectedDate()"
              [calendarView]="'years'"
              (yearSelect)="onYearSelect($event)"
              (previousYearRange)="onPreviousYearRange()"
              (nextYearRange)="onNextYearRange()"
              (switchToMonthsView)="onSwitchToMonthsView()"
            ></app-calendar>
          </div>
        </div>
        <div class="showcase__form-output">
          <strong>Selected Date:</strong>
          <pre>{{ selectedDate() ? selectedDate()!.toLocaleDateString() : 'None' }}</pre>
          <strong>Current Month:</strong>
          <pre>{{ currentMonth().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }}</pre>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Small</h3>
            <app-calendar
              [currentMonth]="currentMonth()"
              [selectedDate]="selectedDate()"
              [calendarView]="'days'"
              [size]="'small'"
              (dateSelect)="onDateSelect($event)"
              (previousMonth)="onPreviousMonth()"
              (nextMonth)="onNextMonth()"
              (switchToMonthsView)="onSwitchToMonthsView()"
            ></app-calendar>
          </div>
          <div class="showcase__item">
            <h3>Medium (Default)</h3>
            <app-calendar
              [currentMonth]="currentMonth()"
              [selectedDate]="selectedDate()"
              [calendarView]="'days'"
              [size]="'medium'"
              (dateSelect)="onDateSelect($event)"
              (previousMonth)="onPreviousMonth()"
              (nextMonth)="onNextMonth()"
              (switchToMonthsView)="onSwitchToMonthsView()"
            ></app-calendar>
          </div>
          <div class="showcase__item">
            <h3>Large</h3>
            <app-calendar
              [currentMonth]="currentMonth()"
              [selectedDate]="selectedDate()"
              [calendarView]="'days'"
              [size]="'large'"
              (dateSelect)="onDateSelect($event)"
              (previousMonth)="onPreviousMonth()"
              (nextMonth)="onNextMonth()"
              (switchToMonthsView)="onSwitchToMonthsView()"
            ></app-calendar>
          </div>
        </div>
      </div>

      <!-- Min/Max Constraints -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Min/Max Constraints</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>With Date Range</h3>
            <app-calendar
              [currentMonth]="currentMonth()"
              [selectedDate]="selectedDate()"
              [calendarView]="'days'"
              [min]="minDate"
              [max]="maxDate"
              (dateSelect)="onDateSelect($event)"
              (previousMonth)="onPreviousMonth()"
              (nextMonth)="onNextMonth()"
              (switchToMonthsView)="onSwitchToMonthsView()"
            ></app-calendar>
            <div class="showcase__form-output">
              <p><strong>Min Date:</strong> {{ minDate }}</p>
              <p><strong>Max Date:</strong> {{ maxDate }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Date Range Selection -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Date Range Selection</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Range Selection</h3>
            <app-calendar
              [currentMonth]="currentMonth()"
              [selectedDate]="null"
              [startDate]="rangeStartDate()"
              [endDate]="rangeEndDate()"
              [hoveredDate]="hoveredDate()"
              [calendarView]="'days'"
              [isDayInHoverRangeFn]="isDayInHoverRange.bind(this)"
              (dateSelect)="onRangeDateSelect($event)"
              (dateHover)="onRangeDateHover($event)"
              (dateLeave)="onRangeDateLeave()"
              (previousMonth)="onPreviousMonth()"
              (nextMonth)="onNextMonth()"
              (switchToMonthsView)="onSwitchToMonthsView()"
            ></app-calendar>
            <div class="showcase__form-output">
              <p><strong>Start Date:</strong> {{ rangeStartDate() ? rangeStartDate()!.toLocaleDateString() : 'None' }}</p>
              <p><strong>End Date:</strong> {{ rangeEndDate() ? rangeEndDate()!.toLocaleDateString() : 'None' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Month/Year Picker Control -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Month/Year Picker Control</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>With Month/Year Picker</h3>
            <app-calendar
              [currentMonth]="currentMonth()"
              [selectedDate]="selectedDate()"
              [calendarView]="'days'"
              [showMonthYearPicker]="true"
              (dateSelect)="onDateSelect($event)"
              (previousMonth)="onPreviousMonth()"
              (nextMonth)="onNextMonth()"
              (switchToMonthsView)="onSwitchToMonthsView()"
            ></app-calendar>
          </div>
          <div class="showcase__item">
            <h3>Without Month/Year Picker</h3>
            <app-calendar
              [currentMonth]="currentMonth()"
              [selectedDate]="selectedDate()"
              [calendarView]="'days'"
              [showMonthYearPicker]="false"
              (dateSelect)="onDateSelect($event)"
              (previousMonth)="onPreviousMonth()"
              (nextMonth)="onNextMonth()"
            ></app-calendar>
          </div>
        </div>
      </div>

      <!-- Interactive Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Navigate Through Views</h3>
            <app-calendar
              [currentMonth]="interactiveCurrentMonth()"
              [selectedDate]="interactiveSelectedDate()"
              [calendarView]="interactiveCalendarView()"
              (dateSelect)="onInteractiveDateSelect($event)"
              (monthSelect)="onInteractiveMonthSelect($event)"
              (yearSelect)="onInteractiveYearSelect($event)"
              (previousMonth)="onInteractivePreviousMonth()"
              (nextMonth)="onInteractiveNextMonth()"
              (previousYear)="onInteractivePreviousYear()"
              (nextYear)="onInteractiveNextYear()"
              (previousYearRange)="onInteractivePreviousYearRange()"
              (nextYearRange)="onInteractiveNextYearRange()"
              (switchToMonthsView)="onInteractiveSwitchToMonthsView()"
              (switchToYearsView)="onInteractiveSwitchToYearsView()"
              (switchToDaysView)="onInteractiveSwitchToDaysView()"
            ></app-calendar>
            <div class="showcase__form-output">
              <p><strong>View:</strong> {{ interactiveCalendarView() }}</p>
              <p><strong>Selected:</strong> {{ interactiveSelectedDate() ? interactiveSelectedDate()!.toLocaleDateString() : 'None' }}</p>
              <p><strong>Month:</strong> {{ interactiveCurrentMonth().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CalendarShowcaseComponent {
  currentMonth = signal<Date>(new Date());
  selectedDate = signal<Date | null>(null);
  calendarView = signal<CalendarView>('days');

  // Range selection
  rangeStartDate = signal<Date | null>(null);
  rangeEndDate = signal<Date | null>(null);
  hoveredDate = signal<Date | null>(null);
  activeRangeSelection = signal<'start' | 'end' | null>(null);

  // Interactive example
  interactiveCurrentMonth = signal<Date>(new Date());
  interactiveSelectedDate = signal<Date | null>(null);
  interactiveCalendarView = signal<CalendarView>('days');

  minDate = '2024-01-01';
  maxDate = '2024-12-31';

  // Basic date selection
  onDateSelect(day: CalendarDay): void {
    this.selectedDate.set(day.date);
  }

  onPreviousMonth(): void {
    const newMonth = new Date(this.currentMonth());
    newMonth.setMonth(newMonth.getMonth() - 1);
    this.currentMonth.set(newMonth);
  }

  onNextMonth(): void {
    const newMonth = new Date(this.currentMonth());
    newMonth.setMonth(newMonth.getMonth() + 1);
    this.currentMonth.set(newMonth);
  }

  onPreviousYear(): void {
    const newMonth = new Date(this.currentMonth());
    newMonth.setFullYear(newMonth.getFullYear() - 1);
    this.currentMonth.set(newMonth);
  }

  onNextYear(): void {
    const newMonth = new Date(this.currentMonth());
    newMonth.setFullYear(newMonth.getFullYear() + 1);
    this.currentMonth.set(newMonth);
  }

  onPreviousYearRange(): void {
    const newMonth = new Date(this.currentMonth());
    newMonth.setFullYear(newMonth.getFullYear() - 12);
    this.currentMonth.set(newMonth);
  }

  onNextYearRange(): void {
    const newMonth = new Date(this.currentMonth());
    newMonth.setFullYear(newMonth.getFullYear() + 12);
    this.currentMonth.set(newMonth);
  }

  onSwitchToMonthsView(): void {
    this.calendarView.set('months');
  }

  onSwitchToYearsView(): void {
    this.calendarView.set('years');
  }

  onSwitchToDaysView(): void {
    this.calendarView.set('days');
  }

  onMonthSelect(monthIndex: number): void {
    const newDate = new Date(this.currentMonth());
    newDate.setMonth(monthIndex);
    this.currentMonth.set(newDate);
    this.calendarView.set('days');
  }

  onYearSelect(year: number): void {
    const newDate = new Date(this.currentMonth());
    newDate.setFullYear(year);
    this.currentMonth.set(newDate);
    this.calendarView.set('months');
  }

  // Range selection handlers
  onRangeDateSelect(day: CalendarDay): void {
    const selectedDate = day.date;
    const activeSelection = this.activeRangeSelection();

    if (activeSelection === 'start' || !this.rangeStartDate()) {
      this.rangeStartDate.set(selectedDate);
      this.rangeEndDate.set(null);
      this.activeRangeSelection.set('end');
    } else if (activeSelection === 'end' && this.rangeStartDate()) {
      if (selectedDate < this.rangeStartDate()!) {
        this.rangeEndDate.set(this.rangeStartDate());
        this.rangeStartDate.set(selectedDate);
      } else {
        this.rangeEndDate.set(selectedDate);
      }
      this.activeRangeSelection.set(null);
    }
  }

  onRangeDateHover(day: CalendarDay): void {
    if (!day.isDisabled && this.rangeStartDate() && !this.rangeEndDate()) {
      this.hoveredDate.set(day.date);
    }
  }

  onRangeDateLeave(): void {
    this.hoveredDate.set(null);
  }

  isDayInHoverRange(day: CalendarDay): boolean {
    const start = this.rangeStartDate();
    const end = this.rangeEndDate();
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

  // Interactive example handlers
  onInteractiveDateSelect(day: CalendarDay): void {
    this.interactiveSelectedDate.set(day.date);
  }

  onInteractiveMonthSelect(monthIndex: number): void {
    const newDate = new Date(this.interactiveCurrentMonth());
    newDate.setMonth(monthIndex);
    this.interactiveCurrentMonth.set(newDate);
    this.interactiveCalendarView.set('days');
  }

  onInteractiveYearSelect(year: number): void {
    const newDate = new Date(this.interactiveCurrentMonth());
    newDate.setFullYear(year);
    this.interactiveCurrentMonth.set(newDate);
    this.interactiveCalendarView.set('months');
  }

  onInteractivePreviousMonth(): void {
    const newMonth = new Date(this.interactiveCurrentMonth());
    newMonth.setMonth(newMonth.getMonth() - 1);
    this.interactiveCurrentMonth.set(newMonth);
  }

  onInteractiveNextMonth(): void {
    const newMonth = new Date(this.interactiveCurrentMonth());
    newMonth.setMonth(newMonth.getMonth() + 1);
    this.interactiveCurrentMonth.set(newMonth);
  }

  onInteractivePreviousYear(): void {
    const newMonth = new Date(this.interactiveCurrentMonth());
    newMonth.setFullYear(newMonth.getFullYear() - 1);
    this.interactiveCurrentMonth.set(newMonth);
  }

  onInteractiveNextYear(): void {
    const newMonth = new Date(this.interactiveCurrentMonth());
    newMonth.setFullYear(newMonth.getFullYear() + 1);
    this.interactiveCurrentMonth.set(newMonth);
  }

  onInteractivePreviousYearRange(): void {
    const newMonth = new Date(this.interactiveCurrentMonth());
    newMonth.setFullYear(newMonth.getFullYear() - 12);
    this.interactiveCurrentMonth.set(newMonth);
  }

  onInteractiveNextYearRange(): void {
    const newMonth = new Date(this.interactiveCurrentMonth());
    newMonth.setFullYear(newMonth.getFullYear() + 12);
    this.interactiveCurrentMonth.set(newMonth);
  }

  onInteractiveSwitchToMonthsView(): void {
    this.interactiveCalendarView.set('months');
  }

  onInteractiveSwitchToYearsView(): void {
    this.interactiveCalendarView.set('years');
  }

  onInteractiveSwitchToDaysView(): void {
    this.interactiveCalendarView.set('days');
  }
}

