<script lang="ts">
import type { ComputedRef, ModelRef, Ref, ShallowRef } from 'vue'

import { createContext } from '@airataiwan/utils'
import { isString } from '@antfu/utils'
import { nanoid } from 'nanoid'
import { computed, h, reactive, ref, shallowRef, watch } from 'vue'

import { useControl } from './composable/control'
import { Curve } from './shape/Curve'
import { Line } from './shape/Line'
import { LineWithArrow } from './shape/LineWithArrow'
import { Polygon } from './shape/Polygon'
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
  imageCache: ShallowRef<HTMLImageElement | null>
  imageInfo: Ref<Info>
  points: Ref<Point[]>
  reset: () => void
  resetControlator: () => void
  shape: ModelRef<Shape, string>
  viewCanvasEl: ShallowRef<HTMLCanvasElement | null>
}

export const [injectEditorContext, provideEditorContext] = createContext<EditorContext>('Editor')
</script>

<script setup lang="ts">
import { abortEvent, type Info, loadImage, type Point, useCanvas } from '@airataiwan/utils'
import { onKeyStroke, useElementSize, useMouseInElement, watchDeep, watchThrottled } from '@vueuse/core'

import type { EditorOptions, History } from './types'

import DrawLayer from './layers/DrawLayer.vue'
import ViewLayer from './layers/ViewLayer.vue'
import { Action } from './types'

const props = withDefaults(defineProps<EditorOptions>(), {
  allowBackspaceDelete: false,
  autoEdit: true,
  enableDpi: false,
  onlyView: false,
})

const emit = defineEmits<{
  save: [history: History]
  select: [shape: History]
}>()

const action = defineModel<Action>('action', { default: Action.Default, required: false })
const shape = defineModel<Shape>('shape', { default: Shape.Line, required: false })

const imageCache = shallowRef<HTMLImageElement | null>(null)
const imageInfo = ref<Info>({ height: 0, width: 0, x: 0, y: 0 })

const editorCanvasLayerEl = shallowRef<HTMLDivElement | null>(null)
const { height: editorCanvasLayerHeight, width: editorCanvasLayerWidth } = useElementSize(editorCanvasLayerEl)

const drawCanvasEl = shallowRef<HTMLCanvasElement | null>(null)
const { canvasCtx: drawCanvasCtx, clear: clearDrawCanvas, dpi } = useCanvas(
  drawCanvasEl,
  {
    enableDpi: props.enableDpi,
    height: editorCanvasLayerHeight,
    width: editorCanvasLayerWidth,
  },
)

async function initImage() {
  const img = isString(props.img) ? await loadImage(props.img) : props.img

  if (img == null)
    return

  imageInfo.value.width = img.naturalWidth
  imageInfo.value.height = img.naturalHeight
  imageCache.value = img
}

async function drawImage() {
  const { height: imageHeight = 400, width: imageWidth = 400, x, y } = imageInfo.value

  editorCanvasLayerEl.value?.style.setProperty('height', `${imageHeight}px`)
  editorCanvasLayerEl.value?.style.setProperty('width', `${imageWidth}px`)

  viewCanvasCtx.value?.drawImage(imageCache.value!, x, y, imageWidth, imageHeight)
}

function startDraw(e: MouseEvent) {
  if (action.value !== Action.Draw)
    return

  onDraw(e)
}

function onDraw(e: MouseEvent) {
  const { offsetX, offsetY } = e
  const x = offsetX / dpi.value
  const y = offsetY / dpi.value

  points.value.push({ x, y })

  abortEvent(e)
}

const viewCanvasEl = shallowRef<HTMLCanvasElement | null>(null)
const { canvasCtx: viewCanvasCtx, clear: clearViewCanvas } = useCanvas(viewCanvasEl, {
  enableDpi: props.enableDpi,
  height: editorCanvasLayerHeight,
  onDone: async () => {
    await initImage()

    drawImage()
  },
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
  if (props.onlyView)
    return

  if (controlatorIdx.value !== -1)
    resetControlator()

  const targetIdx = historyShape.value.findIndex(shape => shape.id === id)

  setNewControlator(targetIdx)
}

const historyShape = defineModel<History[]>('historyShape', { default: reactive([]), required: false })
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
        ...controlator.value?.options,
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
        ...controlator.value?.options,
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
        ...controlator.value?.options,
      })
    case Shape.Polygon:
      return h(Polygon, {
        ctx: drawCanvasCtx.value!,
        points: points.value,
        status: action.value,
        ...props.polygonOptions,
        ...controlator.value?.options,
      })
    case Shape.Curve:
      return h(Curve, {
        ctx: drawCanvasCtx.value!,
        points: points.value,
        status: action.value,
        ...props.curveOptions,
        ...controlator.value?.options,
      })
    default:
      return null
  }
})

