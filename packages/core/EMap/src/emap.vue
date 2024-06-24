<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()
</script>

<template>
  <div btn>
    {{ modelValue }}
    <slot />
  </div>
</template>
