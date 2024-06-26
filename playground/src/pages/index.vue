<script setup lang="ts">
import { EMap } from 'vue-emap'

import mapImg from '~/images/map.jpg'

defineOptions({
  name: 'IndexPage',
})
</script>

<template>
  <div class="w-[400px] h-[400px]">
    <EMap :zoom-control="false" :img="mapImg">
      I Am EMap
    </EMap>
  </div>
</template>
