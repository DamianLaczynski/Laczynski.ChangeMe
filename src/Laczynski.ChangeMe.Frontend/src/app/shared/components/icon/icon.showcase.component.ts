import { Component, computed, signal, effect, ElementRef, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from './icon.component';
import { SearchComponent } from '../field/search/search.component';
import { DropdownComponent, DropdownItem } from '../field/dropdown/dropdown.component';
import { Size } from '../utils';
import { ALL_ICON_NAMES } from './icon-names.const';
import { IconName } from './icon-name.type';
import { ToastService } from '../toast/services/toast.service';
import { ToastContainerComponent } from '../toast/toast-container.component';

@Component({
  selector: 'app-icon-showcase',
  imports: [
    CommonModule,
    IconComponent,
    SearchComponent,
    DropdownComponent,
    FormsModule,
    ToastContainerComponent,
  ],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Icon Component - Fluent 2 Design System</h1>
      <p class="showcase__description">
        Browse and search through all available icons. Use the controls below to change size and
        style.
      </p>

      <!-- Controls -->
      <div class="showcase__icon-showcase__controls">
        <div class="showcase__icon-showcase__search">
          <app-search
            placeholder="Search icons..."
            [(ngModel)]="searchQueryValue"
            [ngModelOptions]="{ standalone: true }"
          />
        </div>
        <div class="showcase__icon-showcase__dropdowns">
          <div class="showcase__icon-showcase__dropdown">
            <label class="showcase__icon-showcase__label">Size:</label>
            <app-dropdown
              [items]="sizeOptions"
              [(ngModel)]="selectedSizeValue"
              [ngModelOptions]="{ standalone: true }"
            />
          </div>
          <div class="showcase__icon-showcase__dropdown">
            <label class="showcase__icon-showcase__label">Style:</label>
            <app-dropdown
              [items]="variantOptions"
              [(ngModel)]="selectedVariantValue"
              [ngModelOptions]="{ standalone: true }"
            />
          </div>
        </div>
      </div>

      <!-- Results count -->
      <div class="showcase__icon-showcase__results">
        <p>
          Showing <strong>{{ displayedIcons().length }}</strong> of
          <strong>{{ filteredIcons().length }}</strong> icons
          @if (filteredIcons().length < ALL_ICON_NAMES.length) {
            <span>(filtered from {{ ALL_ICON_NAMES.length }})</span>
          }
        </p>
      </div>

      <!-- Icons grid with infinity scroll -->
      @if (filteredIcons().length > 0) {
        <div class="showcase__icon-showcase__grid" #scrollContainer (scroll)="onScroll()">
          @for (iconName of displayedIcons(); track iconName) {
            <div
              class="showcase__icon-showcase__item"
              [title]="iconName"
              (click)="copyIconName(iconName)"
            >
              <div class="showcase__icon-showcase__icon-wrapper">
                <app-icon
                  [icon]="iconName"
                  [size]="selectedSizeValue || 'medium'"
                  [variant]="selectedVariantValue || 'regular'"
                />
              </div>
              <div class="showcase__icon-showcase__name">{{ iconName }}</div>
            </div>
          }
        </div>

        @if (isLoadingMore()) {
          <div class="showcase__icon-showcase__loading">
            <p>Loading more icons...</p>
          </div>
        }

        @if (hasMoreIcons() === false && displayedIcons().length > 0) {
          <div class="showcase__icon-showcase__end">
            <p>All icons loaded</p>
          </div>
        }
      } @else {
        <div class="showcase__icon-showcase__empty">
          <p>No icons found matching "{{ searchQueryValue }}"</p>
        </div>
      }

      <!-- Toast Container -->
      <app-toast-container position="top-right"></app-toast-container>
    </div>
  `,
})
export class IconShowcaseComponent {
  readonly ALL_ICON_NAMES = ALL_ICON_NAMES;
  private toastService = inject(ToastService);

  // Values for ngModel binding
  private _searchQueryValue = signal<string>('');
  get searchQueryValue(): string {
    return this._searchQueryValue();
  }
  set searchQueryValue(value: string) {
    this._searchQueryValue.set(value);
  }

  selectedSizeValue: Size = 'medium';
  selectedVariantValue: 'regular' | 'filled' = 'regular';

  // Infinity scroll configuration
  readonly batchSize = 50; // Number of icons to load per batch
  displayedCount = signal<number>(50); // Number of icons currently displayed
  isLoadingMore = signal<boolean>(false);

  scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  sizeOptions: DropdownItem[] = [
    { value: 'small', label: 'Small (16px)' },
    { value: 'medium', label: 'Medium (20px)' },
    { value: 'large', label: 'Large (24px)' },
  ];

  variantOptions: DropdownItem[] = [
    { value: 'regular', label: 'Regular' },
    { value: 'filled', label: 'Filled' },
  ];

  // Filtered icons based on search query
  filteredIcons = computed<IconName[]>(() => {
    const query = this._searchQueryValue().toLowerCase().trim();
    if (!query) {
      return this.ALL_ICON_NAMES as IconName[];
    }
    return this.ALL_ICON_NAMES.filter(iconName =>
      iconName.toLowerCase().includes(query),
    ) as IconName[];
  });

  // Displayed icons (lazy loaded)
  displayedIcons = computed<IconName[]>(() => {
    const icons = this.filteredIcons();
    const count = this.displayedCount();
    return icons.slice(0, count);
  });

  // Check if there are more icons to load
  hasMoreIcons = computed<boolean>(() => {
    return this.displayedCount() < this.filteredIcons().length;
  });

  private previousFilteredLength = 0;

  constructor() {
    // Reset displayed count when filtered icons change
    effect(() => {
      const filteredLength = this.filteredIcons().length;
      // Reset when filter results change (length changed or search query changed)
      if (this.previousFilteredLength !== filteredLength) {
        this.displayedCount.set(Math.min(this.batchSize, filteredLength));
        this.previousFilteredLength = filteredLength;

        // Scroll to top when filter changes
        setTimeout(() => {
          const container = this.scrollContainer()?.nativeElement;
          if (container) {
            container.scrollTop = 0;
          }
        }, 0);
      }
    });
  }

  onScroll(): void {
    const container = this.scrollContainer()?.nativeElement;
    if (!container || this.isLoadingMore() || !this.hasMoreIcons()) {
      return;
    }

    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    // Load more when user scrolls to 80% of the content
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
    if (scrollPercentage > 0.8) {
      this.loadMoreIcons();
    }
  }

  private loadMoreIcons(): void {
    if (this.isLoadingMore() || !this.hasMoreIcons()) {
      return;
    }

    this.isLoadingMore.set(true);

    // Simulate slight delay for smooth loading
    setTimeout(() => {
      const currentCount = this.displayedCount();
      const newCount = Math.min(currentCount + this.batchSize, this.filteredIcons().length);
      this.displayedCount.set(newCount);
      this.isLoadingMore.set(false);
    }, 100);
  }

  copyIconName(iconName: IconName): void {
    navigator.clipboard
      .writeText(iconName)
      .then(() => {
        this.toastService.success('Copied!', `Icon name "${iconName}" copied to clipboard`, {
          duration: 3000,
        });
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = iconName;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          this.toastService.success('Copied!', `Icon name "${iconName}" copied to clipboard`, {
            duration: 3000,
          });
        } catch (err) {
          this.toastService.error('Failed to copy', 'Unable to copy icon name to clipboard');
        } finally {
          document.body.removeChild(textArea);
        }
      });
  }
}
