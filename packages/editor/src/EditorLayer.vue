<script lang="ts">
import type { ComputedRef, ModelRef, Ref, ShallowRef } from 'vue'

import { createContext } from '@airataiwan/utils'
import { nanoid } from 'nanoid'
import { computed, h, ref, shallowRef } from 'vue'

import { useControl } from './composable/control'
import { Line } from './shape/Line'
import { LineWithArrow } from './shape/LineWithArrow'
import { Rect } from './shape/Rect'
import { Shape } from './types/shape'

interface EditorContext {
  action: ModelRef<Action, string>
  clearDrawCanvas: () => void
  clearViewCanvas: () => void
  controlatorIdx: Ref<number>
  curX: ComputedRef<number>
  curY: ComputedRef<number>
  drawCanvasEl: ShallowRef<HTMLCanvasElement | null>
  points: Ref<Point[]>
  reset: () => void
  resetControlator: () => void
  shape: ModelRef<Shape, string>
  viewCanvasEl: ShallowRef<HTMLCanvasElement | null>
}

export const [injectEditorContext, provideEditorContext] = createContext<EditorContext>('Editor')
</script>

<script setup lang="ts">
import { type Point, useCanvas } from '@airataiwan/utils'
import { onKeyStroke, useElementSize, useMouseInElement, watchDeep, watchThrottled } from '@vueuse/core'

import type { EditorOptions, History } from './types'

import DrawLayer from './layers/DrawLayer.vue'
import ViewLayer from './layers/ViewLayer.vue'
import { Action } from './types'

