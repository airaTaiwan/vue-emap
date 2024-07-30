import { defineComponent } from 'vue'

import type { LineOptions } from '../types'

import { injectEditorContext } from '../EditorLayer.vue'
import { Shape } from '../types'

export interface LineWithArrowOptions extends LineOptions {
  /**
   * The length of the arrow
   * @default 10
   */
  arrowLength?: number

  /**
   * The width of the arrow
   * @default 5
   */
  arrowWidth?: number

  /**
   * The fill color of the arrow
   * @default '#0073e6'
   */
  fillStyle?: string

  /**
   * The length of the arrow shaft
   * @default 10
   */
  shaftLength?: number
}

export const LineWithArrow = defineComponent(
  ({ ctx, ...args }: LineWithArrowOptions, { emit, slots }) => {
    const { curX, curY, points } = injectEditorContext()

    function drawPerpendicularArrow(ctx: CanvasRenderingContext2D, midX: number, midY: number, dx: number, dy: number, arrowLength: number, arrowWidth: number, shaftLength: number) {
      // Calculate the perpendicular vector
      const length = Math.sqrt(dx * dx + dy * dy)
      const perpX = -dy / length
      const perpY = dx / length

      ctx.beginPath()
      // Draw the arrow shaft
      ctx.moveTo(midX, midY)
      ctx.lineTo(midX + perpX * shaftLength, midY + perpY * shaftLength)
      ctx.stroke()

      // Draw the arrow head
      ctx.beginPath()
      ctx.moveTo(midX + perpX * shaftLength, midY + perpY * shaftLength)
      ctx.lineTo(midX + perpX * (shaftLength - arrowWidth) + perpY * arrowWidth, midY + perpY * (shaftLength - arrowWidth) - perpX * arrowWidth)
      ctx.lineTo(midX + perpX * (shaftLength + arrowLength), midY + perpY * (shaftLength + arrowLength))
      ctx.lineTo(midX + perpX * (shaftLength - arrowWidth) - perpY * arrowWidth, midY + perpY * (shaftLength - arrowWidth) + perpX * arrowWidth)
      ctx.closePath()
      ctx.fill()
    }

    function draw(x1: number, x2: number, y1: number, y2: number, strokeStyle: string, fillStyle: string, lineWidth: number, arrowLength: number, arrowWidth: number, shaftLength: number) {
      if (ctx == null)
        return

      ctx.strokeStyle = strokeStyle
      ctx.fillStyle = fillStyle
      ctx.lineWidth = lineWidth
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()

      const midX = (x1 + x2) / 2
      const midY = (y1 + y2) / 2
      const dx = x2 - x1
      const dy = y2 - y1

      drawPerpendicularArrow(ctx, midX, midY, dx, dy, arrowLength, arrowWidth, shaftLength)
    }

    return () => {
      const { arrowLength = 10, arrowWidth = 5, drawing = false, fillStyle = '#0073e6', lineWidth = 1, shaftLength = 10, strokeStyle = '#0073e6', x1, x2 = curX.value, y1, y2 = curY.value } = args

      if (drawing && points.value.length === 2) {
        emit('save', Shape.LineWithArrow)
      }
      else {
        if (drawing)
          emit('clear')

        draw(x1, x2, y1, y2, strokeStyle, fillStyle, lineWidth, arrowLength, arrowWidth, shaftLength)
      }

      return slots.default?.()
    }
  },
  {
    emits: ['save', 'clear'],
    props: ['ctx', 'x1', 'x2', 'y1', 'y2', 'drawing', 'strokeStyle', 'fillStyle', 'lineWidth', 'arrowLength', 'arrowWidth', 'shaftLength'],
  },
)
