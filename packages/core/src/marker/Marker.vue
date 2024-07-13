<script setup lang="ts">
import { isNumber, isString } from '@antfu/utils'
import { type Point, useBaseSetup, useDrag } from '@vue-emap/utils'
import { useElementSize } from '@vueuse/core'
import { computed, h, onMounted, ref, shallowRef, watch } from 'vue'

import type { MarkerOptions } from './types'

import { injectEMapContext } from '../emap/EMap.vue'
import { injectEMapEventContext } from '../emap/EMapEventLayer.vue'

const props = withDefaults(defineProps<MarkerOptions>(), {
  draggable: true,
  originX: 'center',
  originY: 'center',
  position: () => ({ x: 500, y: 300 }),
})

const { eventLayerEl, zoomChangePoint, zoomNum, zoomRatio } = injectEMapContext()
const { mouseX, mouseY, translate } = injectEMapEventContext()

const position = ref<Point>(props.position)

useBaseSetup(position, {
  translate,
  zoomChangePoint,
  zoomNum,
  zoomRatio,
})

const el = shallowRef<HTMLDivElement | null>(null)
const { height, width } = useElementSize(el)

useDrag(el, (offsetX, offsetY) => {
  position.value.x += offsetX
  position.value.y += offsetY
}, {
  draggable: props.draggable,
  eventLayerEl,
  mouseX,
  mouseY,
})

const markerPosOnMap = computed(() => {
  const x = props.originX === 'center'
    ? position.value.x - width.value / 2
    : props.originX === 'right'
      ? position.value.x - width.value
      : position.value.x
  const y = props.originY === 'center'
    ? position.value.y - height.value / 2
    : props.originY === 'bottom'
      ? position.value.y - height.value
      : position.value.y

  return {
    x: x.toFixed(2),
    y: y.toFixed(2),
  }
})

// Update Data
watch(() => props.position, (newPosition) => {
  position.value = { ...newPosition }
})
</script>

<template>
  <div
    :style="{
      top: `${markerPosOnMap.y}px`,
      left: `${markerPosOnMap.x}px`,
    }"
    class="marker"
    ref="el"
    block op100 pos-absolute z0
  >
    <slot>
      I am a marker
    </slot>
  </div>
</template>
