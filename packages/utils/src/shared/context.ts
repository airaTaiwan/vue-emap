import type { Ref, ShallowRef } from 'vue'

import type { Info, Point } from '../types'

export interface EMapContext {
  eventLayerEl: ShallowRef<HTMLDivElement | null>
  finallyZoom: Ref<number>
  imageInfo: Ref<Info>
  translate: Ref<Point>
  zoomChangePoint: Ref<Point>
  zoomNum: Ref<number>
  zoomRatio: Ref<number>
}
