import type { RunReport } from '@/types/report.types'

export const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1']

export function aggregateRunMetrics(runs: RunReport[]) {
  let totalTests = 0
  let totalPassed = 0
  let totalFailed = 0
  let totalErrors = 0
  let totalDuration = 0

  for (const run of runs) {
    totalTests += run.summary.total
    totalPassed += run.summary.passed
    totalFailed += run.summary.failed
    totalErrors += run.summary.errors
    totalDuration += run.summary.durationMs
  }

  return {
    runCount: runs.length,
    totalTests,
    totalPassed,
    totalFailed,
    totalErrors,
    totalDuration,
    averagePassRate: runs.length === 0 ? 0 : totalPassed / totalTests || 0,
  }
}

export function getSuccessRateData(runs: RunReport[]) {
  return runs
    .filter((run) => run.summary.total > 0)
    .map((run) => ({
      runId: run.runId.slice(-8),
      passRate: ((run.summary.passed / run.summary.total) * 100).toFixed(1),
      passed: run.summary.passed,
      total: run.summary.total,
    }))
}

export function getMethodDistribution(runs: RunReport[]) {
  const distribution: Record<string, number> = {}

  for (const run of runs) {
    if (run.aggregates?.byMethod) {
      for (const [method, summary] of Object.entries(run.aggregates.byMethod)) {
        distribution[method] = (distribution[method] ?? 0) + summary.total
      }
    }
  }

  return Object.entries(distribution)
    .sort((a, b) => b[1] - a[1])
    .map(([method, total]) => ({
      name: method,
      value: total,
    }))
}

export function getSlowestEndpoints(runs: RunReport[], limit = 5) {
  const endpoints: Array<{ path: string; avgDuration: number; count: number }> = []
  const pathDurations: Record<string, { total: number; count: number }> = {}

  for (const run of runs) {
    for (const result of run.results) {
      const path = result.operationId
      if (pathDurations[path]) {
        pathDurations[path].total += result.durationMs ?? 0
        pathDurations[path].count += 1
      } else {
        pathDurations[path] = { total: result.durationMs ?? 0, count: 1 }
      }
    }
  }

  for (const [path, { total, count }] of Object.entries(pathDurations)) {
    endpoints.push({
      path,
      avgDuration: total / count,
      count,
    })
  }

  return endpoints.sort((a, b) => b.avgDuration - a.avgDuration).slice(0, limit)
}
