import type { MaybeRef } from '@vueuse/shared'
import type { ComputedRef, Ref, ShallowRef } from 'vue'

import { invoke, unrefElement, until } from '@vueuse/core'
import { computed, ref, shallowRef } from 'vue'

import type { Point } from '../types'

import { initCanvas } from '../shared'

export interface UseCanvasOptions {
  dpi: Ref<number>
  height: Ref<number>
  width: Ref<number>
}

export interface UseCanvasReturn {
  /**
   * The center point of the canvas.
   */
  canvasCenterPoint: ComputedRef<Point>

  /**
   * The canvas 2D rendering context.
   */
  canvasCtx: ShallowRef<CanvasRenderingContext2D | null>

  /**
   * Clear canvas.
   */
  clear: () => void
}

/**
 * Create a canvas and return its related properties and methods.
 */
export function useCanvas(
  target: MaybeRef<HTMLElement | null>,
  {
    dpi,
    height,
    width,
  }: UseCanvasOptions,
): UseCanvasReturn {
  const canvasCtx = shallowRef<CanvasRenderingContext2D | null>(null)
  const isInit = ref(false)

  const canvasCenterPoint = computed<Point>(() => ({
    x: width.value / 2,
    y: height.value / 2,
  }))

  /**
   * Initialize the canvas.
   */
  function init() {
    const el = unrefElement(target)

    if (el == null)
      return

    canvasCtx.value = initCanvas(el as HTMLCanvasElement, width.value, height.value, dpi.value)

    isInit.value = true
  }

  function clear() {
    if (canvasCtx.value)
      canvasCtx.value.clearRect(0, 0, width.value, height.value)
  }

  invoke(async () => {
    await until(() => unrefElement(target)).not.toBeNull()

    init()
  })

  return {
    canvasCenterPoint,
    canvasCtx,

    clear,
  }
}
