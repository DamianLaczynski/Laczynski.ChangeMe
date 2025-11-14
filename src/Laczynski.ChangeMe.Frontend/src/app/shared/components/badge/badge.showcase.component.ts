import { Component } from '@angular/core';
import { BadgeComponent } from './badge.component';
import { CommonModule } from '@angular/common';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-badge-showcase',

  imports: [BadgeComponent, CommonModule, TableOfContentComponent],
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
        <h1 class="showcase__title">Badge Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Badge component built with Fluent 2 Design System. Badges
        support multiple colors, sizes, appearances, and optional icons.
      </p>

      <!-- Filled Appearance -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Filled Appearance (Default)</h2>

        <h3 class="showcase__subsection__title">All Sizes</h3>
        <div class="showcase__grid">
          <app-badge text="Small" size="small" appearance="filled" />
          <app-badge text="Medium" size="medium" appearance="filled" />
          <app-badge text="Large" size="large" appearance="filled" />
        </div>

        <h3 class="showcase__subsection__title">All Colors</h3>
        <div class="showcase__grid">
          <app-badge text="Brand" color="brand" appearance="filled" />
          <app-badge text="Danger" color="danger" appearance="filled" />
          <app-badge text="Success" color="success" appearance="filled" />
          <app-badge text="Important" color="important" appearance="filled" />
          <app-badge text="Informative" color="informative" appearance="filled" />
          <app-badge text="Subtle" color="subtle" appearance="filled" />
          <app-badge text="Warning" color="warning" appearance="filled" />
        </div>

        <h3 class="showcase__subsection__title">With Icons</h3>
        <div class="showcase__grid">
          <app-badge text="Brand" color="brand" icon="star" size="large" appearance="filled" />
          <app-badge text="Danger" color="danger" icon="star" size="large" appearance="filled" />
          <app-badge text="Success" color="success" icon="star" size="large" appearance="filled" />
          <app-badge
            text="Important"
            color="important"
            icon="star"
            size="large"
            appearance="filled"
          />
        </div>
      </div>

      <!-- Tint Appearance -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Tint Appearance</h2>

        <h3 class="showcase__subsection__title">All Sizes</h3>
        <div class="showcase__grid">
          <app-badge text="Small" size="small" color="brand" appearance="tint" />
          <app-badge text="Medium" size="medium" color="brand" appearance="tint" />
          <app-badge text="Large" size="large" color="brand" appearance="tint" />
        </div>

        <h3 class="showcase__subsection__title">All Colors</h3>
        <div class="showcase__grid">
          <app-badge text="Brand" color="brand" appearance="tint" />
          <app-badge text="Danger" color="danger" appearance="tint" />
          <app-badge text="Success" color="success" appearance="tint" />
          <app-badge text="Important" color="important" appearance="tint" />
          <app-badge text="Informative" color="informative" appearance="tint" />
          <app-badge text="Subtle" color="subtle" appearance="tint" />
          <app-badge text="Warning" color="warning" appearance="tint" />
        </div>

        <h3 class="showcase__subsection__title">With Icons</h3>
        <div class="showcase__grid">
          <app-badge text="Brand" color="brand" icon="star" size="large" appearance="tint" />
          <app-badge text="Danger" color="danger" icon="star" size="large" appearance="tint" />
          <app-badge text="Success" color="success" icon="star" size="large" appearance="tint" />
          <app-badge text="Warning" color="warning" icon="star" size="large" appearance="tint" />
        </div>
      </div>

      <!-- Outline Appearance -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Outline Appearance</h2>

        <h3 class="showcase__subsection__title">All Sizes</h3>
        <div class="showcase__grid">
          <app-badge text="Small" size="small" color="brand" appearance="outline" />
          <app-badge text="Medium" size="medium" color="brand" appearance="outline" />
          <app-badge text="Large" size="large" color="brand" appearance="outline" />
        </div>

        <h3 class="showcase__subsection__title">All Colors</h3>
        <div class="showcase__grid">
          <app-badge text="Brand" color="brand" appearance="outline" />
          <app-badge text="Danger" color="danger" appearance="outline" />
          <app-badge text="Success" color="success" appearance="outline" />
          <app-badge text="Important" color="important" appearance="outline" />
          <app-badge text="Informative" color="informative" appearance="outline" />
          <app-badge text="Subtle" color="subtle" appearance="outline" />
          <app-badge text="Warning" color="warning" appearance="outline" />
        </div>

        <h3 class="showcase__subsection__title">With Icons</h3>
        <div class="showcase__grid">
          <app-badge text="Brand" color="brand" icon="star" size="medium" appearance="outline" />
          <app-badge text="Danger" color="danger" icon="star" size="medium" appearance="outline" />
          <app-badge
            text="Success"
            color="success"
            icon="star"
            size="medium"
            appearance="outline"
          />
          <app-badge
            text="Important"
            color="important"
            icon="star"
            size="medium"
            appearance="outline"
          />
        </div>
      </div>

      <!-- Subtle Appearance -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Subtle Appearance</h2>

        <h3 class="showcase__subsection__title">All Sizes</h3>
        <div class="showcase__grid">
          <app-badge text="Small" size="small" color="brand" appearance="subtle" />
          <app-badge text="Medium" size="medium" color="brand" appearance="subtle" />
          <app-badge text="Large" size="large" color="brand" appearance="subtle" />
        </div>

        <h3 class="showcase__subsection__title">All Colors</h3>
        <div class="showcase__grid">
          <app-badge text="Brand" color="brand" appearance="subtle" />
          <app-badge text="Danger" color="danger" appearance="subtle" />
          <app-badge text="Success" color="success" appearance="subtle" />
          <app-badge text="Important" color="important" appearance="subtle" />
          <app-badge text="Informative" color="informative" appearance="subtle" />
          <app-badge text="Subtle" color="subtle" appearance="subtle" />
          <app-badge text="Warning" color="warning" appearance="subtle" />
        </div>

        <h3 class="showcase__subsection__title">With Icons</h3>
        <div class="showcase__grid">
          <app-badge text="Brand" color="brand" icon="star" size="large" appearance="subtle" />
          <app-badge text="Danger" color="danger" icon="star" size="large" appearance="subtle" />
          <app-badge text="Success" color="success" icon="star" size="large" appearance="subtle" />
          <app-badge text="Warning" color="warning" icon="star" size="large" appearance="subtle" />
        </div>
      </div>

      <!-- Real-world Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Real-world Examples</h2>

        <h3 class="showcase__subsection__title">Status Indicators</h3>
        <div class="showcase__grid">
          <app-badge text="Active" color="success" appearance="filled" icon="star" />
          <app-badge text="Pending" color="warning" appearance="tint" icon="star" />
          <app-badge text="Error" color="danger" appearance="filled" icon="star" />
          <app-badge text="Disabled" color="informative" appearance="tint" />
        </div>

        <h3 class="showcase__subsection__title">Notification Counts</h3>
        <div class="showcase__grid">
          <app-badge text="1" color="brand" size="small" appearance="filled" />
          <app-badge text="5" color="brand" size="medium" appearance="filled" />
          <app-badge text="10" color="danger" size="small" appearance="filled" />
          <app-badge text="99+" color="danger" size="medium" appearance="filled" />
        </div>

        <h3 class="showcase__subsection__title">Feature Tags</h3>
        <div class="showcase__grid">
          <app-badge text="New" color="brand" appearance="tint" icon="star" />
          <app-badge text="Beta" color="informative" appearance="outline" />
          <app-badge text="Pro" color="important" appearance="filled" />
          <app-badge text="Premium" color="warning" appearance="tint" />
        </div>

        <h3 class="showcase__subsection__title">Priority Levels</h3>
        <div class="showcase__grid">
          <app-badge text="Critical" color="danger" appearance="filled" size="large" />
          <app-badge text="High" color="warning" appearance="filled" size="large" />
          <app-badge text="Medium" color="informative" appearance="tint" size="large" />
          <app-badge text="Low" color="subtle" appearance="outline" size="large" />
        </div>
      </div>

      <!-- Size Comparison -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Comparison</h2>

        <h3 class="showcase__subsection__title">Side by Side</h3>
        <div class="showcase__grid" style="align-items: center;">
          <app-badge text="16px" size="small" color="brand" />
          <app-badge text="20px" size="medium" color="brand" />
          <app-badge text="24px" size="large" color="brand" />
        </div>

        <h3 class="showcase__subsection__title">With Icons - Size Comparison</h3>
        <div class="showcase__grid" style="align-items: center;">
          <app-badge text="16px" size="small" color="success" icon="star" />
          <app-badge text="20px" size="medium" color="success" icon="star" />
          <app-badge text="24px" size="large" color="success" icon="star" />
        </div>
      </div>

      <!-- Appearance Comparison by Color -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Appearance Comparison by Color</h2>

        @for (color of colors; track color) {
          <h3 class="showcase__subsection__title">{{ color | titlecase }}</h3>
          <div class="showcase__grid">
            <app-badge [text]="color" [color]="color" appearance="filled" />
            <app-badge [text]="color" [color]="color" appearance="tint" />
            <app-badge [text]="color" [color]="color" appearance="outline" />
            <app-badge [text]="color" [color]="color" appearance="subtle" />
          </div>
        }
      </div>
      </div>
    </div>
  `,
})
export class BadgeShowcaseComponent {
  colors: Array<
    'brand' | 'danger' | 'success' | 'important' | 'informative' | 'subtle' | 'warning'
  > = ['brand', 'danger', 'success', 'important', 'informative', 'subtle', 'warning'];
}
