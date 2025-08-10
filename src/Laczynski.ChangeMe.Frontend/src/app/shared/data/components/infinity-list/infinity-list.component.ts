import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationParameters } from '../../models/pagination-parameters.model';
import { InfinityListConfig } from './models/infinity-list-config.model';

@Component({
  selector: 'app-infinity-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './infinity-list.component.html',
  styles: [
    `
      .infinity-scroll-container {
        height: 100%;
        overflow-y: auto;
      }
    `,
  ],
})
export class InfinityListComponent<T, P extends PaginationParameters = PaginationParameters>
  implements OnInit
{
  scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  config = model.required<InfinityListConfig<T, P>>();
  columnTemplates = input<{ [key: string]: TemplateRef<any> }>({});
  itemSelect = output<T>();

  ngOnInit(): void {
    this.config.update(config => ({
      ...config,
      emptyMessage: config.emptyMessage || 'No items available',
      showLoadingIndicator: config.showLoadingIndicator ?? true,
    }));
  }

  /**
   * Handle scroll events
   */
  onScroll(event: any): void {
    const target = event.target as HTMLElement;
    if (this.shouldLoadMore(target)) {
      this.loadMoreItems();
    }
  }

  /**
   * Check if more items should be loaded
   */
  private shouldLoadMore(scrollElement: HTMLElement): boolean {
    if (this.config().state().isLoading || !this.config().state().data?.hasNext) {
      return false;
    }

    const { scrollTop, scrollHeight, clientHeight } = scrollElement;
    const scrollPosition = scrollTop + clientHeight;
    const scrollThresholdPosition = scrollHeight - this.config().scrollThreshold;

    return scrollPosition >= scrollThresholdPosition;
  }

  /**
   * Load more items
   */
  loadMoreItems(): void {
    if (this.config().state().isLoading || !this.config().state().data?.hasNext) {
      return;
    }

    // Create new params object instead of mutating existing one
    const newParams = {
      ...this.config().params,
      pageNumber: (this.config().params.pageNumber || 1) + 1,
    } as P;

    this.config.update(config => ({
      ...config,
      params: newParams,
    }));

    this.config().dataSource(newParams).subscribe();
  }

  /**
   * Handle item selection
   */
  handleItemSelect(item: T): void {
    this.itemSelect.emit(item);
  }

  /**
   * Force reload data
   */
  refresh(): void {
    const resetParams = { ...this.config().params, pageNumber: 1 } as P;
    this.config.update(config => ({
      ...config,
      params: resetParams,
    }));

    this.config()
      .dataSource(resetParams)
      .subscribe({
        next: () => {},
        error: error => {
          console.error('Error refreshing data:', error);
        },
      });
  }

  /**
   * Track items by identifier function for ngFor optimization
   */
  trackByFn(index: number, item: any): any {
    return item?.id || item?.identifier || index;
  }
}
