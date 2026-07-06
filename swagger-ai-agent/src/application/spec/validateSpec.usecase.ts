import { SpecRepository } from '../../domain/repositories/SpecRepository';
import { SwaggerParserAdapter } from '../../infrastructure/swagger/SwaggerParserAdapter';

export interface ValidateSpecIssue {
  code: string;
  message: string;
}

export interface ValidateSpecInput {
  specId?: string;
  rawContent?: string;
}

export interface ValidateSpecOutput {
  valid: boolean;
  issues: ValidateSpecIssue[];
}

export class ValidateSpecUseCase {
  constructor(
    private readonly specRepository: SpecRepository,
    private readonly parser: SwaggerParserAdapter
  ) {}

  async execute(input: ValidateSpecInput): Promise<ValidateSpecOutput> {
    const issues: ValidateSpecIssue[] = [];

    if (input.specId) {
      const spec = await this.specRepository.findById(input.specId);
      if (!spec) {
        return {
          valid: false,
          issues: [{ code: 'SPEC_NOT_FOUND', message: `Spec not found: ${input.specId}` }],
        };
      }

      if (!spec.title || spec.title.trim() === '') {
        issues.push({ code: 'MISSING_TITLE', message: 'Spec title is missing' });
      }
      if (!spec.version || spec.version.trim() === '') {
        issues.push({ code: 'MISSING_VERSION', message: 'Spec version is missing' });
      }

      return {
        valid: issues.length === 0,
        issues,
      };
    }

    if (input.rawContent) {
      try {
        const parsed = await this.parser.parse(input.rawContent, true);
        const raw = parsed.raw as Record<string, unknown>;

        const hasInfo = typeof raw.info === 'object' && raw.info !== null;
        if (!hasInfo) {
          issues.push({ code: 'MISSING_INFO', message: 'Spec must contain info object' });
        }

        const paths = raw.paths;
        if (typeof paths !== 'object' || paths === null || Object.keys(paths).length === 0) {
          issues.push({ code: 'MISSING_PATHS', message: 'Spec must contain non-empty paths object' });
        }
      } catch (error) {
        return {
          valid: false,
          issues: [
            {
              code: 'PARSER_ERROR',
              message: error instanceof Error ? error.message : 'Failed to parse/validate spec',
            },
          ],
        };
      }

      return {
        valid: issues.length === 0,
        issues,
      };
    }

    return {
      valid: false,
      issues: [{ code: 'INVALID_INPUT', message: 'Either specId or rawContent is required' }],
    };
  }
}
