<script lang="ts">
interface EMapEventLayerProps {
  draggable: EMapOptions['draggable']
}

export type EMapEventLayerEmits = {
  onRefresh: []
}
</script>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEventListener, usePointer } from '@vueuse/core'

import { type Point, useResetPoint } from '@vue-emap/utils'

import type { EMapOptions } from './types'

import { injectEMapContext } from './EMap.vue'

const props = defineProps<EMapEventLayerProps>()
const emits = defineEmits<EMapEventLayerEmits>()

const { eventLayerEl, imageInfo } = injectEMapContext()

const eventLayerCursor = ref<'default' | 'grab' | 'grabbing'>('default')

const clickOffset = ref<Point>(useResetPoint())
const translate = ref<Point>(useResetPoint())

const { x, y, pressure, isInside } = usePointer({
  target: eventLayerEl,
})

if (props.draggable) {
  watch([x, y, pressure, isInside], ([curX, curY, curPressure, curIsside], [preX, preY, _prePressure, preIsInside]) => {
    if (preIsInside !== curIsside && curIsside === false)
      dragEnd()

    if (curPressure <= 0)
      return

    eventLayerCursor.value = 'grabbing'

    const dragOffsetX = curX - preX
    const dragOffsetY = curY - preY

    translate.value.x += dragOffsetX
    translate.value.y += dragOffsetY
    imageInfo.value.x += dragOffsetX
    imageInfo.value.y += dragOffsetY

    emits('onRefresh')
  })
}

function dragEnd() {
  eventLayerCursor.value = 'default'

  useResetPoint([clickOffset, translate])
}

useEventListener(eventLayerEl, 'pointerup', dragEnd)
</script>

<template>
  <div
    ref="eventLayerEl" position="absolute inset-0" w-full h-full m0 p0 b-0 z3
    :style="{
      cursor: eventLayerCursor,

    }"
  >
    <div
      position="absolute inset-0" w-full will-change-transform
      :style="{
        translate: `${translate.x}px ${translate.y}px`,
      }"
    >
      <slot />
    </div>
  </div>
</template>
