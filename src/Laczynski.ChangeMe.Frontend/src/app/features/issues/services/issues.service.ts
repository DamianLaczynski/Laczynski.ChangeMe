import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/api/services/api.service';
import {
  IssueDto,
  CreateIssueRequest,
  UpdateIssueRequest,
  IssueSearchParameters,
  IssuePriority,
  IssueStatus,
  IssueDetailsDto,
  IssueAssignableUserDto
} from '../models/issue.model';
import { PaginationResult } from '@shared/data/models/pagination-result.model';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  private readonly apiService = inject(ApiService);

  private readonly baseEndpoint = 'issues';

  getAllIssues(params: IssueSearchParameters): Observable<PaginationResult<IssueDto>> {
    return this.apiService.getPaginated<IssueDto, IssueSearchParameters>(
      this.baseEndpoint,
      params
    );
  }

  getIssue(id: string): Observable<IssueDetailsDto> {
    return this.apiService.get<IssueDetailsDto>(`${this.baseEndpoint}/${id}`);
  }

  getAssignableUsers(): Observable<IssueAssignableUserDto[]> {
    return this.apiService.get<IssueAssignableUserDto[]>(
      `${this.baseEndpoint}/assignable-users`
    );
  }

  createIssue(request: CreateIssueRequest): Observable<IssueDetailsDto> {
    return this.apiService.post<IssueDetailsDto>(this.baseEndpoint, request);
  }

  updateIssue(request: UpdateIssueRequest): Observable<IssueDetailsDto> {
    return this.apiService.put<IssueDetailsDto>(
      `${this.baseEndpoint}/${request.id}`,
      request
    );
  }

  deleteIssue(id: string): Observable<boolean> {
    return this.apiService.delete<boolean>(`${this.baseEndpoint}/${id}`);
  }

  issuePriorities = signal<{ value: IssuePriority; label: string }[]>([
    { value: IssuePriority.LOW, label: 'Low' },
    { value: IssuePriority.MEDIUM, label: 'Medium' },
    { value: IssuePriority.HIGH, label: 'High' },
    { value: IssuePriority.CRITICAL, label: 'Critical' }
  ]);

  issueStatuses = signal<{ value: IssueStatus; label: string }[]>([
    { value: IssueStatus.NEW, label: 'New' },
    { value: IssueStatus.IN_PROGRESS, label: 'In Progress' },
    { value: IssueStatus.RESOLVED, label: 'Resolved' },
    { value: IssueStatus.CLOSED, label: 'Closed' }
  ]);
}
