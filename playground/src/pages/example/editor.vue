<script setup lang="ts">
import { Editor, Shape, ToolBar } from '@airataiwan/editor'
</script>

<template>
  <div grid="~ place-items-center" h-full w-full>
    <div h-100 pos-relative w-100>
      <Editor :shape="Shape.LineWithArrow">
        <template #tool>
          <ToolBar />
        </template>
      </Editor>
    </div>
  </div>
</template>
