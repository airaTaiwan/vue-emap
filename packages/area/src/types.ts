import type { Point } from '@airataiwan/utils'

export interface AreaOptions {
  /**
   * Area points
   */
  area?: Point[]

  /**
   * If false, prevents the area from being dragged.
   *
   * @default false
   */
  draggable?: boolean
}
