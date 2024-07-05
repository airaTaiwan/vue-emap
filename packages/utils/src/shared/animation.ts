export const ANIMATION_LINEAR = Symbol('linear')
export const ANIMATION_EASE_IN_QUAD = Symbol('easeInQuad')
export const ANIMATION_EASE_OUT_QUAD = Symbol('easeOutQuad')
export const ANIMATION_EASE_IN_OUT_QUAD = Symbol('easeInOutQuad')
export const ANIMATION_EASE_IN_CUBIC = Symbol('easeInCubic')
export const ANIMATION_EASE_OUT_CUBIC = Symbol('easeOutCubic')
export const ANIMATION_EASE_IN_OUT_CUBIC = Symbol('easeInOutCubic')
export const ANIMATION_EASE_IN_QUART = Symbol('easeInQuart')
export const ANIMATION_EASE_OUT_QUART = Symbol('easeOutQuart')
export const ANIMATION_EASE_IN_OUT_QUART = Symbol('easeInOutQuart')
export const ANIMATION_EASE_IN_QUINT = Symbol('easeInQuint')
export const ANIMATION_EASE_OUT_QUINT = Symbol('easeOutQuint')
export const ANIMATION_EASE_IN_OUT_QUINT = Symbol('easeInOutQuint')

export type AnimationType = typeof ANIMATION_LINEAR |
  typeof ANIMATION_EASE_IN_QUAD |
  typeof ANIMATION_EASE_OUT_QUAD |
  typeof ANIMATION_EASE_IN_OUT_QUAD |
  typeof ANIMATION_EASE_IN_CUBIC |
  typeof ANIMATION_EASE_OUT_CUBIC |
  typeof ANIMATION_EASE_IN_OUT_CUBIC |
  typeof ANIMATION_EASE_IN_QUART |
  typeof ANIMATION_EASE_OUT_QUART |
  typeof ANIMATION_EASE_IN_OUT_QUART |
  typeof ANIMATION_EASE_IN_QUINT |
  typeof ANIMATION_EASE_OUT_QUINT |
  typeof ANIMATION_EASE_IN_OUT_QUINT

/*
 * Easing Functions.
 * Only considering the t value for the range [0, 1] => [0, 1].
 *
 * @see https://github.com/visjs/vis-util/blob/cdd028dcc7eebcc4b8364920569d2933c9080912/src/util.ts#L1598
 */
export const easingFunctions: Record<symbol, (t: number) => number> = {
  /**
   * Provides no easing and no acceleration.
   *
   * @param t - Time.
   * @returns Value at time t.
   */
  [ANIMATION_LINEAR](t: number): number {
    return t
  },

  /**
   * Accelerate from zero velocity.
   *
   * @param t - Time.
   * @returns Value at time t.
   */
  [ANIMATION_EASE_IN_QUAD](t: number): number {
    return t * t
  },

  /**
   * Decelerate to zero velocity.
   *
   * @param t - Time.
   * @returns Value at time t.
   */
  [ANIMATION_EASE_OUT_QUAD](t: number): number {
    return t * (2 - t)
  },

  /**
   * Accelerate until halfway, then decelerate.
   *
   * @param t - Time.
   * @returns Value at time t.
   */
  [ANIMATION_EASE_IN_OUT_QUAD](t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  },

  /**
   * Accelerate from zero velocity.
   *
   * @param t - Time.
   * @returns Value at time t.
   */
  [ANIMATION_EASE_IN_CUBIC](t: number): number {
    return t * t * t
  },

  /**
   * Decelerate to zero velocity.
   *
   * @param t - Time.
   * @returns Value at time t.
   */
  [ANIMATION_EASE_OUT_CUBIC](t: number): number {
    return --t * t * t + 1
  },

  /**
   * Accelerate until halfway, then decelerate.
   *
   * @param t - Time.
   * @returns Value at time t.
   */
  [ANIMATION_EASE_IN_OUT_CUBIC](t: number): number {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  },

  /**
   * Accelerate from zero velocity.
   *
   * @param t - Time.
   * @returns Value at time t.
   */
  [ANIMATION_EASE_IN_QUART](t: number): number {
    return t * t * t * t
  },

  /**
   * Decelerate to zero velocity.
   *
   * @param t - Time.
   * @returns Value at time t.
   */
  [ANIMATION_EASE_OUT_QUART](t: number): number {
    return 1 - --t * t * t * t
  },

  /**
   * Accelerate until halfway, then decelerate.
   *
   * @param t - Time.
   * @returns Value at time t.
   */
  [ANIMATION_EASE_IN_OUT_QUART](t: number): number {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t
  },

  /**
   * Accelerate from zero velocity.
   *
   * @param t - Time.
   * @returns Value at time t.
   */
  [ANIMATION_EASE_IN_QUINT](t: number): number {
    return t * t * t * t * t
  },

  /**
   * Decelerate to zero velocity.
   *
   * @param t - Time.
   * @returns Value at time t.
   */
  [ANIMATION_EASE_OUT_QUINT](t: number): number {
    return 1 + --t * t * t * t * t
  },

  /**
   * Accelerate until halfway, then decelerate.
   *
   * @param t - Time.
   * @returns Value at time t.
   */
  [ANIMATION_EASE_IN_OUT_QUINT](t: number): number {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
  },
}
