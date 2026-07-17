import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SpecCard } from './SpecCard'

describe('SpecCard', () => {
  it('renders spec summary information', () => {
    render(
      <SpecCard
        spec={{
          id: 'spec-123',
          title: 'Petstore API',
          version: '1.0.0',
          specVersion: '3.0.3',
          operationCount: 12,
          tagNames: ['Pets', 'Store'],
          ingestedAt: '2026-07-17T10:00:00.000Z',
          sourceRef: 'petstore.yaml',
        }}
        onView={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    expect(screen.getByText('Petstore API')).toBeInTheDocument()
    expect(screen.getByText('12 endpoints')).toBeInTheDocument()
    expect(screen.getByText('Pets, Store')).toBeInTheDocument()
  })
})