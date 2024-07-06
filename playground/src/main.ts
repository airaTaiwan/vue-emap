import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router/auto'

import App from './App.vue'

import './styles/main.css'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import 'vue-emap/dist/index.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
})
app.use(router)
app.mount('#app')
