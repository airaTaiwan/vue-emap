export enum CursorMap {
  BL = 'sw-resize',
  BR = 'se-resize',
  DEFAULT = 'default',
  MB = 's-resize',
  ML = 'w-resize',
  MOVE = 'move',
  MR = 'e-resize',
  MT = 'n-resize',
  TL = 'nw-resize',
  TR = 'ne-resize',
}

export interface CornerOptions {
  /**
   * The size of the corner.
   *
   * @default 8
   */
  cornerSize?: number

  /**
   * The color of the corner.
   *
   * @default '#00c9ff'
   */
  cornerStorkColor?: string
}

export interface Corner {
  cursor: CursorMap
  h: number
  idx: number
  w: number
  x: number
  y: number
}

export interface ControlCoords {
  [key: string]: Corner
}
