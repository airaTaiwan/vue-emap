import type { Point } from '@vue-emap/utils'

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
