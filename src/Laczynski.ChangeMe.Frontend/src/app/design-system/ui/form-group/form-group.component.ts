import {
  Component,
  input,
  output,
  computed,
  signal,
  inject,
  OnInit,
  ElementRef,
  ContentChildren,
  QueryList,
  AfterContentInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormFieldComponent } from '../form-field/form-field.component';
import { ButtonComponent } from '../button/button.component';

import {
  FormGroupConfig,
  FormGroupVariant,
  FormGroupSize,
  FormGroupLayout,
  FormGroupSpacing,
  FormGroupState,
  FormGroupProgress,
  FormGroupAction,
  FormGroupStateChangeEvent,
  FormGroupToggleEvent,
  FormGroupActionEvent,
  createFormGroupConfig,
  createFormGroupState,
  calculateFormGroupProgress,
  getFormGroupClasses,
  getFormGroupAriaAttributes,
  getFormGroupTitleClasses,
  getFormGroupContentClasses,
  generateFormGroupId,
  isFormGroupContentVisible,
  getFormGroupToggleIcon,
  getFormGroupStatusIcon,
  formatFormGroupProgress,
  shouldShowFormGroupProgress,
} from './form-group.model';

/**
 * Form Group Component
 *
 * Logical grouping component for related form fields with title, description,
 * optional collapsing, progress tracking, and various layout options.
 * Built with Angular Signals API.
 */
