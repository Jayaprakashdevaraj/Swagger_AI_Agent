export type AuthType = 'none' | 'basic' | 'bearer' | 'apiKey'

export interface NoAuthConfig {
  type: 'none'
}

export interface BasicAuthConfig {
  type: 'basic'
  username: string
  password: string
}

export interface BearerAuthConfig {
  type: 'bearer'
  token: string
}

export interface ApiKeyAuthConfig {
  type: 'apiKey'
  keyName: string
  keyValue: string
  in: 'header' | 'query'
}

export type AuthConfig = NoAuthConfig | BasicAuthConfig | BearerAuthConfig | ApiKeyAuthConfig

export interface EnvironmentConfig {
  id: string
  specId: string
  name: string
  baseUrl: string
  defaultHeaders: Record<string, string>
  authConfig: AuthConfig
  createdAt: string
  updatedAt: string
  deleted: boolean
}

export interface CreateEnvironmentInput {
  specId: string
  name: string
  baseUrl: string
  defaultHeaders?: Record<string, string>
  authConfig?: AuthConfig
}

export interface UpdateEnvironmentInput {
  baseUrl?: string
  defaultHeaders?: Record<string, string>
  authConfig?: AuthConfig
}

export interface HeaderRow {
  key: string
  value: string
}

export interface EnvironmentFormValues {
  specId: string
  name: string
  description?: string
  baseUrl: string
  authType: 'none' | 'basic' | 'bearer' | 'apiKey' | 'oauth2'
  username?: string
  password?: string
  token?: string
  apiKeyName?: string
  apiKeyValue?: string
  apiKeyIn?: 'header' | 'query'
  defaultHeaders: HeaderRow[]
}