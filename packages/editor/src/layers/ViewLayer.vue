<script setup lang="ts">
import { injectEditorContext } from '../EditorLayer.vue'

defineProps<{
  height: number
  width: number
}>()

const { viewCanvasEl } = injectEditorContext()
</script>

<template>
  <canvas ref="viewCanvasEl" :height :width position="absolute top-0 left-0" select-none z1 />
  <slot />
</template>
