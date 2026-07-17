import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })))
const SpecsPage = lazy(() => import('@/pages/SpecsPage').then(m => ({ default: m.SpecsPage })))
const SpecDetailPage = lazy(() => import('@/pages/SpecDetailPage').then(m => ({ default: m.SpecDetailPage })))
const EnvironmentsPage = lazy(() => import('@/pages/EnvironmentsPage').then(m => ({ default: m.EnvironmentsPage })))
const ExecutionPage = lazy(() => import('@/pages/ExecutionPage').then(m => ({ default: m.ExecutionPage })))
const ReportsPage = lazy(() => import('@/pages/ReportsPage').then(m => ({ default: m.ReportsPage })))
const RunReportPage = lazy(() => import('@/pages/RunReportPage').then(m => ({ default: m.RunReportPage })))
const TestGenPage = lazy(() => import('@/pages/TestGenPage').then(m => ({ default: m.TestGenPage })))
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })))

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner label="Loading page resources..." />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/specs" element={<SpecsPage />} />
            <Route path="/specs/:specId" element={<SpecDetailPage />} />
            <Route path="/environments" element={<EnvironmentsPage />} />
            <Route path="/execution" element={<ExecutionPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/:runId" element={<RunReportPage />} />
            <Route path="/test-generation" element={<TestGenPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
