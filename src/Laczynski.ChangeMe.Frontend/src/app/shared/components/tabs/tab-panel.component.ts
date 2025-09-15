import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (tabId() === activeTabId()) {
      <div
        [id]="'tabpanel-' + tabId()"
        [attr.aria-labelledby]="'tab-' + tabId()"
        role="tabpanel"
        [class]="panelClasses()"
      >
        <ng-content></ng-content>
      </div>
    }
  `,
})
export class TabPanelComponent {
  tabId = input.required<string>();
  activeTabId = input.required<string>();
  size = input<'small' | 'medium' | 'large'>('medium');

  panelClasses(): string {
    const classes = ['tab-panel'];
    classes.push(`tab-panel--${this.size()}`);
    return classes.join(' ');
  }
}
