import {
  Component,
  input,
  computed,
  inject,
  TemplateRef,
  viewChild,
  WritableSignal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableComponent } from '../../../ui/table/table.component';
import {
  createTableColumn,
  TableColumn,
  PaginationResult,
  State,
} from '../../../ui/table/table.model';
import { StateService } from '../../../../shared/state/services/state.service';

import {
  ComponentApiDocumentation,
  ComponentInput,
  ComponentOutput,
  ComponentMethod,
  ComponentCssProperty,
} from '../../../models/showcase.model';

/**
 * API Documentation Component
 *
 * Displays component API documentation in a clean table format.
 * Shows inputs, outputs, and methods with type information and descriptions.
 */
@Component({
  selector: 'ds-api-documentation',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <div class="api-documentation">
      @if (api().inputs.length) {
        <section class="api-section">
          <h3>Inputs</h3>
          <ds-table
            [columns]="inputColumns"
            [dataState]="inputsState"
            [columnTemplates]="getColumnTemplates()"
            [variant]="'borderless'"
            [size]="'sm'"
            [showSearch]="false"
            [showPagination]="false"
            [showRefresh]="false"
          />
        </section>
      }

      @if (api().outputs.length) {
        <section class="api-section">
          <h3>Outputs</h3>
          <ds-table
            [columns]="outputColumns"
            [dataState]="outputsState"
            [columnTemplates]="getColumnTemplates()"
            [variant]="'borderless'"
            [size]="'sm'"
            [showSearch]="false"
            [showPagination]="false"
            [showRefresh]="false"
          />
        </section>
      }

      @if (api().methods?.length) {
        <section class="api-section">
          <h3>Methods</h3>
          <ds-table
            [columns]="methodColumns"
            [dataState]="methodsState"
            [columnTemplates]="getColumnTemplates()"
            [variant]="'borderless'"
            [size]="'sm'"
            [showSearch]="false"
            [showPagination]="false"
            [showRefresh]="false"
          />
        </section>
      }

      @if (api().cssProperties?.length) {
        <section class="api-section">
          <h3>CSS Properties</h3>
          <ds-table
            [columns]="cssColumns"
            [dataState]="cssState"
            [columnTemplates]="getColumnTemplates()"
            [variant]="'borderless'"
            [size]="'sm'"
            [showSearch]="false"
            [showPagination]="false"
            [showRefresh]="false"
          />
        </section>
      }
    </div>

    <!-- Templates for custom cell rendering -->
    <ng-template #nameTemplate let-row let-column="column" let-value="value">
      <code>{{ value }}</code>
    </ng-template>

    <ng-template #typeTemplate let-row let-column="column" let-value="value">
      <code>{{ value }}</code>
    </ng-template>

    <ng-template #defaultTemplate let-row let-column="column" let-value="value">
      @if (value) {
        <code>{{ value }}</code>
      } @else {
        <span class="text-muted">—</span>
      }
    </ng-template>

    <ng-template #requiredTemplate let-row let-column="column" let-value="value">
      @if (value) {
        <span class="badge badge--success">Required</span>
      } @else {
        <span class="badge badge--secondary">Optional</span>
      }
    </ng-template>

    <ng-template #descriptionTemplate let-row let-column="column" let-value="value">
      {{ value }}
    </ng-template>

    <ng-template #signatureTemplate let-row let-column="column" let-value="value">
      <code>{{ value }}</code>
    </ng-template>
  `,
  styleUrl: './api-documentation.component.scss',
})
export class ApiDocumentationComponent {
  // =============================================================================
  // INPUTS
  // =============================================================================

  /** API documentation data */
  api = input.required<ComponentApiDocumentation>();

  // =============================================================================
  // DEPENDENCIES
  // =============================================================================

  private readonly stateService = inject(StateService);

  // =============================================================================
  // TEMPLATE REFERENCES
  // =============================================================================

  nameTemplate = viewChild<TemplateRef<any>>('nameTemplate');
  typeTemplate = viewChild<TemplateRef<any>>('typeTemplate');
  defaultTemplate = viewChild<TemplateRef<any>>('defaultTemplate');
  requiredTemplate = viewChild<TemplateRef<any>>('requiredTemplate');
  descriptionTemplate = viewChild<TemplateRef<any>>('descriptionTemplate');
  signatureTemplate = viewChild<TemplateRef<any>>('signatureTemplate');

  // =============================================================================
  // TABLE COLUMNS
  // =============================================================================

  readonly inputColumns: TableColumn<ComponentInput>[] = [
    createTableColumn({
      field: 'name',
      header: 'Name',
      width: '150px',
      template: 'nameTemplate',
    }),
    createTableColumn({
      field: 'type',
      header: 'Type',
      width: '150px',
      template: 'typeTemplate',
    }),
    createTableColumn({
      field: 'defaultValue',
      header: 'Default',
      width: '100px',
      template: 'defaultTemplate',
    }),
    createTableColumn({
      field: 'required',
      header: 'Required',
      width: '80px',
      template: 'requiredTemplate',
    }),
    createTableColumn({
      field: 'description',
      header: 'Description',
      template: 'descriptionTemplate',
    }),
  ];

  readonly outputColumns: TableColumn<ComponentOutput>[] = [
    createTableColumn({
      field: 'name',
      header: 'Name',
      width: '150px',
      template: 'nameTemplate',
    }),
    createTableColumn({
      field: 'type',
      header: 'Type',
      width: '200px',
      template: 'typeTemplate',
    }),
    createTableColumn({
      field: 'description',
      header: 'Description',
      template: 'descriptionTemplate',
    }),
  ];

  readonly methodColumns: TableColumn<ComponentMethod>[] = [
    createTableColumn({
      field: 'name',
      header: 'Name',
      width: '150px',
      template: 'nameTemplate',
    }),
    createTableColumn({
      field: 'signature',
      header: 'Signature',
      width: '300px',
      template: 'signatureTemplate',
    }),
    createTableColumn({
      field: 'description',
      header: 'Description',
      template: 'descriptionTemplate',
    }),
  ];

  readonly cssColumns: TableColumn<ComponentCssProperty>[] = [
    createTableColumn({
      field: 'name',
      header: 'Property',
      width: '200px',
      template: 'nameTemplate',
    }),
    createTableColumn({
      field: 'defaultValue',
      header: 'Default Value',
      width: '150px',
      template: 'defaultTemplate',
    }),
    createTableColumn({
      field: 'description',
      header: 'Description',
      template: 'descriptionTemplate',
    }),
  ];

  // =============================================================================
  // TABLE STATES
  // =============================================================================

  readonly inputsState: WritableSignal<State<PaginationResult<ComponentInput>>> =
    this.stateService.createState<PaginationResult<ComponentInput>>();
  readonly outputsState: WritableSignal<State<PaginationResult<ComponentOutput>>> =
    this.stateService.createState<PaginationResult<ComponentOutput>>();
  readonly methodsState: WritableSignal<State<PaginationResult<ComponentMethod>>> =
    this.stateService.createState<PaginationResult<ComponentMethod>>();
  readonly cssState: WritableSignal<State<PaginationResult<ComponentCssProperty>>> =
    this.stateService.createState<PaginationResult<ComponentCssProperty>>();

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  private apiData = computed(() => {
    const api = this.api();
    return api;
  });

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  constructor() {
    // Use effect to update table states when API data changes
    effect(() => {
      const api = this.apiData();
      this.updateTableStates(api);
    });
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  getColumnTemplates(): Record<string, TemplateRef<any>> {
    return {
      nameTemplate: this.nameTemplate()!,
      typeTemplate: this.typeTemplate()!,
      defaultTemplate: this.defaultTemplate()!,
      requiredTemplate: this.requiredTemplate()!,
      descriptionTemplate: this.descriptionTemplate()!,
      signatureTemplate: this.signatureTemplate()!,
    };
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  private updateTableStates(api: ComponentApiDocumentation): void {
    // Initialize inputs table
    if (api.inputs?.length) {
      this.inputsState.set({
        isInitial: false,
        isLoading: false,
        isError: false,
        error: undefined,
        data: {
          items: api.inputs,
          currentPage: 1,
          pageSize: api.inputs.length,
          totalCount: api.inputs.length,
          totalPages: 1,
          hasPrevious: false,
          hasNext: false,
        },
      });
    }

    // Initialize outputs table
    if (api.outputs?.length) {
      this.outputsState.set({
        isInitial: false,
        isLoading: false,
        isError: false,
        error: undefined,
        data: {
          items: api.outputs,
          currentPage: 1,
          pageSize: api.outputs.length,
          totalCount: api.outputs.length,
          totalPages: 1,
          hasPrevious: false,
          hasNext: false,
        },
      });
    }

    // Initialize methods table
    if (api.methods?.length) {
      this.methodsState.set({
        isInitial: false,
        isLoading: false,
        isError: false,
        error: undefined,
        data: {
          items: api.methods,
          currentPage: 1,
          pageSize: api.methods.length,
          totalCount: api.methods.length,
          totalPages: 1,
          hasPrevious: false,
          hasNext: false,
        },
      });
    }

    // Initialize CSS properties table
    if (api.cssProperties?.length) {
      this.cssState.set({
        isInitial: false,
        isLoading: false,
        isError: false,
        error: undefined,
        data: {
          items: api.cssProperties,
          currentPage: 1,
          pageSize: api.cssProperties.length,
          totalCount: api.cssProperties.length,
          totalPages: 1,
          hasPrevious: false,
          hasNext: false,
        },
      });
    }
  }
}
