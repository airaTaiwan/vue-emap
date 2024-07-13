import { type EMapContext, EMapSymbol } from '@vue-emap/utils'
import { type VNode, cloneVNode, defineComponent, inject, ref } from 'vue'

import { useChildren } from './useChildren'

export const MarkerClusterer = defineComponent(
  (_props, { slots: originalSlots }) => {
    inject(EMapSymbol) as EMapContext

    const { markers } = useChildren(originalSlots)
    const cloneMarkers = ref<VNode[]>([])


    function renderMarkers(markers: VNode[]) {
      cloneMarkers.value = []
      for (const node of markers) {
        const clone = cloneVNode(node)
        cloneMarkers.value.push(clone)
      }

      // const { clusters } = this.algorithm.calculate({
      //   map: this.map!,
      //   markers: this.markers,
      // })

      // console.log('markers', markers)

      return markers
    }

    return () => {
      renderMarkers(markers)

      return cloneMarkers.value
      // return h('div', 123)
    }
  },
)

