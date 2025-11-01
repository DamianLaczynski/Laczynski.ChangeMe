import { Routes } from '@angular/router';
import { AccordionShowcaseComponent } from '@shared/components/accordion/accordion.showcase.component';
import { BreadcrumbShowcaseComponent } from '@shared/components/breadcrumb/breadcrumb.showcase.component';
import { ButtonShowcaseComponent } from '@shared/components/button/button.showcase.component';
import { DateShowcaseComponent } from '@shared/components/field/date/date.showcase.component';
import { DateRangeShowcaseComponent } from '@shared/components/field/date-range/date-range.showcase.component';
import { DropdownShowcaseComponent } from '@shared/components/field/dropdown/dropdown.showcase.component';
import { NumberShowcaseComponent } from '@shared/components/field/number/number.showcase.component';
import { PasswordShowcaseComponent } from '@shared/components/field/password/password.showcase.component';
import { TextShowcaseComponent } from '@shared/components/field/text/text.showcase.component';
import { TabsShowcaseComponent } from '@shared/components/tabs/tabs.showcase.component';
import { SkeletonShowcaseComponent } from '@shared/components/skeleton/skeleton.showcase.component';
import { TreeShowcaseComponent } from '@shared/components/tree/tree.showcase.component';
import { DialogShowcaseComponent } from '@shared/components/dialog/dialog.showcase.component';
import { MenuShowcaseComponent } from '@shared/components/menu/menu.showcase.component';
import { TagShowcaseComponent } from '@shared/components/tag/tag.showcase.component';
import { ProgressBarShowcaseComponent } from '@shared/components/progress-bar/progress-bar.showcase.component';
import { SliderShowcaseComponent } from '@shared/components/field/slider/slider.showcase.component';
import { DividerShowcaseComponent } from '@shared/components/divider/divider.showcase.component';
import { BadgeShowcaseComponent } from '@shared/components/badge/badge.showcase.component';
import { CardShowcaseComponent } from '@shared/components/card/card.showcase.component';
import { CheckboxShowcaseComponent } from '@shared/components/field/checkbox/checkbox.showcase.component';
import { ColorShowcaseComponent } from '@shared/components/field/color/color.showcase.component';
import { SwitchShowcaseComponent } from '@shared/components/field/switch/switch.showcase.component';
import { RadioShowcaseComponent } from '@shared/components/field/radio/radio.showcase.component';
import { SplitterShowcaseComponent } from '@shared/components/splitter/splitter.showcase.component';
import { ScrollPanelShowcaseComponent } from '@shared/components/scroll-panel/scroll-panel.showcase.component';
import { SpinnerShowcaseComponent } from '@shared/components/spinner/spinner.showcase.component';
import { FileShowcaseComponent } from '@shared/components/field/file/file.showcase.component';
import { StepperShowcaseComponent } from '@shared/components/field/stepper/stepper.showcase.component';
import { ToastShowcaseComponent } from '@shared/components/toast/toast.showcase.component';
import { NavShowcaseComponent } from '@shared/components/nav';

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
    path: 'color',
    component: ColorShowcaseComponent,
  },
  {
    path: 'date',
    component: DateShowcaseComponent,
  },
  {
    path: 'date-range',
    component: DateRangeShowcaseComponent,
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
    path: 'password',
    component: PasswordShowcaseComponent,
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
    path: 'tabs',
    component: TabsShowcaseComponent,
  },
  {
    path: 'menu',
    component: MenuShowcaseComponent,
  },
  {
    path: 'nav',
    component: NavShowcaseComponent,
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
    path: 'stepper',
    component: StepperShowcaseComponent,
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
    path: 'toast',
    component: ToastShowcaseComponent,
  },
  {
    path: 'tree',
    component: TreeShowcaseComponent,
  },
  {
    path: 'file',
    component: FileShowcaseComponent,
  },
];
