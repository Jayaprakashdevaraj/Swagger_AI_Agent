/**
 * Repository interface for RunPlan and RunReport persistence.
 * Domain layer — implementations live in infrastructure/persistence.
 */
import { RunPlan } from '../models/RunPlan';
import { RunReport } from '../models/RunReport';
export interface RunPlanRepository {
    /** Persist a new RunPlan. Returns the stored plan. */
    savePlan(plan: RunPlan): Promise<RunPlan>;
    /** Find a RunPlan by its unique id. */
    findPlanById(id: string): Promise<RunPlan | undefined>;
    /** Update an existing RunPlan (e.g. status change). */
    updatePlan(plan: RunPlan): Promise<RunPlan>;
    /** Persist or overwrite the RunReport for a run. */
    saveReport(report: RunReport): Promise<RunReport>;
    /** Find the RunReport for a given runId. */
    findReportByRunId(runId: string): Promise<RunReport | undefined>;
}
//# sourceMappingURL=RunPlanRepository.d.ts.map