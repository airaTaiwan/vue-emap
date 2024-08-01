<script lang="ts">
import { createContext, isPointInPolygon, isPointOnLine, useCanvas } from '@airataiwan/utils'

import { Line } from './shape/Line'
import { LineWithArrow } from './shape/LineWithArrow'
import { Rect } from './shape/Rect'

interface EditorContext {
  action: ModelRef<Action, string>
  curX: ComputedRef<number>
  curY: ComputedRef<number>
  drawCanvasEl: ShallowRef<HTMLCanvasElement | null>
  points: Ref<Point[]>
  shape: ModelRef<Shape, string>
  viewCanvasEl: ShallowRef<HTMLCanvasElement | null>
}

export const [injectEditorContext, provideEditorContext] = createContext<EditorContext>('Editor')
</script>

<script setup lang="ts">
import type { Point } from '@airataiwan/utils'
import type { ComputedRef, ModelRef, Ref, ShallowRef } from 'vue'

import { useElementSize, useMouseInElement } from '@vueuse/core'
import { computed, h, ref, shallowRef } from 'vue'

import type { EditorOptions, History } from './types'

import DrawLayer from './layers/DrawLayer.vue'
import ViewLayer from './layers/ViewLayer.vue'
import { Action, Shape } from './types'

const props = withDefaults(defineProps<EditorOptions>(), {
  historyShape: () => [],
})

const emit = defineEmits<{
  save: [history: History]
  select: [shape: History]
}>()

const action = defineModel<Action>('action', { default: Action.Default, required: false })
const shape = defineModel<Shape>('shape', { default: Shape.Line, required: false })

const editorCanvasLayerEl = shallowRef<HTMLDivElement | null>(null)
const { height: editorCanvasLayerHeight, width: editorCanvasLayerWidth } = useElementSize(editorCanvasLayerEl)

const drawCanvasEl = shallowRef<HTMLCanvasElement | null>(null)
const { canvasCtx: drawCanvasCtx, clear: clearDrawCanvas, dpi } = useCanvas(
  drawCanvasEl,
  {
    height: editorCanvasLayerHeight,
    width: editorCanvasLayerWidth,
  },
)

const viewCanvasEl = shallowRef<HTMLCanvasElement | null>(null)
const { canvasCtx: viewCanvasCtx, clear: clearViewCanvas } = useCanvas(viewCanvasEl, {
  height: editorCanvasLayerHeight,
  width: editorCanvasLayerWidth,
})

const { elementX, elementY } = useMouseInElement(editorCanvasLayerEl)
const x = computed(() => elementX.value / dpi.value)
const y = computed(() => elementY.value / dpi.value)

const historyShape = ref<History[]>(props.historyShape)
const points = ref<Point[]>([])

const shapeDrawCom = computed(() => {
  switch (shape.value) {
    case Shape.LineWithArrow:
      return h(LineWithArrow, {
        ctx: drawCanvasCtx.value!,
        drawing: true,
        x1: points.value[0].x,
        x2: points.value[1]?.x,
        y1: points.value[0].y,
        y2: points.value[1]?.y,
      })
    case Shape.Line:
      return h(Line, {
        ctx: drawCanvasCtx.value!,
        drawing: true,
        x1: points.value[0].x,
        x2: points.value[1]?.x,
        y1: points.value[0].y,
        y2: points.value[1]?.y,
      })
    case Shape.Rect:
      return h(Rect, {
        ctx: drawCanvasCtx.value!,
        drawing: true,
        h: points.value[1]?.y,
        w: points.value[1]?.x,
        x1: points.value[0].x,
        y1: points.value[0].y,
      })
    default:
      return null
  }
})

function handleCapture(e: MouseEvent) {
  if (action.value !== Action.Default || historyShape.value.length === 0)
    return

  if (editorCanvasLayerEl.value == null)
    return

  const rect = editorCanvasLayerEl.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const targetShape = historyShape.value.find((shape) => {
    const { points, type } = shape

    switch (type) {
      case Shape.Line:
      case Shape.LineWithArrow:
        return isPointOnLine(x, y, points)
      case Shape.Rect:
        return isPointInPolygon(x, y, [
          {
            x: points[0].x,
            y: points[0].y,
          },
          {
            x: points[1].x,
            y: points[0].y,
          },
          {
            x: points[1].x,
            y: points[1].y,
          },
          {
            x: points[0].x,
            y: points[1].y,
          },
        ])
      default :
        return false
    }
  })

  if (targetShape == null)
    return

  emit('select', targetShape)
}

function save(type: Shape) {
  const data = JSON.parse(JSON.stringify(points.value))
  points.value.length = 0
  clearDrawCanvas()

  const history = {
    points: data,
    type,
  }

  historyShape.value.push(history)
  emit('save', history)
}

function reset() {
  points.value.length = 0
  historyShape.value.length = 0
  clearDrawCanvas()
  clearViewCanvas()
}

provideEditorContext({
  action,
  curX: x,
  curY: y,
  drawCanvasEl,
  points,
  shape,
  viewCanvasEl,
})

defineExpose({
  historyShape,
  reset,
})
</script>

<template>
  <div ref="editorCanvasLayerEl" position="absolute inset-0" z5 of-hidden @click="handleCapture">
    <DrawLayer :dpi :disabled="action !== Action.Draw">
      <template v-if="points.length >= 1 && drawCanvasCtx">
        <component :is="shapeDrawCom" @clear="clearDrawCanvas" @save="save" />
      </template>
    </DrawLayer>
    <ViewLayer>
      <template v-if="viewCanvasCtx">
        <template v-for="history in historyShape" :key="history.type">
          <Line
            v-if="history.type === Shape.Line"
            :ctx="viewCanvasCtx"
            :x1="history.points[0].x"
            :x2="history.points[1].x"
            :y1="history.points[0].y"
            :y2="history.points[1].y"
          />
          <LineWithArrow
            v-if="history.type === Shape.LineWithArrow"
            :ctx="viewCanvasCtx"
            :x1="history.points[0].x"
            :x2="history.points[1].x"
            :y1="history.points[0].y"
            :y2="history.points[1].y"
          />
          <Rect
            v-if="history.type === Shape.Rect"
            :ctx="viewCanvasCtx"
            :x1="history.points[0].x"
            :x2="history.points[1].x"
            :y1="history.points[0].y"
            :y2="history.points[1].y"
          />
        </template>
      </template>
    </ViewLayer>
    <slot name="tool" />
  </div>
</template>
