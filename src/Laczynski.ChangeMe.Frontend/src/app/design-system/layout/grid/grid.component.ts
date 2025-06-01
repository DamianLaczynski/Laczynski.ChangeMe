// =============================================================================
// Grid Component
// =============================================================================
// Flexible grid layout component for the design system
// Supports responsive design, CSS Grid features, and auto-layout

import {
  Component,
  input,
  output,
  computed,
  signal,
  ElementRef,
  viewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectionStrategy,
  Renderer2,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  GridConfig,
  GridColumns,
  GridGap,
  GridHorizontalAlignment,
  GridVerticalAlignment,
  GridWidth,
  GridHeight,
  GridBreakpoint,
  GridLayoutChangeEvent,
  createGridConfig,
  getGridClasses,
  generateGridTemplateColumns,
  getCurrentBreakpoint,
  mergeResponsiveConfig,
  GRID_GAP_CONFIG,
  GRID_BREAKPOINTS,
} from './grid.model';

/**
 * Grid Component
 *
 * A flexible grid layout system that supports:
 * - Responsive breakpoints and adaptive layouts
 * - CSS Grid features (auto-fit, auto-fill, template areas)
 * - Flexible column configurations and gap management
 * - Comprehensive alignment and sizing options
 * - Auto-layout and dense packing features
 *
 * @example
 * ```html
 * <ds-grid
 *   [columns]="4"
 *   gap="md"
 *   [responsive]="{ sm: { columns: 2 }, md: { columns: 3 }, lg: { columns: 4 } }"
 *   (layoutChange)="onLayoutChange($event)"
 * >
 *   <div>Grid item 1</div>
 *   <div>Grid item 2</div>
 *   <div>Grid item 3</div>
 * </ds-grid>
 * ```
 */
