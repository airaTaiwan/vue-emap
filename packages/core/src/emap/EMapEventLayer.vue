<script lang="ts">
import type { EMapEventContext, Point } from '@airataiwan/utils'

import { createContext, useResetPoint } from '@airataiwan/utils'
import { usePointer } from '@vueuse/core'
import { computed, ref, watch } from 'vue'

import { injectEMapContext } from './EMap.vue'

interface EMapEventLayerProps {
  draggable: EMapOptions['draggable']
}

export type EMapEventLayerEmits = {
  onRefresh: []
}

export const [injectEMapEventContext, provideEMapEventContext]
  = createContext<EMapEventContext>('EMapEvent')
</script>

<script setup lang="ts">
import type { EMapOptions } from './types'

const props = defineProps<EMapEventLayerProps>()
const emits = defineEmits<EMapEventLayerEmits>()

const { eventLayerEl, imageInfo, translate } = injectEMapContext()

const isDragging = ref(false)
const { pressure, x: mouseX, y: mouseY } = usePointer({ target: eventLayerEl })

watch([mouseX, mouseY, pressure], ([curX, curY, curPressure], [preX, preY, _prePressure]) => {
  if (eventLayerEl.value == null || !props.draggable || !isDragging.value)
    return

  if (curPressure <= 0 || preX === 0 || preY === 0)
    return

  eventLayerEl.value.style.cursor = 'grabbing'

  const dragOffsetX = curX - preX
  const dragOffsetY = curY - preY

  translate.value.x += dragOffsetX
  translate.value.y += dragOffsetY
  imageInfo.value.x += dragOffsetX
  imageInfo.value.y += dragOffsetY

  emits('onRefresh')
})


const eventLayerCursor = ref<'default' | 'grab' | 'grabbing'>('default')

function dragStart() {
  if (eventLayerEl.value == null)
    return

  isDragging.value = true

  eventLayerEl.value.style.cursor = 'grab'
}

function dragEnd() {
  if (eventLayerEl.value == null)
    return

  eventLayerEl.value.style.cursor = 'default'

  isDragging.value = false
}

function reset() {
  useResetPoint(translate)
}

provideEMapEventContext({
  mouseX,
  mouseY,
  translate: computed((): Point => JSON.parse(JSON.stringify(translate.value))),
})

defineExpose({
  reset,
})
</script>

<template>
  <div
    :style="{
      cursor: eventLayerCursor,
    }"
    @pointerdown="dragStart"
    @pointerleave="dragEnd"
    @pointerup="dragEnd"
    class="emap-event-layer" ref="eventLayerEl"
    b-0 h-full m0 p0 pos-absolute w-full z3
  >
    <div
      position="absolute top-0 left-0"
      @click.stop
      @dblclick.stop
      @mousedown.stop
      @pointerdown.stop
      w-full will-change-transform
    >
      <div
        position="absolute top-0 left-0" w-full z104
      >
        <slot />
      </div>
    </div>
  </div>
</template>
