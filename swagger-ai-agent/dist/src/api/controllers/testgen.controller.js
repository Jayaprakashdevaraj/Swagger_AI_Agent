"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestgenController = void 0;
const ValidationError_1 = require("../../core/errors/ValidationError");
class TestgenController {
    constructor(generateAxiosTestsUseCase, previewTestSuiteUseCase) {
        this.generateAxiosTestsUseCase = generateAxiosTestsUseCase;
        this.previewTestSuiteUseCase = previewTestSuiteUseCase;
        this.generateAxiosTests = async (req, res, next) => {
            try {
                const body = req.body;
                const output = await this.generateAxiosTestsUseCase.execute({
                    specId: body.specId,
                    selection: body.selection,
                    options: body.options,
                });
                const response = {
                    specId: output.specId,
                    operationCount: output.operationCount,
                    testCount: output.testCount,
                    testCases: output.testCases,
                    code: output.code,
                };
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.previewTestSuite = async (req, res, next) => {
            try {
                const specId = req.params.specId;
                if (!specId) {
                    throw new ValidationError_1.ValidationError('specId is required', [{ field: 'specId', message: 'Path param specId is required' }]);
                }
                const output = await this.previewTestSuiteUseCase.execute({
                    specId,
                    selection: { mode: 'full' },
                    options: {
                        includeNegativeTests: true,
                        includeAuthTests: true,
                        includeBoundaryTests: true,
                    },
                });
                res.status(200).json(output);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.TestgenController = TestgenController;
//# sourceMappingURL=testgen.controller.js.map