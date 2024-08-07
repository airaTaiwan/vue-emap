import type { Action } from '.'

/**
 * Shape type
 */
export enum Shape {
  Line = 'Line',
  LineWithArrow = 'LineWithArrow',
  Rect = 'Rect',
}

export interface ShapeOptions extends Partial<CanvasFillStrokeStyles>, Partial<CanvasPathDrawingStyles> {}

export interface EditorBaseOptions {
  /**
   * The 2D rendering context of the canvas
   */
  ctx: CanvasRenderingContext2D

  /**
   * The status of the shape
   *
   * - `Default`: The shape is not being edited or drawn
   * - `Draw`: The shape is being drawn
   * - `Edit`: The shape is being edited
   *
   * @default 'Default'
   */
  status?: Action
}

export interface LineOptions extends ShapeOptions, EditorBaseOptions {
  /**
   * The x-coordinate of the starting point of the line.
   */
  x1: number

  /**
   * The x-coordinate of the ending point of the line. (Optional)
   */
  x2?: number

  /**
   * The y-coordinate of the starting point of the line.
   */
  y1: number

  /**
   * The y-coordinate of the ending point of the line. (Optional)
   */
  y2?: number
}

export interface LineWithArrowOptions extends ShapeOptions, EditorBaseOptions {
  /**
   * The length of the arrow.
   */
  arrowLength?: number

  /**
   * The width of the arrow.
   */
  arrowWidth?: number

  /**
   * Whether the line is above the canvas.
   */
  isAbove?: boolean

  /**
   * The length of the shaft.
   */
  shaftLength?: number

  /**
   * The x-coordinate of the starting point of the line.
   */
  x1: number

  /**
   * The x-coordinate of the ending point of the line.
   */
  x2?: number

  /**
   * The y-coordinate of the starting point of the line.
   */
  y1: number

  /**
   * The y-coordinate of the ending point of the line.
   */
  y2?: number
}

export interface RectOptions extends ShapeOptions, EditorBaseOptions {
  /**
   * The x-coordinate of the top-left corner of the rectangle.
   */
  x1: number

  /**
   * The optional x-coordinate of the bottom-right corner of the rectangle.
   */
  x2?: number

  /**
   * The y-coordinate of the top-left corner of the rectangle.
   */
  y1: number

  /**
   * The optional y-coordinate of the bottom-right corner of the rectangle.
   */
  y2?: number
}
