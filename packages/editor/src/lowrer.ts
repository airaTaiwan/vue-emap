import { defineComponent } from 'vue'

export const LowerLayer = defineComponent(
  (_props, { slots }) => {
    return () => {
      return slots.default?.()
    }
  },
  {
    props: [],
  },
)

