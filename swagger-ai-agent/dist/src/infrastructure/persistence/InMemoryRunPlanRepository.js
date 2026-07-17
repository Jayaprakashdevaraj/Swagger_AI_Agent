"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryRunPlanRepository = void 0;
/**
 * Map-backed in-memory RunPlan/RunReport repository.
 */
class InMemoryRunPlanRepository {
    constructor() {
        this.plans = new Map();
        this.reports = new Map();
    }
    async savePlan(plan) {
        this.plans.set(plan.id, plan);
        return plan;
    }
    async findPlanById(id) {
        return this.plans.get(id);
    }
    async updatePlan(plan) {
        this.plans.set(plan.id, plan);
        return plan;
    }
    async saveReport(report) {
        this.reports.set(report.runId, report);
        return report;
    }
    async findReportByRunId(runId) {
        return this.reports.get(runId);
    }
}
exports.InMemoryRunPlanRepository = InMemoryRunPlanRepository;
//# sourceMappingURL=InMemoryRunPlanRepository.js.map