const shapeViewCom = computed(() => (history: History) => {
  switch (history.type) {
    case Shape.Line:
      return h(Line, {
        ctx: viewCanvasCtx.value!,
        x1: history.points[0].x,
        x2: history.points[1].x,
        y1: history.points[0].y,
        y2: history.points[1].y,
        ...history.options || props.lineOptions,
      })
    case Shape.LineWithArrow:
      return h(LineWithArrow, {
        ctx: viewCanvasCtx.value!,
        x1: history.points[0].x,
        x2: history.points[1].x,
        y1: history.points[0].y,
        y2: history.points[1].y,
        ...history.options || props.lineWithArrowOptions,
      })
    case Shape.Rect:
      return h(Rect, {
        ctx: viewCanvasCtx.value!,
        x1: history.points[0].x,
        x2: history.points[1].x,
        y1: history.points[0].y,
        y2: history.points[1].y,
        ...history.options || props.rectOptions,
      })
    case Shape.Polygon:
      return h(Polygon, {
        ctx: viewCanvasCtx.value!,
        points: history.points,
        ...history.options || props.polygonOptions,
      })
    case Shape.Curve:
      return h(Curve, {
        ctx: viewCanvasCtx.value!,
        points: history.points,
        ...history.options || props.curveOptions,
      })
    default:
      return null
  }
})

function handleCapture(e: MouseEvent) {
  if (props.onlyView)
    return

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
  emit('save', controlator.value!)
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
    options: type === Shape.Curve ? props.curveOptions : type === Shape.Line ? props.lineOptions : type === Shape.LineWithArrow ? props.lineWithArrowOptions : type === Shape.Rect ? props.rectOptions : props.polygonOptions,
    points: data,
    type,
  }

  historyShape.value.push(history)
  action.value = Action.Default
  emit('save', history)

  if (props.autoEdit) {
    setNewControlator(historyShape.value.length - 1)
  }

  if (props.onlyView && controlator.value) {
    resetControlator()
    deleteControlator()
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
  deleteControlator()
}

onKeyStroke(['Backspace'], () => {
  if (props.allowBackspaceDelete && controlator.value)
    deleteControlator()
})

onKeyStroke(['Escape'], () => {
  if (action.value !== Action.Draw)
    return

  if (points.value.length === 1) {
    clearDrawCanvas()
    points.value.length = 0
  }
  else {
    save(shape.value)
  }
})

watchThrottled(historyShape, async (newShape) => {
  // Clear view canvas when state changed to avoid the shape re-drawing
  if (newShape.length) {
    clearViewCanvas()
  }

  await drawImage()
}, {
  deep: true,
  flush: 'pre',
})

watch(() => props.img, async () => {
  await initImage()
})

provideEditorContext({
  action,
  clearDrawCanvas,
  clearViewCanvas,
  controlatorIdx,
  curX: x,
  curY: y,
  drawCanvasEl,
  imageCache,
  imageInfo,
  points,
  reset,
  resetControlator,
  shape,
  viewCanvasEl,
})

defineExpose({
  historyShape,
  imageCache,
  imageInfo,
  points,
  reset,
  setControlator,
})
</script>

<template>
  <div ref="editorCanvasLayerEl" style="width: 400px; height: 400px;" relative z5 of-hidden @click="handleCapture">
    <DrawLayer @on-draw="startDraw">
      <template v-if="points.length >= 1 && drawCanvasCtx">
        <component :is="shapeDrawCom" @clear="clearDrawCanvas" @save="save" />
      </template>
    </DrawLayer>
    <ViewLayer>
      <template v-if="viewCanvasCtx">
        <template v-for="history in historyShape" :key="history.id + Date.now()">
          <component :is="shapeViewCom(history)" />
        </template>
      </template>
    </ViewLayer>
    <slot name="tool" />
  </div>
</template>
