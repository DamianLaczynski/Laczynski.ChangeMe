import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { IssuesComponent } from '@features/issues/components/issues/issues.component';
import { CreateIssueComponent } from '@features/issues/components/create-issue/create-issue.component';
import { IssueDetailsComponent } from '@features/issues/components/issue-details/issue-details.component';
import { EditIssueComponent } from '@features/issues/components/edit-issue/edit-issue.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        redirectTo: 'issues',
        pathMatch: 'full',
      },
      {
        path: 'issues',
        component: IssuesComponent,
      },
      {
        path: 'issues/create',
        component: CreateIssueComponent,
      },
      {
        path: 'issues/:id',
        component: IssueDetailsComponent,
      },
      {
        path: 'issues/:id/edit',
        component: EditIssueComponent,
      },
    ],
  },
];
