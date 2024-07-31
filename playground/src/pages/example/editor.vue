<script setup lang="ts">
import { Editor, Shape, ToolBar } from '@vue-emap/editor'
</script>

<template>
  <Editor :shape="Shape.LineWithArrow">
    <template #tool>
      <ToolBar />
    </template>
  </Editor>
</template>
