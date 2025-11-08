import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataGridComponent } from './data-grid.component';
import { DataGridColumn, DataGridRow } from './models/data-grid-column.model';

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
            [enableVirtualization]="true"
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
            [enableVirtualization]="true"
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
                [enableVirtualization]="true"
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
        <div class="showcase__example showcase__example--scrollable">
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
export class DataGridShowcaseComponent {
  selectedCount = 0;
  virtualizedSelectedCount = 0;
  currentSort = signal<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  expandedRowInfo = signal<string>('');

  // Pagination state
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  paginatedTotalCount = 25;

  // Full featured pagination state
  fullFeaturedCurrentPage = signal<number>(1);
  fullFeaturedPageSize = signal<number>(10);
  fullFeaturedTotalCount = 50;

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
}
