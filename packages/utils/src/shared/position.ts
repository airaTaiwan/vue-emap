import type { Point } from '../types'

import { useResetPoint } from '../hooks'

/**
 * Calculate the offset required to center the image on the canvas.
 */
export function centerOffset(
  canvasWidth: number,
  canvasHeight: number,
  imageWidth: number,
  imageHeight: number,
) {
  let offsetX = 0
  let offsetY = 0

  offsetX = (canvasWidth - imageWidth) / 2
  offsetY = (canvasHeight - imageHeight) / 2

  return { offsetX, offsetY }
}

/**
 * Calculates the distance between two points in a two-dimensional space.
 */
export function distanceBetweenPoints(p1: Point, p2: Point): number {
  const deltaX = p2.x - p1.x
  const deltaY = p2.y - p1.y

  return Math.sqrt(deltaX ** 2 + deltaY ** 2)
}

/**
 * Find the nearest point to the target point.
 */
export function findNearPoint(point: Point, target: Point, distance: number): boolean {
  return distanceBetweenPoints(point, target) < distance
}

/**
 * Calculates the centroid of an array of points.
 */
export function calculateCentroid(points: Point[]): Point {
  const sum = points.reduce((accumulator, point) => {
    accumulator.x += point.x
    accumulator.y += point.y
    return accumulator
  }, useResetPoint())

  const numPoints = points.length

  return {
    x: sum.x / numPoints,
    y: sum.y / numPoints,
  }
}

/**
 * Scale the point to the new distance
 */
export function scalePoint(point: Point, center: Point, newDistance: number) {
  const { x: px, y: py } = point
  const { x: qx, y: qy } = center

  const vx = qx - px
  const vy = qy - py

  const length = Math.sqrt(vx * vx + vy * vy)

  const ux = vx / length
  const uy = vy / length

  const newPx = qx - ux * newDistance
  const newPy = qy - uy * newDistance

  return { x: newPx, y: newPy }
}
