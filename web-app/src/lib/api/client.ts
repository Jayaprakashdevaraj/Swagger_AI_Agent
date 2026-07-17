import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { apiConfig } from '@/config/api.config'

export const apiClient = axios.create({
  baseURL: `${apiConfig.baseUrl}/api`,
  timeout: apiConfig.timeoutMs,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const requestId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `req-${Date.now()}`

  config.headers['X-Request-ID'] = requestId
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: { message?: string } }>) => {
    if (error.response) {
      const message = error.response.data?.error?.message ?? 'Request failed'
      toast.error(message)
    } else if (error.request) {
      toast.error('Network error. Please verify the API service is reachable.')
    } else {
      toast.error('Unexpected client error.')
    }

    return Promise.reject(error)
  },
)

export default apiClient