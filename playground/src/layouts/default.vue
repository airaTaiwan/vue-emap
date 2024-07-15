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
  <main
    flex="~ items-center justify-center"
    text="center gray-700 dark:gray-200"
    h-full relative w-full
  >
    <RouterView />
    <template v-if="route.fullPath !== '/'">
      <button
        @click="goBack"
        flex="~ gap-2 items-center"
        m="3 t6"
        position="absolute top-xl left-xl" hover:opacity-100 opacity-50
        transition-opacity
      >
        <div i-carbon-arrow-left />
        Back
      </button>
    </template>
    <template v-else>
      <RouterLink
        position="absolute bottom-xl right-xl"
        target="_blank"
        title="GitHub"
        to="https://github.com/CofCat456/http-test-tool"
        bg-white i-carbon-logo-github icon-btn text-xl
      />
    </template>
  </main>
</template>
