"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteRunUseCase = void 0;
const ValidationError_1 = require("../../core/errors/ValidationError");
const Logger_1 = require("../../infrastructure/logging/Logger");
class ExecuteRunUseCase {
    constructor(specRepository, environmentRepository, runPlanRepository, planRunUseCase, executionAdapter) {
        this.specRepository = specRepository;
        this.environmentRepository = environmentRepository;
        this.runPlanRepository = runPlanRepository;
        this.planRunUseCase = planRunUseCase;
        this.executionAdapter = executionAdapter;
    }
    async execute(input) {
        const startedAt = Date.now();
        let runId = input.runId;
        if (!runId) {
            if (!input.specId || !input.envName || !input.selection) {
                throw new ValidationError_1.ValidationError('runId or (specId, envName, selection) is required', [
                    {
                        field: 'runId|specId|envName|selection',
                        message: 'Provide runId or all of specId, envName, selection',
                    },
                ]);
            }
            const planned = await this.planRunUseCase.execute({
                specId: input.specId,
                envName: input.envName,
                selection: input.selection,
            });
            runId = planned.runId;
        }
        const runPlan = await this.runPlanRepository.findPlanById(runId);
        if (!runPlan) {
            throw new ValidationError_1.ValidationError('Run plan not found', [{ field: 'runId', message: `Run plan not found: ${runId}` }]);
        }
        Logger_1.logger.info('Execution started', {
            runId,
            specId: runPlan.specId,
            envName: runPlan.envName,
            testCount: runPlan.testCaseDefinitions.length,
        });
        const spec = await this.specRepository.findById(runPlan.specId);
        if (!spec) {
            throw new ValidationError_1.ValidationError('Spec not found', [{ field: 'specId', message: `Spec not found: ${runPlan.specId}` }]);
        }
        const environment = await this.environmentRepository.findBySpecIdAndName(runPlan.specId, runPlan.envName);
        if (!environment) {
            throw new ValidationError_1.ValidationError('Environment not found', [
                {
                    field: 'envName',
                    message: `Environment '${runPlan.envName}' not found for spec '${runPlan.specId}'`,
                },
            ]);
        }
        runPlan.status = 'running';
        runPlan.startedAt = new Date().toISOString();
        await this.runPlanRepository.updatePlan(runPlan);
        const startedAtMs = Date.now();
        const results = [];
        for (const testCase of runPlan.testCaseDefinitions) {
            const operation = spec.operations.find((op) => op.id === testCase.operationId);
            if (!operation) {
                results.push({
                    testCaseId: testCase.id,
                    operationId: testCase.operationId,
                    testType: testCase.testType,
                    status: 'error',
                    expectedStatusCode: testCase.expectedStatusCode,
                    errorMessage: `Operation not found in spec: ${testCase.operationId}`,
                });
                continue;
            }
            try {
                const envForTest = this.resolveEnvironmentForTest(environment, testCase.testType);
                const invoke = await this.executionAdapter.executeOperation(spec, operation, envForTest, {
                    pathParams: testCase.overrides.pathParams,
                    query: testCase.overrides.queryParams,
                    headers: testCase.overrides.headers,
                    body: testCase.overrides.body,
                });
                const passed = invoke.response.status === testCase.expectedStatusCode;
                results.push({
                    testCaseId: testCase.id,
                    operationId: testCase.operationId,
                    testType: testCase.testType,
                    status: passed ? 'passed' : 'failed',
                    expectedStatusCode: testCase.expectedStatusCode,
                    actualStatusCode: invoke.response.status,
                    durationMs: invoke.timing.durationMs,
                    request: {
                        method: invoke.request.method,
                        url: invoke.request.url,
                        headers: invoke.request.headers,
                        body: invoke.request.body,
                    },
                    response: {
                        statusCode: invoke.response.status,
                        headers: invoke.response.headers,
                        body: invoke.response.body,
                        durationMs: invoke.timing.durationMs,
                    },
                });
            }
            catch (error) {
                results.push({
                    testCaseId: testCase.id,
                    operationId: testCase.operationId,
                    testType: testCase.testType,
                    status: 'error',
                    expectedStatusCode: testCase.expectedStatusCode,
                    errorMessage: error instanceof Error ? error.message : 'Execution error',
                });
            }
        }
        const summary = {
            total: results.length,
            passed: results.filter((result) => result.status === 'passed').length,
            failed: results.filter((result) => result.status === 'failed').length,
            errors: results.filter((result) => result.status === 'error').length,
            skipped: results.filter((result) => result.status === 'skipped').length,
            durationMs: Date.now() - startedAtMs,
        };
        const report = {
            runId,
            specId: runPlan.specId,
            envName: runPlan.envName,
            summary,
            aggregates: this.buildAggregates(spec.operations, results),
            results,
            startedAt: runPlan.startedAt ?? new Date(startedAtMs).toISOString(),
            completedAt: new Date().toISOString(),
        };
        await this.runPlanRepository.saveReport(report);
        runPlan.status = summary.errors > 0 || summary.failed > 0 ? 'failed' : 'completed';
        runPlan.completedAt = report.completedAt;
        await this.runPlanRepository.updatePlan(runPlan);
        Logger_1.logger.info('Execution completed', {
            runId,
            status: runPlan.status,
            total: summary.total,
            passed: summary.passed,
            failed: summary.failed,
            errors: summary.errors,
            durationMs: Date.now() - startedAt,
        });
        return {
            runId,
            status: runPlan.status,
            summary: {
                total: summary.total,
                passed: summary.passed,
                failed: summary.failed,
                errors: summary.errors,
                durationMs: summary.durationMs,
            },
        };
    }
    resolveEnvironmentForTest(environment, testType) {
        if (testType === 'auth-error') {
            return {
                ...environment,
                authConfig: { type: 'none' },
            };
        }
        return environment;
    }
    buildAggregates(operations, results) {
        const byTag = {};
        const byMethod = {};
        const byPath = {};
        const operationMap = new Map(operations.map((operation) => [operation.id, operation]));
        const ensureBucket = (target, key) => {
            if (!target[key]) {
                target[key] = { total: 0, passed: 0, failed: 0, errors: 0, skipped: 0 };
            }
            return target[key];
        };
        const bump = (target, key, status) => {
            const bucket = ensureBucket(target, key);
            bucket.total += 1;
            if (status === 'passed')
                bucket.passed += 1;
            if (status === 'failed')
                bucket.failed += 1;
            if (status === 'error')
                bucket.errors += 1;
            if (status === 'skipped')
                bucket.skipped += 1;
        };
        for (const result of results) {
            const operation = operationMap.get(result.operationId);
            const method = operation?.method ?? 'UNKNOWN';
            const path = operation?.path ?? 'UNKNOWN';
            const tags = operation?.tags.length ? operation.tags : ['untagged'];
            bump(byMethod, method, result.status);
            bump(byPath, path, result.status);
            for (const tag of tags) {
                bump(byTag, tag, result.status);
            }
        }
        return { byTag, byMethod, byPath };
    }
}
exports.ExecuteRunUseCase = ExecuteRunUseCase;
//# sourceMappingURL=executeRun.usecase.js.map