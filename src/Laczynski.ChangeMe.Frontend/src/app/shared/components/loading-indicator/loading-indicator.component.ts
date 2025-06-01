import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss'],
})
export class LoadingIndicatorComponent {
  size = input<'small' | 'medium' | 'large'>('medium');
  color = input<string>('#007bff');
  message = input<string>();
  showMessage = input<boolean>(true);
}
