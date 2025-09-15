import {
  Component,
  input,
  output,
  model,
  computed,
  OnInit,
  ContentChildren,
  QueryList,
  AfterContentInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Intent, Size, Variant } from '../utils';
import { ButtonComponent } from '../button/button.component';
import { TabPanelComponent } from './tab-panel.component';

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
})
export class TabsComponent implements OnInit {
  tabs = input<TabItem[]>([]);
  activeTabId = model<string>('');
  intent = input<Intent>('primary');
  size = input<Size>('medium');
  variant = input<Variant>('ghost');

  tabChange = output<string>();

  @ContentChildren(TabPanelComponent) tabPanels!: QueryList<TabPanelComponent>;

  activeTab = computed(() => {
    const activeId = this.activeTabId();
    return this.tabs().find(tab => tab.id === activeId) || this.tabs()[0];
  });

  tabsClasses(): string {
    const classes = ['tabs'];

    classes.push(`tabs--${this.intent()}`);
    classes.push(`tabs--${this.size()}`);
    classes.push(`tabs--${this.variant()}`);

    return classes.join(' ');
  }

  tabClasses(tab: TabItem): string {
    const classes = ['tabs__tab'];

    classes.push(`tabs__tab--${this.size()}`);

    if (tab.id === this.activeTabId()) {
      classes.push('tabs__tab--active');
    }

    if (tab.disabled) {
      classes.push('tabs__tab--disabled');
    }

    return classes.join(' ');
  }

  getTabIntent(tab: TabItem): Intent {
    return tab.id === this.activeTabId() ? this.intent() : 'secondary';
  }

  getTabVariant(tab: TabItem): Variant {
    if (tab.id === this.activeTabId()) {
      return this.variant() === 'ghost' ? 'solid' : this.variant();
    }
    return 'ghost';
  }

  setActiveTab(tabId: string): void {
    this.activeTabId.set(tabId);
  }

  ngOnInit(): void {
    if (!this.activeTabId() && this.tabs().length > 0) {
      this.activeTabId.set(this.tabs()[0].id);
    }
  }

  onTabClick(tab: TabItem, event: MouseEvent): void {
    if (tab.disabled) {
      return;
    }

    this.activeTabId.set(tab.id);
    this.tabChange.emit(tab.id);
  }
}
