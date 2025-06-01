import { Component, signal, computed, OnInit, inject, TemplateRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input.component';
import { SelectComponent } from '../select/select.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { CheckboxChangeEvent } from '../checkbox/checkbox.model';
import { SelectOption } from '../select/select.model';
import { FormFieldComponent } from '../form-field/form-field.component';
import { FormGroupComponent } from '../form-group/form-group.component';
import { ApiDocumentationComponent } from '../../shared/components';

import { TableComponent } from './table.component';
import {
  TableConfig,
  TableColumn,
  TableVariant,
  TableSize,
  TableBorder,
  createTableConfig,
  createTableColumn,
  formatCellValue,
  State,
  PaginationResult,
  PaginationParameters,
} from './table.model';

import {
  ShowcaseComponent,
  ComponentApiDocumentation,
  createShowcaseConfig,
  ShowcaseConfig,
} from '../../models/showcase.model';

import { StateService } from '../../../shared/state/services/state.service';

// Demo data interfaces
interface DemoUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: Date;
  avatar?: string;
  salary: number;
  department: string;
}

interface UserSearchParameters extends PaginationParameters {
  searchTerm?: string;
  status?: string;
  department?: string;
}

/**
 * Table Showcase Component
 *
 * Comprehensive demonstration of the Table component features including:
 * - All visual variants and sizes
 * - Sorting and pagination
 * - Search and filtering
 * - Row selection
 * - Custom templates
 * - Empty states and error handling
 * - API integration examples
 */
