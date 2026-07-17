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
export declare class ValidateSpecUseCase {
    private readonly specRepository;
    private readonly parser;
    constructor(specRepository: SpecRepository, parser: SwaggerParserAdapter);
    execute(input: ValidateSpecInput): Promise<ValidateSpecOutput>;
}
//# sourceMappingURL=validateSpec.usecase.d.ts.map