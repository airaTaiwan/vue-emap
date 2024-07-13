<script setup lang="ts">
import type { ComponentExposed } from 'vue-component-type-helpers'

import { MarkerClusterer } from '@vue-emap/markerclusterer'
import ControlBtns from '~/components/ControlBtns.vue'
import mapImg from '~/images/map.jpg'
import { generateMarkerPos } from '~/utils'
import { EMap, Marker } from 'vue-emap'

defineOptions({
  name: 'IndexPage',
})

const EMapRef = shallowRef<ComponentExposed<typeof EMap> | null>(null)
</script>

<template>
  <div class="w-[800px] h-[800px]">
    <EMap :img="mapImg" ref="EMapRef" zoom-control>
      <MarkerClusterer>
        <Marker :key="item" :position="generateMarkerPos(800, 800)" v-for="item in 100">
          <div btn>
            {{ item }}
          </div>
        </Marker>
      </MarkerClusterer>
    </EMap>
    <ControlBtns
      @on-reset="EMapRef?.reset()"
      @on-zoom-in="EMapRef?.setZoom(EMapRef.zoomNum + 0.5)"
      @on-zoom-out="EMapRef?.setZoom(EMapRef.zoomNum - 0.5)"
    />
  </div>
</template>
