<script setup lang="ts">
defineEmits<{
  onZoomIn: []
  onZoomOut: []
  onReset: []
  onDestroy: []
}>()
</script>

<template>
  <div flex="~ col gap-2" position="fixed bottom-5 right-5">
    <slot />

    <slot name="base">
      <button @click="$emit('onZoomIn')" icon-btn>
        <div i="carbon-zoom-in" />
      </button>
      <button @click="$emit('onZoomOut')" icon-btn>
        <div i="carbon-zoom-out" />
      </button>
      <button @click="$emit('onReset')" icon-btn>
        <div i="carbon-reset" />
      </button>
    </slot>
  </div>
</template>
