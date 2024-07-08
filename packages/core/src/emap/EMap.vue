<script lang="ts">
import { ANIMATION_EASE_IN_OUT_QUAD, centerOffset, createContext, easingFunctions, loadImage, useCanvas, useResetPoint } from '@vue-emap/utils'

export interface EMapContext {
  eventLayerEl: ShallowRef<HTMLDivElement | null>
  imageInfo: Ref<Info>
  zoomChangePoint: Ref<Point>
  zoomNum: Ref<number>
  zoomRatio: Ref<number>
}

export const [injectEMapContext, provideEMapContext]
  = createContext<EMapContext>('EMapContext')
</script>

<script setup lang="ts">
import type { Info, Point, Size } from '@vue-emap/utils'
import type { Ref, ShallowRef } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'

import { isString, sleep } from '@antfu/utils'
import { until, useDevicePixelRatio, useElementSize, useFps, useRafFn, watchDeep } from '@vueuse/core'
import { computed, onMounted, ref, shallowRef, toValue } from 'vue'

import type { EMapOptions, Zoom } from './types'

import EMapEventLayer from './EMapEventLayer.vue'
import EMapOverlay from './EMapOverlay.vue'

const props = withDefaults(defineProps<EMapOptions>(), {
  animation: () => ({
    duration: 1000,
    // TODO: it should can be string
    easingFunction: ANIMATION_EASE_IN_OUT_QUAD,
  }),
  draggable: true,
  maxZoom: 5,
  minZoom: 0.5,
  zoom: 1,
  zoomControl: true,
})

const { pixelRatio } = useDevicePixelRatio()
const fps = useFps()

const canvasLayerEl = shallowRef<HTMLDivElement | null>(null)
const { height: canvasLayerHeight, width: canvasLayerWidth } = useElementSize(canvasLayerEl)

const canvasEl = shallowRef<HTMLCanvasElement | null>(null)
const imageCache = shallowRef<HTMLImageElement | null>(null)
const imageInfo = ref<Info>({ height: 0, width: 0, x: 0, y: 0 })
const eventLayerEl = shallowRef<HTMLDivElement | null>(null)
const eventLayerRef = shallowRef<ComponentExposed<typeof EMapEventLayer> | null>(null)

const zoomNum = ref(props.zoom)
const maxZoom = ref(props.maxZoom)
const minZoom = ref(props.minZoom)
const zoomRatio = ref(1)
const zoomChangePoint = ref<Point>(useResetPoint())

const animationEasingTime = ref(0)
const animationEasingFunction = computed(() => easingFunctions[props.animation.easingFunction])
const sourceTransitionZoom = ref(0)

// Queue for the animation steps
const steps = ref<Function[]>([])

const { canvasCtx, clear } = useCanvas(
  canvasEl,
  {
    dpi: pixelRatio,
    height: canvasLayerHeight,
    width: canvasLayerWidth,
  },
)

const getZoomImageSize = computed<Size>(() => ({
  height: imageInfo.value.height * zoomNum.value,
  width: imageInfo.value.width * zoomNum.value,
}))

const controls = useRafFn(async () => {
  await frame()
}, { immediate: false })

/**
 * Control animation frame.
 */
async function frame() {
  const tasks: Function[] = [...toValue(steps.value)]
  steps.value.length = 0

  if (!tasks.length) {
    controls.pause()
    return
  }

  for (const task of tasks)
    await task()
}

/**
 * Check if a redraw is necessary.
 */
function isRedrawNotNeeded(zoom: number): boolean {
  return zoom === zoomNum.value
}

/**
 * Sets the zoom of the map.
 */
function setZoom(zoom: number, point?: Point): void {
  if (!props.zoomControl)
    throw new Error('Zoom control is disabled')

  const newZoom = Math.max(minZoom.value, Math.min(zoom, maxZoom.value))

  if (isRedrawNotNeeded(newZoom))
    return

  const preZoom = zoomNum.value

  const imageCenterX = imageInfo.value.x + imageInfo.value.width * preZoom / 2
  const imageCenterY = imageInfo.value.y + imageInfo.value.height * preZoom / 2

  const changePointX = point ? point.x : imageCenterX
  const changePointY = point ? point.y : imageCenterY

  sourceTransitionZoom.value = preZoom
  zoomChangePoint.value = {
    x: changePointX,
    y: changePointY,
  }

  animationRedraw(
    {
      nextZoom: newZoom,
      sourceZoom: preZoom,
    },
    {
      ...zoomChangePoint.value,
    },
  )
}

/**
 * Calculate the offset from the center of the image.
 */
