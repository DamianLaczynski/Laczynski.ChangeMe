import { Component } from '@angular/core';
import { TagComponent } from './tag.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tag-showcase',
  imports: [TagComponent, CommonModule],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Tag Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Tag component built with Fluent 2 Design System. Tags support
        multiple styles, sizes, states, and an optional dismiss button.
      </p>

      <!-- Filled Style (Default) -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Filled Style (Default)</h2>
        
        <h3 class="showcase__subsection__title">All Sizes - Rest State</h3>
        <div class="showcase__grid">
          <app-tag
            tagStyle="filled"
            size="extra-small"
            text="Extra Small Tag"
            (dismiss)="onDismiss($event)"
            (tagClick)="onTagClick($event)"
          />
          <app-tag
            tagStyle="filled"
            size="small"
            text="Small Tag"
            (dismiss)="onDismiss($event)"
            (tagClick)="onTagClick($event)"
          />
          <app-tag
            tagStyle="filled"
            size="medium"
            text="Medium Tag"
            (dismiss)="onDismiss($event)"
            (tagClick)="onTagClick($event)"
          />
        </div>

        <h3 class="showcase__subsection__title">Selected State</h3>
        <div class="showcase__grid">
          <app-tag
            tagStyle="filled"
            size="extra-small"
            text="Selected"
            [selected]="true"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="filled"
            size="small"
            text="Selected"
            [selected]="true"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="filled"
            size="medium"
            text="Selected"
            [selected]="true"
            (dismiss)="onDismiss($event)"
          />
        </div>

        <h3 class="showcase__subsection__title">Disabled State</h3>
        <div class="showcase__grid">
          <app-tag
            tagStyle="filled"
            size="extra-small"
            text="Disabled"
            [disabled]="true"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="filled"
            size="small"
            text="Disabled"
            [disabled]="true"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="filled"
            size="medium"
            text="Disabled"
            [disabled]="true"
            (dismiss)="onDismiss($event)"
          />
        </div>

        <h3 class="showcase__subsection__title">Without Dismiss Button</h3>
        <div class="showcase__grid">
          <app-tag
            tagStyle="filled"
            size="extra-small"
            text="No Dismiss"
            [dismissible]="false"
          />
          <app-tag
            tagStyle="filled"
            size="small"
            text="No Dismiss"
            [dismissible]="false"
          />
          <app-tag
            tagStyle="filled"
            size="medium"
            text="No Dismiss"
            [dismissible]="false"
          />
        </div>
      </div>

      <!-- Brand Style -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Brand Style</h2>
        
        <h3 class="showcase__subsection__title">All Sizes - Rest State</h3>
        <div class="showcase__grid">
          <app-tag
            tagStyle="brand"
            size="extra-small"
            text="Extra Small Brand"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="brand"
            size="small"
            text="Small Brand"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="brand"
            size="medium"
            text="Medium Brand"
            (dismiss)="onDismiss($event)"
          />
        </div>

        <h3 class="showcase__subsection__title">Selected State</h3>
        <div class="showcase__grid">
          <app-tag
            tagStyle="brand"
            size="extra-small"
            text="Selected"
            [selected]="true"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="brand"
            size="small"
            text="Selected"
            [selected]="true"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="brand"
            size="medium"
            text="Selected"
            [selected]="true"
            (dismiss)="onDismiss($event)"
          />
        </div>

        <h3 class="showcase__subsection__title">Disabled State</h3>
        <div class="showcase__grid">
          <app-tag
            tagStyle="brand"
            size="extra-small"
            text="Disabled"
            [disabled]="true"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="brand"
            size="small"
            text="Disabled"
            [disabled]="true"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="brand"
            size="medium"
            text="Disabled"
            [disabled]="true"
            (dismiss)="onDismiss($event)"
          />
        </div>
      </div>

      <!-- Outline Style -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Outline Style</h2>
        
        <h3 class="showcase__subsection__title">All Sizes - Rest State</h3>
        <div class="showcase__grid">
          <app-tag
            tagStyle="outline"
            size="extra-small"
            text="Extra Small Outline"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="outline"
            size="small"
            text="Small Outline"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="outline"
            size="medium"
            text="Medium Outline"
            (dismiss)="onDismiss($event)"
          />
        </div>

        <h3 class="showcase__subsection__title">Selected State</h3>
        <div class="showcase__grid">
          <app-tag
            tagStyle="outline"
            size="extra-small"
            text="Selected"
            [selected]="true"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="outline"
            size="small"
            text="Selected"
            [selected]="true"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="outline"
            size="medium"
            text="Selected"
            [selected]="true"
            (dismiss)="onDismiss($event)"
          />
        </div>

        <h3 class="showcase__subsection__title">Disabled State</h3>
        <div class="showcase__grid">
          <app-tag
            tagStyle="outline"
            size="extra-small"
            text="Disabled"
            [disabled]="true"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="outline"
            size="small"
            text="Disabled"
            [disabled]="true"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="outline"
            size="medium"
            text="Disabled"
            [disabled]="true"
            (dismiss)="onDismiss($event)"
          />
        </div>
      </div>

      <!-- Two-Line Layout (Medium only) -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Two-Line Layout (Medium Size Only)</h2>
        
        <h3 class="showcase__subsection__title">All Styles with Secondary Text</h3>
        <div class="showcase__grid">
          <app-tag
            tagStyle="filled"
            size="medium"
            text="Primary text"
            secondaryText="Secondary"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="brand"
            size="medium"
            text="Primary text"
            secondaryText="Secondary"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="outline"
            size="medium"
            text="Primary text"
            secondaryText="Secondary"
            (dismiss)="onDismiss($event)"
          />
        </div>

        <h3 class="showcase__subsection__title">Two-Line Selected State</h3>
        <div class="showcase__grid">
          <app-tag
            tagStyle="filled"
            size="medium"
            text="Selected"
            secondaryText="Secondary"
            [selected]="true"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="brand"
            size="medium"
            text="Selected"
            secondaryText="Secondary"
            [selected]="true"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="outline"
            size="medium"
            text="Selected"
            secondaryText="Secondary"
            [selected]="true"
            (dismiss)="onDismiss($event)"
          />
        </div>

        <h3 class="showcase__subsection__title">Two-Line Disabled State</h3>
        <div class="showcase__grid">
          <app-tag
            tagStyle="filled"
            size="medium"
            text="Disabled"
            secondaryText="Secondary"
            [disabled]="true"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="brand"
            size="medium"
            text="Disabled"
            secondaryText="Secondary"
            [disabled]="true"
            (dismiss)="onDismiss($event)"
          />
          <app-tag
            tagStyle="outline"
            size="medium"
            text="Disabled"
            secondaryText="Secondary"
            [disabled]="true"
            (dismiss)="onDismiss($event)"
          />
        </div>
      </div>

      <!-- Interactive Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive Examples</h2>
        
        <h3 class="showcase__subsection__title">Toggleable Selection</h3>
        <div class="showcase__grid">
          @for (tag of interactiveTags; track tag.id) {
            <app-tag
              [tagStyle]="tag.style"
              size="medium"
              [text]="tag.text"
              [selected]="tag.selected"
              (tagClick)="toggleTagSelection(tag.id)"
              (dismiss)="removeTag(tag.id)"
            />
          }
        </div>

        <h3 class="showcase__subsection__title">Real-world Example</h3>
        <p class="showcase__description">Filter tags with various properties:</p>
        <div class="showcase__grid" style="display: flex; flex-wrap: wrap; gap: 8px;">
          <app-tag
            tagStyle="brand"
            size="small"
            text="JavaScript"
            [selected]="filterTags.javascript"
            (tagClick)="toggleFilter('javascript')"
          />
          <app-tag
            tagStyle="brand"
            size="small"
            text="TypeScript"
            [selected]="filterTags.typescript"
            (tagClick)="toggleFilter('typescript')"
          />
          <app-tag
            tagStyle="brand"
            size="small"
            text="Angular"
            [selected]="filterTags.angular"
            (tagClick)="toggleFilter('angular')"
          />
          <app-tag
            tagStyle="brand"
            size="small"
            text="React"
            [selected]="filterTags.react"
            (tagClick)="toggleFilter('react')"
          />
          <app-tag
            tagStyle="outline"
            size="small"
            text="CSS"
            [dismissible]="false"
          />
          <app-tag
            tagStyle="outline"
            size="small"
            text="HTML"
            [dismissible]="false"
          />
        </div>
      </div>

      <!-- Action Log -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Action Log</h2>
        <div class="showcase__log">
          @if (actionLog.length === 0) {
            <p class="showcase__log__empty">No actions yet. Interact with tags above to see logs.</p>
          }
          @for (action of actionLog; track action.id) {
            <div class="showcase__log__item">
              <span class="showcase__log__time">{{ action.time }}</span>
              <span class="showcase__log__message">{{ action.message }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  standalone: true,
})
export class TagShowcaseComponent {
  interactiveTags = [
    { id: 1, text: 'Design', selected: false, style: 'filled' as const },
    { id: 2, text: 'Development', selected: true, style: 'brand' as const },
    { id: 3, text: 'Testing', selected: false, style: 'outline' as const },
    { id: 4, text: 'Documentation', selected: false, style: 'filled' as const },
  ];

