<script setup lang="ts">
defineEmits<{
  onZoomIn: []
  onZoomOut: []
  onReset: []
  onDestroy: []
}>()
</script>

<template>
  <div position="fixed bottom-5 right-5" flex="~ col gap-2">
    <slot />

    <slot name="base">
      <button icon-btn @click="$emit('onZoomIn')">
        <div i="carbon-zoom-in" />
      </button>
      <button icon-btn @click="$emit('onZoomOut')">
        <div i="carbon-zoom-out" />
      </button>
      <button icon-btn @click="$emit('onReset')">
        <div i="carbon-reset" />
      </button>
    </slot>
  </div>
</template>
