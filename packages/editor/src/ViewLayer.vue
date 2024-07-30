<script setup lang="ts">
import { injectEditorContext } from './EditorLayer.vue'

defineProps<{
  width: number
  height: number
}>()

const { viewCanvasEl } = injectEditorContext()
</script>

<template>
  <canvas :height :width position="absolute top-0 left-0" ref="viewCanvasEl" select-none z1 />
  <slot />
</template>
