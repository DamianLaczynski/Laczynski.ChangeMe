import {
  Component,
  forwardRef,
  signal,
  computed,
  ElementRef,
  ViewChild,
  HostListener,
  effect,
  input,
  Renderer2,
  AfterViewInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FieldComponent } from '../field/field.component';
import { ActionButtonComponent } from '../action-button.component';
import { IconComponent } from '@shared/components/icon/icon.component';

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

interface ColorValue {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  alpha: number;
}

@Component({
  selector: 'app-color',

  imports: [CommonModule, FieldComponent, ActionButtonComponent, IconComponent],
  templateUrl: './color.component.html',
  host: {
    '[style.position]': '"relative"',
    '[style.display]': '"block"',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorComponent),
      multi: true,
    },
  ],
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
})
export class ColorComponent extends FieldComponent implements AfterViewInit, OnDestroy {
  private readonly renderer = inject(Renderer2);
  private resizeObserver?: ResizeObserver;
  private scrollListener?: () => void;

  format = input<ColorFormat>('hex');
  showAlpha = input<boolean>(true);
  showEyeDropper = input<boolean>(true);

  isExpanded = signal<boolean>(false);
  currentColor = signal<ColorValue>({
    hex: '#000000',
    rgb: { r: 0, g: 0, b: 0 },
    hsl: { h: 0, s: 0, l: 0 },
    alpha: 1,
  });

  // Saturation/Lightness picker position
  pickerX = signal<number>(0);
  pickerY = signal<number>(0);

  // Hue slider position
  hueValue = signal<number>(0);

  // Alpha slider position
  alphaValue = signal<number>(1);

  @ViewChild('colorPanel') colorPanel?: ElementRef;
  @ViewChild('saturationPicker') saturationPicker?: ElementRef;
  @ViewChild('triggerElement') triggerElement?: ElementRef;

  // Computed display value based on format
  displayValue = computed(() => {
    const color = this.currentColor();
    const format = this.format();
    const showAlpha = this.showAlpha();

    if (format === 'rgb') {
      const { r, g, b } = color.rgb;
      return showAlpha && color.alpha < 1
        ? `rgba(${r}, ${g}, ${b}, ${color.alpha.toFixed(2)})`
        : `rgb(${r}, ${g}, ${b})`;
    }

    if (format === 'hsl') {
      const { h, s, l } = color.hsl;
      return showAlpha && color.alpha < 1
        ? `hsla(${h}, ${s}%, ${l}%, ${color.alpha.toFixed(2)})`
        : `hsl(${h}, ${s}%, ${l}%)`;
    }

    // Default to hex
    return showAlpha && color.alpha < 1
      ? `${color.hex}${Math.round(color.alpha * 255)
          .toString(16)
          .padStart(2, '0')}`
      : color.hex;
  });

  constructor(private elementRef: ElementRef) {
    super();

    // Effect to update field value when color changes
    effect(() => {
      const displayVal = this.displayValue();
      // Only update if we have a valid color (not the default empty state)
      if (this.value !== '' || this.currentColor().hex !== '#000000') {
        this.value = displayVal;
        this.onChange(displayVal);
      }
    });

    // Effect to check if panel should flip to top when expanded
    effect(() => {
      if (this.isExpanded()) {
        setTimeout(() => this.checkAndFlipPanel(), 0);
      }
    });
  }

