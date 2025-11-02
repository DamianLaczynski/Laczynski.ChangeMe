import { Component, signal, TemplateRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNodeComponent } from './tree-node.component';
import { TreeNode } from '../utils';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-node-showcase',
  imports: [CommonModule, TreeNodeComponent, ButtonComponent],
  template: `
    <div class="showcase">
      <h1 class="showcase__title">Node Component</h1>
      <p class="showcase__description">
        Uniwersalny, w pełni konfigurowalny komponent do wyświetlania hierarchicznych struktur
        danych. Może być używany do nawigacji, drzew, list i wielu innych przypadków użycia.
      </p>

      <!-- Section: Podstawowa konfiguracja -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Podstawowa konfiguracja</h2>

        <div class="showcase__example">
          <h3>Prosty element (div)</h3>
          <div style="max-width: 400px;">
            <app-tree-node
              [node]="simpleNode()"
              [size]="'medium'"
              (nodeClick)="onNodeClick($event)"
            />
          </div>
          <div class="showcase__info">
            Podstawowy node renderowany jako <code>div</code>, bez chevrona.
          </div>
        </div>

        <div class="showcase__example">
          <h3>Element jako przycisk</h3>
          <div style="max-width: 400px;">
            <app-tree-node
              [node]="simpleNode()"
              [size]="'medium'"
              [asButton]="true"
              (nodeClick)="onNodeClick($event)"
            />
          </div>
          <div class="showcase__info">
            Node renderowany jako <code>button</code> dla lepszej dostępności.
          </div>
        </div>
      </section>

      <!-- Section: Chevron Configuration -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Konfiguracja Chevrona</h2>

        <div class="showcase__example">
          <h3>Chevron po lewej (before)</h3>
          <div style="max-width: 400px;">
            <app-tree-node
              [node]="branchNode()"
              [showChevron]="true"
              [chevronPosition]="'before'"
              (nodeClick)="onNodeClick($event)"
              (nodeToggle)="onNodeToggle($event)"
            />
          </div>
        </div>

        <div class="showcase__example">
          <h3>Chevron po prawej (after)</h3>
          <div style="max-width: 400px;">
            <app-tree-node
              [node]="branchNode()"
              [showChevron]="true"
              [chevronPosition]="'after'"
              (nodeClick)="onNodeClick($event)"
              (nodeToggle)="onNodeToggle($event)"
            />
          </div>
        </div>

        <div class="showcase__example">
          <h3>Własne ikony chevrona</h3>
          <div style="max-width: 400px;">
            <app-tree-node
              [node]="branchNode()"
              [showChevron]="true"
              [chevronPosition]="'after'"
              [chevronIconCollapsed]="'chevron_down'"
              [chevronIconExpanded]="'chevron_up'"
              (nodeClick)="onNodeClick($event)"
              (nodeToggle)="onNodeToggle($event)"
            />
          </div>
          <div class="showcase__info">
            Możliwość ustawienia własnych ikon dla stanów collapsed/expanded.
          </div>
        </div>

        <div class="showcase__example">
          <h3>Bez chevrona</h3>
          <div style="max-width: 400px;">
            <app-tree-node
              [node]="branchNode()"
              [showChevron]="false"
              (nodeClick)="onNodeClick($event)"
              (nodeToggle)="onNodeToggle($event)"
            />
          </div>
        </div>
      </section>

      <!-- Section: Selection Indicator -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Selection Indicator</h2>

        <div class="showcase__example">
          <h3>Z wskaźnikiem zaznaczenia</h3>
          <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
            <app-tree-node
              [node]="selectedNode()"
              [showSelectionIndicator]="true"
              [asButton]="true"
              (nodeClick)="onNodeClick($event)"
            />
            <app-tree-node
              [node]="unselectedNode()"
              [showSelectionIndicator]="true"
              [asButton]="true"
              (nodeClick)="onNodeClick($event)"
            />
          </div>
          <div class="showcase__info">Wskaźnik po lewej stronie pokazuje zaznaczony element.</div>
        </div>
      </section>

      <!-- Section: Behavior Configuration -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Konfiguracja zachowania</h2>

        <div class="showcase__example">
          <h3>Expand on Click</h3>
          <div style="max-width: 400px;">
            <app-tree-node
              [node]="branchNodeWithChildren()"
              [showChevron]="true"
              [chevronPosition]="'after'"
              [expandOnClick]="true"
              [selectOnClick]="false"
              (nodeClick)="onNodeClick($event)"
              (nodeToggle)="onNodeToggle($event)"
            />
          </div>
          <div class="showcase__info">
            Kliknięcie w element rozwija/zwija węzeł. Idealne dla grup nawigacji.
          </div>
        </div>

        <div class="showcase__example">
          <h3>Select on Click (default)</h3>
          <div style="max-width: 400px;">
            <app-tree-node
              [node]="branchNodeWithChildren()"
              [showChevron]="true"
              [chevronPosition]="'before'"
              [expandOnClick]="false"
              [selectOnClick]="true"
              (nodeClick)="onNodeClick($event)"
              (nodeSelect)="onNodeSelect($event)"
            />
          </div>
          <div class="showcase__info">
            Kliknięcie w element emituje <code>nodeSelect</code>. Chevron służy do rozwijania.
          </div>
        </div>
      </section>

      <!-- Section: Quick Actions -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Quick Actions</h2>

        <div class="showcase__example">
          <h3>Z szybkimi akcjami</h3>
          <div style="max-width: 400px;">
            <app-tree-node
              [node]="{ id: 'with-actions', label: 'Hover Me', icon: 'document' }"
              [showQuickActions]="true"
              [quickActionsTemplate]="quickActionsTemplate() || null"
              (nodeClick)="onNodeClick($event)"
            />
          </div>
          <div class="showcase__info">Najedź myszką, aby zobaczyć przyciski akcji.</div>
        </div>
      </section>

      <!-- Section: Rozmiary -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Rozmiary</h2>

        <div class="showcase__grid">
          <div class="showcase__item">
            <label>Small</label>
            <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
              <app-tree-node
                [node]="{ id: 'small', label: 'Small Size', icon: 'home' }"
                [size]="'small'"
                [asButton]="true"
                (nodeClick)="onNodeClick($event)"
              />
            </div>
          </div>

          <div class="showcase__item">
            <label>Medium (Default)</label>
            <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
              <app-tree-node
                [node]="{ id: 'medium', label: 'Medium Size', icon: 'home' }"
                [size]="'medium'"
                [asButton]="true"
                (nodeClick)="onNodeClick($event)"
              />
            </div>
          </div>

          <div class="showcase__item">
            <label>Large</label>
            <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
              <app-tree-node
                [node]="{ id: 'large', label: 'Large Size', icon: 'home' }"
                [size]="'large'"
                [asButton]="true"
                (nodeClick)="onNodeClick($event)"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Use Cases -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Przykłady użycia</h2>

        <div class="showcase__example">
          <h3>Nawigacja boczna (Side Navigation)</h3>
          <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
            <app-tree-node
              [node]="navExample().nodes[0]"
              [asButton]="true"
              [showSelectionIndicator]="true"
              [showChevron]="false"
              (nodeClick)="onNodeClick($event)"
            />
            <app-tree-node
              [node]="navExample().nodes[1]"
              [asButton]="true"
              [showSelectionIndicator]="true"
              [showChevron]="true"
              [chevronPosition]="'after'"
              [expandOnClick]="true"
              (nodeClick)="onNodeClick($event)"
              (nodeToggle)="onNodeToggle($event)"
            />
            <app-tree-node
              [node]="navExample().nodes[2]"
              [asButton]="true"
              [showSelectionIndicator]="true"
              [showChevron]="false"
              (nodeClick)="onNodeClick($event)"
            />
          </div>
          <div class="showcase__info">
            Konfiguracja dla nawigacji: <code>asButton</code>, <code>showSelectionIndicator</code>,
            chevron po prawej dla grup.
          </div>
        </div>

        <div class="showcase__example">
          <h3>Drzewo plików (File Tree)</h3>
          <div style="max-width: 400px;">
            <app-tree-node
              [node]="treeExample()"
              [showChevron]="true"
              [chevronPosition]="'before'"
              [expandOnClick]="false"
              [selectOnClick]="true"
              [showQuickActions]="true"
              [quickActionsTemplate]="quickActionsTemplate() || null"
              (nodeClick)="onNodeClick($event)"
              (nodeToggle)="onNodeToggle($event)"
              (nodeSelect)="onNodeSelect($event)"
            />
          </div>
          <div class="showcase__info">
            Konfiguracja dla drzewa: chevron po lewej, <code>selectOnClick</code>, quick actions.
          </div>
        </div>
      </section>

      <!-- Section: States -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Stany</h2>

        <div class="showcase__grid">
          <div class="showcase__item">
            <label>Normal</label>
            <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
              <app-tree-node
                [node]="{ id: 'normal', label: 'Normal State', icon: 'home' }"
                [asButton]="true"
                (nodeClick)="onNodeClick($event)"
              />
            </div>
          </div>

          <div class="showcase__item">
            <label>Selected</label>
            <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
              <app-tree-node
                [node]="{ id: 'selected', label: 'Selected State', icon: 'home', selected: true }"
                [asButton]="true"
                [showSelectionIndicator]="true"
                (nodeClick)="onNodeClick($event)"
              />
            </div>
          </div>

          <div class="showcase__item">
            <label>Disabled</label>
            <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
              <app-tree-node
                [node]="{ id: 'disabled', label: 'Disabled State', icon: 'home', disabled: true }"
                [asButton]="true"
                (nodeClick)="onNodeClick($event)"
              />
            </div>
          </div>

          <div class="showcase__item">
            <label>Expanded</label>
            <div style="max-width: 300px;">
              <app-tree-node
                [node]="{
                  id: 'expanded',
                  label: 'Expanded State',
                  icon: 'folder',
                  expanded: true,
                  hasChildren: true,
                  children: [
                    { id: 'child1', label: 'Child 1', icon: 'document' },
                    { id: 'child2', label: 'Child 2', icon: 'document' },
                  ],
                }"
                [showChevron]="true"
                (nodeClick)="onNodeClick($event)"
                (nodeToggle)="onNodeToggle($event)"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Section: API -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">API Reference</h2>

        <div class="showcase__info-grid">
          <div>
            <strong>Inputs - Data:</strong>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li><code>node: TreeNode</code> - Dane węzła (wymagane)</li>
              <li><code>size: Size</code> - Rozmiar ('small' | 'medium' | 'large')</li>
            </ul>

            <strong>Inputs - Visual:</strong>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li><code>showSelectionIndicator: boolean</code> - Wskaźnik zaznaczenia</li>
              <li><code>showChevron: boolean</code> - Czy pokazywać chevron</li>
              <li><code>chevronPosition: ChevronPosition</code> - Pozycja chevrona</li>
              <li><code>chevronIconCollapsed: string</code> - Ikona collapsed</li>
              <li><code>chevronIconExpanded: string</code> - Ikona expanded</li>
            </ul>

            <strong>Inputs - Behavior:</strong>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li><code>asButton: boolean</code> - Renderuj jako button</li>
              <li><code>expandOnClick: boolean</code> - Rozwijaj przy kliknięciu</li>
              <li><code>selectOnClick: boolean</code> - Zaznaczaj przy kliknięciu</li>
            </ul>

            <strong>Inputs - Quick Actions:</strong>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li><code>showQuickActions: boolean</code> - Pokaż quick actions</li>
              <li><code>quickActionsTemplate: TemplateRef</code> - Template akcji</li>
            </ul>
          </div>
          <div>
            <strong>Outputs:</strong>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li><code>(nodeClick)</code> - Kliknięcie węzła</li>
              <li><code>(nodeToggle)</code> - Rozwinięcie/zwinięcie</li>
              <li><code>(nodeSelect)</code> - Wybór węzła</li>
              <li><code>(keyNavigation)</code> - Nawigacja klawiaturą</li>
            </ul>

            <strong>Features:</strong>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li>Pełna obsługa klawiatury (Arrow keys, Home, End, *)</li>
              <li>Stany: focus, hover, selected, disabled</li>
              <li>Rekursywne renderowanie dzieci</li>
              <li>Accessibility (ARIA attributes, tabindex, role)</li>
              <li>Konfigurowalne ikony i zachowanie</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Section: Status Log -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Event Log</h2>
        <div class="showcase__status">
          <p><strong>Last Event:</strong> {{ lastEvent() }}</p>
          <p><strong>Clicked Node:</strong> {{ lastClickedNode() }}</p>
          <p><strong>Toggled Node:</strong> {{ lastToggledNode() }}</p>
        </div>
      </section>
    </div>

    <!-- Quick Actions Template -->
    <ng-template #quickActions let-node>
      <app-button
        [variant]="'subtle'"
        [size]="'small'"
        [icon]="'edit'"
        (click)="onQuickAction('edit', node)"
        aria-label="Edit"
      />
      <app-button
        [variant]="'subtle'"
        [size]="'small'"
        [icon]="'delete'"
        (click)="onQuickAction('delete', node)"
        aria-label="Delete"
      />
    </ng-template>
  `,
  styles: [
    `
      .showcase {
        padding: 24px;
        max-width: 1400px;
        margin: 0 auto;
      }

      .showcase__title {
        font-size: 32px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #201f1e;
      }

      .showcase__description {
        font-size: 16px;
        color: #605e5c;
        margin-bottom: 32px;
        line-height: 1.6;
      }

      .showcase__section {
        margin-bottom: 48px;
      }

      .showcase__section__title {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 24px;
        color: #323130;
        border-bottom: 2px solid #edebe9;
        padding-bottom: 8px;
      }

      .showcase__example {
        margin-bottom: 32px;
      }

      .showcase__example h3 {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #323130;
      }

      .showcase__info {
        margin-top: 12px;
        padding: 12px;
        background: #f3f2f1;
        border-radius: 4px;
        font-size: 14px;
        color: #605e5c;
        line-height: 1.5;
      }

      .showcase__info code {
        background: #e1dfdd;
        padding: 2px 6px;
        border-radius: 3px;
        font-family: 'Consolas', monospace;
        font-size: 13px;
      }

      .showcase__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
        margin-bottom: 24px;
      }

      .showcase__item label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 8px;
        color: #323130;
      }

      .showcase__info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 24px;
        background: #f3f2f1;
        padding: 20px;
        border-radius: 8px;
      }

      .showcase__info-grid strong {
        display: block;
        margin-top: 16px;
        margin-bottom: 8px;
        color: #323130;
      }

      .showcase__info-grid strong:first-child {
        margin-top: 0;
      }

      .showcase__info-grid ul {
        margin: 0;
        padding-left: 20px;
      }

      .showcase__info-grid li {
        margin-bottom: 4px;
        color: #605e5c;
        font-size: 14px;
      }

      .showcase__info-grid code {
        background: #e1dfdd;
        padding: 2px 6px;
        border-radius: 3px;
        font-family: 'Consolas', monospace;
        font-size: 13px;
      }

      .showcase__status {
        background: #f3f2f1;
        padding: 16px;
        border-radius: 8px;
        font-family: 'Consolas', monospace;
        font-size: 14px;
      }

      .showcase__status p {
        margin: 8px 0;
      }

      .showcase__status strong {
        color: #323130;
      }
    `,
  ],
})
export class NodeShowcaseComponent {
  // Quick actions template
  quickActionsTemplate = viewChild<TemplateRef<any>>('quickActions');

