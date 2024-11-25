<script setup lang="ts">
import type { History } from '@airataiwan/editor'
import type { ComponentExposed } from 'vue-component-type-helpers'

import { Action, Editor, Shape, ToolBar } from '@airataiwan/editor'

const EditorRef = shallowRef<ComponentExposed<typeof Editor> | null>(null)

const strokeStyle = ref('red')
const fillStyle = ref('red')
const isAbove = ref(true)

const img = computed(() => `https://fakeimg.pl/800x800/?retina=1&text=Example&font=noto`)

function handleChangeColor() {
  strokeStyle.value = isAbove.value ? 'blue' : 'red'
  fillStyle.value = isAbove.value ? 'blue' : 'red'
  isAbove.value = !isAbove.value
}

function handleChangeDirection() {
  isAbove.value = !isAbove.value
}

const historyShape = ref<History[]>([
  {
    id: 'GpsrKcX_O9L_1LPUreWKn',
    options: { lineWidth: 50, strokeStyle: 'red' },
    points: [{ x: 69.3671875, y: 192.47265625 }, { x: 726.56640625, y: 715.05078125 }],
    type: Shape.Rect,
  },
])
</script>

<template>
  <div grid="~ place-items-center" h-full w-full>
    <div w-full h-full flex="~ items-center gap-6">
      <div h-full pt-20 px-4 flex="~ col gap-y-2" class="w25% ">
        <p>
          {{ EditorRef?.historyShape }}
        </p>
        <p>
          {{ EditorRef?.points }}
        </p>
      </div>

      <div>
        <div rounded-lg>
          <Editor
            ref="EditorRef"
            :history-shape
            border="~ warmGray"
            mxa
            :max-width="800"
            :max-height="800"
            allow-backspace-delete
            :img
            :shape="Shape.Rect"
            :action="Action.Default"
            :rect-options="{
              lineWidth: 50,
              strokeStyle,
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

        <div flex="~ items-center gap-4" mt-6>
          <button w-fit btn @click="handleChangeColor">
            Change Color
          </button>

          <button w-fit btn @click="EditorRef?.reset">
            Clear Shape
          </button>

          <button w-fit btn @click="handleChangeDirection">
            Change Direction
          </button>

          <button w-fit btn :disabled="EditorRef?.historyShape.length === 0" @click="EditorRef?.setControlator(EditorRef.historyShape[0].id)">
            Set Controlator
          </button>
        </div>
      </div>

      <div class="w25%" />
    </div>
  </div>
</template>
