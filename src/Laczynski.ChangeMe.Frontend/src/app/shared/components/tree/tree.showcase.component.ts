import { Component, signal, viewChild, TemplateRef } from '@angular/core';
import { TreeComponent } from './tree.component';
import { TreeNode } from '../tree-node/tree-node.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-tree-showcase',
  imports: [TreeComponent, CommonModule, ButtonComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Tree Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Tree component built with Fluent 2 Design System. Trees
        support hierarchical data structures with expandable/collapsible nodes, selection, multiple
        sizes, styles, layouts, and custom content templates.
      </p>

      <!-- ========================================= -->
      <!-- BASIC TREES -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Trees</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Simple Tree</h3>
            <app-tree [nodes]="simpleTree()" />
          </div>
          <div class="showcase__item">
            <h3>Tree with Children</h3>
            <app-tree [nodes]="treeWithChildren()" />
          </div>
          <div class="showcase__item">
            <h3>Deep Nested Tree</h3>
            <app-tree [nodes]="deepNestedTree()" />
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
            <app-tree [nodes]="sizeTree()" size="small" />
          </div>
          <div class="showcase__item">
            <h3>Medium (Default)</h3>
            <app-tree [nodes]="sizeTree()" size="medium" />
          </div>
          <div class="showcase__item">
            <h3>Large</h3>
            <app-tree [nodes]="sizeTree()" size="large" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- STYLE VARIANTS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Style Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Subtle (Default)</h3>
            <app-tree [nodes]="styleTree()" style="subtle" />
          </div>
          <div class="showcase__item">
            <h3>Flat</h3>
            <app-tree [nodes]="styleTree()" style="flat" />
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
            <h3>Horizontal Indicator</h3>
            <app-tree
              [nodes]="selectionTree()"
              [showSelectionIndicator]="true"
              indicatorPosition="horizontal"
              (nodeSelect)="onNodeSelect($event)"
            />
            <p style="margin-top: 16px; font-size: 12px;">
              Selected: {{ selectedNodeLabel() || 'None' }}
            </p>
          </div>
          <div class="showcase__item">
            <h3>Vertical Indicator</h3>
            <app-tree
              [nodes]="selectionTree()"
              [showSelectionIndicator]="true"
              indicatorPosition="vertical"
              (nodeSelect)="onNodeSelect($event)"
            />
            <p style="margin-top: 16px; font-size: 12px;">
              Selected: {{ selectedNodeLabel() || 'None' }}
            </p>
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
            <app-tree [nodes]="appearanceTree()" variant="transparent" />
          </div>
          <div class="showcase__item">
            <h3>Subtle</h3>
            <app-tree [nodes]="appearanceTree()" variant="subtle" />
          </div>
          <div class="showcase__item">
            <h3>Subtle Circular</h3>
            <app-tree [nodes]="appearanceTree()" variant="subtle-circular" />
          </div>
          <div class="showcase__item">
            <h3>Filled Circular</h3>
            <app-tree [nodes]="appearanceTree()" variant="filled-circular" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- CHEVRON POSITION -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Chevron Position</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Before (Default)</h3>
            <app-tree [nodes]="chevronTree()" chevronPosition="before" />
          </div>
          <div class="showcase__item">
            <h3>After</h3>
            <app-tree [nodes]="chevronTree()" chevronPosition="after" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- CUSTOM CHEVRON ICONS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Custom Chevron Icons</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Custom Icons</h3>
            <app-tree
              [nodes]="customChevronTree()"
              chevronIconCollapsed="add"
              chevronIconExpanded="remove"
            />
          </div>
          <div class="showcase__item">
            <h3>Arrow Icons</h3>
            <app-tree
              [nodes]="customChevronTree()"
              chevronIconCollapsed="arrow_right"
              chevronIconExpanded="arrow_drop_down"
            />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- BEHAVIOR CONFIGURATION -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Behavior Configuration</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>As Button</h3>
            <p style="margin-bottom: 8px; font-size: 12px; color: #666;">
              Nodes render as buttons instead of divs
            </p>
            <app-tree [nodes]="buttonTree()" [asButton]="true" (nodeClick)="onNodeClick($event)" />
            <p style="margin-top: 8px; font-size: 12px;">Last Click: {{ lastClickLabel() }}</p>
          </div>
          <div class="showcase__item">
            <h3>Expand On Click</h3>
            <p style="margin-bottom: 8px; font-size: 12px; color: #666;">
              Clicking a node expands/collapses it
            </p>
            <app-tree [nodes]="expandOnClickTree()" [expandOnClick]="true" />
          </div>
          <div class="showcase__item">
            <h3>Select On Click (Default: true)</h3>
            <p style="margin-bottom: 8px; font-size: 12px; color: #666;">
              Clicking a node selects it
            </p>
            <app-tree
              [nodes]="selectOnClickTree()"
              [selectOnClick]="true"
              [showSelectionIndicator]="true"
              indicatorPosition="horizontal"
              (nodeSelect)="onNodeSelect($event)"
            />
            <p style="margin-top: 8px; font-size: 12px;">
              Selected: {{ selectedNodeLabel() || 'None' }}
            </p>
          </div>
          <div class="showcase__item">
            <h3>Select On Click (false)</h3>
            <p style="margin-bottom: 8px; font-size: 12px; color: #666;">
              Clicking a node does not select it
            </p>
            <app-tree
              [nodes]="selectOnClickTree()"
              [selectOnClick]="false"
              [showSelectionIndicator]="true"
              indicatorPosition="horizontal"
              (nodeClick)="onNodeClick($event)"
            />
            <p style="margin-top: 8px; font-size: 12px;">Last Click: {{ lastClickLabel() }}</p>
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
            <app-tree [nodes]="quickActionsTree()" [showQuickActions]="true">
              <ng-template #quickActions let-node>
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
            </app-tree>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- CUSTOM CONTENT TEMPLATE -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Custom Content Template</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Custom Node Content</h3>
            <app-tree [nodes]="customContentTree()">
              <ng-template #content let-node>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span>{{ node.label }}</span>
                  <span
                    style="
                      background: #e1f5fe;
                      color: #0277bd;
                      padding: 2px 6px;
                      border-radius: 4px;
                      font-size: 11px;
                    "
                  >
                    Custom
                  </span>
                </div>
              </ng-template>
            </app-tree>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- STATES -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Node States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Normal Nodes</h3>
            <app-tree [nodes]="statesTree()" />
          </div>
          <div class="showcase__item">
            <h3>Selected Node</h3>
            <app-tree [nodes]="selectedStatesTree()" [showSelectionIndicator]="true" />
          </div>
          <div class="showcase__item">
            <h3>Disabled Nodes</h3>
            <app-tree [nodes]="disabledStatesTree()" />
          </div>
          <div class="showcase__item">
            <h3>Expanded Nodes</h3>
            <app-tree [nodes]="expandedStatesTree()" />
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
            <h3>Small + Subtle + Vertical Indicator</h3>
            <app-tree
              [nodes]="combinedTree()"
              size="small"
              style="subtle"
              [showSelectionIndicator]="true"
              indicatorPosition="vertical"
            />
          </div>
          <div class="showcase__item">
            <h3>Large + Flat + Subtle Circular + Horizontal Indicator</h3>
            <app-tree
              [nodes]="combinedTree()"
              size="large"
              style="flat"
              variant="subtle-circular"
              [showSelectionIndicator]="true"
              indicatorPosition="horizontal"
            />
          </div>
          <div class="showcase__item">
            <h3>As Button + Expand On Click + Quick Actions</h3>
            <app-tree
              [nodes]="combinedTree()"
              [asButton]="true"
              [expandOnClick]="true"
              [showQuickActions]="true"
            >
              <ng-template #quickActions let-node>
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
                ></app-button> </ng-template
            ></app-tree>
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- DRAG AND DROP -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Drag and Drop</h2>
        <p class="showcase__description" style="margin-bottom: 16px;">
          Trees support drag and drop functionality for reordering and nesting nodes. Enable
          <code>draggable</code> to make nodes draggable and <code>dropZone</code> to allow nodes to
          accept drops. You can drop nodes before, after, or inside other nodes.
        </p>

        <!-- Basic Drag and Drop -->
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Basic Drag and Drop</h3>
            <p style="margin-bottom: 8px; font-size: 12px; color: #666;">
              Drag nodes to reorder or nest them. Drop zones show visual feedback.
            </p>
            <app-tree
              [nodes]="draggableTree()"
              [draggable]="true"
              [dropZone]="true"
              (nodeMoved)="onNodeMoved($event)"
            />
            <div style="margin-top: 12px;">
              <app-button variant="subtle" size="small" (click)="resetDraggableTree()">
                Reset Tree
              </app-button>
            </div>
          </div>
        </div>

        <!-- Interactive Drag and Drop Demo -->
        <div class="showcase__grid" style="margin-top: 24px;">
          <div class="showcase__item">
            <h3>Interactive Drag and Drop</h3>
            <p style="margin-bottom: 8px; font-size: 12px; color: #666;">
              Drag nodes to reorganize the tree structure. Drop indicators show where the node will
              be placed.
            </p>
            <div
              style="
                border: 1px solid #d1d1d1;
                border-radius: 8px;
                padding: 16px;
                background: #fafafa;
                min-height: 300px;
              "
            >
              <app-tree
                [nodes]="interactiveDraggableTree()"
                [draggable]="true"
                [dropZone]="true"
                [showSelectionIndicator]="true"
                indicatorPosition="vertical"
                (nodeMoved)="onInteractiveNodeMoved($event)"
              />
            </div>
            <div style="margin-top: 12px; display: flex; gap: 8px;">
              <app-button variant="subtle" size="small" (click)="resetInteractiveTree()">
                Reset
              </app-button>
              <app-button variant="subtle" size="small" (click)="expandAllInteractive()">
                Expand All
              </app-button>
              <app-button variant="subtle" size="small" (click)="collapseAllInteractive()">
                Collapse All
              </app-button>
            </div>
          </div>
        </div>

        <!-- Drag and Drop with Different Sizes -->
        <div class="showcase__grid" style="margin-top: 24px;">
          <div class="showcase__item">
            <h3>Small Tree with Drag & Drop</h3>
            <app-tree
              [nodes]="sizeDraggableTree()"
              size="small"
              [draggable]="true"
              [dropZone]="true"
              (nodeMoved)="onNodeMoved($event)"
            />
          </div>
          <div class="showcase__item">
            <h3>Medium Tree with Drag & Drop</h3>
            <app-tree
              [nodes]="sizeDraggableTree()"
              size="medium"
              [draggable]="true"
              [dropZone]="true"
              (nodeMoved)="onNodeMoved($event)"
            />
          </div>
          <div class="showcase__item">
            <h3>Large Tree with Drag & Drop</h3>
            <app-tree
              [nodes]="sizeDraggableTree()"
              size="large"
              [draggable]="true"
              [dropZone]="true"
              (nodeMoved)="onNodeMoved($event)"
            />
          </div>
        </div>

        <!-- Drag and Drop with Variants -->
        <div class="showcase__grid" style="margin-top: 24px;">
          <div class="showcase__item">
            <h3>Subtle Circular with Drag & Drop</h3>
            <app-tree
              [nodes]="variantDraggableTree()"
              variant="subtle-circular"
              [draggable]="true"
              [dropZone]="true"
              (nodeMoved)="onNodeMoved($event)"
            />
          </div>
          <div class="showcase__item">
            <h3>Filled Circular with Drag & Drop</h3>
            <app-tree
              [nodes]="variantDraggableTree()"
              variant="filled-circular"
              [draggable]="true"
              [dropZone]="true"
              (nodeMoved)="onNodeMoved($event)"
            />
          </div>
        </div>

        <!-- Drag and Drop Events Log -->
        <div class="showcase__grid" style="margin-top: 24px;">
          <div class="showcase__item">
            <h3>Drag and Drop Events Log</h3>
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
              @if (dragDropEvents().length === 0) {
                <p style="color: #999; margin: 0;">No drag and drop events yet...</p>
              } @else {
                @for (event of dragDropEvents(); track $index) {
                  <div
                    style="margin-bottom: 4px; padding: 4px; background: white; border-radius: 2px;"
                  >
                    <strong>{{ event.type }}:</strong> {{ event.message }}
                  </div>
                }
              }
            </div>
            <div style="margin-top: 8px;">
              <app-button variant="subtle" size="small" (click)="clearDragDropEvents()">
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
            <p><strong>Last Toggle Event:</strong> {{ lastToggleEvent() }}</p>
            <p><strong>Last Select Event:</strong> {{ lastSelectEvent() }}</p>
            <p><strong>Click Count:</strong> {{ clickCount() }}</p>
            <p><strong>Toggle Count:</strong> {{ toggleCount() }}</p>
            <p><strong>Select Count:</strong> {{ selectCount() }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TreeShowcaseComponent {
  quickActionsTemplate = viewChild<TemplateRef<any>>('quickActionsTemplate');

  lastClickEvent = signal<string>('None');
  lastToggleEvent = signal<string>('None');
  lastSelectEvent = signal<string>('None');
  clickCount = signal<number>(0);
  toggleCount = signal<number>(0);
  selectCount = signal<number>(0);
  selectedNodeLabel = signal<string | null>(null);
  lastClickLabel = signal<string>('None');
  dragDropEvents = signal<Array<{ type: string; message: string }>>([]);

  // Helper function to create tree nodes
  private createTreeNode(
    id: string,
    label: string,
    icon?: string,
    children?: TreeNode[],
    selected?: boolean,
    disabled?: boolean,
    expanded?: boolean,
  ): TreeNode {
    return {
      id,
      label,
      icon,
      children,
      hasChildren: children !== undefined && children.length > 0,
      selected,
      disabled,
      expanded,
    };
  }

  // Basic trees
  simpleTree = signal<TreeNode[]>([
    this.createTreeNode('1', 'Documents', 'folder'),
    this.createTreeNode('2', 'Pictures', 'image'),
    this.createTreeNode('3', 'Videos', 'video_library'),
  ]);

  treeWithChildren = signal<TreeNode[]>([
    this.createTreeNode('1', 'Documents', 'folder', [
      this.createTreeNode('1-1', 'File 1.pdf', 'description'),
      this.createTreeNode('1-2', 'File 2.docx', 'description'),
    ]),
    this.createTreeNode('2', 'Pictures', 'image', [
      this.createTreeNode('2-1', 'Photo 1.jpg', 'image'),
      this.createTreeNode('2-2', 'Photo 2.png', 'image'),
    ]),
  ]);

  deepNestedTree = signal<TreeNode[]>([
    this.createTreeNode('1', 'Root', 'folder', [
      this.createTreeNode('1-1', 'Level 1', 'folder', [
        this.createTreeNode('1-1-1', 'Level 2', 'folder', [
          this.createTreeNode('1-1-1-1', 'Level 3', 'description'),
          this.createTreeNode('1-1-1-2', 'Level 3', 'description'),
        ]),
      ]),
      this.createTreeNode('1-2', 'Level 1', 'folder'),
    ]),
  ]);

  // Size trees
  sizeTree = signal<TreeNode[]>([
    this.createTreeNode('1', 'Small Node', 'home', [
      this.createTreeNode('1-1', 'Child', 'description'),
    ]),
    this.createTreeNode('2', 'Medium Node', 'home', [
      this.createTreeNode('2-1', 'Child', 'description'),
    ]),
    this.createTreeNode('3', 'Large Node', 'home', [
      this.createTreeNode('3-1', 'Child', 'description'),
    ]),
  ]);

  // Style trees
  styleTree = signal<TreeNode[]>([
    this.createTreeNode('1', 'Node 1', 'home', [
      this.createTreeNode('1-1', 'Child 1', 'description'),
      this.createTreeNode('1-2', 'Child 2', 'description'),
    ]),
    this.createTreeNode('2', 'Node 2', 'home'),
  ]);

  // Selection trees
  selectionTree = signal<TreeNode[]>([
    this.createTreeNode('1', 'Selectable Node 1', 'home', [
      this.createTreeNode('1-1', 'Child 1', 'description'),
    ]),
    this.createTreeNode('2', 'Selectable Node 2', 'home', [
      this.createTreeNode('2-1', 'Child 1', 'description'),
    ]),
    this.createTreeNode('3', 'Selectable Node 3', 'home'),
  ]);

  // Layout trees
  layoutTree = signal<TreeNode[]>([
    this.createTreeNode('1', 'Node with Icon', 'home', [
      this.createTreeNode('1-1', 'Child', 'description'),
    ]),
    this.createTreeNode('2', 'Another Node', 'settings', [
      this.createTreeNode('2-1', 'Child', 'description'),
    ]),
  ]);

  // Appearance trees
  appearanceTree = signal<TreeNode[]>([
    this.createTreeNode('1', 'Appearance Node', 'home', [
      this.createTreeNode('1-1', 'Child', 'description'),
    ]),
    this.createTreeNode('2', 'Another Node', 'settings'),
  ]);

  // Chevron trees
  chevronTree = signal<TreeNode[]>([
    this.createTreeNode('1', 'Node 1', 'home', [
      this.createTreeNode('1-1', 'Child 1', 'description'),
      this.createTreeNode('1-2', 'Child 2', 'description'),
    ]),
    this.createTreeNode('2', 'Node 2', 'settings'),
  ]);

  // Custom chevron trees
  customChevronTree = signal<TreeNode[]>([
    this.createTreeNode('1', 'Custom Chevron', 'home', [
      this.createTreeNode('1-1', 'Child', 'description'),
    ]),
    this.createTreeNode('2', 'Another Node', 'settings'),
  ]);

  // Button trees
  buttonTree = signal<TreeNode[]>([
    this.createTreeNode('1', 'Button Node 1', 'home', [
      this.createTreeNode('1-1', 'Child', 'description'),
    ]),
    this.createTreeNode('2', 'Button Node 2', 'settings'),
  ]);

  // Expand on click trees
  expandOnClickTree = signal<TreeNode[]>([
    this.createTreeNode('1', 'Expand on Click', 'home', [
      this.createTreeNode('1-1', 'Child 1', 'description'),
      this.createTreeNode('1-2', 'Child 2', 'description'),
    ]),
    this.createTreeNode('2', 'Another Node', 'settings'),
  ]);

  // Select on click trees
  selectOnClickTree = signal<TreeNode[]>([
    this.createTreeNode('1', 'Selectable Node', 'home', [
      this.createTreeNode('1-1', 'Child', 'description'),
    ]),
    this.createTreeNode('2', 'Another Node', 'settings'),
  ]);

  // Quick actions trees
  quickActionsTree = signal<TreeNode[]>([
    this.createTreeNode('1', 'Node with Actions', 'home', [
      this.createTreeNode('1-1', 'Child with Actions', 'description'),
    ]),
    this.createTreeNode('2', 'Another Node', 'settings'),
  ]);

  // Custom content trees
  customContentTree = signal<TreeNode[]>([
    this.createTreeNode('1', 'Custom Node 1', 'home', [
      this.createTreeNode('1-1', 'Custom Child', 'description'),
    ]),
    this.createTreeNode('2', 'Custom Node 2', 'settings'),
  ]);

  // States trees
  statesTree = signal<TreeNode[]>([
    this.createTreeNode('1', 'Normal Node', 'home', [
      this.createTreeNode('1-1', 'Normal Child', 'description'),
    ]),
    this.createTreeNode('2', 'Another Normal', 'settings'),
  ]);

  selectedStatesTree = signal<TreeNode[]>([
    this.createTreeNode(
      '1',
      'Selected Node',
      'home',
      [this.createTreeNode('1-1', 'Child', 'description')],
      true,
    ),
    this.createTreeNode('2', 'Normal Node', 'settings'),
  ]);

  disabledStatesTree = signal<TreeNode[]>([
    this.createTreeNode(
      '1',
      'Disabled Node',
      'home',
      [this.createTreeNode('1-1', 'Disabled Child', 'description', undefined, undefined, true)],
      undefined,
      true,
    ),
    this.createTreeNode('2', 'Normal Node', 'settings'),
  ]);

  expandedStatesTree = signal<TreeNode[]>([
    this.createTreeNode(
      '1',
      'Expanded Node',
      'home',
      [
        this.createTreeNode('1-1', 'Visible Child', 'description'),
        this.createTreeNode('1-2', 'Another Child', 'description'),
      ],
      undefined,
      undefined,
      true,
    ),
    this.createTreeNode('2', 'Collapsed Node', 'settings', [
      this.createTreeNode('2-1', 'Hidden Child', 'description'),
    ]),
  ]);

  // Combined trees
  combinedTree = signal<TreeNode[]>([
    this.createTreeNode('1', 'Combined Node', 'home', [
      this.createTreeNode('1-1', 'Child 1', 'description'),
      this.createTreeNode('1-2', 'Child 2', 'description'),
    ]),
    this.createTreeNode('2', 'Another Node', 'settings'),
  ]);

  // Draggable trees
  draggableTree = signal<TreeNode[]>([
    this.createTreeNode('drag-1', 'Documents', 'folder', [
      this.createTreeNode('drag-1-1', 'File 1.pdf', 'description'),
      this.createTreeNode('drag-1-2', 'File 2.docx', 'description'),
    ]),
    this.createTreeNode('drag-2', 'Pictures', 'image', [
      this.createTreeNode('drag-2-1', 'Photo 1.jpg', 'image'),
    ]),
    this.createTreeNode('drag-3', 'Videos', 'video_library'),
    this.createTreeNode('drag-4', 'Music', 'library_music'),
  ]);

  interactiveDraggableTree = signal<TreeNode[]>([
    this.createTreeNode('int-1', 'Project A', 'folder', [
      this.createTreeNode('int-1-1', 'Task 1', 'description'),
      this.createTreeNode('int-1-2', 'Task 2', 'description'),
      this.createTreeNode('int-1-3', 'Task 3', 'description'),
    ]),
    this.createTreeNode('int-2', 'Project B', 'folder', [
      this.createTreeNode('int-2-1', 'Task 1', 'description'),
      this.createTreeNode('int-2-2', 'Task 2', 'description'),
    ]),
    this.createTreeNode('int-3', 'Project C', 'folder'),
    this.createTreeNode('int-4', 'Archive', 'archive'),
  ]);

  sizeDraggableTree = signal<TreeNode[]>([
    this.createTreeNode('size-drag-1', 'Node 1', 'home', [
      this.createTreeNode('size-drag-1-1', 'Child 1', 'description'),
      this.createTreeNode('size-drag-1-2', 'Child 2', 'description'),
    ]),
    this.createTreeNode('size-drag-2', 'Node 2', 'settings'),
    this.createTreeNode('size-drag-3', 'Node 3', 'folder'),
  ]);

  variantDraggableTree = signal<TreeNode[]>([
    this.createTreeNode('var-drag-1', 'Item 1', 'home', [
      this.createTreeNode('var-drag-1-1', 'Subitem 1', 'description'),
    ]),
    this.createTreeNode('var-drag-2', 'Item 2', 'settings'),
    this.createTreeNode('var-drag-3', 'Item 3', 'folder'),
  ]);

  // Event handlers
  onNodeClick(node: TreeNode): void {
    this.lastClickEvent.set(`Clicked: ${node.label} (${node.id})`);
    this.lastClickLabel.set(node.label);
    this.clickCount.update(count => count + 1);
  }

  onNodeToggle(node: TreeNode): void {
    this.lastToggleEvent.set(`Toggled: ${node.label} (${node.id}) - Expanded: ${node.expanded}`);
    this.toggleCount.update(count => count + 1);
  }

  onNodeSelect(node: TreeNode): void {
    this.lastSelectEvent.set(`Selected: ${node.label} (${node.id})`);
    this.selectedNodeLabel.set(node.label);
    this.selectCount.update(count => count + 1);
  }

  onQuickActionClick(node: TreeNode, action: string): void {
    this.lastClickEvent.set(`Quick Action: ${action} on ${node.label}`);
    this.clickCount.update(count => count + 1);
  }

  // Drag and drop handlers
  onNodeMoved(event: {
    node: TreeNode;
    target: TreeNode;
    position: 'before' | 'after' | 'inside';
  }): void {
    const message = `Moved "${event.node.label}" ${event.position} "${event.target.label}"`;
    this.dragDropEvents.update(events => [{ type: 'move', message }, ...events.slice(0, 19)]);
  }

  onInteractiveNodeMoved(event: {
    node: TreeNode;
    target: TreeNode;
    position: 'before' | 'after' | 'inside';
  }): void {
    const message = `Moved "${event.node.label}" ${event.position} "${event.target.label}"`;
    this.dragDropEvents.update(events => [{ type: 'move', message }, ...events.slice(0, 19)]);
  }

  resetDraggableTree(): void {
    this.draggableTree.set([
      this.createTreeNode('drag-1', 'Documents', 'folder', [
        this.createTreeNode('drag-1-1', 'File 1.pdf', 'description'),
        this.createTreeNode('drag-1-2', 'File 2.docx', 'description'),
      ]),
      this.createTreeNode('drag-2', 'Pictures', 'image', [
        this.createTreeNode('drag-2-1', 'Photo 1.jpg', 'image'),
      ]),
      this.createTreeNode('drag-3', 'Videos', 'video_library'),
      this.createTreeNode('drag-4', 'Music', 'library_music'),
    ]);
    this.dragDropEvents.update(events => [
      { type: 'reset', message: 'Tree reset to initial state' },
      ...events.slice(0, 19),
    ]);
  }

  resetInteractiveTree(): void {
    this.interactiveDraggableTree.set([
      this.createTreeNode('int-1', 'Project A', 'folder', [
        this.createTreeNode('int-1-1', 'Task 1', 'description'),
        this.createTreeNode('int-1-2', 'Task 2', 'description'),
        this.createTreeNode('int-1-3', 'Task 3', 'description'),
      ]),
      this.createTreeNode('int-2', 'Project B', 'folder', [
        this.createTreeNode('int-2-1', 'Task 1', 'description'),
        this.createTreeNode('int-2-2', 'Task 2', 'description'),
      ]),
      this.createTreeNode('int-3', 'Project C', 'folder'),
      this.createTreeNode('int-4', 'Archive', 'archive'),
    ]);
    this.dragDropEvents.update(events => [
      { type: 'reset', message: 'Interactive tree reset' },
      ...events.slice(0, 19),
    ]);
  }

  expandAllInteractive(): void {
    const expandNode = (node: TreeNode): void => {
      if (node.children && node.children.length > 0) {
        node.expanded = true;
        node.children.forEach(expandNode);
      }
    };
    this.interactiveDraggableTree().forEach(expandNode);
    this.interactiveDraggableTree.set([...this.interactiveDraggableTree()]);
  }

  collapseAllInteractive(): void {
    const collapseNode = (node: TreeNode): void => {
      node.expanded = false;
      if (node.children) {
        node.children.forEach(collapseNode);
      }
    };
    this.interactiveDraggableTree().forEach(collapseNode);
    this.interactiveDraggableTree.set([...this.interactiveDraggableTree()]);
  }

  clearDragDropEvents(): void {
    this.dragDropEvents.set([]);
  }
}
