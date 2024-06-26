<script setup lang="ts">
import { onMounted, ref, shallowRef, toValue } from 'vue'
import { useDevicePixelRatio, useElementSize, useRafFn } from '@vueuse/core'
import { isString } from '@antfu/utils'

import type { Size } from '@vue-emap/utils'
import { initCanvas, loadImage } from '@vue-emap/utils'

import { Overlayview } from '../../OverlayView'

import { Eventview } from '../../EventView'
import type { EMapProps } from './types'

const props = withDefaults(defineProps<EMapProps>(), {
  zoomControl: false,
})

const { pixelRatio } = useDevicePixelRatio()

const canvasLayerEl = shallowRef<HTMLDivElement | null>(null)
const { width, height } = useElementSize(canvasLayerEl)

const canvasEl = shallowRef<HTMLCanvasElement | null>(null)
const imgSize = shallowRef<Size>({ width: 0, height: 0 })
const minZoom = ref(1)

const steps = ref<Function[]>([])

const controls = useRafFn(frame, { immediate: false })

function frame() {
  const tasks: Function[] = [...toValue(steps.value)]
  steps.value = []

  if (!tasks.length)
    controls.pause()

  tasks.forEach(i => i())
}

onMounted(async () => {
  const canvas = canvasEl.value!
  const { ctx } = initCanvas(canvas, width.value, height.value, pixelRatio.value)
  const img = isString(props.img) ? await loadImage(props.img) : props.img

  imgSize.value = { width: img.naturalWidth, height: img.naturalHeight }

  steps.value.push(() => {
    ctx.drawImage(img, 0, 0)
  })

  controls.pause()
  controls.resume()
})
</script>

<template>
  <Overlayview :img-width="imgSize.width" :img-height="imgSize.height" :zoom="minZoom">
    <div ref="canvasLayerEl" position="absolute inset-0" z0>
      <canvas ref="canvasEl" position="absolute top-0 left-0" w-full h-full select-none />
    </div>

    <template #object>
      object
    </template>

    <template #event>
      <Eventview />
    </template>
  </Overlayview>
</template>
