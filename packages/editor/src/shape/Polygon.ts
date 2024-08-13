import { findNearPoint, type Point } from '@airataiwan/utils'
import { defineComponent } from 'vue'

import { injectEditorContext } from '../EditorLayer.vue'
import { Action } from '../types'
import { type PolygonOptions, Shape } from '../types/shape'

export const Polygon = defineComponent(
  (props: PolygonOptions, { emit, slots }) => {
    const { curX, curY, points } = injectEditorContext()

    function draw(points: Point[]) {
      if (props.ctx == null)
        return

      props.ctx.beginPath()
      props.ctx.moveTo(points[0].x, points[0].y)

      for (let i = 1; i < points.length; i++) props.ctx.lineTo(points[i].x, points[i].y)

      props.ctx.closePath()
    }

    return () => {
      if (props.status === Action.Draw && points.value.length >= 4 && findNearPoint(points.value[points.value.length - 1], points.value[0], 10)) {
        points.value.splice(points.value.length - 1, 1)
        emit('save', Shape.Polygon)
        return slots.default?.()
      }

      const fillStyle = props.fillStyle ?? 'transparent'
      const strokeStyle = props.strokeStyle ?? '#0073e6'

      props.ctx.save()
      props.ctx.lineWidth = props.lineWidth ?? 1
      props.ctx.fillStyle = fillStyle
      props.ctx.strokeStyle = strokeStyle

      if (props.status === Action.Draw) {
        emit('clear')

        const newPoints = [...props.points, { x: curX.value, y: curY.value }]
        draw(newPoints)
      }
      else {
        draw(props.points)
      }

      props.ctx.fill()
      props.ctx.stroke()
      props.ctx.restore()

      return slots.default?.()
    }
  },
  {
    emits: ['save', 'clear'],
    props: [
      'ctx',
      'points',
      'status',
      'lineWidth',
      'strokeStyle',
      'fillStyle',
    ],
  },
)

export function updatePolygonPoint(points: Point[], offsetX: number, offsetY: number, idx: number) {
  const newPoints = [...points]

  newPoints[idx].x += offsetX
  newPoints[idx].y += offsetY

  return newPoints
}

/**
 * Draw the borders of a polygon.
 */
export function drawPolygonBorders(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  center: Point,
  distance: number,
) {
  ctx.save()

  ctx.globalAlpha = 1
  ctx.strokeStyle = '#00c9ff'
  ctx.lineWidth = 1

  // 計算新的頂點
  const newPoints = points.map((point) => {
    const dx = point.x - center.x
    const dy = point.y - center.y
    const scale = 1 + distance / Math.sqrt(dx * dx + dy * dy)
    return {
      x: center.x + dx * scale,
      y: center.y + dy * scale,
    }
  })

  // 繪製新的多邊形
  ctx.beginPath()
  ctx.moveTo(newPoints[0].x, newPoints[0].y)
  for (let i = 1; i < newPoints.length; i++) {
    ctx.lineTo(newPoints[i].x, newPoints[i].y)
  }
  ctx.closePath()
  ctx.stroke()

  ctx.restore()

  return newPoints
}
