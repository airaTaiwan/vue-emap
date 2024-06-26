<template>
  <div
    position="absolute top-0 left-0" w-full will-change-transform z-103
    :style="{
      transform: 'translate(0px, 0px)',
    }"
  >
    <slot />
  </div>
</template>
