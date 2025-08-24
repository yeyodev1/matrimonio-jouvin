import InvitationView from '@/views/InvitationView.vue'
import CreateInvitationView from '@/views/CreateInvitationView.vue'
import ManageInvitationsView from '@/views/ManageInvitationsView.vue'
import { createRouter, createWebHistory } from 'vue-router'

// Helper para formatear nombres de invitados
const formatGuestNameForTitle = (guestName: string): string => {
  return decodeURIComponent(guestName).replace(/-/g, ' ')
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/invitation/:guestName',
      name: 'invitation',
      component: InvitationView,
      props: true,
      beforeEnter: (to) => {
        // Actualizar el título dinámicamente basado en el nombre del invitado
        const guestName = formatGuestNameForTitle(to.params.guestName as string)
        document.title = `Invitación para ${guestName} - Boda Génesis y Christopher`
      },
      meta: {
        title: 'Invitación de Boda - Génesis y Christopher'
      }
    },
    {
      // Ruta de respaldo para invitaciones sin nombre en la URL
      path: '/invitation',
      name: 'invitation-fallback',
      component: InvitationView,
      meta: {
        title: 'Invitación de Boda - Génesis y Christopher'
      }
    },
    {
      path: '/create-invitation',
      name: 'create-invitation',
      component: CreateInvitationView,
      meta: {
        title: 'Crear Invitación - Panel de Administración'
      }
    },
    {
      path: '/manage-invitations',
      name: 'manage-invitations',
      component: ManageInvitationsView,
      meta: {
        title: 'Gestionar Invitaciones - Panel de Administración'
      }
    },
  ],
})

export default router
