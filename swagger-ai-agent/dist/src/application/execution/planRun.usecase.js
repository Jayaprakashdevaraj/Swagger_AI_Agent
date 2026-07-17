"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanRunUseCase = void 0;
const ValidationError_1 = require("../../core/errors/ValidationError");
const idGenerator_1 = require("../../utils/idGenerator");
class PlanRunUseCase {
    constructor(specRepository, environmentRepository, runPlanRepository) {
        this.specRepository = specRepository;
        this.environmentRepository = environmentRepository;
        this.runPlanRepository = runPlanRepository;
    }
    async execute(input) {
        const spec = await this.specRepository.findById(input.specId);
        if (!spec) {
            throw new ValidationError_1.ValidationError('Cannot create run plan for missing spec', [
                { field: 'specId', message: `Spec not found: ${input.specId}` },
            ]);
        }
        const environment = await this.environmentRepository.findBySpecIdAndName(input.specId, input.envName);
        if (!environment) {
            throw new ValidationError_1.ValidationError('Cannot create run plan for missing environment', [
                {
                    field: 'envName',
                    message: `Environment '${input.envName}' not found for spec '${input.specId}'`,
                },
            ]);
        }
        const selectedOperations = this.selectOperations(spec.operations, input.selection);
        if (selectedOperations.length === 0) {
            throw new ValidationError_1.ValidationError('No operations selected for run', [
                { field: 'selection', message: 'Selection produced zero operations' },
            ]);
        }
        const testCaseDefinitions = selectedOperations.flatMap((operation) => this.buildTemplateTestCases(operation));
        const runId = (0, idGenerator_1.generateId)('run');
        const runPlan = {
            id: runId,
            specId: input.specId,
            envName: input.envName,
            selection: input.selection,
            testCaseDefinitions,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        await this.runPlanRepository.savePlan(runPlan);
        return {
            runId,
            specId: input.specId,
            envName: input.envName,
            operationCount: selectedOperations.length,
            testCount: testCaseDefinitions.length,
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
        const requestedIds = new Set(selection.mode === 'single'
            ? (selection.operationIds ?? []).slice(0, 1)
            : (selection.operationIds ?? []));
        return operations.filter((operation) => requestedIds.has(operation.id));
    }
    buildTemplateTestCases(operation) {
        const testCases = [];
        testCases.push({
            id: (0, idGenerator_1.generateId)('tc'),
            operationId: operation.id,
            testType: 'happy-path',
            expectedStatusCode: this.findStatusCode(operation, (code) => code >= 200 && code < 300, 200),
            payloadStrategy: 'schema-derived',
            overrides: {},
            description: `Happy-path for ${operation.method} ${operation.path}`,
        });
        testCases.push({
            id: (0, idGenerator_1.generateId)('tc'),
            operationId: operation.id,
            testType: 'validation-error',
            expectedStatusCode: this.findStatusCode(operation, (code) => code >= 400 && code < 500 && code !== 401 && code !== 403, 400),
            payloadStrategy: 'empty',
            overrides: {},
            description: `Validation error case for ${operation.method} ${operation.path}`,
        });
        if (operation.security.length > 0) {
            testCases.push({
                id: (0, idGenerator_1.generateId)('tc'),
                operationId: operation.id,
                testType: 'auth-error',
                expectedStatusCode: this.findStatusCode(operation, (code) => code === 401 || code === 403, 401),
                payloadStrategy: 'empty',
                overrides: {},
                description: `Auth error case for ${operation.method} ${operation.path}`,
            });
        }
        return testCases;
    }
    findStatusCode(operation, predicate, fallback) {
        const numericCodes = operation.responses
            .map((response) => response.statusCode)
            .filter((statusCode) => typeof statusCode === 'number');
        const match = numericCodes.find(predicate);
        return match ?? fallback;
    }
}
exports.PlanRunUseCase = PlanRunUseCase;
//# sourceMappingURL=planRun.usecase.js.map