import { defineComponent } from 'vue'

import { injectEditorContext } from '../EditorLayer.vue'
import { Shape } from '../types'

export interface LineOptions {
  ctx: CanvasRenderingContext2D
  drawing?: boolean
  lineWidth?: number
  strokeStyle?: string
  x1: number
  x2?: number
  y1: number
  y2?: number
}

export const Line = defineComponent(
  ({ ctx, ...args }: LineOptions, { emit, slots }) => {
    const { curX, curY, points } = injectEditorContext()

    function draw(x1: number, x2: number, y1: number, y2: number, strokeStyle: string, lineWidth: number) {
      if (ctx == null)
        return

      ctx.strokeStyle = strokeStyle
      ctx.lineWidth = lineWidth
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)

      ctx.stroke()
    }

    return () => {
      const { drawing = false, lineWidth = 1, strokeStyle = '#0073e6', x1, x2 = curX.value, y1, y2 = curY.value } = args

      if (drawing && points.value.length === 2) {
        emit('save', Shape.Line)
      }
      else {
        if (drawing)
          emit('clear')

        draw(x1, x2, y1, y2, strokeStyle, lineWidth)
      }

      return slots.default?.()
    }
  },
  {
    emits: ['save', 'clear'],
    props: ['ctx', 'x1', 'x2', 'y1', 'y2', 'drawing', 'strokeStyle', 'lineWidth'],
  },
)
