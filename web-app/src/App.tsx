import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ExecutionPage } from '@/pages/ExecutionPage'
import { EnvironmentsPage } from '@/pages/EnvironmentsPage'
import { HomePage } from '@/pages/HomePage'
import { ReportsPage } from '@/pages/ReportsPage'
import { RunReportPage } from '@/pages/RunReportPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { SpecDetailPage } from '@/pages/SpecDetailPage'
import { SpecsPage } from '@/pages/SpecsPage'
import { TestGenPage } from '@/pages/TestGenPage'

function App() {
  return (
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
  )
}

export default App