@Component({
  selector: 'ds-table-showcase',
  standalone: true,
  imports: [CommonModule, TableComponent, ButtonComponent, ApiDocumentationComponent, FormsModule],
  template: `
    <div class="showcase-container">
      <!-- Header -->
      <div class="showcase-header">
        <h1>{{ showcaseConfig().component.componentName }}</h1>
        <p class="showcase-description">
          {{ showcaseConfig().component.description }}
        </p>
      </div>

      <!-- Interactive Example -->
      <section class="showcase-section">
        <h2>Interactive Example</h2>
        <p>Try different configurations and features:</p>

        <div class="showcase-interactive">
          <!-- Configuration Panel -->
          <div class="interactive-controls">
            <div class="control-group">
              <label for="variant-select">Variant:</label>
              <select id="variant-select" [(ngModel)]="selectedVariant" class="control-input">
                @for (option of variantSelectOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label for="size-select">Size:</label>
              <select id="size-select" [(ngModel)]="selectedSize" class="control-input">
                @for (option of sizeSelectOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label for="border-select">Border:</label>
              <select id="border-select" [(ngModel)]="selectedBorder" class="control-input">
                @for (option of borderSelectOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="showSearch" />
                Show Search
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="striped" />
                Striped Rows
              </label>
            </div>

            <div class="control-group">
              <label>
                <input type="checkbox" [(ngModel)]="hoverable" />
                Hoverable Rows
              </label>
            </div>
          </div>

          <!-- Interactive Table -->
          <div class="interactive-preview">
            <ds-table
              [variant]="selectedVariant()"
              [size]="selectedSize()"
              [border]="selectedBorder()"
              [striped]="striped()"
              [hoverable]="hoverable()"
              [responsive]="responsive()"
              [showSearch]="showSearch()"
              [showRefresh]="true"
              [showPagination]="true"
              [showPageSizeSelector]="true"
              [columns]="demoColumns()"
              [dataState]="demoDataState"
              [columnTemplates]="getColumnTemplates()"
              (rowSelect)="onRowSelect($event)"
              (sortChange)="onSortChange($event)"
              (pageChange)="onPageChange($event)"
              (filterChange)="onFilterChange($event)"
              (refresh)="onRefresh()"
            />
          </div>

          <!-- Selection Info -->
          @if (selectedRows().length > 0) {
            <div class="showcase-output">
              <strong>Selected {{ selectedRows().length }} row(s):</strong>
              {{ getSelectedNames() }}
              <ds-button variant="secondary" size="sm" (clicked)="clearSelection()">
                Clear Selection
              </ds-button>
            </div>
          }
        </div>
      </section>

      <!-- Variants -->
      <section class="showcase-section">
        <h2>Table Variants</h2>
        <p>Different visual styles for various use cases:</p>

        <div class="showcase-grid">
          @for (variant of variants; track variant.value) {
            <div class="showcase-item">
              <h3>{{ variant.label }}</h3>
              <ds-table
                [variant]="variant.value"
                [columns]="basicColumns()"
                [dataState]="smallDataState"
                [showPagination]="false"
                [showSearch]="false"
                [showRefresh]="false"
              />
            </div>
          }
        </div>
      </section>

      <!-- Sizes -->
      <section class="showcase-section">
        <h2>Table Sizes</h2>
        <p>Different sizes for various layouts:</p>

        <div class="showcase-grid">
          @for (size of sizes; track size.value) {
            <div class="showcase-item">
              <h3>{{ size.label }}</h3>
              <ds-table
                [size]="size.value"
                [columns]="basicColumns()"
                [dataState]="smallDataState"
                [showPagination]="false"
                [showSearch]="false"
                [showRefresh]="false"
              />
            </div>
          }
        </div>
      </section>

      <!-- Column Types -->
      <section class="showcase-section">
        <h2>Column Types & Templates</h2>
        <p>Different column types with automatic formatting and custom templates:</p>

        <div class="showcase-item">
          <ds-table
            [columns]="typedColumns()"
            [dataState]="smallDataState"
            [columnTemplates]="getColumnTemplates()"
            [showPagination]="false"
            [showSearch]="false"
            [showRefresh]="false"
          />
        </div>
      </section>

      <!-- Empty States -->
      <section class="showcase-section">
        <h2>Empty States & Error Handling</h2>
        <p>How the table handles different states:</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Loading State</h3>
            <ds-table
              [columns]="basicColumns()"
              [dataState]="loadingDataState"
              [showPagination]="false"
              [showSearch]="false"
              [showRefresh]="false"
            />
          </div>

          <div class="showcase-item">
            <h3>Empty State</h3>
            <ds-table
              [columns]="basicColumns()"
              [dataState]="emptyDataState"
              [showPagination]="false"
              [showSearch]="false"
              [showRefresh]="false"
            />
          </div>

          <div class="showcase-item">
            <h3>Error State</h3>
            <ds-table
              [columns]="basicColumns()"
              [dataState]="errorDataState"
              [showPagination]="false"
              [showSearch]="false"
              [showRefresh]="false"
              [showRetry]="true"
            />
          </div>
        </div>
      </section>

      <!-- Component API -->
      <section class="showcase-section">
        <h2>Component API</h2>
        <ds-api-documentation [api]="showcaseConfig().api" />
      </section>

      <!-- Templates for custom columns -->
      <ng-template #statusTemplate let-row let-column="column" let-value="value">
        <span class="status-badge" [class]="'status-badge--' + value">
          {{ value | titlecase }}
        </span>
      </ng-template>

      <ng-template #avatarTemplate let-row let-column="column" let-value="value">
        <div class="avatar">
          @if (row.avatar) {
            <img [src]="row.avatar" [alt]="row.name" />
          } @else {
            <div class="avatar-initials">
              {{ getInitials(row.name) }}
            </div>
          }
        </div>
      </ng-template>

      <ng-template #salaryTemplate let-row let-column="column" let-value="value">
        <span class="salary">
          {{ value | currency: 'USD' : 'symbol' : '1.0-0' }}
        </span>
      </ng-template>

      <ng-template #actionsTemplate let-row let-column="column">
        <div class="table-actions">
          <ds-button
            variant="ghost"
            size="sm"
            iconStart="✏️"
            (clicked)="editUser(row)"
            ariaLabel="Edit user"
          />
          <ds-button
            variant="ghost"
            size="sm"
            iconStart="🗑️"
            (clicked)="deleteUser(row)"
            ariaLabel="Delete user"
          />
        </div>
      </ng-template>
    </div>
  `,
  styleUrl: '../../shared/styles/showcase.scss',
})
export class TableShowcaseComponent implements ShowcaseComponent, OnInit {
  componentName = 'Table Component';
  description =
    'Modern data table component with sorting, pagination, filtering, and selection. Compatible with existing data sources while providing advanced features.';

