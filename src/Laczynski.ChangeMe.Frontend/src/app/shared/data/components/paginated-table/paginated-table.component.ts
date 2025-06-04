import {
  Component,
  DestroyRef,
  OnInit,
  TemplateRef,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatedTableConfig } from './models/paginated-table-config.model';
import { PaginationParameters } from '../../models/pagination-parameters.model';
import { DataGridColumn } from './models/data-grid-column.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-paginated-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginated-table.component.html',
})
export class PaginatedTableComponent<T, P extends PaginationParameters = PaginationParameters>
  implements OnInit
{
  config = model.required<PaginatedTableConfig<T, P>>();
  columnTemplates = input.required<{ [key: string]: TemplateRef<any> }>();
  rowSelect = output<T>();

  state = computed(() => this.config().state());

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.config()
      .dataSource(this.config().params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  /**
   * Handle row selection
   */
  handleRowSelect(row: T): void {
    this.rowSelect.emit(row);
  }

  /**
   * Handle sort changes
   */
  onSort(field: string): void {
    const isCurrentField = field === this.config().params.sortField;

    if (isCurrentField) {
      // Toggle sort order if same field
      this.config().params.ascending = !this.config().params.ascending;
    } else {
      // Set new field and default to ascending
      this.config().params.sortField = field;
      this.config().params.ascending = true;
    }

    this.config()
      .dataSource(this.config().params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  /**
   * Handle sort changes (keeping for compatibility)
   */
  onSortChange(event: any): void {
    if (!event.field) {
      return;
    }

    const order = event.order === 1 ? true : false;
    const isNewOrder =
      order !== this.config().params.ascending || event.field !== this.config().params.sortField;

    this.config().params.sortField = event.field;
    this.config().params.ascending = order;

    if (isNewOrder) {
      this.config()
        .dataSource(this.config().params)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
  }

  /**
   * Handle page changes (keeping for compatibility)
   */
  onPageChange(event: any): void {
    console.log(event);
    this.config().params.pageSize = event.rows ?? 10;
    this.config().params.pageNumber = (event.first ?? 0) / (event.rows ?? 10) + 1;

    this.config()
      .dataSource(this.config().params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  /**
   * Handle page size changes
   */
  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);

    this.config().params.pageSize = newPageSize;
    this.config().params.pageNumber = 1; // Reset to first page

    this.config()
      .dataSource(this.config().params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  /**
   * Navigate to specific page
   */
  goToPage(page: number): void {
    if (page < 1 || page > this.getTotalPages()) {
      return;
    }

    this.config().params.pageNumber = page;

    this.config()
      .dataSource(this.config().params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  /**
   * Get current page number
   */
  getCurrentPage(): number {
    return this.config().params.pageNumber || 1;
  }

  /**
   * Get total number of pages
   */
  getTotalPages(): number {
    const data = this.config().state().data;
    if (!data || !data.totalCount || !data.pageSize) {
      return 1;
    }
    return Math.ceil(data.totalCount / data.pageSize);
  }

  /**
   * Get visible page numbers for pagination
   */
  getVisiblePages(): number[] {
    const totalPages = this.getTotalPages();
    const currentPage = this.getCurrentPage();
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const start = Math.max(1, Math.min(currentPage - 2, totalPages - maxVisible + 1));
    const end = Math.min(totalPages, start + maxVisible - 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  /**
   * Get first record number for current page
   */
  getFirstRecord(): number {
    const data = this.config().state().data;
    if (!data || !data.items || data.items.length === 0) {
      return 0;
    }
    return (this.getCurrentPage() - 1) * (data.pageSize || 10) + 1;
  }

  /**
   * Get last record number for current page
   */
  getLastRecord(): number {
    const data = this.config().state().data;
    if (!data || !data.items || data.items.length === 0) {
      return 0;
    }
    return Math.min(this.getCurrentPage() * (data.pageSize || 10), data.totalCount || 0);
  }

  /**
   * Get cell value with formatting
   */
  getCellValue(row: T, column: DataGridColumn<T>): string {
    if (!column.field) {
      return '';
    }

    const value = row[column.field];

    if (column.formatter) {
      return column.formatter(value, row);
    }

    return value !== undefined && value !== null ? value.toString() : '';
  }
}
