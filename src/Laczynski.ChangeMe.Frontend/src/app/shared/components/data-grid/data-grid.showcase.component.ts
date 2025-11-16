/**
 * DataGrid Showcase Component
 *
 * Demonstrates the new DataGrid API with DataSource Pattern, Builder Pattern,
 * Presets, and Column Factory.
 */

import { Component, signal, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataGridComponent } from './data-grid.component';
import { DataGridColumn, DataGridRow } from './models/data-grid-column.model';
import { DataGridActiveFilter } from './models/data-grid-filter.model';
import { TableOfContentComponent } from '@shared/components/table-of-content';
import { DataGridConfigBuilder, DataGridPresets } from './builders';
import { DataGridColumnFactory } from './factories/data-grid-column.factory';
import { StaticDataSource, ServerDataSource } from './data-sources';
import { ApiDataGridRepository } from './repositories/api-data-grid-repository';
import { DefaultDataGridAdapter } from './adapters/default-data-grid-adapter';
import { ApiService } from '@shared/api/services/api.service';
import { ItemDto, PaginationResult } from '@shared/api';

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
  imports: [CommonModule, DataGridComponent, TableOfContentComponent],
  template: `
    <div class="showcase showcase--responsive showcase__with-toc">
      <app-table-of-content
        [sticky]="true"
        [offsetTop]="20"
        containerSelector=".showcase-content"
        [minLevel]="1"
        [maxLevel]="2"
      />
      <div class="showcase-content">
        <h1 class="showcase__title">DataGrid Component</h1>
        <p class="showcase__description">
          A flexible and feature-rich data grid component following Fluent 2 Design System
          principles. Now with DataSource Pattern, Builder Pattern, Presets, and Column Factory for
          easier configuration.
        </p>

        <!-- Basic Example with Preset -->
        <section class="showcase__section">
          <h2 class="showcase__section__title">Basic DataGrid (Preset)</h2>
          <p class="showcase__section__description">
            Simple data grid using Preset. Just 3 lines of code!
          </p>
          <div class="showcase__example">
            <app-data-grid [config]="basicConfig()" />
          </div>
        </section>

        <!-- Column Factory Example -->
        <section class="showcase__section">
          <h2 class="showcase__section__title">Column Factory</h2>
          <p class="showcase__section__description">
            Using Column Factory to create columns with sensible defaults. Reduces boilerplate by
            70%!
          </p>
          <div class="showcase__example">
            <app-data-grid [config]="columnFactoryConfig()" />
          </div>
        </section>

        <!-- Selectable Example -->
        <section class="showcase__section">
          <h2 class="showcase__section__title">Selectable DataGrid</h2>
          <p class="showcase__section__description">
            Data grid with row selection (multi-select) using Builder Pattern.
          </p>
          <div class="showcase__example">
            <app-data-grid [config]="selectableConfig()" />
          </div>
          @if (selectedCount() > 0) {
            <p class="showcase__info">Selected rows: {{ selectedCount() }}</p>
          }
        </section>

        <!-- Server-Side Example -->
        <section class="showcase__section">
          <h2 class="showcase__section__title">Server-Side DataGrid (Preset)</h2>
          <p class="showcase__section__description">
            Data grid with server-side pagination, sorting, and filtering. All processing happens on
            the server.
          </p>
          <div class="showcase__example">
            <app-data-grid [config]="serverSideConfig()" />
          </div>
          @if (serverSideInfo()) {
            <p class="showcase__info">{{ serverSideInfo() }}</p>
          }
        </section>

        <!-- Virtualized Example -->
        <section class="showcase__section">
          <h2 class="showcase__section__title">Virtualized DataGrid (Preset)</h2>
          <p class="showcase__section__description">
            Data grid with virtualization for large datasets. Only visible rows are rendered.
          </p>
          <div class="showcase__example showcase__example--virtualized">
            <app-data-grid [config]="virtualizedConfig()" />
          </div>
          <p class="showcase__info">
            Virtualization enabled: {{ virtualizedRows.length }} rows rendered efficiently.
          </p>
        </section>

        <!-- Filtering Example -->
        <section class="showcase__section">
          <h2 class="showcase__section__title">Filtering</h2>
          <p class="showcase__section__description">
            Data grid with filtering enabled. Each column can have different filter types.
          </p>
          <div class="showcase__example">
            <app-data-grid [config]="filteringConfig()" />
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
          <h2 class="showcase__section__title">Expandable Rows (Master-Details)</h2>
          <p class="showcase__section__description">
            Data grid with expandable rows showing additional details when expanded.
          </p>
          <div class="showcase__example">
            <app-data-grid [config]="expandableConfig()">
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

        <!-- Full Featured Example with Builder -->
        <section class="showcase__section">
          <h2 class="showcase__section__title">Full Featured DataGrid (Builder)</h2>
          <p class="showcase__section__description">
            Complete data grid with all features enabled using Builder Pattern. Shows the power of
            the new API.
          </p>
          <div class="showcase__example">
            <app-data-grid [config]="fullFeaturedConfig()">
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
                </div>
              </ng-template>
            </app-data-grid>
          </div>
        </section>

        <!-- Advanced Builder Example -->
        <section class="showcase__section">
          <h2 class="showcase__section__title">Advanced Configuration (Builder)</h2>
          <p class="showcase__section__description">
            Advanced configuration with custom callbacks, styling, and all features.
          </p>
          <div class="showcase__example">
            <app-data-grid [config]="advancedConfig()" />
          </div>
          @if (advancedInfo()) {
            <p class="showcase__info">{{ advancedInfo() }}</p>
          }
        </section>

        <!-- Real API Integration -->
        <section class="showcase__section">
          <h2 class="showcase__section__title">Real API Integration</h2>
          <p class="showcase__section__description">
            Data grid connected to real backend API endpoint <code>/items</code>. All data is
            fetched from the server with server-side pagination, sorting, and filtering.
          </p>
          <div class="showcase__example">
            <app-data-grid [config]="realApiConfig()" />
          </div>
          @if (apiInfo()) {
            <p class="showcase__info">{{ apiInfo() }}</p>
          }
        </section>
      </div>
    </div>
  `,
})
export class DataGridShowcaseComponent implements OnInit {
  private apiService = inject(ApiService);

