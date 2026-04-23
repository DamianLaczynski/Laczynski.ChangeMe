import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api';
import {
  Issue,
  CreateIssueRequest,
  UpdateIssueRequest,
  IssueSearchParameters,
  IssuePriority,
} from '../models/issue.model';
import { PaginationResult } from '@shared/data';

@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  private readonly apiService = inject(ApiService);

  private readonly baseEndpoint = 'issues';

  getAllIssues(params: IssueSearchParameters): Observable<PaginationResult<Issue>> {
    return this.apiService.getPaginated<Issue, IssueSearchParameters>(this.baseEndpoint, params);
  }

  getIssue(id: string): Observable<Issue> {
    return this.apiService.get<Issue>(`${this.baseEndpoint}/${id}`);
  }

  createIssue(request: CreateIssueRequest): Observable<string> {
    return this.apiService.post<string>(this.baseEndpoint, request);
  }

  updateIssue(request: UpdateIssueRequest): Observable<Issue> {
    return this.apiService.put<Issue>(`${this.baseEndpoint}/${request.id}`, request);
  }

  deleteIssue(id: string): Observable<boolean> {
    return this.apiService.delete<boolean>(`${this.baseEndpoint}/${id}`);
  }

  issuePriorities = signal<{ value: IssuePriority; label: string }[]>([
    { value: IssuePriority.LOW, label: 'Low' },
    { value: IssuePriority.MEDIUM, label: 'Medium' },
    { value: IssuePriority.HIGH, label: 'High' },
    { value: IssuePriority.CRITICAL, label: 'Critical' },
  ]);

}
