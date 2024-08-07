import { sleep } from '@antfu/utils'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { EMap } from 'vue-emap'

import mapImg from './mock/map.jpg'

describe('map', () => {
  it('map render test', () => {
    const wrapper = mount(EMap, {
      props: {
        img: mapImg,
        zoomControl: true,
      },
    })

    expect(wrapper).not.toBeNull()
  })

  it('zoom to 1.5', async () => {
    const wrapper = mount(EMap, {
      props: {
        img: mapImg,
        zoom: 1,
        zoomControl: true,
      },
    })

    wrapper.vm.setZoom(1.5)

    await sleep(1000)

    expect(wrapper.vm.zoomNum).toBe(1.5)
  })
})
