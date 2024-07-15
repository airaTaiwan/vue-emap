import type { Point } from 'vue-emap'

export function generateMarkerPos(rangeX: number, rangeY: number): Point {
  const x = Math.floor(Math.random() * rangeX) + 1
  const y = Math.floor(Math.random() * rangeY) + 1

  return {
    x,
    y,
  }
}
