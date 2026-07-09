import { ValidationIssue } from '../../core/errors/ValidationError';
import { GenerateAxiosTestsRequestDto } from '../dto/testgen.dto';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function validateGenerateAxiosTestsRequest(body: unknown): ValidationIssue[] {
  if (!isObject(body)) {
    return [{ field: 'body', message: 'Body must be a JSON object' }];
  }

  const dto = body as unknown as GenerateAxiosTestsRequestDto;
  const issues: ValidationIssue[] = [];

  if (typeof dto.specId !== 'string' || dto.specId.trim() === '') {
    issues.push({ field: 'specId', message: 'specId is required' });
  }

  if (!dto.selection || typeof dto.selection !== 'object') {
    issues.push({ field: 'selection', message: 'selection is required' });
    return issues;
  }

  const mode = dto.selection.mode;
  if (!mode || !['full', 'tag', 'single', 'operationIds'].includes(mode)) {
    issues.push({ field: 'selection.mode', message: 'selection.mode must be one of: full, tag, single, operationIds' });
    return issues;
  }

  if (mode === 'tag') {
    const tags = dto.selection.tags;
    if (!Array.isArray(tags) || tags.length === 0 || tags.some((tag) => typeof tag !== 'string' || tag.trim() === '')) {
      issues.push({ field: 'selection.tags', message: 'selection.tags must be a non-empty string array when mode=tag' });
    }
  }

  if (mode === 'single') {
    const operationIds = dto.selection.operationIds;
    if (!Array.isArray(operationIds) || operationIds.length !== 1 || typeof operationIds[0] !== 'string') {
      issues.push({ field: 'selection.operationIds', message: 'selection.operationIds must contain exactly one operation id when mode=single' });
    }
  }

  if (mode === 'operationIds') {
    const operationIds = dto.selection.operationIds;
    if (!Array.isArray(operationIds) || operationIds.length === 0 || operationIds.some((id) => typeof id !== 'string' || id.trim() === '')) {
      issues.push({ field: 'selection.operationIds', message: 'selection.operationIds must be a non-empty string array when mode=operationIds' });
    }
  }

  if (dto.options && !isObject(dto.options)) {
    issues.push({ field: 'options', message: 'options must be an object when provided' });
  }

  return issues;
}
