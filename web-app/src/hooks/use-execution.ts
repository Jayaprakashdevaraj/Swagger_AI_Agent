import { useEffect } from 'react'
import { useExecutionStore } from '@/lib/stores/execution.store'

interface UseExecutionOptions {
  runId?: string
  autoPoll?: boolean
  pollIntervalMs?: number
}

export function useExecution(options: UseExecutionOptions = {}) {
  const {
    runId,
    autoPoll = true,
    pollIntervalMs = 2500,
  } = options

  const activeRunId = useExecutionStore((state) => state.activeRunId)
  const plan = useExecutionStore((state) => state.plan)
  const lastExecution = useExecutionStore((state) => state.lastExecution)
  const runStatus = useExecutionStore((state) => state.runStatus)
  const lastRetry = useExecutionStore((state) => state.lastRetry)
  const liveLogs = useExecutionStore((state) => state.liveLogs)
  const status = useExecutionStore((state) => state.status)
  const loading = useExecutionStore((state) => state.loading)
  const polling = useExecutionStore((state) => state.polling)
  const error = useExecutionStore((state) => state.error)

  const planRun = useExecutionStore((state) => state.planRun)
  const executeRun = useExecutionStore((state) => state.executeRun)
  const fetchRunStatus = useExecutionStore((state) => state.fetchRunStatus)
  const retryFailed = useExecutionStore((state) => state.retryFailed)
  const setPolling = useExecutionStore((state) => state.setPolling)
  const setActiveRunId = useExecutionStore((state) => state.setActiveRunId)
  const clearLogs = useExecutionStore((state) => state.clearLogs)
  const resetExecution = useExecutionStore((state) => state.resetExecution)

  const targetRunId = runId ?? activeRunId

  useEffect(() => {
    if (!runId) {
      return
    }

    setActiveRunId(runId)
  }, [runId, setActiveRunId])

  useEffect(() => {
    if (!autoPoll || !targetRunId) {
      setPolling(false)
      return
    }

    const canPoll = !runStatus || runStatus.status === 'pending' || runStatus.status === 'running'
    if (!canPoll) {
      setPolling(false)
      return
    }

    let isDisposed = false
    const tick = async () => {
      try {
        await fetchRunStatus(targetRunId)
      } catch {
        // interceptor + store keep the error state
      }
    }

    setPolling(true)
    void tick()

    const intervalId = window.setInterval(() => {
      if (!isDisposed) {
        void tick()
      }
    }, pollIntervalMs)

    return () => {
      isDisposed = true
      window.clearInterval(intervalId)
      setPolling(false)
    }
  }, [autoPoll, fetchRunStatus, pollIntervalMs, runStatus, setPolling, targetRunId])

  return {
    activeRunId,
    plan,
    lastExecution,
    runStatus,
    lastRetry,
    liveLogs,
    status,
    loading,
    polling,
    error,
    planRun,
    executeRun,
    fetchRunStatus,
    retryFailed,
    clearLogs,
    resetExecution,
  }
}
