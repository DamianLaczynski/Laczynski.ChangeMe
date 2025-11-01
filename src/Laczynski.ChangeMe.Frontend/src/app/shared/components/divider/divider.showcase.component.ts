import { Component } from '@angular/core';
import { DividerComponent } from './divider.component';

@Component({
  selector: 'app-divider-showcase',

  imports: [DividerComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Divider Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Divider component built with Fluent 2 Design System. All
        variants are responsive and accessible.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Basic Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <app-divider />
          </div>
          <div class="showcase__item">
            <app-divider [text]="'OR'" />
          </div>
        </div>
      </div>

      <!-- Horizontal Dividers -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Horizontal Dividers</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Center (Default)</h3>
            <div style="width: 100%; padding: 20px 0;">
              <app-divider [text]="'Text'" [orientation]="'horizontal'" [alignment]="'center'" />
            </div>
          </div>
          <div class="showcase__item">
            <h3>Start</h3>
            <div style="width: 100%; padding: 20px 0;">
              <app-divider [text]="'Text'" [orientation]="'horizontal'" [alignment]="'start'" />
            </div>
          </div>
          <div class="showcase__item">
            <h3>End</h3>
            <div style="width: 100%; padding: 20px 0;">
              <app-divider [text]="'Text'" [orientation]="'horizontal'" [alignment]="'end'" />
            </div>
          </div>
          <div class="showcase__item">
            <h3>Without Text</h3>
            <div style="width: 100%; padding: 20px 0;">
              <app-divider [orientation]="'horizontal'" />
            </div>
          </div>
        </div>
      </div>

      <!-- Vertical Dividers -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Vertical Dividers</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <div style="display: flex; gap: 20px; align-items: center;">
              <div>
                <h3>Center</h3>
                <app-divider [text]="'Text'" [orientation]="'vertical'" [alignment]="'center'" />
              </div>
              <div>
                <h3>Start</h3>
                <app-divider [text]="'Text'" [orientation]="'vertical'" [alignment]="'start'" />
              </div>
              <div>
                <h3>End</h3>
                <app-divider [text]="'Text'" [orientation]="'vertical'" [alignment]="'end'" />
              </div>
              <div>
                <h3>Without Text</h3>
                <app-divider [orientation]="'vertical'" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Usage Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Usage Examples</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <h3>Separating Content</h3>
            <div style="padding: 20px;">
              <p>Content above the divider</p>
              <app-divider [text]="'Section Separator'" />
              <p>Content below the divider</p>
            </div>
          </div>
          <div class="showcase__item">
            <h3>In a List</h3>
            <div style="padding: 20px;">
              <div>Item 1</div>
              <app-divider />
              <div>Item 2</div>
              <app-divider />
              <div>Item 3</div>
            </div>
          </div>
          <div class="showcase__item">
            <h3>With Custom Text</h3>
            <div style="padding: 20px;">
              <app-divider [text]="'OR'" [alignment]="'center'" />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DividerShowcaseComponent {}
