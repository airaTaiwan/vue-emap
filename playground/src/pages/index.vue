<script setup lang="ts">
import { EMap } from 'vue-emap'

import type { ComponentExposed } from 'vue-component-type-helpers'

import ControlBtns from '~/components/ControlBtns.vue'

import mapImg from '~/images/map.jpg'

defineOptions({
  name: 'IndexPage',
})

const EMapRef = shallowRef<ComponentExposed<typeof EMap> | null>(null)
</script>

<template>
  <div class="w-[800px] h-[800px]">
    <EMap ref="EMapRef" zoom-control :img="mapImg">
      I Am EMap
    </EMap>
    <ControlBtns
      @on-zoom-in="EMapRef?.setZoom(EMapRef.zoomNum + 0.5)"
      @on-zoom-out="EMapRef?.setZoom(EMapRef.zoomNum - 0.5)"
      @on-reset="EMapRef?.reset()"
    />
  </div>
</template>
