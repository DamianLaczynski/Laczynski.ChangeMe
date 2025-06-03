// =============================================================================
// List Showcase Component
// =============================================================================
// Comprehensive demonstration of the List component features

import { Component, signal, computed, OnInit, inject, TemplateRef, viewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentSize } from '../shared';
import { ListComponent } from './list.component';
import { ListVariant, ListLayout, ListSelectionMode } from './list.model';
import { ApiDocumentationComponent } from '../showcases/api-documentation';
import {
  InteractiveConfigChangeEvent,
  InteractiveExampleComponent,
  InteractiveExampleConfig,
} from '../showcases/interactive-example';
import { createCheckboxControl, createSelectControl } from '../showcases/interactive-example';

import {
  ListConfig,
  ListItemClickEvent,
  ListItemSelectEvent,
  ListScrollEvent,
  ListLoadMoreEvent,
  createListConfig,
  createListItem,
  PaginationResult,
  State,
} from './list.model';

import {
  ShowcaseComponent,
  ComponentApiDocumentation,
  createShowcaseConfig,
  ShowcaseConfig,
} from '../showcases/showcase.model';

import { StateService } from '../../shared/state/services/state.service';
import { ButtonComponent } from '../button';
import { IconComponent } from '../shared/icon/icon.component';

// Demo data interfaces
interface DemoTask {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: Date;
  tags: string[];
  completed?: boolean;
  disabled?: boolean;
}

// =============================================================================
// LIST INTERACTIVE CONFIG TYPE
// =============================================================================

interface ListInteractiveConfig {
  variant: ListVariant;
  size: ComponentSize;
  layout: ListLayout;
  selectionMode: ListSelectionMode;
  showSearch: boolean;
  striped: boolean;
  hoverable: boolean;
  showDividers: boolean;
  virtualScroll: boolean;
  infiniteScroll: boolean;
}

/**
 * List Showcase Component
 *
 * Comprehensive demonstration of the List component features including:
 * - All visual variants and sizes
 * - Different layouts (vertical, horizontal, grid, masonry)
 * - Selection modes (none, single, multiple)
 * - Virtual scrolling for performance
 * - Infinite scrolling with pagination
 * - Search and filtering
 * - Custom templates
 * - Empty states and loading indicators
 * - Responsive design
 */
