import { PaginationParameters } from '@shared/data/models/pagination-parameters.model';

export interface IssueDto {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  createdBy: string;
  createdByName?: string | null;
  assignedToUserId?: string | null;
  assignedToUserName?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  lastActivityAt: string;
  isWatchedByCurrentUser: boolean;
  watchersCount: number;
}

export interface IssueDetailsDto {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  createdBy: string;
  createdByName?: string | null;
  assignedToUserId?: string | null;
  assignedToUserName?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  lastActivityAt: string;
  isWatchedByCurrentUser: boolean;
  watchersCount: number;
  acceptanceCriteria: AcceptanceCriterionDto[];
  comments: IssueCommentDto[];
  historyEntries: IssueHistoryEntryDto[];
}

export interface AcceptanceCriterionDto {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface IssueCommentDto {
  id: string;
  content: string;
  authorUserId: string;
  authorName?: string | null;
  createdAt: string;
}

export interface IssueHistoryEntryDto {
  id: string;
  eventType: IssueHistoryEventType;
  actorUserId: string;
  actorName?: string | null;
  summary: string;
  previousValue?: string | null;
  currentValue?: string | null;
  createdAt: string;
}

export interface CreateIssueRequest {
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignedToUserId?: string | null;
  watchAfterCreate: boolean;
  acceptanceCriteria: CreateIssueAcceptanceCriterionPayload[];
}

export interface CreateIssueAcceptanceCriterionPayload {
  content: string;
}

export interface UpdateIssueRequest {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignedToUserId?: string | null;
  acceptanceCriteria: UpdateIssueAcceptanceCriterionPayload[];
}

export interface UpdateIssueAcceptanceCriterionPayload {
  id?: string;
  content: string;
}

export interface IssueSearchParameters extends PaginationParameters {}

export enum IssueStatus {
  NEW = 1,
  IN_PROGRESS = 2,
  RESOLVED = 3,
  CLOSED = 4
}

export enum IssuePriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4
}

export enum IssueHistoryEventType {
  ISSUE_CREATED = 0,
  STATUS_CHANGED = 1,
  PRIORITY_CHANGED = 2,
  ASSIGNEE_CHANGED = 3,
  TITLE_CHANGED = 4,
  DESCRIPTION_CHANGED = 5
}

export const IssueConstraints = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 2000
};

export const IssueAcceptanceCriteriaConstraints = {
  CONTENT_MAX_LENGTH: 2000
};
