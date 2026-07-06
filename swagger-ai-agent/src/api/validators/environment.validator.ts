import { ValidationIssue } from '../../core/errors/ValidationError';
import { AuthConfig } from '../../domain/models/EnvironmentConfig';
import { CreateEnvironmentRequestDto, UpdateEnvironmentRequestDto } from '../dto/environment.dto';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateHeaders(headers: unknown, fieldPrefix: string): ValidationIssue[] {
  if (headers === undefined) {
    return [];
  }

  if (!isObject(headers)) {
    return [{ field: fieldPrefix, message: `${fieldPrefix} must be an object` }];
  }

  const issues: ValidationIssue[] = [];
  for (const [key, value] of Object.entries(headers)) {
    if (typeof key !== 'string' || key.trim() === '') {
      issues.push({ field: `${fieldPrefix}.${key}`, message: 'Header name must be a non-empty string' });
    }
    if (typeof value !== 'string') {
      issues.push({ field: `${fieldPrefix}.${key}`, message: 'Header value must be a string' });
    }
  }

  return issues;
}

function validateAuthConfig(authConfig: unknown): ValidationIssue[] {
  if (authConfig === undefined) {
    return [];
  }

  if (!isObject(authConfig)) {
    return [{ field: 'authConfig', message: 'authConfig must be an object' }];
  }

  const issues: ValidationIssue[] = [];
  const auth = authConfig as unknown as AuthConfig;

  if (!auth.type || !['none', 'bearer', 'basic', 'apiKey'].includes(auth.type)) {
    issues.push({ field: 'authConfig.type', message: 'authConfig.type must be one of: none, bearer, basic, apiKey' });
    return issues;
  }

  if (auth.type === 'bearer') {
    if (!('token' in auth) || typeof auth.token !== 'string' || auth.token.trim() === '') {
      issues.push({ field: 'authConfig.token', message: 'token is required for bearer auth' });
    }
  }

  if (auth.type === 'basic') {
    if (!('username' in auth) || typeof auth.username !== 'string' || auth.username.trim() === '') {
      issues.push({ field: 'authConfig.username', message: 'username is required for basic auth' });
    }
    if (!('password' in auth) || typeof auth.password !== 'string' || auth.password.trim() === '') {
      issues.push({ field: 'authConfig.password', message: 'password is required for basic auth' });
    }
  }

  if (auth.type === 'apiKey') {
    if (!('keyName' in auth) || typeof auth.keyName !== 'string' || auth.keyName.trim() === '') {
      issues.push({ field: 'authConfig.keyName', message: 'keyName is required for apiKey auth' });
    }
    if (!('keyValue' in auth) || typeof auth.keyValue !== 'string' || auth.keyValue.trim() === '') {
      issues.push({ field: 'authConfig.keyValue', message: 'keyValue is required for apiKey auth' });
    }
    if (!('in' in auth) || (auth.in !== 'header' && auth.in !== 'query')) {
      issues.push({ field: 'authConfig.in', message: "authConfig.in must be 'header' or 'query'" });
    }
  }

  return issues;
}

export function validateCreateEnvironmentRequest(body: unknown): ValidationIssue[] {
  if (!isObject(body)) {
    return [{ field: 'body', message: 'Body must be a JSON object' }];
  }

  const dto = body as unknown as CreateEnvironmentRequestDto;
  const issues: ValidationIssue[] = [];

  if (typeof dto.specId !== 'string' || dto.specId.trim() === '') {
    issues.push({ field: 'specId', message: 'specId is required' });
  }

  if (typeof dto.name !== 'string' || dto.name.trim() === '') {
    issues.push({ field: 'name', message: 'name is required' });
  }

  if (typeof dto.baseUrl !== 'string' || dto.baseUrl.trim() === '') {
    issues.push({ field: 'baseUrl', message: 'baseUrl is required' });
  } else if (!isValidUrl(dto.baseUrl)) {
    issues.push({ field: 'baseUrl', message: 'baseUrl must be a valid http/https URL' });
  }

  issues.push(...validateHeaders(dto.defaultHeaders, 'defaultHeaders'));
  issues.push(...validateAuthConfig(dto.authConfig));

  return issues;
}

export function validateUpdateEnvironmentRequest(body: unknown): ValidationIssue[] {
  if (!isObject(body)) {
    return [{ field: 'body', message: 'Body must be a JSON object' }];
  }

  const dto = body as UpdateEnvironmentRequestDto;
  const issues: ValidationIssue[] = [];

  const hasAnyField = dto.baseUrl !== undefined || dto.defaultHeaders !== undefined || dto.authConfig !== undefined;
  if (!hasAnyField) {
    issues.push({
      field: 'body',
      message: 'At least one field is required: baseUrl, defaultHeaders, authConfig',
    });
  }

  if (dto.baseUrl !== undefined) {
    if (typeof dto.baseUrl !== 'string' || dto.baseUrl.trim() === '') {
      issues.push({ field: 'baseUrl', message: 'baseUrl must be a non-empty string' });
    } else if (!isValidUrl(dto.baseUrl)) {
      issues.push({ field: 'baseUrl', message: 'baseUrl must be a valid http/https URL' });
    }
  }

  issues.push(...validateHeaders(dto.defaultHeaders, 'defaultHeaders'));
  issues.push(...validateAuthConfig(dto.authConfig));

  return issues;
}
