<script lang="ts">
import type { Shape } from '../types/shape'

import { Action } from '../types'

type IconName = string

const actionList: Partial<Record<Action, IconName>> = {
  Default: 'i-mingcute:cursor-2-line',
}

const iconList: Partial<Record<Shape, IconName>> = {
  Curve: 'i-mingcute:back-line',
  Line: 'i-mingcute:minimize-line',
  LineWithArrow: 'i-mingcute:align-arrow-right-line',
  Polygon: 'i-mingcute:hexagon-line',
  Rect: 'i-mingcute:rectangle-line',
}
</script>

<script setup lang="ts">
import { injectEditorContext } from '../EditorLayer.vue'

const { action, clearDrawCanvas, controlatorIdx, points, resetControlator, shape } = injectEditorContext()

function handleActionChange(key: Action) {
  action.value = key

  points.value.length = 0
  clearDrawCanvas()
}

function handleShapeChange(key: Shape) {
  if (action.value === Action.Edit && controlatorIdx.value !== -1)
    resetControlator()

  action.value = Action.Draw
  shape.value = key
}
</script>

<template>
  <div flex="~ justify-center" position="absolute top-4 inset-x-0" text-black z100>
    <div bg-white p1 pos-relative rounded-lg shadow-island>
      <div grid="~ flow-col auto-cols-min rows-[auto] gap-x-1">
        <template v-for="(icon, key) in actionList" :key="key">
          <label cursor-pointer flex="~ inline items-center" pos-relative rounded-lg select-none @click.stop="handleActionChange(key)">
            <div :class="action !== Action.Draw ? 'bg-sky:50' : 'hover:bg-sky:30'" flex="~ justify-center items-center" h10 rounded-lg transition="~ colors ease-in-out" w10>
              <div :class="icon" />
            </div>
          </label>
        </template>

        <template v-for="(icon, key) in iconList" :key="key">
          <label cursor-pointer flex="~ inline items-center" pos-relative rounded-lg select-none @click.stop="handleShapeChange(key)">
            <div :class="action === Action.Draw && shape === key ? 'bg-sky:50' : 'hover:bg-sky:30'" flex="~ justify-center items-center" h10 rounded-lg transition="~ colors ease-in-out" w10>
              <div :class="icon" />
            </div>
          </label>
        </template>
      </div>
    </div>
  </div>
</template>
