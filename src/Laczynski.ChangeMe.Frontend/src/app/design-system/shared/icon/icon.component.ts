import { Component, input, computed, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  // Outline icons (most commonly used)
  heroEnvelope,
  heroMagnifyingGlass,
  heroCalendarDays,
  heroPhone,
  heroGlobeAlt,
  heroChatBubbleLeft,
  heroChartBar,
  heroLockClosed,
  heroUser,
  heroClipboardDocumentList,
  heroShieldCheck,
  heroStar,
  heroHeart,
  heroHandThumbUp,
  heroCheckCircle,
  heroSparkles,
  heroFire,
  heroLightBulb,
  heroRocketLaunch,
  heroXMark,
  heroEye,
  heroEyeSlash,
  heroPencil,
  heroTrash,
  heroPlus,
  heroLink,
  heroCog6Tooth,
  heroExclamationTriangle,
  heroArrowRight,
  heroArrowLeft,
  heroArrowUp,
  heroArrowDown,
  heroChevronUp,
  heroChevronDown,
  heroChevronLeft,
  heroChevronRight,
} from '@ng-icons/heroicons/outline';

/**
 * Available icon names mapping to heroicons
 */
export type IconName =
  // Communication & Contact
  | 'envelope'
  | 'phone'
  | 'chat'
  // Navigation & Search
  | 'magnifying-glass'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-down'
  | 'chevron-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  // Date & Time
  | 'calendar'
  // User & Profile
  | 'user'
  // Actions & Controls
  | 'x-mark'
  | 'eye'
  | 'eye-slash'
  | 'pencil'
  | 'trash'
  | 'plus'
  | 'link'
  | 'cog'
  // Status & Feedback
  | 'check-circle'
  | 'exclamation-triangle'
  | 'star'
  | 'heart'
  | 'thumb-up'
  // Business & Data
  | 'chart-bar'
  | 'clipboard'
  | 'shield'
  // Web & Technology
  | 'globe'
  | 'lock'
  // Inspiration & Energy
  | 'sparkles'
  | 'fire'
  | 'light-bulb'
  | 'rocket';

/**
 * Icon sizes following design system conventions
 */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Icon color variants
 */
export type IconColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'muted'
  | 'inherit';

/**
 * Icon mapping configuration
 */
const ICON_MAP: Record<IconName, string> = {
  // Communication & Contact
  envelope: 'heroEnvelope',
  phone: 'heroPhone',
  chat: 'heroChatBubbleLeft',
  // Navigation & Search
  'magnifying-glass': 'heroMagnifyingGlass',
  'arrow-right': 'heroArrowRight',
  'arrow-left': 'heroArrowLeft',
  'arrow-up': 'heroArrowUp',
  'arrow-down': 'heroArrowDown',
  'chevron-up': 'heroChevronUp',
  'chevron-down': 'heroChevronDown',
  'chevron-left': 'heroChevronLeft',
  'chevron-right': 'heroChevronRight',
  // Date & Time
  calendar: 'heroCalendarDays',
  // User & Profile
  user: 'heroUser',
  // Actions & Controls
  'x-mark': 'heroXMark',
  eye: 'heroEye',
  'eye-slash': 'heroEyeSlash',
  pencil: 'heroPencil',
  trash: 'heroTrash',
  plus: 'heroPlus',
  link: 'heroLink',
  cog: 'heroCog6Tooth',
  // Status & Feedback
  'check-circle': 'heroCheckCircle',
  'exclamation-triangle': 'heroExclamationTriangle',
  star: 'heroStar',
  heart: 'heroHeart',
  'thumb-up': 'heroHandThumbUp',
  // Business & Data
  'chart-bar': 'heroChartBar',
  clipboard: 'heroClipboardDocumentList',
  shield: 'heroShieldCheck',
  // Web & Technology
  globe: 'heroGlobeAlt',
  lock: 'heroLockClosed',
  // Inspiration & Energy
  sparkles: 'heroSparkles',
  fire: 'heroFire',
  'light-bulb': 'heroLightBulb',
  rocket: 'heroRocketLaunch',
};

