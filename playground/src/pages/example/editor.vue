<script setup lang="ts">
import type { ComponentExposed } from 'vue-component-type-helpers'

import { Editor, Shape, ToolBar } from '@airataiwan/editor'

const EditorRef = shallowRef<ComponentExposed<typeof Editor> | null>(null)

const strokeStyle = ref('red')
const fillStyle = ref('red')
const isAbove = ref(true)

function handleChangeColor() {
  strokeStyle.value = isAbove.value ? 'blue' : 'red'
  fillStyle.value = isAbove.value ? 'blue' : 'red'
  isAbove.value = !isAbove.value
}
</script>

<template>
  <div grid="~ place-items-center" h-full w-full>
    <div fixed top-40 left-40 btn>
      <button @click="handleChangeColor">
        Change Color
      </button>
    </div>
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
          strokeStyle,
          lineWidth: 50,
        }"
        :line-with-arrow-options="{
          lineWidth: 10,
          isAbove,
          strokeStyle,
          fillStyle,
        }"
      >
        <template #tool>
          <ToolBar />
        </template>
      </Editor>
    </div>
  </div>
</template>
