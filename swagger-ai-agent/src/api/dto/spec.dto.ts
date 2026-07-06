export type SpecSourceType = 'url' | 'file' | 'git';

export interface UrlSpecSourceDto {
  type: 'url';
  url: string;
}

export interface FileSpecSourceDto {
  type: 'file';
  path: string;
}

export interface GitSpecSourceDto {
  type: 'git';
  repo: string;
  ref: string;
  filePath: string;
}

export type SpecSourceDto = UrlSpecSourceDto | FileSpecSourceDto | GitSpecSourceDto;

export interface ImportSpecRequestDto {
  source: SpecSourceDto;
}

export interface ImportSpecResponseDto {
  specId: string;
  title: string;
  version: string;
  operationCount: number;
}

export interface ValidateSpecRequestDto {
  specId?: string;
  rawContent?: string;
}

export interface ValidateSpecIssueDto {
  code: string;
  message: string;
}

export interface ValidateSpecResponseDto {
  valid: boolean;
  issues: ValidateSpecIssueDto[];
}

export interface OperationSummaryDto {
  operationId: string;
  method: string;
  path: string;
  tags: string[];
  summary?: string;
}

export interface TagSummaryDto {
  tag: string;
  operationCount: number;
}
