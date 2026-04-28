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
  acceptanceCriteria: AcceptanceCriterionDto[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface AcceptanceCriterionDto {
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
  acceptanceCriteria: CreateIssueAcceptanceCriterionPayload[];
}

export interface CreateIssueAcceptanceCriterionPayload {
  content: string;
}

export interface UpdateIssueRequest {
  id: string;
  title: string;
  description?: string;
  priority: IssuePriority;
  acceptanceCriteria: UpdateIssueAcceptanceCriterionPayload[];
}

export interface UpdateIssueAcceptanceCriterionPayload {
  id?: string;
  content: string;
}

export interface IssueSearchParameters extends PaginationParameters {}

export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export const IssueConstraints = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 2000
};

export const IssueAcceptanceCriteriaConstraints = {
  CONTENT_MAX_LENGTH: 2000
};
