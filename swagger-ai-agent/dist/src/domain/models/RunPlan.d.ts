/**
 * A plan describing which operations and test cases will be executed in a run.
 * Domain model — no external dependencies.
 */
import { TestCaseDefinition } from './TestCaseDefinition';
export type SelectionMode = 'full' | 'tag' | 'single' | 'operationIds';
export interface RunSelection {
    mode: SelectionMode;
    /** Populated when mode === 'tag'. */
    tags?: string[];
    /** Populated when mode === 'single' or 'operationIds'. */
    operationIds?: string[];
}
export type RunPlanStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
export interface RunPlan {
    /** Unique run identifier. */
    id: string;
    specId: string;
    envName: string;
    selection: RunSelection;
    testCaseDefinitions: TestCaseDefinition[];
    status: RunPlanStatus;
    /** ISO timestamps. */
    createdAt: string;
    startedAt?: string;
    completedAt?: string;
}
//# sourceMappingURL=RunPlan.d.ts.map