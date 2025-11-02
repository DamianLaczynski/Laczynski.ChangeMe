import { Component, signal } from '@angular/core';
import { NavComponent } from './nav.component';
import { NavAppItemComponent } from './nav-app-item.component';
import { NavDividerComponent } from './nav-divider.component';
import { NavState, NavNodeConfig } from './models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-showcase',
  imports: [CommonModule, NavComponent, NavAppItemComponent, NavDividerComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Nav Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Nav component built with Fluent 2 Design System. Features
        collapsible navigation with hamburger menu, hierarchical navigation nodes, sub-items, and
        customizable layouts.
      </p>

      <!-- Keyboard Navigation Info -->
      <div
        class="showcase__info"
        style="background: #F0F0F0; padding: 16px; border-radius: 8px; margin-bottom: 24px;"
      >
        <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
          ⌨️ Keyboard Navigation
        </h3>
        <ul style="margin: 0; padding-left: 24px; line-height: 24px;">
          <li><kbd>↑</kbd> / <kbd>↓</kbd> - Navigate between items</li>
          <li><kbd>←</kbd> - Collapse group (when focused on group)</li>
          <li><kbd>→</kbd> - Expand group (when focused on group)</li>
          <li><kbd>Enter</kbd> / <kbd>Space</kbd> - Activate item or toggle group</li>
          <li><kbd>Home</kbd> - Focus first item</li>
          <li><kbd>End</kbd> - Focus last item</li>
          <li><kbd>Tab</kbd> - Move to next focusable element</li>
        </ul>
      </div>

      <!-- ========================================= -->
      <!-- BASIC NAV WRAPPER -->
      <!-- ========================================= -->

      <!-- Configuration-based Nav (Recommended) -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Configuration-based Nav (Recommended)</h2>
        <p style="margin-bottom: 16px; color: #424242;">
          Simply pass an array of <code>NavNodeConfig</code> items - no manual template needed!
        </p>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-nav
              [width]="260"
              [collapsible]="true"
              [defaultState]="'expanded'"
              [items]="configItems()"
              (stateChange)="onStateChange($event)"
              (hamburgerClick)="onHamburgerClick()"
            />
          </div>
        </div>
      </div>

      <!-- Collapsible Nav Demo -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Collapsible Nav Demo (Click Hamburger to Toggle)</h2>
        <p style="margin-bottom: 16px; color: #424242;">
          In collapsed state, only icons and selection indicators are visible. Text labels are
          hidden.
        </p>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-nav
              [width]="260"
              [collapsedWidth]="56"
              [collapsible]="true"
              [defaultState]="'collapsed'"
              [items]="configItems()"
              (stateChange)="onStateChange($event)"
              (hamburgerClick)="onHamburgerClick()"
            />
          </div>
        </div>
      </div>

      <!-- Expanded Nav -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Nav (Expanded by Default)</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-nav [width]="260" [collapsible]="true" [defaultState]="'expanded'">
              <div style="padding: 20px; text-align: center; color: #0F6CBD;">
                <p style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">
                  Expanded Navigation
                </p>
                <p style="font-size: 12px; opacity: 0.8;">This nav starts in expanded state.</p>
              </div>
            </app-nav>
          </div>
        </div>
      </div>

      <!-- Non-Collapsible Nav -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Non-Collapsible Nav</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-nav [width]="260" [collapsible]="false">
              <div style="padding: 20px; text-align: center; color: #0F6CBD;">
                <p style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">
                  Fixed Navigation
                </p>
                <p style="font-size: 12px; opacity: 0.8;">This nav cannot be collapsed.</p>
              </div>
            </app-nav>
          </div>
        </div>
      </div>

      <!-- Width Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Width Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Compact (220px)</h3>
            <app-nav [width]="220" [collapsible]="true" [defaultState]="'expanded'">
              <div style="padding: 16px; text-align: center; color: #0F6CBD; font-size: 12px;">
                Compact Nav
              </div>
            </app-nav>
          </div>
          <div class="showcase__item">
            <h3>Standard (260px)</h3>
            <app-nav [width]="260" [collapsible]="true" [defaultState]="'expanded'">
              <div style="padding: 16px; text-align: center; color: #0F6CBD; font-size: 12px;">
                Standard Nav
              </div>
            </app-nav>
          </div>
          <div class="showcase__item">
            <h3>Wide (320px)</h3>
            <app-nav [width]="320" [collapsible]="true" [defaultState]="'expanded'">
              <div style="padding: 16px; text-align: center; color: #0F6CBD; font-size: 12px;">
                Wide Nav
              </div>
            </app-nav>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- NAV WITH NODES -->
      <!-- ========================================= -->

      <!-- Complete Navigation Example -->
      <!-- <div class="showcase__section">
        <h2 class="showcase__section__title">Complete Navigation Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-nav [width]="260" [collapsible]="true" [defaultState]="'expanded'">
              <app-nav-app-item
                [name]="'My Application'"
                [icon]="'home'"
                [size]="'medium'"
                (click)="onAppItemClick()"
              ></app-nav-app-item>

              <app-nav-node
                [label]="'Dashboard'"
                [selected]="selectedNode() === 'Dashboard'"
                (click)="onNodeClick('Dashboard')"
              ></app-nav-node>

              <app-nav-node [label]="'Projects'" [group]="true" [defaultOpen]="false">
                <app-nav-sub-item
                  [label]="'Project Alpha'"
                  [selected]="selectedNode() === 'Project Alpha'"
                  (click)="onSubItemClick('Project Alpha')"
                ></app-nav-sub-item>
                <app-nav-sub-item
                  [label]="'Project Beta'"
                  [selected]="selectedNode() === 'Project Beta'"
                  (click)="onSubItemClick('Project Beta')"
                ></app-nav-sub-item>
                <app-nav-sub-item
                  [label]="'Project Gamma'"
                  [selected]="selectedNode() === 'Project Gamma'"
                  (click)="onSubItemClick('Project Gamma')"
                ></app-nav-sub-item>
              </app-nav-node>

              <app-nav-node [label]="'Documents'" [group]="true" [defaultOpen]="true">
                <app-nav-sub-item
                  [label]="'Personal'"
                  [selected]="selectedNode() === 'Personal'"
                  (click)="onSubItemClick('Personal')"
                ></app-nav-sub-item>
                <app-nav-sub-item
                  [label]="'Work'"
                  [selected]="selectedNode() === 'Work'"
                  (click)="onSubItemClick('Work')"
                ></app-nav-sub-item>
                <app-nav-sub-item
                  [label]="'Archive'"
                  [selected]="selectedNode() === 'Archive'"
                  (click)="onSubItemClick('Archive')"
                ></app-nav-sub-item>
              </app-nav-node>

              <app-nav-node
                [label]="'Reports'"
                [selected]="selectedNode() === 'Reports'"
                (click)="onNodeClick('Reports')"
              ></app-nav-node>

              <app-nav-node
                [label]="'Analytics'"
                [selected]="selectedNode() === 'Analytics'"
                (click)="onNodeClick('Analytics')"
              ></app-nav-node>

              <app-nav-section-header [label]="'Administration'"></app-nav-section-header>

              <app-nav-node
                [label]="'Settings'"
                [selected]="selectedNode() === 'Settings'"
                (click)="onNodeClick('Settings')"
              ></app-nav-node>

              <app-nav-node [label]="'Users'" [group]="true" [defaultOpen]="false">
                <app-nav-sub-item
                  [label]="'Active Users'"
                  [selected]="selectedNode() === 'Active Users'"
                  (click)="onSubItemClick('Active Users')"
                ></app-nav-sub-item>
                <app-nav-sub-item
                  [label]="'Pending'"
                  [selected]="selectedNode() === 'Pending'"
                  (click)="onSubItemClick('Pending')"
                ></app-nav-sub-item>
              </app-nav-node>

              <app-nav-node
                [label]="'Logs'"
                [selected]="selectedNode() === 'Logs'"
                (click)="onNodeClick('Logs')"
              ></app-nav-node>

              <app-nav-divider></app-nav-divider>

              <app-nav-node
                [label]="'Help'"
                [selected]="selectedNode() === 'Help'"
                (click)="onNodeClick('Help')"
              ></app-nav-node>

              <app-nav-node
                [label]="'Feedback'"
                [selected]="selectedNode() === 'Feedback'"
                (click)="onNodeClick('Feedback')"
              ></app-nav-node>
            </app-nav>
          </div>
        </div>
      </div> -->

      <!-- ========================================= -->
      <!-- INDIVIDUAL COMPONENTS -->
      <!-- ========================================= -->

      <!-- Nav App Item -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Nav App Item</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <div
              style="background: #F5F5F5; padding: 12px; border-radius: 6px; display: inline-block;"
            >
              <app-nav-app-item
                [name]="'Application Name'"
                (click)="onAppItemClick()"
              ></app-nav-app-item>
            </div>
          </div>
        </div>
      </div>

      <!-- Nav App Item Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Nav App Item Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Small</h3>
            <div
              style="background: #F5F5F5; padding: 12px; border-radius: 6px; display: inline-block;"
            >
              <app-nav-app-item
                [name]="'Small App'"
                [size]="'small'"
                (click)="onAppItemClick()"
              ></app-nav-app-item>
            </div>
          </div>
          <div class="showcase__item">
            <h3>Medium (Default)</h3>
            <div
              style="background: #F5F5F5; padding: 12px; border-radius: 6px; display: inline-block;"
            >
              <app-nav-app-item
                [name]="'Medium App'"
                [size]="'medium'"
                (click)="onAppItemClick()"
              ></app-nav-app-item>
            </div>
          </div>
          <div class="showcase__item">
            <h3>Large</h3>
            <div
              style="background: #F5F5F5; padding: 12px; border-radius: 6px; display: inline-block;"
            >
              <app-nav-app-item
                [name]="'Large App'"
                [size]="'large'"
                (click)="onAppItemClick()"
              ></app-nav-app-item>
            </div>
          </div>
        </div>
      </div>

      <!-- Nav Node States -->
      <!-- <div class="showcase__section">
        <h2 class="showcase__section__title">Nav Node States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Regular Node</h3>
            <div style="background: #F5F5F5; padding: 12px; border-radius: 6px;">
              <app-nav-node
                [label]="'Regular Node'"
                [selected]="false"
                (click)="onNodeClick('Regular Node')"
              ></app-nav-node>
            </div>
          </div>
          <div class="showcase__item">
            <h3>Selected Node</h3>
            <div style="background: #F5F5F5; padding: 12px; border-radius: 6px;">
              <app-nav-node
                [label]="'Selected Node'"
                [selected]="true"
                (click)="onNodeClick('Selected Node')"
              ></app-nav-node>
            </div>
          </div>
          <div class="showcase__item">
            <h3>Disabled Node</h3>
            <div style="background: #F5F5F5; padding: 12px; border-radius: 6px;">
              <app-nav-node
                [label]="'Disabled Node'"
                [disabled]="true"
                (click)="onNodeClick('Disabled Node')"
              ></app-nav-node>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Nav Node Sizes -->
      <!-- <div class="showcase__section">
        <h2 class="showcase__section__title">Nav Node Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Small</h3>
            <div style="background: #F5F5F5; padding: 12px; border-radius: 6px;">
              <app-nav-node
                [label]="'Small Node'"
                [size]="'small'"
                (click)="onNodeClick('Small Node')"
              ></app-nav-node>
            </div>
          </div>
          <div class="showcase__item">
            <h3>Medium (Default)</h3>
            <div style="background: #F5F5F5; padding: 12px; border-radius: 6px;">
              <app-nav-node
                [label]="'Medium Node'"
                [size]="'medium'"
                (click)="onNodeClick('Medium Node')"
              ></app-nav-node>
            </div>
          </div>
          <div class="showcase__item">
            <h3>Large</h3>
            <div style="background: #F5F5F5; padding: 12px; border-radius: 6px;">
              <app-nav-node
                [label]="'Large Node'"
                [size]="'large'"
                (click)="onNodeClick('Large Node')"
              ></app-nav-node>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Nav Node with Children (Group) -->
      <!-- <div class="showcase__section">
        <h2 class="showcase__section__title">Nav Node with Children (Group)</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Collapsed Group</h3>
            <div style="background: #F5F5F5; padding: 12px; border-radius: 6px;">
              <app-nav-node [label]="'Collapsed Group'" [group]="true" [defaultOpen]="false">
                <app-nav-sub-item
                  [label]="'Sub Item 1'"
                  (click)="onSubItemClick('Sub Item 1')"
                ></app-nav-sub-item>
                <app-nav-sub-item
                  [label]="'Sub Item 2'"
                  (click)="onSubItemClick('Sub Item 2')"
                ></app-nav-sub-item>
                <app-nav-sub-item
                  [label]="'Sub Item 3'"
                  (click)="onSubItemClick('Sub Item 3')"
                ></app-nav-sub-item>
              </app-nav-node>
            </div>
          </div>
          <div class="showcase__item">
            <h3>Expanded Group</h3>
            <div style="background: #F5F5F5; padding: 12px; border-radius: 6px;">
              <app-nav-node [label]="'Expanded Group'" [group]="true" [defaultOpen]="true">
                <app-nav-sub-item
                  [label]="'Sub Item 1'"
                  (click)="onSubItemClick('Sub Item 1')"
                ></app-nav-sub-item>
                <app-nav-sub-item
                  [label]="'Sub Item 2'"
                  [selected]="true"
                  (click)="onSubItemClick('Sub Item 2')"
                ></app-nav-sub-item>
                <app-nav-sub-item
                  [label]="'Sub Item 3'"
                  (click)="onSubItemClick('Sub Item 3')"
                ></app-nav-sub-item>
              </app-nav-node>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Nav Sub Items -->
      <!-- <div class="showcase__section">
        <h2 class="showcase__section__title">Nav Sub Item States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Regular Sub Item</h3>
            <div style="background: #F5F5F5; padding: 12px; border-radius: 6px;">
              <app-nav-sub-item
                [label]="'Regular Sub Item'"
                [selected]="false"
                (click)="onSubItemClick('Regular Sub Item')"
              ></app-nav-sub-item>
            </div>
          </div>
          <div class="showcase__item">
            <h3>Selected Sub Item</h3>
            <div style="background: #F5F5F5; padding: 12px; border-radius: 6px;">
              <app-nav-sub-item
                [label]="'Selected Sub Item'"
                [selected]="true"
                (click)="onSubItemClick('Selected Sub Item')"
              ></app-nav-sub-item>
            </div>
          </div>
          <div class="showcase__item">
            <h3>Disabled Sub Item</h3>
            <div style="background: #F5F5F5; padding: 12px; border-radius: 6px;">
              <app-nav-sub-item
                [label]="'Disabled Sub Item'"
                [disabled]="true"
                (click)="onSubItemClick('Disabled Sub Item')"
              ></app-nav-sub-item>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Nav Sub Items with Mock Icons -->
      <!-- <div class="showcase__section">
        <h2 class="showcase__section__title">Nav Sub Item with Mock Icons</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Regular (with folder icon)</h3>
            <div style="background: #F5F5F5; padding: 12px; border-radius: 6px;">
              <app-nav-sub-item
                [label]="'Document.pdf'"
                [selected]="false"
                (click)="onSubItemClick('Document.pdf')"
              ></app-nav-sub-item>
            </div>
          </div>
          <div class="showcase__item">
            <h3>Selected (filled icon)</h3>
            <div style="background: #F5F5F5; padding: 12px; border-radius: 6px;">
              <app-nav-sub-item
                [label]="'Report.xlsx'"
                [selected]="true"
                (click)="onSubItemClick('Report.xlsx')"
              ></app-nav-sub-item>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Nav Sub Items Size Variants -->
      <!-- <div class="showcase__section">
        <h2 class="showcase__section__title">Nav Sub Item Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Small</h3>
            <div style="background: #F5F5F5; padding: 12px; border-radius: 6px;">
              <app-nav-sub-item
                [label]="'Small Sub Item'"
                [size]="'small'"
                (click)="onSubItemClick('Small Sub Item')"
              ></app-nav-sub-item>
            </div>
          </div>
          <div class="showcase__item">
            <h3>Medium (Default)</h3>
            <div style="background: #F5F5F5; padding: 12px; border-radius: 6px;">
              <app-nav-sub-item
                [label]="'Medium Sub Item'"
                [size]="'medium'"
                (click)="onSubItemClick('Medium Sub Item')"
              ></app-nav-sub-item>
            </div>
          </div>
          <div class="showcase__item">
            <h3>Large</h3>
            <div style="background: #F5F5F5; padding: 12px; border-radius: 6px;">
              <app-nav-sub-item
                [label]="'Large Sub Item'"
                [size]="'large'"
                (click)="onSubItemClick('Large Sub Item')"
              ></app-nav-sub-item>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Nav Section Header -->
      <!-- <div class="showcase__section">
        <h2 class="showcase__section__title">Nav Section Header</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <div style="background: #F5F5F5; padding: 12px; border-radius: 6px;">
              <app-nav-section-header [label]="'Section Header'"></app-nav-section-header>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Nav Divider -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Nav Divider</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <div style="background: #F5F5F5; padding: 12px; border-radius: 6px;">
              <app-nav-divider></app-nav-divider>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- PRACTICAL EXAMPLES -->
      <!-- ========================================= -->

      <!-- File Explorer Example -->
      <!-- <div class="showcase__section">
        <h2 class="showcase__section__title">Practical Example: File Explorer</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-nav [width]="280" [collapsible]="true" [defaultState]="'expanded'">
              <app-nav-app-item [name]="'File Explorer'"></app-nav-app-item>

              <app-nav-node [label]="'Documents'" [group]="true" [defaultOpen]="true">
                <app-nav-sub-item [label]="'Resume.docx'"></app-nav-sub-item>
                <app-nav-sub-item [label]="'Cover Letter.pdf'"></app-nav-sub-item>
              </app-nav-node>

              <app-nav-node [label]="'Downloads'" [group]="true" [defaultOpen]="false">
                <app-nav-sub-item [label]="'installer.exe'"></app-nav-sub-item>
                <app-nav-sub-item [label]="'archive.zip'"></app-nav-sub-item>
              </app-nav-node>

              <app-nav-node [label]="'Pictures'" [group]="true" [defaultOpen]="false">
                <app-nav-sub-item [label]="'vacation.jpg'"></app-nav-sub-item>
                <app-nav-sub-item [label]="'family.png'"></app-nav-sub-item>
              </app-nav-node>

              <app-nav-node [label]="'Music'"></app-nav-node>
            </app-nav>
          </div>
        </div>
      </div> -->

      <!-- Dashboard Example -->
      <!-- <div class="showcase__section">
        <h2 class="showcase__section__title">Practical Example: Dashboard Navigation</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-nav [width]="260" [collapsible]="true" [defaultState]="'expanded'">
              <app-nav-app-item [name]="'Admin Dashboard'"></app-nav-app-item>

              <app-nav-node [label]="'Home'" [selected]="true"></app-nav-node>

              <app-nav-section-header [label]="'Data'"></app-nav-section-header>

              <app-nav-node [label]="'Analytics'" [group]="true" [defaultOpen]="true">
                <app-nav-sub-item [label]="'Overview'"></app-nav-sub-item>
                <app-nav-sub-item [label]="'Reports'"></app-nav-sub-item>
                <app-nav-sub-item [label]="'Charts'"></app-nav-sub-item>
              </app-nav-node>

              <app-nav-node [label]="'Users'"></app-nav-node>

              <app-nav-section-header [label]="'Settings'"></app-nav-section-header>

              <app-nav-node [label]="'Profile'"></app-nav-node>
              <app-nav-node [label]="'Preferences'"></app-nav-node>

              <app-nav-divider></app-nav-divider>

              <app-nav-node [label]="'Logout'"></app-nav-node>
            </app-nav>
          </div>
        </div>
      </div> -->

      <!-- ========================================= -->
      <!-- EVENT LOGGING -->
      <!-- ========================================= -->

      <!-- Event Logging -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Event Logging</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <p><strong>Last Event:</strong> {{ lastEvent() }}</p>
            <p><strong>Selected Node:</strong> {{ selectedNode() }}</p>
            <p><strong>Nav State:</strong> {{ lastState() || 'N/A' }}</p>
            <p><strong>Hamburger Clicks:</strong> {{ hamburgerClickCount() }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class NavShowcaseComponent {
  lastState = signal<NavState | null>(null);
  hamburgerClickCount = signal<number>(0);
  lastEvent = signal<string>('None');
  selectedNode = signal<string>('Dashboard');

  // Example configuration-based items
  configItems = signal<NavNodeConfig[]>([
    {
      id: 'home',
      label: 'Home',
      selected: true,
      onClick: () => this.onNodeClick('Home'),
    },
    {
      id: 'projects',
      label: 'Projects',
      open: true,
      children: [
        {
          id: 'project-a',
          label: 'Project A',
          onClick: () => this.onSubItemClick('Project A'),
        },
        {
          id: 'project-b',
          label: 'Project B',
          onClick: () => this.onSubItemClick('Project B'),
        },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      onClick: () => this.onNodeClick('Reports'),
    },
  ]);

  onStateChange(state: NavState): void {
    this.lastState.set(state);
    this.lastEvent.set(`Nav state changed to: ${state}`);
    console.log('Nav state changed to:', state);
  }

  onHamburgerClick(): void {
    this.hamburgerClickCount.update(count => count + 1);
    this.lastEvent.set(`Hamburger clicked (${this.hamburgerClickCount()} times)`);
    console.log('Hamburger clicked:', this.hamburgerClickCount());
  }

  onAppItemClick(): void {
    this.lastEvent.set('App item clicked');
    console.log('App item clicked');
  }

  onNodeClick(label: string): void {
    this.selectedNode.set(label);
    this.lastEvent.set(`Node clicked: ${label}`);
    console.log('Node clicked:', label);
  }

  onSubItemClick(label: string): void {
    this.selectedNode.set(label);
    this.lastEvent.set(`Sub item clicked: ${label}`);
    console.log('Sub item clicked:', label);
  }
}
