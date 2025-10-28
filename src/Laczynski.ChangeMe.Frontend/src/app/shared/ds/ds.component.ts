import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DsSidebarComponent } from './components/ds-sidebar/ds-sidebar.component';
import {
  SplitterComponent,
  SplitterPanel,
  SplitterPanelDirective,
} from '@shared/components/splitter';
import { ScrollPanelComponent } from '@shared/components/scroll-panel';

@Component({
  selector: 'app-ds',
  imports: [
    CommonModule,
    RouterOutlet,
    DsSidebarComponent,
    SplitterComponent,
    SplitterPanelDirective,
    ScrollPanelComponent,
  ],
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
