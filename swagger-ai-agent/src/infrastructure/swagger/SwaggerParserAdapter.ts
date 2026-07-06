import SwaggerParser from '@apidevtools/swagger-parser';
import yaml from 'js-yaml';

export interface ParsedSpec {
  raw: unknown;
  specVersion: string;
}

/**
 * Wraps OpenAPI/Swagger parser libs behind a stable internal interface.
 */
export class SwaggerParserAdapter {
  async parse(rawSpecContent: string, shouldValidate = true): Promise<ParsedSpec> {
    const raw = this.parseRawContent(rawSpecContent);

    if (shouldValidate) {
      const parser = new SwaggerParser();
      await parser.validate(raw as any);
    }

    const specVersion = this.detectSpecVersion(raw);
    return { raw, specVersion };
  }

  private parseRawContent(rawSpecContent: string): unknown {
    const trimmed = rawSpecContent.trim();
    if (!trimmed) {
      throw new Error('Spec content is empty');
    }

    try {
      return JSON.parse(trimmed);
    } catch {
      try {
        return yaml.load(trimmed);
      } catch (error) {
        throw new Error(
          `Unable to parse spec content as JSON or YAML: ${
            error instanceof Error ? error.message : 'unknown parser error'
          }`
        );
      }
    }
  }

  private detectSpecVersion(raw: unknown): string {
    if (typeof raw !== 'object' || raw === null) {
      return 'unknown';
    }

    const spec = raw as Record<string, unknown>;
    const openapi = spec.openapi;
    const swagger = spec.swagger;

    if (typeof openapi === 'string') {
      return openapi;
    }
    if (typeof swagger === 'string') {
      return swagger;
    }
    return 'unknown';
  }
}
