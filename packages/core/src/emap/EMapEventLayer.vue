<script lang="ts">
import { type Point, createContext, useResetPoint } from '@vue-emap/utils'

interface EMapEventLayerProps {
  draggable: EMapOptions['draggable']
}

export type EMapEventLayerEmits = {
  onRefresh: []
}

export interface EMapEventContext {
  translate: Ref<Point>
}

export const [injectEMapEventContext, provideEMapEventContext]
  = createContext<EMapEventContext>('EMapContext')
</script>

<script setup lang="ts">
import type { Ref } from 'vue'

import { usePointer } from '@vueuse/core'
import { ref, watch } from 'vue'

import type { EMapOptions } from './types'

import { injectEMapContext } from './EMap.vue'

const props = defineProps<EMapEventLayerProps>()
const emits = defineEmits<EMapEventLayerEmits>()

const { eventLayerEl, imageInfo } = injectEMapContext()

const eventLayerCursor = ref<'default' | 'grab' | 'grabbing'>('default')

const isDragging = ref(false)
const translate = ref<Point>(useResetPoint())

const { pressure, x, y } = usePointer({
  target: eventLayerEl,
})

if (props.draggable) {
  watch([x, y, pressure], ([curX, curY, curPressure], [preX, preY, _prePressure]) => {
    if (!isDragging.value)
      return

    if (curPressure <= 0 || preX === 0 || preY === 0)
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

function dragStart() {
  isDragging.value = true

  eventLayerCursor.value = 'grab'
}

function dragEnd() {
  eventLayerCursor.value = 'default'
}

provideEMapEventContext({
  translate,
})
</script>

<template>
  <div
    :style="{
      cursor: eventLayerCursor,

    }" @pointerdown="dragStart" @pointerleave="dragEnd" @pointerup="dragEnd" ref="eventLayerEl" b-0 h-full m0
    p0
    pos-absolute
    w-full
    z3
  >
    <div
      position="absolute top-0 left-0" @click.stop @dblclick.stop
      @mousedown.stop
      @pointerdown.stop
      w-full
      will-change-transform
    >
      <div
        position="absolute top-0 left-0" w-full z104
      >
        <slot />
      </div>
    </div>
  </div>
</template>
