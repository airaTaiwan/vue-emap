<script setup lang="ts">
import { injectEditorContext } from './EditorLayer.vue'

defineProps<{
  width: number
  height: number
}>()

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
  const { offsetX, offsetY } = e

  points.value.push({ x: offsetX, y: offsetY })
}
</script>

<template>
  <canvas :height :width @click="draw" position="absolute top-0 left-0" ref="drawCanvasEl" select-none z3 />
  <slot />
</template>