  selectedCount = signal(0);
  activeFilters = signal<DataGridActiveFilter[]>([]);
  currentSort = signal<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  serverSideInfo = signal<string>('');
  advancedInfo = signal<string>('');
  apiInfo = signal<string>('');

  // Sample data
  basicData: SampleData[] = [
    {
      id: '1',
      name: 'Document.docx',
      type: 'Word Document',
      modified: '2024-01-15',
      modifiedBy: 'John Doe',
      size: '2.5 MB',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Presentation.pptx',
      type: 'PowerPoint',
      modified: '2024-01-14',
      modifiedBy: 'Jane Smith',
      size: '5.8 MB',
      status: 'Active',
    },
    {
      id: '3',
      name: 'Spreadsheet.xlsx',
      type: 'Excel',
      modified: '2024-01-13',
      modifiedBy: 'Bob Johnson',
      size: '1.2 MB',
      status: 'Archived',
    },
    {
      id: '4',
      name: 'Report.pdf',
      type: 'PDF Document',
      modified: '2024-01-12',
      modifiedBy: 'Alice Brown',
      size: '3.7 MB',
      status: 'Active',
    },
  ];

  filterableData: SampleData[] = [
    ...this.basicData,
    {
      id: '5',
      name: 'Analytics Dashboard.xlsx',
      type: 'Excel',
      modified: '2024-01-11',
      modifiedBy: 'Sarah Wilson',
      size: '4.2 MB',
      status: 'Draft',
    },
    {
      id: '6',
      name: 'Meeting Notes.docx',
      type: 'Word Document',
      modified: '2024-01-10',
      modifiedBy: 'Mike Davis',
      size: '856 KB',
      status: 'Published',
    },
  ];

