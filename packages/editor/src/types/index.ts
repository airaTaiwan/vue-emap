import type { Point } from '@airataiwan/utils'

import type { LineWithArrowOptions, Shape, ShapeOptions } from './shape'

export enum Action {
  Default = 'Default',
  Draw = 'Draw',
  Edit = 'Edit',
}

export interface EditorOptions {
  /**
   * If `true`, the backspace key will delete the captured shape.
   * @param {boolean} [allowBackspaceDelete=false]
   */
  allowBackspaceDelete?: boolean

  /**
   * If `true`, when draw done, the shape will be automatically edit mode.
   * @param {boolean} [autoEdit=true]
   */
  autoEdit?: boolean

  /**
   * The exist shape
   */
  historyShape?: History[]

  /**
   * Line Options
   */
  lineOptions?: ShapeOptions

  /**
   * LineWithArrow Options
   */
  lineWithArrowOptions?: Pick<LineWithArrowOptions, 'isAbove'> & ShapeOptions

  /**
   * Polygon Options
   */
  polygonOptions?: ShapeOptions

  /**
   * Rectangle Options
   */
  rectOptions?: ShapeOptions

  /**
   * The shape to draw
   */
  shape: Shape
}

export interface History {
  id: string
  options?: EditorOptions['lineOptions'] | EditorOptions['lineWithArrowOptions'] | EditorOptions['rectOptions']
  points: Point[]
  type: Shape
}
