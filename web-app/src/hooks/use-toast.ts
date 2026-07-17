import { toast } from 'react-hot-toast'

export function useToast() {
  const showSuccess = (message: string) => {
    toast.success(message, {
      style: {
        borderRadius: '16px',
        background: '#0f172a',
        color: '#fff',
        fontSize: '14px',
      },
    })
  }

  const showError = (message: string) => {
    toast.error(message, {
      style: {
        borderRadius: '16px',
        background: '#991b1b',
        color: '#fff',
        fontSize: '14px',
      },
    })
  }

  const showInfo = (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        borderRadius: '16px',
        background: '#0369a1',
        color: '#fff',
        fontSize: '14px',
      },
    })
  }

  return {
    success: showSuccess,
    error: showError,
    info: showInfo,
  }
}
