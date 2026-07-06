import { RunPlanRepository } from '../../domain/repositories/RunPlanRepository';
import { RunPlan } from '../../domain/models/RunPlan';
import { RunReport } from '../../domain/models/RunReport';

/**
 * Map-backed in-memory RunPlan/RunReport repository.
 */
export class InMemoryRunPlanRepository implements RunPlanRepository {
  private readonly plans = new Map<string, RunPlan>();
  private readonly reports = new Map<string, RunReport>();

  async savePlan(plan: RunPlan): Promise<RunPlan> {
    this.plans.set(plan.id, plan);
    return plan;
  }

  async findPlanById(id: string): Promise<RunPlan | undefined> {
    return this.plans.get(id);
  }

  async updatePlan(plan: RunPlan): Promise<RunPlan> {
    this.plans.set(plan.id, plan);
    return plan;
  }

  async saveReport(report: RunReport): Promise<RunReport> {
    this.reports.set(report.runId, report);
    return report;
  }

  async findReportByRunId(runId: string): Promise<RunReport | undefined> {
    return this.reports.get(runId);
  }
}
