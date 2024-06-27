/**
 * Represents the size of an object or element.
 */
export interface Size {
  width: number
  height: number
}

/**
 * Represents a point in 2D space.
 */
export interface Point {
  x: number
  y: number
}

/**
 * Represents the position and size of an object or element.
 */
export interface Info extends Size, Point {}
