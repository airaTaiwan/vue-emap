<script lang="ts">
import { EMapSymbol, createContext, useCanvas } from '@vue-emap/utils'

import { Line } from './shape/Line'
import { LineWithArrow } from './shape/LineWithArrow'

interface EditorContext {
  curX: Ref<number>
  curY: Ref<number>
  drawCanvasEl: ShallowRef<HTMLCanvasElement | null>
  points: Ref<Point[]>
  viewCanvasEl: ShallowRef<HTMLCanvasElement | null>
}

export const [injectEditorContext, provideEditorContext] = createContext<EditorContext>('Editor')
</script>

<script setup lang="ts">
import type { EMapContext, Point } from '@vue-emap/utils'
import type { Ref, ShallowRef } from 'vue'

import { useElementSize, useMouse } from '@vueuse/core'
import { computed, h, inject, ref, shallowRef } from 'vue'

import type { EditorOptions, History } from './types'

import DrawLayer from './DrawLayer.vue'
import ViewLayer from './ViewLayer.vue'
import { Shape } from './types'

const props = withDefaults(defineProps<EditorOptions>(), {
  shape: Shape.Line,
})

const { x, y } = useMouse()

const editorCanvasLayerEl = shallowRef<HTMLDivElement | null>(null)
const { height: editorCanvasLayerHeight, width: editorCanvasLayerWidth } = useElementSize(editorCanvasLayerEl)

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

const history = ref<History[]>([])
const points = ref<Point[]>([])

const shapeDrawCom = computed(() => {
  switch (props.shape) {
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
    default:
      return null
  }
})

function save(type: Shape) {
  const data = JSON.parse(JSON.stringify(points.value))
  points.value.length = 0
  clearDrawCanvas()

  history.value.push({
    points: data,
    type,
  })
}

provideEditorContext({
  curX: x,
  curY: y,
  drawCanvasEl,
  points,
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
          <template :key="history.type" v-for="history in history">
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
          </template>
        </template>
      </ViewLayer>
    </template>
  </div>
</template>
