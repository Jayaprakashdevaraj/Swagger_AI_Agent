import { ValidationIssue } from '../../core/errors/ValidationError';
import {
  McpExecuteOperationRequestDto,
  McpGenerateAxiosTestsRequestDto,
  McpListOperationsRequestDto,
  McpPlanRunRequestDto,
} from '../dto/mcp.dto';
import { validateGenerateAxiosTestsRequest } from './testgen.validator';
import { validatePlanExecutionRequest } from './execution.validator';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function validateMcpListOperationsRequest(body: unknown): ValidationIssue[] {
  if (!isObject(body)) {
    return [{ field: 'body', message: 'Body must be a JSON object' }];
  }

  const dto = body as unknown as McpListOperationsRequestDto;
  if (typeof dto.specId !== 'string' || dto.specId.trim() === '') {
    return [{ field: 'specId', message: 'specId is required' }];
  }

  return [];
}

export function validateMcpPlanRunRequest(body: unknown): ValidationIssue[] {
  return validatePlanExecutionRequest(body as unknown as McpPlanRunRequestDto);
}

export function validateMcpExecuteOperationRequest(body: unknown): ValidationIssue[] {
  if (!isObject(body)) {
    return [{ field: 'body', message: 'Body must be a JSON object' }];
  }

  const dto = body as unknown as McpExecuteOperationRequestDto;
  const issues: ValidationIssue[] = [];

  if (typeof dto.specId !== 'string' || dto.specId.trim() === '') {
    issues.push({ field: 'specId', message: 'specId is required' });
  }

  if (typeof dto.envName !== 'string' || dto.envName.trim() === '') {
    issues.push({ field: 'envName', message: 'envName is required' });
  }

  if (typeof dto.operationId !== 'string' || dto.operationId.trim() === '') {
    issues.push({ field: 'operationId', message: 'operationId is required' });
  }

  if (dto.overrides !== undefined && !isObject(dto.overrides)) {
    issues.push({ field: 'overrides', message: 'overrides must be an object when provided' });
  }

  return issues;
}

export function validateMcpGenerateAxiosTestsRequest(body: unknown): ValidationIssue[] {
  return validateGenerateAxiosTestsRequest(body as unknown as McpGenerateAxiosTestsRequestDto);
}
