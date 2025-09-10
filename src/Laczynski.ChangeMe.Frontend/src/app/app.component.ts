import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from '@shared/components/toast/toast-container.component';
import { TabPanelComponent } from '@shared/components/tabs/tab-panel.component';
import { TabItem, TabsComponent } from '@shared/components/tabs/tabs.component';
import { ItemsListComponent, ItemsInfiniteListComponent } from '@features/items';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ToastContainerComponent,
    TabPanelComponent,
    TabsComponent,
    ItemsListComponent,
    ItemsInfiniteListComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  tabs = signal<TabItem[]>([
    { id: 'tab1', label: 'Tabela' },
    { id: 'tab2', label: 'Lista' },
  ]);
  activeTabId = signal('tab1');
}
