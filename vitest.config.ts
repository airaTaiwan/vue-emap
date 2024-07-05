import { resolve } from 'node:path'
import { defaultExclude, defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

import { alias } from './alias'

export default defineConfig({
  plugins: [
    vue(),
  ],
  optimizeDeps: {
    entries: [],
  },
  test: {
    name: 'unit',
    environment: 'jsdom',
    clearMocks: true,
    testTimeout: 30_000,
    exclude: [...defaultExclude],
    setupFiles: [resolve(__dirname, 'test/setup/setup.ts')],
    deps: {
      // vitest < 0.34
      inline: ['vitest-canvas-mock'],
      // >= 0.34
      optimizer: {
        web: {
          include: ['vitest-canvas-mock'],
        },
      },
    },
  },
  resolve: {
    alias,
  },
})