function processOffset() {
  const { height, width } = getZoomImageSize.value

  const { offsetX, offsetY } = centerOffset(
    canvasLayerWidth.value,
    canvasLayerHeight.value,
    width,
    height,
  )

  imageInfo.value.x = offsetX
  imageInfo.value.y = offsetY
}

/**
 * Redraw the canvas.
 */
function redraw(zoom: number) {
  if (canvasCtx.value == null || imageCache.value == null)
    return

  steps.value.push(() => {
    if (canvasCtx.value == null || imageCache.value == null)
      return

    const { height: imageHeight, width: imageWidth, x, y } = imageInfo.value

    clear()

    canvasCtx.value.save()

    canvasCtx.value.translate(x, y)

    canvasCtx.value.scale(zoom, zoom)

    canvasCtx.value.drawImage(imageCache.value, 0, 0, imageWidth, imageHeight)

    canvasCtx.value.restore()
  })
}

async function transitionRedraw(zoom: Zoom, targetPoint: Point, firstRender: boolean, finished: boolean = false) {
  const { animation } = props
  const { nextZoom, sourceZoom } = zoom

  // 60 for 60 fps, 0.001 for milli's
  const animationFps = fps.value || 60
  const animationSpeed
        = 1 / (animationFps * animation.duration * 0.001) || 1 / animationFps

  animationEasingTime.value += animationSpeed
  animationEasingTime.value = finished ? 1.0 : animationEasingTime.value

  const progress = animationEasingFunction.value(animationEasingTime.value)

  if (animationEasingTime.value >= 1)
    animationEasingTime.value = 1

  const { height: imageHeight, width: imageWidth } = imageInfo.value

  const newZoom = sourceZoom + (nextZoom - sourceZoom) * progress
  zoomRatio.value = newZoom / zoomNum.value

  const newZoomImageWidth = imageWidth * newZoom
  const newZoomImageHeight = imageHeight * newZoom

  imageInfo.value.x = targetPoint.x - (newZoomImageWidth) / 2
  imageInfo.value.y = targetPoint.y - (newZoomImageHeight) / 2


  sourceTransitionZoom.value = newZoom
  zoomNum.value = newZoom

  redraw(newZoom)

  if (!firstRender)
    await sleep(6)

  if (finished) {
    sourceTransitionZoom.value = 0
    animationEasingTime.value = 0
    return
  }

  animationRedraw(zoom, targetPoint, false)
}

async function animationRedraw(zoom: Zoom, targetPoint: Point, firstRender: boolean = true) {
  const { animation } = props

  // if the time is set to 0, don't do an animation
  if (!animation || animation.duration === 0) {
    redraw(zoomNum.value)
  }
  else {
    // forcefully complete the old animation if it was still running
    // by setting easingtime to 1, we finish the animation.
    await transitionRedraw(zoom, targetPoint, firstRender, animationEasingTime.value === 1)
  }
}

/**
 * Reset the map to the initital zoom.
 */
function reset() {
  if (isRedrawNotNeeded(props.zoom))
    return

  clear()
  processOffset()
  setZoom(props.zoom)
  eventLayerRef.value?.reset()
}

/**
 * Add a step to the animation queue.
 */
watchDeep(steps, () => {
  controls.pause()
  controls.resume()
})

onMounted(async () => {
  const img = isString(props.img) ? await loadImage(props.img) : props.img

  imageInfo.value.width = img.naturalWidth
  imageInfo.value.height = img.naturalHeight
  imageCache.value = img

  await until(canvasLayerWidth).toMatch(v => v > 0)
  await until(canvasLayerHeight).toMatch(v => v > 0)

  steps.value.push(() => {
    processOffset()

    const { height: imageHeight, width: imageWidth, x, y } = imageInfo.value

    canvasCtx.value!.drawImage(imageCache.value!, x, y, imageWidth, imageHeight)

    setZoom(zoomNum.value)
  })
})

provideEMapContext({
  eventLayerEl,
  imageInfo,
  zoomChangePoint,
  zoomNum,
  zoomRatio,
})

defineExpose({
  reset,
  setZoom,
  zoomNum,
})
</script>

<template>
  <EMapOverlay :img-height="imageInfo.height" :img-width="imageInfo.width" :zoom="minZoom">
    <div position="absolute inset-0" ref="canvasLayerEl" z0>
      <canvas :height="canvasLayerHeight" :width="canvasLayerWidth" position="absolute top-0 left-0" ref="canvasEl" select-none />
    </div>

    <template #event>
      <EMapEventLayer :draggable @on-refresh="redraw(zoomNum)" ref="eventLayerRef">
        <slot />
      </EMapEventLayer>
    </template>
  </EMapOverlay>
</template>