@Component({
  selector: 'ds-list-showcase',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ListComponent,
    ButtonComponent,
    IconComponent,
    FormsModule,
    ApiDocumentationComponent,
    InteractiveExampleComponent,
  ],
  template: `
    <div class="showcase-container">
      <!-- Header -->
      <div class="showcase-header">
        <h1>{{ showcaseConfig().component.componentName }}</h1>
        <p class="showcase-description">
          {{ showcaseConfig().component.description }}
        </p>
      </div>

      <!-- Interactive Example using new component -->
      <ds-interactive-example
        [config]="interactiveConfig()"
        [currentConfig]="interactiveListConfig()"
        [lastAction]="lastAction"
        (configChange)="onInteractiveConfigChange($event)"
      >
        <ds-list
          [variant]="interactiveListConfig().variant"
          [size]="interactiveListConfig().size"
          [layout]="interactiveListConfig().layout"
          [selectionMode]="interactiveListConfig().selectionMode"
          [striped]="interactiveListConfig().striped"
          [hoverable]="interactiveListConfig().hoverable"
          [showDividers]="interactiveListConfig().showDividers"
          [showSearch]="interactiveListConfig().showSearch"
          [showSelectAll]="interactiveListConfig().selectionMode === 'multiple'"
          [virtualScroll]="interactiveListConfig().virtualScroll"
          [infiniteScroll]="interactiveListConfig().infiniteScroll"
          [containerHeight]="'400px'"
          [items]="demoTasks()"
          [itemTemplate]="taskTemplate"
          [searchFields]="['title', 'description', 'assignee']"
          [selectedItems]="selectedTasks()"
          (itemClick)="onItemClick($event)"
          (itemSelect)="onItemSelect($event)"
          (searchChange)="onSearchChange($event)"
          (scroll)="onScroll($event)"
          (loadMore)="onLoadMore($event)"
        />
      </ds-interactive-example>

      <!-- Variants -->
      <section class="showcase-section">
        <h2>List Variants</h2>
        <p>Different visual styles for various use cases:</p>

        <div class="showcase-grid">
          @for (variant of variants; track variant.value) {
            <div class="showcase-item">
              <h3>{{ variant.label }}</h3>
              <ds-list
                [variant]="variant.value"
                [items]="smallTaskList()"
                [itemTemplate]="simpleTaskTemplate"
                [showHeader]="false"
                [containerHeight]="'200px'"
              />
            </div>
          }
        </div>
      </section>

      <!-- Sizes -->
      <section class="showcase-section">
        <h2>List Sizes</h2>
        <p>Different sizes for various layouts:</p>

        <div class="showcase-grid">
          @for (size of sizes; track size.value) {
            <div class="showcase-item">
              <h3>{{ size.label }}</h3>
              <ds-list
                [size]="size.value"
                [items]="smallTaskList()"
                [itemTemplate]="simpleTaskTemplate"
                [showHeader]="false"
                [containerHeight]="'200px'"
              />
            </div>
          }
        </div>
      </section>

      <!-- Layouts -->
      <section class="showcase-section">
        <h2>Layout Types</h2>
        <p>Different layout arrangements:</p>

        <div class="showcase-grid">
          @for (layout of layouts; track layout.value) {
            <div class="showcase-item">
              <h3>{{ layout.label }}</h3>
              <ds-list
                [layout]="layout.value"
                [items]="smallTaskList()"
                [itemTemplate]="cardTaskTemplate"
                [showHeader]="false"
                [containerHeight]="'300px'"
                [hoverable]="true"
              />
            </div>
          }
        </div>
      </section>

      <!-- Selection Modes -->
      <section class="showcase-section">
        <h2>Selection Modes</h2>
        <p>Different selection behaviors:</p>

        <div class="showcase-grid">
          @for (mode of selectionModes; track mode.value) {
            <div class="showcase-item">
              <h3>{{ mode.label }}</h3>
              <ds-list
                [selectionMode]="mode.value"
                [showSelectAll]="mode.value === 'multiple'"
                [items]="smallTaskList()"
                [itemTemplate]="simpleTaskTemplate"
                [showHeader]="mode.value !== 'none'"
                [containerHeight]="'250px'"
              />
            </div>
          }
        </div>
      </section>

      <!-- Empty States -->
      <section class="showcase-section">
        <h2>Empty States & Loading</h2>
        <p>How the list handles different states:</p>

        <div class="showcase-grid">
          <div class="showcase-item">
            <h3>Loading State</h3>
            <ds-list
              [items]="[]"
              [loading]="true"
              [showHeader]="false"
              [containerHeight]="'200px'"
            />
          </div>

          <div class="showcase-item">
            <h3>Empty State</h3>
            <ds-list
              [items]="[]"
              [emptyTitle]="'No tasks found'"
              [emptyMessage]="'Create your first task to get started'"
              [emptyIcon]="'📝'"
              [showHeader]="false"
              [containerHeight]="'200px'"
            />
          </div>

          <div class="showcase-item">
            <h3>Custom Empty Template</h3>
            <ds-list
              [items]="[]"
              [emptyTemplate]="customEmptyTemplate"
              [showHeader]="false"
              [containerHeight]="'200px'"
            />
          </div>
        </div>
      </section>

      <!-- Component API -->
      <section class="showcase-section">
        <h2>Component API</h2>
        <ds-api-documentation [api]="showcaseConfig().api" />
      </section>

      <!-- Templates -->
      <ng-template #taskTemplate let-item>
        <div class="task-item">
          <div class="task-header">
            <h4 class="task-title">{{ item.title }}</h4>
            <span class="task-priority" [class]="'priority-' + item.priority">
              {{ item.priority | titlecase }}
            </span>
          </div>
          <div class="task-description">{{ item.description }}</div>
          <div class="task-meta">
            <span class="task-assignee">
              <app-icon name="user" size="sm"></app-icon>
              {{ item.assignee }}
            </span>
            <span class="task-status" [class]="'status-' + item.status">
              {{ getStatusLabel(item.status) }}
            </span>
            <span class="task-due">
              <app-icon name="calendar" size="sm"></app-icon>
              {{ item.dueDate | date: 'shortDate' }}
            </span>
          </div>
          @if (item.tags.length > 0) {
            <div class="task-tags">
              @for (tag of item.tags; track tag) {
                <span class="task-tag">{{ tag }}</span>
              }
            </div>
          }
        </div>
      </ng-template>

      <ng-template #simpleTaskTemplate let-item>
        <div class="simple-task">
          <span class="simple-task-title">{{ item.title }}</span>
          <span class="simple-task-assignee">{{ item.assignee }}</span>
        </div>
      </ng-template>

      <ng-template #cardTaskTemplate let-item>
        <div class="card-task">
          <div class="card-task-header">
            <h4 class="card-task-title">{{ item.title }}</h4>
            <span class="card-task-priority" [class]="'priority-' + item.priority">
              {{ item.priority }}
            </span>
          </div>
          <p class="card-task-description">{{ item.description }}</p>
          <div class="card-task-footer">
            <span class="card-task-assignee">{{ item.assignee }}</span>
            <span class="card-task-status" [class]="'status-' + item.status">
              {{ getStatusLabel(item.status) }}
            </span>
          </div>
        </div>
      </ng-template>

      <ng-template #customEmptyTemplate>
        <div class="custom-empty">
          <div class="custom-empty-icon">
            <app-icon name="star" size="xl" color="primary"></app-icon>
          </div>
          <h3 class="custom-empty-title">Ready to Get Productive?</h3>
          <p class="custom-empty-message">
            Create your first task and start organizing your work efficiently.
          </p>
          <ds-button variant="primary" (clicked)="createSampleTask()">
            Create Sample Task
          </ds-button>
        </div>
      </ng-template>
    </div>
  `,
  styleUrl: '../showcases/showcase.scss',
})
export class ListShowcaseComponent implements ShowcaseComponent, OnInit {
  componentName = 'List Component';
  description =
    'Flexible and powerful list component supporting multiple layouts, selection modes, virtual scrolling, infinite scroll, and custom templates.';

