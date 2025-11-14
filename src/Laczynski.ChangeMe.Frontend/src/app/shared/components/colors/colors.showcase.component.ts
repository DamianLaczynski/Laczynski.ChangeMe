import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableOfContentComponent } from '@shared/components/table-of-content';

interface ColorItem {
  name: string;
  variable: string;
  value: string;
  description?: string;
}

interface ColorGroup {
  name: string;
  colors: ColorItem[];
}

interface SharedColor {
  name: string;
  variants: {
    label: string;
    variable: string;
    value: string;
  }[];
}

@Component({
  selector: 'app-colors-showcase',
  imports: [CommonModule, TableOfContentComponent],
  template: `
    <div class="showcase showcase--responsive showcase__with-toc">
      <app-table-of-content
        [sticky]="true"
        [offsetTop]="20"
        containerSelector=".showcase-content"
        [minLevel]="1"
        [maxLevel]="2"
      />
      <div class="showcase-content">
        <h1 class="showcase__title">Color System - Fluent 2 Design System</h1>
      <p class="showcase__description">
        Complete color palette used throughout the application. All colors are defined as CSS custom
        properties and support both light and dark themes.
      </p>

      <!-- Brand Colors -->
      <div class="showcase__color-system__category">
        <h2 class="showcase__color-system__category__title">Brand Colors</h2>
        <p class="showcase__color-system__category__description">
          Primary brand colors used for interactive elements, links, and brand identity.
        </p>

        <div class="showcase__color-system__color-group">
          <h3 class="showcase__color-system__color-group__name">Primary</h3>
          <div class="showcase__color-system__color-group__grid">
            @for (color of brandColors(); track color.variable) {
              <div class="showcase__color-system__color-item">
                <div
                  class="showcase__color-system__color-item__swatch"
                  [style.background-color]="color.value"
                  [style.color]="getContrastColor(color.value)"
                >
                  @if (needsBorder(color.value)) {
                    <div
                      style="position: absolute; inset: 0; border: 2px dashed var(--color-neutral-stroke-rest);"
                    ></div>
                  }
                </div>
                <div class="showcase__color-system__color-item__info">
                  <div class="showcase__color-system__color-item__name">{{ color.name }}</div>
                  <div class="showcase__color-system__color-item__value">{{ color.value }}</div>
                  <div class="showcase__color-system__color-item__variable">
                    {{ color.variable }}
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Neutral Colors - Foreground -->
      <div class="showcase__color-system__category">
        <h2 class="showcase__color-system__category__title">Neutral Colors - Foreground</h2>
        <p class="showcase__color-system__category__description">
          Text and foreground colors for content hierarchy and readability.
        </p>

        <div class="showcase__color-system__color-group">
          <h3 class="showcase__color-system__color-group__name">Foreground</h3>
          <div class="showcase__color-system__color-group__grid">
            @for (color of neutralForegroundColors(); track color.variable) {
              <div class="showcase__color-system__color-item">
                <div
                  class="showcase__color-system__color-item__swatch"
                  [style.background-color]="color.value"
                  [style.color]="getContrastColor(color.value)"
                >
                  @if (needsBorder(color.value)) {
                    <div
                      style="position: absolute; inset: 0; border: 2px dashed var(--color-neutral-stroke-rest);"
                    ></div>
                  }
                </div>
                <div class="showcase__color-system__color-item__info">
                  <div class="showcase__color-system__color-item__name">{{ color.name }}</div>
                  <div class="showcase__color-system__color-item__value">{{ color.value }}</div>
                  <div class="showcase__color-system__color-item__variable">
                    {{ color.variable }}
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Neutral Colors - Background -->
      <div class="showcase__color-system__category">
        <h2 class="showcase__color-system__category__title">Neutral Colors - Background</h2>
        <p class="showcase__color-system__category__description">
          Background colors for surfaces, containers, and UI elements.
        </p>

        <div class="showcase__color-system__color-group">
          <h3 class="showcase__color-system__color-group__name">Background</h3>
          <div class="showcase__color-system__color-group__grid">
            @for (color of neutralBackgroundColors(); track color.variable) {
              <div class="showcase__color-system__color-item">
                <div
                  class="showcase__color-system__color-item__swatch"
                  [style.background-color]="color.value"
                  [style.color]="getContrastColor(color.value)"
                >
                  @if (needsBorder(color.value)) {
                    <div
                      style="position: absolute; inset: 0; border: 2px dashed var(--color-neutral-stroke-rest);"
                    ></div>
                  }
                </div>
                <div class="showcase__color-system__color-item__info">
                  <div class="showcase__color-system__color-item__name">{{ color.name }}</div>
                  <div class="showcase__color-system__color-item__value">{{ color.value }}</div>
                  <div class="showcase__color-system__color-item__variable">
                    {{ color.variable }}
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Stroke Colors -->
      <div class="showcase__color-system__category">
        <h2 class="showcase__color-system__category__title">Stroke Colors</h2>
        <p class="showcase__color-system__category__description">
          Border and stroke colors for dividers, borders, and outlines.
        </p>

        <div class="showcase__color-system__color-group">
          <h3 class="showcase__color-system__color-group__name">Stroke</h3>
          <div class="showcase__color-system__color-group__grid">
            @for (color of strokeColors(); track color.variable) {
              <div class="showcase__color-system__color-item">
                <div
                  class="showcase__color-system__color-item__swatch"
                  [style.background-color]="color.value"
                  [style.color]="getContrastColor(color.value)"
                >
                  @if (needsBorder(color.value)) {
                    <div
                      style="position: absolute; inset: 0; border: 2px dashed var(--color-neutral-stroke-rest);"
                    ></div>
                  }
                </div>
                <div class="showcase__color-system__color-item__info">
                  <div class="showcase__color-system__color-item__name">{{ color.name }}</div>
                  <div class="showcase__color-system__color-item__value">{{ color.value }}</div>
                  <div class="showcase__color-system__color-item__variable">
                    {{ color.variable }}
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Shared Colors -->
      <div class="showcase__color-system__category">
        <h2 class="showcase__color-system__category__title">Shared Colors</h2>
        <p class="showcase__color-system__category__description">
          Semantic colors for states, alerts, and status indicators. Each color includes foreground,
          background, and border variants.
        </p>

        <div class="showcase__color-system__shared-colors">
          <div class="showcase__color-system__color-group__grid">
            @for (color of sharedColors(); track color.name) {
              <div class="showcase__color-system__color-item">
                <div
                  class="showcase__color-system__color-item__swatch"
                  [style.background-color]="color.variants[0].value"
                  [style.color]="getContrastColor(color.variants[0].value)"
                >
                  @if (needsBorder(color.variants[0].value)) {
                    <div
                      style="position: absolute; inset: 0; border: 2px dashed var(--color-neutral-stroke-rest);"
                    ></div>
                  }
                </div>
                <div class="showcase__color-system__color-item__info">
                  <div class="showcase__color-system__color-item__name">{{ color.name }}</div>
                </div>
                <div class="showcase__color-system__shared-colors__variants">
                  @for (variant of color.variants; track variant.variable) {
                    <div class="showcase__color-system__shared-colors__variant">
                      <div
                        class="showcase__color-system__shared-colors__variant__swatch"
                        [style.background-color]="variant.value"
                        [style.border-color]="variant.value"
                      ></div>
                      <div class="showcase__color-system__shared-colors__variant__label">
                        {{ variant.label }}
                      </div>
                      <div class="showcase__color-system__shared-colors__variant__value">
                        {{ variant.value }}
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      </div>
    </div>
  `,
})
export class ColorsShowcaseComponent implements OnInit {
  private getCssVariable(variable: string, fallback: string): string {
    if (typeof document === 'undefined') {
      return fallback;
    }
    const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    return value || fallback;
  }

