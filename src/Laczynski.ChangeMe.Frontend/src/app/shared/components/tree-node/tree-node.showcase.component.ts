import { Component, signal, viewChild, TemplateRef } from '@angular/core';
import { TreeNodeComponent, TreeNode } from './tree-node.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { IconName } from '../icon';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-tree-node-showcase',
  imports: [TreeNodeComponent, CommonModule, ButtonComponent, TableOfContentComponent],
  template: `
    <div class="showcase showcase--responsive showcase__with-toc">
      <app-table-of-content
        [sticky]="true"
        [offsetTop]="20"
        containerSelector=".showcase-content"
        [minLevel]="1"
        [maxLevel]="2"
      />
      <div class="showcase-content">
        <h1 class="showcase__title">Tree Node Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the TreeNode component built with Fluent 2 Design System. Tree
        nodes support hierarchical structures, expand/collapse functionality, selection indicators,
        and keyboard navigation.
      </p>

      <!-- ========================================= -->
      <!-- BASIC TREE NODES -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Tree Nodes</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Leaf Node (No Children)</h3>
            <app-tree-node [node]="leafNode()" />
          </div>
          <div class="showcase__item">
            <h3>Parent Node (Collapsed)</h3>
            <app-tree-node [node]="parentNodeCollapsed()" />
          </div>
          <div class="showcase__item">
            <h3>Parent Node (Expanded)</h3>
            <app-tree-node [node]="parentNodeExpanded()" />
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
            <app-tree-node [node]="sizeNode()" size="small" />
          </div>
          <div class="showcase__item">
            <h3>Medium (Default)</h3>
            <app-tree-node [node]="sizeNode()" size="medium" />
          </div>
          <div class="showcase__item">
            <h3>Large</h3>
            <app-tree-node [node]="sizeNode()" size="large" />
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
            <app-tree-node [node]="appearanceNode()" variant="transparent" />
          </div>
          <div class="showcase__item">
            <h3>Subtle</h3>
            <app-tree-node [node]="appearanceNode()" variant="subtle" />
          </div>
          <div class="showcase__item">
            <h3>Subtle Circular</h3>
            <app-tree-node [node]="appearanceNode()" variant="subtle-circular" />
          </div>
          <div class="showcase__item">
            <h3>Filled Circular</h3>
            <app-tree-node [node]="appearanceNode()" variant="filled-circular" />
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
            <app-tree-node
              [node]="selectedNode()"
              [showSelectionIndicator]="true"
              indicatorPosition="horizontal"
            />
          </div>
          <div class="showcase__item">
            <h3>Horizontal Indicator (Not Selected)</h3>
            <app-tree-node
              [node]="unselectedNode()"
              [showSelectionIndicator]="true"
              indicatorPosition="horizontal"
            />
          </div>
          <div class="showcase__item">
            <h3>Vertical Indicator (Selected)</h3>
            <app-tree-node
              [node]="selectedNode()"
              [showSelectionIndicator]="true"
              indicatorPosition="vertical"
            />
          </div>
          <div class="showcase__item">
            <h3>Vertical Indicator (Not Selected)</h3>
            <app-tree-node
              [node]="unselectedNode()"
              [showSelectionIndicator]="true"
              indicatorPosition="vertical"
            />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- CHEVRON POSITIONS -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Chevron Positions</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Chevron Before (Default)</h3>
            <app-tree-node [node]="chevronNode()" chevronPosition="before" />
          </div>
          <div class="showcase__item">
            <h3>Chevron After</h3>
            <app-tree-node [node]="chevronNode()" chevronPosition="after" />
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
            <app-tree-node [node]="normalNode()" />
          </div>
          <div class="showcase__item">
            <h3>Selected State</h3>
            <app-tree-node [node]="selectedTreeNode()" />
          </div>
          <div class="showcase__item">
            <h3>Disabled State</h3>
            <app-tree-node [node]="disabledNode()" />
          </div>
          <div class="showcase__item">
            <h3>Selected + Disabled</h3>
            <app-tree-node [node]="selectedDisabledNode()" />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- EXPAND ON CLICK -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Expand On Click Behavior</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Expand On Click (false - Default)</h3>
            <p style="margin-bottom: 8px; font-size: 12px; color: #666;">
              Click node to select, click chevron to expand
            </p>
            <app-tree-node
              [node]="expandOnClickNode()"
              [expandOnClick]="false"
              (nodeClick)="onNodeClick($event)"
              (nodeToggle)="onNodeToggle($event)"
            />
            <p style="margin-top: 8px; font-size: 12px;">
              Expanded: {{ expandOnClickNode().expanded ? 'Yes' : 'No' }}
            </p>
          </div>
          <div class="showcase__item">
            <h3>Expand On Click (true)</h3>
            <p style="margin-bottom: 8px; font-size: 12px; color: #666;">
              Click node to both select and expand
            </p>
            <app-tree-node
              [node]="expandOnClickNodeTrue()"
              [expandOnClick]="true"
              (nodeClick)="onNodeClick($event)"
              (nodeToggle)="onNodeToggle($event)"
            />
            <p style="margin-top: 8px; font-size: 12px;">
              Expanded: {{ expandOnClickNodeTrue().expanded ? 'Yes' : 'No' }}
            </p>
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
            <app-tree-node
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
            <app-tree-node
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
            <app-tree-node
              [node]="quickActionsNode()"
              [showQuickActions]="true"
              [quickActionsTemplate]="quickActionsTemplate"
            />
          </div>
        </div>
      </div>

      <!-- ========================================= -->
      <!-- NESTED STRUCTURES -->
      <!-- ========================================= -->

      <div class="showcase__section">
        <h2 class="showcase__section__title">Nested Structures</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Two Levels</h3>
            <app-tree-node [node]="twoLevelNode()" />
          </div>
          <div class="showcase__item">
            <h3>Three Levels</h3>
            <app-tree-node [node]="threeLevelNode()" />
          </div>
          <div class="showcase__item">
            <h3>Multiple Children</h3>
            <app-tree-node [node]="multipleChildrenNode()" />
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
            <app-tree-node [node]="buttonNode()" [asButton]="true" />
          </div>
          <div class="showcase__item">
            <h3>As Button (Selected)</h3>
            <app-tree-node [node]="selectedButtonNode()" [asButton]="true" />
          </div>
          <div class="showcase__item">
            <h3>As Button (Disabled)</h3>
            <app-tree-node [node]="disabledButtonNode()" [asButton]="true" />
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
            <h3>Small + Subtle Circular + Chevron After</h3>
            <app-tree-node
              [node]="combinedNode()"
              size="small"
              variant="subtle-circular"
              chevronPosition="after"
            />
          </div>
          <div class="showcase__item">
            <h3>Large + Filled Circular + Selected</h3>
            <app-tree-node
              [node]="selectedCombinedNode()"
              size="large"
              variant="filled-circular"
              [showSelectionIndicator]="true"
              indicatorPosition="horizontal"
            />
          </div>
          <div class="showcase__item">
            <h3>Medium + Subtle + Selected</h3>
            <app-tree-node
              [node]="selectedTextOnlyNode()"
              size="medium"
              variant="subtle"
              [showSelectionIndicator]="true"
              indicatorPosition="horizontal"
            />
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
    </div>
  `,
})
export class TreeNodeShowcaseComponent {
  quickActionsTemplate = viewChild<TemplateRef<any>>('quickActionsTemplate');

