import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  external: ['vue'],
  format: ['cjs', 'esm'],
  minify: true,
})
