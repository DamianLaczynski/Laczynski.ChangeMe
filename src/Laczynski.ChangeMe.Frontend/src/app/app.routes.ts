import { Routes } from '@angular/router';
import { ItemsListComponent } from '@features/items/components/items-list/items-list.component';
import { ItemsInfiniteListComponent } from '@features/items/components/items-infinite-list/items-infinite-list.component';
import { ItemFormComponent } from '@features/items/components/item-form/item-form.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/items',
    pathMatch: 'full',
  },
  {
    path: 'items',
    component: ItemsListComponent,
  },
  {
    path: 'items/add',
    component: ItemFormComponent,
  },
  {
    path: 'items/edit/:itemId',
    component: ItemFormComponent,
  },
  {
    path: 'items/infinite',
    component: ItemsInfiniteListComponent,
  },
  {
    path: '**',
    redirectTo: '/items',
  },
];
