import { resolve } from 'node:path'

function r(p: string) {
  return resolve(__dirname, p)
}

export const alias: Record<string, string> = {
  'vue-emap': r('./packages/vue-emap/src'),
}
