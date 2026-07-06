import { AuthConfig } from '../../domain/models/EnvironmentConfig';

export interface CreateEnvironmentRequestDto {
  specId: string;
  name: string;
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  authConfig?: AuthConfig;
}

export interface UpdateEnvironmentRequestDto {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  authConfig?: AuthConfig;
}

export interface EnvironmentResponseDto {
  id: string;
  specId: string;
  name: string;
  baseUrl: string;
  defaultHeaders: Record<string, string>;
  authConfig: AuthConfig;
  createdAt: string;
  updatedAt: string;
}
