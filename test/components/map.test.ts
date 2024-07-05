import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { EMap } from 'vue-emap'

import mapImg from './mock/map.jpg'

describe('map', () => {
  it('map render test', () => {
    const wrapper = mount(EMap, {
      props: {
        zoomControl: true,
        img: mapImg,
      },
    })

    expect(wrapper).not.toBeNull()
  })

  it('should zoom to 1.5', () => {
    const wrapper = mount(EMap, {
      props: {
        zoom: 1,
        zoomControl: true,
        img: mapImg,
      },
    })

    wrapper.vm.setZoom(1.5)

    expect(wrapper.vm.zoomNum).toBe(1.5)
  })
})
