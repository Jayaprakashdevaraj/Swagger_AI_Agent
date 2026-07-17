import { AppError } from './AppError';
export declare class ExternalServiceError extends AppError {
    readonly service: string;
    constructor(service: string, message: string, cause?: Error);
}
//# sourceMappingURL=ExternalServiceError.d.ts.map