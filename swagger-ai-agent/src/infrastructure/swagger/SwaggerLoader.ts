import axios from 'axios';
import * as fs from 'fs/promises';
import { ValidationError } from '../../core/errors/ValidationError';
import { ExternalServiceError } from '../../core/errors/ExternalServiceError';

export interface GitSpecSource {
  repo: string;
  ref: string;
  filePath: string;
}

/**
 * Infrastructure adapter for acquiring raw Swagger/OpenAPI documents.
 * Parsing and normalization are handled by separate adapters.
 */
export class SwaggerLoader {
  constructor(private readonly maxSpecSizeBytes = 3 * 1024 * 1024) {}

  async loadFromUrl(url: string): Promise<string> {
    try {
      const response = await axios.get<string>(url, {
        responseType: 'text',
        timeout: 15_000,
      });

      const contentLength = Number(response.headers['content-length'] ?? 0);
      if (Number.isFinite(contentLength) && contentLength > this.maxSpecSizeBytes) {
        throw new ValidationError('Spec exceeds maximum size limit', [
          {
            field: 'source.url',
            message: `Spec size exceeds limit of ${this.maxSpecSizeBytes} bytes`,
          },
        ]);
      }

      this.assertContentSize(response.data, 'source.url');
      return response.data;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ExternalServiceError('swagger-loader', 'Failed to fetch spec from URL', error as Error);
    }
  }

  async loadFromFile(filePath: string): Promise<string> {
    try {
      const stat = await fs.stat(filePath);
      if (stat.size > this.maxSpecSizeBytes) {
        throw new ValidationError('Spec exceeds maximum size limit', [
          {
            field: 'source.path',
            message: `Spec file size exceeds limit of ${this.maxSpecSizeBytes} bytes`,
          },
        ]);
      }

      const content = await fs.readFile(filePath, 'utf-8');
      this.assertContentSize(content, 'source.path');
      return content;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ExternalServiceError('swagger-loader', 'Failed to read spec from file path', error as Error);
    }
  }

  async loadFromGit(source: GitSpecSource): Promise<string> {
    // Phase 3 skeleton: Git loading will be implemented in a later phase.
    void source;
    throw new Error('loadFromGit is not implemented yet');
  }

  private assertContentSize(content: string, field: string): void {
    const size = Buffer.byteLength(content, 'utf8');
    if (size > this.maxSpecSizeBytes) {
      throw new ValidationError('Spec exceeds maximum size limit', [
        {
          field,
          message: `Spec size exceeds limit of ${this.maxSpecSizeBytes} bytes`,
        },
      ]);
    }
  }
}
