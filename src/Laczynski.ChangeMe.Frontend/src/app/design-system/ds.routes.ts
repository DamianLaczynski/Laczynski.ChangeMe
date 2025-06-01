// =============================================================================
// Design System Routes Configuration
// =============================================================================
// Routes for design system components and showcases

import { Routes } from '@angular/router';
import { ButtonShowcaseComponent } from './ui/button/button-showcase.component';
import { InputShowcaseComponent } from './ui/input/input-showcase.component';
import { SelectShowcaseComponent } from './ui/select/select-showcase.component';
import { CheckboxShowcaseComponent } from './ui/checkbox/checkbox-showcase.component';
import { RadioShowcaseComponent } from './ui/radio/radio-showcase.component';
import { DesignSystemLayoutComponent } from './layout/ds-layout.component';
import { FormFieldShowcaseComponent } from './ui/form-field';
import { FormGroupShowcaseComponent } from './ui/form-group';
import { TableShowcaseComponent } from './ui/table';
import { ListShowcaseComponent } from './ui/list';

/**
 * Design System routes with layout wrapper
 */
export const DS_ROUTES: Routes = [
  {
    path: '',
    component: DesignSystemLayoutComponent,
    children: [
      // Default redirect to button (our first implemented component)
      {
        path: '',
        redirectTo: 'ui/button',
        pathMatch: 'full',
      },

      // =============================================================================
      // UI COMPONENTS (Implemented)
      // =============================================================================
      {
        path: 'ui/button',
        component: ButtonShowcaseComponent,
        data: {
          title: 'Button Component',
          category: 'ui',
          description: 'Interactive button component with multiple variants and states',
        },
      },

      {
        path: 'ui/input',
        component: InputShowcaseComponent,
        data: {
          title: 'Input Component',
          category: 'ui',
          description: 'Versatile input component with validation, icons, and accessibility',
        },
      },

      {
        path: 'ui/select',
        component: SelectShowcaseComponent,
        data: {
          title: 'Select Component',
          category: 'ui',
          description: 'Advanced select component with search, multi-select, and grouping',
        },
      },

      {
        path: 'ui/checkbox',
        component: CheckboxShowcaseComponent,
        data: {
          title: 'Checkbox Component',
          category: 'ui',
          description:
            'Versatile checkbox component with groups, indeterminate states, and accessibility',
        },
      },

      {
        path: 'ui/radio',
        component: RadioShowcaseComponent,
        data: {
          title: 'Radio Component',
          category: 'ui',
          description:
            'Radio button group component for single selection with keyboard navigation and accessibility',
        },
      },

      // =============================================================================
      // FORM COMPONENTS (Implemented)
      // =============================================================================
      {
        path: 'forms/form-field',
        component: FormFieldShowcaseComponent,
        data: {
          title: 'Form Field',
          category: 'forms',
          description: 'Wrapper component for form controls with labeling, validation, and layout',
        },
      },

      {
        path: 'forms/form-group',
        component: FormGroupShowcaseComponent,
        data: {
          title: 'Form Group',
          category: 'forms',
          description:
            'Logical grouping component for related form fields with collapsible functionality',
        },
      },

      // =============================================================================
      // DATA COMPONENTS (Implemented)
      // =============================================================================
      {
        path: 'data/table',
        loadComponent: () => import('./ui/table').then(m => m.TableShowcaseComponent),
        data: {
          title: 'Table Component',
          category: 'data',
          description: 'Modern data table with sorting, pagination, filtering, and selection',
        },
      },

      {
        path: 'data/list',
        loadComponent: () => import('./ui/list').then(m => m.ListShowcaseComponent),
        data: {
          title: 'List Component',
          category: 'data',
          description: 'Flexible list with virtual scrolling, infinite scroll, and selection',
        },
      },

      {
        path: 'data/card',
        loadComponent: () => import('./ui/card').then(m => m.CardShowcaseComponent),
        data: {
          title: 'Card Component',
          category: 'data',
          description: 'Flexible container with headers, footers, media, and actions',
        },
      },

      // =============================================================================
      // LAYOUT COMPONENTS
      // =============================================================================
      {
        path: 'layout/grid',
        loadComponent: () => import('./layout/grid').then(m => m.GridShowcaseComponent),
        data: {
          title: 'Grid Layout System',
          category: 'layout',
          description: 'Flexible grid system with responsive design and CSS Grid features',
        },
      },

      // =============================================================================
      // PLACEHOLDER ROUTES (To be implemented)
      // =============================================================================
      // These will be uncommented as we implement each component

      // {
      //   path: 'overview',
      //   loadComponent: () =>
      //     import('./overview/overview.component').then((m) => m.OverviewComponent),
      // },

      // Fallback route
      {
        path: '**',
        redirectTo: 'ui/button',
      },
    ],
  },
];
