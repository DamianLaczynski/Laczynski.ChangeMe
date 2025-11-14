import { Component, input, output, model, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { QuickAction } from '../utils';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

export type DialogBackdrop = 'static' | 'dynamic';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',

  imports: [CommonModule, A11yModule, ButtonComponent, IconComponent],
})
export class DialogComponent {
  title = input<string>('');
  bodyText = input<string>('');
  backdrop = input<DialogBackdrop>('dynamic');
  closable = input<boolean>(true);
  fullscreen = input<boolean>(false);
  width = input<string>('');
  height = input<string>('');
  visible = model<boolean>(false);

  primaryAction = input<QuickAction | null>(null);
  secondaryAction = input<QuickAction | null>(null);
  additionalActions = input<QuickAction[]>([]);

  close = output<void>();
  backdropClick = output<void>();

  dialogClasses(): string {
    const classes = ['dialog'];

    if (!this.visible()) {
      classes.push('dialog--hidden');
    }

    return classes.join(' ');
  }

  backdropClasses(): string {
    const classes = ['dialog__backdrop'];

    if (!this.visible()) {
      classes.push('dialog__backdrop--hidden');
    }

    if (this.fullscreen()) {
      classes.push('dialog__backdrop--fullscreen');
    }

    return classes.join(' ');
  }

  contentClasses(): string {
    const classes = ['dialog__content'];

    if (this.fullscreen()) {
      classes.push('dialog__content--fullscreen');
    }

    return classes.join(' ');
  }

  contentStyles(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};

    if (this.width() && !this.fullscreen()) {
      styles['width'] = this.width();
      styles['max-width'] = this.width();
    }

    if (this.height() && !this.fullscreen()) {
      styles['height'] = this.height();
      styles['max-height'] = this.height();
    }

    return styles;
  }

  headerClasses(): string {
    return 'dialog__header';
  }

  bodyClasses(): string {
    return 'dialog__body';
  }

  footerClasses(): string {
    return 'dialog__footer';
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.backdrop() === 'dynamic' && event.target === event.currentTarget) {
      this.closeDialog();
      this.backdropClick.emit();
    }
  }

  onCloseClick(): void {
    if (this.closable()) {
      this.closeDialog();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.visible() && this.closable()) {
      event.preventDefault();
      this.closeDialog();
    }
  }

  private closeDialog(): void {
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
