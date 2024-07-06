import { vi } from 'vitest'

import 'vitest-canvas-mock'

Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(query => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(), // deprecated
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(), // deprecated
  })),
  writable: true,
})
