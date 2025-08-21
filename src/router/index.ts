import InvitationView from '@/views/InvitationView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/invitation',
      name: 'invitation',
      component: InvitationView,
    },
  ],
})

export default router
