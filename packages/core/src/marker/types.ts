import type { Point } from '@airataiwan/utils'

export interface MarkerOptions {
  /**
   * Marker content
   */
  content?: HTMLElement | string

  /**
   * If false, prevents the marker from being dragged.
   *
   * @default false
   */
  draggable?: boolean

  /**
   * Horizontal transformation center
   *
   * @default 'center'
   */
  originX?: 'center' | 'left' | 'right'

  /**
   * Vertical transformation center
   *
   * @default 'center'
   */
  originY?: 'bottom' | 'center' | 'top'

  /**
   * Marker position
   */
  position?: Point
}