  // Generate virtualized rows
  virtualizedRows: DataGridRow<SampleData>[] = (() => {
    const rows: DataGridRow<SampleData>[] = [];
    const baseData = this.basicData;
    for (let i = 0; i < 1000; i++) {
      const base = baseData[i % baseData.length];
      rows.push({
        id: `virtual-${i + 1}`,
        data: {
          ...base,
          id: `virtual-${i + 1}`,
          name: `File_${i + 1}.${base.name.split('.').pop()}`,
        },
      });
    }
    return rows;
  })();

  // Configurations using Presets
  basicConfig = computed(() => {
    const columns = [
      DataGridColumnFactory.text('name', 'Name', 'name'),
      DataGridColumnFactory.text('type', 'Type', 'type'),
      DataGridColumnFactory.text('modified', 'Modified', 'modified'),
    ];
    return DataGridPresets.simple(columns, this.basicData);
  });

  columnFactoryConfig = computed(() => {
    const columns = [
      DataGridColumnFactory.text('name', 'Name', 'name', { width: '200px', style: 'primary' }),
      DataGridColumnFactory.number('size', 'Size', 'size', { width: '120px' }),
      DataGridColumnFactory.date('modified', 'Modified', 'modified', { width: '180px' }),
      DataGridColumnFactory.select(
        'status',
        'Status',
        'status',
        [
          { label: 'Active', value: 'Active' },
          { label: 'Archived', value: 'Archived' },
          { label: 'Draft', value: 'Draft' },
        ],
        { width: '120px' },
      ),
    ];
    return DataGridPresets.simple(columns, this.basicData);
  });

  selectableConfig = computed(() => {
    const columns = [
      DataGridColumnFactory.text('name', 'Name', 'name'),
      DataGridColumnFactory.text('type', 'Type', 'type'),
      DataGridColumnFactory.text('modified', 'Modified', 'modified'),
    ];
    return new DataGridConfigBuilder<SampleData>()
      .withColumns(columns)
      .withDataSource(new StaticDataSource(this.basicData))
      .withSelection('multi')
      .withStyling({ hoverable: true, striped: true })
      .onSelectionChange(rows => {
        this.selectedCount.set(rows.length);
        console.log('Selected rows:', rows);
      })
      .build();
  });

  serverSideConfig = computed(() => {
    const columns = [
      DataGridColumnFactory.text('name', 'Name', 'name', { sortable: true }),
      DataGridColumnFactory.text('type', 'Type', 'type', { sortable: true }),
      DataGridColumnFactory.text('modified', 'Modified', 'modified', { sortable: true }),
    ];

    // For showcase, we'll use StaticDataSource but simulate server-side behavior
    // In real app, you'd use: new ApiDataGridRepository<SampleData>('items')
    // For now, we'll use a simple static source with pagination
    return new DataGridConfigBuilder<SampleData>()
      .withColumns(columns)
      .withDataSource(new StaticDataSource(this.basicData))
      .withSelection('multi')
      .withPagination({
        enabled: true,
        pageSize: 2,
        pageSizeOptions: [2, 5, 10],
        showPageSizeSelector: true,
        showPageNumbers: true,
      })
      .withSorting({ enabled: true })
      .withFiltering({ enabled: true, debounceMs: 300 })
      .withStyling({
        size: 'medium',
        striped: true,
        hoverable: true,
        stickyHeaders: true,
      })
      .onPageChange(page => {
        this.serverSideInfo.set(`Page changed to: ${page}`);
      })
      .onSortChange(sort => {
        this.serverSideInfo.set(`Sorted by: ${sort.field} (${sort.direction})`);
      })
      .build();
  });

