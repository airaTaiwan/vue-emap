<script setup lang="ts">
import { abortEvent } from '@airataiwan/utils'

import { injectEditorContext } from '../EditorLayer.vue'

const props = withDefaults(defineProps<{
  disabled: boolean
  dpi: number
}>(), {
  disabled: false,
  dpi: 1,
})

const { drawCanvasEl, points } = injectEditorContext()

// function drawPoint(point: Point, text?: number | string) {
//   if (canvasCtx.value == null)
//     return

//   const { x, y } = point
//   const radius = 10

//   canvasCtx.value.save()
//   canvasCtx.value.beginPath()
//   canvasCtx.value.arc(x, y, radius, 0, 2 * Math.PI)
//   canvasCtx.value.fillStyle = 'grey'
//   canvasCtx.value.fill()

//   if (text !== undefined) {
//     canvasCtx.value.font = '14px Arial'
//     const metrics = canvasCtx.value.measureText(text.toString())
//     const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent

//     canvasCtx.value.fillStyle = 'white'
//     canvasCtx.value.fillText(
//       text.toString(),
//       point.x - metrics.width / 2,
//       point.y + actualHeight / 2,
//     )
//   }

//   canvasCtx.value.restore()
// }

function draw(e: MouseEvent) {
  if (props.disabled)
    return

  const { offsetX, offsetY } = e
  const x = offsetX / props.dpi
  const y = offsetY / props.dpi

  points.value.push({ x, y })

  abortEvent(e)
}
</script>

<template>
  <canvas ref="drawCanvasEl" position="absolute top-0 left-0" select-none z3 @click="draw" />
  <slot />
</template>
