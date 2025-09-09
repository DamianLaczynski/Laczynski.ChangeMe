import {
  Component,
  input,
  output,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldComponent } from '../field/field.component';
import { ClearButtonComponent } from '../clear-button.component';

export interface SearchSuggestion {
  title: string;
  description?: string;
  category?: string;
  icon?: string;
  value: string;
  data?: any;
}

export interface SearchFilter {
  id: string;
  label: string;
  count?: number;
  active?: boolean;
  data?: any;
}

export interface SearchResults {
  items: any[];
  total: number;
  searchTime?: number;
  query: string;
}

@Component({
  selector: 'app-search',
  imports: [FieldComponent, CommonModule, ClearButtonComponent],
  templateUrl: './search.component.html',
})
export class SearchComponent
  extends FieldComponent
  implements OnInit, OnDestroy
{
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  // Search input properties
  showSearchIcon = input<boolean>(true);
  showSearchButton = input<boolean>(false);
  showSuggestions = input<boolean>(true);
  showFilters = input<boolean>(false);
  showResultsSummary = input<boolean>(true);
  showRecentSearches = input<boolean>(true);
  showSearchStatus = input<boolean>(true);
  customPlaceholder = input<string>('');
  debounceTime = input<number>(300);
  minSearchLength = input<number>(2);
  maxSuggestions = input<number>(10);
  maxRecentSearches = input<number>(5);

  // Search data
  suggestions = input<SearchSuggestion[]>([]);
  filters = input<SearchFilter[]>([]);
  searchResults = input<SearchResults | null>(null);

  // Search events
  search = output<string>();
  suggestionSelect = output<SearchSuggestion>();
  filterChange = output<SearchFilter[]>();

  // Search handling
  currentValue: string = '';
  isSearching: boolean = false;
  selectedSuggestionIndex: number = -1;
  recentSearches: string[] = [];
  private debounceTimer: any;

  override ngOnInit(): void {
    super.ngOnInit();
    this.currentValue = this.value || '';
    this.loadRecentSearches();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  getPlaceholder(): string {
    if (this.customPlaceholder()) {
      return this.customPlaceholder();
    }
    if (this.placeholder()) {
      return this.placeholder();
    }
    return 'Search...';
  }

  override onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.currentValue = target.value;

    // Debounce search
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.performSearch();
    }, this.debounceTime());

    this.value = this.currentValue;
    this.onChange(this.value);
    this.change.emit(this.value);
  }

  clearSearch(): void {
    this.currentValue = '';
    this.isSearching = false;
    this.selectedSuggestionIndex = -1;

    this.value = '';
    this.onChange(this.value);
    this.change.emit(this.value);

    // Update the input element
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
  }

  performSearch(): void {
    if (
      !this.currentValue.trim() ||
      this.currentValue.length < this.minSearchLength()
    ) {
      this.isSearching = false;
      return;
    }

    this.isSearching = true;
    this.search.emit(this.currentValue);

    // Add to recent searches
    this.addToRecentSearches(this.currentValue);
  }

  selectSuggestion(suggestion: SearchSuggestion): void {
    this.currentValue = suggestion.value;
    this.selectedSuggestionIndex = -1;

    this.value = this.currentValue;
    this.onChange(this.value);
    this.change.emit(this.value);
    this.suggestionSelect.emit(suggestion);

    // Update the input element
    if (this.searchInput) {
      this.searchInput.nativeElement.value = this.currentValue;
    }

    // Perform search with selected suggestion
    this.performSearch();
  }

  toggleFilter(filter: SearchFilter): void {
    const currentFilters = this.filters();
    const updatedFilters = currentFilters.map((f) =>
      f.id === filter.id ? { ...f, active: !f.active } : f
    );

    this.filterChange.emit(updatedFilters);
  }

  isFilterActive(filter: SearchFilter): boolean {
    return filter.active || false;
  }

  selectRecentSearch(recent: string): void {
    this.currentValue = recent;

    this.value = this.currentValue;
    this.onChange(this.value);
    this.change.emit(this.value);

    // Update the input element
    if (this.searchInput) {
      this.searchInput.nativeElement.value = this.currentValue;
    }

    // Perform search with recent search
    this.performSearch();
  }

  clearRecentSearches(): void {
    this.recentSearches = [];
    this.saveRecentSearches();
  }

  override writeValue(value: any): void {
    if (value !== null && value !== undefined) {
      this.currentValue = value.toString();
    } else {
      this.currentValue = '';
    }
    this.value = this.currentValue;
  }

  highlightMatch(text: string, query: string): string {
    if (!query || !text) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  getResultsCountText(): string {
    const results = this.searchResults();
    if (!results) return '';

    const { total } = results;
    if (total === 0) return 'No results found';
    if (total === 1) return '1 result found';
    return `${total} results found`;
  }

  hasResults(): boolean {
    const results = this.searchResults();
    return results ? results.total > 0 : false;
  }

  private addToRecentSearches(query: string): void {
    if (!query.trim()) return;

    // Remove if already exists
    this.recentSearches = this.recentSearches.filter((item) => item !== query);

    // Add to beginning
    this.recentSearches.unshift(query);

    // Limit to max recent searches
    if (this.recentSearches.length > this.maxRecentSearches()) {
      this.recentSearches = this.recentSearches.slice(
        0,
        this.maxRecentSearches()
      );
    }

    this.saveRecentSearches();
  }

  private loadRecentSearches(): void {
    try {
      const stored = localStorage.getItem('search-recent-searches');
      if (stored) {
        this.recentSearches = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load recent searches:', error);
      this.recentSearches = [];
    }
  }

  private saveRecentSearches(): void {
    try {
      localStorage.setItem(
        'search-recent-searches',
        JSON.stringify(this.recentSearches)
      );
    } catch (error) {
      console.warn('Failed to save recent searches:', error);
    }
  }

  // Keyboard navigation for suggestions
  override onKeyDown(event: KeyboardEvent): void {
    if (!this.showSuggestions() || this.suggestions().length === 0) {
      super.onKeyDown(event);
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.min(
          this.selectedSuggestionIndex + 1,
          this.suggestions().length - 1
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.max(
          this.selectedSuggestionIndex - 1,
          -1
        );
        break;
      case 'Enter':
        if (this.selectedSuggestionIndex >= 0) {
          event.preventDefault();
          this.selectSuggestion(
            this.suggestions()[this.selectedSuggestionIndex]
          );
        } else {
          this.performSearch();
        }
        break;
      case 'Escape':
        this.selectedSuggestionIndex = -1;
        break;
      default:
        super.onKeyDown(event);
    }
  }
}
