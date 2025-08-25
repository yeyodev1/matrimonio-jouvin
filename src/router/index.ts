import InvitationView from '@/views/InvitationView.vue'
import CreateInvitationView from '@/views/CreateInvitationView.vue'
import ManageInvitationsView from '@/views/ManageInvitationsView.vue'
import LoginView from '@/views/LoginView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Helper para formatear nombres de invitados
const formatGuestNameForTitle = (guestName: string): string => {
  return decodeURIComponent(guestName).replace(/-/g, ' ')
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        title: 'Login - Panel de Administración'
      }
    },
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
        title: 'Crear Invitación - Panel de Administración',
        requiresAuth: true
      }
    },
    {
      path: '/manage-invitations',
      name: 'manage-invitations',
      component: ManageInvitationsView,
      meta: {
        title: 'Gestionar Invitaciones - Panel de Administración',
        requiresAuth: true
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: {
        title: 'Página no encontrada'
      }
    }
  ],
})

// Guard de autenticación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Verificar autenticación desde localStorage al iniciar
  authStore.checkAuthFromStorage()
  
  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!authStore.isSessionValid) {
      // Redirigir al login si no está autenticado o la sesión expiró
      next({ name: 'login' })
      return
    } else {
      // Refrescar la sesión si está autenticado
      authStore.refreshSession()
    }
  }
  
  // Si está autenticado y trata de acceder al login, redirigir a manage-invitations
  if (to.name === 'login' && authStore.isSessionValid) {
    next({ name: 'manage-invitations' })
    return
  }
  
  next()
})

export default router
