import type { Point } from '@airataiwan/utils'

import type { LineOptions, LineWithArrowOptions, RectOptions } from './shape'

export enum Shape {
  Line = 'Line',
  LineWithArrow = 'LineWithArrow',
  Rect = 'Rect',
}

export interface EditorOptions {
  /** The exist shape */
  historyShape?: History[]

  /** Line Options */
  LineOptions?: LineOptions

  /** LineWithArrow Options */
  LineWithArrowOptions?: LineWithArrowOptions

  /** Rectangle Options */
  RectOptions?: RectOptions
}

export interface History {
  points: Point[]
  type: Shape
}
