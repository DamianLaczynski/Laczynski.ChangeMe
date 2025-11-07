import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination.component';

@Component({
  selector: 'app-pagination-showcase',
  imports: [CommonModule, PaginationComponent],
  template: `
    <div class="showcase">
      <h1>Pagination Component</h1>
      <p class="showcase__description">
        A flexible pagination component following Fluent 2 Design System principles. Supports page
        navigation, page size selection, and displays pagination information.
      </p>

      <!-- Basic Pagination -->
      <section class="showcase__section">
        <h2>Basic Pagination</h2>
        <p>Simple pagination with default settings.</p>
        <div class="showcase__example">
          <app-pagination
            [totalCount]="basicTotalCount"
            [pageSize]="basicPageSize()"
            [currentPage]="basicCurrentPage()"
            [pageSizeOptions]="[10, 20, 50, 100]"
            (pageChange)="onBasicPageChange($event)"
            (pageSizeChange)="onBasicPageSizeChange($event)"
          />
        </div>
        @if (basicCurrentPage() || basicPageSize()) {
          <p class="showcase__info">
            Current page: {{ basicCurrentPage() }}, Page size: {{ basicPageSize() }}, Total items:
            {{ basicTotalCount }}
          </p>
        }
      </section>

      <!-- Pagination with Many Pages -->
      <section class="showcase__section">
        <h2>Pagination with Many Pages</h2>
        <p>Pagination with ellipsis for large page counts.</p>
        <div class="showcase__example">
          <app-pagination
            [totalCount]="manyPagesTotalCount"
            [pageSize]="manyPagesPageSize()"
            [currentPage]="manyPagesCurrentPage()"
            [pageSizeOptions]="[5, 10, 20, 50, 100]"
            (pageChange)="onManyPagesPageChange($event)"
            (pageSizeChange)="onManyPagesPageSizeChange($event)"
          />
        </div>
        @if (manyPagesCurrentPage() || manyPagesPageSize()) {
          <p class="showcase__info">
            Current page: {{ manyPagesCurrentPage() }}, Page size: {{ manyPagesPageSize() }}, Total
            items: {{ manyPagesTotalCount }}
          </p>
        }
      </section>

      <!-- Size Variants -->
      <section class="showcase__section">
        <h2>Size Variants</h2>

        <h3>Small</h3>
        <div class="showcase__example">
          <app-pagination
            [totalCount]="50"
            [pageSize]="10"
            [currentPage]="sizeSmallPage()"
            [size]="'small'"
            (pageChange)="sizeSmallPage.set($event)"
          />
        </div>

        <h3>Medium (Default)</h3>
        <div class="showcase__example">
          <app-pagination
            [totalCount]="50"
            [pageSize]="10"
            [currentPage]="sizeMediumPage()"
            [size]="'medium'"
            (pageChange)="sizeMediumPage.set($event)"
          />
        </div>

        <h3>Large</h3>
        <div class="showcase__example">
          <app-pagination
            [totalCount]="50"
            [pageSize]="10"
            [currentPage]="sizeLargePage()"
            [size]="'large'"
            (pageChange)="sizeLargePage.set($event)"
          />
        </div>
      </section>

      <!-- Custom Page Size Options -->
      <section class="showcase__section">
        <h2>Custom Page Size Options</h2>
        <p>Pagination with custom page size options.</p>
        <div class="showcase__example">
          <app-pagination
            [totalCount]="75"
            [pageSize]="customPageSize()"
            [currentPage]="customCurrentPage()"
            [pageSizeOptions]="[5, 15, 25, 50]"
            (pageChange)="customCurrentPage.set($event)"
            (pageSizeChange)="customPageSize.set($event)"
          />
        </div>
        @if (customCurrentPage() || customPageSize()) {
          <p class="showcase__info">
            Current page: {{ customCurrentPage() }}, Page size: {{ customPageSize() }}
          </p>
        }
      </section>

      <!-- Edge Cases -->
      <section class="showcase__section">
        <h2>Edge Cases</h2>

        <h3>Single Page</h3>
        <div class="showcase__example">
          <app-pagination
            [totalCount]="5"
            [pageSize]="10"
            [currentPage]="1"
            [pageSizeOptions]="[10, 20, 50]"
          />
        </div>

        <h3>Empty Data</h3>
        <div class="showcase__example">
          <app-pagination
            [totalCount]="0"
            [pageSize]="10"
            [currentPage]="1"
            [pageSizeOptions]="[10, 20, 50]"
          />
        </div>

        <h3>First Page</h3>
        <div class="showcase__example">
          <app-pagination
            [totalCount]="100"
            [pageSize]="10"
            [currentPage]="1"
            [pageSizeOptions]="[10, 20, 50]"
          />
        </div>

        <h3>Last Page</h3>
        <div class="showcase__example">
          <app-pagination
            [totalCount]="100"
            [pageSize]="10"
            [currentPage]="10"
            [pageSizeOptions]="[10, 20, 50]"
          />
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
    `,
  ],
})
export class PaginationShowcaseComponent {
  // Basic pagination state
  basicCurrentPage = signal<number>(1);
  basicPageSize = signal<number>(10);
  basicTotalCount = 25;

  // Many pages pagination state
  manyPagesCurrentPage = signal<number>(1);
  manyPagesPageSize = signal<number>(10);
  manyPagesTotalCount = 150;

  // Size variants state
  sizeSmallPage = signal<number>(1);
  sizeMediumPage = signal<number>(1);
  sizeLargePage = signal<number>(1);

  // Custom page size options state
  customCurrentPage = signal<number>(1);
  customPageSize = signal<number>(15);

  // Event handlers
  onBasicPageChange(page: number): void {
    this.basicCurrentPage.set(page);
    console.log('Basic pagination - Page changed to:', page);
  }

  onBasicPageSizeChange(size: number): void {
    this.basicPageSize.set(size);
    this.basicCurrentPage.set(1); // Reset to first page when page size changes
    console.log('Basic pagination - Page size changed to:', size);
  }

  onManyPagesPageChange(page: number): void {
    this.manyPagesCurrentPage.set(page);
    console.log('Many pages - Page changed to:', page);
  }

  onManyPagesPageSizeChange(size: number): void {
    this.manyPagesPageSize.set(size);
    this.manyPagesCurrentPage.set(1); // Reset to first page when page size changes
    console.log('Many pages - Page size changed to:', size);
  }
}
