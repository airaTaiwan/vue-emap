import type { MaybeRef, Ref, ShallowRef } from 'vue'

import { abortEvent, distancePointToPoint, getCenterPoint, isPointInPolygon, isPointOnLine, type Point, scalePoint } from '@airataiwan/utils'
import { unrefElement, useEventListener, watchDeep } from '@vueuse/core'
import { computed, ref, shallowRef } from 'vue'

import type { History } from '../types'
import type { ControlCoords, Corner, CornerOptions } from '../types/control'

import { updateLinePoint } from '../shape/Line'
import { drawPolygonBorders, updatePolygonPoint } from '../shape/Polygon'
import { drawRectBorders, translateRectPoints, updateRectPoint } from '../shape/Rect'
import { Shape } from '../types/shape'
import { setCornerCursor } from '../utils'

const MOVE_CURSOR = 'move'

export interface UseControlOptions extends CornerOptions {
  /**
   * The distance between the controlator and shape.
   *
   * @default 10
   */
  distance?: number
}

export interface UseControlReturn {
  controlator: ShallowRef<History | null>
  controlatorIdx: Ref<number>
  isDragging: Ref<boolean>
  isInSide: (shape: Shape, targetPoint: Point, points: Point[]) => -1 | boolean
  isResizeing: Ref<boolean>
}

/**
 * Control the selected shape
 */
