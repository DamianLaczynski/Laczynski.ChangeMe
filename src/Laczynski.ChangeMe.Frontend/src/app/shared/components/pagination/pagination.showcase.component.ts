import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent, PaginationConfig } from './pagination.component';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-pagination-showcase',
  imports: [CommonModule, PaginationComponent, TableOfContentComponent],
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
        <h1 class="showcase__title">Pagination Component</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Pagination component built with Fluent 2 Design System. The
        Pagination component provides navigation controls for paginated data with support for page
        numbers, navigation buttons, page size selection, and info display.
      </p>

      <!-- Basic Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Pagination</h2>
        <p class="showcase__section__description">
          Simple pagination with page numbers and navigation buttons.
        </p>
        <div class="showcase__preview">
          <app-pagination
            [config]="basicConfig()"
            (pageChange)="onPageChange($event, 'basic')"
          />
        </div>
      </div>

      <!-- With Info -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Pagination with Info</h2>
        <p class="showcase__section__description">
          Pagination displaying information about the current page and total items.
        </p>
        <div class="showcase__preview">
          <app-pagination
            [config]="infoConfig()"
            (pageChange)="onPageChange($event, 'info')"
          />
        </div>
      </div>

      <!-- With First/Last Buttons -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Pagination with First/Last</h2>
        <p class="showcase__section__description">
          Pagination with first and last page navigation buttons.
        </p>
        <div class="showcase__preview">
          <app-pagination
            [config]="firstLastConfig()"
            (pageChange)="onPageChange($event, 'firstLast')"
          />
        </div>
      </div>

      <!-- With Page Size Selector -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Pagination with Page Size Selector</h2>
        <p class="showcase__section__description">
          Pagination with dropdown to select items per page.
        </p>
        <div class="showcase__preview">
          <app-pagination
            [config]="pageSizeConfig()"
            (pageChange)="onPageChange($event, 'pageSize')"
            (pageSizeChange)="onPageSizeChange($event, 'pageSize')"
          />
        </div>
      </div>

      <!-- Full Featured -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Full Featured Pagination</h2>
        <p class="showcase__section__description">
          Complete pagination with all features: info, first/last buttons, and page size selector.
        </p>
        <div class="showcase__preview">
          <app-pagination
            [config]="fullConfig()"
            (pageChange)="onPageChange($event, 'full')"
            (pageSizeChange)="onPageSizeChange($event, 'full')"
          />
        </div>
      </div>

      <!-- Many Pages -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Pagination with Many Pages</h2>
        <p class="showcase__section__description">
          Pagination with ellipsis for large page counts (100 pages).
        </p>
        <div class="showcase__preview">
          <app-pagination
            [config]="manyPagesConfig()"
            (pageChange)="onPageChange($event, 'manyPages')"
          />
        </div>
      </div>

      <!-- Sizes -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Pagination Sizes</h2>
        <p class="showcase__section__description">
          Pagination in different sizes: small, medium, and large.
        </p>
        <div class="showcase__preview">
          <div class="showcase__preview-item">
            <h3>Small</h3>
            <app-pagination
              [config]="smallConfig()"
              size="small"
              (pageChange)="onPageChange($event, 'small')"
            />
          </div>
          <div class="showcase__preview-item">
            <h3>Medium</h3>
            <app-pagination
              [config]="mediumConfig()"
              size="medium"
              (pageChange)="onPageChange($event, 'medium')"
            />
          </div>
          <div class="showcase__preview-item">
            <h3>Large</h3>
            <app-pagination
              [config]="largeConfig()"
              size="large"
              (pageChange)="onPageChange($event, 'large')"
            />
          </div>
        </div>
      </div>

      <!-- Without Page Numbers -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Pagination without Page Numbers</h2>
        <p class="showcase__section__description">
          Minimal pagination with only previous/next buttons.
        </p>
        <div class="showcase__preview">
          <app-pagination
            [config]="minimalConfig()"
            (pageChange)="onPageChange($event, 'minimal')"
          />
        </div>
      </div>

      <!-- Usage Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Usage Example</h2>
        <p class="showcase__section__description">
          Example of how to use the Pagination component in your application:
        </p>
        <div class="showcase__code">
          <pre><code>{{ usageExample }}</code></pre>
        </div>
      </div>
      </div>
    </div>
  `,
})
export class PaginationShowcaseComponent {
  // State for each example
  basicPage = signal<number>(3);
  infoPage = signal<number>(2);
  firstLastPage = signal<number>(5);
  pageSizePage = signal<number>(1);
  pageSizePageSize = signal<number>(10);
  fullPage = signal<number>(4);
  fullPageSize = signal<number>(20);
  manyPagesPage = signal<number>(50);
  smallPage = signal<number>(2);
  mediumPage = signal<number>(2);
  largePage = signal<number>(2);
  minimalPage = signal<number>(3);

  smallConfig = signal<PaginationConfig>({
    currentPage: this.smallPage(),
    totalPages: 10,
    totalItems: 100,
    pageSize: 10,
    showPageNumbers: true,
    maxVisiblePages: 7,
  });

  mediumConfig = signal<PaginationConfig>({
    currentPage: this.mediumPage(),
    totalPages: 10,
    totalItems: 100,
    pageSize: 10,
    showPageNumbers: true,
    maxVisiblePages: 7,
  });

  largeConfig = signal<PaginationConfig>({
    currentPage: this.largePage(),
    totalPages: 10,
    totalItems: 100,
    pageSize: 10,
    showPageNumbers: true,
    maxVisiblePages: 7,
  });

  basicConfig = signal<PaginationConfig>({
    currentPage: this.basicPage(),
    totalPages: 10,
    totalItems: 100,
    pageSize: 10,
    showPageNumbers: true,
    maxVisiblePages: 7,
  });

  infoConfig = signal<PaginationConfig>({
    currentPage: this.infoPage(),
    totalPages: 10,
    totalItems: 100,
    pageSize: 10,
    showPageNumbers: true,
    showInfo: true,
    maxVisiblePages: 7,
  });

  firstLastConfig = signal<PaginationConfig>({
    currentPage: this.firstLastPage(),
    totalPages: 10,
    totalItems: 100,
    pageSize: 10,
    showPageNumbers: true,
    showFirstLast: true,
    maxVisiblePages: 7,
  });

  pageSizeConfig = signal<PaginationConfig>({
    currentPage: this.pageSizePage(),
    totalPages: 10,
    totalItems: 100,
    pageSize: this.pageSizePageSize(),
    showPageNumbers: true,
    showPageSizeSelector: true,
    pageSizeOptions: [10, 20, 50, 100],
    maxVisiblePages: 7,
  });

  fullConfig = signal<PaginationConfig>({
    currentPage: this.fullPage(),
    totalPages: 10,
    totalItems: 200,
    pageSize: this.fullPageSize(),
    showPageNumbers: true,
    showFirstLast: true,
    showInfo: true,
    showPageSizeSelector: true,
    pageSizeOptions: [10, 20, 50, 100],
    maxVisiblePages: 7,
  });

  manyPagesConfig = signal<PaginationConfig>({
    currentPage: this.manyPagesPage(),
    totalPages: 100,
    totalItems: 1000,
    pageSize: 10,
    showPageNumbers: true,
    showFirstLast: true,
    showInfo: true,
    maxVisiblePages: 7,
  });

  minimalConfig = signal<PaginationConfig>({
    currentPage: this.minimalPage(),
    totalPages: 10,
    totalItems: 100,
    pageSize: 10,
    showPageNumbers: false,
    maxVisiblePages: 7,
  });

  usageExample = `// In your component