const props = withDefaults(defineProps<EditorOptions>(), {
  allowBackspaceDelete: false,
  autoEdit: true,
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

const timeStamp = ref(0)
const {
  controlator,
  controlatorIdx,
  isInSide,
} = useControl(editorCanvasLayerEl, drawCanvasCtx, timeStamp)
/**
 * Set controlator
 *
 * @param id - The id of the shape to set as controlator
 */
function setControlator(id: string) {
  const targetIdx = historyShape.value.findIndex(shape => shape.id === id)

  controlator.value = historyShape.value[targetIdx]
  controlatorIdx.value = targetIdx

  action.value = Action.Edit
}

const historyShape = ref<History[]>(props.historyShape)
const points = ref<Point[]>([])

const shapeDrawCom = computed(() => {
  switch (shape.value) {
    case Shape.LineWithArrow:
      return h(LineWithArrow, {
        ctx: drawCanvasCtx.value!,
        status: action.value,
        x1: points.value[0].x,
        x2: points.value[1]?.x,
        y1: points.value[0].y,
        y2: points.value[1]?.y,
        ...props.lineWithArrowOptions,
      })
    case Shape.Line:
      return h(Line, {
        ctx: drawCanvasCtx.value!,
        status: action.value,
        x1: points.value[0].x,
        x2: points.value[1]?.x,
        y1: points.value[0].y,
        y2: points.value[1]?.y,
        ...props.lineOptions,
      })
    case Shape.Rect:
      return h(Rect, {
        ctx: drawCanvasCtx.value!,
        status: action.value,
        x1: points.value[0].x,
        x2: points.value[1]?.x,
        y1: points.value[0].y,
        y2: points.value[1]?.y,
        ...props.rectOptions,
      })
    default:
      return null
  }
})

function handleCapture(e: MouseEvent) {
  if (action.value === Action.Draw || !editorCanvasLayerEl.value)
    return

  if (controlator.value && e.timeStamp - timeStamp.value > 300)
    return

  const { left, top } = editorCanvasLayerEl.value.getBoundingClientRect()
  const x = e.clientX - left
  const y = e.clientY - top

  const mergeArrayableShape = controlator.value
    ? [...historyShape.value.slice(0, controlatorIdx.value), { points: points.value, type: shape.value }, ...historyShape.value.slice(controlatorIdx.value)]
    : historyShape.value

  const targetShapeIdx = mergeArrayableShape.findIndex(shape =>
    isInSide(shape.type, { x, y }, shape.points),
  )

  if (targetShapeIdx === controlatorIdx.value)
    return

  if (controlator.value && points.value.length) {
    resetControlator()
  }

  if (targetShapeIdx === -1)
    return

  setNewControlator(targetShapeIdx)

  if (controlator.value) {
    emit('select', controlator.value)
  }
}

function deleteControlator() {
  points.value.length = 0
  controlator.value = null
  controlatorIdx.value = -1
  clearDrawCanvas()
}

function resetControlator() {
  clearViewCanvas()
  clearDrawCanvas()
  action.value = Action.Default
  historyShape.value.splice(controlatorIdx.value, 0, controlator.value!)
  controlatorIdx.value = -1
  controlator.value = null
  points.value.length = 0
}

function setNewControlator(idx: number) {
  clearViewCanvas()
  action.value = Action.Edit
  controlatorIdx.value = idx
  controlator.value = historyShape.value[idx]
  shape.value = controlator.value.type
  points.value = JSON.parse(JSON.stringify(controlator.value.points))
  historyShape.value.splice(idx, 1)
}

watchDeep(controlator, (history) => {
  if (history == null)
    return

  clearDrawCanvas()
  points.value = [...history.points]
})

function save(type: Shape) {
  const data = JSON.parse(JSON.stringify(points.value))
  points.value.length = 0
  clearDrawCanvas()

  const history: History = {
    id: nanoid(),
    options: type === Shape.Line ? props.lineOptions : type === Shape.LineWithArrow ? props.lineWithArrowOptions : props.rectOptions,
    points: data,
    type,
  }

  historyShape.value.push(history)
  action.value = Action.Default
  emit('save', history)

  if (props.autoEdit) {
    setNewControlator(historyShape.value.length - 1)
  }
}

function clear() {
  clearDrawCanvas()
  clearViewCanvas()
}

function reset() {
  points.value.length = 0
  historyShape.value.length = 0
  clear()
}

onKeyStroke(['Backspace'], () => {
  if (props.allowBackspaceDelete && controlator.value)
    deleteControlator()
})

onKeyStroke(['Escape'], () => {
  if (action.value === Action.Draw && points.value.length === 1) {
    points.value.length = 0
    clearDrawCanvas()
  }
})

// Clear view canvas when state changed to avoid the shape re-drawing
watchThrottled(historyShape, (_new) => {
  if (historyShape.value.length) {
    clearViewCanvas()
  }
}, {
  deep: true,
  flush: 'pre',
})

provideEditorContext({
  action,
  clearDrawCanvas,
  clearViewCanvas,
  controlatorIdx,
  curX: x,
  curY: y,
  drawCanvasEl,
  points,
  reset,
  resetControlator,
  shape,
  viewCanvasEl,
})

defineExpose({
  historyShape,
  points,
  reset,
  setControlator,
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
        <template v-for="history in historyShape" :key="history.id + Date.now()">
          <Line
            v-if="history.type === Shape.Line"
            :ctx="viewCanvasCtx"
            :x1="history.points[0].x"
            :x2="history.points[1].x"
            :y1="history.points[0].y"
            :y2="history.points[1].y"
            v-bind="history.options || props.lineOptions"
          />
          <LineWithArrow
            v-if="history.type === Shape.LineWithArrow"
            :ctx="viewCanvasCtx"
            :x1="history.points[0].x"
            :x2="history.points[1].x"
            :y1="history.points[0].y"
            :y2="history.points[1].y"
            v-bind="history.options || props.lineWithArrowOptions"
          />
          <Rect
            v-if="history.type === Shape.Rect"
            :ctx="viewCanvasCtx"
            :x1="history.points[0].x"
            :x2="history.points[1].x"
            :y1="history.points[0].y"
            :y2="history.points[1].y"
            v-bind="history.options || props.rectOptions"
          />
        </template>
      </template>
    </ViewLayer>
    <slot name="tool" />
  </div>
</template>
