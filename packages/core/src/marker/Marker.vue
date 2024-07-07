<script setup lang="ts">
import type { Point } from '@vue-emap/utils'

import { useElementSize } from '@vueuse/core'
import { computed, ref, shallowRef, watch, watchEffect } from 'vue'

import type { MarkerOptions } from './types'

import { injectEMapContext } from '../emap/EMap.vue'
import { injectEMapEventContext } from '../emap/EMapEventLayer.vue'

const props = withDefaults(defineProps<MarkerOptions>(), {
  originX: 'center',
  originY: 'center',
  position: () => ({ x: 500, y: 300 }),
})

const { zoomChangePoint, zoomNum, zoomRatio } = injectEMapContext()
const { translate } = injectEMapEventContext()

const el = shallowRef<HTMLDivElement | null>(null)
const { height, width } = useElementSize(el)

const position = ref<Point>({ ...props.position })

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

// map drag
watchEffect(() => {
  position.value.x = props.position.x + translate.value.x
  position.value.y = props.position.y + translate.value.y
})

// map zoom
watch(zoomNum, () => {
  const { x, y } = position.value
  const { x: zoomChangePointX, y: zoomChangePointY } = zoomChangePoint.value

  const deltaX = (x - zoomChangePointX) * zoomRatio.value
  const deltaY = (y - zoomChangePointY) * zoomRatio.value

  position.value.x = zoomChangePointX + deltaX
  position.value.y = zoomChangePointY + deltaY
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
