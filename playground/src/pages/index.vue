<script setup lang="ts">
import { EMap } from 'vue-emap'
import mapImg from '~/public/map.jpg'

defineOptions({
  name: 'IndexPage',
})
</script>

<template>
  <div class="w-[400px] h-[400px]">
    <EMap :img="mapImg">
      I Am EMap
    </EMap>
  </div>
</template>
