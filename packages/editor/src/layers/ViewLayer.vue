<script setup lang="ts">
import { injectEditorContext } from '../EditorLayer.vue'

const { viewCanvasEl } = injectEditorContext()
</script>

<template>
  <canvas ref="viewCanvasEl" position="absolute top-0 left-0" select-none z1 />
  <slot />
</template>
