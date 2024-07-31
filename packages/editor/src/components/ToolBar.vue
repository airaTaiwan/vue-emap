<script lang="ts">
import type { Shape } from '../types'

const iconList: Record<Shape, string> = {
  Line: 'i-mingcute:minimize-line',
  LineWithArrow: 'i-mingcute:align-arrow-right-line',
}
</script>

<script setup lang="ts">
import { injectEditorContext } from '../EditorLayer.vue'

const { shape } = injectEditorContext()

function handleShapeChange(key: Shape) {
  shape.value = key
}
</script>

<template>
  <div flex="~ justify-center" position="absolute top-4 inset-x-0" text-black z100>
    <div bg-white p1 pos-relative rounded-lg shadow-island>
      <div grid="~ flow-col auto-cols-min rows-[auto] gap-x-1">
        <template :key="key" v-for="(icon, key) in iconList">
          <label @click="handleShapeChange(key)" flex="~ inline items-center" cursor-pointer pos-relative rounded-lg select-none>
            <div :class="shape === key ? 'bg-sky:50' : 'hover:bg-sky:30'" flex="~ justify-center items-center" transition="~ colors ease-in-out" h10 rounded-lg w10>
              <div :class="icon" />
            </div>
          </label>
        </template>
      </div>
    </div>
  </div>
</template>
