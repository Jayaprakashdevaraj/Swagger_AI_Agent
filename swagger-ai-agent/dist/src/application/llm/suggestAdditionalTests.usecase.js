"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestAdditionalTestsUseCase = void 0;
const ValidationError_1 = require("../../core/errors/ValidationError");
class SuggestAdditionalTestsUseCase {
    constructor(specRepository) {
        this.specRepository = specRepository;
    }
    async execute(input) {
        const spec = await this.specRepository.findById(input.specId);
        if (!spec) {
            throw new ValidationError_1.ValidationError('Spec not found', [{ field: 'specId', message: `Spec not found: ${input.specId}` }]);
        }
        const operation = spec.operations.find((candidate) => candidate.id === input.operationId || candidate.operationId === input.operationId);
        if (!operation) {
            throw new ValidationError_1.ValidationError('Operation not found in spec', [
                { field: 'operationId', message: `Operation not found for spec ${input.specId}: ${input.operationId}` },
            ]);
        }
        return {
            specId: input.specId,
            operationId: operation.id,
            suggestions: this.buildSuggestions(operation),
        };
    }
    buildSuggestions(operation) {
        const suggestions = [];
        if (operation.security.length > 0) {
            suggestions.push({
                title: `Reject unauthenticated ${operation.method} ${operation.path}`,
                category: 'security',
                reason: 'Operation declares security requirements and should reject missing or invalid credentials.',
            });
        }
        if (operation.parameters.some((parameter) => parameter.required)) {
            suggestions.push({
                title: `Validate required parameters for ${operation.method} ${operation.path}`,
                category: 'validation',
                reason: 'Required path, query, or header parameters should produce a client error when omitted.',
            });
        }
        if (operation.requestBody?.required) {
            suggestions.push({
                title: `Exercise request body boundaries for ${operation.method} ${operation.path}`,
                category: 'boundary',
                reason: 'Required request bodies benefit from empty, oversized, and malformed payload tests.',
            });
        }
        suggestions.push({
            title: `Confirm stable error shape for ${operation.method} ${operation.path}`,
            category: 'resilience',
            reason: 'API failures should return predictable status and error payload contracts.',
        });
        return suggestions;
    }
}
exports.SuggestAdditionalTestsUseCase = SuggestAdditionalTestsUseCase;
//# sourceMappingURL=suggestAdditionalTests.usecase.js.map