  // Brand Colors
  brandColors = signal<ColorItem[]>([]);

  // Neutral Foreground Colors
  neutralForegroundColors = signal<ColorItem[]>([]);

  // Neutral Background Colors
  neutralBackgroundColors = signal<ColorItem[]>([]);

  // Stroke Colors
  strokeColors = signal<ColorItem[]>([]);

  // Shared Colors
  sharedColors = signal<SharedColor[]>([]);

  ngOnInit(): void {
    this.loadColors();
  }

  private loadColors(): void {
    // Brand Colors
    this.brandColors.set([
      {
        name: 'Primary',
        variable: '--color-brand-primary',
        value: this.getCssVariable('--color-brand-primary', '#0078D4'),
      },
      {
        name: 'Primary Hover',
        variable: '--color-brand-primary-hover',
        value: this.getCssVariable('--color-brand-primary-hover', '#106EBE'),
      },
      {
        name: 'Primary Pressed',
        variable: '--color-brand-primary-pressed',
        value: this.getCssVariable('--color-brand-primary-pressed', '#005A9E'),
      },
      {
        name: 'Primary Selected',
        variable: '--color-brand-primary-selected',
        value: this.getCssVariable('--color-brand-primary-selected', '#106EBE'),
      },
    ]);

    // Neutral Foreground Colors
    this.neutralForegroundColors.set([
      {
        name: 'Foreground Rest',
        variable: '--color-neutral-foreground-rest',
        value: this.getCssVariable('--color-neutral-foreground-rest', '#242424'),
      },
      {
        name: 'Foreground Hover',
        variable: '--color-neutral-foreground-hover',
        value: this.getCssVariable('--color-neutral-foreground-hover', '#242424'),
      },
      {
        name: 'Foreground Pressed',
        variable: '--color-neutral-foreground-pressed',
        value: this.getCssVariable('--color-neutral-foreground-pressed', '#242424'),
      },
      {
        name: 'Foreground Disabled',
        variable: '--color-neutral-foreground-disabled',
        value: this.getCssVariable('--color-neutral-foreground-disabled', '#BDBDBD'),
      },
      {
        name: 'Foreground On Brand',
        variable: '--color-neutral-foreground-on-brand',
        value: this.getCssVariable('--color-neutral-foreground-on-brand', '#FFFFFF'),
      },
      {
        name: 'Foreground Selected',
        variable: '--color-neutral-foreground-selected',
        value: this.getCssVariable('--color-neutral-foreground-selected', '#242424'),
      },
      {
        name: 'Foreground 2 Rest',
        variable: '--color-neutral-foreground2-rest',
        value: this.getCssVariable('--color-neutral-foreground2-rest', '#424242'),
      },
      {
        name: 'Foreground 2 Hover',
        variable: '--color-neutral-foreground2-hover',
        value: this.getCssVariable('--color-neutral-foreground2-hover', '#0078D4'),
      },
    ]);

    // Neutral Background Colors
    this.neutralBackgroundColors.set([
      {
        name: 'Background Rest',
        variable: '--color-neutral-background-rest',
        value: this.getCssVariable('--color-neutral-background-rest', '#FFFFFF'),
      },
      {
        name: 'Background Selected',
        variable: '--color-neutral-background-selected',
        value: this.getCssVariable('--color-neutral-background-selected', '#F3F2F1'),
      },
      {
        name: 'Background Hover',
        variable: '--color-neutral-background-hover',
        value: this.getCssVariable('--color-neutral-background-hover', '#F3F2F1'),
      },
      {
        name: 'Background Pressed',
        variable: '--color-neutral-background-pressed',
        value: this.getCssVariable('--color-neutral-background-pressed', '#EDEBE9'),
      },
      {
        name: 'Background Disabled',
        variable: '--color-neutral-background-disabled',
        value: this.getCssVariable('--color-neutral-background-disabled', '#F3F2F1'),
      },
      {
        name: 'Background Brand Selected',
        variable: '--color-neutral-background-brand-selected',
        value: this.getCssVariable('--color-neutral-background-brand-selected', '#D0E7FF'),
      },
      {
        name: 'Background Brand Hover',
        variable: '--color-neutral-background-brand-hover',
        value: this.getCssVariable('--color-neutral-background-brand-hover', '#E1F0FF'),
      },
      {
        name: 'Background Brand Pressed',
        variable: '--color-neutral-background-brand-pressed',
        value: this.getCssVariable('--color-neutral-background-brand-pressed', '#C7E0FF'),
      },
    ]);

    // Stroke Colors
    this.strokeColors.set([
      {
        name: 'Stroke Rest',
        variable: '--color-neutral-stroke-rest',
        value: this.getCssVariable('--color-neutral-stroke-rest', '#D1D1D1'),
      },
      {
        name: 'Stroke Hover',
        variable: '--color-neutral-stroke-hover',
        value: this.getCssVariable('--color-neutral-stroke-hover', '#C7C7C7'),
      },
      {
        name: 'Stroke Pressed',
        variable: '--color-neutral-stroke-pressed',
        value: this.getCssVariable('--color-neutral-stroke-pressed', '#B3B3B3'),
      },
      {
        name: 'Stroke Selected',
        variable: '--color-neutral-stroke-selected',
        value: this.getCssVariable('--color-neutral-stroke-selected', '#0078D4'),
      },
      {
        name: 'Stroke Disabled',
        variable: '--color-neutral-stroke-disabled',
        value: this.getCssVariable('--color-neutral-stroke-disabled', '#E0E0E0'),
      },
      {
        name: 'Stroke Brand Rest',
        variable: '--color-neutral-stroke-brand-rest',
        value: this.getCssVariable('--color-neutral-stroke-brand-rest', '#0078D4'),
      },
      {
        name: 'Stroke Brand Hover',
        variable: '--color-neutral-stroke-brand-hover',
        value: this.getCssVariable('--color-neutral-stroke-brand-hover', '#106EBE'),
      },
      {
        name: 'Stroke Brand Pressed',
        variable: '--color-neutral-stroke-brand-pressed',
        value: this.getCssVariable('--color-neutral-stroke-brand-pressed', '#005A9E'),
      },
    ]);

    // Shared Colors
    this.sharedColors.set([
      {
        name: 'Red',
        variants: [
          {
            label: 'Foreground',
            variable: '--color-shared-red-foreground',
            value: this.getCssVariable('--color-shared-red-foreground', '#D13438'),
          },
          {
            label: 'Background',
            variable: '--color-shared-red-background',
            value: this.getCssVariable('--color-shared-red-background', '#F8DADB'),
          },
          {
            label: 'Border',
            variable: '--color-shared-red-border',
            value: this.getCssVariable('--color-shared-red-border', '#F1BBBC'),
          },
        ],
      },
      {
        name: 'Orange',
        variants: [
          {
            label: 'Foreground',
            variable: '--color-shared-orange-foreground',
            value: this.getCssVariable('--color-shared-orange-foreground', '#CA5010'),
          },
          {
            label: 'Background',
            variable: '--color-shared-orange-background',
            value: this.getCssVariable('--color-shared-orange-background', '#FDF6F3'),
          },
          {
            label: 'Border',
            variable: '--color-shared-orange-border',
            value: this.getCssVariable('--color-shared-orange-border', '#F4C19B'),
          },
        ],
      },
      {
        name: 'Yellow',
        variants: [
          {
            label: 'Foreground',
            variable: '--color-shared-yellow-foreground',
            value: this.getCssVariable('--color-shared-yellow-foreground', '#FF8C00'),
          },
          {
            label: 'Background',
            variable: '--color-shared-yellow-background',
            value: this.getCssVariable('--color-shared-yellow-background', '#FFEDD6'),
          },
          {
            label: 'Border',
            variable: '--color-shared-yellow-border',
            value: this.getCssVariable('--color-shared-yellow-border', '#FFDDB3'),
          },
        ],
      },
      {
        name: 'Green',
        variants: [
          {
            label: 'Foreground',
            variable: '--color-shared-green-foreground',
            value: this.getCssVariable('--color-shared-green-foreground', '#107C10'),
          },
          {
            label: 'Background',
            variable: '--color-shared-green-background',
            value: this.getCssVariable('--color-shared-green-background', '#C9EAC9'),
          },
          {
            label: 'Border',
            variable: '--color-shared-green-border',
            value: this.getCssVariable('--color-shared-green-border', '#9FD89F'),
          },
        ],
      },
      {
        name: 'Cyan',
        variants: [
          {
            label: 'Foreground',
            variable: '--color-shared-cyan-foreground',
            value: this.getCssVariable('--color-shared-cyan-foreground', '#038387'),
          },
          {
            label: 'Background',
            variable: '--color-shared-cyan-background',
            value: this.getCssVariable('--color-shared-cyan-background', '#F0FDFD'),
          },
          {
            label: 'Border',
            variable: '--color-shared-cyan-border',
            value: this.getCssVariable('--color-shared-cyan-border', '#7BDBDA'),
          },
        ],
      },
      {
        name: 'Blue',
        variants: [
          {
            label: 'Foreground',
            variable: '--color-shared-blue-foreground',
            value: this.getCssVariable('--color-shared-blue-foreground', '#0078D4'),
          },
          {
            label: 'Background',
            variable: '--color-shared-blue-background',
            value: this.getCssVariable('--color-shared-blue-background', '#F0F8FF'),
          },
          {
            label: 'Border',
            variable: '--color-shared-blue-border',
            value: this.getCssVariable('--color-shared-blue-border', '#7BB3F0'),
          },
        ],
      },
      {
        name: 'Purple',
        variants: [
          {
            label: 'Foreground',
            variable: '--color-shared-purple-foreground',
            value: this.getCssVariable('--color-shared-purple-foreground', '#5C2E91'),
          },
          {
            label: 'Background',
            variable: '--color-shared-purple-background',
            value: this.getCssVariable('--color-shared-purple-background', '#E0D3ED'),
          },
          {
            label: 'Border',
            variable: '--color-shared-purple-border',
            value: this.getCssVariable('--color-shared-purple-border', '#F7F4FB'),
          },
        ],
      },
      {
        name: 'Pink',
        variants: [
          {
            label: 'Foreground',
            variable: '--color-shared-pink-foreground',
            value: this.getCssVariable('--color-shared-pink-foreground', '#E3008C'),
          },
          {
            label: 'Background',
            variable: '--color-shared-pink-background',
            value: this.getCssVariable('--color-shared-pink-background', '#FDF2F8'),
          },
          {
            label: 'Border',
            variable: '--color-shared-pink-border',
            value: this.getCssVariable('--color-shared-pink-border', '#F1A8D0'),
          },
        ],
      },
    ]);
  }

  getContrastColor(hexColor: string): string {
    if (!hexColor || !hexColor.startsWith('#')) {
      return '#000000';
    }

    // Remove # if present
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }

  needsBorder(color: string): boolean {
    if (!color || !color.startsWith('#')) {
      return false;
    }

    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Check if color is very light (close to white)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.9;
  }
}
