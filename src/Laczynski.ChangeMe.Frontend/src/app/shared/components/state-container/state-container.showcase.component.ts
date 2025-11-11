import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateContainerComponent } from './state-container.component';
import { ButtonComponent } from '../button/button.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { IconComponent } from '../icon/icon.component';
import { QuickAction, Size } from '../utils';
import {
  State,
  errorState,
  initialState,
  loadedState,
  loadingState,
} from '@shared/state/models/state.model';

interface User {
  id: number;
  name: string;
  role: string;
}

@Component({
  selector: 'app-state-container-showcase',
  imports: [
    CommonModule,
    StateContainerComponent,
    ButtonComponent,
    SpinnerComponent,
    IconComponent,
  ],
  template: `
    <div class="showcase showcase--responsive">
      <h1 class="showcase__title">State Container Component</h1>
      <p class="showcase__description">
        A composable container that orchestrates loading, empty, error, and data states using the
        shared Fluent 2 status components. Bind it to your asynchronous data model and provide
        projected templates for the rendered data or to customise each state.
      </p>

      <div class="showcase__section">
        <h2 class="showcase__section__title">Interactive Demo</h2>
        <p class="showcase__section__description">
          Use the controls to transition between loading, empty, error, and populated states. Update
          the size to align the experience with its surrounding layout.
        </p>

        <div class="showcase__preview">
          <div
            class="showcase__controls"
            style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;"
          >
            <app-button variant="primary" (click)="loadUsers()">Load users</app-button>
            <app-button variant="secondary" (click)="showEmpty()">Show empty</app-button>
            <app-button variant="secondary" (click)="showError()">Show error</app-button>
            <app-button variant="secondary" (click)="resetState()">Reset</app-button>
          </div>

          <div
            class="showcase__controls"
            style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;"
          >
            @for (option of sizeOptions; track option) {
              <app-button
                size="small"
                [variant]="selectedSize() === option ? 'primary' : 'outline'"
                (click)="selectSize(option)"
              >
                {{ option }}
              </app-button>
            }
          </div>

          <app-state-container
            [state]="state()"
            [size]="selectedSize()"
            [loadingTitle]="'Loading users...'"
            [loadingDescription]="'Please wait while we fetch the latest people data.'"
            [emptyTitle]="'No users yet'"
            [emptyIcon]="'people_add'"
            [emptyDescription]="'Invite your team or add your first user to get started.'"
            [emptyPrimaryAction]="emptyPrimaryAction()"
            [errorTitle]="'Unable to load users'"
            [errorPrimaryAction]="errorPrimaryAction()"
            [errorSecondaryAction]="errorSecondaryAction()"
            [showEmptyOnInitial]="true"
            (errorActionClick)="onErrorAction($event)"
            (emptyActionClick)="onEmptyAction($event)"
          >
            <div
              style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;"
            >
              @for (user of state().data; track user.id) {
                <div
                  style="padding: 16px; border-radius: 12px; border: 1px solid var(--Neutral-Stroke-rest, #EDEBE9); background: var(--Neutral-Background-rest, #FFFFFF); display: flex; flex-direction: column; gap: 4px;"
                >
                  <strong>{{ user.name }}</strong>
                  <span style="color: var(--color-neutral-foreground2-rest, #605E5C);">{{
                    user.role
                  }}</span>
                </div>
              }
            </div>
          </app-state-container>
        </div>
      </div>

      <div class="showcase__section">
        <h2 class="showcase__section__title">Custom State Templates</h2>
        <p class="showcase__section__description">
          Override any state completely by providing named templates. This example replaces the
          loading and empty renderings with bespoke markup while keeping the default data branch.
        </p>

        <div class="showcase__preview">
          <app-state-container
            [state]="customState()"
            [showEmptyOnInitial]="true"
            [loadingTitle]="'Synchronising records'"
            [emptyTitle]="'All caught up!'"
          >
            <ng-template #loadingState>
              <div style="padding: 32px; text-align: center;">
                <app-spinner size="small" />
                <p style="margin-top: 12px; margin-bottom: 0;">Fetching data from the service...</p>
              </div>
            </ng-template>

            <ng-template #emptyState>
              <div style="padding: 32px; text-align: center;">
                <app-icon icon="checkmark_circle" size="large" />
                <p style="margin-top: 12px; margin-bottom: 0;">
                  There is nothing to show right now.
                </p>
              </div>
            </ng-template>

            <ng-template #dataState let-data>
              <div style="padding: 24px; text-align: center;">
                <strong>Data loaded successfully.</strong>
                <p style="margin-top: 8px; margin-bottom: 0;">Records: {{ data?.length || 0 }}</p>
              </div>
            </ng-template>
          </app-state-container>
        </div>
      </div>

      <div class="showcase__section">
        <h2 class="showcase__section__title">Usage Example</h2>
        <p class="showcase__section__description">
          Quick reference snippet that loads data, handles errors, and displays an empty state when
          no items are available.
        </p>
        <div class="showcase__code">
          <pre><code>{{ usageExample }}</code></pre>
        </div>
      </div>
    </div>
  `,
})
export class StateContainerShowcaseComponent {
  private readonly sampleUsers: User[] = [
    { id: 1, name: 'Anna Kowalska', role: 'Administrator' },
    { id: 2, name: 'Piotr Nowak', role: 'Project Manager' },
    { id: 3, name: 'Zofia Wiśniewska', role: 'Product Designer' },
    { id: 4, name: 'Tomasz Zieliński', role: 'Developer' },
  ];

