import {
  Component,
  OnInit,
  AfterViewInit,
  WritableSignal,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  InfinityListComponent,
  InfinityListConfig,
  createInfinityListConfig,
  PaginationResult,
} from '@shared/data';
import { StateContainerComponent, State, StateService } from '@shared/state';
import { ItemsService } from '../../services/items.service';
import { Item, ItemSearchParameters } from '../../models/item.model';

@Component({
  selector: 'app-items-infinite-list',

  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    InfinityListComponent,
    StateContainerComponent,
  ],
  templateUrl: './items-infinite-list.component.html',
})
export class ItemsInfiniteListComponent implements OnInit, AfterViewInit {
  private readonly itemsService = inject(ItemsService);
  private readonly stateService = inject(StateService);
  private readonly router = inject(Router);

  // State management
  itemsState: WritableSignal<State<PaginationResult<Item>>> = this.stateService.createState();

  // Search parameters
  searchTerm = signal('');

  // List configuration
  listConfig = signal<InfinityListConfig<Item, ItemSearchParameters>>(this.createListConfig());

  // Template references
  itemTemplate = viewChild<TemplateRef<any>>('itemTemplate');

  ngOnInit(): void {
    this.loadItems();
  }

  ngAfterViewInit(): void {
    // Update list config with template after view initialization
    this.listConfig.update(config => ({
      ...config,
      itemTemplate: this.itemTemplate(),
    }));
  }

  /**
   * Load items with current search parameters
   */
  private loadItems(): void {
    const params = this.itemsService.createSearchParameters({
      searchTerm: this.searchTerm(),
      ...this.listConfig().params,
    });

    this.itemsService.getAllItemsWithState(this.itemsState, params).subscribe();
  }

  /**
   * Handle search input changes
   */
  onSearchChange(): void {
    // Reset to first page when searching
    this.listConfig.update(config => ({
      ...config,
      params: {
        ...config.params,
        pageNumber: 1,
        searchTerm: this.searchTerm(),
      },
    }));

    this.loadItems();
  }

  /**
   * Handle item selection from list
   */
  onItemSelect(item: Item): void {
    console.log('Selected item:', item);
    // Here you can implement navigation to item details or other actions
  }

  /**
   * Handle add new item action
   */
  onAddNewItem(): void {
    this.router.navigate(['/items/add']);
  }

  /**
   * Handle item edit action
   */
  onEditItem(item: Item): void {
    this.router.navigate(['/items/edit', item.id]);
  }

  /**
   * Handle item delete action
   */
  onDeleteItem(item: Item): void {
    if (confirm(`Czy na pewno chcesz usunąć element "${item.name}"?`)) {
      this.itemsService.deleteItem(item.id).subscribe({
        next: () => {
          // Reload items after successful deletion
          this.loadItems();
        },
        error: error => {
          console.error('Error deleting item:', error);
        },
      });
    }
  }

  /**
   * Handle image load error
   */
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      //target.src = '/assets/images/placeholder.png';
    }
  }

  /**
   * Create list configuration
   */
  private createListConfig(): InfinityListConfig<Item, ItemSearchParameters> {
    return createInfinityListConfig<Item, ItemSearchParameters>({
      state: this.itemsState,
      itemTemplate: undefined, // Will be set in ngOnInit
      dataSource: (params: ItemSearchParameters) => {
        return this.itemsService.getAllItemsInfiniteWithState(this.itemsState, params);
      },
      params: this.itemsService.createSearchParameters(),
      emptyMessage: 'Brak elementów do wyświetlenia',
      showLoadingIndicator: true,
    });
  }
}
