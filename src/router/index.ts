import { createRouter, createWebHistory } from 'vue-router'
import RecoedView from '../views/record.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'record',
      component: RecoedView,
    }
  ],
})

export default router
