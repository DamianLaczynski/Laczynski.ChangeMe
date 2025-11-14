import { Component } from '@angular/core';
import { SkeletonComponent } from './skeleton.component';
import { CommonModule } from '@angular/common';
import { TableOfContentComponent } from '@shared/components/table-of-content';

@Component({
  selector: 'app-skeleton-showcase',
  imports: [SkeletonComponent, CommonModule, TableOfContentComponent],
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
        <h1 class="showcase__title">Skeleton Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Skeleton component built with Fluent 2 Design System. 
        Used for loading states and placeholder content. All variants support animation and accessibility.
      </p>

      <!-- Shape Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Shape Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Rectangle (Default)</h3>
            <app-skeleton 
              shape="rectangle" 
              width="132px" 
              height="132px"
              [animated]="true"
            ></app-skeleton>
          </div>
          <div class="showcase__item">
            <h3>Circle</h3>
            <app-skeleton 
              shape="circle" 
              width="132px" 
              height="132px"
              [animated]="true"
            ></app-skeleton>
          </div>
        </div>
      </div>

      <!-- Animation Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Animation Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Animated (Default)</h3>
            <app-skeleton 
              shape="rectangle" 
              width="200px" 
              height="100px"
              [animated]="true"
            ></app-skeleton>
          </div>
          <div class="showcase__item">
            <h3>Static (No Animation)</h3>
            <app-skeleton 
              shape="rectangle" 
              width="200px" 
              height="100px"
              [animated]="false"
            ></app-skeleton>
          </div>
        </div>
      </div>

      <!-- Size Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Size Variants</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Small (24x24)</h3>
            <app-skeleton 
              shape="circle" 
              width="24px" 
              height="24px"
              [animated]="true"
            ></app-skeleton>
          </div>
          <div class="showcase__item">
            <h3>Medium (48x48)</h3>
            <app-skeleton 
              shape="circle" 
              width="48px" 
              height="48px"
              [animated]="true"
            ></app-skeleton>
          </div>
          <div class="showcase__item">
            <h3>Large (96x96)</h3>
            <app-skeleton 
              shape="circle" 
              width="96px" 
              height="96px"
              [animated]="true"
            ></app-skeleton>
          </div>
          <div class="showcase__item">
            <h3>Extra Large (132x132)</h3>
            <app-skeleton 
              shape="circle" 
              width="132px" 
              height="132px"
              [animated]="true"
            ></app-skeleton>
          </div>
        </div>
      </div>

      <!-- Text Line Skeletons -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Text Line Skeletons</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Single Line</h3>
            <app-skeleton 
              shape="rectangle" 
              width="100%" 
              height="16px"
              [animated]="true"
            ></app-skeleton>
          </div>
          <div class="showcase__item">
            <h3>Multiple Lines</h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <app-skeleton 
                shape="rectangle" 
                width="100%" 
                height="16px"
                [animated]="true"
              ></app-skeleton>
              <app-skeleton 
                shape="rectangle" 
                width="90%" 
                height="16px"
                [animated]="true"
              ></app-skeleton>
              <app-skeleton 
                shape="rectangle" 
                width="75%" 
                height="16px"
                [animated]="true"
              ></app-skeleton>
            </div>
          </div>
          <div class="showcase__item">
            <h3>Heading + Lines</h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <app-skeleton 
                shape="rectangle" 
                width="60%" 
                height="24px"
                [animated]="true"
              ></app-skeleton>
              <app-skeleton 
                shape="rectangle" 
                width="100%" 
                height="12px"
                [animated]="true"
              ></app-skeleton>
              <app-skeleton 
                shape="rectangle" 
                width="100%" 
                height="12px"
                [animated]="true"
              ></app-skeleton>
              <app-skeleton 
                shape="rectangle" 
                width="80%" 
                height="12px"
                [animated]="true"
              ></app-skeleton>
            </div>
          </div>
        </div>
      </div>

      <!-- Custom Border Radius -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Custom Border Radius</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>No Radius</h3>
            <app-skeleton 
              shape="rectangle" 
              width="120px" 
              height="120px"
              borderRadius="0"
              [animated]="true"
            ></app-skeleton>
          </div>
          <div class="showcase__item">
            <h3>Small Radius (4px)</h3>
            <app-skeleton 
              shape="rectangle" 
              width="120px" 
              height="120px"
              borderRadius="4px"
              [animated]="true"
            ></app-skeleton>
          </div>
          <div class="showcase__item">
            <h3>Medium Radius (8px)</h3>
            <app-skeleton 
              shape="rectangle" 
              width="120px" 
              height="120px"
              borderRadius="8px"
              [animated]="true"
            ></app-skeleton>
          </div>
          <div class="showcase__item">
            <h3>Large Radius (16px)</h3>
            <app-skeleton 
              shape="rectangle" 
              width="120px" 
              height="120px"
              borderRadius="16px"
              [animated]="true"
            ></app-skeleton>
          </div>
        </div>
      </div>

      <!-- Card Skeleton Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Card Layout Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <div style="display: flex; flex-direction: column; gap: 12px; padding: 16px; border: 1px solid #E0E0E0; border-radius: 8px; background: white;">
              <app-skeleton 
                shape="rectangle" 
                width="100%" 
                height="200px"
                borderRadius="4px"
                [animated]="true"
              ></app-skeleton>
              <app-skeleton 
                shape="rectangle" 
                width="70%" 
                height="24px"
                [animated]="true"
              ></app-skeleton>
              <app-skeleton 
                shape="rectangle" 
                width="100%" 
                height="16px"
                [animated]="true"
              ></app-skeleton>
              <app-skeleton 
                shape="rectangle" 
                width="100%" 
                height="16px"
                [animated]="true"
              ></app-skeleton>
              <app-skeleton 
                shape="rectangle" 
                width="90%" 
                height="16px"
                [animated]="true"
              ></app-skeleton>
            </div>
          </div>
          <div class="showcase__item">
            <div style="display: flex; gap: 12px; padding: 16px; border: 1px solid #E0E0E0; border-radius: 8px; background: white;">
              <app-skeleton 
                shape="circle" 
                width="64px" 
                height="64px"
                [animated]="true"
              ></app-skeleton>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                <app-skeleton 
                  shape="rectangle" 
                  width="60%" 
                  height="20px"
                  [animated]="true"
                ></app-skeleton>
                <app-skeleton 
                  shape="rectangle" 
                  width="100%" 
                  height="14px"
                  [animated]="true"
                ></app-skeleton>
                <app-skeleton 
                  shape="rectangle" 
                  width="80%" 
                  height="14px"
                  [animated]="true"
                ></app-skeleton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- List Skeleton Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">List Layout Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <div style="display: flex; flex-direction: column; gap: 12px;">
              @for (item of [1,2,3,4,5]; track item) {
                <div style="display: flex; gap: 12px; align-items: center; padding: 12px; border: 1px solid #E0E0E0; border-radius: 4px; background: white;">
                  <app-skeleton 
                    shape="circle" 
                    width="40px" 
                    height="40px"
                    [animated]="true"
                  ></app-skeleton>
                  <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                    <app-skeleton 
                      shape="rectangle" 
                      width="40%" 
                      height="16px"
                      [animated]="true"
                    ></app-skeleton>
                    <app-skeleton 
                      shape="rectangle" 
                      width="80%" 
                      height="12px"
                      [animated]="true"
                    ></app-skeleton>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Table Skeleton Example -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Table Layout Example</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <div style="border: 1px solid #E0E0E0; border-radius: 4px; overflow: hidden; background: white;">
              <!-- Table Header -->
              <div style="display: flex; gap: 12px; padding: 12px; background: #F3F2F1; border-bottom: 1px solid #E0E0E0;">
                <app-skeleton shape="rectangle" width="30%" height="16px" [animated]="true"></app-skeleton>
                <app-skeleton shape="rectangle" width="40%" height="16px" [animated]="true"></app-skeleton>
                <app-skeleton shape="rectangle" width="30%" height="16px" [animated]="true"></app-skeleton>
              </div>
              <!-- Table Rows -->
              @for (row of [1,2,3,4]; track row) {
                <div style="display: flex; gap: 12px; padding: 12px; border-bottom: 1px solid #E0E0E0;">
                  <app-skeleton shape="rectangle" width="30%" height="14px" [animated]="true"></app-skeleton>
                  <app-skeleton shape="rectangle" width="40%" height="14px" [animated]="true"></app-skeleton>
                  <app-skeleton shape="rectangle" width="30%" height="14px" [animated]="true"></app-skeleton>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- All Combinations -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">All Combinations</h2>
        <div class="showcase__grid showcase__grid--large">
          <div class="showcase__item">
            <h3>Rectangle + Animated</h3>
            <app-skeleton shape="rectangle" width="120px" height="120px" [animated]="true"></app-skeleton>
          </div>
          <div class="showcase__item">
            <h3>Rectangle + Static</h3>
            <app-skeleton shape="rectangle" width="120px" height="120px" [animated]="false"></app-skeleton>
          </div>
          <div class="showcase__item">
            <h3>Circle + Animated</h3>
            <app-skeleton shape="circle" width="120px" height="120px" [animated]="true"></app-skeleton>
          </div>
          <div class="showcase__item">
            <h3>Circle + Static</h3>
            <app-skeleton shape="circle" width="120px" height="120px" [animated]="false"></app-skeleton>
          </div>
        </div>
      </div>
      </div>
    </div>
  `,
})
export class SkeletonShowcaseComponent {}

