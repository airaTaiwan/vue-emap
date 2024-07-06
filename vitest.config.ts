import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defaultExclude, defineConfig } from 'vitest/config'

import { alias } from './alias'

export default defineConfig({
  optimizeDeps: {
    entries: [],
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias,
  },
  test: {
    clearMocks: true,
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
    environment: 'jsdom',
    exclude: [...defaultExclude],
    name: 'unit',
    setupFiles: [resolve(__dirname, 'test/setup/setup.ts')],
    testTimeout: 30_000,
  },
})
