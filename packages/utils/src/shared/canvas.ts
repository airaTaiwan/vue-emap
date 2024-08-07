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

/**
 * Checks if a point is inside a polygon.
 */
export function isPointInPolygon(x: number, y: number, polygon: Point[]): boolean {
  let inside = false
  const len = polygon.length

  for (let i = 0, j = len - 1; i < len; j = i++) {
    const { x: xi, y: yi } = polygon[i]
    const { x: xj, y: yj } = polygon[j]

    const intersects = (yi > y) !== (yj > y) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
    if (intersects) {
      inside = !inside
    }
  }

  return inside
}

/**
 * Checks if a point is inside a circle.
 */
export function isPointInCircle(x: number, y: number, center: Point, radius: number): boolean {
  const dx = x - center[0]
  const dy = y - center[1]
  return dx * dx + dy * dy <= radius * radius
}

/**
 * Determines whether a point is on a line segment within a given tolerance.
 */
export function isPointOnLine(x: any, y: any, line: Point[], tolerance = 5): boolean {
  const [start, end] = line
  const d1 = distancePointToPoint(x, y, start.x, start.y)
  const d2 = distancePointToPoint(x, y, end.x, end.y)
  const lineLength = distancePointToPoint(start.x, start.y, end.x, end.y)
  const buffer = 0.1

  if (d1 + d2 >= lineLength - buffer && d1 + d2 <= lineLength + buffer) {
    const distance = distancePointToLine(x, y, start, end)
    return distance <= tolerance
  }
  return false
}

/**
 * Calculates the distance between two points in a 2D coordinate system.
 */
export function distancePointToPoint(x1: number, y1: number, x2: number, y2: number) {
  const dx = x1 - x2
  const dy = y1 - y2
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Calculates the distance between a point and a line segment defined by two points.
 */
export function distancePointToLine(x: number, y: number, lineStart: Point, lineEnd: Point): number {
  const A = x - lineStart.x
  const B = y - lineStart.y
  const C = lineEnd.x - lineStart.x
  const D = lineEnd.y - lineStart.y

  const dot = A * C + B * D
  const len_sq = C * C + D * D
  const param = (len_sq !== 0) ? dot / len_sq : -1

  let xx: number, yy: number

  if (param < 0) {
    xx = lineStart.x
    yy = lineStart.y
  }
  else if (param > 1) {
    xx = lineEnd.x
    yy = lineEnd.y
  }
  else {
    xx = lineStart.x + param * C
    yy = lineStart.y + param * D
  }

  const dx = x - xx
  const dy = y - yy
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Calculates the center point of an array of points.
 */
export function getCenterPoint(points: Point[]): Point {
  let centroidX = 0
  let centroidY = 0

  const numPoints = points.length

  points.forEach((point) => {
    centroidX += point.x
    centroidY += point.y
  })

  return {
    x: centroidX / numPoints,
    y: centroidY / numPoints,
  }
}
