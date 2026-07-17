import { RunPlanRepository } from '../../domain/repositories/RunPlanRepository';
import { RunPlan } from '../../domain/models/RunPlan';
import { RunReport } from '../../domain/models/RunReport';
/**
 * Map-backed in-memory RunPlan/RunReport repository.
 */
export declare class InMemoryRunPlanRepository implements RunPlanRepository {
    private readonly plans;
    private readonly reports;
    savePlan(plan: RunPlan): Promise<RunPlan>;
    findPlanById(id: string): Promise<RunPlan | undefined>;
    updatePlan(plan: RunPlan): Promise<RunPlan>;
    saveReport(report: RunReport): Promise<RunReport>;
    findReportByRunId(runId: string): Promise<RunReport | undefined>;
}
//# sourceMappingURL=InMemoryRunPlanRepository.d.ts.map