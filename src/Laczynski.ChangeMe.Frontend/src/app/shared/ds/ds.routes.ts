import { Routes } from '@angular/router';
import { AccordionShowcaseComponent } from '@shared/components/accordion/accordion.showcase.component';
import { BreadcrumbShowcaseComponent } from '@shared/components/breadcrumb/breadcrumb.showcase.component';
import { ButtonShowcaseComponent } from '@shared/components/button/button.showcase.component';
import { DropdownShowcaseComponent } from '@shared/components/field/dropdown/dropdown.showcase.component';
import { NumberShowcaseComponent } from '@shared/components/field/number/number.showcase.component';
import { TextShowcaseComponent } from '@shared/components/field/text/text.showcase.component';
import { HorizontalTabsShowcaseComponent } from '@shared/components/horizontal-tabs/horizontal-tabs.showcase.component';
import { InputShowcaseComponent } from '@shared/components/input/input.showcase.component';
import { SkeletonShowcaseComponent } from '@shared/components/skeleton/skeleton.showcase.component';
import { TreeShowcaseComponent } from '@shared/components/tree/tree.showcase.component';
import { DialogShowcaseComponent } from '@shared/components/dialog/dialog.showcase.component';
import { MenuShowcaseComponent } from '@shared/components/menu/menu.showcase.component';
import { DataGridShowcaseComponent } from '@shared/components/data-grid/data-grid.showcase.component';
import { TagShowcaseComponent } from '@shared/components/tag/tag.showcase.component';
import { ProgressBarShowcaseComponent } from '@shared/components/progress-bar/progress-bar.showcase.component';
import { SliderShowcaseComponent } from '@shared/components/field/slider/slider.showcase.component';
import { DividerShowcaseComponent } from '@shared/components/divider/divider.showcase.component';
import { BadgeShowcaseComponent } from '@shared/components/badge/badge.showcase.component';
import { CardShowcaseComponent } from '@shared/components/card/card.showcase.component';
import { CheckboxShowcaseComponent } from '@shared/components/field/checkbox/checkbox.showcase.component';
import { SwitchShowcaseComponent } from '@shared/components/field/switch/switch.showcase.component';
import { RadioShowcaseComponent } from '@shared/components/field/radio/radio.showcase.component';
import { SplitterShowcaseComponent } from '@shared/components/splitter/splitter.showcase.component';
import { ScrollPanelShowcaseComponent } from '@shared/components/scroll-panel/scroll-panel.showcase.component';
import { SpinnerShowcaseComponent } from '@shared/components/spinner/spinner.showcase.component';

export const dsRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'accordion',
  },
  {
    path: 'accordion',
    component: AccordionShowcaseComponent,
  },
  {
    path: 'badge',
    component: BadgeShowcaseComponent,
  },
  {
    path: 'breadcrumb',
    component: BreadcrumbShowcaseComponent,
  },
  {
    path: 'button',
    component: ButtonShowcaseComponent,
  },
  {
    path: 'card',
    component: CardShowcaseComponent,
  },

  {
    path: 'dialog',
    component: DialogShowcaseComponent,
  },
  {
    path: 'divider',
    component: DividerShowcaseComponent,
  },
  {
    path: 'checkbox',
    component: CheckboxShowcaseComponent,
  },
  {
    path: 'dropdown',
    component: DropdownShowcaseComponent,
  },
  {
    path: 'number',
    component: NumberShowcaseComponent,
  },
  {
    path: 'radio',
    component: RadioShowcaseComponent,
  },
  {
    path: 'slider',
    component: SliderShowcaseComponent,
  },
  {
    path: 'switch',
    component: SwitchShowcaseComponent,
  },
  {
    path: 'text',
    component: TextShowcaseComponent,
  },

  {
    path: 'input',
    component: InputShowcaseComponent,
  },

  {
    path: 'progress-bar',
    component: ProgressBarShowcaseComponent,
  },
  {
    path: 'scroll-panel',
    component: ScrollPanelShowcaseComponent,
  },
  {
    path: 'splitter',
    component: SplitterShowcaseComponent,
  },
  {
    path: 'spinner',
    component: SpinnerShowcaseComponent,
  },
  {
    path: 'skeleton',
    component: SkeletonShowcaseComponent,
  },
  {
    path: 'tag',
    component: TagShowcaseComponent,
  },
  {
    path: 'tree',
    component: TreeShowcaseComponent,
  },
];
