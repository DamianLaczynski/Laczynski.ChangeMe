import { Component, input, output, model, HostListener } from '@angular/core';
export type ModalBackdrop = 'static' | 'dynamic';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  standalone: true,
})
export class ModalComponent {
  // Inputs
  backdrop = input<ModalBackdrop>('dynamic');
  closable = input<boolean>(true);
  visible = model<boolean>(false);
  fullscreen = input<boolean>(false);

  // Outputs
  close = output<void>();
  backdropClick = output<void>();

  // Methods
  modalClasses(): string {
    const classes = ['modal'];

    if (this.fullscreen()) {
      classes.push('modal--fullscreen');
    }

    if (!this.visible()) {
      classes.push('modal--hidden');
    }

    return classes.join(' ');
  }

  backdropClasses(): string {
    const classes = ['modal__backdrop'];

    if (!this.visible()) {
      classes.push('modal__backdrop--hidden');
    }

    return classes.join(' ');
  }

  contentClasses(): string {
    return 'modal__content';
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.backdrop() === 'dynamic' && event.target === event.currentTarget) {
      this.closeModal();
      this.backdropClick.emit();
    }
  }

  onCloseClick(): void {
    if (this.closable()) {
      this.closeModal();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.visible() && this.closable()) {
      event.preventDefault();
      this.closeModal();
    }
  }

  private closeModal(): void {
    this.visible.set(false);
    this.close.emit();
  }
}
