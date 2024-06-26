<script setup lang="ts">
import { computed } from 'vue'
import ViewLayer from './ViewLayer.vue'
import ObjectView from './ObjectView.vue'

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
      <ViewLayer>
        <slot />
      </ViewLayer>
      <ObjectView>
        <slot name="object" />
      </ObjectView>
    </div>
    <slot name="event" />
  </div>
</template>
