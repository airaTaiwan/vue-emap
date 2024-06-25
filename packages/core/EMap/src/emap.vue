<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDevicePixelRatio } from '@vueuse/core'
import { isString } from '@antfu/utils'

import type { Size } from '@vue-emap/utils'
import { initCanvas, loadImage } from '@vue-emap/utils'

import { Overlayview } from '../../OverlayView'

import type { EMapProps } from './types'

const props = withDefaults(defineProps<EMapProps>(), {
  width: 400,
  height: 400,
})

const { pixelRatio } = useDevicePixelRatio()

const el = ref<HTMLCanvasElement | null>(null)
const imgSize = ref<Size>({ width: 0, height: 0 })
const minZoom = ref(1)

onMounted(async () => {
  const canvas = el.value!
  const { width, height } = canvas
  const { ctx } = initCanvas(canvas, width, height, pixelRatio.value)
  const img = isString(props.img) ? await loadImage(props.img) : props.img

  imgSize.value = { width: img.naturalWidth, height: img.naturalHeight }

  ctx.drawImage(img, 0, 0)
})
</script>

<template>
  <Overlayview :img-width="imgSize.width" :img-height="imgSize.height" :zoom="minZoom">
    <canvas ref="el" :width :height />
  </Overlayview>
</template>
