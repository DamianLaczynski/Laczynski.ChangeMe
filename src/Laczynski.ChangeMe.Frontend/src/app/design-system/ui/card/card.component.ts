// =============================================================================
// Card Component
// =============================================================================
// Flexible card component for the design system
// Supports multiple variants, media, actions, and interactive states

import {
  Component,
  input,
  output,
  computed,
  signal,
  TemplateRef,
  ElementRef,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingIndicatorComponent } from '../../../shared/components/loading-indicator/loading-indicator.component';
import { ButtonComponent } from '../button/button.component';

import {
  CardConfig,
  CardHeader,
  CardFooter,
  CardMedia,
  CardContent,
  CardVariant,
  CardSize,
  CardElevation,
  CardBackground,
  CardClickEvent,
  CardActionEvent,
  CardHoverEvent,
  createCardConfig,
  getCardClasses,
  getAvatarClasses,
  getActionClasses,
  generateCardId,
} from './card.model';

/**
 * Card Component
 *
 * A flexible container component that supports:
 * - Multiple visual variants and sizes
 * - Headers with titles, avatars, and actions
 * - Media content (images, videos)
 * - Footer actions and content
 * - Interactive states and loading
 * - Custom templates for full customization
 *
 * @example
 * ```html
 * <ds-card
 *   variant="elevated"
 *   size="md"
 *   [interactive]="true"
 *   [header]="{ title: 'Card Title', subtitle: 'Card Subtitle' }"
 *   [footer]="{ actions: cardActions }"
 *   (cardClick)="onCardClick($event)"
 * >
 *   <p>Card content goes here</p>
 * </ds-card>
 * ```
 */
