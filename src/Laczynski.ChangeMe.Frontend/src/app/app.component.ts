import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from '@shared/components/toast/toast-container.component';
import { ToastService } from '@shared/components/toast/services/toast.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastContainerComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private toastService: ToastService) {}
  ngOnInit(): void {
    this.toastService.success('Hello', 'This is a test toast');
    this.toastService.info('Hello', 'This is a test toast');
    this.toastService.warn('Hello', 'This is a test toast');
    this.toastService.error('Hello', 'This is a test toast');
    this.toastService.error('Hello', 'This is a test toast');
    this.toastService.error('Hello', 'This is a test toast');
  }
}
