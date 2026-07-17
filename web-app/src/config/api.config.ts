export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
  appName: import.meta.env.VITE_APP_NAME ?? 'Swagger AI Agent',
  enableMock: import.meta.env.VITE_ENABLE_MOCK === 'true',
  timeoutMs: 30_000,
} as const