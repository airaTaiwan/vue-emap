import type { Point } from '@airataiwan/utils'

import { defineComponent } from 'vue'

import { injectEditorContext } from '../EditorLayer.vue'
import { Action } from '../types'
import { type RectOptions, Shape } from '../types/shape'

export const Rect = defineComponent(
  (props: RectOptions, { emit, slots }) => {
    const { curX, curY, points } = injectEditorContext()

    function draw(x1: number, y1: number, w: number, h: number) {
      if (props.ctx == null)
        return

      props.ctx.beginPath()
      props.ctx.rect(x1, y1, w, h)

      props.ctx.stroke()
      props.ctx.fill()
    }

    return () => {
      const _x2 = props.x2 ?? curX.value
      const _y2 = props.y2 ?? curY.value
      const w = _x2 - props.x1
      const h = _y2 - props.y1

      if (props.status === Action.Draw && points.value.length === 2) {
        emit('save', Shape.Rect)
      }
      else {
        if (props.status === Action.Draw)
          emit('clear')

        const fillStyle = props.fillStyle ?? 'transparent'
        const strokeStyle = props.strokeStyle ?? '#0073e6'

        props.ctx.save()
        props.ctx.lineWidth = props.lineWidth ?? 1
        props.ctx.fillStyle = fillStyle
        props.ctx.strokeStyle = strokeStyle

        draw(props.x1, props.y1, w, h)
        props.ctx.restore()
      }

      return slots.default?.()
    }
  },
  {
    emits: ['save', 'clear'],
    props: [
      'ctx',
      'x1',
      'y1',
      'x2',
      'y2',
      'status',
      'lineWidth',
      'strokeStyle',
      'fillStyle',
    ],
  },
)

/**
 * Translates the points of a rectangle to create a new rectangle.
 *
 * @example
 * const points = [
 *   { x: 0, y: 0 }, // top-left
 *   { x: 100, y: 100 }, // bottom-right
 * ];
 *
 * const translatedPoints = translateRectPoints(points);
 * // Result: [
 * //   { x: 0, y: 0 }, // top-left
 * //   { x: 100, y: 0 }, // top-right
 * //   { x: 100, y: 100 }, // bottom-right
 * //   { x: 0, y: 100 }, // bottom-left
 * // ]
 */
export function translateRectPoints(points: Point[]): Point[] {
  const [topleftPoint, bottomrightPoint] = points

  return [
    topleftPoint,
    { x: bottomrightPoint.x, y: topleftPoint.y },
    bottomrightPoint,
    { x: topleftPoint.x, y: bottomrightPoint.y },
  ]
}

export function updateRectPoint(points: Point[], offsetX: number, offsetY: number, idx: number) {
  const newPoints: Point[] = [...points]

  switch (idx) {
    case 0:
      newPoints[0].x += offsetX
      newPoints[0].y += offsetY
      break
    case 1:
      newPoints[1].x += offsetX
      newPoints[0].y += offsetY
      break
    case 2:
      newPoints[1].x += offsetX
      newPoints[1].y += offsetY
      break
    case 3:
      newPoints[0].x += offsetX
      newPoints[1].y += offsetY
      break
  }

  return newPoints
}

/**
 * Draw the borders of a rectangle.
 */
export function drawRectBorders(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  center: Point,
  distance: number,
) {
  const width = Math.abs(points[2].x - points[0].x)
  const height = Math.abs(points[2].y - points[0].y)

  const newWidth = width + 2 * distance
  const newHeight = height + 2 * distance

  const newX = center.x - newWidth / 2
  const newY = center.y - newHeight / 2

  ctx.beginPath()
  ctx.rect(newX, newY, newWidth, newHeight)
  ctx.stroke()

  return [
    { x: newX, y: newY },
    { x: newX + newWidth, y: newY },
    { x: newX + newWidth, y: newY + newHeight },
    { x: newX, y: newY + newHeight },
  ]
}
