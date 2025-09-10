import {
  Component,
  WritableSignal,
  inject,
  signal,
  TemplateRef,
  viewChild,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  PaginatedTableComponent,
  PaginatedTableConfig,
  createPaginatedTableConfig,
  DataGridColumn,
  PaginationResult,
} from '@shared/data';
import { State, StateService } from '@shared/state';
import { ItemsService } from '../../services/items.service';
import { Item, ItemSearchParameters } from '../../models/item.model';
import { TextComponent } from '@shared/components/field/text/text.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ItemFormComponent } from '../item-form/item-form.component';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PaginatedTableComponent,
    TextComponent,
    ButtonComponent,
    ModalComponent,
    ItemFormComponent,
  ],
  templateUrl: './items-list.component.html',
})
export class ItemsListComponent {
  private readonly itemsService = inject(ItemsService);
  private readonly stateService = inject(StateService);
  private readonly router = inject(Router);

  // State management
  itemsState: WritableSignal<State<PaginationResult<Item>>> = this.stateService.createState();

  // Search parameters
  searchTerm = model('');
  modalVisible = model<boolean>(false);
  selectedItemId = model<string>('');
  addNewItemModalVisible = model<boolean>(false);
  // Table configuration
  tableConfig = signal<PaginatedTableConfig<Item, ItemSearchParameters>>(this.createTableConfig());

  // Template references
  actionsTemplate = viewChild<TemplateRef<any>>('actionsTemplate');
  priceTemplate = viewChild<TemplateRef<any>>('priceTemplate');
  imageTemplate = viewChild<TemplateRef<any>>('imageTemplate');

  /**
   * Load items with current search parameters
   */
  private loadItems(reset: boolean = false): void {
    if (reset) {
      this.tableConfig.update(config => ({
        ...config,
        params: { ...config.params, pageNumber: 1 },
      }));
    }

    const params = this.itemsService.createSearchParameters({
      searchTerm: this.searchTerm(),
      ...this.tableConfig().params,
    });

    this.itemsService.getAllItemsWithState(this.itemsState, params).subscribe();
  }

  /**
   * Handle search input changes
   */
  onSearchChange(): void {
    // Update table config params with search term
    this.tableConfig.update(config => ({
      ...config,
      params: {
        ...config.params,
        pageNumber: 1,
        searchTerm: this.searchTerm(),
      },
    }));

    // Trigger table reload by calling dataSource with updated params
    const params = this.itemsService.createSearchParameters({
      searchTerm: this.searchTerm(),
      ...this.tableConfig().params,
    });

    this.tableConfig().dataSource(params).subscribe();
  }

  /**
   * Handle item selection from table
   */
  onItemSelect(item: Item): void {
    console.log('Selected item:', item);
    // Here you can implement navigation to item details or other actions
  }

  /**
   * Handle add new item action
   */
  onAddNewItem(): void {
    this.addNewItemModalVisible.set(true);
  }

  /**
   * Handle item edit action
   */
  onEditItem(item: Item): void {
    console.log('onEditItem', item);
    console.log('modalVisible', this.modalVisible());
    console.log('selectedItemId', this.selectedItemId());
    if (!this.modalVisible()) {
      this.modalVisible.set(true);
      this.selectedItemId.set(item.id);
    }
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
    console.log('Image error:', event);
    const target = event.target as HTMLImageElement;
    if (target) {
      //target.src = '/assets/images/placeholder.png';
    }
  }

  /**
   * Create table configuration
   */
  private createTableConfig(): PaginatedTableConfig<Item, ItemSearchParameters> {
    const columns: DataGridColumn<Item>[] = [
      {
        field: 'id',
        header: 'ID',
        sortable: true,
        hideOnMobile: true,
      },
      {
        field: 'name',
        header: 'Name',
        sortable: true,
      },
      {
        field: 'description',
        header: 'Description',
        sortable: false,
        hideOnMobile: true,
      },
      {
        field: 'price',
        header: 'Price',
        sortable: true,
        templateRef: 'priceTemplate',
      },
      {
        field: '',
        header: 'Actions',
        templateRef: 'actionsTemplate',
        sortable: false,
      },
    ];

    return createPaginatedTableConfig<Item, ItemSearchParameters>({
      state: this.itemsState,
      columns: columns,
      dataSource: (params: ItemSearchParameters) => {
        // Use state management for all data loading
        return this.itemsService.getAllItemsWithState(this.itemsState, params);
      },
      params: this.itemsService.createSearchParameters(),
      emptyStateMessage: 'Brak elementów do wyświetlenia',
      pageSizeOptions: [10, 25, 50, 100],
      showPageSizeSelector: true,
    });
  }

  /**
   * Get column templates for the table
   */
  getColumnTemplates(): { [key: string]: TemplateRef<any> } {
    return {
      actionsTemplate: this.actionsTemplate()!,
      priceTemplate: this.priceTemplate()!,
      imageTemplate: this.imageTemplate()!,
    };
  }

  onUpdated(): void {
    this.modalVisible.set(false);
    this.addNewItemModalVisible.set(false);
    this.loadItems(true);
  }
}
