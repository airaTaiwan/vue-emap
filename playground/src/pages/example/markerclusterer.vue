<script setup lang="ts">
import type { ComponentExposed } from 'vue-component-type-helpers'

import { MarkerClusterer } from '@airataiwan/markerclusterer'
import { EMap, Marker } from 'vue-emap'

import mapImg from '~/images/map.jpg'
import { generateMarkerPos } from '~/utils'

defineOptions({
  name: 'IndexPage',
})

const EMapRef = shallowRef<ComponentExposed<typeof EMap> | null>(null)
</script>

<template>
  <div class="w-[800px] h-[800px]">
    <EMap ref="EMapRef" :img="mapImg" zoom-control>
      <MarkerClusterer>
        <Marker v-for="item in 100" :key="item" :position="generateMarkerPos(800, 800)">
          <div class="btn">
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
