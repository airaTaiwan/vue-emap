<script setup lang="ts">
import type { ComponentExposed } from 'vue-component-type-helpers'

import { EMap } from 'vue-emap'

import mapImg from '~/images/map.jpg'

defineOptions({
  name: 'EMapExamplePage',
})

const EMapRef = shallowRef<ComponentExposed<typeof EMap> | null>(null)
</script>

<template>
  <div class="w-[800px] h-[800px]">
    <EMap ref="EMapRef" :img="mapImg" zoom-control />
    <ControlBtns
      @on-reset="EMapRef?.reset()"
      @on-zoom-in="EMapRef?.setZoom(EMapRef.zoomNum + 0.5)"
      @on-zoom-out="EMapRef?.setZoom(EMapRef.zoomNum - 0.5)"
    />
  </div>
</template>