@Component({
  selector: 'ds-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #gridContainer
      [class]="containerClasses()"
      [style]="containerStyles()"
      role="grid"
      [attr.aria-label]="ariaLabel() || 'Grid layout'"
    >
      <ng-content />
    </div>
  `,
  styleUrl: './grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly renderer = inject(Renderer2);
  private readonly elementRef = inject(ElementRef);

  // =============================================================================
  // INPUTS
  // =============================================================================

  // Layout configuration
  columns = input<GridColumns>(12);
  gap = input<GridGap>('md');

  // Alignment
  horizontalAlign = input<GridHorizontalAlignment>('start');
  verticalAlign = input<GridVerticalAlignment>('start');

  // Sizing
  width = input<GridWidth>('full');
  height = input<GridHeight>('auto');
  minWidth = input<string | null>(null);
  maxWidth = input<string | null>(null);
  minHeight = input<string | null>(null);
  maxHeight = input<string | null>(null);

  // Auto layout
  autoFit = input<boolean>(false);
  autoFill = input<boolean>(false);
  minColumnWidth = input<string>('250px');
  maxColumnWidth = input<string>('1fr');

  // Advanced features
  dense = input<boolean>(false);
  templateAreas = input<string[] | null>(null);

  // Responsive
  responsive = input<Record<string, Partial<GridConfig>>>({});

  // Accessibility
  ariaLabel = input<string | null>(null);

  // =============================================================================
  // OUTPUTS
  // =============================================================================

  layoutChange = output<GridLayoutChangeEvent>();

  // =============================================================================
  // VIEW CHILDREN
  // =============================================================================

  gridContainer = viewChild<ElementRef<HTMLDivElement>>('gridContainer');

  // =============================================================================
  // INTERNAL STATE
  // =============================================================================

  private readonly currentBreakpoint = signal<GridBreakpoint>('md');
  private readonly containerDimensions = signal({ width: 0, height: 0 });
  private resizeObserver?: ResizeObserver;

  // =============================================================================
  // COMPUTED PROPERTIES
  // =============================================================================

  readonly config = computed(() => {
    const baseConfig = createGridConfig({
      columns: this.columns(),
      gap: this.gap(),
      alignment: {
        horizontal: this.horizontalAlign(),
        vertical: this.verticalAlign(),
        content: 'start',
        items: 'stretch',
      },
      sizing: {
        width: this.width(),
        height: this.height(),
        minWidth: this.minWidth() || undefined,
        maxWidth: this.maxWidth() || undefined,
        minHeight: this.minHeight() || undefined,
        maxHeight: this.maxHeight() || undefined,
      },
      autoFit: this.autoFit(),
      autoFill: this.autoFill(),
      minColumnWidth: this.minColumnWidth(),
      maxColumnWidth: this.maxColumnWidth(),
      dense: this.dense(),
      templateAreas: this.templateAreas() || undefined,
      responsive: this.responsive(),
    });

    // Merge responsive configuration
    return mergeResponsiveConfig(baseConfig, this.currentBreakpoint());
  });

  readonly containerClasses = computed(() => getGridClasses(this.config()).join(' '));

  readonly containerStyles = computed(() => {
    const config = this.config();
    const styles: Record<string, string> = {};

    // Grid template columns
    styles['grid-template-columns'] = generateGridTemplateColumns(
      config.columns,
      config.minColumnWidth,
      config.maxColumnWidth,
    );

    // Gap
    if (typeof config.gap === 'string' && config.gap in GRID_GAP_CONFIG) {
      styles['gap'] = GRID_GAP_CONFIG[config.gap as keyof typeof GRID_GAP_CONFIG];
    } else if (typeof config.gap === 'object') {
      styles['column-gap'] = config.gap.x;
      styles['row-gap'] = config.gap.y;
    } else if (typeof config.gap === 'string') {
      styles['gap'] = config.gap;
    }

    // Alignment
    styles['justify-content'] = config.alignment.content;
    styles['align-content'] = config.alignment.vertical;
    styles['justify-items'] = config.alignment.horizontal;
    styles['align-items'] = config.alignment.items;

    // Sizing
    if (config.sizing.width && config.sizing.width !== 'auto') {
      styles['width'] = this.getSizeValue(config.sizing.width);
    }
    if (config.sizing.height && config.sizing.height !== 'auto') {
      styles['height'] = this.getSizeValue(config.sizing.height);
    }
    if (config.sizing.minWidth) styles['min-width'] = config.sizing.minWidth;
    if (config.sizing.maxWidth) styles['max-width'] = config.sizing.maxWidth;
    if (config.sizing.minHeight) styles['min-height'] = config.sizing.minHeight;
    if (config.sizing.maxHeight) styles['max-height'] = config.sizing.maxHeight;

    // Grid features
    if (config.dense) {
      styles['grid-auto-flow'] = 'dense';
    }

    // Template areas
    if (config.templateAreas && config.templateAreas.length > 0) {
      styles['grid-template-areas'] = config.templateAreas.map(area => `"${area}"`).join(' ');
    }

    // Convert to CSS string
    return Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  });

  readonly effectiveColumns = computed(() => {
    const config = this.config();
    if (typeof config.columns === 'number') {
      return config.columns;
    }
    // For auto layouts, estimate based on container width
    const containerWidth = this.containerDimensions().width;
    if (containerWidth > 0) {
      const minWidth = parseInt(config.minColumnWidth.replace('px', ''));
      const gap = this.getGapValue(config.gap);
      return Math.floor(containerWidth / (minWidth + gap));
    }
    return 12; // Default fallback
  });

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  ngOnInit(): void {
    this.updateBreakpoint();
    this.setupResizeObserver();
  }

  ngAfterViewInit(): void {
    this.updateContainerDimensions();
    this.emitLayoutChange();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          this.updateContainerDimensions();
          this.updateBreakpoint();
          this.emitLayoutChange();
        }
      });

      if (this.gridContainer()) {
        this.resizeObserver.observe(this.gridContainer()!.nativeElement);
      }
    } else {
      // Fallback for older browsers
      window.addEventListener('resize', () => {
        this.updateBreakpoint();
        this.emitLayoutChange();
      });
    }
  }

  private updateBreakpoint(): void {
    const width = window.innerWidth;
    const newBreakpoint = getCurrentBreakpoint(width);
    if (newBreakpoint !== this.currentBreakpoint()) {
      this.currentBreakpoint.set(newBreakpoint);
    }
  }

  private updateContainerDimensions(): void {
    const container = this.gridContainer()?.nativeElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      this.containerDimensions.set({
        width: rect.width,
        height: rect.height,
      });
    }
  }

  private emitLayoutChange(): void {
    this.layoutChange.emit({
      breakpoint: this.currentBreakpoint(),
      columns: this.effectiveColumns(),
      dimensions: this.containerDimensions(),
    });
  }

  private getSizeValue(size: GridWidth | GridHeight): string {
    switch (size) {
      case 'auto':
        return 'auto';
      case 'full':
        return '100%';
      case 'fit':
        return 'fit-content';
      case 'screen':
        return '100vw';
      default:
        return size;
    }
  }

  private getGapValue(gap: GridGap): number {
    if (typeof gap === 'string' && gap in GRID_GAP_CONFIG) {
      // Extract numeric value from CSS variable
      const gapValue = GRID_GAP_CONFIG[gap as keyof typeof GRID_GAP_CONFIG];
      if (gapValue.includes('var(')) {
        // Default values for CSS variables
        const gapMap: Record<string, number> = {
          'var(--spacing-xs)': 4,
          'var(--spacing-sm)': 8,
          'var(--spacing-md)': 16,
          'var(--spacing-lg)': 24,
          'var(--spacing-xl)': 32,
          'var(--spacing-xxl)': 48,
        };
        return gapMap[gapValue] || 16;
      }
      return parseInt(gapValue);
    }
    if (typeof gap === 'string') {
      return parseInt(gap);
    }
    if (typeof gap === 'object') {
      return parseInt(gap.x);
    }
    return 16; // Default
  }
}
