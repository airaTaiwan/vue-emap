<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  imgWidth: number
  imgHeight: number
  zoom: number
}>()

const size = computed(() => ({
  minWidth: props.imgWidth * props.zoom,
  minHeight: props.imgHeight * props.zoom,
}))
</script>

<template>
  <div w-full h-full pos-relative overflow-hidden>
    <div position="absolute inset-0" w-full h-full m-0 p-0 b-0 :style="size">
      <slot />
    </div>
  </div>
</template>
