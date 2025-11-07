import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { DropdownComponent, DropdownItem } from '../field/dropdown/dropdown.component';
import { Size } from '../utils';

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  showPageSizeSelector?: boolean;
  pageSizeOptions?: number[];
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
  showFirstLast?: boolean;
  showInfo?: boolean;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  imports: [CommonModule, ButtonComponent, IconComponent, DropdownComponent],
})
export class PaginationComponent {
  // Inputs
  config = input.required<PaginationConfig>();
  size = input<Size>('medium');

  // Outputs
  pageChange = output<number>();
  pageSizeChange = output<number>();

  // Computed properties
  visiblePages = computed(() => {
    const cfg = this.config();
    if (!cfg.showPageNumbers) {
      return [];
    }

    const current = cfg.currentPage;
    const total = cfg.totalPages;
    const maxVisible = cfg.maxVisiblePages || 7;
    const pages: number[] = [];

    if (total <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Calculate range to show
      let start = Math.max(1, current - Math.floor(maxVisible / 2));
      let end = Math.min(total, start + maxVisible - 1);

      // Adjust start if we're near the end
      if (end === total) {
        start = Math.max(1, total - maxVisible + 1);
      }

      // Always show first page
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push(-1); // Ellipsis marker
        }
      }

      // Show page range
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Always show last page
      if (end < total) {
        if (end < total - 1) {
          pages.push(-1); // Ellipsis marker
        }
        pages.push(total);
      }
    }

    return pages;
  });

  canGoToFirst = computed(() => {
    return this.config().currentPage > 1;
  });

  canGoToPrevious = computed(() => {
    return this.config().currentPage > 1;
  });

  canGoToNext = computed(() => {
    return this.config().currentPage < this.config().totalPages;
  });

  canGoToLast = computed(() => {
    return this.config().currentPage < this.config().totalPages;
  });

  infoText = computed(() => {
    const cfg = this.config();
    if (cfg.totalItems === 0) {
      return 'No items';
    }

    const start = (cfg.currentPage - 1) * cfg.pageSize + 1;
    const end = Math.min(cfg.currentPage * cfg.pageSize, cfg.totalItems);
    return `Showing ${start}-${end} of ${cfg.totalItems}`;
  });

  getButtonVariant(page: number): 'primary' | 'secondary' | 'outline' | 'subtle' | 'transparent' {
    const cfg = this.config();
    if (page === cfg.currentPage) {
      return 'primary';
    }
    return 'subtle';
  }

  isEllipsis(page: number): boolean {
    return page === -1;
  }

  onPageClick(page: number): void {
    if (page === -1 || page === this.config().currentPage) {
      return;
    }
    this.pageChange.emit(page);
  }

  onFirstClick(): void {
    if (this.canGoToFirst()) {
      this.pageChange.emit(1);
    }
  }

  onPreviousClick(): void {
    if (this.canGoToPrevious()) {
      this.pageChange.emit(this.config().currentPage - 1);
    }
  }

  onNextClick(): void {
    if (this.canGoToNext()) {
      this.pageChange.emit(this.config().currentPage + 1);
    }
  }

  onLastClick(): void {
    if (this.canGoToLast()) {
      this.pageChange.emit(this.config().totalPages);
    }
  }

  onPageSizeSelected(pageSize: number | string): void {
    const size = typeof pageSize === 'string' ? parseInt(pageSize, 10) : pageSize;
    this.pageSizeChange.emit(size);
  }

  getPageSizeItems(): DropdownItem[] {
    const options = this.config().pageSizeOptions || [];
    return options.map(option => ({
      value: option,
      label: option.toString(),
    }));
  }

  getPaginationClasses(): string {
    const classes = ['pagination'];
    classes.push(`pagination--${this.size()}`);
    return classes.join(' ');
  }
}
