import { defineComponent } from 'vue'

import type { LineOptions } from '../types/shape'

import { injectEditorContext } from '../EditorLayer.vue'
import { Shape } from '../types'

export const Line = defineComponent(
  ({ ctx, ...args }: LineOptions, { emit, slots }) => {
    const { curX, curY, points } = injectEditorContext()

    function draw(x1: number, y1: number, x2: number, y2: number) {
      if (ctx == null)
        return

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)

      ctx.stroke()
    }

    return () => {
      const {
        drawing = false,
        lineWidth = 1,
        strokeStyle = '#0073e6',
        x1,
        x2 = curX.value,
        y1,
        y2 = curY.value,
      } = args

      if (drawing && points.value.length === 2) {
        emit('save', Shape.Line)
      }
      else {
        if (drawing)
          emit('clear')

        ctx.strokeStyle = strokeStyle
        ctx.lineWidth = lineWidth

        draw(x1, y1, x2, y2)
      }

      return slots.default?.()
    }
  },
  {
    emits: ['save', 'clear'],
    props: ['ctx', 'x1', 'y1', 'x2', 'y2', 'drawing', 'strokeStyle', 'lineWidth'],
  },
)
