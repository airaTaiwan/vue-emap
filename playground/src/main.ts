import '@airataiwan/editor/dist/index.css'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import { setupLayouts } from 'virtual:generated-layouts'
import { createApp } from 'vue'
import 'vue-emap/dist/index.css'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

import App from './App.vue'
import './styles/main.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})
app.use(router)
app.mount('#app')
