import type { Point } from '@airataiwan/utils'

import { pointsOnBezierCurves } from 'points-on-curve'
import { curveToBezier } from 'points-on-curve/lib/curve-to-bezier.js'
import { defineComponent } from 'vue'

import type { CurveOptions } from '../types/shape'

import { injectEditorContext } from '../EditorLayer.vue'
import { Action } from '../types'

export const Curve = defineComponent(
  (props: CurveOptions, { emit, slots }) => {
    const { curX, curY } = injectEditorContext()

    function drawCurve(ctx: CanvasRenderingContext2D, points: Point[]) {
      if (points.length < 2)
        return

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)

      if (points.length === 2) {
        ctx.lineTo(points[1].x, points[1].y)
      }
      else {
        const bezierPoints = curveToBezier(points.map(p => ([p.x, p.y])), 0.5)
        const curvePoints = pointsOnBezierCurves(bezierPoints)

        for (const point of curvePoints) {
          ctx.lineTo(point[0], point[1])
        }
      }

      ctx.stroke()
    }

    return () => {
      const strokeStyle = props.strokeStyle ?? '#0073e6'
      const lineWidth = props.lineWidth ?? 1

      props.ctx.save()
      props.ctx.strokeStyle = strokeStyle
      props.ctx.lineWidth = lineWidth
      props.ctx.lineCap = 'round'
      props.ctx.lineJoin = 'round'

      if (props.status === Action.Draw) {
        emit('clear')

        const newPoints = [...props.points, { x: curX.value, y: curY.value }]
        drawCurve(props.ctx, newPoints)
      }
      else {
        drawCurve(props.ctx, props.points)
      }

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

export function updateCurvePoint(points: Point[], offsetX: number, offsetY: number, idx: number) {
  const newPoints: Point[] = [...points]

  newPoints[idx] = {
    x: newPoints[idx].x + offsetX,
    y: newPoints[idx].y + offsetY,
  }

  return newPoints
}