  filterTags = {
    javascript: false,
    typescript: true,
    angular: true,
    react: false,
  };

  actionLog: Array<{ id: number; time: string; message: string }> = [];
  private actionIdCounter = 0;

  onDismiss(event: any): void {
    this.logAction('Tag dismissed');
  }

  onTagClick(event: any): void {
    this.logAction('Tag clicked');
  }

  toggleTagSelection(id: number): void {
    const tag = this.interactiveTags.find((t) => t.id === id);
    if (tag) {
      tag.selected = !tag.selected;
      this.logAction(`Tag "${tag.text}" ${tag.selected ? 'selected' : 'unselected'}`);
    }
  }

  removeTag(id: number): void {
    const tagIndex = this.interactiveTags.findIndex((t) => t.id === id);
    if (tagIndex !== -1) {
      const tag = this.interactiveTags[tagIndex];
      this.logAction(`Tag "${tag.text}" removed`);
      this.interactiveTags.splice(tagIndex, 1);
    }
  }

  toggleFilter(filter: keyof typeof this.filterTags): void {
    this.filterTags[filter] = !this.filterTags[filter];
    this.logAction(`Filter "${filter}" ${this.filterTags[filter] ? 'enabled' : 'disabled'}`);
  }

  private logAction(message: string): void {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    this.actionLog.unshift({
      id: this.actionIdCounter++,
      time,
      message,
    });
    // Keep only last 10 actions
    if (this.actionLog.length > 10) {
      this.actionLog.pop();
    }
  }
}

