import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SplitterComponent,
  SplitterPanelDirective,
  SplitterPanel,
  SplitterResizeEvent,
} from './splitter.component';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-splitter-showcase',
  standalone: true,
  imports: [CommonModule, SplitterComponent, SplitterPanelDirective, CardComponent],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">Splitter Component Showcase</h1>
      <p class="showcase__description">
        Comprehensive showcase of the Splitter component built with Fluent 2 Design System. All
        variants are responsive and accessible. Resizable panel component following Fluent 2 Design
        System.
      </p>

      <!-- Basic Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Horizontal Splitter</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <p>
              Resize panels by dragging the gutter between them. Use keyboard arrows for precise
              control.
            </p>
            <div class="showcase__example" style="height: 400px;">
              <app-splitter
                [panels]="horizontalPanels()"
                orientation="horizontal"
                [gutterSize]="6"
                (panelResize)="onPanelResize($event)"
              >
                <ng-template appSplitterPanel="panel-1">
                  <div class="panel-content">
                    <app-card>
                      <div class="card-content">
                        <h3>Panel 1</h3>
                        <p>This is the left panel. It has a minimum width of 200px.</p>
                        <p>
                          Try resizing by dragging the gutter or using keyboard navigation (Tab +
                          Arrow keys).
                        </p>
                        <p>Current size: {{ panelSizes()[0] | number: '1.0-1' }}%</p>
                      </div>
                    </app-card>
                  </div>
                </ng-template>

                <ng-template appSplitterPanel="panel-2">
                  <div class="panel-content">
                    <app-card>
                      <div class="card-content">
                        <h3>Panel 2</h3>
                        <p>This is the middle panel with no size restrictions.</p>
                        <p>Current size: {{ panelSizes()[1] | number: '1.0-1' }}%</p>
                      </div>
                    </app-card>
                  </div>
                </ng-template>

                <ng-template appSplitterPanel="panel-3">
                  <div class="panel-content">
                    <app-card>
                      <div class="card-content">
                        <h3>Panel 3</h3>
                        <p>This is the right panel. It has a maximum width of 400px.</p>
                        <p>Current size: {{ panelSizes()[2] | number: '1.0-1' }}%</p>
                      </div>
                    </app-card>
                  </div>
                </ng-template>
              </app-splitter>
            </div>
          </div>
        </div>
      </div>

      <!-- State Variants -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Vertical Splitter</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <p>Splitter can also be oriented vertically.</p>
            <div class="showcase__example" style="height: 500px;">
              <app-splitter
                [panels]="verticalPanels()"
                orientation="vertical"
                [gutterSize]="8"
                (panelResize)="onVerticalPanelResize($event)"
              >
                <ng-template appSplitterPanel="top-panel">
                  <div class="panel-content">
                    <app-card>
                      <div class="card-content">
                        <h3>Top Panel</h3>
                        <p>This is the top panel.</p>
                        <p>Current size: {{ verticalPanelSizes()[0] | number: '1.0-1' }}%</p>
                      </div>
                    </app-card>
                  </div>
                </ng-template>

                <ng-template appSplitterPanel="bottom-panel">
                  <div class="panel-content">
                    <app-card>
                      <div class="card-content">
                        <h3>Bottom Panel</h3>
                        <p>This is the bottom panel. It has a minimum height of 150px.</p>
                        <p>Current size: {{ verticalPanelSizes()[1] | number: '1.0-1' }}%</p>
                      </div>
                    </app-card>
                  </div>
                </ng-template>
              </app-splitter>
            </div>
          </div>
        </div>
      </div>

      <!-- Complex Examples -->
      <div class="showcase__section">
        <h2 class="showcase__section__title">Nested Splitter</h2>
        <div class="showcase__grid">
          <div class="showcase__item">
            <p>Splitters can be nested to create complex layouts.</p>
            <div class="showcase__example" style="height: 500px;">
              <app-splitter
                [panels]="nestedOuterPanels()"
                orientation="horizontal"
                [gutterSize]="6"
              >
                <ng-template appSplitterPanel="left">
                  <div class="panel-content">
                    <app-card>
                      <div class="card-content">
                        <h3>Sidebar</h3>
                        <p>This is a fixed-width sidebar (min 150px, max 300px).</p>
                        <ul>
                          <li>Navigation Item 1</li>
                          <li>Navigation Item 2</li>
                          <li>Navigation Item 3</li>
                          <li>Navigation Item 4</li>
                        </ul>
                      </div>
                    </app-card>
                  </div>
                </ng-template>

                <ng-template appSplitterPanel="main">
                  <div class="panel-content" style="padding: 0;">
                    <app-splitter
                      [panels]="nestedInnerPanels()"
                      orientation="vertical"
                      [gutterSize]="6"
                    >
                      <ng-template appSplitterPanel="header">
                        <div class="panel-content">
                          <app-card>
                            <div class="card-content">
                              <h3>Header</h3>
                              <p>This is the header section with minimum height of 100px.</p>
                            </div>
                          </app-card>
                        </div>
                      </ng-template>

                      <ng-template appSplitterPanel="content">
                        <app-splitter
                          [panels]="nestedOuterPanels()"
                          orientation="horizontal"
                          [gutterSize]="6"
                        >
                          <ng-template appSplitterPanel="left">
                            <div class="panel-content">
                              <app-card>
                                <div class="card-content">
                                  <h3>Sidebar</h3>
                                  <p>This is a fixed-width sidebar (min 150px, max 300px).</p>
                                  <ul>
                                    <li>Navigation Item 1</li>
                                    <li>Navigation Item 2</li>
                                    <li>Navigation Item 3</li>
                                    <li>Navigation Item 4</li>
                                  </ul>
                                </div>
                              </app-card>
                            </div>
                          </ng-template>

                          <ng-template appSplitterPanel="main">
                            <div class="panel-content" style="padding: 0;">
                              <app-splitter
                                [panels]="nestedInnerPanels()"
                                orientation="vertical"
                                [gutterSize]="6"
                              >
                                <ng-template appSplitterPanel="header">
                                  <div class="panel-content">
                                    <app-card>
                                      <div class="card-content">
                                        <h3>Header</h3>
                                        <p>
                                          This is the header section with minimum height of 100px.
                                        </p>
                                      </div>
                                    </app-card>
                                  </div>
                                </ng-template>

                                <ng-template appSplitterPanel="content">
                                  <div class="panel-content">
                                    <app-card>
                                      <div class="card-content">
                                        <h3>Main Content</h3>
                                        <p>This is the main content area.</p>
                                        <p>It takes up the remaining vertical space.</p>
                                      </div>
                                    </app-card>
                                  </div>
                                </ng-template>

                                <ng-template appSplitterPanel="footer">
                                  <div class="panel-content">
                                    <app-card>
                                      <div class="card-content">
                                        <h3>Footer</h3>
                                        <p>Fixed height footer (min 80px, max 150px).</p>
                                      </div>
                                    </app-card>
                                  </div>
                                </ng-template>
                              </app-splitter>
                            </div>
                          </ng-template>
                        </app-splitter>
                      </ng-template>

                      <ng-template appSplitterPanel="footer">
                        <div class="panel-content">
                          <app-card>
                            <div class="card-content">
                              <h3>Footer</h3>
                              <p>Fixed height footer (min 80px, max 150px).</p>
                            </div>
                          </app-card>
                        </div>
                      </ng-template>
                    </app-splitter>
                  </div>
                </ng-template>
              </app-splitter>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SplitterShowcaseComponent {
  // Horizontal splitter panels
  horizontalPanels = signal<SplitterPanel[]>([
    {
      id: 'panel-1',
      size: 30,
      minSize: 200,
    },
    {
      id: 'panel-2',
      size: 40,
    },
    {
      id: 'panel-3',
      size: 30,
      maxSize: 400,
    },
  ]);

  panelSizes = signal<number[]>([30, 40, 30]);

  // Vertical splitter panels
  verticalPanels = signal<SplitterPanel[]>([
    {
      id: 'top-panel',
      size: 60,
      minSize: 150,
    },
    {
      id: 'bottom-panel',
      size: 40,
      minSize: 150,
    },
  ]);

  verticalPanelSizes = signal<number[]>([60, 40]);

  // Nested splitter panels
  nestedOuterPanels = signal<SplitterPanel[]>([
    {
      id: 'left',
      size: 20,
    },
    {
      id: 'main',
      size: 80,
    },
  ]);

  nestedInnerPanels = signal<SplitterPanel[]>([
    {
      id: 'header',
      size: 20,
      resizable: false,
    },
    {
      id: 'content',
      size: 60,
      resizable: false,
    },
    {
      id: 'footer',
      size: 20,
      resizable: false,
    },
  ]);

  onPanelResize(event: SplitterResizeEvent): void {
    console.log('Panel resized:', event);
    const sizes = [...this.panelSizes()];
    sizes[event.panelIndex] = event.newSize;
    this.panelSizes.set(sizes);
  }

  onVerticalPanelResize(event: SplitterResizeEvent): void {
    console.log('Vertical panel resized:', event);
    const sizes = [...this.verticalPanelSizes()];
    sizes[event.panelIndex] = event.newSize;
    this.verticalPanelSizes.set(sizes);
  }
}
