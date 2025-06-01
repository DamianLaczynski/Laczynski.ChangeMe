import { Injectable, inject, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/api';
import { State } from '@core/state';
import { PaginationResult } from '@core/data-grid';
import {
  Item,
  CreateItemRequest,
  UpdateItemRequest,
  ItemSearchParameters,
} from '../models/item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private readonly apiService = inject(ApiService);

  // Base endpoint for items API
  private readonly baseEndpoint = 'items';

  /**
   * Get all items with pagination
   * @param params Search and pagination parameters
   * @returns Observable with paginated items result
   */
  getAllItems(params: ItemSearchParameters): Observable<PaginationResult<Item>> {
    return this.apiService.getPaginated<Item, ItemSearchParameters>(this.baseEndpoint, params);
  }

  /**
   * Get all items with pagination and state management
   * @param state State signal to update
   * @param params Search and pagination parameters
   * @returns Observable with paginated items result
   */
  getAllItemsWithState(
    state: WritableSignal<State<PaginationResult<Item>>>,
    params: ItemSearchParameters,
  ): Observable<PaginationResult<Item>> {
    return this.apiService.getPaginatedWithState(this.baseEndpoint, state, params);
  }

  /**
   * Get all items with infinite scroll and state management
   * @param state State signal to update
   * @param params Search and pagination parameters
   * @returns Observable with paginated items result
   */
  getAllItemsInfiniteWithState(
    state: WritableSignal<State<PaginationResult<Item>>>,
    params: ItemSearchParameters,
  ): Observable<PaginationResult<Item>> {
    return this.apiService.getInfiniteWithState(this.baseEndpoint, state, params);
  }

  /**
   * Get single item by ID
   * @param id Item ID
   * @returns Observable with item data
   */
  getItem(id: string): Observable<Item> {
    return this.apiService.get<Item>(`${this.baseEndpoint}/${id}`);
  }

  /**
   * Get single item by ID with state management
   * @param state State signal to update
   * @param id Item ID
   * @returns Observable with item data
   */
  getItemWithState(state: WritableSignal<State<Item>>, id: string): Observable<Item> {
    return this.apiService.getWithState(`${this.baseEndpoint}/${id}`, state);
  }

  /**
   * Create new item
   * @param request Create item request data
   * @returns Observable with created item ID
   */
  createItem(request: CreateItemRequest): Observable<string> {
    return this.apiService.post<string>(this.baseEndpoint, request);
  }

  /**
   * Create new item with state management
   * @param state State signal to update
   * @param request Create item request data
   * @returns Observable with created item ID
   */
  createItemWithState(
    state: WritableSignal<State<string>>,
    request: CreateItemRequest,
  ): Observable<string> {
    return this.apiService.postWithState(this.baseEndpoint, state, request);
  }

  /**
   * Update existing item
   * @param request Update item request data
   * @returns Observable with updated item data
   */
  updateItem(request: UpdateItemRequest): Observable<Item> {
    return this.apiService.put<Item>(`${this.baseEndpoint}/${request.id}`, request);
  }

  /**
   * Update existing item with state management
   * @param state State signal to update
   * @param request Update item request data
   * @returns Observable with updated item data
   */
  updateItemWithState(
    state: WritableSignal<State<Item>>,
    request: UpdateItemRequest,
  ): Observable<Item> {
    return this.apiService.putWithState(`${this.baseEndpoint}/${request.id}`, state, request);
  }

  /**
   * Delete item by ID
   * @param id Item ID to delete
   * @returns Observable with delete operation result
   */
  deleteItem(id: string): Observable<boolean> {
    return this.apiService.delete<boolean>(`${this.baseEndpoint}/${id}`);
  }

  /**
   * Delete item by ID with state management
   * @param state State signal to update
   * @param id Item ID to delete
   * @returns Observable with delete operation result
   */
  deleteItemWithState(state: WritableSignal<State<boolean>>, id: string): Observable<boolean> {
    return this.apiService.deleteWithState(`${this.baseEndpoint}/${id}`, state);
  }

  /**
   * Create initial search parameters
   * @param overrides Optional parameter overrides
   * @returns Default search parameters
   */
  createSearchParameters(overrides?: Partial<ItemSearchParameters>): ItemSearchParameters {
    return {
      pageNumber: 1,
      pageSize: 10,
      sortField: 'name',
      ascending: true,
      searchTerm: '',
      ...overrides,
    };
  }
}
