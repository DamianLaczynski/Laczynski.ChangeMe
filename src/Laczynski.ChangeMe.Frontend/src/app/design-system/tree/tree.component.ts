import {
  Component,
  computed,
  input,
  output,
  signal,
  DestroyRef,
  inject,
  ElementRef,
  viewChild,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IconComponent, IconSize } from '../shared/icon/icon.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';

import {
  ComponentSize,
  ComponentVariant,
  generateComponentId,
  mergeClasses,
  getSizeConfiguration,
} from '../shared';

import {
  TreeNode,
  TreeSelectionMode,
  TreeFilterConfig,
  TreeNodeClickEvent,
  TreeNodeToggleEvent,
  TreeNodeSelectionEvent,
  TreeNodeFocusEvent,
  TreeLoadChildrenEvent,
  TreeStatistics,
  TreeDataSource,
  TreeSearchResult,
  defaultTreeFilter,
} from './tree.model';

/**
 * Modern Angular Tree Component
 *
 * A fully accessible and feature-rich tree component with:
 * - Single and multi-selection modes
 * - Keyboard navigation
 * - Lazy loading support
 * - Filtering and search
 * - Virtual scrolling for performance
 * - Customizable icons and styling
 * - Drag and drop support
 *
 * @example
 * ```html
 * <!-- Basic tree -->
 * <ds-tree [nodes]="treeData"></ds-tree>
 *
 * <!-- Tree with multi-selection -->
 * <ds-tree
 *   [nodes]="treeData"
 *   selectionMode="multiple"
 *   [showCheckboxes]="true"
 *   (nodeSelected)="handleSelection($event)">
 * </ds-tree>
 *
 * <!-- Tree with lazy loading -->
 * <ds-tree
 *   [dataSource]="lazyDataSource"
 *   (loadChildren)="handleLoadChildren($event)">
 * </ds-tree>
 * ```
 */