  lastClickEvent = signal<string>('None');
  lastToggleEvent = signal<string>('None');
  lastSelectEvent = signal<string>('None');
  clickCount = signal<number>(0);
  toggleCount = signal<number>(0);
  selectCount = signal<number>(0);

  // Helper function to create tree nodes with proper structure
  private createTreeNode(
    id: string,
    label: string,
    icon?: IconName,
    children?: TreeNode[],
    expanded?: boolean,
    selected?: boolean,
    disabled?: boolean,
    level: number = 0,
  ): TreeNode {
    const node: TreeNode = {
      id,
      label,
      icon,
      hasChildren: children !== undefined && children.length > 0,
      children,
      expanded: expanded ?? false,
      selected: selected ?? false,
      disabled: disabled ?? false,
      level,
    };

    // Set parent and level for children
    if (children) {
      children.forEach(child => {
        child.parent = node;
        child.level = level + 1;
      });
    }

    return node;
  }

  // Basic nodes
  leafNode = signal<TreeNode>(
    this.createTreeNode('leaf', 'Leaf Node', 'document', undefined, false, false, false, 0),
  );

  parentNodeCollapsed = signal<TreeNode>(
    this.createTreeNode(
      'parent-collapsed',
      'Parent Node',
      'folder',
      [
        this.createTreeNode('child1', 'Child 1', 'document', undefined, false, false, false, 1),
        this.createTreeNode('child2', 'Child 2', 'document', undefined, false, false, false, 1),
      ],
      false,
      false,
      false,
      0,
    ),
  );

  parentNodeExpanded = signal<TreeNode>(
    this.createTreeNode(
      'parent-expanded',
      'Parent Node',
      'folder',
      [
        this.createTreeNode('child1', 'Child 1', 'document', undefined, false, false, false, 1),
        this.createTreeNode('child2', 'Child 2', 'document', undefined, false, false, false, 1),
      ],
      true,
      false,
      false,
      0,
    ),
  );