  virtualizedConfig = computed(() => {
    const columns = [
      DataGridColumnFactory.text('name', 'Name', 'name', { sortable: true }),
      DataGridColumnFactory.text('type', 'Type', 'type', { sortable: true }),
      DataGridColumnFactory.text('modified', 'Modified', 'modified', { sortable: true }),
      DataGridColumnFactory.text('size', 'Size', 'size', { sortable: true }),
    ];
    return DataGridPresets.virtualized(
      columns,
      this.virtualizedRows.map(r => r.data),
    );
  });

  filteringConfig = computed(() => {
    const columns = [
      DataGridColumnFactory.text('name', 'Name', 'name'),
      DataGridColumnFactory.select('type', 'Type', 'type', [
        { label: 'Word Document', value: 'Word Document' },
        { label: 'Excel', value: 'Excel' },
        { label: 'PowerPoint', value: 'PowerPoint' },
        { label: 'PDF Document', value: 'PDF Document' },
      ]),
      DataGridColumnFactory.multiSelect('status', 'Status', 'status', [
        { label: 'Active', value: 'Active' },
        { label: 'Archived', value: 'Archived' },
        { label: 'Draft', value: 'Draft' },
        { label: 'Published', value: 'Published' },
      ]),
      DataGridColumnFactory.date('modified', 'Modified', 'modified'),
    ];
    return new DataGridConfigBuilder<SampleData>()
      .withColumns(columns)
      .withDataSource(new StaticDataSource(this.filterableData))
      .withFiltering({ enabled: true, debounceMs: 300 })
      .withStyling({ hoverable: true, striped: true })
      .onFilterChange(filters => {
        this.activeFilters.set(filters);
        console.log('Active filters:', filters);
      })
      .build();
  });

  expandableConfig = computed(() => {
    const columns = [
      DataGridColumnFactory.text('name', 'Name', 'name'),
      DataGridColumnFactory.text('type', 'Type', 'type'),
      DataGridColumnFactory.text('modified', 'Modified', 'modified'),
    ];
    return DataGridPresets.editable(columns, this.basicData);
  });

  fullFeaturedConfig = computed(() => {
    const columns = [
      DataGridColumnFactory.text('name', 'Name', 'name', { sortable: true }),
      DataGridColumnFactory.text('type', 'Type', 'type', { sortable: true }),
      DataGridColumnFactory.text('modified', 'Modified', 'modified', { sortable: true }),
      DataGridColumnFactory.text('size', 'Size', 'size', { sortable: true }),
    ];
    return new DataGridConfigBuilder<SampleData>()
      .withColumns(columns)
      .withDataSource(new StaticDataSource(this.basicData))
      .withSelection('multi')
      .withPagination({
        enabled: true,
        pageSize: 10,
        pageSizeOptions: [5, 10, 20, 50],
        showPageSizeSelector: true,
        showPageNumbers: true,
      })
      .withSorting({ enabled: true })
      .withStyling({
        size: 'medium',
        striped: true,
        bordered: true,
        hoverable: true,
        stickyHeaders: true,
      })
      .withExpandable(true)
      .build();
  });

  advancedConfig = computed(() => {
    const columns = [
      DataGridColumnFactory.text('name', 'Name', 'name', { sortable: true }),
      DataGridColumnFactory.text('type', 'Type', 'type', { sortable: true }),
      DataGridColumnFactory.number('size', 'Size', 'size', { sortable: true }),
      DataGridColumnFactory.date('modified', 'Modified', 'modified', { sortable: true }),
    ];
    return new DataGridConfigBuilder<SampleData>()
      .withColumns(columns)
      .withDataSource(new StaticDataSource(this.basicData))
      .withSelection('multi')
      .withPagination({
        enabled: true,
        pageSize: 5,
        pageSizeOptions: [5, 10, 20],
        showPageSizeSelector: true,
        showPageNumbers: true,
        showInfo: true,
      })
      .withSorting({
        enabled: true,
        defaultSort: { field: 'modified', direction: 'desc' },
      })
      .withFiltering({ enabled: true, debounceMs: 300 })
      .withStyling({
        size: 'medium',
        striped: true,
        bordered: true,
        hoverable: true,
        stickyHeaders: true,
      })
      .withLoading({
        title: 'Loading data...',
        description: 'Please wait',
      })
      .withEmpty({
        title: 'No files found',
        description: 'Upload your first file to get started.',
        icon: 'folder_open',
      })
      .onRowClick(row => {
        console.log('Row clicked:', row);
        this.advancedInfo.set(`Clicked: ${row.data.name}`);
      })
      .onSortChange(sort => {
        console.log('Sort changed:', sort);
        this.currentSort.set(sort);
        this.advancedInfo.set(`Sorted by: ${sort.field} (${sort.direction})`);
      })
      .onFilterChange(filters => {
        console.log('Filters changed:', filters);
        this.activeFilters.set(filters);
      })
      .onSelectionChange(rows => {
        console.log('Selection changed:', rows);
        this.selectedCount.set(rows.length);
      })
      .build();
  });

