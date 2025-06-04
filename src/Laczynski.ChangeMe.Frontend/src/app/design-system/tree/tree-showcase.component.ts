import { Component, signal, computed, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TreeComponent } from './tree.component';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { SelectComponent } from '../select/select.component';

import {
  TreeNode,
  TreeSelectionMode,
  TreeNodeClickEvent,
  TreeNodeSelectionEvent,
  TreeNodeToggleEvent,
  TreeDataSource,
} from './tree.model';

import { ComponentSize, ComponentVariant } from '../shared';

/**
 * Tree Component Showcase
 *
 * Demonstrates the Tree component with various configurations and use cases
 */
@Component({
  selector: 'app-tree-showcase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TreeComponent,
    InputComponent,
    ButtonComponent,
    CheckboxComponent,
    SelectComponent,
  ],
  template: `
    <div class="showcase-container">
      <!-- Header -->
      <div class="showcase-header">
        <h1>Tree Component</h1>
        <p class="showcase-description">
          A hierarchical tree component with selection, filtering, and lazy loading capabilities.
          Fully accessible with keyboard navigation and customizable styling.
        </p>
      </div>

      <!-- Basic Examples Section -->
      <section class="showcase-section">
        <h2>Basic Usage</h2>
        <p>Simple tree structures with different configurations.</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Basic Tree</h3>
            <p>Simple hierarchical structure with expand/collapse functionality.</p>
            <ds-tree [nodes]="basicTreeData()" size="md" variant="primary" [maxHeight]="200">
            </ds-tree>
          </div>

          <div class="showcase-item">
            <h3>File System</h3>
            <p>File system-like structure with different icons.</p>
            <ds-tree
              [nodes]="fileSystemData()"
              size="md"
              variant="info"
              [showLines]="true"
              [maxHeight]="200"
            >
            </ds-tree>
          </div>
        </div>
      </section>

      <!-- Selection Modes Section -->
      <section class="showcase-section">
        <h2>Selection Modes</h2>
        <p>Different selection behaviors: none, single, and multiple selection.</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>No Selection</h3>
            <p>Tree without selection capability - navigation only.</p>
            <ds-tree [nodes]="selectionDemoData()" selectionMode="none" [maxHeight]="150">
            </ds-tree>
          </div>

          <div class="showcase-item">
            <h3>Single Selection</h3>
            <p>Only one node can be selected at a time.</p>
            <ds-tree
              [nodes]="selectionDemoData()"
              selectionMode="single"
              [maxHeight]="150"
              (nodeSelected)="handleSelectionDemo($event)"
            >
            </ds-tree>
          </div>

          <div class="showcase-item">
            <h3>Multiple Selection</h3>
            <p>Multiple nodes with checkboxes and cascading selection.</p>
            <ds-tree
              [nodes]="selectionDemoData()"
              selectionMode="multiple"
              [showCheckboxes]="true"
              [cascadeSelection]="true"
              [maxHeight]="150"
              (nodeSelected)="handleSelectionDemo($event)"
            >
            </ds-tree>
          </div>
        </div>
      </section>

      <!-- Sizes and Variants Section -->
      <section class="showcase-section">
        <h2>Sizes & Variants</h2>
        <p>Different sizes and color variants for various use cases.</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Small Size</h3>
            <ds-tree [nodes]="compactTreeData()" size="sm" variant="secondary" [maxHeight]="120">
            </ds-tree>
          </div>

          <div class="showcase-item">
            <h3>Medium Size (Default)</h3>
            <ds-tree [nodes]="compactTreeData()" size="md" variant="success" [maxHeight]="120">
            </ds-tree>
          </div>

          <div class="showcase-item">
            <h3>Large Size</h3>
            <ds-tree [nodes]="compactTreeData()" size="lg" variant="warning" [maxHeight]="120">
            </ds-tree>
          </div>
        </div>
      </section>

      <!-- Interactive Configuration -->
      <section class="showcase-section">
        <h2>Interactive Configuration</h2>
        <p>Try different configurations and see real-time behavior.</p>

        <div class="interactive-controls">
          <div class="control-group">
            <label for="size-select">Size</label>
            <ds-select
              id="size-select"
              [value]="selectedSize()"
              (valueChange)="onSizeChange($event)"
              [options]="sizeOptions"
              size="sm"
            >
            </ds-select>
          </div>

          <div class="control-group">
            <label for="variant-select">Variant</label>
            <ds-select
              id="variant-select"
              [value]="selectedVariant()"
              (valueChange)="onVariantChange($event)"
              [options]="variantOptions"
              size="sm"
            >
            </ds-select>
          </div>

          <div class="control-group">
            <label for="selection-mode-select">Selection Mode</label>
            <ds-select
              id="selection-mode-select"
              [value]="selectedSelectionMode()"
              (valueChange)="onSelectionModeChange($event)"
              [options]="selectionModeOptions"
              size="sm"
            >
            </ds-select>
          </div>

          <div class="control-group">
            <ds-checkbox [(value)]="showCheckboxes" size="sm"> Show Checkboxes </ds-checkbox>
          </div>

          <div class="control-group">
            <ds-checkbox [(value)]="showLines" size="sm"> Show Lines </ds-checkbox>
          </div>

          <div class="control-group">
            <ds-checkbox [(value)]="showIcons" size="sm"> Show Icons </ds-checkbox>
          </div>
        </div>

        <div class="interactive-preview">
          <ds-tree
            #interactiveTree
            [nodes]="interactiveTreeData()"
            [size]="selectedSize()"
            [variant]="selectedVariant()"
            [selectionMode]="selectedSelectionMode()"
            [showCheckboxes]="showCheckboxes()"
            [showLines]="showLines()"
            [showIcons]="showIcons()"
            [cascadeSelection]="true"
            [searchTerm]="searchTerm()"
            [maxHeight]="300"
            (nodeClicked)="handleNodeClick($event)"
            (nodeSelected)="handleNodeSelection($event)"
            (nodeToggled)="handleNodeToggle($event)"
          >
          </ds-tree>
        </div>

        <div class="interactive-controls">
          <div class="control-group">
            <label for="search-input">Search Filter</label>
            <ds-input
              id="search-input"
              [value]="searchTerm()"
              (valueChange)="onSearchTermChange($event)"
              placeholder="Search nodes..."
              iconStart="magnifying-glass"
              size="sm"
            >
            </ds-input>
          </div>

          <div class="control-group">
            <ds-button size="sm" variant="ghost" (clicked)="expandAll()"> Expand All </ds-button>
          </div>

          <div class="control-group">
            <ds-button size="sm" variant="ghost" (clicked)="collapseAll()">
              Collapse All
            </ds-button>
          </div>
        </div>
      </section>

      <!-- Advanced Features Section -->
      <section class="showcase-section">
        <h2>Advanced Features</h2>
        <p>Lazy loading, large datasets, and custom node actions.</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Lazy Loading</h3>
            <p>Dynamic loading of child nodes when expanded.</p>
            <ds-tree
              [dataSource]="lazyDataSource"
              variant="success"
              selectionMode="multiple"
              [showCheckboxes]="true"
              [loading]="lazyLoading()"
              [maxHeight]="200"
              (loadChildren)="handleLazyLoad()"
            >
            </ds-tree>
          </div>

          <div class="showcase-item">
            <h3>Large Dataset</h3>
            <p>Performance with many nodes and search functionality.</p>
            <ds-tree
              [nodes]="largeTreeData()"
              variant="warning"
              selectionMode="multiple"
              [showCheckboxes]="true"
              [showLines]="false"
              [searchTerm]="largeTreeSearch()"
              [maxHeight]="200"
            >
            </ds-tree>
            <label for="large-search-input">Search Large Dataset</label>
            <ds-input
              id="large-search-input"
              [value]="largeTreeSearch()"
              (valueChange)="onLargeSearchChange($event)"
              placeholder="Search large dataset..."
              iconStart="magnifying-glass"
              size="sm"
              class="mt-2"
            >
            </ds-input>
          </div>

          <div class="showcase-item">
            <h3>Custom Actions</h3>
            <p>Tree with custom action buttons in nodes.</p>
            <ds-tree
              [nodes]="customActionsData()"
              variant="secondary"
              selectionMode="single"
              [showNodeActions]="true"
              [maxHeight]="200"
            >
              <ng-container slot="node-actions">
                <ds-button size="sm" variant="ghost" iconStart="pencil" (clicked)="editNode()">
                </ds-button>
                <ds-button size="sm" variant="ghost" iconStart="trash" (clicked)="deleteNode()">
                </ds-button>
              </ng-container>
            </ds-tree>
          </div>
        </div>
      </section>

      <!-- Selection State Display -->
      @if (selectedNodes().length > 0) {
        <section class="showcase-section">
          <h2>Selection State</h2>
          <div class="selection-display">
            <h4>Selected Nodes ({{ selectedNodes().length }}):</h4>
            <div class="selected-nodes">
              @for (node of selectedNodes(); track node.id) {
                <span class="selected-node">{{ node.label }}</span>
              }
            </div>
          </div>
        </section>
      }

      <!-- Event Log -->
      @if (lastEvent()) {
        <section class="showcase-section">
          <h2>Last Event</h2>
          <div class="event-display">
            <pre>{{ lastEvent() | json }}</pre>
          </div>
        </section>
      }

      <!-- Code Examples -->
      <section class="showcase-section">
        <h2>Code Examples</h2>

        <div class="code-examples">
          <div class="code-example">
            <h3>Basic Usage</h3>
            <pre><code>{{ basicUsageCode }}</code></pre>
          </div>

          <div class="code-example">
            <h3>Multi-Selection with Checkboxes</h3>
            <pre><code>{{ multiSelectionCode }}</code></pre>
          </div>

          <div class="code-example">
            <h3>Lazy Loading</h3>
            <pre><code>{{ lazyLoadingCode }}</code></pre>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrl: '../showcases/showcase.scss',
})
export class TreeShowcaseComponent {
  // =============================================================================
  // CONFIGURATION SIGNALS
  // =============================================================================

  selectedSize = signal<ComponentSize>('md');
  selectedVariant = signal<ComponentVariant>('primary');
  selectedSelectionMode = signal<TreeSelectionMode>('single');
  showCheckboxes = signal(false);
  showLines = signal(true);
  showIcons = signal(true);
  searchTerm = signal('');
  largeTreeSearch = signal('');
  lazyLoading = signal(false);

  // =============================================================================
  // CONFIGURATION OPTIONS
  // =============================================================================

  sizeOptions = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
  ];

  variantOptions = [
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'danger', label: 'Danger' },
    { value: 'info', label: 'Info' },
  ];

  selectionModeOptions = [
    { value: 'none', label: 'None' },
    { value: 'single', label: 'Single' },
    { value: 'multiple', label: 'Multiple' },
  ];

  // =============================================================================
  // DATA SIGNALS
  // =============================================================================

  basicTreeData = signal<TreeNode[]>([
    {
      id: '1',
      label: 'Documents',
      icon: 'clipboard',
      expanded: true,
      children: [
        {
          id: '1-1',
          label: 'Reports',
          icon: 'clipboard',
          children: [
            { id: '1-1-1', label: 'Q1 Report.pdf', icon: 'clipboard' },
            { id: '1-1-2', label: 'Q2 Report.pdf', icon: 'clipboard' },
          ],
        },
        {
          id: '1-2',
          label: 'Presentations',
          icon: 'clipboard',
          children: [{ id: '1-2-1', label: 'Company Overview.pptx', icon: 'clipboard' }],
        },
      ],
    },
    {
      id: '2',
      label: 'Projects',
      icon: 'star',
      expanded: true,
      children: [
        {
          id: '2-1',
          label: 'Website Redesign',
          icon: 'globe',
          children: [
            { id: '2-1-1', label: 'Design Files', icon: 'clipboard' },
            { id: '2-1-2', label: 'Development', icon: 'clipboard' },
          ],
        },
      ],
    },
  ]);

  fileSystemData = signal<TreeNode[]>([
    {
      id: 'root',
      label: 'System',
      icon: 'cog',
      expanded: true,
      children: [
        {
          id: 'users',
          label: 'Users',
          icon: 'user',
          children: [
            {
              id: 'john',
              label: 'john',
              icon: 'user',
              children: [
                { id: 'john-docs', label: 'Documents', icon: 'clipboard' },
                { id: 'john-downloads', label: 'Downloads', icon: 'clipboard' },
              ],
            },
          ],
        },
        {
          id: 'applications',
          label: 'Applications',
          icon: 'cog',
          children: [
            { id: 'app-chrome', label: 'Google Chrome', icon: 'globe' },
            { id: 'app-vscode', label: 'Visual Studio Code', icon: 'clipboard' },
          ],
        },
      ],
    },
  ]);

  selectionDemoData = signal<TreeNode[]>([
    {
      id: 'sel-1',
      label: 'Parent A',
      icon: 'star',
      expanded: true,
      children: [
        { id: 'sel-1-1', label: 'Child A1', icon: 'clipboard' },
        { id: 'sel-1-2', label: 'Child A2', icon: 'clipboard' },
      ],
    },
    {
      id: 'sel-2',
      label: 'Parent B',
      icon: 'star',
      children: [
        { id: 'sel-2-1', label: 'Child B1', icon: 'clipboard' },
        { id: 'sel-2-2', label: 'Child B2', icon: 'clipboard' },
      ],
    },
  ]);

  compactTreeData = signal<TreeNode[]>([
    {
      id: 'comp-1',
      label: 'Folder 1',
      icon: 'clipboard',
      children: [
        { id: 'comp-1-1', label: 'File 1.1', icon: 'clipboard' },
        { id: 'comp-1-2', label: 'File 1.2', icon: 'clipboard' },
      ],
    },
    {
      id: 'comp-2',
      label: 'Folder 2',
      icon: 'clipboard',
      children: [{ id: 'comp-2-1', label: 'File 2.1', icon: 'clipboard' }],
    },
  ]);

  interactiveTreeData = signal<TreeNode[]>([
    {
      id: 'int-1',
      label: 'Interactive Demo',
      icon: 'star',
      expanded: true,
      children: [
        {
          id: 'int-1-1',
          label: 'Level 1.1',
          icon: 'clipboard',
          children: [
            { id: 'int-1-1-1', label: 'Level 1.1.1', icon: 'clipboard' },
            { id: 'int-1-1-2', label: 'Level 1.1.2', icon: 'clipboard' },
          ],
        },
        {
          id: 'int-1-2',
          label: 'Level 1.2',
          icon: 'clipboard',
          children: [{ id: 'int-1-2-1', label: 'Level 1.2.1', icon: 'clipboard' }],
        },
      ],
    },
    {
      id: 'int-2',
      label: 'Another Branch',
      icon: 'star',
      children: [{ id: 'int-2-1', label: 'Leaf Node', icon: 'clipboard' }],
    },
  ]);

  largeTreeData = computed(() => {
    const generateNodes = (prefix: string, depth: number, maxDepth: number): TreeNode[] => {
      if (depth > maxDepth) return [];

      const nodes: TreeNode[] = [];
      const nodeCount = depth === 1 ? 8 : 4;

      for (let i = 1; i <= nodeCount; i++) {
        const nodeId = `${prefix}-${i}`;
        const node: TreeNode = {
          id: nodeId,
          label: `Node ${nodeId}`,
          icon: depth === maxDepth ? 'clipboard' : 'star',
          children: depth < maxDepth ? generateNodes(nodeId, depth + 1, maxDepth) : undefined,
        };
        nodes.push(node);
      }

      return nodes;
    };

    return generateNodes('large', 1, 3);
  });

  customActionsData = signal<TreeNode[]>([
    {
      id: 'team',
      label: 'Development Team',
      icon: 'user',
      expanded: true,
      children: [
        { id: 'dev-1', label: 'Frontend Developer', icon: 'user' },
        { id: 'dev-2', label: 'Backend Developer', icon: 'user' },
      ],
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: 'clipboard',
      children: [
        { id: 'res-1', label: 'Documentation', icon: 'clipboard' },
        { id: 'res-2', label: 'Assets', icon: 'star' },
      ],
    },
  ]);

  // =============================================================================
  // LAZY LOADING DATA SOURCE
  // =============================================================================

  lazyDataSource: TreeDataSource = {
    getRootNodes: async () => {
      await this.delay(500);
      return [
        { id: 'lazy-1', label: 'Lazy Node 1', icon: 'clipboard' },
        { id: 'lazy-2', label: 'Lazy Node 2', icon: 'clipboard' },
        { id: 'lazy-3', label: 'Lazy Node 3', icon: 'clipboard' },
      ];
    },

    getChildren: async (node: TreeNode) => {
      await this.delay(1000);
      const children: TreeNode[] = [];

      for (let i = 1; i <= 3; i++) {
        children.push({
          id: `${node.id}-child-${i}`,
          label: `Child ${i} of ${node.label}`,
          icon: i === 3 ? 'clipboard' : 'star',
        });
      }

      return children;
    },

    hasChildren: (node: TreeNode) => {
      return !String(node.id).includes('child-3');
    },
  };

  // =============================================================================
  // STATE SIGNALS
  // =============================================================================

  selectedNodes = signal<TreeNode[]>([]);
  lastEvent = signal<Record<string, unknown> | null>(null);

  // =============================================================================
  // VIEW CHILD REFERENCES
  // =============================================================================

  interactiveTree = viewChild<TreeComponent>('interactiveTree');

  // =============================================================================
  // CODE EXAMPLES
  // =============================================================================

  basicUsageCode = `<!-- Basic Tree -->
<ds-tree 
  [nodes]="treeData"
  size="md"
  variant="primary">
</ds-tree>`;

  multiSelectionCode = `<!-- Multi-Selection Tree -->
<ds-tree 
  [nodes]="treeData"
  selectionMode="multiple"
  [showCheckboxes]="true"
  [cascadeSelection]="true"
  (nodeSelected)="handleSelection($event)">
</ds-tree>`;

  lazyLoadingCode = `<!-- Lazy Loading Tree -->
<ds-tree 
  [dataSource]="lazyDataSource"
  (loadChildren)="handleLazyLoad()">
</ds-tree>

// Data source implementation
lazyDataSource: TreeDataSource = {
  getRootNodes: async () => {
    return await this.api.getRootNodes();
  },
  getChildren: async (node: TreeNode) => {
    return await this.api.getChildren(node.id);
  },
  hasChildren: (node: TreeNode) => {
    return node.data?.hasChildren;
  }
};`;

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  handleNodeClick(event: TreeNodeClickEvent): void {
    this.lastEvent.set({
      type: 'nodeClicked',
      nodeId: event.node.id,
      nodeLabel: event.node.label,
      isToggle: event.isToggle,
    });
  }

  handleNodeSelection(event: TreeNodeSelectionEvent): void {
    this.selectedNodes.set([...event.selectedNodes]);
    this.lastEvent.set({
      type: 'nodeSelected',
      nodeId: event.node.id,
      nodeLabel: event.node.label,
      selected: event.selected,
      totalSelected: event.selectedNodes.length,
    });
  }

  handleSelectionDemo(event: TreeNodeSelectionEvent): void {
    // For demo sections only
    console.log('Selection demo:', event.node.label, event.selected);
  }

  handleNodeToggle(event: TreeNodeToggleEvent): void {
    this.lastEvent.set({
      type: 'nodeToggled',
      nodeId: event.node.id,
      nodeLabel: event.node.label,
      expanded: event.expanded,
      userTriggered: event.userTriggered,
    });
  }

  handleLazyLoad(): void {
    this.lazyLoading.set(true);
    setTimeout(() => {
      this.lazyLoading.set(false);
    }, 1000);
  }

  // =============================================================================
  // ACTION METHODS
  // =============================================================================

  expandAll(): void {
    const tree = this.interactiveTree();
    if (tree) {
      tree.expandAll();
    }
  }

  collapseAll(): void {
    const tree = this.interactiveTree();
    if (tree) {
      tree.collapseAll();
    }
  }

  editNode(): void {
    console.log('Edit node');
  }

  deleteNode(): void {
    console.log('Delete node');
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  onSizeChange(event: string | string[] | null): void {
    if (typeof event === 'string') {
      this.selectedSize.set(event as ComponentSize);
    }
  }

  onVariantChange(event: string | string[] | null): void {
    if (typeof event === 'string') {
      this.selectedVariant.set(event as ComponentVariant);
    }
  }

  onSelectionModeChange(event: string | string[] | null): void {
    if (typeof event === 'string') {
      this.selectedSelectionMode.set(event as TreeSelectionMode);
    }
  }

  onSearchTermChange(event: string | any): void {
    const value = typeof event === 'string' ? event : event.value || '';
    this.searchTerm.set(value);
  }

  onLargeSearchChange(event: string | any): void {
    const value = typeof event === 'string' ? event : event.value || '';
    this.largeTreeSearch.set(value);
  }
}
