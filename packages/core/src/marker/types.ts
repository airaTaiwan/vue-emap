import type { Point } from '@vue-emap/utils'

export interface MarkerOptions {
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
