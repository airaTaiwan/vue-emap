<script setup lang="ts">
import { Editor, Shape, ToolBar } from '@airataiwan/editor'
</script>

<template>
  <div grid="~ place-items-center" h-full w-full>
    <div border="~ warmGray" class="w50% h80% " pos-relative rounded-lg>
      <Editor :shape="Shape.LineWithArrow">
        <template #tool>
          <ToolBar />
        </template>
      </Editor>
    </div>
  </div>
</template>
