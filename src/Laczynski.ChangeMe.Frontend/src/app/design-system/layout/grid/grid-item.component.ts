// =============================================================================
// Grid Item Component
// =============================================================================
// Helper component for grid items with advanced positioning and configuration
// Can be used within the Grid component for more granular control

import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  GridItemConfig,
  GridItemAlignment,
  GridItemJustification,
  createGridItemConfig,
  getGridItemClasses,
  generateGridArea,
} from './grid.model';

/**
 * Grid Item Component
 *
 * A helper component for individual grid items that provides:
 * - Column and row spanning
 * - Precise positioning with start/end coordinates
 * - Individual alignment and justification
 * - Grid area naming for template layouts
 * - Item-specific ordering
 *
 * @example
 * ```html
 * <ds-grid [columns]="12" gap="md">
 *   <ds-grid-item [columnSpan]="6" [rowSpan]="2">
 *     Large item content
 *   </ds-grid-item>
 *   <ds-grid-item [columnStart]="7" [columnEnd]="13">
 *     Positioned item content
 *   </ds-grid-item>
 * </ds-grid>
 * ```
 */
@Component({
  selector: 'ds-grid-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="containerClasses()"
      [style]="containerStyles()"
      [attr.role]="role() || 'gridcell'"
      [attr.aria-label]="ariaLabel()"
    >
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridItemComponent {
  // =============================================================================
  // INPUTS
  // =============================================================================

  // Spanning
  columnSpan = input<number | null>(null);
  rowSpan = input<number | null>(null);

  // Positioning
  columnStart = input<number | null>(null);
  columnEnd = input<number | null>(null);
  rowStart = input<number | null>(null);
  rowEnd = input<number | null>(null);

  // Grid areas
  area = input<string | null>(null);

  // Alignment
  alignSelf = input<GridItemAlignment | null>(null);
  justifySelf = input<GridItemJustification | null>(null);

  // Order
  order = input<number | null>(null);

  // Accessibility
  role = input<string | null>(null);
  ariaLabel = input<string | null>(null);

  // =============================================================================
  // COMPUTED PROPERTIES
  // =============================================================================

  readonly config = computed(() =>
    createGridItemConfig({
      columnSpan: this.columnSpan() || undefined,
      rowSpan: this.rowSpan() || undefined,
      columnStart: this.columnStart() || undefined,
      columnEnd: this.columnEnd() || undefined,
      rowStart: this.rowStart() || undefined,
      rowEnd: this.rowEnd() || undefined,
      area: this.area() || undefined,
      alignSelf: this.alignSelf() || undefined,
      justifySelf: this.justifySelf() || undefined,
      order: this.order() || undefined,
    }),
  );

  readonly containerClasses = computed(() => getGridItemClasses(this.config()).join(' '));

  readonly containerStyles = computed(() => {
    const config = this.config();
    const styles: Record<string, string> = {};

    // Grid area (takes precedence over other positioning)
    if (config.area) {
      styles['grid-area'] = config.area;
    } else {
      // Manual positioning
      if (config.columnStart && config.columnEnd) {
        styles['grid-column'] = `${config.columnStart} / ${config.columnEnd}`;
      } else if (config.columnSpan) {
        styles['grid-column'] = `span ${config.columnSpan}`;
      }

      if (config.rowStart && config.rowEnd) {
        styles['grid-row'] = `${config.rowStart} / ${config.rowEnd}`;
      } else if (config.rowSpan) {
        styles['grid-row'] = `span ${config.rowSpan}`;
      }

      // Generate grid area from coordinates
      if (config.columnStart && config.rowStart && config.columnEnd && config.rowEnd) {
        styles['grid-area'] = generateGridArea(
          config.rowStart,
          config.columnStart,
          config.rowEnd,
          config.columnEnd,
        );
      }
    }

    // Alignment
    if (config.alignSelf) styles['align-self'] = config.alignSelf;
    if (config.justifySelf) styles['justify-self'] = config.justifySelf;

    // Order
    if (config.order !== undefined) styles['order'] = config.order.toString();

    // Convert to CSS string
    return Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  });
}
