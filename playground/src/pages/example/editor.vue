<script setup lang="ts">
import { Editor, Shape, ToolBar } from '@airataiwan/editor'
</script>

<template>
  <div grid="~ place-items-center" h-full w-full>
    <div border="~ warmGray" h-251 pos-relative rounded-lg w-250>
      <Editor :shape="Shape.LineWithArrow">
        <template #tool>
          <ToolBar />
        </template>
      </Editor>
    </div>
  </div>
</template>
