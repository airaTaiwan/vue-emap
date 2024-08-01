import { unrefElement, useEventListener } from '@vueuse/core'
import { type MaybeRef, type Ref, ref, type ShallowRef, watch } from 'vue'

export interface UseDragOptions {
  draggable: boolean
  eventLayerEl: ShallowRef<HTMLElement | null>
  mouseX: Ref<number>
  mouseY: Ref<number>
}

export type UseDragCallback = (offsetX: number, offsetY: number) => void

export function useDrag(
  target: MaybeRef<HTMLElement | null>,
  cb: UseDragCallback,
  {
    draggable,
    eventLayerEl,
    mouseX,
    mouseY,
  }: UseDragOptions,
) {
  const isDragging = ref(false)

  watch([mouseX, mouseY], ([curX, curY], [preX, preY]) => {
    const el = unrefElement(target)

    if (el == null)
      return

    if (!draggable || !isDragging.value)
      return

    el.style.cursor = 'grabbing'

    const dragOffsetX = curX - preX
    const dragOffsetY = curY - preY

    cb(dragOffsetX, dragOffsetY)
  })

  function dragStart() {
    const el = unrefElement(target)

    if (el == null)
      return

    isDragging.value = true

    el.style.cursor = 'grab'
  }

  function dragEnd() {
    const el = unrefElement(target)

    if (el == null)
      return

    el.style.cursor = 'default'

    isDragging.value = false
  }

  useEventListener(target, 'pointerdown', dragStart)
  useEventListener(eventLayerEl, ['pointerleave', 'pointerup'], dragEnd)
}
