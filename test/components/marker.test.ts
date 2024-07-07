import { sleep } from '@antfu/utils'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { EMap, Marker } from 'vue-emap'

import mapImg from './mock/map.jpg'

describe('map', () => {
  it('marker render test', () => {
    const wrapper = mount(EMap, {
      props: {
        img: mapImg,
        zoomControl: true,
      },
      slots: {
        default: Marker,
      },
    })

    expect(wrapper.find('.marker').exists()).toBeTruthy()
  })

  it('zoom to 1.5', async () => {
    const wrapper = mount(EMap, {
      props: {
        img: mapImg,
        zoomControl: true,
      },
      slots: {
        default: Marker,
      },
    })

    expect(wrapper.find('.marker').html()).toMatchSnapshot()

    wrapper.vm.setZoom(1.5)

    await sleep(450)

    expect(wrapper.find('.marker').html()).toMatchSnapshot()
  })
})
