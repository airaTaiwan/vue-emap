import type { Point } from '@airataiwan/utils'

import type { LineWithArrowOptions, Shape, ShapeOptions } from './shape'

export enum Action {
  Default = 'Default',
  Draw = 'Draw',
  Edit = 'Edit',
}

export interface EditorOptions {
  /** The exist shape */
  historyShape?: History[]

  /** Line Options */
  lineOptions?: ShapeOptions

  /** LineWithArrow Options */
  lineWithArrowOptions?: Pick<LineWithArrowOptions, 'isAbove'> & ShapeOptions

  /** Rectangle Options */
  rectOptions?: ShapeOptions

  /** The shape to draw */
  shape: Shape
}

export interface History {
  points: Point[]
  type: Shape
}
