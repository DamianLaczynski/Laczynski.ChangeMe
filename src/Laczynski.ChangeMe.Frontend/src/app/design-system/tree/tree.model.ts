// =============================================================================
// Tree Component Models and Interfaces
// =============================================================================
// Data models and interfaces for the tree component

import {
  ComponentSize,
  ComponentVariant,
  BaseComponentEvent,
  ComponentClickEvent,
  ComponentFocusEvent,
} from '../shared';

import { IconName } from '../shared/icon/icon.component';

// =============================================================================
// TREE NODE INTERFACES
// =============================================================================

/**
 * Base tree node interface
 */
export interface TreeNodeBase {
  /** Unique identifier for the node */
  id: string | number;
  /** Display label for the node */
  label: string;
  /** Optional icon for the node */
  icon?: IconName;
  /** Whether the node is disabled */
  disabled?: boolean;
  /** Whether the node is visible */
  visible?: boolean;
  /** Custom CSS classes for the node */
  customClasses?: string;
  /** Additional data attached to the node */
  data?: Record<string, any>;
}

/**
 * Tree node with children support
 */
export interface TreeNode extends TreeNodeBase {
  /** Child nodes */
  children?: TreeNode[];
  /** Whether the node is expanded (has children) */
  expanded?: boolean;
  /** Whether the node is selected */
  selected?: boolean;
  /** Whether the node is loading children */
  loading?: boolean;
  /** Parent node reference (computed) */
  parent?: TreeNode;
  /** Node level/depth (computed) */
  level?: number;
}

/**
 * Flat tree node for virtual scrolling and performance
 */
export interface FlatTreeNode extends TreeNodeBase {
  /** Whether the node is expandable */
  expandable: boolean;
  /** Whether the node is expanded */
  expanded: boolean;
  /** Whether the node is selected */
  selected: boolean;
  /** Node level/depth */
  level: number;
  /** Whether the node is loading */
  loading: boolean;
  /** Original tree node reference */
  original: TreeNode;
}

// =============================================================================
// EVENT INTERFACES
// =============================================================================

/**
 * Tree node click event
 */
export interface TreeNodeClickEvent extends ComponentClickEvent<HTMLElement> {
  /** The clicked node */
  node: TreeNode;
  /** Whether this was a toggle action */
  isToggle: boolean;
}

/**
 * Tree node expand/collapse event
 */
export interface TreeNodeToggleEvent extends BaseComponentEvent<HTMLElement> {
  /** The toggled node */
  node: TreeNode;
  /** Whether the node is now expanded */
  expanded: boolean;
  /** Whether this action was triggered by user interaction */
  userTriggered: boolean;
}

/**
 * Tree node selection event
 */
export interface TreeNodeSelectionEvent extends BaseComponentEvent<HTMLElement> {
  /** The selected/deselected node */
  node: TreeNode;
  /** Whether the node is now selected */
  selected: boolean;
  /** All currently selected nodes */
  selectedNodes: TreeNode[];
  /** Whether this was a multi-selection action */
  multiSelect: boolean;
}

/**
 * Tree node focus event
 */
export interface TreeNodeFocusEvent extends ComponentFocusEvent<HTMLElement> {
  /** The focused node */
  node: TreeNode;
}

/**
 * Tree load children event
 */
export interface TreeLoadChildrenEvent extends BaseComponentEvent<HTMLElement> {
  /** The parent node whose children should be loaded */
  node: TreeNode;
  /** Callback to provide the loaded children */
  callback: (children: TreeNode[]) => void;
}

// =============================================================================
// SELECTION INTERFACES
// =============================================================================

/**
 * Tree selection mode
 */
export type TreeSelectionMode = 'none' | 'single' | 'multiple';

/**
 * Tree selection configuration
 */
