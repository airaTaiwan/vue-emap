import type { MaybeRef } from '@vueuse/shared'
import type { ComputedRef, Ref, ShallowRef } from 'vue'

import { invoke, unrefElement, until, useDevicePixelRatio } from '@vueuse/core'
import { computed, ref, shallowRef } from 'vue'

import type { Point } from '../types'

import { initCanvas } from '../shared'

export interface UseCanvasOptions {
  height: MaybeRef<number>
  width: MaybeRef<number>
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
   * Clears the canvas.
   */
  clear: () => void

  /**
   * The dots per inch (DPI) of the canvas.
   */
  dpi: Ref<number>
}

export function useCanvas(options: UseCanvasOptions): UseCanvasReturn
export function useCanvas(target: MaybeRef<HTMLCanvasElement | null>, options: UseCanvasOptions): UseCanvasReturn

/**
 * Create a canvas and return its related properties and methods.
 */
export function useCanvas(...args: any[]) {
  let target: MaybeRef<HTMLCanvasElement | null>
  let options: UseCanvasOptions

  if (args.length === 1) {
    [options] = args
    target = document.createElement('canvas')
  }
  else {
    [target, options] = args
  }

  const { height, width } = options
  const { pixelRatio } = useDevicePixelRatio()

  const _width = ref(width)
  const _height = ref(height)

  const canvasCtx = shallowRef<CanvasRenderingContext2D | null>(null)
  const isInit = ref(false)

  const canvasCenterPoint = computed<Point>(() => ({
    x: _width.value / 2,
    y: _height.value / 2,
  }))

  /**
   * Initialize the canvas.
   */
  function init() {
    const el = unrefElement(target)

    if (el == null)
      return

    canvasCtx.value = initCanvas(el as HTMLCanvasElement, _width.value, _height.value, pixelRatio.value)

    isInit.value = true
  }

  function clear() {
    if (canvasCtx.value)
      canvasCtx.value.clearRect(0, 0, _width.value, _height.value)
  }

  invoke(async () => {
    await until(() => unrefElement(target)).not.toBeNull()
    await until(width).not.toBe(0)
    await until(height).not.toBe(0)

    init()
  })

  return {
    canvasCenterPoint,
    canvasCtx,
    clear,
    dpi: pixelRatio,
  }
}
