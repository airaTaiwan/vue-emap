import { type EMapContext, EMapSymbol } from '@airataiwan/utils'
import { type VNode, cloneVNode, createVNode, defineComponent, h, inject, ref, toValue } from 'vue'

import type { MarkerClustererOptions } from './types'

import { GridAlgorithm } from './algorithms/grid'
import { useChildren } from './useChildren'

export const MarkerClusterer = defineComponent(
  (props: MarkerClustererOptions, { slots: originalSlots }) => {
    const { finallyZoom } = inject(EMapSymbol) as EMapContext

    const { algorithm = new GridAlgorithm({}) } = props

    const { markers } = useChildren(originalSlots)

    const isRender = ref(false)
    const cloneMarkers = ref<VNode[]>([])

    function renderDom(markers: VNode[]) {
      for (const node of markers) {
        const clone = cloneVNode(node)
        cloneMarkers.value.push(clone)
      }

      return cloneMarkers.value
    }

    function renderClusterer(): VNode[] {
      const { clusters } = algorithm.calculate(toValue(finallyZoom), {
        markers: cloneMarkers.value,
      })

      return clusters.map(cluster => createVNode(
        cluster.marker,
        { class: 'btn' },
        { default: () => h('p', cluster.count) },
      ))
    }


    function render(markers: VNode[]) {
      if (isRender.value)
        return renderClusterer()

      isRender.value = true

      return renderDom(markers)
    }

    return () => {
      return render(markers)
    }
  },
  {
    props: ['algorithm'],
  },
)