  // Event tracking
  lastEvent = signal<string>('None');
  lastClickedNode = signal<string>('None');
  lastToggledNode = signal<string>('None');

  // Example nodes
  simpleNode = signal<TreeNode>({
    id: 'simple',
    label: 'Simple Node',
    icon: 'home',
  });

  branchNode = signal<TreeNode>({
    id: 'branch',
    label: 'Branch Node',
    icon: 'folder',
    hasChildren: true,
    expanded: false,
  });

  branchNodeWithChildren = signal<TreeNode>({
    id: 'branch-with-children',
    label: 'Parent Node',
    icon: 'folder',
    hasChildren: true,
    expanded: false,
    children: [
      { id: 'child1', label: 'Child 1', icon: 'document' },
      { id: 'child2', label: 'Child 2', icon: 'document' },
      { id: 'child3', label: 'Child 3', icon: 'document' },
    ],
  });

  selectedNode = signal<TreeNode>({
    id: 'selected',
    label: 'Selected Item',
    icon: 'home',
    selected: true,
  });

  unselectedNode = signal<TreeNode>({
    id: 'unselected',
    label: 'Unselected Item',
    icon: 'home',
    selected: false,
  });

  navExample = signal<{ nodes: TreeNode[] }>({
    nodes: [
      { id: 'nav1', label: 'Home', icon: 'home', selected: true },
      {
        id: 'nav2',
        label: 'Documents',
        icon: 'folder',
        hasChildren: true,
        expanded: false,
      },
      { id: 'nav3', label: 'Settings', icon: 'settings' },
    ],
  });

