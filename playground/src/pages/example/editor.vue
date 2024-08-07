<script setup lang="ts">
import type { ComponentExposed } from 'vue-component-type-helpers'

import { Editor, Shape, ToolBar } from '@airataiwan/editor'

const EditorRef = shallowRef<ComponentExposed<typeof Editor> | null>(null)
</script>

<template>
  <div grid="~ place-items-center" h-full w-full>
    <div position="fixed top-20 left-20">
      <div flex="~ col gap-2">
        <p>
          {{ EditorRef?.historyShape }}
        </p>
        <p>
          {{ EditorRef?.points }}
        </p>
      </div>
    </div>

    <div border="~ warmGray" class="w50% h80% " pos-relative rounded-lg>
      <Editor
        ref="EditorRef"
        :shape="Shape.LineWithArrow"
        :rect-options="{
          strokeStyle: 'red',
          lineWidth: 50,
        }"
        :line-options="{
          lineWidth: 10,
        }"
        :line-with-arrow-options="{
          lineWidth: 10,
          isAbove: true,
        }"
      >
        <template #tool>
          <ToolBar />
        </template>
      </Editor>
    </div>
  </div>
</template>
