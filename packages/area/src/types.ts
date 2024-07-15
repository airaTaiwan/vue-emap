import type { Point } from '@vue-emap/utils'

export interface AreaOptions {
  /**
   * If false, prevents the area from being dragged.
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
   * Area position
   */
  position?: Point
}
