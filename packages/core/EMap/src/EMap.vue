<script lang="ts">
import { centerOffset, createContext, loadImage, useCanvas } from '@vue-emap/utils'

export interface EMapContext {
  eventLayerEl: ShallowRef<HTMLDivElement | null>
  imageInfo: ShallowRef<Info>
}

export const [injectEMapContext, provideEMapContext]
  = createContext<EMapContext>('EMapContext')
</script>

<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, toValue } from 'vue'
import { until, useDevicePixelRatio, useElementSize, useRafFn, watchDeep } from '@vueuse/core'

import type { ShallowRef } from 'vue'
import type { Info, Point, Size } from '@vue-emap/utils'

import { isString } from '@antfu/utils'

import EMapEventLayer from './EMapEventLayer.vue'
import EMapOverlay from './EMapOverlay.vue'

import type { EMapOptions } from './types'

const props = withDefaults(defineProps<EMapOptions>(), {
  maxZoom: 5,
  minZoom: 0.5,
  zoom: 1,
  zoomControl: true,
  draggable: true,
})

const { pixelRatio } = useDevicePixelRatio()

const canvasLayerEl = shallowRef<HTMLDivElement | null>(null)
const { width: canvasLayerWidth, height: canvasLayerHeight } = useElementSize(canvasLayerEl)

const canvasEl = shallowRef<HTMLCanvasElement | null>(null)
const imageCache = shallowRef<HTMLImageElement | null>(null)
const imageInfo = shallowRef<Info>({ x: 0, y: 0, width: 0, height: 0 })
const eventLayerEl = shallowRef<HTMLDivElement | null>(null)

const zoomNum = ref(props.zoom)
const maxZoom = ref(props.maxZoom)
const minZoom = ref(props.minZoom)

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

const controls = useRafFn(frame, { immediate: false })

/**
 * Control animation frame.
 */
function frame() {
  const tasks: Function[] = [...toValue(steps.value)]
  steps.value.length = 0

  if (!tasks.length)
    controls.pause()

  tasks.forEach(i => i())
}

/**
 * Sets the zoom of the map.
 */
function setZoom(zoom: number, point?: Point, resetPos: boolean = false): void {
  if (!props.zoomControl)
    throw new Error('Zoom control is disabled')

  const { x, y, width, height } = imageInfo.value

  const newZoom = Math.max(minZoom.value, Math.min(zoom, maxZoom.value))

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

  // const preZoom = zoomNum.value
  zoomNum.value = newZoom

  if (resetPos)
    processOffset()

  refresh()

  // this.trigger(ZOOMCHANGED, preZoom, {
  //   x: changePointX,
  //   y: changePointY,
  // })
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
 * Refresh the canvas.
 */
function refresh() {
  if (canvasCtx.value == null || imageCache.value == null)
    return

  // this.trigger(DRAWSTART)

  steps.value.push(() => {
    if (canvasCtx.value == null || imageCache.value == null)
      return

    const { x, y, width: imageWidth, height: imageHeight } = imageInfo.value

    clear()

    canvasCtx.value.save()

    canvasCtx.value.translate(x, y)

    canvasCtx.value.scale(zoomNum.value, zoomNum.value)

    canvasCtx.value.drawImage(imageCache.value, 0, 0, imageWidth, imageHeight)

    canvasCtx.value.restore()
  })

  // this.trigger(DRAWEND)
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

    setZoom(zoomNum.value)
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
      <EMapEventLayer :draggable @on-refresh="refresh" />
    </template>
  </EMapOverlay>
</template>
