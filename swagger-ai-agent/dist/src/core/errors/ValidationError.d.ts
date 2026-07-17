import { AppError } from './AppError';
export interface ValidationIssue {
    field: string;
    message: string;
}
export declare class ValidationError extends AppError {
    readonly issues: ValidationIssue[];
    constructor(message: string, issues?: ValidationIssue[]);
}
//# sourceMappingURL=ValidationError.d.ts.map