  treeExample = signal<TreeNode>({
    id: 'root',
    label: 'Project',
    icon: 'folder',
    hasChildren: true,
    expanded: true,
    children: [
      {
        id: 'src',
        label: 'src',
        icon: 'folder',
        hasChildren: true,
        expanded: false,
        children: [
          { id: 'app', label: 'app.ts', icon: 'document' },
          { id: 'main', label: 'main.ts', icon: 'document' },
        ],
      },
      { id: 'readme', label: 'README.md', icon: 'document' },
      { id: 'package', label: 'package.json', icon: 'document' },
    ],
  });

  // Event handlers
  onNodeClick(node: TreeNode): void {
    this.lastEvent.set('Click');
    this.lastClickedNode.set(`${node.label} (${node.id})`);
    console.log('Node clicked:', node);
  }

  onNodeToggle(node: TreeNode): void {
    this.lastEvent.set('Toggle');
    this.lastToggledNode.set(`${node.label} (expanded: ${node.expanded})`);
    console.log('Node toggled:', node);
  }

  onNodeSelect(node: TreeNode): void {
    this.lastEvent.set('Select');
    this.lastClickedNode.set(`${node.label} (${node.id})`);
    console.log('Node selected:', node);
  }

  onQuickAction(action: string, node: TreeNode): void {
    this.lastEvent.set(`Quick Action: ${action}`);
    this.lastClickedNode.set(`${action} on ${node.label}`);
    console.log(`Quick action: ${action}`, node);
  }
}
