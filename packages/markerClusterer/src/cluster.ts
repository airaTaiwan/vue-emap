import type { VNode } from 'vue'

import { type Point, calculateCentroid, useResetPoint } from '@vue-emap/utils'

export interface ClusterOptions {
  gridSize?: number
  markers: VNode[]
  position?: Point
}

export class Cluster {
  public readonly markers: VNode[]
  private _gridSize = 500
  private _position: Point

  constructor({ gridSize, markers, position }: ClusterOptions) {
    this.markers = markers
    this._gridSize = gridSize || this._gridSize

    if (position)
      this._position = { ...position }
    else
      this._position = useResetPoint()
  }


  // public get bounds(): google.maps.LatLngBounds | undefined {
  //   if (this.markers.length === 0 && !this._position) {
  //     return
  //   }

  //   const bounds = new google.maps.LatLngBounds(this._position, this._position)
  //   for (const marker of this.markers) {
  //     bounds.extend(MarkerUtils.getPosition(marker))
  //   }
  //   return bounds
  // }

  public get position(): Point {
    return this._position
  }

  public get marker(): VNode {
    return this.markers[0]
  }

  public updatePosition(): void {
    const positions = this.markers.map((v: VNode) => (v.component as any).ctx.position)

    if (positions.length > 1)
      this._position = calculateCentroid(positions)
    else
      this._position = positions[0]
  }

  public contains(position: Point): boolean {
    return position.x >= this._position.x - this._gridSize / 2 && position.x <= this._position.x + this._gridSize / 2
      && position.y >= this._position.y - this._gridSize / 2 && position.y <= this._position.y + this._gridSize / 2
  }

  /**
   * Get the count of visible markers.
   */
  public get count(): number {
    // return this.markers.filter((m: Marker) => MarkerUtils.getVisible(m)).length
    return this.markers.length
  }

  /**
   * Add a marker to the cluster.
   */
  public push(marker: VNode): void {
    if (this.markers)
      this.markers.push(marker)

    this.updatePosition()
  }

  // /**
  //  * Cleanup references and remove marker from map.
  //  */
  // public delete(): void {
  //   if (this.marker) {
  //     MarkerUtils.setMap(this.marker, null)
  //     this.marker = undefined
  //   }
  //   this.markers.length = 0
  // }
}
