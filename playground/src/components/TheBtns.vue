<template>
  <nav flex="~ gap-4" justify-center text-xl>
    <RouterLink title="Map" to="/example/emap" icon-btn>
      <div i-carbon-map />
    </RouterLink>

    <RouterLink title="Marker" to="/example/marker" icon-btn>
      <div i="carbon-location-heart" />
    </RouterLink>

    <RouterLink title="MarkerClusterer" to="/example/markerclusterer" icon-btn>
      <div i-carbon-heat-map />
    </RouterLink>

    <RouterLink title="Area" to="/example/area" icon-btn>
      <div i-carbon-area-custom />
    </RouterLink>
  </nav>
</template>
