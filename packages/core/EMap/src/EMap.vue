<script lang="ts">
import { ANIMATION_EASE_IN_OUT_QUAD, centerOffset, createContext, easingFunctions, loadImage, useCanvas } from '@vue-emap/utils'

export interface EMapContext {
  eventLayerEl: ShallowRef<HTMLDivElement | null>
  imageInfo: ShallowRef<Info>
}

export const [injectEMapContext, provideEMapContext]
  = createContext<EMapContext>('EMapContext')
</script>

<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, toValue } from 'vue'
import { until, useDevicePixelRatio, useElementSize, useFps, useRafFn, watchDeep } from '@vueuse/core'

import type { ShallowRef } from 'vue'
import type { Info, Point, Size } from '@vue-emap/utils'

import { isString, sleep } from '@antfu/utils'

import EMapEventLayer from './EMapEventLayer.vue'
import EMapOverlay from './EMapOverlay.vue'

import type { EMapOptions } from './types'

const props = withDefaults(defineProps<EMapOptions>(), {
  maxZoom: 5,
  minZoom: 0.5,
  zoom: 1,
  zoomControl: true,
  draggable: true,
  animation: () => ({
    duration: 1000,
    // TODO: it should can be string
    easingFunction: ANIMATION_EASE_IN_OUT_QUAD,
  }),
})

const { pixelRatio } = useDevicePixelRatio()
const fps = useFps()

const canvasLayerEl = shallowRef<HTMLDivElement | null>(null)
const { width: canvasLayerWidth, height: canvasLayerHeight } = useElementSize(canvasLayerEl)

const canvasEl = shallowRef<HTMLCanvasElement | null>(null)
const imageCache = shallowRef<HTMLImageElement | null>(null)
const imageInfo = shallowRef<Info>({ x: 0, y: 0, width: 0, height: 0 })
const eventLayerEl = shallowRef<HTMLDivElement | null>(null)

const zoomNum = ref(props.zoom)
const maxZoom = ref(props.maxZoom)
const minZoom = ref(props.minZoom)

const animationSpeed = ref(1)
const animationEasingTime = ref(0)
const animationEasingFunction = computed(() => easingFunctions[props.animation.easingFunction])

const steps = ref<Function[]>([])

const { canvasCtx, canvasCenterPoint, clear } = useCanvas(
  canvasEl,
  {
    width: canvasLayerWidth,
    height: canvasLayerHeight,
    dpi: pixelRatio,
  },
)

const getZoomImageSize = computed<Size>(() => ({
  width: imageInfo.value.width * zoomNum.value,
  height: imageInfo.value.height * zoomNum.value,
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
 * Sets the zoom of the map.
 */
function setZoom(zoom: number, point: Point = {
  x: canvasCenterPoint.value.x,
  y: canvasCenterPoint.value.y,
}, resetPos: boolean = false): void {
  if (!props.zoomControl)
    throw new Error('Zoom control is disabled')

  const newZoom = Math.max(minZoom.value, Math.min(zoom, maxZoom.value))

  const { x, y, width, height } = imageInfo.value

  const scaleChange = newZoom / zoomNum.value

  /**
   * Zoom in or out from the specified point.
   * If no point is specified, zoom from the center of the canvas.
   */
  const changePoint = {
    x: point ? point.x : canvasCenterPoint.value.x,
    y: point ? point.y : canvasCenterPoint.value.y,
  }

  /**
   * Current center point of the image
   */
  const imageCenterPoint = {
    x: x + getZoomImageSize.value.width / 2,
    y: y + getZoomImageSize.value.height / 2,
  }

  const newImageCenterX = (imageCenterPoint.x - changePoint.x) * scaleChange + changePoint.x
  const newImageCenterY = (imageCenterPoint.y - changePoint.y) * scaleChange + changePoint.y

  imageInfo.value.x = newImageCenterX - (width * newZoom) / 2
  imageInfo.value.y = newImageCenterY - (height * newZoom) / 2

  if (resetPos)
    processOffset()

  const preZoom = zoomNum.value
  zoomNum.value = newZoom

  // redraw()
  animationRedraw(preZoom)
}

/**
 * Calculate the offset from the center of the image.
 */
function processOffset() {
  const { width, height } = getZoomImageSize.value

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

    const { x, y, width: imageWidth, height: imageHeight } = imageInfo.value

    clear()

    canvasCtx.value.save()

    canvasCtx.value.translate(x, y)

    canvasCtx.value.scale(zoom, zoom)

    canvasCtx.value.drawImage(imageCache.value, 0, 0, imageWidth, imageHeight)

    canvasCtx.value.restore()
  })
}

async function transitionRedraw(sourceZoom: number, firstRender: boolean = true, finished: boolean = false) {
  animationEasingTime.value += animationSpeed.value
  animationEasingTime.value = finished ? 1.0 : animationEasingTime.value

  const progress = animationEasingFunction.value(animationEasingTime.value)

  if (animationEasingTime.value >= 1)
    animationEasingTime.value = 1

  redraw(sourceZoom + (zoomNum.value - sourceZoom) * progress)

  if (!firstRender)
    await sleep(10)

  if (sourceZoom === zoomNum.value)
    return

  if (!finished)
    animationRedraw(sourceZoom, false)
}

async function animationRedraw(sourceZoom: number, firstRender?: boolean) {
  const { animation } = props
  // if the time is set to 0, don't do an animation
  if (!animation || animation.duration === 0) {
    redraw(zoomNum.value)
  }
  else {
    // 60 for 60 fps, 0.001 for milli's
    const animationFps = fps.value || 60
    animationSpeed.value
        = 1 / (animationFps * animation.duration * 0.001) || 1 / animationFps

    // forcefully complete the old animation if it was still running
    // by setting easingtime to 1, we finish the animation.
    await transitionRedraw(sourceZoom, firstRender, animationEasingTime.value === 1)
  }
}

/**
 * Reset the map to the initital zoom.
 */
function reset() {
  clear()
  processOffset()
  setZoom(props.zoom)

  // this.trigger(RESET)
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

    const { x, y, width: imageWidth, height: imageHeight } = imageInfo.value

    canvasCtx.value!.drawImage(imageCache.value!, x, y, imageWidth, imageHeight)

    // setZoom(zoomNum.value)
  })
})

provideEMapContext({
  eventLayerEl,
  imageInfo,
})

defineExpose({
  zoomNum,
  setZoom,
  reset,
})
</script>

<template>
  <EMapOverlay :img-width="imageInfo.width" :img-height="imageInfo.height" :zoom="minZoom">
    <div ref="canvasLayerEl" position="absolute inset-0" z0>
      <canvas ref="canvasEl" position="absolute top-0 left-0" select-none :width="canvasLayerWidth" :height="canvasLayerHeight" />
    </div>

    <template #event>
      <EMapEventLayer :draggable @on-refresh="redraw(zoom)" />
    </template>
  </EMapOverlay>
</template>
