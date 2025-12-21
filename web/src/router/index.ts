import { createRouter, createWebHistory } from 'vue-router'
import Player from '@/views/Player.vue'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Home
    },
    {
      path: "/home",
      component: Home
    },
    {
      path: "/player",
      component: Player,
    },
  ],
})

export default router