import { PaginationComponent, PaginationConfig } from '@shared/components/pagination';

@Component({
  template: \`
    <app-pagination
      [config]="paginationConfig()"
      (pageChange)="onPageChange($event)"
      (pageSizeChange)="onPageSizeChange($event)"
    />
  \`
})
export class MyComponent {
  currentPage = signal(1);
  pageSize = signal(10);
  totalItems = signal(100);

  paginationConfig = computed<PaginationConfig>(() => ({
    currentPage: this.currentPage(),
    totalPages: Math.ceil(this.totalItems() / this.pageSize()),
    totalItems: this.totalItems(),
    pageSize: this.pageSize(),
    showPageNumbers: true,
    showFirstLast: true,
    showInfo: true,
    showPageSizeSelector: true,
    pageSizeOptions: [10, 20, 50, 100],
    maxVisiblePages: 7,
  }));

  onPageChange(page: number): void {
    this.currentPage.set(page);
    // Load data for the new page
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1); // Reset to first page
    // Reload data with new page size
  }
}`;

  onPageChange(page: number, example: string): void {
    console.log(`${example} page changed to:`, page);

    switch (example) {
      case 'basic':
        this.basicPage.set(page);
        this.basicConfig.update(cfg => ({ ...cfg, currentPage: page }));
        break;
      case 'info':
        this.infoPage.set(page);
        this.infoConfig.update(cfg => ({ ...cfg, currentPage: page }));
        break;
      case 'firstLast':
        this.firstLastPage.set(page);
        this.firstLastConfig.update(cfg => ({ ...cfg, currentPage: page }));
        break;
      case 'pageSize':
        this.pageSizePage.set(page);
        this.pageSizeConfig.update(cfg => ({ ...cfg, currentPage: page }));
        break;
      case 'full':
        this.fullPage.set(page);
        this.fullConfig.update(cfg => ({ ...cfg, currentPage: page }));
        break;
      case 'manyPages':
        this.manyPagesPage.set(page);
        this.manyPagesConfig.update(cfg => ({ ...cfg, currentPage: page }));
        break;
      case 'small':
        this.smallPage.set(page);
        this.smallConfig.update(cfg => ({ ...cfg, currentPage: page }));
        break;
      case 'medium':
        this.mediumPage.set(page);
        this.mediumConfig.update(cfg => ({ ...cfg, currentPage: page }));
        break;
      case 'large':
        this.largePage.set(page);
        this.largeConfig.update(cfg => ({ ...cfg, currentPage: page }));
        break;
      case 'minimal':
        this.minimalPage.set(page);
        this.minimalConfig.update(cfg => ({ ...cfg, currentPage: page }));
        break;
    }
  }

  onPageSizeChange(size: number, example: string): void {
    console.log(`${example} page size changed to:`, size);

    if (example === 'pageSize') {
      this.pageSizePageSize.set(size);
      const totalPages = Math.ceil(100 / size);
      this.pageSizeConfig.update(cfg => ({
        ...cfg,
        pageSize: size,
        totalPages,
      }));
    } else if (example === 'full') {
      this.fullPageSize.set(size);
      const totalPages = Math.ceil(200 / size);
      this.fullPage.set(1); // Reset to first page
      this.fullConfig.update(cfg => ({
        ...cfg,
        pageSize: size,
        totalPages,
        currentPage: 1,
      }));
    }
  }
}

