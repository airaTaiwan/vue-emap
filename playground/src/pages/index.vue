<script setup lang="ts">
import { EMap, Marker } from 'vue-emap'

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
      <Marker>
        <div btn>
          123
        </div>
      </Marker>

      <Marker>
        <div btn>
          123
        </div>
      </Marker>
    </EMap>
    <ControlBtns
      @on-zoom-in="EMapRef?.setZoom(EMapRef.zoomNum + 0.5)"
      @on-zoom-out="EMapRef?.setZoom(EMapRef.zoomNum - 0.5)"
      @on-reset="EMapRef?.reset()"
    />
  </div>
</template>
