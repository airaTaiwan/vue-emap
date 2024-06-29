<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  imgWidth: number
  imgHeight: number
  zoom: number
}>()

const size = computed(() => ({
  minWidth: `${props.imgWidth * props.zoom}px`,
  minHeight: `${props.imgHeight * props.zoom}px`,
}))
</script>

<template>
  <div w-full h-full pos-relative overflow-hidden>
    <div position="absolute inset-0" w-full h-full m-0 p-0 b-0 :style="size">
      <div position="absolute inset-0" w-full z-1>
        <slot />
      </div>
      <div
        position="absolute top-0 left-0" w-full will-change-transform z-103
        :style="{
          transform: 'translate(0px, 0px)',
        }"
      >
        <slot name="object" />
      </div>
    </div>
    <slot name="event" />
  </div>
</template>
