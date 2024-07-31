import { defineComponent } from 'vue'

import type { ShapeOptions } from '../types'

import { injectEditorContext } from '../EditorLayer.vue'
import { Shape } from '../types'

export interface RectOptions extends ShapeOptions {
  /**
   * The x-coordinate of the top-left corner of the rectangle.
   */
  x1: number

  /**
   * The optional x-coordinate of the bottom-right corner of the rectangle.
   */
  x2?: number

  /**
   * The y-coordinate of the top-left corner of the rectangle.
   */
  y1: number

  /**
   * The optional y-coordinate of the bottom-right corner of the rectangle.
   */
  y2?: number
}

export const Rect = defineComponent(
  ({ ctx, ...args }: RectOptions, { emit, slots }) => {
    const { curX, curY, points } = injectEditorContext()

    function draw(x1: number, y1: number, w: number, h: number) {
      if (ctx == null)
        return

      ctx.beginPath()
      ctx.rect(x1, y1, w, h)

      ctx.stroke()
      ctx.fill()
    }

    return () => {
      const {
        drawing = false,
        fillStyle = 'transparent',
        strokeStyle = '#0073e6',
        x1,
        x2 = curX.value,
        y1,
        y2 = curY.value,
      } = args
      const w = x2 - x1
      const h = y2 - y1

      if (drawing && points.value.length === 2) {
        emit('save', Shape.Rect)
      }
      else {
        if (drawing)
          emit('clear')

        ctx.fillStyle = fillStyle
        ctx.strokeStyle = strokeStyle

        draw(x1, y1, w, h)
      }

      return slots.default?.()
    }
  },
  {
    emits: ['save', 'clear'],
    props: ['ctx', 'x1', 'y1', 'x2', 'y2', 'drawing'],
  },
)
