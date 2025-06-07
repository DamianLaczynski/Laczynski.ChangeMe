// =============================================================================
// Design System Routes Configuration
// =============================================================================
// Routes for design system components and showcases

import { Routes } from '@angular/router';
import { InputShowcaseComponent } from './input/input-showcase.component';
import { SelectShowcaseComponent } from './select/select-showcase.component';
import { CheckboxShowcaseComponent } from './checkbox/checkbox-showcase.component';
import { RadioShowcaseComponent } from './radio/radio-showcase.component';
import { SwitchShowcaseComponent } from './switch';
import { TableShowcaseComponent } from './table';
import { TabsShowcaseComponent } from './tabs/tabs-showcase.component';
import { TreeShowcaseComponent } from './tree/tree-showcase.component';
import { OverviewComponent } from './showcases/overview';
import { ButtonShowcaseComponent } from './button';
import { DesignSystemLayoutComponent } from './showcases/layout/ds-layout.component';
import { TextareaShowcaseComponent } from './textarea/textarea-showcase.component';
import { AccordionShowcaseComponent } from './accordion';
import { SplitterShowcaseComponent } from './splitter/splitter-showcase.component';
import { ScrollPanelShowcaseComponent } from './scrollpanel/scrollpanel-showcase.component';
import { ModalShowcaseComponent } from './modal';

/**
 * Design System routes with layout wrapper
 */
export const DS_ROUTES: Routes = [
  {
    path: '',
    component: DesignSystemLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },

      // =============================================================================
      // OVERVIEW SECTION
      // =============================================================================
      {
        path: 'overview',
        component: OverviewComponent,
      },

      // =============================================================================
      // ACTIONS COMPONENTS
      // =============================================================================
      {
        path: 'actions/button',
        component: ButtonShowcaseComponent,
      },

      // =============================================================================
      // FORMS COMPONENTS
      // =============================================================================

      {
        path: 'forms/input',
        component: InputShowcaseComponent,
      },

      {
        path: 'forms/select',
        component: SelectShowcaseComponent,
      },

      {
        path: 'forms/checkbox',
        component: CheckboxShowcaseComponent,
      },

      {
        path: 'forms/radio',
        component: RadioShowcaseComponent,
      },

      {
        path: 'forms/switch',
        component: SwitchShowcaseComponent,
      },

      {
        path: 'forms/textarea',
        component: TextareaShowcaseComponent,
      },

      // =============================================================================
      // DATA COMPONENTS
      // =============================================================================
      {
        path: 'data/table',
        component: TableShowcaseComponent,
      },

      {
        path: 'data/tree',
        component: TreeShowcaseComponent,
      },

      // =============================================================================
      // LAYOUT COMPONENTS
      // =============================================================================
      {
        path: 'layout/accordion',
        component: AccordionShowcaseComponent,
      },

      {
        path: 'layout/splitter',
        component: SplitterShowcaseComponent,
      },

      {
        path: 'layout/scrollpanel',
        component: ScrollPanelShowcaseComponent,
      },
      {
        path: 'layout/tabs',
        component: TabsShowcaseComponent,
      },

      // =============================================================================
      // OVERLAY COMPONENTS
      // =============================================================================
      {
        path: 'overlay/modal',
        component: ModalShowcaseComponent,
      },

      // =============================================================================
      // FEEDBACK COMPONENTS
      // =============================================================================

      // =============================================================================
      // NAVIGATION COMPONENTS
      // =============================================================================

      // =============================================================================
      // NAVIGATION COMPONENTS
      // =============================================================================

      // Fallback route
      {
        path: '**',
        redirectTo: 'overview',
      },
    ],
  },
];
