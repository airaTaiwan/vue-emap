<script lang="ts">
const area: Point[] = [
  { x: 50, y: 150 },
  { x: 75, y: 10 },
  { x: 100, y: 150 },
  { x: 125, y: 290 },
  { x: 150, y: 150 },
  { x: 175, y: 10 },
  { x: 200, y: 150 },
  { x: 225, y: 290 },
  { x: 250, y: 150 },
]
</script>

<script setup lang="ts">
import type { ComponentExposed } from 'vue-component-type-helpers'
import type { Point } from 'vue-emap'

import { Area } from '@vue-emap/area'
import mapImg from '~/images/map.jpg'
import { EMap } from 'vue-emap'

defineOptions({
  name: 'EMapExamplePage',
})

const EMapRef = shallowRef<ComponentExposed<typeof EMap> | null>(null)
</script>

<template>
  <div class="w-[800px] h-[800px]">
    <EMap :img="mapImg" ref="EMapRef" zoom-control>
      <Area :area />
    </EMap>
    <ControlBtns
      @on-reset="EMapRef?.reset()"
      @on-zoom-in="EMapRef?.setZoom(EMapRef.zoomNum + 0.5)"
      @on-zoom-out="EMapRef?.setZoom(EMapRef.zoomNum - 0.5)"
    />
  </div>
</template>
