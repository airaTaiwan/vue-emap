import { type EMapContext, type EMapEventContext, EMapEventSymbol, EMapSymbol, type Point, useBaseSetup, useDrag } from '@vue-emap/utils'
import { useElementSize } from '@vueuse/core'
import { computed, defineComponent, h, inject, ref, shallowRef } from 'vue'

import type { AreaOptions } from './types'

export const Area = defineComponent(
  ({
    draggable = false,
    originX,
    originY,
    position: originPosition = { x: 500, y: 300 },
  }: AreaOptions) => {
    const { eventLayerEl, zoomChangePoint, zoomNum, zoomRatio } = inject(EMapSymbol) as EMapContext
    const { mouseX, mouseY, translate } = inject(EMapEventSymbol) as EMapEventContext

    const position = ref<Point>(originPosition)

    useBaseSetup(position, {
      translate,
      zoomChangePoint,
      zoomNum,
      zoomRatio,
    })

    const areaEl = shallowRef<HTMLDivElement | null>(null)
    const { height, width } = useElementSize(areaEl)

    useDrag(areaEl, (offsetX, offsetY) => {
      position.value.x += offsetX
      position.value.y += offsetY
    }, {
      draggable,
      eventLayerEl,
      mouseX,
      mouseY,
    })

    const areaPosOnMap = computed(() => {
      const x = originX === 'center'
        ? position.value.x - width.value / 2
        : originX === 'right'
          ? position.value.x - width.value
          : position.value.x
      const y = originY === 'center'
        ? position.value.y - height.value / 2
        : originY === 'bottom'
          ? position.value.y - height.value
          : position.value.y

      return {
        x: x.toFixed(2),
        y: y.toFixed(2),
      }
    })

    return () => {
      return h('div', {
        class: 'area block op100 pos-absolute z0',
        ref: areaEl,
        style: {
          backgroundColor: 'rgba(0, 0, 0)',
          height: '100px',
          left: `${areaPosOnMap.value.x}px`,
          top: `${areaPosOnMap.value.y}px`,
          width: '100px',
        },
      }, 'I am Area')
    }
  },
)

