import type { Point } from '@vue-emap/utils'

export enum Shape {
  Line = 'Line',
  LineWithArrow = 'LineWithArrow',
  Rect = 'Rect',
}

export interface ShapeOptions extends CanvasFillStrokeStyles, CanvasPathDrawingStyles {
  /**
   * The 2D rendering context of the canvas
   */
  ctx: CanvasRenderingContext2D

  /**
   * Indicates whether the line is being drawn
   * @default false
   */
  drawing?: boolean
}

export interface EditorOptions {
}

export interface History {
  points: Point[]
  type: Shape
}
