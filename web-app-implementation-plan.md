# Swagger AI Agent Web App - Phase-by-Phase Implementation Plan

This file is the execution plan for the web application defined in [web-instructions.md](web-instructions.md).

Rule of execution:
- Only one phase will be implemented at a time.
- No work from the next phase will be started until you explicitly approve the current phase.
- After each approved phase, I will implement only that phase, validate it, summarize it, and then stop for your next approval.

Suggested approval format:
- `approve phase 1`
- `approve phase 2`
- `approve phase 3`

## Current Status

- Backend API project exists in `swagger-ai-agent/`.
- Frontend `web-app/` does not exist yet.
- The web app will be created from scratch in Phase 1.

## Delivery Rules

For every phase, I will follow this sequence:
1. Confirm the approved phase.
2. Implement only the files listed for that phase.
3. Run focused validation for that phase.
4. Report what was completed, what was validated, and any blockers.
5. Wait for your next approval.

## Phase 1 - Project Setup & Core Infrastructure

Objective:
- Bootstrap the `web-app/` project with the required frontend stack and base shell.

Scope included in this phase:
- Create Vite React TypeScript app in `web-app/`
- Install core dependencies from the instructions
- Configure TailwindCSS
- Configure routing with empty pages
- Add Axios client and API config
- Add Zustand store skeletons
- Add base layout components
- Add environment files
- Add ESLint and Prettier baseline

Files planned in this phase:
- `web-app/package.json`
- `web-app/tsconfig.json`
- `web-app/vite.config.ts`
- `web-app/tailwind.config.js`
- `web-app/postcss.config.js`
- `web-app/.env.development`
- `web-app/.env.production`
- `web-app/src/main.tsx`
- `web-app/src/App.tsx`
- `web-app/src/config/api.config.ts`
- `web-app/src/lib/api/client.ts`
- `web-app/src/lib/stores/spec.store.ts`
- `web-app/src/lib/stores/environment.store.ts`
- `web-app/src/lib/stores/execution.store.ts`
- `web-app/src/lib/stores/ui.store.ts`
- `web-app/src/components/layout/AppLayout.tsx`
- `web-app/src/components/layout/Sidebar.tsx`
- `web-app/src/components/layout/Header.tsx`
- `web-app/src/pages/HomePage.tsx`
- `web-app/src/pages/SpecsPage.tsx`
- `web-app/src/pages/SpecDetailPage.tsx`
- `web-app/src/pages/EnvironmentsPage.tsx`
- `web-app/src/pages/ExecutionPage.tsx`
- `web-app/src/pages/RunReportPage.tsx`
- `web-app/src/pages/ReportsPage.tsx`
- `web-app/src/pages/TestGenPage.tsx`
- `web-app/src/pages/SettingsPage.tsx`

Validation planned for this phase:
- `npm install`
- `npm run build`
- `npm run test` if test setup is included in scaffold
- Confirm router renders all empty pages
- Confirm Tailwind styles compile

Approval gate output:
- Working shell app
- Sidebar + header layout
- Route navigation with placeholder pages
- Axios client ready
- Zustand skeletons ready

## Phase 2 - Spec Management Module

Objective:
- Build spec upload, list, detail, tags, operations, and delete flow.

Scope included in this phase:
- Spec types
- Spec API client methods
- Spec store and hooks
- Specs pages and feature components
- Upload modal for file and URL flows
- Operations list and card views
- Raw spec viewer

Files planned in this phase:
- `web-app/src/types/spec.types.ts`
- `web-app/src/lib/api/spec.api.ts`
- `web-app/src/hooks/use-specs.ts`
- `web-app/src/components/common/PageHeader.tsx`
- `web-app/src/components/common/EmptyState.tsx`
- `web-app/src/components/common/LoadingSpinner.tsx`
- `web-app/src/components/common/ConfirmDialog.tsx`
- `web-app/src/components/common/MethodBadge.tsx`
- `web-app/src/components/features/specs/SpecCard.tsx`
- `web-app/src/components/features/specs/SpecList.tsx`
- `web-app/src/components/features/specs/SpecUploadModal.tsx`
- `web-app/src/components/features/specs/SpecDetailTabs.tsx`
- `web-app/src/components/features/specs/OperationList.tsx`
- `web-app/src/components/features/specs/OperationCard.tsx`
- `web-app/src/pages/SpecsPage.tsx`
- `web-app/src/pages/SpecDetailPage.tsx`

Backend dependency check before implementation:
- Use existing endpoints for import, get spec, operations, tags
- Delete spec endpoint may be missing from backend and will be treated as a known dependency gap if not present

Validation planned for this phase:
- Build check
- Component render check
- Spec upload and fetch flow against backend
- Search and filter behavior check

Approval gate output:
- Spec library page working
- Spec detail page working
- Upload from file and URL working
- Operations and tags visible

## Phase 3 - Environment Configuration Module

Objective:
- Build environment CRUD, auth configuration, and header management.

Scope included in this phase:
- Environment types
- Environment API client methods
- Store and hooks
- Environment list page
- Environment form with Zod validation
- Auth configuration section
- Headers builder

Files planned in this phase:
- `web-app/src/types/environment.types.ts`
- `web-app/src/lib/api/environment.api.ts`
- `web-app/src/hooks/use-environments.ts`
- `web-app/src/lib/utils/validators.ts`
- `web-app/src/components/features/environments/EnvironmentCard.tsx`
- `web-app/src/components/features/environments/EnvironmentList.tsx`
- `web-app/src/components/features/environments/EnvironmentForm.tsx`
- `web-app/src/components/features/environments/AuthConfigSection.tsx`
- `web-app/src/components/features/environments/HeadersBuilder.tsx`
- `web-app/src/pages/EnvironmentsPage.tsx`

