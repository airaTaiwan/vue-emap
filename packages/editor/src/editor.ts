import { defineComponent } from 'vue'

import type { EditorOptions } from './types'

export const Editor = defineComponent(
  (_props: EditorOptions, { slots }) => {
    return () => {
      return slots.default?.()
    }
  },
  {
    props: [],
  },
)

