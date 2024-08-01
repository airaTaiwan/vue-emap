import type { VNode } from 'vue'

import { distanceBetweenPoints, type Point } from '@airataiwan/utils'

import type { AlgorithmInput, AlgorithmOutput } from '../types'

import { Cluster } from '../cluster'

export interface GridOptions {
  /**
   * Size of the grid in meters.
   *
   * @default 500
   */
  gridSize?: number

  /**
   * Max distance between cluster center and point in meters.
   *
   * @default 500
   */
  maxDistance?: number
}

export class GridAlgorithm {
  private _preZoom: number
  protected clusters: Cluster[]
  protected gridSize: number
  protected maxDistance: number

  constructor({
    gridSize = 500,
    maxDistance = 500,
  }: GridOptions) {
    this.maxDistance = maxDistance
    this.gridSize = gridSize
    this._preZoom = 1
    this.clusters = []
  }

  protected addToClosestCluster(marker: VNode): void {
    let maxDistance = this.maxDistance
    let closestCluster: Cluster | null = null
    const position: Point = (marker.component as any).ctx.position

    for (const cluster of this.clusters) {
      const distance = distanceBetweenPoints(
        cluster.position,
        position,
      )

      if (distance < maxDistance) {
        maxDistance = distance
        closestCluster = cluster
      }
    }

    if (closestCluster && closestCluster?.contains(position)) {
      closestCluster.push(marker)
    }
    else {
      const newCluster = new Cluster({
        gridSize: this.gridSize,
        markers: [
          marker,
        ],
        position,
      })
      this.clusters.push(newCluster)
    }
  }

  public calculate(zoom: number, {
    markers,
  }: AlgorithmInput): AlgorithmOutput {
    let changed = false

    changed = zoom === this._preZoom

    return {
      changed,
      clusters: this.cluster({
        markers,
      }),
    }
  }

  protected cluster({
    markers,
  }: Pick<AlgorithmInput, 'markers'>): Cluster[] {
    this.clusters = []

    markers.forEach((marker) => {
      this.addToClosestCluster(marker)
    })

    return this.clusters
  }
}