@Component({
  selector: 'ds-tree',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, CheckboxComponent],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ds-tree-host]': 'true',
    '[class.ds-tree-host--loading]': 'showGlobalLoading()',
    '[class.ds-tree-host--empty]': 'isEmpty()',
    '[class.ds-tree-host--lines]': 'showLines()',
    '[class.ds-tree-host--checkboxes]': 'showCheckboxes()',
  },
})
export class TreeComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);

  // =============================================================================
  // INPUT SIGNALS
  // =============================================================================

  /** Tree nodes data */
  nodes = input<TreeNode[]>([]);

  /** Data source for lazy loading */
  dataSource = input<TreeDataSource | null>(null);

  /** Tree size */
  size = input<ComponentSize>('md');

  /** Tree variant */
  variant = input<ComponentVariant>('primary');

  /** Selection mode */
  selectionMode = input<TreeSelectionMode>('single');

  /** Whether to show selection checkboxes */
  showCheckboxes = input<boolean>(false);

  /** Whether to cascade selection to children */
  cascadeSelection = input<boolean>(true);

  /** Whether to show connecting lines */
  showLines = input<boolean>(true);

  /** Whether to show icons */
  showIcons = input<boolean>(true);

  /** Whether to show node actions */
  showNodeActions = input<boolean>(false);

  /** Whether to enable keyboard navigation */
  keyboardNavigation = input<boolean>(true);

  /** Node indent size in pixels */
  indentSize = input<number>(24);

  /** Maximum height in pixels */
  maxHeight = input<number | null>(null);

  /** Whether tree is loading */
  loading = input<boolean>(false);

  /** Loading text */
  loadingText = input<string>('Loading...');

  /** Empty state text */
  emptyText = input<string>('No items to display');

  /** Search term for filtering */
  searchTerm = input<string>('');

  /** Filter configuration */
  filterConfig = input<TreeFilterConfig>({
    filterFn: defaultTreeFilter,
    showParentsOfMatches: true,
    expandMatches: true,
    caseSensitive: false,
  });

  /** Custom CSS classes */
  customClasses = input<string>('');

  /** Accessibility label */
  ariaLabel = input<string>('');

  // =============================================================================
  // OUTPUT SIGNALS
  // =============================================================================

  /** Node click event */
  nodeClicked = output<TreeNodeClickEvent>();

  /** Node toggle event */
  nodeToggled = output<TreeNodeToggleEvent>();

  /** Node selection event */
  nodeSelected = output<TreeNodeSelectionEvent>();

  /** Node focus event */
  nodeFocused = output<TreeNodeFocusEvent>();

  /** Load children event */
  loadChildren = output<TreeLoadChildrenEvent>();

  // =============================================================================
  // VIEW CHILD
  // =============================================================================

  treeContainer = viewChild.required<ElementRef<HTMLDivElement>>('treeContainer');

  // =============================================================================
  // INTERNAL SIGNALS
  // =============================================================================

  /** Internal nodes with data source support */
  private internalNodesSignal = signal<TreeNode[]>([]);

  // =============================================================================
  // COMPUTED SIGNALS
  // =============================================================================

  componentId = signal(generateComponentId('ds-tree'));

  /** Internal tree nodes with computed properties */
  internalNodes = computed(() => {
    const dataSourceNodes = this.internalNodesSignal();
    const inputNodes = this.nodes();
    const nodesToProcess = dataSourceNodes.length > 0 ? dataSourceNodes : inputNodes;
    return this.processNodes(nodesToProcess);
  });

  /** Filtered nodes based on search term */
  filteredNodes = computed(() => {
    const nodes = this.internalNodes();
    const searchTerm = this.searchTerm();

    // Ensure searchTerm is a string
    if (!searchTerm || typeof searchTerm !== 'string' || !searchTerm.trim()) {
      return nodes;
    }

    return this.filterNodes(nodes, searchTerm);
  });

  /** Visible nodes (flattened hierarchy for rendering) */
  visibleNodes = computed(() => {
    const nodes = this.filteredNodes();
    return this.flattenNodes(nodes);
  });

  /** Search result information */
  searchResult = computed(() => {
    const searchTerm = this.searchTerm();

    // Ensure searchTerm is a string
    if (!searchTerm || typeof searchTerm !== 'string' || !searchTerm.trim()) {
      return null;
    }

    const startTime = performance.now();
    const matches = this.findMatchingNodes(this.internalNodes(), searchTerm);
    const duration = performance.now() - startTime;

    return {
      matches,
      totalMatches: matches.length,
      searchTerm,
      duration,
    } as TreeSearchResult;
  });

  /** Currently focused node */
  focusedNode = signal<TreeNode | null>(null);

  /** Selected nodes */
  selectedNodes = computed(() => {
    return this.getAllSelectedNodes(this.internalNodes());
  });

  /** Tree statistics */
  statistics = computed(() => {
    const nodes = this.internalNodes();
    return this.calculateStatistics(nodes);
  });

  /** Computed CSS classes */
  computedClasses = computed(() => {
    const sizeConfig = getSizeConfiguration(this.size());

    return mergeClasses(
      'ds-tree',
      `ds-tree--${this.variant()}`,
      sizeConfig.className,
      this.showLines() ? 'ds-tree--lines' : null,
      this.showCheckboxes() ? 'ds-tree--checkboxes' : null,
      this.loading() ? 'ds-tree--loading' : null,
      this.customClasses(),
    );
  });

  /** Safe check for empty state without triggering complex filtering */
  isEmpty = computed(() => {
    // Don't show empty during global loading
    if (this.showGlobalLoading()) {
      return false;
    }

    // Simple check - if no raw data, show empty
    const dataSourceNodes = this.internalNodesSignal();
    const inputNodes = this.nodes();

    return dataSourceNodes.length === 0 && inputNodes.length === 0;
  });

  /** Show global loading only when there are no nodes yet */
  showGlobalLoading = computed(() => {
    if (!this.loading()) {
      return false;
    }

    // Check if we have any nodes
    const dataSourceNodes = this.internalNodesSignal();
    const inputNodes = this.nodes();
    const hasNodes = dataSourceNodes.length > 0 || inputNodes.length > 0;

    // Show global loading only when no nodes exist yet
    return !hasNodes;
  });

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  ngOnInit(): void {
    // Load initial data if using data source
    if (this.dataSource()) {
      this.loadRootNodes();
    }
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /** Focus the tree */
  focus(): void {
    this.treeContainer().nativeElement.focus();
  }

  /** Expand node */
  expandNode(node: TreeNode, userTriggered: boolean = true): void {
    if (node.disabled || node.expanded) return;

    // Update the node in the internal state
    this.updateNodeState(node.id, { expanded: true });
    this.emitToggleEvent(node, true, userTriggered);

    // Refresh focused node if this is the focused node
    if (this.focusedNode()?.id === node.id) {
      this.refreshFocusedNode();
    }

    // Load children if using data source
    if (this.dataSource() && this.hasChildren(node) && !node.children?.length) {
      this.loadNodeChildren(node);
    }
  }

  /** Collapse node */
  collapseNode(node: TreeNode, userTriggered: boolean = true): void {
    if (node.disabled || !node.expanded) return;

    // Update the node in the internal state
    this.updateNodeState(node.id, { expanded: false });
    this.emitToggleEvent(node, false, userTriggered);

    // Refresh focused node if this is the focused node
    if (this.focusedNode()?.id === node.id) {
      this.refreshFocusedNode();
    }
  }

  /** Toggle node expansion */
  toggleNode(node: TreeNode, userTriggered: boolean = true): void {
    if (node.expanded) {
      this.collapseNode(node, userTriggered);
    } else {
      this.expandNode(node, userTriggered);
    }
  }

  /** Select node */
  selectNode(node: TreeNode, multiSelect: boolean = false): void {
    if (node.disabled || this.selectionMode() === 'none') return;

    const wasSelected = node.selected || false;

    if (this.selectionMode() === 'single' && !multiSelect) {
      // Clear all selections for single selection mode
      this.clearAllSelections();
    }

    // Update node selection
    this.updateNodeState(node.id, { selected: !wasSelected });

    // Cascade selection if enabled
    if (this.cascadeSelection() && this.selectionMode() === 'multiple') {
      this.cascadeSelectionToChildren(node, !wasSelected);

      // Get fresh node state for parent update
      const freshNode = this.getNodeById(node.id);
      if (freshNode) {
        this.updateParentSelection(freshNode);
      }
    }

    // Refresh focused node if this is the focused node
    if (this.focusedNode()?.id === node.id) {
      this.refreshFocusedNode();
    }

    this.emitSelectionEvent(node, !wasSelected, multiSelect);
  }

  /** Clear all selections */
  clearAllSelections(): void {
    const clearSelection = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        const updatedNode = { ...node, selected: false };
        if (updatedNode.children) {
          updatedNode.children = clearSelection(updatedNode.children);
        }
        return updatedNode;
      });
    };

    // Get current nodes from internal signal
    const currentNodes = this.internalNodesSignal();
    const inputNodes = this.nodes();

    // Use appropriate source
    const sourceNodes = currentNodes.length > 0 ? currentNodes : inputNodes;

    const updatedNodes = clearSelection(sourceNodes);
    this.internalNodesSignal.set(updatedNodes);
  }

  /** Get node by ID */
  getNodeById(id: string | number): TreeNode | null {
    const findNode = (nodes: TreeNode[]): TreeNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findNode(this.internalNodes());
  }

  /** Expand all nodes */
  expandAll(): void {
    const expandRecursively = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        const updatedNode = { ...node };
        if (updatedNode.children?.length) {
          updatedNode.expanded = true;
          updatedNode.children = expandRecursively(updatedNode.children);
        }
        return updatedNode;
      });
    };

    if (this.dataSource()) {
      // For data source, update internal nodes
      const expandedNodes = expandRecursively(this.internalNodesSignal());
      this.internalNodesSignal.set(expandedNodes);
    } else {
      // For static nodes, we need to emit events to parent to update the input
      const nodes = this.internalNodes();
      const expandedNodes = expandRecursively(nodes);
      // Note: This will only work if parent updates the [nodes] input
      console.warn(
        'expandAll() with static nodes requires parent component to handle the state change',
      );
    }
  }

  /** Collapse all nodes */
  collapseAll(): void {
    const collapseRecursively = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        const updatedNode = { ...node };
        if (updatedNode.children?.length) {
          updatedNode.expanded = false;
          updatedNode.children = collapseRecursively(updatedNode.children);
        }
        return updatedNode;
      });
    };

    if (this.dataSource()) {
      // For data source, update internal nodes
      const collapsedNodes = collapseRecursively(this.internalNodesSignal());
      this.internalNodesSignal.set(collapsedNodes);
    } else {
      // For static nodes, we need to emit events to parent to update the input
      const nodes = this.internalNodes();
      const collapsedNodes = collapseRecursively(nodes);
      // Note: This will only work if parent updates the [nodes] input
      console.warn(
        'collapseAll() with static nodes requires parent component to handle the state change',
      );
    }
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  protected handleKeyDown(event: KeyboardEvent): void {
    if (!this.keyboardNavigation()) return;

    let currentNode = this.focusedNode();

    // If no node is focused, focus the first visible node
    if (!currentNode && this.visibleNodes().length > 0) {
      this.focusFirstNode();
      currentNode = this.focusedNode();
    }

    if (!currentNode) return;

    switch (event.code) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusNextNode();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousNode();
        break;
      case 'ArrowRight':
        event.preventDefault();
        // Get fresh node state before checking
        const freshNodeRight = this.getNodeById(currentNode.id) || currentNode;
        if (
          (freshNodeRight.children?.length || this.hasChildren(freshNodeRight)) &&
          !freshNodeRight.expanded
        ) {
          this.expandNode(freshNodeRight);
        } else {
          this.focusNextNode();
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        // Get fresh node state before checking
        const freshNodeLeft = this.getNodeById(currentNode.id) || currentNode;
        if (freshNodeLeft.expanded) {
          this.collapseNode(freshNodeLeft);
        } else if (freshNodeLeft.parent) {
          this.focusNode(freshNodeLeft.parent);
        }
        break;
      case 'Enter':
      case 'Space':
        event.preventDefault();
        // Get fresh node state before checking
        const freshNode = this.getNodeById(currentNode.id) || currentNode;

        // If we have checkboxes in multi-select mode, handle checkbox toggle
        if (this.showCheckboxes() && this.selectionMode() === 'multiple') {
          this.selectNode(freshNode, true);
        }
        // If node has children, toggle expansion
        else if (
          (freshNode.children?.length || this.hasChildren(freshNode)) &&
          !freshNode.disabled
        ) {
          this.toggleNode(freshNode);
        }
        // Otherwise handle selection
        else if (this.selectionMode() !== 'none') {
          this.selectNode(freshNode, event.ctrlKey || event.metaKey);
        }
        break;
      case 'Home':
        event.preventDefault();
        this.focusFirstNode();
        break;
      case 'End':
        event.preventDefault();
        this.focusLastNode();
        break;
    }
  }

  protected handleContainerFocus(event: FocusEvent): void {
    // Only focus first node if no node is focused and this is a real user focus
    if (!this.focusedNode() && this.visibleNodes().length > 0) {
      // Small delay to prevent conflicts with other trees
      setTimeout(() => {
        if (!this.focusedNode()) {
          this.focusNode(this.visibleNodes()[0]);
        }
      }, 10);
    }
  }

  protected handleContainerBlur(event: FocusEvent): void {
    // Keep focused node when container loses focus
  }

  protected handleNodeClick(event: MouseEvent, node: TreeNode): void {
    event.preventDefault();

    this.focusNode(node);

    const isToggle = (event.target as HTMLElement).closest('.ds-tree__toggle') !== null;

    if (isToggle) {
      this.toggleNode(node);
    } else if (this.selectionMode() !== 'none') {
      this.selectNode(node, event.ctrlKey || event.metaKey);
    }

    this.nodeClicked.emit({
      event,
      element: event.currentTarget as HTMLElement,
      timestamp: Date.now(),
      node,
      isToggle,
    });
  }

  protected handleToggleClick(event: MouseEvent, node: TreeNode): void {
    event.stopPropagation();
    this.toggleNode(node);
  }

  protected handleCheckboxChange(event: any, node: TreeNode): void {
    // Update node selection based on checkbox state
    const isSelected = event.checked || false;
    this.updateNodeState(node.id, { selected: isSelected });

    // Handle cascade selection if enabled
    if (this.cascadeSelection()) {
      this.cascadeSelectionToChildren(node, isSelected);

      // Get fresh node state for parent update
      const freshNode = this.getNodeById(node.id);
      if (freshNode) {
        this.updateParentSelection(freshNode);
      }
    }

    // Emit selection event
    this.emitSelectionEvent(node, isSelected, true);
  }

  protected handleNodeFocus(event: FocusEvent, node: TreeNode): void {
    // Only update the focused node state, don't call focusNode again
    // because that would trigger another focus event
    this.focusedNode.set(node);

    this.nodeFocused.emit({
      event,
      element: event.currentTarget as HTMLElement,
      timestamp: Date.now(),
      node,
    });
  }

  protected handleNodeBlur(event: FocusEvent, node: TreeNode): void {
    // Keep node reference for keyboard navigation
  }

  protected handleNodeKeyDown(event: KeyboardEvent, node: TreeNode): void {
    // Individual node key handling if needed
    // Let the event bubble up to container for unified handling
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  protected getIconSize(): IconSize {
    const sizeMap: Record<ComponentSize, IconSize> = {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    };
    return sizeMap[this.size()];
  }

  protected getNodeId(node: TreeNode): string {
    return `${this.componentId()}-node-${node.id}`;
  }

  protected getNodeClasses(node: TreeNode): string {
    return mergeClasses(
      'ds-tree__node',
      node.selected ? 'ds-tree__node--selected' : null,
      node.disabled ? 'ds-tree__node--disabled' : null,
      node.loading ? 'ds-tree__node--loading' : null,
      this.focusedNode()?.id === node.id ? 'ds-tree__node--focused' : null,
      node.customClasses,
    );
  }

  protected getNodeIndentPx(node: TreeNode): string {
    const level = (node.level || 1) - 1;
    return `${level * this.indentSize()}px`;
  }

  protected getNodeIndeterminate(node: TreeNode): boolean {
    if (!node.children?.length || this.selectionMode() !== 'multiple') {
      return false;
    }

    const selectedChildren = node.children.filter(child => child.selected);
    return selectedChildren.length > 0 && selectedChildren.length < node.children.length;
  }

  protected hasChildren(node: TreeNode): boolean {
    if (this.dataSource()) {
      return this.dataSource()!.hasChildren(node);
    }
    return Boolean(node.children?.length);
  }

  protected processNodes(nodes: TreeNode[], parent?: TreeNode, level: number = 1): TreeNode[] {
    return nodes.map(node => {
      const processedNode = { ...node };
      processedNode.parent = parent;
      processedNode.level = level;
      processedNode.visible = processedNode.visible !== false;

      if (processedNode.children) {
        processedNode.children = this.processNodes(
          processedNode.children,
          processedNode,
          level + 1,
        );
      }

      return processedNode;
    });
  }

  protected filterNodes(nodes: TreeNode[], searchTerm: string): TreeNode[] {
    const config = this.filterConfig();

    const filterRecursively = (nodeList: TreeNode[]): TreeNode[] => {
      const filtered: TreeNode[] = [];

      for (const node of nodeList) {
        const nodeMatches = config.filterFn(node, searchTerm);
        let childMatches: TreeNode[] = [];

        if (node.children) {
          childMatches = filterRecursively(node.children);
        }

        const hasChildMatches = childMatches.length > 0;
        const shouldInclude = nodeMatches || (config.showParentsOfMatches && hasChildMatches);

        if (shouldInclude) {
          const filteredNode = { ...node };

          if (hasChildMatches) {
            filteredNode.children = childMatches;
            if (config.expandMatches) {
              filteredNode.expanded = true;
            }
          }

          filtered.push(filteredNode);
        }
      }

      return filtered;
    };

    return filterRecursively(nodes);
  }

  protected flattenNodes(nodes: TreeNode[]): TreeNode[] {
    const flattened: TreeNode[] = [];

    const flattenRecursively = (nodeList: TreeNode[]) => {
      nodeList.forEach(node => {
        if (node.visible !== false) {
          flattened.push(node);

          if (node.expanded && node.children) {
            flattenRecursively(node.children);
          }
        }
      });
    };

    flattenRecursively(nodes);
    return flattened;
  }

  protected findMatchingNodes(nodes: TreeNode[], searchTerm: string): TreeNode[] {
    const matches: TreeNode[] = [];
    const config = this.filterConfig();

    const searchRecursively = (nodeList: TreeNode[]) => {
      nodeList.forEach(node => {
        if (config.filterFn(node, searchTerm)) {
          matches.push(node);
        }

        if (node.children) {
          searchRecursively(node.children);
        }
      });
    };

    searchRecursively(nodes);
    return matches;
  }

  protected getAllSelectedNodes(nodes: TreeNode[]): TreeNode[] {
    const selected: TreeNode[] = [];

    const collectSelected = (nodeList: TreeNode[]) => {
      nodeList.forEach(node => {
        if (node.selected) {
          selected.push(node);
        }

        if (node.children) {
          collectSelected(node.children);
        }
      });
    };

    collectSelected(nodes);
    return selected;
  }

  protected calculateStatistics(nodes: TreeNode[]): TreeStatistics {
    let totalNodes = 0;
    let visibleNodes = 0;
    let selectedNodes = 0;
    let expandedNodes = 0;
    let maxDepth = 0;

    const calculateRecursively = (nodeList: TreeNode[], depth: number = 1) => {
      maxDepth = Math.max(maxDepth, depth);

      nodeList.forEach(node => {
        totalNodes++;

        if (node.visible !== false) {
          visibleNodes++;
        }

        if (node.selected) {
          selectedNodes++;
        }

        if (node.expanded) {
          expandedNodes++;
        }

        if (node.children) {
          calculateRecursively(node.children, depth + 1);
        }
      });
    };

    calculateRecursively(nodes);

    return {
      totalNodes,
      visibleNodes,
      selectedNodes,
      expandedNodes,
      maxDepth,
    };
  }

  protected focusNode(node: TreeNode): void {
    // Prevent focusing the same node twice
    if (this.focusedNode()?.id === node.id) {
      return;
    }

    this.focusedNode.set(node);

    // Focus the DOM element with a slight delay to ensure it's rendered
    setTimeout(() => {
      const nodeElement = document.getElementById(this.getNodeId(node));
      if (nodeElement) {
        try {
          nodeElement.focus();
        } catch (error) {
          console.warn('Failed to focus node element:', error);
        }
      }
    }, 0);
  }

  /** Refresh the focused node with current state from tree */
  protected refreshFocusedNode(): void {
    const currentFocused = this.focusedNode();
    if (currentFocused) {
      const updatedNode = this.getNodeById(currentFocused.id);
      if (updatedNode) {
        this.focusedNode.set(updatedNode);
      }
    }
  }

  protected focusNextNode(): void {
    const visibleNodes = this.visibleNodes();
    const currentNode = this.focusedNode();

    if (!currentNode || visibleNodes.length === 0) return;

    const currentIndex = visibleNodes.findIndex(node => node.id === currentNode.id);
    if (currentIndex < visibleNodes.length - 1) {
      this.focusNode(visibleNodes[currentIndex + 1]);
    }
  }

  protected focusPreviousNode(): void {
    const visibleNodes = this.visibleNodes();
    const currentNode = this.focusedNode();

    if (!currentNode || visibleNodes.length === 0) return;

    const currentIndex = visibleNodes.findIndex(node => node.id === currentNode.id);
    if (currentIndex > 0) {
      this.focusNode(visibleNodes[currentIndex - 1]);
    }
  }

  protected focusFirstNode(): void {
    const visibleNodes = this.visibleNodes();
    if (visibleNodes.length > 0) {
      this.focusNode(visibleNodes[0]);
    }
  }

  protected focusLastNode(): void {
    const visibleNodes = this.visibleNodes();
    if (visibleNodes.length > 0) {
      this.focusNode(visibleNodes[visibleNodes.length - 1]);
    }
  }

  protected cascadeSelectionToChildren(node: TreeNode, selected: boolean): void {
    if (node.children) {
      const updateChildrenRecursively = (children: TreeNode[]): TreeNode[] => {
        return children.map(child => {
          if (!child.disabled) {
            const updatedChild = { ...child, selected };
            if (updatedChild.children) {
              updatedChild.children = updateChildrenRecursively(updatedChild.children);
            }
            return updatedChild;
          }
          return child;
        });
      };

      // Get current nodes from internal signal
      const currentNodes = this.internalNodesSignal();
      const inputNodes = this.nodes();

      // Use appropriate source
      const sourceNodes = currentNodes.length > 0 ? currentNodes : inputNodes;

      // Update the entire tree structure
      const updatedNodes = this.updateNodeInTree(sourceNodes, node.id, {
        children: updateChildrenRecursively(node.children),
      });
      this.internalNodesSignal.set(updatedNodes);
    }
  }

  protected updateParentSelection(node: TreeNode): void {
    if (!node.parent) return;

    // Get fresh parent node with current state
    const freshParentNode = this.getNodeById(node.parent.id);
    if (!freshParentNode || !freshParentNode.children) return;

    const siblings = freshParentNode.children;
    const enabledSiblings = siblings.filter(s => !s.disabled);
    const selectedSiblings = siblings.filter(sibling => sibling.selected && !sibling.disabled);

    let parentSelected = false;
    if (selectedSiblings.length === enabledSiblings.length && enabledSiblings.length > 0) {
      // All enabled siblings selected
      parentSelected = true;
    } else {
      // Not all siblings selected - parent should be unselected
      parentSelected = false;
    }

    // Get current nodes from internal signal
    const currentNodes = this.internalNodesSignal();
    const inputNodes = this.nodes();

    // Use appropriate source
    const sourceNodes = currentNodes.length > 0 ? currentNodes : inputNodes;

    // Update parent selection
    const updatedNodes = this.updateNodeInTree(sourceNodes, freshParentNode.id, {
      selected: parentSelected,
    });
    this.internalNodesSignal.set(updatedNodes);

    // Continue up the tree with fresh parent node
    const updatedParent = this.getNodeById(freshParentNode.id);
    if (updatedParent) {
      this.updateParentSelection(updatedParent);
    }
  }

  private updateNodeState(nodeId: string | number, updates: Partial<TreeNode>): void {
    // Always work with internal nodes for state updates
    const currentNodes = this.internalNodesSignal();
    const inputNodes = this.nodes();

    // If we have internal nodes (data source), update them
    // Otherwise, update will apply to computed internalNodes from input
    if (currentNodes.length > 0) {
      const updatedNodes = this.updateNodeInTree(currentNodes, nodeId, updates);
      this.internalNodesSignal.set(updatedNodes);
    } else {
      // For input nodes, we need to update the input signal
      // But since it's an input, we can't directly modify it
      // Instead, we'll work with a copy in internal signal
      const nodesCopy = this.updateNodeInTree([...inputNodes], nodeId, updates);
      this.internalNodesSignal.set(nodesCopy);
    }
  }

  private updateNodeInTree(
    nodes: TreeNode[],
    nodeId: string | number,
    updates: Partial<TreeNode>,
  ): TreeNode[] {
    return nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return {
          ...node,
          children: this.updateNodeInTree(node.children, nodeId, updates),
        };
      }
      return node;
    });
  }

  protected async loadRootNodes(): Promise<void> {
    if (!this.dataSource()) return;

    try {
      const rootNodes = await this.dataSource()!.getRootNodes();
      const processedRootNodes = this.processNodes(rootNodes);

      this.internalNodesSignal.set(processedRootNodes);

      // If any root nodes are pre-selected and have children, apply cascade selection
      if (this.cascadeSelection() && this.selectionMode() === 'multiple') {
        const nodesWithCascade = processedRootNodes.map(node => {
          if (node.selected && node.children) {
            return {
              ...node,
              children: this.applyCascadeSelectionToChildren(node.children, true),
            };
          }
          return node;
        });

        this.internalNodesSignal.set(nodesWithCascade);
      }
    } catch (error) {
      console.error('Failed to load root nodes:', error);
    }
  }

  protected async loadNodeChildren(node: TreeNode): Promise<void> {
    if (!this.dataSource() || node.loading) return;

    // Set loading state
    this.updateNodeState(node.id, { loading: true });

    try {
      const children = await this.dataSource()!.getChildren(node);
      const processedChildren = this.processNodes(children, node, (node.level || 1) + 1);

      // Check if parent is selected and cascade selection is enabled
      const freshParentNode = this.getNodeById(node.id);
      const shouldCascadeSelection =
        this.cascadeSelection() && this.selectionMode() === 'multiple' && freshParentNode?.selected;

      // Apply cascade selection to newly loaded children if needed
      const finalChildren = shouldCascadeSelection
        ? this.applyCascadeSelectionToChildren(processedChildren, true)
        : processedChildren;

      // Update node with children and clear loading state
      this.updateNodeState(node.id, {
        children: finalChildren,
        loading: false,
      });

      // Update parent selection state if cascade selection is enabled
      if (this.cascadeSelection() && this.selectionMode() === 'multiple') {
        const updatedParentNode = this.getNodeById(node.id);
        if (updatedParentNode) {
          this.updateParentSelection(updatedParentNode);
        }
      }

      this.loadChildren.emit({
        event: new Event('loadChildren'),
        element: this.elementRef.nativeElement,
        timestamp: Date.now(),
        node,
        callback: (loadedChildren: TreeNode[]) => {
          const processedCallback = this.processNodes(loadedChildren, node, (node.level || 1) + 1);

          // Apply cascade selection to callback children if needed
          const finalCallbackChildren = shouldCascadeSelection
            ? this.applyCascadeSelectionToChildren(processedCallback, true)
            : processedCallback;

          this.updateNodeState(node.id, { children: finalCallbackChildren });
        },
      });
    } catch (error) {
      console.error('Failed to load children for node:', node.id, error);
      this.updateNodeState(node.id, { loading: false });
    }
  }

  /** Apply cascade selection to children array (helper method) */
  private applyCascadeSelectionToChildren(children: TreeNode[], selected: boolean): TreeNode[] {
    return children.map(child => {
      if (!child.disabled) {
        const updatedChild = { ...child, selected };
        if (updatedChild.children) {
          updatedChild.children = this.applyCascadeSelectionToChildren(
            updatedChild.children,
            selected,
          );
        }
        return updatedChild;
      }
      return child;
    });
  }

  protected emitToggleEvent(node: TreeNode, expanded: boolean, userTriggered: boolean): void {
    this.nodeToggled.emit({
      event: new Event('toggle'),
      element: this.elementRef.nativeElement,
      timestamp: Date.now(),
      node,
      expanded,
      userTriggered,
    });
  }

  protected emitSelectionEvent(node: TreeNode, selected: boolean, multiSelect: boolean): void {
    this.nodeSelected.emit({
      event: new Event('selection'),
      element: this.elementRef.nativeElement,
      timestamp: Date.now(),
      node,
      selected,
      selectedNodes: this.selectedNodes(),
      multiSelect,
    });
  }
}
