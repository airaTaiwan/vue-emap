import type { Point } from '@airataiwan/utils'

import { CursorMap } from '../types/control'

export function setCornerCursor(corner: Point, center: Point): CursorMap {
  if (corner.y < center.y) {
    if (corner.x < center.x)
      return CursorMap.TL
    else if (corner.x > center.x)
      return CursorMap.TR
    else return CursorMap.MT
  }
  else if (corner.y > center.y) {
    if (corner.x < center.x)
      return CursorMap.BL
    else if (corner.x > center.x)
      return CursorMap.BR
    else return CursorMap.MB
  }
  else {
    if (corner.x < center.x)
      return CursorMap.ML
    else return CursorMap.MR
  }
}
