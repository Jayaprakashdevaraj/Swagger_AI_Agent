export interface SpecListItem {
  id: string
  title: string
  version: string
  specVersion: string
  operationCount: number
  tagNames: string[]
  ingestedAt: string
  sourceRef: string
}

export interface ServerInfo {
  url: string
  description?: string
}

export interface TagInfo {
  name: string
  description?: string
}

export interface SpecMetadata {
  id: string
  title: string
  version: string
  specVersion: string
  servers: ServerInfo[]
  tags: TagInfo[]
  operationCount: number
}

export interface OperationSummary {
  operationId: string
  method: string
  path: string
  tags: string[]
  summary?: string
}

export interface TagSummary {
  tag: string
  operationCount: number
}

export interface LinkedEnvironmentSummary {
  id: string
  specId: string
  name: string
  baseUrl: string
  defaultHeaders?: Record<string, string>
  authConfig?: Record<string, unknown>
  deleted?: boolean
}

export interface SpecDetail {
  metadata: SpecMetadata
  operations: OperationSummary[]
  tags: TagSummary[]
  environments: LinkedEnvironmentSummary[]
}

export type SpecSource =
  | { type: 'url'; url: string }
  | { type: 'content'; content: string; fileName?: string }
  | { type: 'git'; repo: string; ref: string; filePath: string }

export interface ImportSpecResponse {
  specId: string
  title: string
  version: string
  operationCount: number
}