  private readonly stateService = inject(StateService);

  // Template references
  statusTemplate = viewChild<TemplateRef<any>>('statusTemplate');
  avatarTemplate = viewChild<TemplateRef<any>>('avatarTemplate');
  salaryTemplate = viewChild<TemplateRef<any>>('salaryTemplate');
  actionsTemplate = viewChild<TemplateRef<any>>('actionsTemplate');

  // =============================================================================
  // SHOWCASE DATA
  // =============================================================================

  readonly variantSelectOptions = [
    { value: 'default', label: 'Default' },
    { value: 'bordered', label: 'Bordered' },
    { value: 'borderless', label: 'Borderless' },
    { value: 'compact', label: 'Compact' },
    { value: 'comfortable', label: 'Comfortable' },
  ];

  readonly sizeSelectOptions = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
  ];

  readonly borderSelectOptions = [
    { value: 'none', label: 'None' },
    { value: 'horizontal', label: 'Horizontal' },
    { value: 'vertical', label: 'Vertical' },
    { value: 'all', label: 'All' },
    { value: 'outer', label: 'Outer' },
  ];

  readonly variants = [
    { value: 'default' as TableVariant, label: 'Default' },
    { value: 'bordered' as TableVariant, label: 'Bordered' },
    { value: 'borderless' as TableVariant, label: 'Borderless' },
    { value: 'compact' as TableVariant, label: 'Compact' },
    { value: 'comfortable' as TableVariant, label: 'Comfortable' },
  ];

  readonly sizes = [
    { value: 'sm' as TableSize, label: 'Small' },
    { value: 'md' as TableSize, label: 'Medium' },
    { value: 'lg' as TableSize, label: 'Large' },
  ];

  // =============================================================================
  // INTERACTIVE CONTROLS
  // =============================================================================

  selectedVariant = signal<TableVariant>('default');
  selectedSize = signal<TableSize>('md');
  selectedBorder = signal<TableBorder>('horizontal');
  showSearch = signal<boolean>(true);
  striped = signal<boolean>(false);
  hoverable = signal<boolean>(true);
  responsive = signal<boolean>(true);

  // =============================================================================
  // SHOWCASE STATE
  // =============================================================================

  selectedRows = signal<DemoUser[]>([]);
  protected readonly lastActionSignal = signal<string>('');

  // Getter to implement ShowcaseComponent interface
  get lastAction(): string {
    return this.lastActionSignal();
  }

  // Data states
  demoDataState = this.stateService.createState<PaginationResult<DemoUser>>();
  smallDataState = this.stateService.createState<PaginationResult<DemoUser>>();
  loadingDataState = this.stateService.createState<PaginationResult<DemoUser>>();
  emptyDataState = this.stateService.createState<PaginationResult<DemoUser>>();
  errorDataState = this.stateService.createState<PaginationResult<DemoUser>>();

  // =============================================================================
  // COLUMN CONFIGURATIONS
  // =============================================================================

  demoColumns = computed((): TableColumn<DemoUser>[] => [
    createTableColumn({
      field: 'avatar',
      header: '',
      width: '60px',
      sortable: false,
      template: 'avatarTemplate',
      type: 'image',
    }),
    createTableColumn({
      field: 'name',
      header: 'Name',
      sortable: true,
    }),
    createTableColumn({
      field: 'email',
      header: 'Email',
      sortable: true,
      hideOnMobile: true,
    }),
    createTableColumn({
      field: 'role',
      header: 'Role',
      sortable: true,
      hideOnTablet: true,
    }),
    createTableColumn({
      field: 'status',
      header: 'Status',
      width: '120px',
      sortable: true,
      template: 'statusTemplate',
      type: 'badge',
    }),
    createTableColumn({
      field: 'salary',
      header: 'Salary',
      width: '120px',
      sortable: true,
      template: 'salaryTemplate',
      type: 'currency',
      align: 'right',
      hideOnMobile: true,
    }),
    createTableColumn({
      field: 'actions',
      header: 'Actions',
      width: '100px',
      sortable: false,
      template: 'actionsTemplate',
      type: 'actions',
    }),
  ]);

  basicColumns = computed((): TableColumn<DemoUser>[] => [
    createTableColumn({
      field: 'name',
      header: 'Name',
      sortable: true,
    }),
    createTableColumn({
      field: 'email',
      header: 'Email',
      sortable: true,
    }),
    createTableColumn({
      field: 'role',
      header: 'Role',
      sortable: true,
    }),
  ]);

  typedColumns = computed((): TableColumn<DemoUser>[] => [
    createTableColumn({
      field: 'name',
      header: 'Text',
      type: 'text',
    }),
    createTableColumn({
      field: 'salary',
      header: 'Currency',
      type: 'currency',
      align: 'right',
    }),
    createTableColumn({
      field: 'lastLogin',
      header: 'Date',
      type: 'date',
    }),
    createTableColumn({
      field: 'status',
      header: 'Badge',
      type: 'badge',
      template: 'statusTemplate',
    }),
  ]);

  // =============================================================================
  // DEMO DATA
  // =============================================================================

  private readonly demoUsers: DemoUser[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Senior Developer',
      status: 'active',
      lastLogin: new Date('2024-01-15'),
      salary: 85000,
      department: 'Engineering',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'Product Manager',
      status: 'active',
      lastLogin: new Date('2024-01-14'),
      salary: 95000,
      department: 'Product',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@company.com',
      role: 'UX Designer',
      status: 'pending',
      lastLogin: new Date('2024-01-10'),
      salary: 70000,
      department: 'Design',
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice.brown@company.com',
      role: 'DevOps Engineer',
      status: 'inactive',
      lastLogin: new Date('2024-01-05'),
      salary: 80000,
      department: 'Engineering',
    },
    {
      id: 5,
      name: 'Charlie Wilson',
      email: 'charlie.wilson@company.com',
      role: 'Marketing Manager',
      status: 'active',
      lastLogin: new Date('2024-01-16'),
      salary: 75000,
      department: 'Marketing',
    },
  ];

  // =============================================================================
  // SHOWCASE CONFIGURATION
  // =============================================================================

  readonly showcaseConfig = computed<ShowcaseConfig>(() => {
    const componentInfo: ShowcaseComponent = {
      componentName: this.componentName,
      description: this.description,
      lastAction: this.lastAction,
    };

    const apiDocumentation: ComponentApiDocumentation = {
      inputs: [
        {
          name: 'variant',
          type: 'TableVariant',
          defaultValue: 'default',
          description: 'Visual style variant of the table',
          examples: ['default', 'bordered', 'borderless', 'compact', 'comfortable'],
        },
        {
          name: 'size',
          type: 'TableSize',
          defaultValue: 'md',
          description: 'Size of the table elements',
          examples: ['sm', 'md', 'lg'],
        },
        {
          name: 'border',
          type: 'TableBorder',
          defaultValue: 'horizontal',
          description: 'Border style configuration',
          examples: ['none', 'horizontal', 'vertical', 'all', 'outer'],
        },
        {
          name: 'columns',
          type: 'TableColumn[]',
          description: 'Column definitions array',
          examples: ['[{ field: "name", header: "Name", sortable: true }]'],
        },
        {
          name: 'dataState',
          type: 'Signal<State<PaginationResult>>',
          description: 'Data state signal with loading, error, and pagination info',
        },
        {
          name: 'showSearch',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether to show search input',
        },
        {
          name: 'showPagination',
          type: 'boolean',
          defaultValue: 'true',
          description: 'Whether to show pagination controls',
        },
        {
          name: 'striped',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether table rows are striped',
        },
        {
          name: 'hoverable',
          type: 'boolean',
          defaultValue: 'true',
          description: 'Whether table rows are hoverable',
        },
        {
          name: 'responsive',
          type: 'boolean',
          defaultValue: 'true',
          description: 'Whether table is responsive',
        },
      ],
      outputs: [
        {
          name: 'rowSelect',
          type: 'TableRowSelectEvent',
          description: 'Emitted when row selection changes',
          examples: ['{ item, selectedItems, originalEvent }'],
        },
        {
          name: 'sortChange',
          type: 'TableSortEvent',
          description: 'Emitted when column sort changes',
          examples: ['{ field, direction, originalEvent }'],
        },
        {
          name: 'pageChange',
          type: 'TablePageEvent',
          description: 'Emitted when page or page size changes',
          examples: ['{ page, pageSize, totalRecords, originalEvent }'],
        },
        {
          name: 'filterChange',
          type: 'TableFilterEvent',
          description: 'Emitted when filters change',
          examples: ['{ field, value, filters, originalEvent }'],
        },
        {
          name: 'refresh',
          type: 'void',
          description: 'Emitted when refresh button is clicked',
        },
      ],
      methods: [
        {
          name: 'goToPage',
          signature: 'goToPage(page: number): void',
          description: 'Navigate to specific page',
        },
        {
          name: 'clearSelection',
          signature: 'clearSelection(): void',
          description: 'Clear all selected rows',
        },
        {
          name: 'selectAll',
          signature: 'selectAll(): void',
          description: 'Select all visible rows',
        },
        {
          name: 'getSelectedItems',
          signature: 'getSelectedItems(): T[]',
          description: 'Get currently selected items',
          returnType: 'T[]',
        },
      ],
    };

    return createShowcaseConfig(componentInfo, apiDocumentation);
  });

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  ngOnInit(): void {
    this.initializeDataStates();
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  onRowSelect(event: any): void {
    this.selectedRows.set(event.selectedItems);
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(
      `Row selection changed at ${timestamp} - Selected: ${event.selectedItems.length} items`,
    );
  }

  onSortChange(event: any): void {
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(
      `Sort changed at ${timestamp} - Field: ${event.field}, Direction: ${event.direction}`,
    );
  }

  onPageChange(event: any): void {
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(
      `Page changed at ${timestamp} - Page: ${event.page}, Size: ${event.pageSize}`,
    );
  }

  onFilterChange(event: any): void {
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(
      `Filter changed at ${timestamp} - Field: ${event.field}, Value: ${event.value}`,
    );
  }

  onRefresh(): void {
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(`Table refreshed at ${timestamp}`);
  }

  clearSelection(): void {
    this.selectedRows.set([]);
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(`Selection cleared at ${timestamp}`);
  }

  editUser(user: DemoUser): void {
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(`Edit user "${user.name}" at ${timestamp}`);
  }

  deleteUser(user: DemoUser): void {
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(`Delete user "${user.name}" at ${timestamp}`);
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  getColumnTemplates(): Record<string, TemplateRef<any>> {
    return {
      statusTemplate: this.statusTemplate()!,
      avatarTemplate: this.avatarTemplate()!,
      salaryTemplate: this.salaryTemplate()!,
      actionsTemplate: this.actionsTemplate()!,
    };
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  getSelectedNames(): string {
    return this.selectedRows()
      .map(r => r.name)
      .join(', ');
  }

  private initializeDataStates(): void {
    // Demo data state
    this.demoDataState.set({
      isInitial: false,
      isLoading: false,
      isError: false,
      error: undefined,
      data: {
        items: this.demoUsers,
        totalCount: this.demoUsers.length,
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        hasPrevious: false,
        hasNext: false,
      },
    });

    // Small data state (for examples)
    this.smallDataState.set({
      isInitial: false,
      isLoading: false,
      isError: false,
      error: undefined,
      data: {
        items: this.demoUsers.slice(0, 3),
        totalCount: 3,
        currentPage: 1,
        pageSize: 3,
        totalPages: 1,
        hasPrevious: false,
        hasNext: false,
      },
    });

    // Loading state
    this.loadingDataState.set({
      isInitial: false,
      isLoading: true,
      isError: false,
      error: undefined,
      data: undefined,
    });

    // Empty state
    this.emptyDataState.set({
      isInitial: false,
      isLoading: false,
      isError: false,
      error: undefined,
      data: {
        items: [],
        totalCount: 0,
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        hasPrevious: false,
        hasNext: false,
      },
    });

    // Error state
    this.errorDataState.set({
      isInitial: false,
      isLoading: false,
      isError: true,
      error: 'Failed to load data. Please try again.',
      data: undefined,
    });
  }
}
