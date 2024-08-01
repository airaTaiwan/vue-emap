<template>
  <nav flex="~ gap-4" justify-center text-xl>
    <RouterLink icon-btn title="Map" to="/example/emap">
      <div i-carbon-map />
    </RouterLink>

    <RouterLink icon-btn title="Marker" to="/example/marker">
      <div i="carbon-location-heart" />
    </RouterLink>

    <RouterLink icon-btn title="MarkerClusterer" to="/example/markerclusterer">
      <div i-carbon-heat-map />
    </RouterLink>

    <RouterLink icon-btn title="Area" to="/example/area">
      <div i-carbon-area-custom />
    </RouterLink>

    <RouterLink icon-btn title="Editor" to="/example/editor">
      <div i-carbon-edit />
    </Routerlink>
  </nav>
</template>
