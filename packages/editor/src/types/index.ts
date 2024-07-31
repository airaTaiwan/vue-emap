import type { Point } from '@airataiwan/utils'

import type { LineOptions, LineWithArrowOptions, RectOptions } from './shape'

export enum Shape {
  Line = 'Line',
  LineWithArrow = 'LineWithArrow',
  Rect = 'Rect',
}

export interface EditorOptions {
  /** Line Options */
  LineOptions?: LineOptions

  /** LineWithArrow Options */
  LineWithArrowOptions?: LineWithArrowOptions

  /** Rectangle Options */
  RectOptions?: RectOptions

  /** The exist shape */
  historyShape?: History[]
}

export interface History {
  points: Point[]
  type: Shape
}
