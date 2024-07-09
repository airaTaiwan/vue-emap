import type { AnimationType } from '@vue-emap/utils'

export interface EMapOptions {
  animation?: Animation

  /**
   * If false, prevents the map from being dragged.
   *
   * @default true
   */
  draggable?: boolean

  /**
   * map image
   */
  img: HTMLImageElement | string
  /**
   * The maximum zoom level which will be displayed on the map.
   */
  maxZoom?: number
  /**
   * The minimum zoom level which will be displayed on the map.
   */
  minZoom?: number

  /**
   * The initial Map zoom level.
   */
  zoom?: number

  /**
   * The enabled/disabled state of the Zoom control.
   *
   * @default true
   */
  zoomControl?: boolean
}

export interface Animation {
  /**
   * The duration of the animation in milliseconds.
   *
   * @default 1000
   */
  duration: number

  /**
   * The easing function of the animation.
   *
   * {@link AnimationType}
   */
  easingFunction: AnimationType
}

export interface Zoom {
  /**
   * The next zoom level.
   */
  nextZoom: number
  /**
   * The current zoom level.
   */
  sourceZoom: number
}