export interface TreeSelectionConfig {
  /** Selection mode */
  mode: TreeSelectionMode;
  /** Whether to show selection checkboxes */
  showCheckboxes: boolean;
  /** Whether to cascade selection to children */
  cascadeSelection: boolean;
  /** Whether to require parent selection for child selection */
  requireParentSelection: boolean;
}

// =============================================================================
// TREE CONFIGURATION
// =============================================================================

/**
 * Tree component configuration
 */
export interface TreeConfig {
  /** Tree size */
  size: ComponentSize;
  /** Tree variant */
  variant: ComponentVariant;
  /** Whether to show connecting lines */
  showLines: boolean;
  /** Whether to show root lines */
  showRootLines: boolean;
  /** Whether to show icons */
  showIcons: boolean;
  /** Whether to enable keyboard navigation */
  keyboardNavigation: boolean;
  /** Whether to enable drag and drop */
  dragAndDrop: boolean;
  /** Whether to enable virtual scrolling */
  virtualScrolling: boolean;
  /** Node height for virtual scrolling */
  nodeHeight: number;
  /** Indent size in pixels */
  indentSize: number;
  /** Animation duration in milliseconds */
  animationDuration: number;
}

/**
 * Default tree configuration
 */
export const DEFAULT_TREE_CONFIG: TreeConfig = {
  size: 'md',
  variant: 'primary',
  showLines: true,
  showRootLines: false,
  showIcons: true,
  keyboardNavigation: true,
  dragAndDrop: false,
  virtualScrolling: false,
  nodeHeight: 32,
  indentSize: 24,
  animationDuration: 200,
};

// =============================================================================
// TREE FILTER INTERFACES
// =============================================================================

/**
 * Tree filter function
 */
export type TreeFilterFunction = (node: TreeNode, searchTerm: string) => boolean;

/**
 * Tree filter configuration
 */
export interface TreeFilterConfig {
  /** Filter function */
  filterFn: TreeFilterFunction;
  /** Whether to show parent nodes when children match */
  showParentsOfMatches: boolean;
  /** Whether to expand nodes with matches */
  expandMatches: boolean;
  /** Case sensitive filtering */
  caseSensitive: boolean;
}

/**
 * Default tree filter function - filters by label
 */
export const defaultTreeFilter: TreeFilterFunction = (
  node: TreeNode,
  searchTerm: string,
): boolean => {
  return node.label.toLowerCase().includes(searchTerm.toLowerCase());
};

// =============================================================================
// TREE UTILITY INTERFACES
// =============================================================================

/**
 * Tree statistics
 */
export interface TreeStatistics {
  /** Total number of nodes */
  totalNodes: number;
  /** Number of visible nodes */
  visibleNodes: number;
  /** Number of selected nodes */
  selectedNodes: number;
  /** Number of expanded nodes */
  expandedNodes: number;
  /** Maximum depth */
  maxDepth: number;
}

/**
 * Tree node position
 */
export interface TreeNodePosition {
  /** Node reference */
  node: TreeNode;
  /** Parent node */
  parent: TreeNode | null;
  /** Node index among siblings */
  index: number;
  /** Node level/depth */
  level: number;
  /** Whether node is first child */
  isFirst: boolean;
  /** Whether node is last child */
  isLast: boolean;
}

// =============================================================================
// TREE DATA SOURCE INTERFACES
// =============================================================================

/**
 * Tree data source interface for lazy loading
 */
export interface TreeDataSource {
  /** Load root nodes */
  getRootNodes(): Promise<TreeNode[]> | TreeNode[];
  /** Load children for a node */
  getChildren(node: TreeNode): Promise<TreeNode[]> | TreeNode[];
  /** Check if node has children */
  hasChildren(node: TreeNode): boolean;
}

/**
 * Tree search result
 */
export interface TreeSearchResult {
  /** Matching nodes */
  matches: TreeNode[];
  /** Total number of matches */
  totalMatches: number;
  /** Search term used */
  searchTerm: string;
  /** Search duration in milliseconds */
  duration: number;
}
