<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'

import type { Point } from '@vue-emap/utils'

import { injectEMapContext } from '../emap/EMap.vue'
import { injectEMapEventContext } from '../emap/EMapEventLayer.vue'

import type { MarkerOptions } from './types'

const props = withDefaults(defineProps<MarkerOptions>(), {
  position: () => ({ x: 500, y: 300 }),
})

const { zoomNum, zoomRatio, zoomChangePoint } = injectEMapContext()
const { translate } = injectEMapEventContext()

const position = ref<Point>({ ...props.position })

// drag
watchEffect(() => {
  position.value.x = props.position.x + translate.value.x
  position.value.y = props.position.y + translate.value.y
})

// zoom
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
    pos-absolute block op100 z0
    :style="{
      top: `${position.y}px`,
      left: `${position.x}px`,
    }"
  >
    <slot>
      I am a marker
    </slot>
  </div>
</template>