  // Size nodes
  sizeNode = signal<TreeNode>(
    this.createTreeNode(
      'size',
      'Size Variant',
      'folder',
      [
        this.createTreeNode(
          'size-child1',
          'Child 1',
          'document',
          undefined,
          false,
          false,
          false,
          1,
        ),
        this.createTreeNode(
          'size-child2',
          'Child 2',
          'document',
          undefined,
          false,
          false,
          false,
          1,
        ),
      ],
      true,
      false,
      false,
      0,
    ),
  );

  // Layout nodes
  layoutNode = signal<TreeNode>(
    this.createTreeNode(
      'layout',
      'Layout Variant',
      'folder',
      [
        this.createTreeNode(
          'layout-child1',
          'Child 1',
          'document',
          undefined,
          false,
          false,
          false,
          1,
        ),
      ],
      true,
      false,
      false,
      0,
    ),
  );

  // Appearance nodes
  appearanceNode = signal<TreeNode>(
    this.createTreeNode(
      'appearance',
      'Appearance Variant',
      'folder',
      [
        this.createTreeNode(
          'appearance-child1',
          'Child 1',
          'document',
          undefined,
          false,
          false,
          false,
          1,
        ),
      ],
      true,
      false,
      false,
      0,
    ),
  );

  // Selection nodes
  selectedNode = signal<TreeNode>(
    this.createTreeNode('selected', 'Selected Node', 'folder', undefined, false, true, false, 0),
  );

  unselectedNode = signal<TreeNode>(
    this.createTreeNode(
      'unselected',
      'Unselected Node',
      'folder',
      undefined,
      false,
      false,
      false,
      0,
    ),
  );

  // Chevron nodes
  chevronNode = signal<TreeNode>(
    this.createTreeNode(
      'chevron',
      'Chevron Position',
      'folder',
      [
        this.createTreeNode(
          'chevron-child1',
          'Child 1',
          'document',
          undefined,
          false,
          false,
          false,
          1,
        ),
        this.createTreeNode(
          'chevron-child2',
          'Child 2',
          'document',
          undefined,
          false,
          false,
          false,
          1,
        ),
      ],
      true,
      false,
      false,
      0,
    ),
  );

  // State nodes
  normalNode = signal<TreeNode>(
    this.createTreeNode('normal', 'Normal Node', 'folder', undefined, false, false, false, 0),
  );

  selectedTreeNode = signal<TreeNode>(
    this.createTreeNode(
      'selected-tree',
      'Selected Node',
      'folder',
      undefined,
      false,
      true,
      false,
      0,
    ),
  );

  disabledNode = signal<TreeNode>(
    this.createTreeNode('disabled', 'Disabled Node', 'folder', undefined, false, false, true, 0),
  );

  selectedDisabledNode = signal<TreeNode>(
    this.createTreeNode(
      'selected-disabled',
      'Selected & Disabled',
      'folder',
      undefined,
      false,
      true,
      true,
      0,
    ),
  );

  // Expand on click nodes
  expandOnClickNode = signal<TreeNode>(
    this.createTreeNode(
      'expand-on-click',
      'Expand On Click (false)',
      'folder',
      [
        this.createTreeNode(
          'expand-child1',
          'Child 1',
          'document',
          undefined,
          false,
          false,
          false,
          1,
        ),
      ],
      false,
      false,
      false,
      0,
    ),
  );

  expandOnClickNodeTrue = signal<TreeNode>(
    this.createTreeNode(
      'expand-on-click-true',
      'Expand On Click (true)',
      'folder',
      [
        this.createTreeNode(
          'expand-true-child1',
          'Child 1',
          'document',
          undefined,
          false,
          false,
          false,
          1,
        ),
      ],
      false,
      false,
      false,
      0,
    ),
  );

  // Selectable nodes
  selectableNode = signal<TreeNode>(
    this.createTreeNode(
      'selectable',
      'Click to Select',
      'folder',
      undefined,
      false,
      false,
      false,
      0,
    ),
  );

  nonSelectableNode = signal<TreeNode>(
    this.createTreeNode(
      'non-selectable',
      'Click Only',
      'folder',
      undefined,
      false,
      false,
      false,
      0,
    ),
  );

  // Quick actions node
  quickActionsNode = signal<TreeNode>(
    this.createTreeNode(
      'quick-actions',
      'Node with Quick Actions',
      'folder',
      [
        this.createTreeNode(
          'quick-child1',
          'Child 1',
          'document',
          undefined,
          false,
          false,
          false,
          1,
        ),
      ],
      true,
      false,
      false,
      0,
    ),
  );