export function useControl(
  target: MaybeRef<HTMLElement | null>,
  ctx: ShallowRef<CanvasRenderingContext2D | null>,
  timestamp: Ref<number>,
  options: UseControlOptions = {},
): UseControlReturn {
  const {
    cornerSize = 8,
    cornerStorkColor = '#00c9ff',
    distance = 10,
  } = options

  const controlator = shallowRef<History | null>(null)
  const controlatorIdx = ref<number>(-1)

  const controlCoords = ref<ControlCoords>({})
  const targetCorner = ref<Corner | null>(null)
  const startDragPoint = shallowRef<null | Point>(null)

  // event flag
  const isResizeing = ref<boolean>(false)
  const isDragging = ref<boolean>(false)

  const controlatorDistance = computed(() => {
    const lineWidth = controlator.value?.options?.lineWidth ?? 1
    return lineWidth / 2 + distance
  })

  function setCursor(cursor: string) {
    const el = unrefElement(target)

    if (el == null)
      return

    el.style.cursor = cursor
  }

  function drawBorders(ctx: CanvasRenderingContext2D, points: Point[], center: Point) {
    switch (controlator.value?.type) {
      case Shape.Rect:
        drawRectBorders(ctx, points, center, controlatorDistance.value)
        break
      case Shape.Polygon:
        drawPolygonBorders(ctx, points, center, controlatorDistance.value)
        break
      default:
        break
    }
  }

  function drawControls(ctx: CanvasRenderingContext2D, points: Point[], center: Point) {
    ctx.save()
    ctx.strokeStyle = cornerStorkColor

    switch (controlator.value?.type) {
      case Shape.Rect:
        drawRectControls(ctx, points, center)
        break
      case Shape.Line:
      case Shape.LineWithArrow:
        drawLineControls(ctx, points, center)
        break
      case Shape.Polygon:
        drawPolygonControls(ctx, points, center)
        break
      default:
        break
    }
  }

  function drawRectControls(ctx: CanvasRenderingContext2D, points: Point[], center: Point) {
    // 獲取新的邊框角點
    const borderPoints = drawRectBorders(ctx, points, center, controlatorDistance.value)

    borderPoints.forEach((corner, index) => {
      const x = corner.x - cornerSize / 2
      const y = corner.y - cornerSize / 2
      const cursor = setCornerCursor(corner, center)

      ctx.fillRect(x, y, cornerSize, cornerSize)
      ctx.strokeRect(x, y, cornerSize, cornerSize)

      setControlCoords(index, x, y, cornerSize, cornerSize, cursor)
    })
  }

  function drawLineControls(ctx: CanvasRenderingContext2D, points: Point[], center: Point) {
    points.forEach((point, index) => {
      const x = scalePoint(point, center, distancePointToPoint(point.x, point.y, center.x, center.y) + distance).x - cornerSize / 2
      const y = scalePoint(point, center, distancePointToPoint(point.x, point.y, center.x, center.y) + distance).y - cornerSize / 2
      const cursor = 'move'

      ctx.beginPath()
      ctx.arc(x + cornerSize / 2, y + cornerSize / 2, cornerSize / 2, 0, 2 * Math.PI)
      ctx.stroke()

      setControlCoords(index, x, y, cornerSize, cornerSize, cursor)
    })
  }

  function drawPolygonControls(ctx: CanvasRenderingContext2D, points: Point[], center: Point) {
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = cornerStorkColor

    points.forEach((point, index) => {
      // Calculate the control point on the outer control line
      const controlPoint = scalePoint(point, center, distancePointToPoint(point.x, point.y, center.x, center.y) + controlatorDistance.value)
      const x = controlPoint.x - cornerSize / 2
      const y = controlPoint.y - cornerSize / 2
      const cursor = 'move'

      ctx.beginPath()
      ctx.rect(x, y, cornerSize, cornerSize)
      ctx.fill()
      ctx.stroke()

      setControlCoords(index, x, y, cornerSize, cornerSize, cursor)
    })
  }

  function setControlCoords(index: number, x: number, y: number, width: number, height: number, cursor: string) {
    controlCoords.value = {
      ...controlCoords.value,
      [index]: {
        cursor,
        h: height,
        idx: index,
        w: width,
        x,
        y,
      },
    }
  }

  function updatePoint(offsetX: number, offsetY: number) {
    if (controlator.value == null || targetCorner.value == null)
      return

    const { type } = controlator.value
    const { idx } = targetCorner.value

    switch (type) {
      case Shape.Rect:
        controlator.value.points = updateRectPoint(controlator.value.points, offsetX, offsetY, idx)
        break
      case Shape.Polygon:
        controlator.value.points = updatePolygonPoint(controlator.value.points, offsetX, offsetY, idx)
        break
      case Shape.Line:
      case Shape.LineWithArrow:
        controlator.value.points = updateLinePoint(controlator.value.points, offsetX, offsetY, idx)
        break
    }
  }

  function findTargetCorner(e: MouseEvent): Corner | null {
    let corner: Corner | null = null

    const { offsetX: x, offsetY: y } = e

    for (const [_key, value] of Object.entries(controlCoords.value)) {
      const { h, w, x: cx, y: cy } = value
      const minX = cx - 10
      const minY = cy - 10
      const maxX = cx + w + 10
      const maxY = cy + h + 10

      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        corner = value
        break
      }
    }

    return corner
  }

  /**
   * Check if the target point is in the side of the shape
   */
  function isInSide(shape: Shape, targetPoint: Point, points: Point[]) {
    if (points.length === 0)
      return -1

    switch (shape) {
      case Shape.Line:
      case Shape.LineWithArrow:
        return isPointOnLine(targetPoint.x, targetPoint.y, points)
      case Shape.Rect:
        return isPointInPolygon(targetPoint.x, targetPoint.y, translateRectPoints(points))
      case Shape.Polygon:
        return isPointInPolygon(targetPoint.x, targetPoint.y, points)
      default:
        return -1
    }
  }

  watchDeep(controlator, (history) => {
    if (history == null)
      return

    const { type } = history
    let points: Point[] = []

    switch (type) {
      case Shape.Rect:
        points = translateRectPoints(history.points)
        break
      case Shape.Line:
      case Shape.LineWithArrow:
        points = history.points
        break
      default:
        points = history.points
        break
    }

    if (ctx.value) {
      const center = getCenterPoint(points)
      drawBorders(ctx.value, points, center)
      drawControls(ctx.value, points, center)
    }
  }, { flush: 'post' })

  useEventListener(target, 'pointerdown', (e) => {
    if (controlator.value == null)
      return

    timestamp.value = e.timeStamp

    const corner = findTargetCorner(e)
    if (corner != null) {
      targetCorner.value = corner
      startDragPoint.value = {
        x: e.offsetX,
        y: e.offsetY,
      }
      isResizeing.value = true
      return
    }

    if (isInSide(controlator.value.type, { x: e.offsetX, y: e.offsetY }, controlator.value.points)) {
      startDragPoint.value = {
        x: e.offsetX,
        y: e.offsetY,
      }
      setCursor(MOVE_CURSOR)
      isDragging.value = true
    }

    abortEvent(e)
  })

  useEventListener(target, 'pointermove', (e) => {
    if (startDragPoint.value == null)
      return

    if (isResizeing.value && targetCorner.value != null) {
      const { cursor } = targetCorner.value
      setCursor(cursor)

      const offsetX = e.offsetX - startDragPoint.value.x
      const offsetY = e.offsetY - startDragPoint.value.y
      startDragPoint.value = { x: e.offsetX, y: e.offsetY }

      updatePoint(offsetX, offsetY)
    }

    if (isDragging.value) {
      if (controlator.value == null)
        return

      const offsetX = e.offsetX - startDragPoint.value.x
      const offsetY = e.offsetY - startDragPoint.value.y
      startDragPoint.value = { x: e.offsetX, y: e.offsetY }

      controlator.value.points = controlator.value.points.map(point => ({
        x: point.x + offsetX,
        y: point.y + offsetY,
      }))
    }

    abortEvent(e)
  })

  useEventListener(target, 'pointerup', (e) => {
    targetCorner.value = null
    setCursor('default')

    if (isResizeing.value)
      isResizeing.value = false
    if (isDragging.value)
      isDragging.value = false

    abortEvent(e)
  })

  return {
    controlator,
    controlatorIdx,
    isDragging,
    isInSide,
    isResizeing,
  }
}
