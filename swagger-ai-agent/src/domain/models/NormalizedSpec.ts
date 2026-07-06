/**
 * The normalised internal representation of a Swagger/OpenAPI document.
 * Domain model — no external dependencies.
 */

import { Operation } from './Operation';

export interface ServerInfo {
  url: string;
  description?: string;
}

export interface TagInfo {
  name: string;
  description?: string;
}

export interface NormalizedSpec {
  /** Unique identifier assigned on ingestion. */
  id: string;
  title: string;
  version: string;
  /** OpenAPI spec version, e.g. '2.0', '3.0.3', '3.1.0'. */
  specVersion: string;
  servers: ServerInfo[];
  tags: TagInfo[];
  operations: Operation[];
  /** ISO timestamp of when this spec was ingested. */
  ingestedAt: string;
  /** Raw source reference (url / file path / git ref). */
  sourceRef: string;
}
