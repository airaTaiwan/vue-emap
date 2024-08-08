import { defineComponent } from 'vue'

import { injectEditorContext } from '../EditorLayer.vue'
import { Action } from '../types'
import { type LineWithArrowOptions, Shape } from '../types/shape'

export const LineWithArrow = defineComponent(
  (props: LineWithArrowOptions, { emit, slots }) => {
    const { curX, curY, points } = injectEditorContext()

    function drawPerpendicularArrow(ctx: CanvasRenderingContext2D, midX: number, midY: number, dx: number, dy: number, arrowLength: number, arrowWidth: number, shaftLength: number, lineWidth: number, isAbove: boolean) {
      // Calculate the perpendicular vector
      const length = Math.sqrt(dx * dx + dy * dy)
      let perpX = -dy / length
      let perpY = dx / length

      // If the arrowhead should be below the line, reverse the perpendicular vector
      if (!isAbove) {
        perpX = -perpX
        perpY = -perpY
      }

      ctx.beginPath()
      // Draw the arrow shaft
      ctx.moveTo(midX, midY)
      ctx.lineTo(midX + perpX * shaftLength, midY + perpY * shaftLength)
      ctx.lineWidth = lineWidth
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
        emit('save', Shape.LineWithArrow)
      }
      else {
        if (props.status === Action.Draw)
          emit('clear')

        const strokeStyle = props.strokeStyle ?? '#0073e6'
        const fillStyle = props.fillStyle ?? '#0073e6'
        const lineWidth = props.lineWidth ?? 1
        const arrowLength = props.arrowLength ?? 10 * lineWidth
        const arrowWidth = props.arrowWidth ?? 5 * lineWidth
        const shaftLength = props.shaftLength ?? 10 * lineWidth
        const isAbove = props.isAbove ?? true

        props.ctx.save()
        props.ctx.strokeStyle = strokeStyle
        props.ctx.fillStyle = fillStyle
        props.ctx.fillStyle = fillStyle
        props.ctx.lineWidth = lineWidth

        draw(props.x1, props.y1, _x2, _y2)

        const midX = (props.x1 + _x2) / 2
        const midY = (props.y1 + _y2) / 2
        const dx = _x2 - props.x1
        const dy = _y2 - props.y1

        drawPerpendicularArrow(props.ctx, midX, midY, dx, dy, arrowLength, arrowWidth, shaftLength, lineWidth, isAbove)
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
      'x2',
      'y1',
      'y2',
      'status',
      'arrowLength',
      'arrowWidth',
      'shaftLength',
      'lineWidth',
      'strokeStyle',
      'fillStyle',
      'isAbove',
    ],
  },
)
