import axios from 'axios';
import * as fs from 'fs/promises';

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
  async loadFromUrl(url: string): Promise<string> {
    const response = await axios.get<string>(url, {
      responseType: 'text',
      timeout: 15_000,
    });
    return response.data;
  }

  async loadFromFile(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf-8');
  }

  async loadFromGit(source: GitSpecSource): Promise<string> {
    // Phase 3 skeleton: Git loading will be implemented in a later phase.
    void source;
    throw new Error('loadFromGit is not implemented yet');
  }
}
