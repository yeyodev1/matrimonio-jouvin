import InvitationView from '@/views/InvitationView.vue'
import CreateInvitationView from '@/views/CreateInvitationView.vue'
import ManageInvitationsView from '@/views/ManageInvitationsView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/invitation',
      name: 'invitation',
      component: InvitationView,
    },
    {
      path: '/create-invitation',
      name: 'create-invitation',
      component: CreateInvitationView,
    },
    {
      path: '/manage-invitations',
      name: 'manage-invitations',
      component: ManageInvitationsView,
    },
  ],
})

export default router
