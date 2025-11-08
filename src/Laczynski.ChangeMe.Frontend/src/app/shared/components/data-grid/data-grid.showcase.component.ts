import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataGridComponent } from './data-grid.component';
import { DataGridColumn, DataGridRow } from './models/data-grid-column.model';
import { DataGridActiveFilter } from './models/data-grid-filter.model';
import { DataGridApiService } from './services/data-grid-api.service';

interface SampleData {
  id: string;
  name: string;
  type: string;
  modified: string;
  modifiedBy: string;
  size: string;
  status: string;
}

@Component({
  selector: 'app-data-grid-showcase',

  imports: [CommonModule, DataGridComponent],
  template: `
    <div class="showcase">
      <h1>DataGrid Component</h1>
      <p class="showcase__description">
        A flexible and feature-rich data grid component following Fluent 2 Design System principles.
        Supports selection, custom cell rendering, and more.
      </p>

      <!-- Basic Example -->
      <section class="showcase__section">
        <h2>Basic DataGrid</h2>
        <p>Simple data grid with text columns.</p>
        <div class="showcase__example">
          <app-data-grid [columns]="basicColumns" [rows]="basicRows" [hoverable]="true" />
        </div>
      </section>

      <!-- Selectable Example -->
      <section class="showcase__section">
        <h2>Selectable DataGrid</h2>
        <p>Data grid with row selection (multi-select).</p>
        <div class="showcase__example">
          <app-data-grid
            [columns]="basicColumns"
            [rows]="basicRows"
            [selectable]="true"
            [multiSelect]="true"
            [hoverable]="true"
            (selectionChange)="onSelectionChange($event)"
          />
        </div>
        @if (selectedCount > 0) {
          <p class="showcase__info">Selected rows: {{ selectedCount }}</p>
        }
      </section>

      <!-- Size Variants -->
      <section class="showcase__section">
        <h2>Size Variants</h2>
        <p>Data grid supports three size variants: small, medium (default), and large.</p>
        <div class="showcase__example">
          <app-data-grid
            [columns]="basicColumns"
            [rows]="basicRows.slice(0, 3)"
            [size]="'medium'"
            [hoverable]="true"
          />
        </div>
      </section>

      <!-- Style Variants -->
      <section class="showcase__section">
        <h2>Style Variants</h2>
        <p>Data grid supports striped and bordered styles.</p>
        <div class="showcase__example">
          <app-data-grid
            [columns]="basicColumns"
            [rows]="basicRows"
            [striped]="true"
            [bordered]="true"
            [hoverable]="true"
          />
        </div>
      </section>

      <!-- Loading State -->
      <section class="showcase__section">
        <h2>Loading State</h2>
        <p>Data grid with loading state component.</p>
        <div class="showcase__example">
          <app-data-grid
            [columns]="basicColumns"
            [rows]="[]"
            [loading]="true"
            [loadingTitle]="'Loading data...'"
            [loadingDescription]="'Please wait while we fetch your data.'"
          />
        </div>
      </section>

      <!-- Empty State -->
      <section class="showcase__section">
        <h2>Empty State</h2>
        <p>Data grid with empty state component.</p>
        <div class="showcase__example">
          <app-data-grid
            [columns]="basicColumns"
            [rows]="[]"
            [emptyTitle]="'No files found'"
            [emptyDescription]="'Upload your first file to get started.'"
            [emptyIcon]="'folder_open'"
            [emptyPrimaryAction]="emptyPrimaryAction"
            [emptySecondaryAction]="emptySecondaryAction"
            (emptyActionClick)="onEmptyActionClick($event)"
          />
        </div>
      </section>

      <!-- Error State -->
      <section class="showcase__section">
        <h2>Error State</h2>
        <p>Data grid with error state component.</p>
        <div class="showcase__example">
          <app-data-grid
            [columns]="basicColumns"
            [rows]="[]"
            [error]="true"
            [errorTitle]="'Connection Error'"
            [errorDescription]="
              'Unable to connect to the server. Please check your connection and try again.'
            "
            [errorPrimaryAction]="errorPrimaryAction"
            [errorSecondaryAction]="errorSecondaryAction"
            (errorActionClick)="onErrorActionClick($event)"
          />
        </div>
      </section>

      <!-- Sticky Headers -->
      <section class="showcase__section">
        <h2>Sticky Headers</h2>
        <p>
          Data grid with sticky headers that remain visible when scrolling. Scroll down to see the
          headers stay fixed at the top.
        </p>
        <div class="showcase__example showcase__example--scrollable">
          <app-data-grid
            [columns]="sortableColumns"
            [rows]="stickyHeadersRows"
            [stickyHeaders]="true"
            [hoverable]="true"
            (sortChange)="onSortChange($event)"
          />
        </div>
        @if (currentSort()) {
          <p class="showcase__info">
            Current sort: {{ currentSort()?.field }} ({{ currentSort()?.direction }})
          </p>
        }
      </section>

      <!-- Sortable Columns -->
      <section class="showcase__section">
        <h2>Sortable Columns</h2>
        <p>Data grid with sortable column headers. Click on column headers to sort.</p>
        <div class="showcase__example">
          <app-data-grid
            [columns]="sortableColumns"
            [rows]="basicRows"
            [hoverable]="true"
            (sortChange)="onSortChange($event)"
          />
        </div>
        @if (currentSort()) {
          <p class="showcase__info">
            Current sort: {{ currentSort()?.field }} ({{ currentSort()?.direction }})
          </p>
        }
      </section>

      <!-- Filtering -->
      <section class="showcase__section">
        <h2>Filtering</h2>
        <p>
          Data grid with filtering enabled. Each column can have different filter types: text,
          number, date, select, multi-select, and boolean. Filters are applied in real-time with
          debouncing for text inputs.
        </p>
        <div class="showcase__example">
          <app-data-grid
            [columns]="filterableColumns"
            [rows]="filterableRows"
            [hoverable]="true"
            (filterChange)="onFilterChange($event)"
          />
        </div>
        @if (activeFilters().length > 0) {
          <p class="showcase__info">
            Active filters: {{ activeFilters().length }}
            <br />
            @for (filter of activeFilters(); track filter.columnId) {
              <span
                style="display: inline-block; margin-right: 8px; margin-top: 4px; padding: 4px 8px; background: #e1e1e1; border-radius: 4px; font-size: 0.875rem;"
              >
                {{ filter.displayText }}
              </span>
            }
          </p>
        }
      </section>

      <!-- Expandable Rows -->
      <section class="showcase__section">
        <h2>Expandable Rows (Master-Details)</h2>
        <p>Data grid with expandable rows showing additional details when expanded.</p>
        <div class="showcase__example">
          <app-data-grid
            [columns]="basicColumns"
            [rows]="expandableRows"
            [expandable]="true"
            [hoverable]="true"
            (rowExpand)="onRowExpand($event)"
            (rowCollapse)="onRowCollapse($event)"
          >
            <ng-template #rowDetailsTemplate let-row>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="display: grid; grid-template-columns: 150px 1fr; gap: 8px;">
                  <strong>Modified By:</strong>
                  <span>{{ row.data.modifiedBy }}</span>
                </div>
                <div style="display: grid; grid-template-columns: 150px 1fr; gap: 8px;">
                  <strong>Status:</strong>
                  <span>{{ row.data.status }}</span>
                </div>
                <div style="display: grid; grid-template-columns: 150px 1fr; gap: 8px;">
                  <strong>File Size:</strong>
                  <span>{{ row.data.size }}</span>
                </div>
                <div style="margin-top: 8px; padding-top: 12px; border-top: 1px solid #d1d1d1;">
                  <p style="margin: 0; color: #424242;">
                    This is additional information about <strong>{{ row.data.name }}</strong
                    >. You can display any custom content here, such as metadata, actions, or nested
                    data.
                  </p>
                </div>
              </div>
            </ng-template>
          </app-data-grid>
        </div>
        @if (expandedRowInfo()) {
          <p class="showcase__info">{{ expandedRowInfo() }}</p>
        }
      </section>

      <!-- Pagination -->
      <section class="showcase__section">
        <h2>Pagination</h2>
        <p>Data grid with pagination controls. Navigate through pages and change page size.</p>
        <div class="showcase__example">
          <app-data-grid
            [columns]="basicColumns"
            [rows]="paginatedRows()"
            [enablePagination]="true"
            [totalCount]="paginatedTotalCount"
            [currentPage]="currentPage()"
            [pageSize]="pageSize()"
            [pageSizeOptions]="[5, 10, 20, 50]"
            [hoverable]="true"
            (pageChange)="onPageChange($event)"
            (pageSizeChange)="onPageSizeChange($event)"
          />
        </div>
        @if (currentPage() || pageSize()) {
          <p class="showcase__info">
            Current page: {{ currentPage() }}, Page size: {{ pageSize() }}, Total items:
            {{ paginatedTotalCount }}
            Current page: {{ currentPage() }}, Page size: {{ pageSize() }}, Total items:
            {{ paginatedTotalCount }}
          </p>
        }
      </section>

      <!-- Virtualization -->
      <section class="showcase__section">
        <h2>Virtualization (Large Datasets)</h2>
        <p>
          Data grid with virtualization enabled. Only visible rows are rendered, providing better
          performance for large datasets. This example shows 1000 rows with smooth scrolling.
        </p>
        <div class="showcase__example showcase__example--virtualized">
          <app-data-grid
            [columns]="sortableColumns"
            [rows]="virtualizedRows"
            [virtualizationItemHeight]="48"
            [hoverable]="true"
            [striped]="true"
            [stickyHeaders]="true"
            (sortChange)="onSortChange($event)"
          />
        </div>
        <p class="showcase__info">
          Virtualization enabled: {{ virtualizedRows.length }} rows rendered efficiently. Only
          visible rows are in the DOM, improving performance for large datasets.
        </p>
      </section>

      <!-- Virtualization with Selection -->
      <section class="showcase__section">
        <h2>Virtualization with Selection</h2>
        <p>
          Virtualized data grid with row selection enabled. Selection works seamlessly with
          virtualization.
        </p>
        <div class="showcase__example showcase__example--virtualized">
          <app-data-grid
            [columns]="sortableColumns"
            [rows]="virtualizedRows.slice(0, 500)"
            [virtualizationItemHeight]="48"
            [selectable]="true"
            [multiSelect]="true"
            [hoverable]="true"
            [striped]="true"
            [stickyHeaders]="true"
            (selectionChange)="onVirtualizedSelectionChange($event)"
            (sortChange)="onSortChange($event)"
          />
        </div>
        @if (virtualizedSelectedCount > 0) {
          <p class="showcase__info">
            Selected rows: {{ virtualizedSelectedCount }} (out of 500 rows)
          </p>
        }
      </section>

      <!-- Virtualization Comparison -->
      <section class="showcase__section">
        <h2>Virtualization vs Standard Rendering</h2>
        <p>
          Compare the performance difference. The virtualized version only renders visible rows,
          while the standard version renders all rows.
        </p>
        <div class="showcase__grid showcase__grid--two-columns">
          <div class="showcase__item">
            <h3>With Virtualization (Recommended for 100+ rows)</h3>
            <div class="showcase__example showcase__example--virtualized">
              <app-data-grid
                [columns]="basicColumns"
                [rows]="comparisonRows"
                [virtualizationItemHeight]="48"
                [hoverable]="true"
                [striped]="true"
              />
            </div>
            <p class="showcase__info">
              {{ comparisonRows.length }} rows - Only visible rows rendered (better performance)
            </p>
          </div>
          <div class="showcase__item">
            <h3>Without Virtualization (Standard)</h3>
            <div class="showcase__example showcase__example--scrollable">
              <app-data-grid
                [columns]="basicColumns"
                [rows]="comparisonRows.slice(0, 50)"
                [hoverable]="true"
                [striped]="true"
              />
            </div>
            <p class="showcase__info">50 rows - All rows rendered (may be slower with 100+ rows)</p>
          </div>
        </div>
      </section>

      <!-- Full Featured Example -->
      <section class="showcase__section">
        <h2>Full Featured DataGrid</h2>
        <p>
          Complete data grid with all features enabled: selection, sorting, sticky headers,
          expandable rows, and pagination.
        </p>
        <div class="showcase__example showcase__example">
          <app-data-grid
            [columns]="sortableColumns"
            [rows]="fullFeaturedRows()"
            [selectable]="true"
            [multiSelect]="true"
            [stickyHeaders]="true"
            [expandable]="true"
            [enablePagination]="true"
            [totalCount]="fullFeaturedTotalCount"
            [currentPage]="fullFeaturedCurrentPage()"
            [pageSize]="fullFeaturedPageSize()"
            [pageSizeOptions]="[5, 10, 20, 50]"
            [striped]="true"
            [bordered]="true"
            [hoverable]="true"
            (selectionChange)="onSelectionChange($event)"
            (sortChange)="onSortChange($event)"
            (rowExpand)="onRowExpand($event)"
            (rowCollapse)="onRowCollapse($event)"
            (pageChange)="onFullFeaturedPageChange($event)"
            (pageSizeChange)="onFullFeaturedPageSizeChange($event)"
          >
            <ng-template #rowDetailsTemplate let-row>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="display: grid; grid-template-columns: 150px 1fr; gap: 8px;">
                  <strong>Modified By:</strong>
                  <span>{{ row.data.modifiedBy }}</span>
                </div>
                <div style="display: grid; grid-template-columns: 150px 1fr; gap: 8px;">
                  <strong>Status:</strong>
                  <span>{{ row.data.status }}</span>
                </div>
                <div style="display: grid; grid-template-columns: 150px 1fr; gap: 8px;">
                  <strong>File Size:</strong>
                  <span>{{ row.data.size }}</span>
                </div>
              </div>
            </ng-template>
          </app-data-grid>
        </div>
      </section>

      <!-- API Integration Example -->
      <section class="showcase__section">
        <h2>API Integration (Server-Side Processing)</h2>
        <p>
          Data grid connected to a simulated API service. Sorting, filtering, and pagination are
          handled server-side. The API service simulates network delay (500-1000ms) and processes
          requests on the server.
        </p>
        <div class="showcase__example">
          <app-data-grid
            [columns]="apiColumns"
            [rows]="apiRows()"
            [loading]="apiLoading()"
            [loadingTitle]="'Loading data...'"
            [loadingDescription]="'Fetching data from server...'"
            [loadingSpinnerSize]="'medium'"
            [enablePagination]="true"
            [totalCount]="apiTotalCount()"
            [currentPage]="apiCurrentPage()"
            [pageSize]="apiPageSize()"
            [pageSizeOptions]="[5, 10, 20, 50]"
            [striped]="true"
            [bordered]="true"
            [hoverable]="true"
            (sortChange)="onApiSortChange($event)"
            (filterChange)="onApiFilterChange($event)"
            (pageChange)="onApiPageChange($event)"
            (pageSizeChange)="onApiPageSizeChange($event)"
          />
        </div>
        @if (apiActiveFilters().length > 0 || apiCurrentSort()) {
          <p class="showcase__info">
            @if (apiCurrentSort()) {
              <span
                style="display: inline-block; margin-right: 8px; margin-top: 4px; padding: 4px 8px; background: #e1e1e1; border-radius: 4px; font-size: 0.875rem;"
              >
                Sort: {{ apiCurrentSort()?.field }} ({{ apiCurrentSort()?.direction }})
              </span>
            }
            @if (apiActiveFilters().length > 0) {
              <span
                style="display: inline-block; margin-right: 8px; margin-top: 4px; padding: 4px 8px; background: #e1e1e1; border-radius: 4px; font-size: 0.875rem;"
              >
                Filters: {{ apiActiveFilters().length }}
              </span>
            }
            <span
              style="display: inline-block; margin-right: 8px; margin-top: 4px; padding: 4px 8px; background: #e1e1e1; border-radius: 4px; font-size: 0.875rem;"
            >
              Page: {{ apiCurrentPage() }} / {{ Math.ceil(apiTotalCount() / apiPageSize()) }},
              Total: {{ apiTotalCount() }}
            </span>
          </p>
        }
      </section>
    </div>
  `,
  styles: [
    `
      .showcase {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .showcase__description {
        color: var(--Neutral-Foreground-2-Rest, #424242);
        margin-bottom: 2rem;
      }

      .showcase__section {
        margin-bottom: 3rem;
      }

      .showcase__section h2 {
        margin-bottom: 0.5rem;
        color: var(--Neutral-Foreground-Rest, #242424);
      }

      .showcase__section h3 {
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
        color: var(--Neutral-Foreground-Rest, #242424);
        font-size: 1.125rem;
      }

      .showcase__section p {
        color: var(--Neutral-Foreground-2-Rest, #424242);
        margin-bottom: 1rem;
      }

      .showcase__example {
        background: white;
        border: 1px solid var(--Neutral-Stroke-Rest, #d1d1d1);
        border-radius: 8px;
        padding: 1rem;
      }

      .showcase__info {
        margin-top: 0.5rem;
        padding: 0.5rem 1rem;
        background: var(--Neutral-Background-Brand-Selected, #d0e7ff);
        border-radius: 4px;
        color: var(--Neutral-Foreground-Rest, #242424);
        font-size: 0.875rem;
      }

      .showcase__example--scrollable {
        max-height: 400px;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        ::ng-deep .data-grid {
          max-height: 400px;
          overflow: auto;
        }
      }

      .showcase__example--virtualized {
        max-height: 480px;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        ::ng-deep .data-grid__viewport {
          height: 480px;
          overflow: auto;
        }
      }

      .showcase__grid--two-columns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }

      @media (max-width: 1024px) {
        .showcase__grid--two-columns {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DataGridShowcaseComponent implements OnInit {
  private apiService = inject(DataGridApiService<SampleData>);

  selectedCount = 0;
  virtualizedSelectedCount = 0;
  currentSort = signal<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  expandedRowInfo = signal<string>('');
  activeFilters = signal<DataGridActiveFilter[]>([]);

  // Pagination state
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  paginatedTotalCount = 25;

  // Full featured pagination state
  fullFeaturedCurrentPage = signal<number>(1);
  fullFeaturedPageSize = signal<number>(10);
  fullFeaturedTotalCount = 50;

  // API integration state
  apiRows = signal<DataGridRow<SampleData>[]>([]);
  apiLoading = signal<boolean>(false);
  apiTotalCount = signal<number>(0);
  apiCurrentPage = signal<number>(1);
  apiPageSize = signal<number>(10);
  apiCurrentSort = signal<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  apiActiveFilters = signal<DataGridActiveFilter[]>([]);

  // Expose Math for template
  Math = Math;

  // Empty state actions
  emptyPrimaryAction = {
    label: 'Upload File',
    variant: 'primary' as const,
    action: () => {
      console.log('Upload file clicked');
      alert('Upload file action triggered');
    },
  };

  emptySecondaryAction = {
    label: 'Learn More',
    variant: 'secondary' as const,
    action: () => {
      console.log('Learn more clicked');
      alert('Learn more action triggered');
    },
  };

  // Error state actions
  errorPrimaryAction = {
    label: 'Retry',
    variant: 'primary' as const,
    action: () => {
      console.log('Retry clicked');
      alert('Retry action triggered');
    },
  };

  errorSecondaryAction = {
    label: 'Contact Support',
    variant: 'secondary' as const,
    action: () => {
      console.log('Contact support clicked');
      alert('Contact support action triggered');
    },
  };

  // Basic columns
  basicColumns: DataGridColumn<SampleData>[] = [
    {
      id: 'name',
      header: 'Name',
      field: 'name',
      width: '200px',
      style: 'primary',
      headerStyle: 'semibold',
    },
    {
      id: 'type',
      header: 'Type',
      field: 'type',
      width: '150px',
      style: 'secondary',
      headerStyle: 'regular',
    },
    {
      id: 'modified',
      header: 'Modified',
      field: 'modified',
      width: '180px',
      style: 'secondary',
      headerStyle: 'regular',
    },
    {
      id: 'size',
      header: 'Size',
      field: 'size',
      width: '120px',
      style: 'secondary',
      headerStyle: 'regular',
    },
  ];

  // Basic rows
  basicRows: DataGridRow<SampleData>[] = [
    {
      id: '1',
      data: {
        id: '1',
        name: 'Document.docx',
        type: 'Word Document',
        modified: '2024-01-15 10:30 AM',
        modifiedBy: 'John Doe',
        size: '2.5 MB',
        status: 'Active',
      },
    },
    {
      id: '2',
      data: {
        id: '2',
        name: 'Presentation.pptx',
        type: 'PowerPoint',
        modified: '2024-01-14 03:45 PM',
        modifiedBy: 'Jane Smith',
        size: '5.8 MB',
        status: 'Active',
      },
    },
    {
      id: '3',
      data: {
        id: '3',
        name: 'Spreadsheet.xlsx',
        type: 'Excel',
        modified: '2024-01-13 09:15 AM',
        modifiedBy: 'Bob Johnson',
        size: '1.2 MB',
        status: 'Archived',
      },
    },
    {
      id: '4',
      data: {
        id: '4',
        name: 'Report.pdf',
        type: 'PDF Document',
        modified: '2024-01-12 02:20 PM',
        modifiedBy: 'Alice Brown',
        size: '3.7 MB',
        status: 'Active',
      },
    },
  ];

  // Expandable rows
  expandableRows: DataGridRow<SampleData>[] = [
    {
      id: 'expand-1',
      data: {
        id: 'expand-1',
        name: 'Project Plan.docx',
        type: 'Word Document',
        modified: '2024-01-20 09:00 AM',
        modifiedBy: 'Sarah Wilson',
        size: '4.2 MB',
        status: 'Active',
      },
    },
    {
      id: 'expand-2',
      data: {
        id: 'expand-2',
        name: 'Budget Analysis.xlsx',
        type: 'Excel',
        modified: '2024-01-19 02:30 PM',
        modifiedBy: 'Mike Davis',
        size: '6.8 MB',
        status: 'Active',
      },
    },
    {
      id: 'expand-3',
      data: {
        id: 'expand-3',
        name: 'Quarterly Report.pdf',
        type: 'PDF Document',
        modified: '2024-01-18 11:15 AM',
        modifiedBy: 'Emily Chen',
        size: '8.5 MB',
        status: 'Active',
      },
    },
  ];

  // Basic rows - with more data
  basicRowsExtended: DataGridRow<SampleData>[] = [
    ...this.basicRows,
    {
      id: '5',
      data: {
        id: '5',
        name: 'Analytics Dashboard.xlsx',
        type: 'Excel',
        modified: '2024-01-11 11:00 AM',
        modifiedBy: 'Sarah Wilson',
        size: '4.2 MB',
        status: 'Active',
      },
    },
    {
      id: '6',
      data: {
        id: '6',
        name: 'Meeting Notes.docx',
        type: 'Word Document',
        modified: '2024-01-10 04:30 PM',
        modifiedBy: 'Mike Davis',
        size: '856 KB',
        status: 'Active',
      },
    },
  ];

  // Generate paginated rows (25 items total)
  allPaginatedRows: DataGridRow<SampleData>[] = (() => {
    const rows: DataGridRow<SampleData>[] = [];
    const baseRows = this.basicRowsExtended;
    for (let i = 0; i < 25; i++) {
      const baseRow = baseRows[i % baseRows.length];
      rows.push({
        id: `paginated-${i + 1}`,
        data: {
          ...baseRow.data,
          id: `paginated-${i + 1}`,
          name: `${baseRow.data.name.replace(/\.[^.]+$/, '')} (${i + 1}).${baseRow.data.name.split('.').pop()}`,
        },
      });
    }
    return rows;
  })();

  // Generate full featured rows (50 items total)
  allFullFeaturedRows: DataGridRow<SampleData>[] = (() => {
    const rows: DataGridRow<SampleData>[] = [];
    const baseRows = this.basicRowsExtended;
    for (let i = 0; i < 50; i++) {
      const baseRow = baseRows[i % baseRows.length];
      rows.push({
        id: `full-${i + 1}`,
        data: {
          ...baseRow.data,
          id: `full-${i + 1}`,
          name: `${baseRow.data.name.replace(/\.[^.]+$/, '')} (${i + 1}).${baseRow.data.name.split('.').pop()}`,
        },
      });
    }
    return rows;
  })();

  fullFeaturedRows(): DataGridRow<SampleData>[] {
    const start = (this.fullFeaturedCurrentPage() - 1) * this.fullFeaturedPageSize();
    const end = start + this.fullFeaturedPageSize();
    return this.allFullFeaturedRows.slice(start, end);
  }

  onSelectionChange(rows: DataGridRow<SampleData>[]): void {
    this.selectedCount = rows.length;
    console.log('Selected rows:', rows);
  }

  onEmptyActionClick(action: any): void {
    console.log('Empty action clicked:', action);
  }

  onErrorActionClick(action: any): void {
    console.log('Error action clicked:', action);
  }

  onSortChange(sort: { field: string; direction: 'asc' | 'desc' }): void {
    this.currentSort.set(sort);
    console.log('Sort changed:', sort);
  }

  // Pagination methods
  paginatedRows(): DataGridRow<SampleData>[] {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.allPaginatedRows.slice(start, end);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    console.log('Page changed to:', page);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1); // Reset to first page when page size changes
    console.log('Page size changed to:', size);
  }

  // Full featured pagination methods
  onFullFeaturedPageChange(page: number): void {
    this.fullFeaturedCurrentPage.set(page);
    console.log('Full featured - Page changed to:', page);
  }

  onFullFeaturedPageSizeChange(size: number): void {
    this.fullFeaturedPageSize.set(size);
    this.fullFeaturedCurrentPage.set(1); // Reset to first page when page size changes
    console.log('Full featured - Page size changed to:', size);
  }

  // Expandable rows methods
  onRowExpand(row: DataGridRow<SampleData>): void {
    this.expandedRowInfo.set(`Expanded row: ${row.data.name}`);
    console.log('Row expanded:', row);
  }

  onRowCollapse(row: DataGridRow<SampleData>): void {
    this.expandedRowInfo.set(`Collapsed row: ${row.data.name}`);
    console.log('Row collapsed:', row);
  }

  // Sticky headers rows - generate more rows for scrolling demonstration
  stickyHeadersRows: DataGridRow<SampleData>[] = (() => {
    const rows: DataGridRow<SampleData>[] = [];
    const baseRows = this.basicRowsExtended;
    for (let i = 0; i < 20; i++) {
      const baseRow = baseRows[i % baseRows.length];
      rows.push({
        id: `sticky-${i + 1}`,
        data: {
          ...baseRow.data,
          id: `sticky-${i + 1}`,
          name: `${baseRow.data.name.replace(/\.[^.]+$/, '')} (${i + 1}).${baseRow.data.name.split('.').pop()}`,
        },
      });
    }
    return rows;
  })();

  // Sortable columns
  sortableColumns: DataGridColumn<SampleData>[] = [
    {
      id: 'name',
      header: 'Name',
      field: 'name',
      width: '200px',
      style: 'primary',
      headerStyle: 'semibold',
      sortable: true,
    },
    {
      id: 'type',
      header: 'Type',
      field: 'type',
      width: '150px',
      style: 'secondary',
      headerStyle: 'regular',
      sortable: true,
    },
    {
      id: 'modified',
      header: 'Modified',
      field: 'modified',
      width: '180px',
      style: 'secondary',
      headerStyle: 'regular',
      sortable: true,
    },
    {
      id: 'size',
      header: 'Size',
      field: 'size',
      width: '120px',
      style: 'secondary',
      headerStyle: 'regular',
      sortable: true,
    },
  ];

  // Virtualized rows - generate 1000 rows for virtualization demo
  virtualizedRows: DataGridRow<SampleData>[] = (() => {
    const rows: DataGridRow<SampleData>[] = [];
    const baseRows = this.basicRowsExtended;
    const fileTypes = ['Word Document', 'Excel', 'PowerPoint', 'PDF Document', 'Text File'];
    const statuses = ['Active', 'Archived', 'Draft', 'Published'];
    const users = [
      'John Doe',
      'Jane Smith',
      'Bob Johnson',
      'Alice Brown',
      'Sarah Wilson',
      'Mike Davis',
      'Emily Chen',
    ];

    for (let i = 0; i < 1000; i++) {
      const baseRow = baseRows[i % baseRows.length];
      const fileType = fileTypes[i % fileTypes.length];
      const status = statuses[i % statuses.length];
      const user = users[i % users.length];
      const size = `${(Math.random() * 10 + 0.5).toFixed(1)} MB`;
      const date = new Date(2024, 0, 1 + (i % 365));
      const modified =
        date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }) +
        ' ' +
        date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      rows.push({
        id: `virtual-${i + 1}`,
        data: {
          id: `virtual-${i + 1}`,
          name: `File_${i + 1}.${fileType.split(' ')[0].toLowerCase()}`,
          type: fileType,
          modified: modified,
          modifiedBy: user,
          size: size,
          status: status,
        },
      });
    }
    return rows;
  })();

  // Comparison rows for virtualization comparison
  comparisonRows: DataGridRow<SampleData>[] = (() => {
    const rows: DataGridRow<SampleData>[] = [];
    const baseRows = this.basicRowsExtended;
    for (let i = 0; i < 200; i++) {
      const baseRow = baseRows[i % baseRows.length];
      rows.push({
        id: `compare-${i + 1}`,
        data: {
          ...baseRow.data,
          id: `compare-${i + 1}`,
          name: `${baseRow.data.name.replace(/\.[^.]+$/, '')}_${i + 1}.${baseRow.data.name.split('.').pop()}`,
        },
      });
    }
    return rows;
  })();

  onVirtualizedSelectionChange(rows: DataGridRow<SampleData>[]): void {
    this.virtualizedSelectedCount = rows.length;
    console.log('Virtualized selected rows:', rows);
  }

  // Filter methods
  onFilterChange(filters: DataGridActiveFilter[]): void {
    this.activeFilters.set(filters);
    console.log('Active filters:', filters);
  }

  // Filterable columns with different filter types
  filterableColumns: DataGridColumn<SampleData>[] = [
    {
      id: 'name',
      header: 'Name',
      field: 'name',
      width: '200px',
      style: 'primary',
      headerStyle: 'semibold',
      filterable: {
        type: 'text',
        placeholder: 'Search by name...',
        debounceMs: 300,
        operators: ['contains', 'equals', 'startsWith', 'endsWith'],
        defaultOperator: 'contains',
      },
    },
    {
      id: 'type',
      header: 'Type',
      field: 'type',
      width: '150px',
      style: 'secondary',
      headerStyle: 'regular',
      filterable: {
        type: 'select',
        placeholder: 'Select type...',
        options: [
          { label: 'Word Document', value: 'Word Document' },
          { label: 'Excel', value: 'Excel' },
          { label: 'PowerPoint', value: 'PowerPoint' },
          { label: 'PDF Document', value: 'PDF Document' },
          { label: 'Text File', value: 'Text File' },
        ],
      },
    },
    {
      id: 'status',
      header: 'Status',
      field: 'status',
      width: '120px',
      style: 'secondary',
      headerStyle: 'regular',
      filterable: {
        type: 'multi-select',
        placeholder: 'Select statuses...',
        options: [
          { label: 'Active', value: 'Active' },
          { label: 'Archived', value: 'Archived' },
          { label: 'Draft', value: 'Draft' },
          { label: 'Published', value: 'Published' },
        ],
      },
    },
    {
      id: 'modified',
      header: 'Modified',
      field: 'modified',
      width: '180px',
      style: 'secondary',
      headerStyle: 'regular',
      filterable: {
        type: 'date',
        placeholder: 'Filter by date...',
        operators: ['equals', 'before', 'after', 'between'],
        defaultOperator: 'equals',
      },
    },
    {
      id: 'modifiedBy',
      header: 'Modified By',
      field: 'modifiedBy',
      width: '150px',
      style: 'secondary',
      headerStyle: 'regular',
      filterable: {
        type: 'text',
        placeholder: 'Search by user...',
        operators: ['contains', 'equals', 'startsWith', 'endsWith'],
        defaultOperator: 'contains',
      },
    },
  ];

  // Filterable rows with diverse data
  filterableRows: DataGridRow<SampleData>[] = [
    {
      id: 'filter-1',
      data: {
        id: 'filter-1',
        name: 'Document.docx',
        type: 'Word Document',
        modified: '2024-01-15',
        modifiedBy: 'John Doe',
        size: '2.5 MB',
        status: 'Active',
      },
    },
    {
      id: 'filter-2',
      data: {
        id: 'filter-2',
        name: 'Presentation.pptx',
        type: 'PowerPoint',
        modified: '2024-01-14',
        modifiedBy: 'Jane Smith',
        size: '5.8 MB',
        status: 'Active',
      },
    },
    {
      id: 'filter-3',
      data: {
        id: 'filter-3',
        name: 'Spreadsheet.xlsx',
        type: 'Excel',
        modified: '2024-01-13',
        modifiedBy: 'Bob Johnson',
        size: '1.2 MB',
        status: 'Archived',
      },
    },
    {
      id: 'filter-4',
      data: {
        id: 'filter-4',
        name: 'Report.pdf',
        type: 'PDF Document',
        modified: '2024-01-12',
        modifiedBy: 'Alice Brown',
        size: '3.7 MB',
        status: 'Active',
      },
    },
    {
      id: 'filter-5',
      data: {
        id: 'filter-5',
        name: 'Analytics Dashboard.xlsx',
        type: 'Excel',
        modified: '2024-01-11',
        modifiedBy: 'Sarah Wilson',
        size: '4.2 MB',
        status: 'Draft',
      },
    },
    {
      id: 'filter-6',
      data: {
        id: 'filter-6',
        name: 'Meeting Notes.docx',
        type: 'Word Document',
        modified: '2024-01-10',
        modifiedBy: 'Mike Davis',
        size: '856 KB',
        status: 'Published',
      },
    },
    {
      id: 'filter-7',
      data: {
        id: 'filter-7',
        name: 'Budget Analysis.xlsx',
        type: 'Excel',
        modified: '2024-01-09',
        modifiedBy: 'Emily Chen',
        size: '6.8 MB',
        status: 'Active',
      },
    },
    {
      id: 'filter-8',
      data: {
        id: 'filter-8',
        name: 'Quarterly Report.pdf',
        type: 'PDF Document',
        modified: '2024-01-08',
        modifiedBy: 'John Doe',
        size: '8.5 MB',
        status: 'Archived',
      },
    },
    {
      id: 'filter-9',
      data: {
        id: 'filter-9',
        name: 'Project Plan.docx',
        type: 'Word Document',
        modified: '2024-01-07',
        modifiedBy: 'Jane Smith',
        size: '3.1 MB',
        status: 'Draft',
      },
    },
    {
      id: 'filter-10',
      data: {
        id: 'filter-10',
        name: 'Data Summary.txt',
        type: 'Text File',
        modified: '2024-01-06',
        modifiedBy: 'Bob Johnson',
        size: '245 KB',
        status: 'Published',
      },
    },
  ];

  ngOnInit(): void {
    // Initialize API service with mock data
    const allApiData: DataGridRow<SampleData>[] = [];
    const fileTypes = ['Word Document', 'Excel', 'PowerPoint', 'PDF Document', 'Text File'];
    const statuses = ['Active', 'Archived', 'Draft', 'Published'];
    const users = [
      'John Doe',
      'Jane Smith',
      'Bob Johnson',
      'Alice Brown',
      'Sarah Wilson',
      'Mike Davis',
      'Emily Chen',
      'David Lee',
      'Lisa Wang',
      'Tom Anderson',
    ];

    // Generate 100 items for API showcase
    for (let i = 1; i <= 100; i++) {
      const fileType = fileTypes[i % fileTypes.length];
      const status = statuses[i % statuses.length];
      const user = users[i % users.length];
      const date = new Date(2024, 0, 1 + (i % 365));
      const modified = date.toISOString().split('T')[0]; // YYYY-MM-DD format

      allApiData.push({
        id: `api-${i}`,
        data: {
          id: `api-${i}`,
          name: `File_${i}.${fileType.split(' ')[0].toLowerCase()}`,
          type: fileType,
          modified: modified,
          modifiedBy: user,
          size: `${(Math.random() * 10 + 0.5).toFixed(1)} MB`,
          status: status,
        },
      });
    }

    this.apiService.initializeMockData(allApiData);
    this.loadApiData();
  }

  // API columns with sorting and filtering
  apiColumns: DataGridColumn<SampleData>[] = [
    {
      id: 'name',
      header: 'Name',
      field: 'name',
      width: '200px',
      style: 'primary',
      headerStyle: 'semibold',
      sortable: true,
      filterable: {
        type: 'text',
        placeholder: 'Search by name...',
        debounceMs: 300,
        operators: ['contains', 'equals', 'startsWith', 'endsWith'],
        defaultOperator: 'contains',
      },
    },
    {
      id: 'type',
      header: 'Type',
      field: 'type',
      width: '150px',
      style: 'secondary',
      headerStyle: 'regular',
      sortable: true,
      filterable: {
        type: 'select',
        placeholder: 'Select type...',
        options: [
          { label: 'Word Document', value: 'Word Document' },
          { label: 'Excel', value: 'Excel' },
          { label: 'PowerPoint', value: 'PowerPoint' },
          { label: 'PDF Document', value: 'PDF Document' },
          { label: 'Text File', value: 'Text File' },
        ],
      },
    },
    {
      id: 'status',
      header: 'Status',
      field: 'status',
      width: '120px',
      style: 'secondary',
      headerStyle: 'regular',
      sortable: true,
      filterable: {
        type: 'multi-select',
        placeholder: 'Select statuses...',
        options: [
          { label: 'Active', value: 'Active' },
          { label: 'Archived', value: 'Archived' },
          { label: 'Draft', value: 'Draft' },
          { label: 'Published', value: 'Published' },
        ],
      },
    },
    {
      id: 'modified',
      header: 'Modified',
      field: 'modified',
      width: '180px',
      style: 'secondary',
      headerStyle: 'regular',
      sortable: true,
      filterable: {
        type: 'date',
        placeholder: 'Filter by date...',
        operators: ['equals', 'before', 'after', 'between'],
        defaultOperator: 'equals',
      },
    },
    {
      id: 'modifiedBy',
      header: 'Modified By',
      field: 'modifiedBy',
      width: '150px',
      style: 'secondary',
      headerStyle: 'regular',
      sortable: true,
      filterable: {
        type: 'text',
        placeholder: 'Search by user...',
        operators: ['contains', 'equals', 'startsWith', 'endsWith'],
        defaultOperator: 'contains',
      },
    },
  ];

  // API methods
  loadApiData(): void {
    this.apiLoading.set(true);

    const request = {
      page: this.apiCurrentPage(),
      pageSize: this.apiPageSize(),
      sortField: this.apiCurrentSort()?.field,
      sortDirection: this.apiCurrentSort()?.direction,
      filters: this.apiActiveFilters(),
    };

    this.apiService.getData(request).subscribe({
      next: response => {
        this.apiRows.set(response.data);
        this.apiTotalCount.set(response.totalCount);
        this.apiLoading.set(false);
      },
      error: error => {
        console.error('API Error:', error);
        this.apiLoading.set(false);
      },
    });
  }

  onApiSortChange(sort: { field: string; direction: 'asc' | 'desc' }): void {
    this.apiCurrentSort.set(sort);
    this.apiCurrentPage.set(1); // Reset to first page when sorting changes
    this.loadApiData();
  }

  onApiFilterChange(filters: DataGridActiveFilter[]): void {
    this.apiActiveFilters.set(filters);
    this.apiCurrentPage.set(1); // Reset to first page when filters change
    this.loadApiData();
  }

  onApiPageChange(page: number): void {
    this.apiCurrentPage.set(page);
    this.loadApiData();
  }

  onApiPageSizeChange(size: number): void {
    this.apiPageSize.set(size);
    this.apiCurrentPage.set(1); // Reset to first page when page size changes
    this.loadApiData();
  }
}
