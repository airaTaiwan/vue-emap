<script setup lang="ts">
import { EMap } from 'vue-emap'

defineOptions({
  name: 'IndexPage',
})
</script>

<template>
  <div>
    <EMap :model-value="false">
      I Am EMap
    </EMap>
  </div>
</template>
