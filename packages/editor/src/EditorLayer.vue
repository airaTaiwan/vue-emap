<script lang="ts">
import { EMapSymbol, createContext, useCanvas } from '@airataiwan/utils'

import { Line } from './shape/Line'
import { LineWithArrow } from './shape/LineWithArrow'
import { Rect } from './shape/Rect'

interface EditorContext {
  curX: Ref<number>
  curY: Ref<number>
  drawCanvasEl: ShallowRef<HTMLCanvasElement | null>
  points: Ref<Point[]>
  shape: ModelRef<Shape, string>
  viewCanvasEl: ShallowRef<HTMLCanvasElement | null>
}

export const [injectEditorContext, provideEditorContext] = createContext<EditorContext>('Editor')
</script>

<script setup lang="ts">
import type { EMapContext, Point } from '@airataiwan/utils'
import type { ModelRef, Ref, ShallowRef } from 'vue'

import { useElementSize, useMouseInElement } from '@vueuse/core'
import { computed, h, inject, ref, shallowRef } from 'vue'

import type { EditorOptions, History } from './types'

import DrawLayer from './DrawLayer.vue'
import ViewLayer from './ViewLayer.vue'
import { Shape } from './types'

withDefaults(defineProps<EditorOptions>(), {})

const shape = defineModel<Shape>('shape', { default: Shape.Line, required: false })

const editorCanvasLayerEl = shallowRef<HTMLDivElement | null>(null)
const { height: editorCanvasLayerHeight, width: editorCanvasLayerWidth } = useElementSize(editorCanvasLayerEl)

const { elementX: x, elementY: y } = useMouseInElement(editorCanvasLayerEl)

const drawCanvasEl = shallowRef<HTMLCanvasElement | null>(null)
const { canvasCtx: drawCanvasCtx, clear: clearDrawCanvas } = useCanvas(
  drawCanvasEl,
  {
    height: editorCanvasLayerHeight,
    width: editorCanvasLayerWidth,
  },
)

const viewCanvasEl = shallowRef<HTMLCanvasElement | null>(null)
const { canvasCtx: viewCanvasCtx } = useCanvas(viewCanvasEl, {
  height: editorCanvasLayerHeight,
  width: editorCanvasLayerWidth,
})

const { canvasLayerHeight, canvasLayerWidth } = inject(EMapSymbol, {
  canvasLayerHeight: editorCanvasLayerHeight,
  canvasLayerWidth: editorCanvasLayerWidth,
}) as EMapContext

const historyShape = ref<History[]>([])
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

function save(type: Shape) {
  const data = JSON.parse(JSON.stringify(points.value))
  points.value.length = 0
  clearDrawCanvas()

  historyShape.value.push({
    points: data,
    type,
  })
}

provideEditorContext({
  curX: x,
  curY: y,
  drawCanvasEl,
  points,
  shape,
  viewCanvasEl,
})
</script>

<template>
  <div position="absolute inset-0" ref="editorCanvasLayerEl" z5>
    <template v-if="canvasLayerHeight !== 0 && canvasLayerWidth !== 0">
      <DrawLayer :height="canvasLayerHeight" :width="canvasLayerWidth">
        <template v-if="points.length >= 1 && drawCanvasCtx">
          <component :is="shapeDrawCom" @clear="clearDrawCanvas" @save="save" />
        </template>
      </DrawLayer>
      <ViewLayer :height="canvasLayerHeight" :width="canvasLayerWidth">
        <template v-if="viewCanvasCtx">
          <template :key="history.type" v-for="history in historyShape">
            <Line
              :ctx="viewCanvasCtx"
              :x1="history.points[0].x"
              :x2="history.points[1].x"
              :y1="history.points[0].y"
              :y2="history.points[1].y"
              v-if="history.type === Shape.Line"
            />
            <LineWithArrow
              :ctx="viewCanvasCtx"
              :x1="history.points[0].x"
              :x2="history.points[1].x"
              :y1="history.points[0].y"
              :y2="history.points[1].y"
              v-if="history.type === Shape.LineWithArrow"
            />
            <Rect
              :ctx="viewCanvasCtx"
              :x1="history.points[0].x"
              :x2="history.points[1].x"
              :y1="history.points[0].y"
              :y2="history.points[1].y"
              v-if="history.type === Shape.Rect"
            />
          </template>
        </template>
      </ViewLayer>
    </template>
    <slot name="tool" />
  </div>
</template>
