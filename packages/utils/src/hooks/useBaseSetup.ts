import { watchDeep } from '@vueuse/core'
import { type ComputedRef, type Ref, watch } from 'vue'

import type { Point } from '../types'

export interface UseBaseSetupOptions {
  translate: ComputedRef<Point>
  zoomChangePoint: Ref<Point>
  zoomNum: Ref<number>
  zoomRatio: Ref<number>
}

export function useBaseSetup(
  position: Ref<Point>,
  {
    translate,
    zoomChangePoint,
    zoomNum,
    zoomRatio,
  }: UseBaseSetupOptions,
) {
// map drag
  watchDeep(translate, ({ x: curX, y: curY }, { x: preX, y: preY }) => {
    const diffX = curX - preX
    const diffY = curY - preY

    position.value.x += diffX
    position.value.y += diffY
  })

  // map zoom
  watch(zoomNum, () => {
    const { x, y } = position.value
    const { x: zoomChangePointX, y: zoomChangePointY } = zoomChangePoint.value

    const deltaX = (x - zoomChangePointX) * zoomRatio.value
    const deltaY = (y - zoomChangePointY) * zoomRatio.value

    position.value.x = zoomChangePointX + deltaX
    position.value.y = zoomChangePointY + deltaY
  })
}
