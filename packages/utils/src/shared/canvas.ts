import type { Point } from '../types'

export function initCanvas(canvas: HTMLCanvasElement, width: number, height: number, _dpi?: number) {
  const ctx = canvas.getContext('2d')!

  const dpr = window.devicePixelRatio || 1
  // @ts-expect-error vendor prefix
  const bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1

  const dpi = _dpi || dpr / bsr

  canvas.width = dpi * width
  canvas.height = dpi * height
  ctx.scale(dpi, dpi)

  return ctx
}


/**
 * Draws a rectangle on the canvas using the provided points.
 *
 * @example
 * ```js
 * const canvasEl = document.createElement('canvas')
 * const ctx = canvasEl.getContext('2d')
 *
 * // At least three points are required
 * const points = ref([
 *  { x: 10, y: 10 },
 *  { x: 10, y: 100 },
 *  { x: 100, y: 100 },
 *  { x: 100, y: 10 },
 * ])
 *
 * drawRectangle(ctx, points)
 * ```
 */
export function drawRectangle(ctx: CanvasRenderingContext2D | null, points: Point[]) {
  if (ctx == null || !Array.isArray(points) || points.length < 3) {
    return null
  }

  ctx.save()

  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y)
  }

  ctx.closePath()

  ctx.restore()
}

/**
 * Calculates the barycenter point.
 */
export function calculateBarycenter(points: Point[]): Point {
  const sum = points.reduce((acc, point) => {
    acc.x += point.x
    acc.y += point.y
    return acc
  }, { x: 0, y: 0 })

  const numPoints = points.length

  return {
    x: sum.x / numPoints,
    y: sum.y / numPoints,
  }
}
