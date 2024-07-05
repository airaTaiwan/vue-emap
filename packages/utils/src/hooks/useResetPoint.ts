import { ref } from 'vue'
import { toArray } from '@antfu/utils'

import type { MaybeRef } from '@vueuse/shared'

import type { Point } from '../types'

export function useResetPoint(target: MaybeRef<object> | MaybeRef<object>): void
export function useResetPoint(target?: undefined): Point
export function useResetPoint(target?: MaybeRef<object> | MaybeRef<object>) {
  const resetObj = Object.freeze({
    x: 0,
    y: 0,
  })

  if (target === undefined)
    return JSON.parse(JSON.stringify(resetObj))

  for (const obj of toArray(target)) {
    Object.assign(ref(obj).value, resetObj)
  }
}
