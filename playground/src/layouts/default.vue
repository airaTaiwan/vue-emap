<script setup lang="ts">
const route = useRoute()
const router = useRouter()

function goBack() {
  if (window.history.length > 2)
    router.back()
  else
    router.push('/')
}
</script>

<template>
  <div
    flex="~ items-center justify-center"
    h-full
    relative text="center gray-700 dark:gray-200" w-full
  >
    <RouterView />
    <template v-if="route.fullPath !== '/'">
      <button
        flex="~ gap-2 items-center"
        hover:opacity-100
        m="3 t6"
        opacity-50 position="absolute top-xl left-xl" transition-opacity
        @click="goBack"
      >
        <div i-carbon-arrow-left />
        Back
      </button>
    </template>
    <template v-else>
      <RouterLink
        bg-white
        i-carbon-logo-github
        icon-btn
        position="absolute bottom-xl right-xl"
        target="_blank" text-xl title="GitHub" to="https://github.com/CofCat456/http-test-tool"
      />
    </template>
  </div>
</template>
