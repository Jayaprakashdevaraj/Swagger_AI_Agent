import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '@/App'

describe('Phase 1 app shell', () => {
  it('renders the dashboard shell route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByText('Business analyst dashboard shell')).toBeInTheDocument()
    expect(screen.getByText('Specifications')).toBeInTheDocument()
  })
})