  readonly sizeOptions: Size[] = ['small', 'medium', 'large'];

  state = signal<State<User[]>>(initialState<User[]>());
  selectedSize = signal<Size>('medium');
  customState = signal<State<User[]>>(loadingState(initialState<User[]>())); // starts in loading

  emptyPrimaryAction = signal<QuickAction>({
    label: 'Add user',
    variant: 'primary',
    icon: 'add',
    action: () => this.loadUsers(),
  });

  errorPrimaryAction = signal<QuickAction>({
    label: 'Retry',
    variant: 'primary',
    icon: 'arrow_sync',
    action: () => this.loadUsers(),
  });

  errorSecondaryAction = signal<QuickAction>({
    label: 'Reset',
    variant: 'secondary',
    icon: 'dismiss',
    action: () => this.resetState(),
  });

  constructor() {
    // Demonstrate transitions in the custom section
    setTimeout(() => {
      this.customState.set(loadedState<User[]>([]));
      setTimeout(() => {
        this.customState.set(loadedState(this.sampleUsers.slice(0, 2)));
      }, 1500);
    }, 1500);
  }

  loadUsers(): void {
    this.state.set(loadingState(this.state()));
    setTimeout(() => {
      this.state.set(loadedState(this.sampleUsers));
    }, 1200);
  }

  showEmpty(): void {
    this.state.set(loadedState<User[]>([]));
  }

  showError(): void {
    this.state.set(
      errorState<User[]>('Nie udało się pobrać listy użytkowników. Spróbuj ponownie.'),
    );
  }

  resetState(): void {
    this.state.set(initialState<User[]>());
  }

  selectSize(size: Size): void {
    this.selectedSize.set(size);
  }

  onErrorAction(action: QuickAction): void {
    console.log('Error action clicked:', action.label);
  }

  onEmptyAction(action: QuickAction): void {
    console.log('Empty action clicked:', action.label);
  }

  usageExample = `
import { Component, signal } from '@angular/core';
import { State, initialState, loadingState, loadedState, errorState } from '@shared/state/models/state.model';
import { StateContainerComponent } from '@shared/components/state-container';

interface Project {
  id: string;
  name: string;
}

@Component({
  standalone: true,
  imports: [StateContainerComponent],
  template: \`
    <app-state-container
      [state]="projectsState()"
      [loadingTitle]="'Loading projects...'"
      [emptyTitle]="'No projects yet'"
      [emptyDescription]="'Create your first project to get started.'"
      [showEmptyOnInitial]="true"
    >
      <ng-template #dataState let-projects>
        <ul>
          @for (project of projects; track project.id) {
            <li>{{ project.name }}</li>
          }
        </ul>
      </ng-template>
    </app-state-container>
  \`
})
export class ProjectsComponent {
  projectsState = signal<State<Project[]>>(initialState<Project[]>());

  loadProjects(): void {
    this.projectsState.set(loadingState(this.projectsState()));
    this.projectService.getAll().subscribe({
      next: projects => this.projectsState.set(loadedState(projects)),
      error: () => this.projectsState.set(errorState<Project[]>('Unable to load projects.')),
    });
  }
}
`.trim();
}
