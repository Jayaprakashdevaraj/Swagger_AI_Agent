/**
 * Named environment configuration for a spec (dev / qa / stage / prod etc.).
 * Domain model — no external dependencies.
 */

export type AuthType = 'none' | 'bearer' | 'basic' | 'apiKey';

export interface BearerAuthConfig {
  type: 'bearer';
  token: string;
}

export interface BasicAuthConfig {
  type: 'basic';
  username: string;
  password: string;
}

export interface ApiKeyAuthConfig {
  type: 'apiKey';
  /** Header / query param name, e.g. 'x-api-key'. */
  keyName: string;
  keyValue: string;
  /** Where to send the key. Defaults to 'header'. */
  in: 'header' | 'query';
}

export interface NoAuthConfig {
  type: 'none';
}

export type AuthConfig =
  | NoAuthConfig
  | BearerAuthConfig
  | BasicAuthConfig
  | ApiKeyAuthConfig;

export interface EnvironmentConfig {
  /** Unique identifier. */
  id: string;
  /** Associated spec identifier. */
  specId: string;
  /** Human-readable name: 'dev', 'qa', 'stage', 'prod', etc. */
  name: string;
  baseUrl: string;
  /** Default headers applied to every request in this environment. */
  defaultHeaders: Record<string, string>;
  authConfig: AuthConfig;
  /** ISO timestamp. */
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}
