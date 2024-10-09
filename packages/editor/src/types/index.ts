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
   *
   * @default false
   */
  allowBackspaceDelete?: boolean

  /**
   * If `true`, when draw done, the shape will be automatically edit mode.
   *
   * @default true
   */
  autoEdit?: boolean

  /**
   * Curve Options
   */
  curveOptions?: ShapeOptions

  /**
   * If `true`, the dpi will be enabled.
   *
   * @default false
   */
  enableDpi?: boolean

  /**
   * Line Options
   */
  lineOptions?: ShapeOptions

  /**
   * LineWithArrow Options
   */
  lineWithArrowOptions?: Pick<LineWithArrowOptions, 'isAbove'> & ShapeOptions

  /**
   * If `true`, the shape will be only view mode.
   */
  onlyView?: boolean

  /**
   * Polygon Options
   */
  polygonOptions?: ShapeOptions

  /**
   * Rectangle Options
   */
  rectOptions?: ShapeOptions
}

export interface History {
  id: string
  options?: EditorOptions['curveOptions'] | EditorOptions['lineOptions'] | EditorOptions['lineWithArrowOptions'] | EditorOptions['polygonOptions'] | EditorOptions['rectOptions']
  points: Point[]
  type: Shape
}
