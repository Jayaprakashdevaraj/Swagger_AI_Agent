import { AppError } from './AppError';

export interface ValidationIssue {
  field: string;
  message: string;
}

export class ValidationError extends AppError {
  public readonly issues: ValidationIssue[];

  constructor(message: string, issues: ValidationIssue[] = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.issues = issues;
  }
}
