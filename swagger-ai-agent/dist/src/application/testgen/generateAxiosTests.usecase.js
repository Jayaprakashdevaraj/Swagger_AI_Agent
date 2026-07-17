"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateAxiosTestsUseCase = void 0;
const ValidationError_1 = require("../../core/errors/ValidationError");
const idGenerator_1 = require("../../utils/idGenerator");
class GenerateAxiosTestsUseCase {
    constructor(specRepository) {
        this.specRepository = specRepository;
    }
    async execute(input) {
        const spec = await this.specRepository.findById(input.specId);
        if (!spec) {
            throw new ValidationError_1.ValidationError('Spec not found', [{ field: 'specId', message: `Spec not found: ${input.specId}` }]);
        }
        const options = {
            includeNegativeTests: input.options?.includeNegativeTests ?? true,
            includeAuthTests: input.options?.includeAuthTests ?? true,
            includeBoundaryTests: input.options?.includeBoundaryTests ?? true,
        };
        const selectedOperations = this.selectOperations(spec.operations, input.selection);
        if (selectedOperations.length === 0) {
            throw new ValidationError_1.ValidationError('No operations selected for test generation', [
                { field: 'selection', message: 'Selection produced zero operations' },
            ]);
        }
        const generated = [];
        for (const operation of selectedOperations) {
            const testDefs = this.buildTestDefinitions(operation, options);
            generated.push(...testDefs.map((testDef) => ({
                id: testDef.id,
                operationId: operation.id,
                method: operation.method,
                path: operation.path,
                testType: testDef.testType,
                expectedStatusCode: testDef.expectedStatusCode,
                description: testDef.description ?? `${testDef.testType} ${operation.method} ${operation.path}`,
            })));
        }
        return {
            specId: input.specId,
            operationCount: selectedOperations.length,
            testCount: generated.length,
            testCases: generated,
            code: this.buildJestAxiosCode(generated),
        };
    }
    selectOperations(operations, selection) {
        if (selection.mode === 'full') {
            return operations;
        }
        if (selection.mode === 'tag') {
            const tags = new Set(selection.tags ?? []);
            return operations.filter((operation) => operation.tags.some((tag) => tags.has(tag)));
        }
        const operationIds = new Set(selection.mode === 'single'
            ? (selection.operationIds ?? []).slice(0, 1)
            : (selection.operationIds ?? []));
        return operations.filter((operation) => operationIds.has(operation.id));
    }
    buildTestDefinitions(operation, options) {
        const defs = [];
        defs.push({
            id: (0, idGenerator_1.generateId)('tcg'),
            operationId: operation.id,
            testType: 'happy-path',
            expectedStatusCode: this.findStatusCode(operation, (code) => code >= 200 && code < 300, 200),
            payloadStrategy: 'schema-derived',
            overrides: {},
            description: `happy-path ${operation.method} ${operation.path}`,
        });
        if (options.includeNegativeTests) {
            defs.push({
                id: (0, idGenerator_1.generateId)('tcg'),
                operationId: operation.id,
                testType: 'validation-error',
                expectedStatusCode: this.findStatusCode(operation, (code) => code >= 400 && code < 500 && code !== 401 && code !== 403, 400),
                payloadStrategy: 'empty',
                overrides: {},
                description: `validation-error ${operation.method} ${operation.path}`,
            });
        }
        if (options.includeAuthTests && operation.security.length > 0) {
            defs.push({
                id: (0, idGenerator_1.generateId)('tcg'),
                operationId: operation.id,
                testType: 'auth-error',
                expectedStatusCode: this.findStatusCode(operation, (code) => code === 401 || code === 403, 401),
                payloadStrategy: 'empty',
                overrides: {},
                description: `auth-error ${operation.method} ${operation.path}`,
            });
        }
        if (options.includeBoundaryTests) {
            defs.push({
                id: (0, idGenerator_1.generateId)('tcg'),
                operationId: operation.id,
                testType: 'boundary',
                expectedStatusCode: this.findStatusCode(operation, (code) => code >= 200 && code < 500, 200),
                payloadStrategy: 'custom',
                overrides: {},
                description: `boundary ${operation.method} ${operation.path}`,
            });
        }
        return defs;
    }
    findStatusCode(operation, predicate, fallback) {
        const codes = operation.responses
            .map((response) => response.statusCode)
            .filter((statusCode) => typeof statusCode === 'number');
        return codes.find(predicate) ?? fallback;
    }
    buildJestAxiosCode(testCases) {
        const lines = [];
        lines.push("import axios from 'axios';");
        lines.push('');
        lines.push("const client = axios.create({ baseURL: process.env.BASE_URL || 'http://localhost:3000' });");
        lines.push('');
        const grouped = new Map();
        for (const testCase of testCases) {
            const key = `${testCase.method} ${testCase.path}`;
            if (!grouped.has(key)) {
                grouped.set(key, []);
            }
            grouped.get(key)?.push(testCase);
        }
        for (const [group, tests] of grouped.entries()) {
            lines.push(`describe('${group}', () => {`);
            for (const test of tests) {
                const method = test.method.toLowerCase();
                lines.push(`  it('${test.testType} expects ${test.expectedStatusCode}', async () => {`);
                lines.push(`    const response = await client.request({ method: '${method}', url: '${test.path}', validateStatus: () => true });`);
                lines.push(`    expect(response.status).toBe(${test.expectedStatusCode});`);
                lines.push('  });');
            }
            lines.push('});');
            lines.push('');
        }
        return lines.join('\n').trim();
    }
}
exports.GenerateAxiosTestsUseCase = GenerateAxiosTestsUseCase;
//# sourceMappingURL=generateAxiosTests.usecase.js.map