import type { Point } from '@vue-emap/utils'

export enum Shape {
  Line = 'Line',
  LineWithArrow = 'LineWithArrow',
}

export interface LineOptions {
  /**
   * The 2D rendering context of the canvas
   */
  ctx: CanvasRenderingContext2D

  /**
   * Indicates whether the line is being drawn
   * @default false
   */
  drawing?: boolean

  /**
   * The width of the line
   * @default 1
   */
  lineWidth?: number

  /**
   * The color of the line
   * @default '#0073e6'
   */
  strokeStyle?: string

  /**
   * The x-coordinate of the starting point
   */
  x1: number

  /**
   * The x-coordinate of the ending point
   * If not provided, the current mouse x-coordinate will be used
   */
  x2?: number

  /**
   * The y-coordinate of the starting point
   */
  y1: number

  /**
   * The y-coordinate of the ending point
   * If not provided, the current mouse y-coordinate will be used
   */
  y2?: number
}

export interface EditorOptions {
}

export interface History {
  points: Point[]
  type: Shape
}
