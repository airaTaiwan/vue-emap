<script setup lang="ts">
defineEmits<{
  onDestroy: []
  onReset: []
  onZoomIn: []
  onZoomOut: []
}>()
</script>

<template>
  <div flex="~ col gap-2" position="fixed bottom-5 right-5">
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
