"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListOperationsTool = void 0;
class ListOperationsTool {
    constructor(listOperationsUseCase) {
        this.listOperationsUseCase = listOperationsUseCase;
    }
    async execute(input) {
        const operations = await this.listOperationsUseCase.execute(input.specId);
        return {
            specId: input.specId,
            operationCount: operations.length,
            operations,
        };
    }
}
exports.ListOperationsTool = ListOperationsTool;
//# sourceMappingURL=listOperations.tool.js.map