@Component({
  selector: 'ds-card',
  standalone: true,
  imports: [CommonModule, LoadingIndicatorComponent, ButtonComponent],
  template: `
    <div
      #cardContainer
      [class]="containerClasses()"
      [id]="cardId()"
      [attr.aria-selected]="selected()"
      [attr.aria-disabled]="disabled()"
      [attr.tabindex]="interactive() && !disabled() ? 0 : undefined"
      (click)="onCardClick($event)"
      (mouseenter)="onCardHover($event, true)"
      (mouseleave)="onCardHover($event, false)"
      (keydown.enter)="onCardClick($event)"
      (keydown.space)="onCardClick($event)"
      role="region"
    >
      <!-- Loading Overlay -->
      @if (loading()) {
        <div class="ds-card__loading-overlay">
          <app-loading-indicator size="small" />
        </div>
      }

      <!-- Media (Top) -->
      @if (media() && media()!.position === 'top') {
        <div class="ds-card__media ds-card__media--top">
          @if (media()!.template) {
            <ng-container *ngTemplateOutlet="media()!.template!" />
          } @else if (media()!.type === 'image') {
            <img
              [src]="media()!.src"
              [alt]="media()!.alt || ''"
              [style.aspect-ratio]="media()!.aspectRatio"
              class="ds-card__media-image"
            />
          }
        </div>
      }

      <!-- Header -->
      @if (header()) {
        <div class="ds-card__header">
          @if (header()!.template) {
            <ng-container *ngTemplateOutlet="header()!.template!" />
          } @else {
            <div class="ds-card__header-content">
              <!-- Avatar -->
              @if (header()!.avatar) {
                <div [class]="getAvatarClasses(header()!.avatar!)">
                  @if (header()!.avatar!.type === 'image') {
                    <img [src]="header()!.avatar!.src" [alt]="header()!.title || ''" />
                  } @else if (header()!.avatar!.type === 'icon') {
                    <span class="ds-card__avatar-icon">{{ header()!.avatar!.icon }}</span>
                  } @else if (header()!.avatar!.type === 'initials') {
                    <span class="ds-card__avatar-initials">{{ header()!.avatar!.initials }}</span>
                  }
                </div>
              }

              <!-- Title & Subtitle -->
              <div class="ds-card__header-text">
                @if (header()!.title) {
                  <h3 class="ds-card__title">{{ header()!.title }}</h3>
                }
                @if (header()!.subtitle) {
                  <p class="ds-card__subtitle">{{ header()!.subtitle }}</p>
                }
              </div>
            </div>

            <!-- Header Actions -->
            @if (header()!.actions && header()!.actions!.length > 0) {
              <div class="ds-card__header-actions">
                @for (action of header()!.actions; track action.label) {
                  <ds-button
                    [variant]="action.variant || 'ghost'"
                    [size]="action.size || 'sm'"
                    [disabled]="action.disabled || disabled()"
                    [iconStart]="action.icon"
                    (clicked)="onActionClick(action, $event)"
                  >
                    {{ action.label }}
                  </ds-button>
                }
              </div>
            }
          }
        </div>
      }

      <!-- Media (Left/Right) -->
      @if (media() && (media()!.position === 'left' || media()!.position === 'right')) {
        <div class="ds-card__body ds-card__body--with-media">
          <div class="ds-card__media" [class]="'ds-card__media--' + media()!.position">
            @if (media()!.template) {
              <ng-container *ngTemplateOutlet="media()!.template!" />
            } @else if (media()!.type === 'image') {
              <img
                [src]="media()!.src"
                [alt]="media()!.alt || ''"
                [style.aspect-ratio]="media()!.aspectRatio"
                class="ds-card__media-image"
              />
            }
          </div>

          <div class="ds-card__content">
            @if (contentTemplate()) {
              <ng-container *ngTemplateOutlet="contentTemplate()!" />
            } @else {
              <ng-content />
            }
          </div>
        </div>
      } @else {
        <!-- Regular Content -->
        <div class="ds-card__content">
          @if (contentTemplate()) {
            <ng-container *ngTemplateOutlet="contentTemplate()!" />
          } @else {
            <ng-content />
          }
        </div>
      }

      <!-- Media (Bottom) -->
      @if (media() && media()!.position === 'bottom') {
        <div class="ds-card__media ds-card__media--bottom">
          @if (media()!.template) {
            <ng-container *ngTemplateOutlet="media()!.template!" />
          } @else if (media()!.type === 'image') {
            <img
              [src]="media()!.src"
              [alt]="media()!.alt || ''"
              [style.aspect-ratio]="media()!.aspectRatio"
              class="ds-card__media-image"
            />
          }
        </div>
      }

      <!-- Footer -->
      @if (footer()) {
        <div class="ds-card__footer" [class]="'ds-card__footer--' + (footer()!.align || 'right')">
          @if (footer()!.template) {
            <ng-container *ngTemplateOutlet="footer()!.template!" />
          } @else {
            @if (footer()!.text) {
              <span class="ds-card__footer-text">{{ footer()!.text }}</span>
            }

            @if (footer()!.actions && footer()!.actions!.length > 0) {
              <div class="ds-card__footer-actions">
                @for (action of footer()!.actions; track action.label) {
                  <ds-button
                    [variant]="action.variant || 'secondary'"
                    [size]="action.size || 'sm'"
                    [disabled]="action.disabled || disabled()"
                    [iconStart]="action.icon"
                    (clicked)="onActionClick(action, $event)"
                  >
                    {{ action.label }}
                  </ds-button>
                }
              </div>
            }
          }
        </div>
      }

      <!-- Background Media -->
      @if (media() && media()!.position === 'background') {
        <div class="ds-card__background-media">
          @if (media()!.template) {
            <ng-container *ngTemplateOutlet="media()!.template!" />
          } @else if (media()!.type === 'image') {
            <img
              [src]="media()!.src"
              [alt]="media()!.alt || ''"
              class="ds-card__background-image"
            />
          }
        </div>
      }
    </div>
  `,
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  // =============================================================================
  // INPUTS
  // =============================================================================

  // Configuration
  variant = input<CardVariant>('default');
  size = input<CardSize>('md');
  elevation = input<CardElevation>('sm');
  background = input<CardBackground>('default');

  // State
  interactive = input<boolean>(false);
  selected = input<boolean>(false);
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  bordered = input<boolean>(false);
  padded = input<boolean>(true);

  // Content
  header = input<CardHeader | null>(null);
  footer = input<CardFooter | null>(null);
  media = input<CardMedia | null>(null);
  content = input<CardContent | null>(null);

  // Templates
  contentTemplate = input<TemplateRef<any> | null>(null);

  // =============================================================================
  // OUTPUTS
  // =============================================================================

  cardClick = output<CardClickEvent>();
  cardAction = output<CardActionEvent>();
  cardHover = output<CardHoverEvent>();

  // =============================================================================
  // VIEW CHILDREN
  // =============================================================================

  cardContainer = viewChild<ElementRef<HTMLDivElement>>('cardContainer');

  // =============================================================================
  // INTERNAL STATE
  // =============================================================================

  readonly cardId = signal(generateCardId());

  // =============================================================================
  // COMPUTED PROPERTIES
  // =============================================================================

  readonly config = computed(() =>
    createCardConfig({
      variant: this.variant(),
      size: this.size(),
      elevation: this.elevation(),
      background: this.background(),
      interactive: this.interactive(),
      selected: this.selected(),
      disabled: this.disabled(),
      loading: this.loading(),
      bordered: this.bordered(),
      padded: this.padded(),
    }),
  );

  readonly containerClasses = computed(() => getCardClasses(this.config()).join(' '));

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  getAvatarClasses(avatar: any): string {
    return getAvatarClasses(avatar).join(' ');
  }

  getActionClasses(action: any): string {
    return getActionClasses(action).join(' ');
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  onCardClick(event: Event): void {
    if (!this.interactive() || this.disabled()) return;

    event.preventDefault();
    event.stopPropagation();

    this.cardClick.emit({
      originalEvent: event,
      cardElement: this.cardContainer()?.nativeElement!,
    });
  }

  onCardHover(event: Event, hovered: boolean): void {
    if (!this.interactive() || this.disabled()) return;

    this.cardHover.emit({
      hovered,
      originalEvent: event,
    });
  }

  onActionClick(action: any, event: any): void {
    if (action.disabled || this.disabled()) return;

    const originalEvent = event.originalEvent || event;
    originalEvent.preventDefault();
    originalEvent.stopPropagation();

    this.cardAction.emit({
      action,
      originalEvent,
    });

    // Call the action handler
    if (action.handler) {
      action.handler(originalEvent);
    }
  }
}
