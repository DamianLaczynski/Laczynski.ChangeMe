import { PaginationParameters } from '@shared/data/models/pagination-parameters.model';

export interface IssueDto {
  id: string;
  title: string;
  description?: string;
  priority: IssuePriority;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface IssueDetailsDto {
  id: string;
  title: string;
  description?: string;
  priority: IssuePriority;
  comments: IssueCommentDto[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface IssueCommentDto {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface CreateIssueRequest {
  title: string;
  description?: string;
  priority: IssuePriority;
  comments: CreateIssueCommentPayload[];
}

export interface CreateIssueCommentPayload {
  content: string;
}

export interface UpdateIssueRequest {
  id: string;
  title: string;
  description?: string;
  priority: IssuePriority;
  comments: UpdateIssueCommentPayload[];
}

export interface UpdateIssueCommentPayload {
  id?: string;
  content: string;
}

export interface IssueSearchParameters extends PaginationParameters { }

export enum IssuePriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
}