@Component({
  selector: 'ds-form-group',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <fieldset class="ds-form-group" [class]="containerClasses()">
      <!-- Group Header -->
      @if (shouldShowHeader()) {
        <div class="ds-form-group__header" [class]="headerClasses()">
          <!-- Title -->
          @if (title()) {
            <div class="ds-form-group__title-container">
              @if (collapsible()) {
                <button
                  type="button"
                  class="ds-form-group__toggle"
                  [attr.aria-expanded]="!internalCollapsed()"
                  [attr.aria-controls]="contentId()"
                  (click)="toggleCollapsed($event)"
                >
                  <span class="ds-form-group__toggle-icon">
                    {{ toggleIcon() }}
                  </span>
                  <legend class="ds-form-group__title" [class]="titleClasses()">
                    {{ title() }}
                    @if (required()) {
                      <span class="ds-form-group__required" aria-label="Required section">*</span>
                    }
                  </legend>
                </button>
              } @else {
                <legend class="ds-form-group__title" [class]="titleClasses()">
                  {{ title() }}
                  @if (required()) {
                    <span class="ds-form-group__required" aria-label="Required section">*</span>
                  }
                </legend>
              }

              <!-- Status Icon -->
              @if (statusIcon()) {
                <span class="ds-form-group__status" [title]="statusTitle()">
                  {{ statusIcon() }}
                </span>
              }
            </div>
          }

          <!-- Description -->
          @if (description()) {
            <p class="ds-form-group__description" [id]="descriptionId()">
              {{ description() }}
            </p>
          }

          <!-- Progress -->
          @if (shouldShowProgressBar()) {
            <div class="ds-form-group__progress" [id]="progressId()">
              <div class="ds-form-group__progress-bar">
                <div
                  class="ds-form-group__progress-fill"
                  [style.width.%]="progressInfo().percentage"
                ></div>
              </div>
              <span class="ds-form-group__progress-text">
                {{ formatProgress() }}
              </span>
            </div>
          }

          <!-- Actions -->
          @if (actions().length > 0) {
            <div class="ds-form-group__actions">
              @for (action of actions(); track action.label) {
                <ds-button
                  [variant]="action.type"
                  [size]="size() === 'sm' ? 'sm' : 'md'"
                  [disabled]="action.disabled || disabled()"
                  [iconStart]="action.icon"
                  (clicked)="onActionClick(action, $event)"
                >
                  {{ action.label }}
                </ds-button>
              }
            </div>
          }
        </div>
      }

      <!-- Group Content -->
      @if (isContentVisible()) {
        <div
          class="ds-form-group__content"
          [class]="contentClasses()"
          [id]="contentId()"
          [attr.aria-describedby]="getAriaDescribedBy()"
        >
          <ng-content></ng-content>
        </div>
      }
    </fieldset>
  `,
  styleUrl: './form-group.component.scss',
})
export class FormGroupComponent implements OnInit, AfterContentInit {
  private readonly elementRef = inject(ElementRef);

  // Query for form field children
  @ContentChildren(FormFieldComponent, { descendants: true })
  private formFields?: QueryList<FormFieldComponent>;

  // =============================================================================
  // INPUTS
  // =============================================================================

  /** Form group variant */
  variant = input<FormGroupVariant>('default');

  /** Form group size */
  size = input<FormGroupSize>('md');

  /** Layout orientation */
  layout = input<FormGroupLayout>('vertical');

  /** Spacing between fields */
  spacing = input<FormGroupSpacing>('normal');

  /** Group title */
  title = input<string>('');

  /** Group description */
  description = input<string>('');

  /** Whether group is required */
  required = input<boolean>(false);

  /** Whether group is disabled */
  disabled = input<boolean>(false);

  /** Whether to show border */
  showBorder = input<boolean>(true);

  /** Whether group is collapsible */
  collapsible = input<boolean>(false);

  /** Whether group is initially collapsed */
  initiallyCollapsed = input<boolean>(false);

  /** Whether to show progress bar */
  showProgress = input<boolean>(false);

  /** Group actions */
  actions = input<FormGroupAction[]>([]);

  /** Custom CSS classes */
  customClasses = input<string>('');

  /** Group ID (auto-generated if not provided) */
  groupId = input<string>('');

  // =============================================================================
  // OUTPUTS
  // =============================================================================

  /** State change events */
  stateChange = output<FormGroupStateChangeEvent>();

  /** Toggle events */
  toggleChange = output<FormGroupToggleEvent>();

  /** Action events */
  actionClick = output<FormGroupActionEvent>();

  // =============================================================================
  // COMPONENT STATE
  // =============================================================================

  /** Internal group ID */
  private internalGroupId = signal<string>('');

  /** Internal collapsed state */
  internalCollapsed = signal<boolean>(false);

  /** Internal field tracking */
  private internalFieldCount = signal<number>(0);
  private internalRequiredFieldCount = signal<number>(0);
  private internalCompletedFieldCount = signal<number>(0);
  private internalFieldsWithErrors = signal<number>(0);

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  /** Final group ID */
  finalGroupId = computed(() => this.groupId() || this.internalGroupId());

  /** Content ID for accessibility */
  contentId = computed(() => `${this.finalGroupId()}-content`);

  /** Description ID for accessibility */
  descriptionId = computed(() => `${this.finalGroupId()}-description`);

  /** Progress ID for accessibility */
  progressId = computed(() => `${this.finalGroupId()}-progress`);

  /** Form group configuration */
  config = computed(
    (): FormGroupConfig =>
      createFormGroupConfig({
        variant: this.variant(),
        size: this.size(),
        layout: this.layout(),
        spacing: this.spacing(),
        showBorder: this.showBorder(),
        collapsible: this.collapsible(),
        collapsed: this.internalCollapsed(),
      }),
  );

  /** Current form group state */
  currentState = computed(
    (): FormGroupState =>
      createFormGroupState({
        disabled: this.disabled(),
        collapsed: this.internalCollapsed(),
        hasErrors: this.internalFieldsWithErrors() > 0,
        fieldCount: this.internalFieldCount(),
        requiredFieldCount: this.internalRequiredFieldCount(),
        completedFieldCount: this.internalCompletedFieldCount(),
      }),
  );

  /** Progress information */
  progressInfo = computed(
    (): FormGroupProgress =>
      calculateFormGroupProgress(
        this.internalFieldCount(),
        this.internalCompletedFieldCount(),
        this.internalRequiredFieldCount(),
        this.internalCompletedFieldCount(), // Simplified - in real scenario this would be different
      ),
  );

  /** Container CSS classes */
  containerClasses = computed(() => {
    const classes = getFormGroupClasses(this.config(), this.currentState());

    if (this.customClasses()) {
      classes.push(this.customClasses());
    }

    return classes.join(' ');
  });

  /** Header CSS classes */
  headerClasses = computed(() => {
    const classes = ['ds-form-group__header'];

    if (this.actions().length > 0) {
      classes.push('ds-form-group__header--with-actions');
    }

    return classes.join(' ');
  });

  /** Title CSS classes */
  titleClasses = computed(() =>
    getFormGroupTitleClasses(
      this.collapsible(),
      this.internalCollapsed(),
      this.currentState().hasErrors,
    ).join(' '),
  );

  /** Content CSS classes */
  contentClasses = computed(() => getFormGroupContentClasses(this.layout()).join(' '));

  /** Whether to show header */
  shouldShowHeader = computed(
    () =>
      this.title() ||
      this.description() ||
      this.shouldShowProgressBar() ||
      this.actions().length > 0,
  );

  /** Whether to show progress bar */
  shouldShowProgressBar = computed(() =>
    shouldShowFormGroupProgress(this.internalFieldCount(), this.showProgress()),
  );

  /** Whether content is visible */
  isContentVisible = computed(() =>
    isFormGroupContentVisible(this.collapsible(), this.internalCollapsed()),
  );

  /** Toggle icon */
  toggleIcon = computed(() => getFormGroupToggleIcon(this.internalCollapsed()));

  /** Status icon */
  statusIcon = computed(() => getFormGroupStatusIcon(this.currentState()));

  /** Status title for tooltip */
  statusTitle = computed(() => {
    const state = this.currentState();
    if (state.hasErrors) return 'This section has validation errors';
    if (state.completedFieldCount === state.fieldCount && state.fieldCount > 0) {
      return 'All fields completed';
    }
    return '';
  });

  /** ARIA attributes */
  ariaAttributes = computed(() =>
    getFormGroupAriaAttributes(
      this.finalGroupId(),
      this.collapsible(),
      this.internalCollapsed(),
      this.currentState().hasErrors,
    ),
  );

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  ngOnInit(): void {
    // Generate internal group ID if not provided
    if (!this.groupId()) {
      this.internalGroupId.set(generateFormGroupId());
    }

    // Set initial collapsed state
    this.internalCollapsed.set(this.initiallyCollapsed());
  }

  ngAfterContentInit(): void {
    // Set up form field tracking
    this.updateFieldTracking();

    // Listen to form field changes
    if (this.formFields) {
      this.formFields.changes.subscribe(() => {
        this.updateFieldTracking();
      });
    }
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  /** Update field tracking based on form field children */
  private updateFieldTracking(): void {
    if (!this.formFields) return;

    const fields = this.formFields.toArray();

    this.internalFieldCount.set(fields.length);

    // Count required fields (simplified - in real scenario would check actual requirements)
    const requiredFields = fields.filter(field => field.required && field.required());
    this.internalRequiredFieldCount.set(requiredFields.length);

    // Count completed fields (simplified - in real scenario would check actual values)
    const completedFields = fields.filter(field => {
      // This is a simplified check - in real scenario would check field values
      return true; // Placeholder
    });
    this.internalCompletedFieldCount.set(completedFields.length);

    // Count fields with errors (simplified)
    const fieldsWithErrors = fields.filter(field => {
      // This is a simplified check - in real scenario would check validation state
      return false; // Placeholder
    });
    this.internalFieldsWithErrors.set(fieldsWithErrors.length);
  }

  /** Emit state change event */
  private emitStateChange(type: FormGroupStateChangeEvent['type']): void {
    const newState = this.currentState();

    this.stateChange.emit({
      groupId: this.finalGroupId(),
      state: newState,
      previousState: newState, // Could track previous state if needed
      type,
    });
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  /** Handle toggle button click */
  toggleCollapsed(event: Event): void {
    const newCollapsed = !this.internalCollapsed();
    this.internalCollapsed.set(newCollapsed);

    this.toggleChange.emit({
      groupId: this.finalGroupId(),
      collapsed: newCollapsed,
      originalEvent: event,
    });

    this.emitStateChange('toggle');
  }

  /** Handle action button click */
  onActionClick(action: FormGroupAction, event: any): void {
    action.handler();

    this.actionClick.emit({
      groupId: this.finalGroupId(),
      action,
      originalEvent: event.event || event,
    });
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /** Format progress information */
  formatProgress(): string {
    return formatFormGroupProgress(this.progressInfo());
  }

  /** Get ARIA described by attributes */
  getAriaDescribedBy(): string | null {
    const describedBy: string[] = [];

    if (this.description()) {
      describedBy.push(this.descriptionId());
    }

    if (this.shouldShowProgressBar()) {
      describedBy.push(this.progressId());
    }

    return describedBy.length > 0 ? describedBy.join(' ') : null;
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /** Expand the group */
  expand(): void {
    if (this.collapsible() && this.internalCollapsed()) {
      this.internalCollapsed.set(false);
      this.emitStateChange('toggle');
    }
  }

  /** Collapse the group */
  collapse(): void {
    if (this.collapsible() && !this.internalCollapsed()) {
      this.internalCollapsed.set(true);
      this.emitStateChange('toggle');
    }
  }

  /** Toggle group collapsed state */
  toggleGroup(): void {
    if (this.collapsible()) {
      this.internalCollapsed.set(!this.internalCollapsed());
      this.emitStateChange('toggle');
    }
  }

  /** Get current group state */
  getState(): FormGroupState {
    return this.currentState();
  }

  /** Get current progress */
  getProgress(): FormGroupProgress {
    return this.progressInfo();
  }

  /** Check if group is collapsed */
  isCollapsed(): boolean {
    return this.internalCollapsed();
  }

  /** Check if group is expanded */
  isExpanded(): boolean {
    return !this.internalCollapsed();
  }
}
