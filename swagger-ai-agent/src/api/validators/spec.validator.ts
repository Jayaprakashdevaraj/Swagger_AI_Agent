import { ValidationIssue } from '../../core/errors/ValidationError';
import { ImportSpecRequestDto, ValidateSpecRequestDto } from '../dto/spec.dto';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function validateImportSpecRequest(body: unknown): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!isObject(body)) {
    return [{ field: 'body', message: 'Body must be a JSON object' }];
  }

  const source = body.source;
  if (!isObject(source)) {
    return [{ field: 'source', message: 'source is required and must be an object' }];
  }

  const typedSource = source as unknown as ImportSpecRequestDto['source'];

  if (!typedSource.type || !['url', 'file', 'git'].includes(typedSource.type)) {
    issues.push({ field: 'source.type', message: 'source.type must be one of: url, file, git' });
    return issues;
  }

  if (typedSource.type === 'url') {
    if (!('url' in typedSource) || typeof typedSource.url !== 'string' || typedSource.url.trim() === '') {
      issues.push({ field: 'source.url', message: 'source.url is required for type=url' });
    }
  }

  if (typedSource.type === 'file') {
    if (!('path' in typedSource) || typeof typedSource.path !== 'string' || typedSource.path.trim() === '') {
      issues.push({ field: 'source.path', message: 'source.path is required for type=file' });
    }
  }

  if (typedSource.type === 'git') {
    if (!('repo' in typedSource) || typeof typedSource.repo !== 'string' || typedSource.repo.trim() === '') {
      issues.push({ field: 'source.repo', message: 'source.repo is required for type=git' });
    }
    if (!('ref' in typedSource) || typeof typedSource.ref !== 'string' || typedSource.ref.trim() === '') {
      issues.push({ field: 'source.ref', message: 'source.ref is required for type=git' });
    }
    if (!('filePath' in typedSource) || typeof typedSource.filePath !== 'string' || typedSource.filePath.trim() === '') {
      issues.push({ field: 'source.filePath', message: 'source.filePath is required for type=git' });
    }
  }

  return issues;
}

export function validateSpecValidateRequest(body: unknown): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!isObject(body)) {
    return [{ field: 'body', message: 'Body must be a JSON object' }];
  }

  const typed = body as ValidateSpecRequestDto;
  const hasSpecId = typeof typed.specId === 'string' && typed.specId.trim() !== '';
  const hasRawContent = typeof typed.rawContent === 'string' && typed.rawContent.trim() !== '';

  if (!hasSpecId && !hasRawContent) {
    issues.push({
      field: 'specId|rawContent',
      message: 'Either specId or rawContent must be provided',
    });
  }

  return issues;
}
