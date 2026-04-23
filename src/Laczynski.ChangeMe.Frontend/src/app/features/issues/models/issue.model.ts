import { PaginationParameters } from '@shared/data';

export interface Issue {
  id: string;
  title: string;
  description?: string;
  priority: IssuePriority;
  comments: IssueComment[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface IssueComment {
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
}

export interface UpdateIssueRequest {
  id: string;
  title: string;
  description?: string;
  priority: IssuePriority;
}

export interface IssueSearchParameters extends PaginationParameters {
  searchTerm?: string;
}

export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}