import { Component, input, output, model, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickAction } from '../utils';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

export type DrawerBackdrop = 'static' | 'dynamic';
export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  imports: [CommonModule, ButtonComponent, IconComponent],
})
export class DrawerComponent {
  title = input<string>('');
  bodyText = input<string>('');
  position = input<DrawerPosition>('right');
  backdrop = input<DrawerBackdrop>('dynamic');
  closable = input<boolean>(true);
  size = input<'small' | 'medium' | 'large'>('medium');
  visible = model<boolean>(false);

  primaryAction = input<QuickAction | null>(null);
  secondaryAction = input<QuickAction | null>(null);
  additionalActions = input<QuickAction[]>([]);

  close = output<void>();
  backdropClick = output<void>();

  drawerClasses(): string {
    const classes = ['drawer'];

    if (!this.visible()) {
      classes.push('drawer--hidden');
    }

    classes.push(`drawer--${this.position()}`);

    return classes.join(' ');
  }

  backdropClasses(): string {
    const classes = ['drawer__backdrop'];

    if (!this.visible()) {
      classes.push('drawer__backdrop--hidden');
    }

    return classes.join(' ');
  }

  contentClasses(): string {
    const classes = ['drawer__content'];

    classes.push(`drawer__content--${this.position()}`);
    classes.push(`drawer__content--${this.size()}`);

    return classes.join(' ');
  }

  headerClasses(): string {
    return 'drawer__header';
  }

  bodyClasses(): string {
    return 'drawer__body';
  }

  footerClasses(): string {
    return 'drawer__footer';
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.backdrop() === 'dynamic' && event.target === event.currentTarget) {
      this.closeDrawer();
      this.backdropClick.emit();
    }
  }

  onCloseClick(): void {
    if (this.closable()) {
      this.closeDrawer();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.visible() && this.closable()) {
      event.preventDefault();
      this.closeDrawer();
    }
  }

  private closeDrawer(): void {
    this.visible.set(false);
    this.close.emit();
  }

  handlePrimaryAction(): void {
    const action = this.primaryAction();
    if (action && !action.disabled) {
      action.action();
    }
  }

  handleSecondaryAction(): void {
    const action = this.secondaryAction();
    if (action && !action.disabled) {
      action.action();
    }
  }

  handleAdditionalAction(action: QuickAction): void {
    if (!action.disabled) {
      action.action();
    }
  }

  hasActions(): boolean {
    return !!(
      this.primaryAction() ||
      this.secondaryAction() ||
      this.additionalActions().length > 0
    );
  }
}


