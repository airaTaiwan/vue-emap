<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  imgHeight: number
  imgWidth: number
  zoom: number
}>()

const size = computed(() => ({
  minHeight: `${props.imgHeight * props.zoom}px`,
  minWidth: `${props.imgWidth * props.zoom}px`,
}))
</script>

<template>
  <div h-full overflow-hidden pos-relative w-full>
    <div :style="size" b-0 h-full m0 p0 position="absolute inset-0" w-full z0>
      <div position="absolute inset-0" w-full z-1>
        <slot />
      </div>
      <div
        :style="{
          transform: 'translate(0px, 0px)',
        }" position="absolute inset-0" w-full will-change-transform
        z103
      >
        <slot name="object" />
      </div>
    </div>
    <slot name="event" />
  </div>
</template>
