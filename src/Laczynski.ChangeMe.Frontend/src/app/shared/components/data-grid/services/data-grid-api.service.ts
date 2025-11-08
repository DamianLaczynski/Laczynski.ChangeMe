import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { DataGridRow } from '../models/data-grid-column.model';
import {
  DataGridActiveFilter,
  DataGridFilterValue,
  TextFilterOperator,
  NumberFilterOperator,
  DateFilterOperator,
} from '../models/data-grid-filter.model';

export interface DataGridApiRequest<T = any> {
  page: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: DataGridActiveFilter[];
}

export interface DataGridApiResponse<T = any> {
  data: DataGridRow<T>[];
  totalCount: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataGridApiService<T = any> {
  // Mock data storage
  private mockData: DataGridRow<T>[] = [];

  /**
   * Initialize mock data
   */
  initializeMockData(data: DataGridRow<T>[]): void {
    this.mockData = [...data];
  }

  /**
   * Simulate API call with delay
   */
  getData(request: DataGridApiRequest<T>): Observable<DataGridApiResponse<T>> {
    // Simulate network delay (500-1000ms)
    const delayMs = 500 + Math.random() * 500;

    return of(this.processRequest(request)).pipe(delay(delayMs));
  }

  /**
   * Process request: filter, sort, and paginate
   */
  private processRequest(request: DataGridApiRequest<T>): DataGridApiResponse<T> {
    let result = [...this.mockData];

    // Apply filters
    if (request.filters && request.filters.length > 0) {
      result = this.applyFilters(result, request.filters);
    }

    // Apply sorting
    if (request.sortField) {
      result = this.applySorting(result, request.sortField, request.sortDirection || 'asc');
    }

    // Get total count before pagination
    const totalCount = result.length;

    // Apply pagination
    const startIndex = (request.page - 1) * request.pageSize;
    const endIndex = startIndex + request.pageSize;
    result = result.slice(startIndex, endIndex);

    return {
      data: result,
      totalCount,
      page: request.page,
      pageSize: request.pageSize,
    };
  }

  /**
   * Apply filters to data
   */
  private applyFilters(data: DataGridRow<T>[], filters: DataGridActiveFilter[]): DataGridRow<T>[] {
    return data.filter(row => {
      return filters.every(filter => {
        return this.matchesFilter(row, filter);
      });
    });
  }

  /**
   * Check if row matches a single filter
   */
  private matchesFilter(row: DataGridRow<T>, filter: DataGridActiveFilter): boolean {
    const fieldValue = this.getFieldValue(row.data, filter.columnId);
    const filterValue = filter.filter;

    switch (filter.type) {
      case 'text':
        return this.matchesTextFilter(
          fieldValue,
          filterValue,
          filter.filter.operator as TextFilterOperator,
        );
      case 'number':
        return this.matchesNumberFilter(
          fieldValue,
          filterValue,
          filter.filter.operator as NumberFilterOperator,
        );
      case 'date':
        return this.matchesDateFilter(
          fieldValue,
          filterValue,
          filter.filter.operator as DateFilterOperator,
        );
      case 'select':
        return fieldValue === filterValue.value;
      case 'multi-select':
        return filterValue.values?.includes(fieldValue) || false;
      case 'boolean':
        return fieldValue === filterValue.value;
      default:
        return true;
    }
  }

  /**
   * Get field value from data object
   */
  private getFieldValue(data: any, columnId: string): any {
    // Try to get value by columnId first, then by common field names
    if (data[columnId] !== undefined) {
      return data[columnId];
    }

    // Common field mappings
    const fieldMap: Record<string, string> = {
      name: 'name',
      type: 'type',
      status: 'status',
      modified: 'modified',
      modifiedBy: 'modifiedBy',
      size: 'size',
    };

    const fieldName = fieldMap[columnId] || columnId;
    return data[fieldName];
  }

  /**
   * Match text filter
   */
  private matchesTextFilter(
    value: any,
    filter: DataGridFilterValue,
    operator?: TextFilterOperator,
  ): boolean {
    if (!filter.value) return true;

    const searchValue = String(filter.value).toLowerCase();
    const fieldValue = String(value || '').toLowerCase();

    switch (operator || 'contains') {
      case 'contains':
        return fieldValue.includes(searchValue);
      case 'equals':
        return fieldValue === searchValue;
      case 'startsWith':
        return fieldValue.startsWith(searchValue);
      case 'endsWith':
        return fieldValue.endsWith(searchValue);
      default:
        return fieldValue.includes(searchValue);
    }
  }

  /**
   * Match number filter
   */
  private matchesNumberFilter(
    value: any,
    filter: DataGridFilterValue,
    operator?: NumberFilterOperator,
  ): boolean {
    if (filter.value === null || filter.value === undefined) return true;

    const numValue = parseFloat(String(value || 0));
    const filterNum = parseFloat(String(filter.value));

    switch (operator || 'equals') {
      case 'equals':
        return numValue === filterNum;
      case 'notEquals':
        return numValue !== filterNum;
      case 'greaterThan':
        return numValue > filterNum;
      case 'lessThan':
        return numValue < filterNum;
      case 'greaterOrEqual':
        return numValue >= filterNum;
      case 'lessOrEqual':
        return numValue <= filterNum;
      case 'between':
        const valueTo = filter.valueTo ? parseFloat(String(filter.valueTo)) : filterNum;
        return numValue >= filterNum && numValue <= valueTo;
      default:
        return numValue === filterNum;
    }
  }

  /**
   * Match date filter
   */
  private matchesDateFilter(
    value: any,
    filter: DataGridFilterValue,
    operator?: DateFilterOperator,
  ): boolean {
    if (!filter.value) return true;

    const fieldDate = new Date(value);
    const filterDate = new Date(filter.value);

    if (isNaN(fieldDate.getTime()) || isNaN(filterDate.getTime())) {
      return false;
    }

    // Reset time to compare dates only
    fieldDate.setHours(0, 0, 0, 0);
    filterDate.setHours(0, 0, 0, 0);

    switch (operator || 'equals') {
      case 'equals':
        return fieldDate.getTime() === filterDate.getTime();
      case 'before':
        return fieldDate.getTime() < filterDate.getTime();
      case 'after':
        return fieldDate.getTime() > filterDate.getTime();
      case 'between':
        if (!filter.valueTo) return false;
        const valueToDate = new Date(filter.valueTo);
        valueToDate.setHours(0, 0, 0, 0);
        return (
          fieldDate.getTime() >= filterDate.getTime() &&
          fieldDate.getTime() <= valueToDate.getTime()
        );
      default:
        return fieldDate.getTime() === filterDate.getTime();
    }
  }

  /**
   * Apply sorting to data
   */
  private applySorting(
    data: DataGridRow<T>[],
    sortField: string,
    direction: 'asc' | 'desc',
  ): DataGridRow<T>[] {
    return [...data].sort((a, b) => {
      const aValue = this.getFieldValue(a.data, sortField);
      const bValue = this.getFieldValue(b.data, sortField);

      // Handle null/undefined
      if (aValue === null || aValue === undefined) return direction === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return direction === 'asc' ? 1 : -1;

      // Compare values
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  }
}
