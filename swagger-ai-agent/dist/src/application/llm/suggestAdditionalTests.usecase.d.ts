import { SpecRepository } from '../../domain/repositories/SpecRepository';
export interface SuggestedTestCase {
    title: string;
    category: 'security' | 'validation' | 'boundary' | 'resilience';
    reason: string;
}
export interface SuggestAdditionalTestsInput {
    specId: string;
    operationId: string;
}
export interface SuggestAdditionalTestsOutput {
    specId: string;
    operationId: string;
    suggestions: SuggestedTestCase[];
}
export declare class SuggestAdditionalTestsUseCase {
    private readonly specRepository;
    constructor(specRepository: SpecRepository);
    execute(input: SuggestAdditionalTestsInput): Promise<SuggestAdditionalTestsOutput>;
    private buildSuggestions;
}
//# sourceMappingURL=suggestAdditionalTests.usecase.d.ts.map