/**
 * Size configuration mapping
 */
const SIZE_MAP: Record<IconSize, string> = {
  xs: '12',
  sm: '16',
  md: '20',
  lg: '24',
  xl: '32',
};

/**
 * Icon Component
 *
 * Provides a consistent, type-safe way to use Heroicons throughout the design system.
 * Supports customizable sizes, colors, and accessibility features.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      // Communication & Contact
      heroEnvelope,
      heroPhone,
      heroChatBubbleLeft,
      // Navigation & Search
      heroMagnifyingGlass,
      heroArrowRight,
      heroArrowLeft,
      heroArrowUp,
      heroArrowDown,
      heroChevronUp,
      heroChevronDown,
      heroChevronLeft,
      heroChevronRight,
      // Date & Time
      heroCalendarDays,
      // User & Profile
      heroUser,
      // Actions & Controls
      heroXMark,
      heroEye,
      heroEyeSlash,
      heroPencil,
      heroTrash,
      heroPlus,
      heroLink,
      heroCog6Tooth,
      // Status & Feedback
      heroCheckCircle,
      heroExclamationTriangle,
      heroStar,
      heroHeart,
      heroHandThumbUp,
      // Business & Data
      heroChartBar,
      heroClipboardDocumentList,
      heroShieldCheck,
      // Web & Technology
      heroGlobeAlt,
      heroLockClosed,
      // Inspiration & Energy
      heroSparkles,
      heroFire,
      heroLightBulb,
      heroRocketLaunch,
    }),
  ],
  template: `
    <ng-icon
      [name]="iconName()"
      [size]="iconSize()"
      [style.color]="iconColor()"
      [class]="customClasses()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-hidden]="ariaHidden()"
      [attr.role]="role()"
    >
    </ng-icon>
  `,
  host: {
    '[class.ds-icon]': 'true',
    '[class]': 'hostClasses()',
    '[attr.aria-hidden]': 'ariaHidden()',
  },
})
export class IconComponent {
  // =============================================================================
  // INPUT SIGNALS
  // =============================================================================

  /** Icon name from the available icon set */
  name = input.required<IconName>();

  /** Icon size */
  size = input<IconSize>('md');

  /** Icon color variant */
  color = input<IconColor>('inherit');

  /** Custom CSS classes */
  customClasses = input<string>('');

  /** Accessibility label for screen readers */
  ariaLabel = input<string>('');

  /** Whether icon is decorative (hidden from screen readers) */
  decorative = input<boolean>(false);

  // =============================================================================
  // COMPUTED PROPERTIES
  // =============================================================================

  /** Resolved icon name for ng-icon */
  readonly iconName = computed(() => ICON_MAP[this.name()]);

  /** Resolved icon size */
  readonly iconSize = computed(() => SIZE_MAP[this.size()]);

  /** Resolved icon color */
  readonly iconColor = computed(() => {
    const color = this.color();
    return color === 'inherit' ? 'currentColor' : `var(--ds-color-${color})`;
  });

  /** Host CSS classes */
  readonly hostClasses = computed(() => {
    const classes = [
      `ds-icon--${this.size()}`,
      `ds-icon--${this.color()}`,
      this.customClasses(),
    ].filter(Boolean);

    return classes.join(' ');
  });

  /** Accessibility attributes */
  readonly ariaHidden = computed(() => (this.decorative() ? 'true' : null));
  readonly role = computed(() => (this.decorative() ? null : 'img'));

  // =============================================================================
  // HOST BINDINGS
  // =============================================================================

  @HostBinding('style.display') display = 'inline-flex';
  @HostBinding('style.align-items') alignItems = 'center';
  @HostBinding('style.justify-content') justifyContent = 'center';
}
