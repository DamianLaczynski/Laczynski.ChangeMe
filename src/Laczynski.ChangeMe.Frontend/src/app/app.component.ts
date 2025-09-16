import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from '@shared/components/toast/toast-container.component';
import { TabPanelComponent } from '@shared/components/tabs/tab-panel.component';
import { TabItem, TabsComponent } from '@shared/components/tabs/tabs.component';
import { ItemsListComponent, ItemsInfiniteListComponent } from '@features/items';
import { TextShowcaseComponent } from '@shared/components/field/text/text.showcase.component';
import { TelShowcaseComponent } from '@shared/components/field/tel/tel.showcase.component';
import { NumberShowcaseComponent } from '@shared/components/field/number/number.showcase.component';
import { ButtonShowcaseComponent } from '@shared/components/button/button.showcase.component';
import { InputShowcaseComponent } from '@shared/components/input/input.showcase.component';
import { UrlShowcaseComponent } from '@shared/components/field/url/url.showcase.component';
import { SelectShowcaseComponent } from '@shared/components/field/select/select.showcase.component';
import { PasswordShowcaseComponent } from '@shared/components/field/password/password.showcase.component';
import { SearchShowcaseComponent } from '@shared/components/field/search/search.showcase.component';

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
    TextShowcaseComponent,
    TelShowcaseComponent,
    NumberShowcaseComponent,
    ButtonShowcaseComponent,
    InputShowcaseComponent,
    UrlShowcaseComponent,
    SelectShowcaseComponent,
    PasswordShowcaseComponent,
    SearchShowcaseComponent,
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
