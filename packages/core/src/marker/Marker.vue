<script setup lang="ts">
import { ref, watchEffect } from 'vue'

import type { Point } from '@vue-emap/utils'

import { injectEMapEventContext } from '../emap/EMapEventLayer.vue'

import type { MarkerOptions } from './types'

const props = withDefaults(defineProps<MarkerOptions>(), {
  position: () => ({ x: 500, y: 300 }),
})

const { translate } = injectEMapEventContext()

const position = ref<Point>({ ...props.position })

// drag
watchEffect(() => {
  position.value.x = props.position.x + translate.value.x
  position.value.y = props.position.y + translate.value.y
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
