export const STATUS_COLORS: Record<string, string> = {
  idle: '#f3f4f6',
  pending: '#fef3c7',
  running: '#dbeafe',
  completed: '#dcfce7',
  passed: '#dcfce7',
  failed: '#fecaca',
  error: '#fecaca',
  cancelled: '#e5e7eb',
  skipped: '#f3f4f6',
}

export const STATUS_COLORS_HEX: Record<string, string> = {
  passed: '#10b981',
  failed: '#ef4444',
  error: '#ef4444',
  skipped: '#8b5cf6',
}

export const HTTP_METHOD_COLORS: Record<string, string> = {
  GET: '#3b82f6',
  POST: '#10b981',
  PUT: '#f59e0b',
  PATCH: '#8b5cf6',
  DELETE: '#ef4444',
  OPTIONS: '#6b7280',
  HEAD: '#6b7280',
}
