export interface ShapeOptions extends Partial<CanvasFillStrokeStyles>, Partial<CanvasPathDrawingStyles> {
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


export interface LineOptions extends ShapeOptions {
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


export interface LineWithArrowOptions extends ShapeOptions {
  /**
   * The length of the arrow.
   */
  arrowLength?: number

  /**
   * The width of the arrow.
   */
  arrowWidth?: number

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

export interface RectOptions extends ShapeOptions {
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