Validation planned for this phase:
- Build check
- Create, update, delete environment flow
- Form validation checks
- Responsive form layout check

Approval gate output:
- Environment CRUD working
- Auth configuration form working
- Header builder working

## Phase 4 - Test Execution Workflow

Objective:
- Build run planning, execution, polling, results, and retry flow.

Scope included in this phase:
- Execution and report types
- Execution API client
- Execution hooks and store updates
- Wizard flow
- Execution panel and live log UI
- Test result list and request/response viewer

Files planned in this phase:
- `web-app/src/types/execution.types.ts`
- `web-app/src/types/report.types.ts`
- `web-app/src/lib/api/execution.api.ts`
- `web-app/src/hooks/use-execution.ts`
- `web-app/src/components/common/StatusBadge.tsx`
- `web-app/src/components/features/execution/TestPlanWizard.tsx`
- `web-app/src/components/features/execution/ExecutionPanel.tsx`
- `web-app/src/components/features/execution/LiveLogViewer.tsx`
- `web-app/src/components/features/execution/TestResultCard.tsx`
- `web-app/src/components/features/execution/TestResultList.tsx`
- `web-app/src/components/features/execution/RequestResponseViewer.tsx`
- `web-app/src/pages/ExecutionPage.tsx`
- `web-app/src/pages/RunReportPage.tsx`

Validation planned for this phase:
- Build check
- Plan run flow
- Execute run flow
- Polling status updates
- Retry failed flow

Approval gate output:
- Wizard works end to end
- Run status updates in UI
- Results and request/response details visible

## Phase 5 - Reports & Analytics Dashboard

Objective:
- Build dashboard KPIs, charts, reports table, aggregates, and export.

Scope included in this phase:
- Report API adaptation as needed
- Dashboard components
- Reports page and run history table
- Aggregates view
- Export helpers for JSON and CSV

Files planned in this phase:
- `web-app/src/types/api.types.ts`
- `web-app/src/lib/utils/formatters.ts`
- `web-app/src/lib/utils/constants.ts`
- `web-app/src/lib/utils/export.ts`
- `web-app/src/components/features/reports/DashboardKPIs.tsx`
- `web-app/src/components/features/reports/SuccessRateChart.tsx`
- `web-app/src/components/features/reports/MethodDistributionChart.tsx`
- `web-app/src/components/features/reports/SlowestEndpointsChart.tsx`
- `web-app/src/components/features/reports/RunHistoryTable.tsx`
- `web-app/src/components/features/reports/AggregatesView.tsx`
- `web-app/src/pages/HomePage.tsx`
- `web-app/src/pages/ReportsPage.tsx`

Backend dependency check before implementation:
- `GET /api/execution/runs` is mentioned in the instructions but not part of the verified backend yet
- If still missing, Phase 5 UI will either use mocked empty state data or stop and request backend approval for that endpoint

Validation planned for this phase:
- Build check
- Charts render with sample or real data
- Export to JSON and CSV
- Report detail rendering

Approval gate output:
- Dashboard visible
- Reports history visible
- Aggregates and export working

## Phase 6 - Test Generation & AI Features

Objective:
- Build test generation UI, code viewer, payload builder, and download/copy actions.

Scope included in this phase:
- Test generation and LLM API client methods
- Test generation form
- Code viewer with syntax highlighting
- Payload builder modal
- Copy and download actions

Files planned in this phase:
- `web-app/src/lib/api/testgen.api.ts`
- `web-app/src/lib/api/llm.api.ts`
- `web-app/src/components/features/testgen/TestGenForm.tsx`
- `web-app/src/components/features/testgen/CodeViewer.tsx`
- `web-app/src/components/features/testgen/PayloadBuilderModal.tsx`
- `web-app/src/pages/TestGenPage.tsx`

Validation planned for this phase:
- Build check
- Generate tests from backend response
- Syntax highlighting works
- Copy and download actions work
- Payload builder uses schema-only and schema-with-llm modes

Approval gate output:
- Test generation page working
- Code viewer working
- Payload builder working

## Phase 7 - Mobile Optimization & Polish

Objective:
- Add responsive behavior, accessibility, dark mode, polish, performance improvements, and settings.

Scope included in this phase:
- Mobile navigation
- Shared hooks for mobile and toast
- Error boundary
- Loading states and skeletons
- Dark mode and settings
- Accessibility improvements
- Lazy loading and route splitting

Files planned in this phase:
- `web-app/src/hooks/use-toast.ts`
- `web-app/src/hooks/use-mobile.ts`
- `web-app/src/components/layout/MobileNav.tsx`
- `web-app/src/components/common/ErrorBoundary.tsx`
- `web-app/src/pages/SettingsPage.tsx`
- Route-level updates in `web-app/src/App.tsx`
- Shared responsive and accessibility refinements across existing phase files

Validation planned for this phase:
- Build check
- Mobile viewport checks
- Keyboard navigation checks
- Dark mode toggle checks
- Lazy loading verification

Approval gate output:
- Mobile-ready navigation and layouts
- Dark mode and preferences working
- Accessibility and loading/error states improved

## Phase Execution Order

Strict order:
1. Phase 1
2. Phase 2
3. Phase 3
4. Phase 4
5. Phase 5
6. Phase 6
7. Phase 7

No later-phase implementation will be started early.

## Approval Workflow

When you approve a phase, I will:
1. Implement only that phase.
2. Run validation for only that phase.
3. Summarize the result.
4. Stop and wait.

Example:
- You say: `approve phase 1`
- I implement Phase 1 only
- I validate Phase 1 only
- I stop and wait for `approve phase 2`

## Ready State

This plan is prepared and ready.

Next waiting action from you:
- `approve phase 1`