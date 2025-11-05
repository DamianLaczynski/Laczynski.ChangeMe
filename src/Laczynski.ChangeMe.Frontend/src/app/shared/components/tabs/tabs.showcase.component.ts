import { Component, signal } from '@angular/core';
import { TabsComponent } from './tabs.component';
import { CommonModule } from '@angular/common';
import { Node } from '../node/node.component';

@Component({
  selector: 'app-tabs-showcase',
  imports: [TabsComponent, CommonModule],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Tabs Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Tabs component built with Fluent 2 Design System. Supports
        both horizontal and vertical orientations with various layouts, sizes, and interaction
        patterns.
      </p>

      <!-- ========================================= -->
      <!-- HORIZONTAL TABS -->
      <!-- ========================================= -->

      <h2 class="showcase__title" style="margin-top: 48px;">Horizontal Tabs</h2>

      <!-- Basic Tabs -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Horizontal Tabs (Icon Before)</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-tabs
              [tabs]="basicTabs()"
              [selectedTabId]="selectedBasicTab()"
              (tabChange)="onBasicTabChange($event)"
            ></app-tabs>
            <p style="margin-top: 16px;">Selected: {{ selectedBasicTab() }}</p>
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Horizontal Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Small</h3>
            <app-tabs [tabs]="sizeTabs()" size="small"></app-tabs>
          </div>
          <div class="showcase__item">
            <h3>Medium (Default)</h3>
            <app-tabs [tabs]="sizeTabs()" size="medium"></app-tabs>
          </div>
          <div class="showcase__item">
            <h3>Large</h3>
            <app-tabs [tabs]="sizeTabs()" size="large"></app-tabs>
          </div>
        </div>
      </div>


      <!-- Style Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Horizontal Style Variants</h2>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <h3>Transparent (Default)</h3>
            <app-tabs [tabs]="styleTabs()" appearance="transparent"></app-tabs>
          </div>
          <div class="showcase__item">
            <h3>Subtle</h3>
            <app-tabs [tabs]="styleTabs()" appearance="subtle"></app-tabs>
          </div>
          <div class="showcase__item">
            <h3>Subtle Circular</h3>
            <app-tabs [tabs]="styleTabs()" appearance="subtle-circular"></app-tabs>
          </div>
          <div class="showcase__item">
            <h3>Filled Circular</h3>
            <app-tabs [tabs]="styleTabs()" appearance="filled-circular"></app-tabs>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- VERTICAL TABS -->
      <!-- ========================================= -->

      <h2 class="showcase__title" style="margin-top: 48px;">Vertical Tabs</h2>

      <!-- Basic Vertical Tabs -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Vertical Tabs (Icon Before)</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-tabs
              [tabs]="verticalBasicTabs()"
              [selectedTabId]="selectedVerticalTab()"
              orientation="vertical"
              (tabChange)="onVerticalTabChange($event)"
            ></app-tabs>
            <p style="margin-top: 16px;">Selected: {{ selectedVerticalTab() }}</p>
          </div>
        </div>
      </div>

      <!-- Vertical Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Vertical Size Variants</h2>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <h3>Small</h3>
            <app-tabs [tabs]="verticalSizeTabs()" size="small" orientation="vertical"></app-tabs>
          </div>
          <div class="showcase__item">
            <h3>Medium (Default)</h3>
            <app-tabs [tabs]="verticalSizeTabs()" size="medium" orientation="vertical"></app-tabs>
          </div>
        </div>
      </div>


      <!-- Vertical Style Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Vertical Style Variants</h2>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <h3>Transparent (Default)</h3>
            <app-tabs
              [tabs]="verticalStyleTabs()"
              appearance="transparent"
              orientation="vertical"
            ></app-tabs>
          </div>
          <div class="showcase__item">
            <h3>Subtle Circular</h3>
            <app-tabs
              [tabs]="verticalStyleTabs()"
              appearance="subtle-circular"
              orientation="vertical"
            ></app-tabs>
          </div>
        </div>
      </div>

      <!-- Vertical Circular Small -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Vertical Circular Small Tabs</h2>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <h3>Small + Subtle Circular</h3>
            <app-tabs
              [tabs]="verticalCircularTabs()"
              size="small"
              appearance="subtle-circular"
              orientation="vertical"
            ></app-tabs>
          </div>
        </div>
      </div>

      <!-- Mixed Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Combined Examples</h2>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <h3>Horizontal: Small</h3>
            <app-tabs [tabs]="combinedTabs()" size="small"></app-tabs>
          </div>
          <div class="showcase__item">
            <h3>Vertical: Medium + Transparent</h3>
            <app-tabs
              [tabs]="combinedTabs()"
              size="medium"
              appearance="transparent"
              orientation="vertical"
            ></app-tabs>
          </div>
        </div>
      </div>

      <!-- With Disabled Tabs -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">With Disabled Tabs</h2>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <h3>Horizontal</h3>
            <app-tabs [tabs]="disabledTabs()"></app-tabs>
          </div>
          <div class="showcase__item">
            <h3>Vertical</h3>
            <app-tabs [tabs]="disabledTabs()" orientation="vertical"></app-tabs>
          </div>
        </div>
      </div>

      <!-- Event Logging -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Event Logging</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <p><strong>Last Event:</strong> {{ lastEvent() }}</p>
            <p><strong>Selected Tab:</strong> {{ lastSelectedTab() }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TabsShowcaseComponent {
  lastEvent = signal<string>('None');
  lastSelectedTab = signal<string>('None');
  selectedBasicTab = signal<string | number>('tab1');
  selectedVerticalTab = signal<string | number>('vtab1');

  // Basic tabs
  basicTabs = signal<Node[]>([
    { id: 'tab1', label: 'First tab', icon: 'home' },
    { id: 'tab2', label: 'Second tab', icon: 'settings' },
    { id: 'tab3', label: 'Third tab', icon: 'settings' },
    { id: 'tab4', label: 'Fourth tab', icon: 'settings' },
    { id: 'tab5', label: 'Fifth tab', icon: 'settings' },
  ]);

  // Size tabs
  sizeTabs = signal<Node[]>([
    { id: 1, label: 'Home', icon: 'home' },
    { id: 2, label: 'Profile', icon: 'person' },
    { id: 3, label: 'Settings', icon: 'settings' },
  ]);

  // Layout tabs
  layoutTabs = signal<Node[]>([
    { id: 'a', label: 'Dashboard', icon: 'home' },
    { id: 'b', label: 'Analytics', icon: 'document' },
    { id: 'c', label: 'Reports', icon: 'home' },
    { id: 'd', label: 'Team', icon: 'home' },
  ]);

  // Style tabs
  styleTabs = signal<Node[]>([
    { id: 'style1', label: 'Overview', icon: 'book' },
    { id: 'style2', label: 'Details', icon: 'book' },
    { id: 'style3', label: 'Settings', icon: 'settings' },
  ]);

  // Vertical basic tabs
  verticalBasicTabs = signal<Node[]>([
    { id: 'vtab1', label: 'First tab', icon: 'home' },
    { id: 'vtab2', label: 'Second tab', icon: 'settings' },
    { id: 'vtab3', label: 'Third tab', icon: 'settings' },
    { id: 'vtab4', label: 'Fourth tab', icon: 'settings' },
    { id: 'vtab5', label: 'Fifth tab', icon: 'settings' },
  ]);

  // Vertical size tabs
  verticalSizeTabs = signal<Node[]>([
    { id: 'vsize1', label: 'Home', icon: 'home' },
    { id: 'vsize2', label: 'Profile', icon: 'person' },
    { id: 'vsize3', label: 'Settings', icon: 'settings' },
  ]);

  // Vertical layout tabs
  verticalLayoutTabs = signal<Node[]>([
    { id: 'vlayout1', label: 'Dashboard', icon: 'home' },
    { id: 'vlayout2', label: 'Analytics', icon: 'line' },
    { id: 'vlayout3', label: 'Reports', icon: 'document_copy' },
    { id: 'vlayout4', label: 'Team', icon: 'people_team' },
  ]);

  // Vertical style tabs
  verticalStyleTabs = signal<Node[]>([
    { id: 'vstyle1', label: 'Overview', icon: 'book' },
    { id: 'vstyle2', label: 'Details', icon: 'book' },
    { id: 'vstyle3', label: 'Settings', icon: 'settings' },
  ]);

  // Vertical circular tabs
  verticalCircularTabs = signal<Node[]>([
    { id: 'vcir1', label: 'First tab', icon: 'home' },
    { id: 'vcir2', label: 'Second tab', icon: 'settings' },
    { id: 'vcir3', label: 'Third tab', icon: 'settings' },
    { id: 'vcir4', label: 'Fourth tab', icon: 'settings' },
    { id: 'vcir5', label: 'Fifth tab', icon: 'settings' },
  ]);

  // Disabled tabs
  disabledTabs = signal<Node[]>([
    { id: 'd1', label: 'Active', icon: 'home' },
    { id: 'd2', label: 'Disabled', disabled: true },
    { id: 'd3', label: 'Active', icon: 'home' },
    { id: 'd4', label: 'Disabled', disabled: true },
  ]);

  // Combined tabs
  combinedTabs = signal<Node[]>([
    { id: 'cb1', label: 'All', icon: 'home' },
    { id: 'cb2', label: 'Active', icon: 'home' },
    { id: 'cb3', label: 'Completed', icon: 'home' },
  ]);

  // Event handlers
  onBasicTabChange(tab: Node): void {
    this.selectedBasicTab.set(tab.id);
    this.lastEvent.set(`Horizontal tab changed: ${tab.label}`);
    this.lastSelectedTab.set(tab.label);
    console.log('Horizontal tab changed:', tab);
  }

  onVerticalTabChange(tab: Node): void {
    this.selectedVerticalTab.set(tab.id);
    this.lastEvent.set(`Vertical tab changed: ${tab.label}`);
    this.lastSelectedTab.set(tab.label);
    console.log('Vertical tab changed:', tab);
  }
}
