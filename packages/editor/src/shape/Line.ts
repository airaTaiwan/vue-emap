import type { Point } from '@airataiwan/utils'

import { defineComponent } from 'vue'

import { injectEditorContext } from '../EditorLayer.vue'
import { Action } from '../types'
import { type LineOptions, Shape } from '../types/shape'

export const Line = defineComponent(
  (props: LineOptions, { emit, slots }) => {
    const { curX, curY, points } = injectEditorContext()

    function draw(x1: number, y1: number, x2: number, y2: number) {
      if (props.ctx == null)
        return

      props.ctx.beginPath()
      props.ctx.moveTo(x1, y1)
      props.ctx.lineTo(x2, y2)

      props.ctx.stroke()
    }

    return () => {
      const _x2 = props.x2 ?? curX.value
      const _y2 = props.y2 ?? curY.value

      if (props.status === Action.Draw && points.value.length === 2) {
        emit('save', Shape.Line)
      }
      else {
        if (props.status === Action.Draw)
          emit('clear')

        const strokeStyle = props.strokeStyle ?? '#0073e6'
        const lineWidth = props.lineWidth ?? 1

        props.ctx.save()
        props.ctx.strokeStyle = strokeStyle
        props.ctx.lineWidth = lineWidth

        draw(props.x1, props.y1, _x2, _y2)
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

export function updateLinePoint(points: Point[], offsetX: number, offsetY: number, idx: number) {
  const newPoints: Point[] = [...points]

  switch (idx) {
    case 0:
      newPoints[0].x += offsetX
      newPoints[0].y += offsetY
      break
    case 1:
      newPoints[1].x += offsetX
      newPoints[1].y += offsetY
      break
  }

  return newPoints
}
