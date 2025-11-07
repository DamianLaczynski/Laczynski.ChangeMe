import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { DropdownComponent, DropdownItem } from '../field/dropdown/dropdown.component';
import { Size } from '../utils';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  imports: [CommonModule, FormsModule, ButtonComponent, DropdownComponent],
})
export class PaginationComponent {
  // Inputs
  totalCount = input<number>(0);
  pageSize = input<number>(10);
  currentPage = input<number>(1);
  pageSizeOptions = input<number[]>([10, 20, 50, 100]);
  size = input<Size>('medium');

  // Outputs
  pageChange = output<number>();
  pageSizeChange = output<number>();

  // Computed properties
  totalPages = computed(() => {
    const total = this.totalCount();
    const size = this.pageSize();
    if (total === 0 || size === 0) return 1;
    return Math.ceil(total / size);
  });

  hasPreviousPage = computed(() => {
    return this.currentPage() > 1;
  });

  hasNextPage = computed(() => {
    return this.currentPage() < this.totalPages();
  });

  firstRecord = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    const page = this.currentPage();
    const size = this.pageSize();
    return (page - 1) * size + 1;
  });

  lastRecord = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    const page = this.currentPage();
    const size = this.pageSize();
    const last = page * size;
    return Math.min(last, total);
  });

  visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const pages: number[] = [];

    if (total <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (current <= 4) {
        // Show pages 2-5, then ellipsis, then last
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis marker
        pages.push(total);
      } else if (current >= total - 3) {
        // Show first, ellipsis, then last 5 pages
        pages.push(-1); // Ellipsis marker
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        // Show first, ellipsis, current-1, current, current+1, ellipsis, last
        pages.push(-1); // Ellipsis marker
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis marker
        pages.push(total);
      }
    }

    return pages;
  });

  pageSizeDropdownItems = computed(() => {
    return this.pageSizeOptions().map(size => ({
      value: size.toString(),
      label: size.toString(),
      type: 'single' as const,
    }));
  });

  // Methods
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }
    this.pageChange.emit(page);
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages());
  }

  onPageSizeChange(item: DropdownItem): void {
    const newSize = parseInt(item.value.toString(), 10);
    if (newSize !== this.pageSize()) {
      this.pageSizeChange.emit(newSize);
    }
  }

  getCurrentPageSizeValue(): string {
    return this.pageSize().toString();
  }
}
