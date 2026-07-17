import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CodeViewer } from './CodeViewer'

describe('CodeViewer', () => {
  it('renders default message when code is empty', () => {
    render(<CodeViewer code="" />)
    expect(screen.getByText('No test code generated yet.')).toBeInTheDocument()
  })

  it('renders code and toolbar items when code is provided', () => {
    const codeSample = 'describe("Petstore", () => { it("gets pets", () => {}) })'
    render(<CodeViewer code={codeSample} fileName="petstore.test.js" />)

    expect(screen.getByText('petstore.test.js')).toBeInTheDocument()
    expect(screen.getByTitle('Copy to clipboard')).toBeInTheDocument()
    expect(screen.getByTitle('Download test file')).toBeInTheDocument()
  })

  it('handles copy to clipboard interaction', async () => {
    const codeSample = 'const a = 123;'
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    })

    render(<CodeViewer code={codeSample} />)
    const copyBtn = screen.getByTitle('Copy to clipboard')
    fireEvent.click(copyBtn)

    expect(writeTextMock).toHaveBeenCalledWith(codeSample)
  })
})
