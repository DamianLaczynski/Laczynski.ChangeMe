import { Component, signal, viewChild, TemplateRef } from '@angular/core';
import { NodeComponent, Node } from './node.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-node-showcase',
  imports: [NodeComponent, CommonModule, ButtonComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Node Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Node component built with Fluent 2 Design System. Nodes
        support multiple sizes, layouts, appearances, selection indicators, and can be used as
        buttons or divs.
      </p>

      <!-- ========================================= -->
      <!-- BASIC NODES -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Nodes</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Basic Node with Icon</h3>
            <app-node [node]="basicNode()" />
          </div>
          <div class="showcase__item">
            <h3>Node with Text Only</h3>
            <app-node [node]="textOnlyNode()" />
          </div>
          <div class="showcase__item">
            <h3>Node with Icon Only</h3>
            <app-node [node]="iconOnlyNode()" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- SIZE VARIANTS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Small</h3>
            <app-node [node]="sizeNode()" size="small" />
          </div>
          <div class="showcase__item">
            <h3>Medium (Default)</h3>
            <app-node [node]="sizeNode()" size="medium" />
          </div>
          <div class="showcase__item">
            <h3>Large</h3>
            <app-node [node]="sizeNode()" size="large" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- APPEARANCE VARIANTS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Appearance Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Transparent (Default)</h3>
            <app-node [node]="appearanceNode()" variant="transparent" />
          </div>
          <div class="showcase__item">
            <h3>Subtle</h3>
            <app-node [node]="appearanceNode()" variant="subtle" />
          </div>
          <div class="showcase__item">
            <h3>Subtle Circular</h3>
            <app-node [node]="appearanceNode()" variant="subtle-circular" />
          </div>
          <div class="showcase__item">
            <h3>Filled Circular</h3>
            <app-node [node]="appearanceNode()" variant="filled-circular" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- SELECTION INDICATORS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Selection Indicators</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Horizontal Indicator (Selected)</h3>
            <app-node
              [node]="selectedNode()"
              [showSelectionIndicator]="true"
              indicatorPosition="horizontal"
            />
          </div>
          <div class="showcase__item">
            <h3>Horizontal Indicator (Not Selected)</h3>
            <app-node
              [node]="unselectedNode()"
              [showSelectionIndicator]="true"
              indicatorPosition="horizontal"
            />
          </div>
          <div class="showcase__item">
            <h3>Vertical Indicator (Selected)</h3>
            <app-node
              [node]="selectedNode()"
              [showSelectionIndicator]="true"
              indicatorPosition="vertical"
            />
          </div>
          <div class="showcase__item">
            <h3>Vertical Indicator (Not Selected)</h3>
            <app-node
              [node]="unselectedNode()"
              [showSelectionIndicator]="true"
              indicatorPosition="vertical"
            />
          </div>
        </div>
      </div>

      <!-- Selection Indicators -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Selection Indicators</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Horizontal Indicator</h3>
            <app-node
              [node]="selectedNode()"
              [showSelectionIndicator]="true"
              indicatorPosition="horizontal"
            />
          </div>
          <div class="showcase__item">
            <h3>Vertical Indicator</h3>
            <app-node
              [node]="selectedNode()"
              [showSelectionIndicator]="true"
              indicatorPosition="vertical"
            />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- STATES -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Normal State</h3>
            <app-node [node]="normalNode()" />
          </div>
          <div class="showcase__item">
            <h3>Selected State</h3>
            <app-node [node]="selectedNode()" />
          </div>
          <div class="showcase__item">
            <h3>Disabled State</h3>
            <app-node [node]="disabledNode()" />
          </div>
          <div class="showcase__item">
            <h3>Selected + Disabled</h3>
            <app-node [node]="selectedDisabledNode()" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- AS BUTTON -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">As Button</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>As Button (Normal)</h3>
            <app-node [node]="buttonNode()" [asButton]="true" />
          </div>
          <div class="showcase__item">
            <h3>As Button (Selected)</h3>
            <app-node [node]="selectedButtonNode()" [asButton]="true" />
          </div>
          <div class="showcase__item">
            <h3>As Button (Disabled)</h3>
            <app-node [node]="disabledButtonNode()" [asButton]="true" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- SELECT ON CLICK -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Select On Click Behavior</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Select On Click (Default: true)</h3>
            <p style="margin-bottom: 8px; font-size: 12px; color: #666;">
              Click to select - will emit both click and select events
            </p>
            <app-node
              [node]="selectableNode()"
              [selectOnClick]="true"
              (nodeClick)="onNodeClick($event)"
              (nodeSelect)="onNodeSelect($event)"
            />
            <p style="margin-top: 8px; font-size: 12px;">
              Selected: {{ selectableNode().selected ? 'Yes' : 'No' }}
            </p>
          </div>
          <div class="showcase__item">
            <h3>Select On Click (false)</h3>
            <p style="margin-bottom: 8px; font-size: 12px; color: #666;">
              Click only - will emit only click event, not select
            </p>
            <app-node
              [node]="nonSelectableNode()"
              [selectOnClick]="false"
              (nodeClick)="onNodeClick($event)"
              (nodeSelect)="onNodeSelect($event)"
            />
            <p style="margin-top: 8px; font-size: 12px;">
              Selected: {{ nonSelectableNode().selected ? 'Yes' : 'No' }}
            </p>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- QUICK ACTIONS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Quick Actions</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>With Quick Actions Template</h3>
            <app-node
              [node]="quickActionsNode()"
              [showQuickActions]="true"
              [quickActionsTemplate]="quickActionsTemplate"
            />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- CUSTOM CONTENT -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Custom Content</h2>
        <p style="margin-bottom: 16px; color: #424242;">
          You can provide a custom content template using the <code>#content</code> template
          reference. This allows you to completely customize the node's content while still
          maintaining the node's structure and behavior.
        </p>

        <!-- Basic Custom Content -->
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Basic Custom Content</h3>
            <app-node [node]="customContentNode1()">
              <ng-template #content let-node>
                <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                  <span style="font-size: 20px;">🎨</span>
                  <span style="flex: 1;">{{ node.label }}</span>
                  <span style="font-size: 12px; color: #616161;">Custom</span>
                </div>
              </ng-template>
            </app-node>
          </div>

          <div class="showcase__item">
            <h3>Custom Content with Badge</h3>
            <app-node [node]="customContentNode2()">
              <ng-template #content let-node>
                <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                  <span>{{ node.label }}</span>
                  <span
                    style="
                      background: #0F6CBD;
                      color: white;
                      padding: 2px 8px;
                      border-radius: 12px;
                      font-size: 11px;
                      font-weight: 600;
                    "
                  >
                    New
                  </span>
                </div>
              </ng-template>
            </app-node>
          </div>

          <div class="showcase__item">
            <h3>Custom Content with Status</h3>
            <app-node [node]="customContentNode3()">
              <ng-template #content let-node>
                <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                  <div
                    style="
                      width: 8px;
                      height: 8px;
                      border-radius: 50%;
                      background: #107c10;
                    "
                  ></div>
                  <span style="flex: 1;">{{ node.label }}</span>
                  <span style="font-size: 12px; color: #616161;">Online</span>
                </div>
              </ng-template>
            </app-node>
          </div>
        </div>

        <!-- Custom Content with Selection Indicator -->
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Custom Content + Selection Indicator</h3>
            <app-node
              [node]="customContentSelectedNode()"
              [showSelectionIndicator]="true"
              indicatorPosition="horizontal"
            >
              <ng-template #content let-node>
                <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                  <span style="font-size: 18px;">📁</span>
                  <span style="flex: 1; font-weight: 600;">{{ node.label }}</span>
                  <span style="font-size: 12px; color: #616161;">3 items</span>
                </div>
              </ng-template>
            </app-node>
          </div>

          <div class="showcase__item">
            <h3>Custom Content as Button</h3>
            <app-node [node]="customContentButtonNode()" [asButton]="true">
              <ng-template #content let-node>
                <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                  <span style="font-size: 18px;">⚙️</span>
                  <span style="flex: 1;">{{ node.label }}</span>
                  <span style="font-size: 14px;">→</span>
                </div>
              </ng-template>
            </app-node>
          </div>
        </div>

        <!-- Complex Custom Content -->
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Complex Custom Layout</h3>
            <app-node [node]="customContentComplexNode()">
              <ng-template #content let-node>
                <div style="display: flex; flex-direction: column; gap: 4px; width: 100%;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 18px;">📄</span>
                    <span style="flex: 1; font-weight: 600;">{{ node.label }}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                    <span style="color: #616161;">Modified: 2 hours ago</span>
                    <span style="color: #616161;">•</span>
                    <span style="color: #616161;">Size: 2.5 MB</span>
                  </div>
                </div>
              </ng-template>
            </app-node>
          </div>

          <div class="showcase__item">
            <h3>Custom Content with Actions</h3>
            <app-node [node]="customContentActionsNode()">
              <ng-template #content let-node>
                <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                  <span style="font-size: 18px;">👤</span>
                  <div style="flex: 1; display: flex; flex-direction: column; gap: 2px;">
                    <span style="font-weight: 600;">{{ node.label }}</span>
                    <span style="font-size: 12px; color: #616161;">Administrator</span>
                  </div>
                  <button
                    type="button"
                    style="
                      background: transparent;
                      border: 1px solid #d1d1d1;
                      padding: 4px 8px;
                      border-radius: 4px;
                      cursor: pointer;
                      font-size: 12px;
                    "
                    (click)="onCustomActionClick(node, 'manage'); $event.stopPropagation()"
                  >
                    Manage
                  </button>
                </div>
              </ng-template>
            </app-node>
          </div>
        </div>

        <!-- Custom Content Sizes -->
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Small Custom Content</h3>
            <app-node [node]="customContentSmallNode()" size="small">
              <ng-template #content let-node>
                <div style="display: flex; align-items: center; gap: 6px; width: 100%;">
                  <span style="font-size: 14px;">🔔</span>
                  <span style="flex: 1;">{{ node.label }}</span>
                </div>
              </ng-template>
            </app-node>
          </div>

          <div class="showcase__item">
            <h3>Medium Custom Content</h3>
            <app-node [node]="customContentMediumNode()" size="medium">
              <ng-template #content let-node>
                <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
                  <span style="font-size: 18px;">🔔</span>
                  <span style="flex: 1;">{{ node.label }}</span>
                </div>
              </ng-template>
            </app-node>
          </div>

          <div class="showcase__item">
            <h3>Large Custom Content</h3>
            <app-node [node]="customContentLargeNode()" size="large">
              <ng-template #content let-node>
                <div style="display: flex; align-items: center; gap: 10px; width: 100%;">
                  <span style="font-size: 22px;">🔔</span>
                  <span style="flex: 1;">{{ node.label }}</span>
                </div>
              </ng-template>
            </app-node>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- COMBINED EXAMPLES -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Combined Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Small + Subtle Circular</h3>
            <app-node [node]="combinedNode()" size="small" variant="subtle-circular" />
          </div>
          <div class="showcase__item">
            <h3>Large + Filled Circular</h3>
            <app-node [node]="combinedNode()" size="large" variant="filled-circular" />
          </div>
          <div class="showcase__item">
            <h3>Medium + Subtle + Selected</h3>
            <app-node
              [node]="selectedCombinedNode()"
              size="medium"
              variant="subtle"
              [showSelectionIndicator]="true"
              indicatorPosition="horizontal"
            />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- DRAG AND DROP -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Drag and Drop</h2>
        <p class="showcase__description" style="margin-bottom: 16px;">
          Nodes can be made draggable using the <code>draggable</code> input. Drag events are
          emitted for integration with drop zones. Disabled nodes cannot be dragged.
        </p>

        <!-- Basic Draggable Nodes -->
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Basic Draggable Node</h3>
            <app-node
              [node]="draggableNode1()"
              [draggable]="true"
              (dragStart)="onDragStart($event)"
              (dragEnd)="onDragEnd($event)"
            />
            <p style="margin-top: 8px; font-size: 12px; color: #666;">
              Drag this node to see the drag events
            </p>
          </div>
          <div class="showcase__item">
            <h3>Draggable with Custom Data</h3>
            <app-node
              [node]="draggableNode2()"
              [draggable]="true"
              [dragData]="{ customId: 'custom-123', type: 'document' }"
              (dragStart)="onDragStart($event)"
              (dragEnd)="onDragEnd($event)"
            />
            <p style="margin-top: 8px; font-size: 12px; color: #666;">
              Custom drag data is included in drag events
            </p>
          </div>
          <div class="showcase__item">
            <h3>Non-Draggable Node</h3>
            <app-node [node]="nonDraggableNode()" [draggable]="false" />
            <p style="margin-top: 8px; font-size: 12px; color: #666;">
              This node cannot be dragged (default behavior)
            </p>
          </div>
          <div class="showcase__item">
            <h3>Disabled Node (Not Draggable)</h3>
            <app-node [node]="disabledDraggableNode()" [draggable]="true" />
            <p style="margin-top: 8px; font-size: 12px; color: #666;">
              Disabled nodes cannot be dragged even if draggable is true
            </p>
          </div>
        </div>

        <!-- Drag and Drop Zones -->
        <div class="showcase__grid" style="margin-top: 24px;">
          <div class="showcase__item">
            <h3>Source List (Drag from here)</h3>
            <div
              style="
                border: 2px dashed #d1d1d1;
                border-radius: 8px;
                padding: 16px;
                min-height: 200px;
                background: #fafafa;
              "
            >
              @for (node of sourceNodes(); track node.id) {
                <div style="margin-bottom: 8px;">
                  <app-node
                    [node]="node"
                    [draggable]="true"
                    (dragStart)="onDragStart($event)"
                    (dragEnd)="onDragEnd($event)"
                  />
                </div>
              }
            </div>
          </div>
          <div class="showcase__item">
            <h3>Drop Zone (Drop here)</h3>
            <div
              style="
                border: 2px dashed #d1d1d1;
                border-radius: 8px;
                padding: 16px;
                min-height: 200px;
                background: #fafafa;
              "
              [class.drag-over]="isDragOver()"
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave($event)"
              (drop)="onDrop($event)"
            >
              @if (droppedNodes().length === 0) {
                <p style="text-align: center; color: #999; margin-top: 60px;">Drop nodes here</p>
              } @else {
                @for (node of droppedNodes(); track node.id) {
                  <div style="margin-bottom: 8px;">
                    <app-node [node]="node" />
                  </div>
                }
              }
            </div>
            <div style="margin-top: 8px;">
              <app-button variant="subtle" size="small" (click)="clearDroppedNodes()">
                Clear
              </app-button>
            </div>
          </div>
        </div>

        <!-- Draggable with Different Sizes -->
        <div class="showcase__grid" style="margin-top: 24px;">
          <div class="showcase__item">
            <h3>Small Draggable</h3>
            <app-node
              [node]="sizeDraggableNode()"
              size="small"
              [draggable]="true"
              (dragStart)="onDragStart($event)"
            />
          </div>
          <div class="showcase__item">
            <h3>Medium Draggable</h3>
            <app-node
              [node]="sizeDraggableNode()"
              size="medium"
              [draggable]="true"
              (dragStart)="onDragStart($event)"
            />
          </div>
          <div class="showcase__item">
            <h3>Large Draggable</h3>
            <app-node
              [node]="sizeDraggableNode()"
              size="large"
              [draggable]="true"
              (dragStart)="onDragStart($event)"
            />
          </div>
        </div>

        <!-- Draggable with Variants -->
        <div class="showcase__grid" style="margin-top: 24px;">
          <div class="showcase__item">
            <h3>Draggable Subtle</h3>
            <app-node
              [node]="variantDraggableNode()"
              variant="subtle"
              [draggable]="true"
              (dragStart)="onDragStart($event)"
            />
          </div>
          <div class="showcase__item">
            <h3>Draggable Subtle Circular</h3>
            <app-node
              [node]="variantDraggableNode()"
              variant="subtle-circular"
              [draggable]="true"
              (dragStart)="onDragStart($event)"
            />
          </div>
          <div class="showcase__item">
            <h3>Draggable Filled Circular</h3>
            <app-node
              [node]="variantDraggableNode()"
              variant="filled-circular"
              [draggable]="true"
              (dragStart)="onDragStart($event)"
            />
          </div>
        </div>

        <!-- Drag Events Log -->
        <div class="showcase__grid" style="margin-top: 24px;">
          <div class="showcase__item">
            <h3>Drag Events Log</h3>
            <div
              style="
                background: #f5f5f5;
                border: 1px solid #d1d1d1;
                border-radius: 4px;
                padding: 12px;
                max-height: 200px;
                overflow-y: auto;
                font-size: 12px;
                font-family: monospace;
              "
            >
              @if (dragEvents().length === 0) {
                <p style="color: #999; margin: 0;">No drag events yet...</p>
              } @else {
                @for (event of dragEvents(); track $index) {
                  <div
                    style="margin-bottom: 4px; padding: 4px; background: white; border-radius: 2px;"
                  >
                    <strong>{{ event.type }}:</strong> {{ event.message }}
                  </div>
                }
              }
            </div>
            <div style="margin-top: 8px;">
              <app-button variant="subtle" size="small" (click)="clearDragEvents()">
                Clear Log
              </app-button>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- EVENT LOGGING -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Event Logging</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <p><strong>Last Click Event:</strong> {{ lastClickEvent() }}</p>
            <p><strong>Last Select Event:</strong> {{ lastSelectEvent() }}</p>
            <p><strong>Click Count:</strong> {{ clickCount() }}</p>
            <p><strong>Select Count:</strong> {{ selectCount() }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions Template -->
      <ng-template #quickActionsTemplate let-node>
        <app-button
          variant="subtle"
          size="small"
          [iconOnly]="true"
          icon="edit"
          (click)="onQuickActionClick(node, 'edit'); $event.stopPropagation()"
        ></app-button>
        <app-button
          variant="subtle"
          size="small"
          [iconOnly]="true"
          icon="delete"
          (click)="onQuickActionClick(node, 'delete'); $event.stopPropagation()"
        ></app-button>
      </ng-template>
    </div>
  `,
})
export class NodeShowcaseComponent {
  quickActionsTemplate = viewChild<TemplateRef<any>>('quickActionsTemplate');

  lastClickEvent = signal<string>('None');
  lastSelectEvent = signal<string>('None');
  clickCount = signal<number>(0);
  selectCount = signal<number>(0);

  // Basic nodes
  basicNode = signal<Node>({
    id: 'basic',
    label: 'Home',
    icon: 'home',
  });

  textOnlyNode = signal<Node>({
    id: 'text-only',
    label: 'Text Only Node',
  });

  iconOnlyNode = signal<Node>({
    id: 'icon-only',
    label: 'Settings',
    icon: 'settings',
  });

  // Size nodes
  sizeNode = signal<Node>({
    id: 'size',
    label: 'Size Variant',
    icon: 'home',
  });

  // Layout nodes
  layoutNode = signal<Node>({
    id: 'layout',
    label: 'Layout Variant',
    icon: 'home',
  });

  // Appearance nodes
  appearanceNode = signal<Node>({
    id: 'appearance',
    label: 'Appearance Variant',
    icon: 'home',
  });

  // Selection nodes
  selectedNode = signal<Node>({
    id: 'selected',
    label: 'Selected Node',
    icon: 'home',
    selected: true,
  });

  unselectedNode = signal<Node>({
    id: 'unselected',
    label: 'Unselected Node',
    icon: 'home',
    selected: false,
  });

  // State nodes
  normalNode = signal<Node>({
    id: 'normal',
    label: 'Normal Node',
    icon: 'home',
  });

  disabledNode = signal<Node>({
    id: 'disabled',
    label: 'Disabled Node',
    icon: 'home',
    disabled: true,
  });

  selectedDisabledNode = signal<Node>({
    id: 'selected-disabled',
    label: 'Selected & Disabled',
    icon: 'home',
    selected: true,
    disabled: true,
  });

  // Button nodes
  buttonNode = signal<Node>({
    id: 'button',
    label: 'Button Node',
    icon: 'home',
    onClick: () => this.onNodeClick({ id: 'button', label: 'Button Node', icon: 'home' }),
  });

  selectedButtonNode = signal<Node>({
    id: 'selected-button',
    label: 'Selected Button',
    icon: 'home',
    selected: true,
    onClick: () =>
      this.onNodeClick({ id: 'selected-button', label: 'Selected Button', icon: 'home' }),
  });

  disabledButtonNode = signal<Node>({
    id: 'disabled-button',
    label: 'Disabled Button',
    icon: 'home',
    disabled: true,
    onClick: () =>
      this.onNodeClick({ id: 'disabled-button', label: 'Disabled Button', icon: 'home' }),
  });

  // Selectable nodes
  selectableNode = signal<Node>({
    id: 'selectable',
    label: 'Click to Select',
    icon: 'home',
    selected: false,
  });

  nonSelectableNode = signal<Node>({
    id: 'non-selectable',
    label: 'Click Only',
    icon: 'home',
    selected: false,
  });

  // Quick actions node
  quickActionsNode = signal<Node>({
    id: 'quick-actions',
    label: 'Node with Quick Actions',
    icon: 'home',
  });

  // Custom content nodes
  customContentNode1 = signal<Node>({
    id: 'custom-1',
    label: 'Custom Content',
  });

  customContentNode2 = signal<Node>({
    id: 'custom-2',
    label: 'Featured Item',
  });

  customContentNode3 = signal<Node>({
    id: 'custom-3',
    label: 'User Status',
  });

  customContentSelectedNode = signal<Node>({
    id: 'custom-selected',
    label: 'Documents',
    selected: true,
  });

  customContentButtonNode = signal<Node>({
    id: 'custom-button',
    label: 'Settings',
  });

  customContentComplexNode = signal<Node>({
    id: 'custom-complex',
    label: 'Document.pdf',
  });

  customContentActionsNode = signal<Node>({
    id: 'custom-actions',
    label: 'John Doe',
  });

  customContentSmallNode = signal<Node>({
    id: 'custom-small',
    label: 'Notifications',
  });

  customContentMediumNode = signal<Node>({
    id: 'custom-medium',
    label: 'Notifications',
  });

  customContentLargeNode = signal<Node>({
    id: 'custom-large',
    label: 'Notifications',
  });

  // Combined examples
  combinedNode = signal<Node>({
    id: 'combined',
    label: 'Combined',
    icon: 'home',
  });

  selectedCombinedNode = signal<Node>({
    id: 'selected-combined',
    label: 'Selected Combined',
    icon: 'home',
    selected: true,
  });

  // Drag and drop nodes
  draggableNode1 = signal<Node>({
    id: 'draggable-1',
    label: 'Draggable Node',
    icon: 'drag',
  });

  draggableNode2 = signal<Node>({
    id: 'draggable-2',
    label: 'Node with Custom Data',
    icon: 'document',
  });

  nonDraggableNode = signal<Node>({
    id: 'non-draggable',
    label: 'Non-Draggable Node',
    icon: 'home',
  });

  disabledDraggableNode = signal<Node>({
    id: 'disabled-draggable',
    label: 'Disabled Node',
    icon: 'home',
    disabled: true,
  });

  sizeDraggableNode = signal<Node>({
    id: 'size-draggable',
    label: 'Draggable',
    icon: 'drag',
  });

  variantDraggableNode = signal<Node>({
    id: 'variant-draggable',
    label: 'Draggable',
    icon: 'drag',
  });

  // Source nodes for drag and drop demo
  sourceNodes = signal<Node[]>([
    { id: 'source-1', label: 'Document 1', icon: 'document' },
    { id: 'source-2', label: 'Document 2', icon: 'document' },
    { id: 'source-3', label: 'Document 3', icon: 'document' },
    { id: 'source-4', label: 'Folder 1', icon: 'folder' },
    { id: 'source-5', label: 'Folder 2', icon: 'folder' },
  ]);

  // Dropped nodes
  droppedNodes = signal<Node[]>([]);

  // Drag state
  isDragOver = signal<boolean>(false);
  dragEvents = signal<Array<{ type: string; message: string }>>([]);

  // Event handlers
  onNodeClick(node: Node): void {
    this.lastClickEvent.set(`Clicked: ${node.label} (${node.id})`);
    this.clickCount.update(count => count + 1);

    // Update selectable node state
    if (node.id === 'selectable') {
      this.selectableNode.update(n => ({ ...n, selected: !n.selected }));
    }
  }

  onNodeSelect(node: Node): void {
    this.lastSelectEvent.set(`Selected: ${node.label} (${node.id})`);
    this.selectCount.update(count => count + 1);
  }

  onQuickActionClick(node: Node, action: string): void {
    this.lastClickEvent.set(`Quick Action: ${action} on ${node.label}`);
    this.clickCount.update(count => count + 1);
  }

  onCustomActionClick(node: Node, action: string): void {
    this.lastClickEvent.set(`Custom Action: ${action} on ${node.label}`);
    this.clickCount.update(count => count + 1);
  }

  // Drag and drop handlers
  onDragStart(event: { node: Node; event: DragEvent; data?: any }): void {
    const message = `Started dragging: ${event.node.label}${
      event.data ? ` (Data: ${JSON.stringify(event.data)})` : ''
    }`;
    this.dragEvents.update(events => [
      { type: 'dragstart', message },
      ...events.slice(0, 19), // Keep last 20 events
    ]);
  }

  onDragEnd(event: { node: Node; event: DragEvent }): void {
    const message = `Finished dragging: ${event.node.label}`;
    this.dragEvents.update(events => [{ type: 'dragend', message }, ...events.slice(0, 19)]);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
    event.dataTransfer!.dropEffect = 'move';
  }

  onDragLeave(event: DragEvent): void {
    // Only set drag over to false if we're actually leaving the drop zone
    const relatedTarget = event.relatedTarget as HTMLElement;
    const currentTarget = event.currentTarget as HTMLElement;
    if (!currentTarget.contains(relatedTarget)) {
      this.isDragOver.set(false);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    try {
      const data = event.dataTransfer!.getData('application/json');
      const nodeData = JSON.parse(data);
      const node: Node = {
        id: nodeData.id || `dropped-${Date.now()}`,
        label: nodeData.label || nodeData,
        icon: nodeData.icon,
        disabled: nodeData.disabled,
        selected: nodeData.selected,
        data: nodeData.data,
      };

      // Add to dropped nodes if not already there
      const existingIndex = this.droppedNodes().findIndex(n => n.id === node.id);
      if (existingIndex === -1) {
        this.droppedNodes.update(nodes => [...nodes, node]);
        this.dragEvents.update(events => [
          { type: 'drop', message: `Dropped: ${node.label}` },
          ...events.slice(0, 19),
        ]);
      }
    } catch (error) {
      // Fallback to text data
      const text = event.dataTransfer!.getData('text/plain');
      if (text) {
        const node: Node = {
          id: `dropped-${Date.now()}`,
          label: text,
        };
        this.droppedNodes.update(nodes => [...nodes, node]);
        this.dragEvents.update(events => [
          { type: 'drop', message: `Dropped: ${text}` },
          ...events.slice(0, 19),
        ]);
      }
    }
  }

  clearDroppedNodes(): void {
    this.droppedNodes.set([]);
    this.dragEvents.update(events => [
      { type: 'clear', message: 'Cleared dropped nodes' },
      ...events.slice(0, 19),
    ]);
  }

  clearDragEvents(): void {
    this.dragEvents.set([]);
  }
}