  ngAfterViewInit(): void {
    // Setup resize observer for trigger element
    if (this.triggerElement?.nativeElement) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.isExpanded()) {
          this.checkAndFlipPanel();
        }
      });
      this.resizeObserver.observe(this.triggerElement.nativeElement);
    }

    // Setup scroll listener
    this.scrollListener = this.renderer.listen('window', 'scroll', () => {
      if (this.isExpanded()) {
        this.checkAndFlipPanel();
      }
    });
  }

  override ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.scrollListener) {
      this.scrollListener();
    }
  }

  /**
   * Check if panel should flip to top (like native select does automatically)
   */
  private checkAndFlipPanel(): void {
    if (!this.triggerElement?.nativeElement || !this.colorPanel?.nativeElement) {
      return;
    }

    const trigger = this.triggerElement.nativeElement;
    const panel = this.colorPanel.nativeElement;
    const triggerRect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Estimate panel height
    const panelHeight = panel.scrollHeight || 400;

    // Check available space (like native select does)
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    // Flip to top if not enough space below (native select behavior)
    const shouldFlip = spaceBelow < panelHeight && spaceAbove > spaceBelow;

    // Toggle CSS class for flip (CSS handles the positioning)
    if (shouldFlip) {
      this.renderer.addClass(panel, 'color-panel--top');
    } else {
      this.renderer.removeClass(panel, 'color-panel--top');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isExpanded()) {
      return;
    }

    const target = event.target as HTMLElement;
    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside) {
      this.closePanel();
    }
  }

  togglePanel(): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    if (this.isExpanded()) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  openPanel(): void {
    this.isExpanded.set(true);
  }

  closePanel(): void {
    this.isExpanded.set(false);
  }

  // Handle saturation/lightness picker movement
  onSaturationPickerMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.updateSaturationPicker(event);

    const handleMouseMove = (e: MouseEvent) => {
      this.updateSaturationPicker(e);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  private updateSaturationPicker(event: MouseEvent): void {
    if (!this.saturationPicker) return;

    const rect = this.saturationPicker.nativeElement.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    // Clamp values
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    this.pickerX.set(x);
    this.pickerY.set(y);

    // Calculate saturation and lightness
    const saturation = (x / rect.width) * 100;
    const lightness = 100 - (y / rect.height) * 100;

    this.updateColorFromHSL(this.hueValue(), saturation, lightness);
  }

  // Handle hue slider change
  onHueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const hue = parseFloat(input.value);
    this.hueValue.set(hue);

    const color = this.currentColor();
    this.updateColorFromHSL(hue, color.hsl.s, color.hsl.l);
  }

  // Handle alpha slider change
  onAlphaChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const alpha = parseFloat(input.value);
    this.alphaValue.set(alpha);

    const color = this.currentColor();
    this.currentColor.set({ ...color, alpha });
  }

  // Update color from HSL values
  private updateColorFromHSL(h: number, s: number, l: number): void {
    const rgb = this.hslToRgb(h, s, l);
    const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);

    this.currentColor.set({
      hex,
      rgb,
      hsl: { h, s, l },
      alpha: this.alphaValue(),
    });
  }

  // Select preset color
  selectPresetColor(colorHex: string): void {
    this.parseAndSetColor(colorHex);
  }

  // Parse and set color from string
  private parseAndSetColor(colorString: string): void {
    // Remove whitespace
    colorString = colorString.trim();

    // Parse hex
    if (colorString.startsWith('#')) {
      const hex = colorString.substring(0, 7);
      const rgb = this.hexToRgb(hex);
      if (rgb) {
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

        // Parse alpha if present
        let alpha = 1;
        if (colorString.length === 9) {
          alpha = parseInt(colorString.substring(7, 9), 16) / 255;
        }

        this.currentColor.set({ hex, rgb, hsl, alpha });
        this.hueValue.set(hsl.h);
        this.alphaValue.set(alpha);
      }
    }
    // Parse rgb/rgba
    else if (colorString.startsWith('rgb')) {
      const match = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        const alpha = match[4] ? parseFloat(match[4]) : 1;

        const rgb = { r, g, b };
        const hex = this.rgbToHex(r, g, b);
        const hsl = this.rgbToHsl(r, g, b);

        this.currentColor.set({ hex, rgb, hsl, alpha });
        this.hueValue.set(hsl.h);
        this.alphaValue.set(alpha);
      }
    }
    // Parse hsl/hsla
    else if (colorString.startsWith('hsl')) {
      const match = colorString.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?\)/);
      if (match) {
        const h = parseInt(match[1]);
        const s = parseInt(match[2]);
        const l = parseInt(match[3]);
        const alpha = match[4] ? parseFloat(match[4]) : 1;

        this.hueValue.set(h);
        this.alphaValue.set(alpha);
        this.updateColorFromHSL(h, s, l);
      }
    }
  }

  // Eye dropper support
  async openEyeDropper(): Promise<void> {
    if (!('EyeDropper' in window)) {
      console.warn('EyeDropper API is not supported in this browser');
      return;
    }

    try {
      const eyeDropper = new (window as any).EyeDropper();
      const result = await eyeDropper.open();
      this.parseAndSetColor(result.sRGBHex);
    } catch (error) {
      // User cancelled
    }
  }

  // Color conversion utilities
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }

  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  private hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h /= 360;
    s /= 100;
    l /= 100;

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  // Handle input value change
  onColorInputChange(event: Event): void {
    if (this.disabled() || this.readonly()) {
      return;
    }
    const target = event.target as HTMLInputElement;
    this.parseAndSetColor(target.value);
  }

  // Override ControlValueAccessor methods
  override writeValue(value: any): void {
    if (!value) {
      this.currentColor.set({
        hex: '#000000',
        rgb: { r: 0, g: 0, b: 0 },
        hsl: { h: 0, s: 0, l: 0 },
        alpha: 1,
      });
      super.writeValue('');
      return;
    }

    this.parseAndSetColor(value);
    super.writeValue(value);
  }

  override clear(): void {
    this.value = '';
    this.currentColor.set({
      hex: '#000000',
      rgb: { r: 0, g: 0, b: 0 },
      hsl: { h: 0, s: 0, l: 0 },
      alpha: 1,
    });
    this.hueValue.set(0);
    this.alphaValue.set(1);
    this.onChange('');
    this.change.emit('');
  }

  // Get current hue color for saturation picker background
  getHueColor(): string {
    const hue = this.hueValue();
    return `hsl(${hue}, 100%, 50%)`;
  }

  // Check if EyeDropper is supported
  isEyeDropperSupported(): boolean {
    return 'EyeDropper' in window;
  }
}
