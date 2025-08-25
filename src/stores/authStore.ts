import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const isAuthenticated = ref(false)
  const authTimestamp = ref<number | null>(null)
  
  // Duración de la sesión en milisegundos (24 horas)
  const SESSION_DURATION = 24 * 60 * 60 * 1000
  
  // Computed
  const isSessionValid = computed(() => {
    if (!isAuthenticated.value || !authTimestamp.value) {
      return false
    }
    
    const now = Date.now()
    const sessionAge = now - authTimestamp.value
    
    return sessionAge < SESSION_DURATION
  })
  
  // Acciones
  const login = (password: string): boolean => {
    const ADMIN_PASSWORD = 'genesis2025'
    
    if (password === ADMIN_PASSWORD) {
      isAuthenticated.value = true
      authTimestamp.value = Date.now()
      
      // Persistir en localStorage
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('authTimestamp', authTimestamp.value.toString())
      
      return true
    }
    
    return false
  }
  
  const logout = () => {
    isAuthenticated.value = false
    authTimestamp.value = null
    
    // Limpiar localStorage
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('authTimestamp')
  }
  
  const checkAuthFromStorage = () => {
    const storedAuth = localStorage.getItem('isAuthenticated')
    const storedTimestamp = localStorage.getItem('authTimestamp')
    
    if (storedAuth === 'true' && storedTimestamp) {
      const timestamp = parseInt(storedTimestamp)
      const now = Date.now()
      const sessionAge = now - timestamp
      
      if (sessionAge < SESSION_DURATION) {
        isAuthenticated.value = true
        authTimestamp.value = timestamp
        return true
      } else {
        // Sesión expirada, limpiar
        logout()
      }
    }
    
    return false
  }
  
  const refreshSession = () => {
    if (isAuthenticated.value) {
      authTimestamp.value = Date.now()
      localStorage.setItem('authTimestamp', authTimestamp.value.toString())
    }
  }
  
  return {
    // Estado
    isAuthenticated,
    authTimestamp,
    
    // Computed
    isSessionValid,
    
    // Acciones
    login,
    logout,
    checkAuthFromStorage,
    refreshSession
  }
})