  // Nested structures
  twoLevelNode = signal<TreeNode>(
    this.createTreeNode(
      'two-level',
      'Level 1',
      'folder',
      [
        this.createTreeNode(
          'two-level-1',
          'Level 2 - 1',
          'document',
          undefined,
          false,
          false,
          false,
          1,
        ),
        this.createTreeNode(
          'two-level-2',
          'Level 2 - 2',
          'document',
          undefined,
          false,
          false,
          false,
          1,
        ),
      ],
      true,
      false,
      false,
      0,
    ),
  );

  threeLevelNode = signal<TreeNode>(
    this.createTreeNode(
      'three-level',
      'Level 1',
      'folder',
      [
        this.createTreeNode(
          'three-level-1',
          'Level 2 - 1',
          'folder',
          [
            this.createTreeNode(
              'three-level-1-1',
              'Level 3 - 1',
              'document',
              undefined,
              false,
              false,
              false,
              2,
            ),
            this.createTreeNode(
              'three-level-1-2',
              'Level 3 - 2',
              'document',
              undefined,
              false,
              false,
              false,
              2,
            ),
          ],
          true,
          false,
          false,
          1,
        ),
        this.createTreeNode(
          'three-level-2',
          'Level 2 - 2',
          'document',
          undefined,
          false,
          false,
          false,
          1,
        ),
      ],
      true,
      false,
      false,
      0,
    ),
  );

  multipleChildrenNode = signal<TreeNode>(
    this.createTreeNode(
      'multiple-children',
      'Parent with Many Children',
      'folder',
      [
        this.createTreeNode('child1', 'Child 1', 'document', undefined, false, false, false, 1),
        this.createTreeNode('child2', 'Child 2', 'document', undefined, false, false, false, 1),
        this.createTreeNode('child3', 'Child 3', 'document', undefined, false, false, false, 1),
        this.createTreeNode('child4', 'Child 4', 'document', undefined, false, false, false, 1),
        this.createTreeNode('child5', 'Child 5', 'document', undefined, false, false, false, 1),
      ],
      true,
      false,
      false,
      0,
    ),
  );

  // Button nodes
  buttonNode = signal<TreeNode>(
    this.createTreeNode('button', 'Button Node', 'folder', undefined, false, false, false, 0),
  );

  selectedButtonNode = signal<TreeNode>(
    this.createTreeNode(
      'selected-button',
      'Selected Button',
      'folder',
      undefined,
      false,
      true,
      false,
      0,
    ),
  );

  disabledButtonNode = signal<TreeNode>(
    this.createTreeNode(
      'disabled-button',
      'Disabled Button',
      'folder',
      undefined,
      false,
      false,
      true,
      0,
    ),
  );

  // Combined examples
  combinedNode = signal<TreeNode>(
    this.createTreeNode(
      'combined',
      'Combined',
      'folder',
      [
        this.createTreeNode(
          'combined-child1',
          'Child 1',
          'document',
          undefined,
          false,
          false,
          false,
          1,
        ),
      ],
      true,
      false,
      false,
      0,
    ),
  );

  selectedCombinedNode = signal<TreeNode>(
    this.createTreeNode(
      'selected-combined',
      'Selected Combined',
      'folder',
      undefined,
      false,
      true,
      false,
      0,
    ),
  );

  selectedTextOnlyNode = signal<TreeNode>(
    this.createTreeNode(
      'selected-text-only',
      'Selected Text Only',
      'folder',
      [
        this.createTreeNode(
          'text-child1',
          'Child 1',
          'document',
          undefined,
          false,
          false,
          false,
          1,
        ),
      ],
      true,
      true,
      false,
      0,
    ),
  );

  // Event handlers
  onNodeClick(node: TreeNode): void {
    this.lastClickEvent.set(`Clicked: ${node.label} (${node.id})`);
    this.clickCount.update(count => count + 1);

    // Update selectable node state
    if (node.id === 'selectable') {
      this.selectableNode.update(n => ({ ...n, selected: !n.selected }));
    }
  }

  onNodeToggle(node: TreeNode): void {
    this.lastToggleEvent.set(`Toggled: ${node.label} (${node.id}) - Expanded: ${node.expanded}`);
    this.toggleCount.update(count => count + 1);

    // Update expand on click nodes
    if (node.id === 'expand-on-click') {
      this.expandOnClickNode.update(n => ({ ...n, expanded: node.expanded }));
    } else if (node.id === 'expand-on-click-true') {
      this.expandOnClickNodeTrue.update(n => ({ ...n, expanded: node.expanded }));
    }
  }

  onNodeSelect(node: TreeNode): void {
    this.lastSelectEvent.set(`Selected: ${node.label} (${node.id})`);
    this.selectCount.update(count => count + 1);
  }

  onQuickActionClick(node: TreeNode, action: string): void {
    this.lastClickEvent.set(`Quick Action: ${action} on ${node.label}`);
    this.clickCount.update(count => count + 1);
  }
}