  private readonly stateService = inject(StateService);

  // Template references
  taskTemplate = viewChild<TemplateRef<any>>('taskTemplate');
  simpleTaskTemplate = viewChild<TemplateRef<any>>('simpleTaskTemplate');
  cardTaskTemplate = viewChild<TemplateRef<any>>('cardTaskTemplate');
  customEmptyTemplate = viewChild<TemplateRef<any>>('customEmptyTemplate');

  // =============================================================================
  // SHOWCASE DATA
  // =============================================================================

  readonly variantOptions = [
    { value: 'default', label: 'Default' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'bordered', label: 'Bordered' },
    { value: 'elevated', label: 'Elevated' },
    { value: 'flush', label: 'Flush' },
  ];

  readonly sizeOptions = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
  ];

  readonly layoutOptions = [
    { value: 'vertical', label: 'Vertical' },
    { value: 'horizontal', label: 'Horizontal' },
    { value: 'grid', label: 'Grid' },
    { value: 'masonry', label: 'Masonry' },
  ];

  readonly selectionModeOptions = [
    { value: 'none', label: 'None' },
    { value: 'single', label: 'Single' },
    { value: 'multiple', label: 'Multiple' },
  ];

  readonly variants = [
    { value: 'default' as ListVariant, label: 'Default' },
    { value: 'minimal' as ListVariant, label: 'Minimal' },
    { value: 'bordered' as ListVariant, label: 'Bordered' },
    { value: 'elevated' as ListVariant, label: 'Elevated' },
    { value: 'flush' as ListVariant, label: 'Flush' },
  ];

  readonly sizes = [
    { value: 'sm' as ComponentSize, label: 'Small' },
    { value: 'md' as ComponentSize, label: 'Medium' },
    { value: 'lg' as ComponentSize, label: 'Large' },
  ];

  readonly layouts = [
    { value: 'vertical' as ListLayout, label: 'Vertical' },
    { value: 'horizontal' as ListLayout, label: 'Horizontal' },
    { value: 'grid' as ListLayout, label: 'Grid' },
    { value: 'masonry' as ListLayout, label: 'Masonry' },
  ];

  readonly selectionModes = [
    { value: 'none' as ListSelectionMode, label: 'None' },
    { value: 'single' as ListSelectionMode, label: 'Single' },
    { value: 'multiple' as ListSelectionMode, label: 'Multiple' },
  ];

  // =============================================================================
  // INTERACTIVE EXAMPLE CONFIGURATION
  // =============================================================================

  private interactiveListConfigSignal = signal<ListInteractiveConfig>({
    variant: 'default',
    size: 'md',
    layout: 'vertical',
    selectionMode: 'multiple',
    showSearch: true,
    striped: false,
    hoverable: true,
    showDividers: true,
    virtualScroll: false,
    infiniteScroll: false,
  });

  readonly interactiveListConfig = computed(() => this.interactiveListConfigSignal());

  readonly interactiveConfig = computed<InteractiveExampleConfig>(() => ({
    title: 'Interactive List Example',
    description: 'Customize the list properties using the controls below.',
    controls: [
      createSelectControl('variant', 'Variant', 'variant', [
        { value: 'default', label: 'Default' },
        { value: 'outlined', label: 'Outlined' },
        { value: 'filled', label: 'Filled' },
        { value: 'elevated', label: 'Elevated' },
      ]),
      createSelectControl('size', 'Size', 'size', [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
      ]),
      createSelectControl('layout', 'Layout', 'layout', [
        { value: 'vertical', label: 'Vertical' },
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'grid', label: 'Grid' },
        { value: 'masonry', label: 'Masonry' },
      ]),
      createSelectControl('selectionMode', 'Selection Mode', 'selectionMode', [
        { value: 'none', label: 'None' },
        { value: 'single', label: 'Single' },
        { value: 'multiple', label: 'Multiple' },
      ]),
      createCheckboxControl('showSearch', 'Show Search', 'showSearch'),
      createCheckboxControl('striped', 'Striped', 'striped'),
      createCheckboxControl('hoverable', 'Hoverable', 'hoverable'),
      createCheckboxControl('showDividers', 'Show Dividers', 'showDividers'),
      createCheckboxControl('virtualScroll', 'Virtual Scroll', 'virtualScroll'),
      createCheckboxControl('infiniteScroll', 'Infinite Scroll', 'infiniteScroll'),
    ],
    showOutput: true,
  }));

  // =============================================================================
  // SHOWCASE STATE
  // =============================================================================

  selectedTasks = signal<DemoTask[]>([]);
  protected readonly lastActionSignal = signal<string>('');

  // Getter to implement ShowcaseComponent interface
  get lastAction(): string {
    return this.lastActionSignal();
  }

  // =============================================================================
  // DEMO DATA
  // =============================================================================

  private readonly demoTasksData: DemoTask[] = [
    {
      id: 1,
      title: 'Design System Documentation',
      description: 'Create comprehensive documentation for all UI components',
      status: 'in-progress',
      priority: 'high',
      assignee: 'Alice Johnson',
      dueDate: new Date('2024-02-15'),
      tags: ['documentation', 'design-system', 'ui'],
    },
    {
      id: 2,
      title: 'Implement Dark Theme',
      description: 'Add dark theme support across all components',
      status: 'todo',
      priority: 'medium',
      assignee: 'Bob Smith',
      dueDate: new Date('2024-02-20'),
      tags: ['theme', 'css', 'accessibility'],
    },
    {
      id: 3,
      title: 'Performance Optimization',
      description: 'Optimize component rendering and bundle size',
      status: 'done',
      priority: 'high',
      assignee: 'Charlie Brown',
      dueDate: new Date('2024-01-30'),
      tags: ['performance', 'optimization'],
    },
    {
      id: 4,
      title: 'Accessibility Audit',
      description: 'Conduct comprehensive accessibility testing',
      status: 'todo',
      priority: 'high',
      assignee: 'Diana Prince',
      dueDate: new Date('2024-02-25'),
      tags: ['accessibility', 'testing', 'a11y'],
    },
    {
      id: 5,
      title: 'Mobile Responsiveness',
      description: 'Ensure all components work well on mobile devices',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Eve Wilson',
      dueDate: new Date('2024-02-18'),
      tags: ['mobile', 'responsive', 'css'],
    },
    {
      id: 6,
      title: 'Component Testing',
      description: 'Write comprehensive unit tests for all components',
      status: 'todo',
      priority: 'medium',
      assignee: 'Frank Miller',
      dueDate: new Date('2024-03-01'),
      tags: ['testing', 'unit-tests', 'jest'],
    },
    {
      id: 7,
      title: 'Animation System',
      description: 'Implement consistent animation system',
      status: 'todo',
      priority: 'low',
      assignee: 'Grace Lee',
      dueDate: new Date('2024-03-10'),
      tags: ['animation', 'css', 'transitions'],
    },
    {
      id: 8,
      title: 'Storybook Integration',
      description: 'Set up Storybook for component development',
      status: 'done',
      priority: 'medium',
      assignee: 'Henry Davis',
      dueDate: new Date('2024-01-25'),
      tags: ['storybook', 'development', 'tools'],
    },
  ];

  readonly demoTasks = computed(() => this.demoTasksData);
  readonly smallTaskList = computed(() => this.demoTasksData.slice(0, 4));

  // =============================================================================
  // SHOWCASE CONFIGURATION
  // =============================================================================

  readonly showcaseConfig = computed<ShowcaseConfig>(() => {
    const componentInfo: ShowcaseComponent = {
      componentName: this.componentName,
      description: this.description,
      lastAction: this.lastAction,
    };

    const apiDocumentation: ComponentApiDocumentation = {
      inputs: [
        {
          name: 'variant',
          type: 'ListVariant',
          defaultValue: 'default',
          description: 'Visual style variant of the list',
          examples: ['default', 'minimal', 'bordered', 'elevated', 'flush'],
        },
        {
          name: 'size',
          type: 'ComponentSize',
          defaultValue: 'md',
          description: 'Size of the list elements',
          examples: ['sm', 'md', 'lg'],
        },
        {
          name: 'layout',
          type: 'ListLayout',
          defaultValue: 'vertical',
          description: 'Layout arrangement of list items',
          examples: ['vertical', 'horizontal', 'grid', 'masonry'],
        },
        {
          name: 'items',
          type: 'T[]',
          description: 'Array of items to display in the list',
        },
        {
          name: 'selectionMode',
          type: 'ListSelectionMode',
          defaultValue: 'none',
          description: 'Selection behavior mode',
          examples: ['none', 'single', 'multiple'],
        },
        {
          name: 'showSearch',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether to show search input',
        },
        {
          name: 'virtualScroll',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether to enable virtual scrolling for performance',
        },
        {
          name: 'infiniteScroll',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether to enable infinite scrolling',
        },
        {
          name: 'striped',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Whether list items are striped',
        },
        {
          name: 'hoverable',
          type: 'boolean',
          defaultValue: 'true',
          description: 'Whether list items are hoverable',
        },
        {
          name: 'itemTemplate',
          type: 'TemplateRef<any>',
          description: 'Custom template for rendering list items',
        },
      ],
      outputs: [
        {
          name: 'itemClick',
          type: 'ListItemClickEvent<T>',
          description: 'Emitted when a list item is clicked',
          examples: ['{ item, index, originalEvent }'],
        },
        {
          name: 'itemSelect',
          type: 'ListItemSelectEvent<T>',
          description: 'Emitted when item selection changes',
          examples: ['{ item, selectedItems, originalEvent }'],
        },
        {
          name: 'searchChange',
          type: 'string',
          description: 'Emitted when search term changes',
          examples: ['search text'],
        },
        {
          name: 'scroll',
          type: 'ListScrollEvent',
          description: 'Emitted when list is scrolled',
          examples: ['{ scrollTop, direction, atTop, atBottom }'],
        },
        {
          name: 'loadMore',
          type: 'ListLoadMoreEvent',
          description: 'Emitted when more items should be loaded',
          examples: ['{ currentPage, nextPage, totalPages }'],
        },
      ],
      methods: [
        {
          name: 'scrollToTop',
          signature: 'scrollToTop(): void',
          description: 'Scroll list to the top',
        },
        {
          name: 'scrollToBottom',
          signature: 'scrollToBottom(): void',
          description: 'Scroll list to the bottom',
        },
        {
          name: 'clearSelection',
          signature: 'clearSelection(): void',
          description: 'Clear all selected items',
        },
        {
          name: 'selectAll',
          signature: 'selectAll(): void',
          description: 'Select all items (if multiple selection enabled)',
        },
      ],
    };

    return createShowcaseConfig(componentInfo, apiDocumentation);
  });

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  ngOnInit(): void {
    // Initialize with some selected tasks for demo
    this.selectedTasks.set([this.demoTasksData[0], this.demoTasksData[2]]);
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  onItemClick(event: ListItemClickEvent<DemoTask>): void {
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(
      `Task clicked at ${timestamp} - "${event.item.title}" (index: ${event.index})`,
    );
  }

  onItemSelect(event: ListItemSelectEvent<DemoTask>): void {
    this.selectedTasks.set(event.selectedItems);
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(
      `Selection changed at ${timestamp} - Selected: ${event.selectedItems.length} items`,
    );
  }

  onSearchChange(searchTerm: string): void {
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(`Search changed at ${timestamp} - Term: "${searchTerm}"`);
  }

  onScroll(event: ListScrollEvent): void {
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(
      `List scrolled at ${timestamp} - Position: ${event.scrollTop}px, Direction: ${event.direction}`,
    );
  }

  onLoadMore(event: ListLoadMoreEvent): void {
    this.lastActionSignal.set(
      `Load more requested - next page: ${event.nextPage}, total pages: ${event.totalPages}`,
    );
  }

  clearSelection(): void {
    this.selectedTasks.set([]);
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(`Selection cleared at ${timestamp}`);
  }

  createSampleTask(): void {
    const newTask: DemoTask = {
      id: Date.now(),
      title: 'Sample Task',
      description: 'This is a sample task created from the empty state',
      status: 'todo',
      priority: 'medium',
      assignee: 'You',
      dueDate: new Date(),
      tags: ['sample'],
    };

    this.demoTasksData.push(newTask);
    const timestamp = new Date().toLocaleTimeString();
    this.lastActionSignal.set(`Sample task created at ${timestamp}`);
  }

  onInteractiveConfigChange(event: InteractiveConfigChangeEvent<ListInteractiveConfig>): void {
    this.interactiveListConfigSignal.set(event.config);
    this.lastActionSignal.set(`Configuration changed: ${event.property} = ${event.value}`);
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  getSelectedTaskTitles(): string {
    return this.selectedTasks()
      .map(task => task.title)
      .join(', ');
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      todo: 'To Do',
      'in-progress': 'In Progress',
      done: 'Done',
    };
    return labels[status] || status;
  }
}
