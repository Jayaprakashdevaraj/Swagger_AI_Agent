import { renderHook, act } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useMobile } from './use-mobile'

describe('useMobile hook', () => {
  it('detects layout shifts based on window width', () => {
    // Mock innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    const { result } = renderHook(() => useMobile(768))
    expect(result.current).toBe(false) // 1024 > 768

    // Trigger resize to mobile
    act(() => {
      window.innerWidth = 500
      window.dispatchEvent(new Event('resize'))
    })

    expect(result.current).toBe(true) // 500 < 768
  })
})
