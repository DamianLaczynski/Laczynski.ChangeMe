import { PaginationParameters } from '@core/data-grid/models/pagination-parameters.model';

/**
 * Item model matching the backend ItemDto structure
 */
export interface Item {
  /** Unique identifier of the item */
  id: string;

  /** Item name */
  name: string;

  /** Item description */
  description: string;

  /** Item price */
  price: number;

  /** Item image URL */
  image: string;

  /** Date when item was created */
  createdAt?: Date;

  /** Date when item was last updated */
  updatedAt?: Date;
}

/**
 * Request model for creating new item
 */
export interface CreateItemRequest {
  /** Item name */
  name: string;

  /** Item description */
  description: string;

  /** Item price */
  price: number;

  /** Item image URL */
  image: string;
}

/**
 * Request model for updating item
 */
export interface UpdateItemRequest {
  /** Item ID to update */
  id: string;

  /** Item name */
  name: string;

  /** Item description */
  description: string;

  /** Item price */
  price: number;

  /** Item image URL */
  image: string;
}

/**
 * Parameters for searching items
 */
export interface ItemSearchParameters extends PaginationParameters {
  /** Search term for filtering items */
  searchTerm?: string;
}
