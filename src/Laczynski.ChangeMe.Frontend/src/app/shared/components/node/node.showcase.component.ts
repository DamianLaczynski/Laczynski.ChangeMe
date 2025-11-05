import { Component, signal, TemplateRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeComponent, Node } from './node.component';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-node-showcase',
  imports: [CommonModule, NodeComponent, ButtonComponent, IconComponent],
  template: `
    <div class="showcase">
      <h1 class="showcase__title">Node Component</h1>
      <p class="showcase__description">
        Uniwersalny, w pełni konfigurowalny komponent do wyświetlania elementów listy, nawigacji i
        wielu innych przypadków użycia. Wspiera własne template contentu, quick actions i wiele
        wariantów wizualnych.
      </p>

      <!-- Section: Podstawowa konfiguracja -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Podstawowa konfiguracja</h2>

        <div class="showcase__example">
          <h3>Prosty element (div)</h3>
          <div style="max-width: 400px;">
            <app-node
              [node]="simpleNode()"
              [size]="'medium'"
              (nodeClick)="onNodeClick($event)"
            />
          </div>
          <div class="showcase__info">
            Podstawowy node renderowany jako <code>div</code> z ikoną i etykietą.
          </div>
        </div>

        <div class="showcase__example">
          <h3>Element jako przycisk</h3>
          <div style="max-width: 400px;">
            <app-node
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

      <!-- Section: Selection Indicator -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Selection Indicator</h2>

        <div class="showcase__example">
          <h3>Wskaźnik poziomy (horizontal)</h3>
          <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
            <app-node
              [node]="selectedNode()"
              [showSelectionIndicator]="true"
              [indicatorPosition]="'horizontal'"
              [asButton]="true"
              (nodeClick)="onNodeClick($event)"
            />
            <app-node
              [node]="unselectedNode()"
              [showSelectionIndicator]="true"
              [indicatorPosition]="'horizontal'"
              [asButton]="true"
              (nodeClick)="onNodeClick($event)"
            />
          </div>
          <div class="showcase__info">
            Poziomy wskaźnik na dole pokazuje zaznaczony element.
          </div>
        </div>

        <div class="showcase__example">
          <h3>Wskaźnik pionowy (vertical)</h3>
          <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
            <app-node
              [node]="selectedNode()"
              [showSelectionIndicator]="true"
              [indicatorPosition]="'vertical'"
              [asButton]="true"
              (nodeClick)="onNodeClick($event)"
            />
            <app-node
              [node]="unselectedNode()"
              [showSelectionIndicator]="true"
              [indicatorPosition]="'vertical'"
              [asButton]="true"
              (nodeClick)="onNodeClick($event)"
            />
          </div>
          <div class="showcase__info">
            Pionowy wskaźnik po lewej stronie pokazuje zaznaczony element.
          </div>
        </div>
      </section>

      <!-- Section: Layout Variants -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Warianty Layout</h2>

        <div class="showcase__grid">
          <div class="showcase__item">
            <label>Icon + Text (default)</label>
            <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
              <app-node
                [node]="{ id: '1', label: 'Home', icon: 'home' }"
                [asButton]="true"
                (nodeClick)="onNodeClick($event)"
              />
            </div>
          </div>

          <div class="showcase__item">
            <label>Icon Only</label>
            <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
              <app-node
                [node]="{ id: '2', label: 'Home', icon: 'home' }"
                [iconOnly]="true"
                [asButton]="true"
                (nodeClick)="onNodeClick($event)"
              />
            </div>
          </div>

          <div class="showcase__item">
            <label>Text Only</label>
            <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
              <app-node
                [node]="{ id: '3', label: 'Home', icon: 'home' }"
                [layout]="'text-only'"
                [asButton]="true"
                (nodeClick)="onNodeClick($event)"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Appearance Variants -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Warianty Appearance</h2>

        <div class="showcase__grid">
          <div class="showcase__item">
            <label>Default (bez variant)</label>
            <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
              <app-node
                [node]="{ id: 'default', label: 'Default Node', icon: 'home' }"
                [asButton]="true"
                (nodeClick)="onNodeClick($event)"
              />
            </div>
          </div>

          <div class="showcase__item">
            <label>Transparent</label>
            <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
              <app-node
                [node]="{ id: 'transparent', label: 'Transparent', icon: 'home' }"
                [variant]="'transparent'"
                [asButton]="true"
                (nodeClick)="onNodeClick($event)"
              />
            </div>
          </div>

          <div class="showcase__item">
            <label>Subtle</label>
            <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
              <app-node
                [node]="{ id: 'subtle', label: 'Subtle', icon: 'home' }"
                [variant]="'subtle'"
                [asButton]="true"
                (nodeClick)="onNodeClick($event)"
              />
            </div>
          </div>

          <div class="showcase__item">
            <label>Subtle Circular</label>
            <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
              <app-node
                [node]="{ id: 'subtle-circular', label: 'Subtle Circular', icon: 'home' }"
                [variant]="'subtle-circular'"
                [asButton]="true"
                (nodeClick)="onNodeClick($event)"
              />
            </div>
          </div>

          <div class="showcase__item">
            <label>Filled Circular</label>
            <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
              <app-node
                [node]="{ id: 'filled-circular', label: 'Filled Circular', icon: 'home' }"
                [variant]="'filled-circular'"
                [asButton]="true"
                (nodeClick)="onNodeClick($event)"
              />
            </div>
          </div>
        </div>

        <div class="showcase__example">
          <h3>Zaznaczone warianty</h3>
          <div style="max-width: 400px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
            <app-node
              [node]="{ id: 'selected-subtle', label: 'Selected Subtle', icon: 'home', selected: true }"
              [variant]="'subtle'"
              [asButton]="true"
              (nodeClick)="onNodeClick($event)"
            />
            <app-node
              [node]="{ id: 'selected-filled', label: 'Selected Filled Circular', icon: 'home', selected: true }"
              [variant]="'filled-circular'"
              [asButton]="true"
              (nodeClick)="onNodeClick($event)"
            />
          </div>
          <div class="showcase__info">
            Warianty appearance mogą być używane razem z selected state.
          </div>
        </div>
      </section>

      <!-- Section: Quick Actions -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Quick Actions</h2>

        <div class="showcase__example">
          <h3>Z szybkimi akcjami</h3>
          <div style="max-width: 400px;">
            <app-node
              [node]="{ id: 'with-actions', label: 'Hover Me', icon: 'document' }"
              [showQuickActions]="true"
              [quickActionsTemplate]="quickActionsTemplate() || null"
              (nodeClick)="onNodeClick($event)"
            />
          </div>
          <div class="showcase__info">Najedź myszką, aby zobaczyć przyciski akcji.</div>
        </div>
      </section>

      <!-- Section: Custom Content Template -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Własny Template Contentu</h2>

        <div class="showcase__example">
          <h3>Custom content z własnym template</h3>
          <div style="max-width: 400px;">
            <app-node [node]="customContentNode()" (nodeClick)="onNodeClick($event)">
              <ng-template #content let-node>
                <div style="display: flex; align-items: center; gap: 12px; width: 100%;">
                  <app-icon [icon]="node.icon" [size]="'medium'" />
                  <div style="flex: 1;">
                    <div style="font-weight: 600; color: #323130;">{{ node.label }}</div>
                    <div style="font-size: 12px; color: #605e5c;">Custom content template</div>
                  </div>
                  <span style="background: #0078d4; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">New</span>
                </div>
              </ng-template>
            </app-node>
          </div>
          <div class="showcase__info">
            Możesz całkowicie nadpisać domyślną zawartość używając <code>#content</code> template.
            Template otrzymuje node jako context.
          </div>
        </div>

        <div class="showcase__example">
          <h3>Custom content z before/after templates</h3>
          <div style="max-width: 400px;">
            <app-node [node]="customContentNode()" (nodeClick)="onNodeClick($event)">
              <ng-template #before>
                <span style="background: #0078d4; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-right: 8px;">Badge</span>
              </ng-template>
              <ng-template #after>
                <span style="color: #605e5c; font-size: 12px; margin-left: 8px;">→</span>
              </ng-template>
            </app-node>
          </div>
          <div class="showcase__info">
            Możesz również użyć <code>#before</code> i <code>#after</code> templates do dodania
            zawartości przed i po domyślnej zawartości.
          </div>
        </div>
      </section>

      <!-- Section: Rozmiary -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Rozmiary</h2>

        <div class="showcase__grid">
          <div class="showcase__item">
            <label>Small</label>
            <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
              <app-node
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
              <app-node
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
              <app-node
                [node]="{ id: 'large', label: 'Large Size', icon: 'home' }"
                [size]="'large'"
                [asButton]="true"
                (nodeClick)="onNodeClick($event)"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Behavior Configuration -->
      <section class="showcase__section">
        <h2 class="showcase__section__title">Konfiguracja zachowania</h2>

        <div class="showcase__example">
          <h3>Select on Click (default)</h3>
          <div style="max-width: 400px;">
            <app-node
              [node]="simpleNode()"
              [selectOnClick]="true"
              (nodeClick)="onNodeClick($event)"
              (nodeSelect)="onNodeSelect($event)"
            />
          </div>
          <div class="showcase__info">
            Kliknięcie w element emituje <code>nodeSelect</code> (domyślnie włączone).
          </div>
        </div>

        <div class="showcase__example">
          <h3>Bez automatycznego wyboru</h3>
          <div style="max-width: 400px;">
            <app-node
              [node]="simpleNode()"
              [selectOnClick]="false"
              (nodeClick)="onNodeClick($event)"
            />
          </div>
          <div class="showcase__info">
            Kliknięcie emituje tylko <code>nodeClick</code>, bez <code>nodeSelect</code>.
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
              <app-node
                [node]="{ id: 'normal', label: 'Normal State', icon: 'home' }"
                [asButton]="true"
                (nodeClick)="onNodeClick($event)"
              />
            </div>
          </div>

          <div class="showcase__item">
            <label>Selected</label>
            <div style="max-width: 300px; background: #F0F0F0; padding: 8px; border-radius: 8px;">
              <app-node
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
              <app-node
                [node]="{ id: 'disabled', label: 'Disabled State', icon: 'home', disabled: true }"
                [asButton]="true"
                (nodeClick)="onNodeClick($event)"
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
              <li><code>node: Node</code> - Dane węzła (wymagane)</li>
              <li><code>size: Size</code> - Rozmiar ('small' | 'medium' | 'large')</li>
            </ul>

            <strong>Inputs - Visual:</strong>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li><code>showSelectionIndicator: boolean</code> - Wskaźnik zaznaczenia</li>
              <li><code>indicatorPosition: Orientation</code> - Pozycja wskaźnika ('horizontal' | 'vertical')</li>
              <li><code>variant: Appearance</code> - Wariant wizualny</li>
              <li><code>layout: Layout</code> - Layout ('icon-only' | 'text-only')</li>
              <li><code>iconOnly: boolean</code> - Tylko ikona</li>
            </ul>

            <strong>Inputs - Behavior:</strong>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li><code>asButton: boolean</code> - Renderuj jako button</li>
              <li><code>selectOnClick: boolean</code> - Zaznaczaj przy kliknięciu (default: true)</li>
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
              <li><code>(nodeSelect)</code> - Wybór węzła</li>
            </ul>

            <strong>Content Projection:</strong>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li><code>#content</code> - Własny template głównej zawartości</li>
              <li><code>#before</code> - Template przed domyślną zawartością</li>
              <li><code>#after</code> - Template po domyślnej zawartości</li>
            </ul>

            <strong>Features:</strong>
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li>Własny template contentu</li>
              <li>Stany: focus, hover, selected, disabled</li>
              <li>Accessibility (ARIA attributes, tabindex, role)</li>
              <li>Konfigurowalne ikony i layout</li>
              <li>Quick actions na hover</li>
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
          <p><strong>Selected Node:</strong> {{ lastSelectedNode() }}</p>
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
export class NodeComponentShowcaseComponent {
  // Quick actions template
  quickActionsTemplate = viewChild<TemplateRef<any>>('quickActions');

  // Event tracking
  lastEvent = signal<string>('None');
  lastClickedNode = signal<string>('None');
  lastSelectedNode = signal<string>('None');

  // Example nodes
  simpleNode = signal<Node>({
    id: 'simple',
    label: 'Simple Node',
    icon: 'home',
  });

  selectedNode = signal<Node>({
    id: 'selected',
    label: 'Selected Item',
    icon: 'home',
    selected: true,
  });

  unselectedNode = signal<Node>({
    id: 'unselected',
    label: 'Unselected Item',
    icon: 'home',
    selected: false,
  });

  customContentNode = signal<Node>({
    id: 'custom',
    label: 'Custom Content Node',
    icon: 'star',
  });

  // Event handlers
  onNodeClick(node: Node): void {
    this.lastEvent.set('Click');
    this.lastClickedNode.set(`${node.label} (${node.id})`);
    console.log('Node clicked:', node);
  }

  onNodeSelect(node: Node): void {
    this.lastEvent.set('Select');
    this.lastSelectedNode.set(`${node.label} (${node.id})`);
    console.log('Node selected:', node);
  }

  onQuickAction(action: string, node: Node): void {
    this.lastEvent.set(`Quick Action: ${action}`);
    this.lastClickedNode.set(`${action} on ${node.label}`);
    console.log(`Quick action: ${action}`, node);
  }
}

