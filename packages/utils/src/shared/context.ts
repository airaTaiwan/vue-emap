import type { ComputedRef, Ref, ShallowRef } from 'vue'

import type { Info, Point } from '../types'

export interface EMapContext {
  canvasLayerHeight: Ref<number>
  canvasLayerWidth: Ref<number>
  drawCanvas: (canvas: HTMLCanvasElement) => void
  eventLayerEl: ShallowRef<HTMLDivElement | null>
  finallyZoom: Ref<number>
  imageInfo: Ref<Info>
  translate: Ref<Point>
  zoomChangePoint: Ref<Point>
  zoomNum: Ref<number>
  zoomRatio: Ref<number>
}

export interface EMapEventContext {
  mouseX: Ref<number>
  mouseY: Ref<number>
  translate: ComputedRef<Point>
}

