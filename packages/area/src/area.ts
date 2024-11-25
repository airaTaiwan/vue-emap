import type { EMapContext } from '@airataiwan/utils'

import { drawRectangle, EMapSymbol, useCanvas } from '@airataiwan/utils'
import { defineComponent, inject, watchEffect } from 'vue'

import type { AreaOptions } from './types'

export const Area = defineComponent(
  ({
    area = [],
  }: AreaOptions, { slots }) => {
    const { canvasLayerHeight, canvasLayerWidth, drawCanvas, enableDpi: eMapEnableDpi, imageInfo, zoomNum } = inject(EMapSymbol) as EMapContext

    const { canvasCtx, clear } = useCanvas(
      {
        enableDpi: eMapEnableDpi,
        height: canvasLayerHeight,
        width: canvasLayerWidth,
      },
    )

    function draw() {
      if (canvasCtx.value == null)
        return

      canvasCtx.value.strokeStyle = 'red'
      canvasCtx.value.lineWidth = 2
      canvasCtx.value.fillStyle = 'rgba(255, 0, 0, 0.5)'

      drawRectangle(canvasCtx.value, area)

      canvasCtx.value.stroke()
      canvasCtx.value.fill()

      drawCanvas(canvasCtx.value.canvas)
    }

    watchEffect(() => {
      if (canvasCtx.value == null)
        return

      const { x, y } = imageInfo.value

      clear()

      canvasCtx.value.save()
      canvasCtx.value.translate(x, y)
      canvasCtx.value.scale(zoomNum.value, zoomNum.value)

      draw()

      canvasCtx.value.restore()
    })

    return () => {
      return slots.default?.()
    }
  },
  {
    props: ['area', 'draggable'],
  },
)
