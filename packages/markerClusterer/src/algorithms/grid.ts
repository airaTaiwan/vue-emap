export function useGrid() {
  function addToClosestCluster() {

  }
  // function addToClosestCluster(marker: Marker): void {
  //   let maxDistance = this.maxDistance
  //   let closestCluster: Cluster | null = null

  //   for (const cluster of this.clusters) {
  //     const distance = distanceBetweenPoints(
  //       cluster.position,
  //       marker.position,
  //     )

  //     if (distance < maxDistance) {
  //       maxDistance = distance
  //       closestCluster = cluster
  //     }
  //   }

  //   if (closestCluster && closestCluster?.contains(marker.position)) {
  //     closestCluster.push(marker)
  //   }
  //   else {
  //     const newCluster = new Cluster({
  //       gridSize: this.gridSize,
  //       markers: [
  //         marker,
  //       ],
  //     })
  //     this.clusters.push(newCluster)
  //   }
  // }

  return {
    addToClosestCluster,
  }
}