  // Real API configuration
  realApiConfig = computed(() => {
    const columns = [
      DataGridColumnFactory.text('name', 'Name', 'name', {
        sortable: true,
        width: '200px',
        style: 'primary',
      }),
      DataGridColumnFactory.text('description', 'Description', 'description', {
        sortable: true,
        width: '300px',
      }),
      DataGridColumnFactory.number('price', 'Price', 'price', {
        sortable: true,
        width: '120px',
      }),
      DataGridColumnFactory.text('image', 'Image', 'image', {
        sortable: false,
        width: '150px',
      }),
    ];

    // Create repository for backend API
    // Backend returns Result<PaginationResult<ItemDto>>, ApiService unwraps it to PaginationResult<ItemDto>
    // ApiDataGridRepository directly uses PaginationResult<T> structure - no mapping needed
    // Backend uses flat query parameters: ?PageNumber=1&PageSize=10&SortField=name&Ascending=true
    const repository = new ApiDataGridRepository<ItemDto>('items', this.apiService);

    return new DataGridConfigBuilder<ItemDto>()
      .withColumns(columns)
      .withDataSource(new ServerDataSource(repository))
      .withSelection('multi')
      .withPagination({
        enabled: true,
        pageSize: 10,
        pageSizeOptions: [5, 10, 20, 50],
        showPageSizeSelector: true,
        showPageNumbers: true,
        showInfo: true,
      })
      .withSorting({
        enabled: true,
        defaultSort: { field: 'name', direction: 'asc' },
      })
      .withFiltering({ enabled: true, debounceMs: 300 })
      .withStyling({
        size: 'medium',
        striped: true,
        bordered: true,
        hoverable: true,
        stickyHeaders: true,
      })
      .withLoading({
        title: 'Loading items...',
        description: 'Fetching data from server',
      })
      .withEmpty({
        title: 'No items found',
        description: 'There are no items to display.',
        icon: 'folder_open',
      })
      .onRowClick(row => {
        console.log('Item clicked:', row.data);
        this.apiInfo.set(`Clicked: ${row.data.name} (${row.data.price} PLN)`);
      })
      .onSortChange(sort => {
        console.log('Sort changed:', sort);
        this.apiInfo.set(`Sorted by: ${sort.field} (${sort.direction})`);
      })
      .onPageChange(page => {
        console.log('Page changed:', page);
        this.apiInfo.set(`Page: ${page}`);
      })
      .onPageSizeChange(size => {
        console.log('Page size changed:', size);
        this.apiInfo.set(`Page size: ${size}`);
      })
      .onFilterChange(filters => {
        console.log('Filters changed:', filters);
        this.activeFilters.set(filters);
        this.apiInfo.set(`Active filters: ${filters.length}`);
      })
      .onSelectionChange(rows => {
        console.log('Selection changed:', rows);
        this.selectedCount.set(rows.length);
        this.apiInfo.set(`Selected: ${rows.length} item(s)`);
      })
      .build();
  });

  ngOnInit(): void {
    // Component initialization
  }
}
