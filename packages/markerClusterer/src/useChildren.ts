import { isFunction } from '@antfu/utils'
import { type Slots, type VNode, ref } from 'vue'

export function useChildren(originalSlots: Slots = {}) {
  const markers: VNode[] = []

  const markersRef = ref<VNode[]>([])
  const oldMarkersRef = ref<VNode[]>([])

  const slots = {
    default: [],
  }

  const getSlidesFromElements = (els: unknown, slotName: string) => {
    if (!Array.isArray(els))
      return

    els.forEach((vnode) => {
      const isFragment = typeof vnode.type === 'symbol'


      if (isFragment && vnode.children) {
        getSlidesFromElements(vnode.children, slotName)
      }
      else if (
        (
          vnode.type
          && (vnode.type.__name === 'Marker')
        )
        || (
          vnode.componentOptions && (vnode.componentOptions.tag === 'Marker')
        )
      ) {
        markers.push(vnode)
      }
    })
  }

  Object.keys(originalSlots).forEach((slotName) => {
    if (!isFunction(originalSlots[slotName]))
      return

    const els = originalSlots[slotName]!()
    getSlidesFromElements(els, slotName)
  })

  oldMarkersRef.value = markersRef.value
  markersRef.value = markers

  return { markers, markersRef, oldMarkersRef, slots }
}
