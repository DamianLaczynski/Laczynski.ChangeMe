// =============================================================================
// Tree Component Exports
// =============================================================================
// Central export file for the tree component module

// Component exports
export { TreeComponent } from './tree.component';
export { TreeShowcaseComponent } from './tree-showcase.component';

// Model and interface exports
export type {
  // Core interfaces
  TreeNode,
  TreeNodeBase,
  FlatTreeNode,
  TreeConfig,
  TreeSelectionConfig,
  TreeFilterConfig,
  TreeStatistics,
  TreeNodePosition,
  TreeDataSource,
  TreeSearchResult,

  // Event interfaces
  TreeNodeClickEvent,
  TreeNodeToggleEvent,
  TreeNodeSelectionEvent,
  TreeNodeFocusEvent,
  TreeLoadChildrenEvent,

  // Type definitions
  TreeSelectionMode,
  TreeFilterFunction,
} from './tree.model';

// Value exports
export {
  // Default configurations
  DEFAULT_TREE_CONFIG,
  defaultTreeFilter,
} from './tree.model';
