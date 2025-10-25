import { Routes } from '@angular/router';
import { DsComponent } from '@shared/ds/ds.component';
import { dsRoutes } from '@shared/ds/ds.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'ds',
    pathMatch: 'full',
  },
  {
    path: 'ds',
    component: DsComponent,
    children: dsRoutes,
  },
];
