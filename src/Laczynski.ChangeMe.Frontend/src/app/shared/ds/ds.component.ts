import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DsSidebarComponent } from './components/ds-sidebar/ds-sidebar.component';
import { SplitterPanel } from '@shared/components/splitter';

@Component({
  selector: 'app-ds',
  imports: [CommonModule, RouterOutlet, DsSidebarComponent],
  templateUrl: './ds.component.html',
})
export class DsComponent {
  panels = signal<SplitterPanel[]>([
    {
      id: 'sidebar',
      size: 15,
    },
    {
      id: 'content',
      size: 85,
    },
  ]);
}
