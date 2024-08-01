import type { RouteRecordRaw } from 'vue-router'

import '@airataiwan/editor/dist/index.css'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import { setupLayouts } from 'virtual:generated-layouts'
import { createApp } from 'vue'
import 'vue-emap/dist/index.css'
import { createRouter, createWebHistory } from 'vue-router/auto'

import App from './App.vue'
import './styles/main.css'

const app = createApp(App)
const router = createRouter({
  extendRoutes: (routes: RouteRecordRaw[]) => setupLayouts(routes),
  history: createWebHistory(import.meta.env.BASE_URL),
})
app.use(router)
app.mount('#app')
