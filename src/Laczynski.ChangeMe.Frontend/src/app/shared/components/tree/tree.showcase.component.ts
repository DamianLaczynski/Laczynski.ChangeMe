import { Component, signal } from '@angular/core';
import { TreeComponent } from './tree.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { TreeNode } from './tree-item.component';

@Component({
  selector: 'app-tree-showcase',
  imports: [TreeComponent, CommonModule, ButtonComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Tree Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Tree component built with Fluent 2 Design System. Supports
        hierarchical data with expand/collapse, selection, and customization options.
      </p>

      <!-- Basic Tree -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Tree</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-tree
              [nodes]="basicTree()"
              (nodeClick)="onNodeClick($event)"
              (nodeToggle)="onNodeToggle($event)"
              (nodeSelect)="onNodeSelect($event)"
            ></app-tree>
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Small</h3>
            <app-tree [nodes]="sizeTree()" size="small"></app-tree>
          </div>
          <div class="showcase__item">
            <h3>Medium (Default)</h3>
            <app-tree [nodes]="sizeTree()" size="medium"></app-tree>
          </div>
          <div class="showcase__item">
            <h3>Large</h3>
            <app-tree [nodes]="sizeTree()" size="large"></app-tree>
          </div>
        </div>
      </div>

      <!-- With Icons -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Icon Display</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>With Icons</h3>
            <app-tree [nodes]="iconTree()" [showIcon]="true"></app-tree>
          </div>
          <div class="showcase__item">
            <h3>Without Icons</h3>
            <app-tree [nodes]="iconTree()" [showIcon]="false"></app-tree>
          </div>
        </div>
      </div>

      <!-- With Quick Actions -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Quick Actions</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <p>Hover over items to see quick action buttons</p>
            <app-tree [nodes]="actionTree()" [showQuickActions]="true">
              <ng-template #quickActions let-node>
                <app-button
                  size="small"
                  variant="primary"
                  [iconOnly]="true"
                  (click)="onActionClick(node)"
                >
                  ⋯
                </app-button>
              </ng-template>
            </app-tree>
          </div>
        </div>
      </div>

      <!-- States -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Node States</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Various States</h3>
            <app-tree [nodes]="stateTree()"></app-tree>
          </div>
        </div>
      </div>

      <!-- Complex Hierarchy -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Complex Hierarchy</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-tree [nodes]="complexTree()" (nodeSelect)="onNodeSelect($event)"></app-tree>
          </div>
        </div>
      </div>

      <!-- File System Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">File System Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-tree [nodes]="fileSystemTree()" (nodeSelect)="onFileSelect($event)"></app-tree>
          </div>
        </div>
      </div>

      <!-- Style Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Style Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Subtle (Default)</h3>
            <app-tree [nodes]="styleTree()" style="subtle"></app-tree>
          </div>
          <div class="showcase__item">
            <h3>Flat</h3>
            <app-tree [nodes]="styleTree()" style="flat"></app-tree>
          </div>
        </div>
      </div>

      <!-- Event Logging -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Event Logging</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <p><strong>Last Event:</strong> {{ lastEvent() }}</p>
            <p><strong>Selected Node:</strong> {{ selectedNodeLabel() }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TreeShowcaseComponent {
  lastEvent = signal<string>('None');
  selectedNodeLabel = signal<string>('None');

  // Basic tree data
  basicTree = signal<TreeNode[]>([
    {
      id: 1,
      label: 'Root Item 1',
      hasChildren: true,
      expanded: false,
      children: [
        { id: 11, label: 'Child Item 1.1' },
        { id: 12, label: 'Child Item 1.2' },
      ],
    },
    {
      id: 2,
      label: 'Root Item 2',
      hasChildren: true,
      expanded: false,
      children: [{ id: 21, label: 'Child Item 2.1' }],
    },
    {
      id: 3,
      label: 'Root Item 3 (Leaf)',
    },
  ]);

  // Size demonstration tree
  sizeTree = signal<TreeNode[]>([
    {
      id: 1,
      label: 'Parent Node',
      hasChildren: true,
      children: [
        { id: 11, label: 'Child Node 1' },
        { id: 12, label: 'Child Node 2' },
      ],
    },
    { id: 2, label: 'Leaf Node' },
  ]);

  // Icon tree
  iconTree = signal<TreeNode[]>([
    {
      id: 1,
      label: 'Documents',
      hasChildren: true,
      children: [
        { id: 11, label: 'Report.pdf' },
        { id: 12, label: 'Presentation.pptx' },
      ],
    },
    { id: 2, label: 'Images' },
  ]);

  // Action tree
  actionTree = signal<TreeNode[]>([
    {
      id: 1,
      label: 'Item with actions',
      hasChildren: true,
      children: [{ id: 11, label: 'Child with actions' }],
    },
    { id: 2, label: 'Another item' },
  ]);

  // State tree
  stateTree = signal<TreeNode[]>([
    {
      id: 1,
      label: 'Normal Item',
      hasChildren: true,
      children: [{ id: 11, label: 'Normal Child' }],
    },
    {
      id: 2,
      label: 'Selected Item',
      selected: true,
    },
    {
      id: 3,
      label: 'Disabled Item',
      disabled: true,
      hasChildren: true,
      children: [{ id: 31, label: 'Disabled Child', disabled: true }],
    },
  ]);

  // Complex tree
  complexTree = signal<TreeNode[]>([
    {
      id: 1,
      label: 'Level 1 - Item 1',
      hasChildren: true,
      expanded: true,
      children: [
        {
          id: 11,
          label: 'Level 2 - Item 1.1',
          hasChildren: true,
          children: [
            {
              id: 111,
              label: 'Level 3 - Item 1.1.1',
              hasChildren: true,
              children: [
                { id: 1111, label: 'Level 4 - Item 1.1.1.1' },
                { id: 1112, label: 'Level 4 - Item 1.1.1.2' },
              ],
            },
            { id: 112, label: 'Level 3 - Item 1.1.2' },
          ],
        },
        { id: 12, label: 'Level 2 - Item 1.2' },
      ],
    },
    {
      id: 2,
      label: 'Level 1 - Item 2',
      hasChildren: true,
      children: [
        { id: 21, label: 'Level 2 - Item 2.1' },
        { id: 22, label: 'Level 2 - Item 2.2' },
      ],
    },
  ]);

  // File system tree
  fileSystemTree = signal<TreeNode[]>([
    {
      id: 'root',
      label: 'My Computer',
      hasChildren: true,
      expanded: true,
      children: [
        {
          id: 'documents',
          label: 'Documents',
          hasChildren: true,
          children: [
            { id: 'doc1', label: 'Resume.docx' },
            { id: 'doc2', label: 'Cover Letter.pdf' },
            {
              id: 'projects',
              label: 'Projects',
              hasChildren: true,
              children: [
                { id: 'proj1', label: 'Project A' },
                { id: 'proj2', label: 'Project B' },
              ],
            },
          ],
        },
        {
          id: 'downloads',
          label: 'Downloads',
          hasChildren: true,
          children: [
            { id: 'dl1', label: 'installer.exe' },
            { id: 'dl2', label: 'archive.zip' },
          ],
        },
        {
          id: 'pictures',
          label: 'Pictures',
          hasChildren: true,
          children: [
            { id: 'pic1', label: 'vacation.jpg' },
            { id: 'pic2', label: 'family.png' },
          ],
        },
      ],
    },
  ]);

  // Style tree
  styleTree = signal<TreeNode[]>([
    {
      id: 1,
      label: 'Item 1',
      hasChildren: true,
      children: [
        { id: 11, label: 'Child 1.1' },
        { id: 12, label: 'Child 1.2' },
      ],
    },
    { id: 2, label: 'Item 2' },
  ]);

  // Event handlers
  onNodeClick(node: TreeNode): void {
    this.lastEvent.set(`Node clicked: ${node.label}`);
    console.log('Node clicked:', node);
  }

  onNodeToggle(node: TreeNode): void {
    this.lastEvent.set(`Node toggled: ${node.label}`);
    console.log('Node toggled:', node);
  }

  onNodeSelect(node: TreeNode): void {
    this.lastEvent.set(`Node selected: ${node.label}`);
    this.selectedNodeLabel.set(node.label);
    console.log('Node selected:', node);
  }

  onFileSelect(node: TreeNode): void {
    this.lastEvent.set(`File selected: ${node.label}`);
    this.selectedNodeLabel.set(node.label);
    console.log('File selected:', node);
  }

  onActionClick(node: TreeNode): void {
    this.lastEvent.set(`Quick action clicked: ${node.label}`);
    console.log('Action clicked');
  }
}
