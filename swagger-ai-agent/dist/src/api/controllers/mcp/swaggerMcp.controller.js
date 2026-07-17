"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerMcpController = void 0;
class SwaggerMcpController {
    constructor(listOperationsTool, planApiRunTool, executeOperationTool, generateAxiosTestsTool) {
        this.listOperationsTool = listOperationsTool;
        this.planApiRunTool = planApiRunTool;
        this.executeOperationTool = executeOperationTool;
        this.generateAxiosTestsTool = generateAxiosTestsTool;
        this.listOperations = async (req, res, next) => {
            try {
                const body = req.body;
                const output = await this.listOperationsTool.execute({ specId: body.specId });
                res.status(200).json(output);
            }
            catch (error) {
                next(error);
            }
        };
        this.planRun = async (req, res, next) => {
            try {
                const body = req.body;
                const output = await this.planApiRunTool.execute({
                    specId: body.specId,
                    envName: body.envName,
                    selection: body.selection,
                });
                res.status(200).json(output);
            }
            catch (error) {
                next(error);
            }
        };
        this.executeOperation = async (req, res, next) => {
            try {
                const body = req.body;
                const output = await this.executeOperationTool.execute({
                    specId: body.specId,
                    envName: body.envName,
                    operationId: body.operationId,
                    overrides: body.overrides,
                });
                res.status(200).json(output);
            }
            catch (error) {
                next(error);
            }
        };
        this.generateAxiosTests = async (req, res, next) => {
            try {
                const body = req.body;
                const output = await this.generateAxiosTestsTool.execute({
                    specId: body.specId,
                    selection: body.selection,
                    options: body.options,
                });
                res.status(200).json(output);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.SwaggerMcpController = SwaggerMcpController;
//# sourceMappingURL=swaggerMcp.controller.js.map