import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import invitationService from '@/services/invitationService'
import type {
  IInvitation,
  CreateInvitationRequest,
  UpdateInvitationRequest,
  ConfirmInvitationRequest,
  PaginationParams
} from '@/services/invitationService'

// Interface para el estado de paginación
interface PaginationState {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// Interface para el estado de loading
interface LoadingState {
  creating: boolean
  fetching: boolean
  updating: boolean
  deleting: boolean
  fetchingById: boolean
  confirming: boolean
}

// Interface para el estado de errores
interface ErrorState {
  create: string | null
  fetch: string | null
  update: string | null
  delete: string | null
  fetchById: string | null
  confirm: string | null
}

export const useInvitationStore = defineStore('invitation', () => {
  // Estado reactivo
  const invitations = ref<IInvitation[]>([])
  const currentInvitation = ref<IInvitation | null>(null)
  const pagination = ref<PaginationState>({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  })
  
  const loading = ref<LoadingState>({
    creating: false,
    fetching: false,
    updating: false,
    deleting: false,
    fetchingById: false,
    confirming: false
  })
  
  const errors = ref<ErrorState>({
    create: null,
    fetch: null,
    update: null,
    delete: null,
    fetchById: null,
    confirm: null
  })

  // Computed properties
  const isLoading = computed(() => {
    return Object.values(loading.value).some(state => state)
  })

  const hasErrors = computed(() => {
    return Object.values(errors.value).some(error => error !== null)
  })

  const totalInvitations = computed(() => pagination.value.totalCount)

  const canLoadMore = computed(() => pagination.value.hasNextPage)

  // Función para limpiar errores
  const clearErrors = () => {
    Object.keys(errors.value).forEach(key => {
      errors.value[key as keyof ErrorState] = null
    })
  }

  // Función para limpiar un error específico
  const clearError = (errorType: keyof ErrorState) => {
    errors.value[errorType] = null
  }

  // Función para manejar errores
  const handleError = (errorType: keyof ErrorState, error: any) => {
    const errorMessage = error?.message || error?.data?.message || 'Ha ocurrido un error inesperado'
    errors.value[errorType] = errorMessage
    console.error(`Error in ${errorType}:`, error)
  }

  /**
   * Crear una nueva invitación
   */
  const createInvitation = async (invitationData: CreateInvitationRequest): Promise<IInvitation | null> => {
    loading.value.creating = true
    clearError('create')
    
    try {
      const response = await invitationService.createInvitation(invitationData)
      const newInvitation = response.data.invitation
      
      if (newInvitation) {
        // Agregar la nueva invitación al inicio de la lista
        invitations.value.unshift(newInvitation)
        pagination.value.totalCount += 1
        return newInvitation
      }
      
      return null
    } catch (error) {
      handleError('create', error)
      return null
    } finally {
      loading.value.creating = false
    }
  }

  /**
   * Obtener todas las invitaciones con paginación
   */
  const fetchInvitations = async (params: PaginationParams = {}, append = false): Promise<void> => {
    loading.value.fetching = true
    clearError('fetch')
    
    try {
      const response = await invitationService.getAllInvitations(params)
      const { invitations: fetchedInvitations, pagination: paginationData } = response.data
      
      if (fetchedInvitations) {
        if (append) {
          // Agregar a la lista existente (para paginación infinita)
          invitations.value.push(...fetchedInvitations)
        } else {
          // Reemplazar la lista completa
          invitations.value = fetchedInvitations
        }
      }
      
      if (paginationData) {
        pagination.value = paginationData
      }
    } catch (error) {
      handleError('fetch', error)
    } finally {
      loading.value.fetching = false
    }
  }

  /**
   * Obtener una invitación por ID
   */
  const fetchInvitationById = async (id: string): Promise<IInvitation | null> => {
    loading.value.fetchingById = true
    clearError('fetchById')
    
    try {
      const response = await invitationService.getInvitationById(id)
      const invitation = response.data.invitation
      
      if (invitation) {
        currentInvitation.value = invitation
        return invitation
      }
      
      return null
    } catch (error) {
      handleError('fetchById', error)
      return null
    } finally {
      loading.value.fetchingById = false
    }
  }

  /**
   * Actualizar una invitación
   */
  const updateInvitation = async (
    id: string, 
    updateData: UpdateInvitationRequest
  ): Promise<IInvitation | null> => {
    loading.value.updating = true
    clearError('update')
    
    try {
      const response = await invitationService.updateInvitation(id, updateData)
      const updatedInvitation = response.data.invitation
      
      if (updatedInvitation) {
        // Actualizar en la lista de invitaciones
        const index = invitations.value.findIndex(inv => inv._id === id)
        if (index !== -1) {
          invitations.value[index] = updatedInvitation
        }
        
        // Actualizar la invitación actual si es la misma
        if (currentInvitation.value?._id === id) {
          currentInvitation.value = updatedInvitation
        }
        
        return updatedInvitation
      }
      
      return null
    } catch (error) {
      handleError('update', error)
      return null
    } finally {
      loading.value.updating = false
    }
  }

  /**
   * Eliminar una invitación
   */
  const deleteInvitation = async (id: string): Promise<boolean> => {
    loading.value.deleting = true
    clearError('delete')
    
    try {
      await invitationService.deleteInvitation(id)
      
      // Remover de la lista de invitaciones
      const index = invitations.value.findIndex(inv => inv._id === id)
      if (index !== -1) {
        invitations.value.splice(index, 1)
        pagination.value.totalCount -= 1
      }
      
      // Limpiar la invitación actual si es la misma
      if (currentInvitation.value?._id === id) {
        currentInvitation.value = null
      }
      
      return true
    } catch (error) {
      handleError('delete', error)
      return false
    } finally {
      loading.value.deleting = false
    }
  }

  /**
   * Confirmar o desconfirmar una invitación
   */
  const confirmInvitation = async (id: string, confirmed: boolean): Promise<IInvitation | null> => {
    loading.value.confirming = true
    clearError('confirm')
    
    try {
      const response = await invitationService.confirmInvitation(id, { confirmed })
      const confirmedInvitation = response.data.invitation
      
      if (confirmedInvitation) {
        // Actualizar en la lista de invitaciones
        const index = invitations.value.findIndex(inv => inv._id === id)
        if (index !== -1) {
          invitations.value[index] = confirmedInvitation
        }
        
        // Actualizar la invitación actual si es la misma
        if (currentInvitation.value?._id === id) {
          currentInvitation.value = confirmedInvitation
        }
        
        return confirmedInvitation
      }
      
      return null
    } catch (error) {
      handleError('confirm', error)
      return null
    } finally {
      loading.value.confirming = false
    }
  }

  /**
   * Cargar más invitaciones (paginación infinita)
   */
  const loadMoreInvitations = async (): Promise<void> => {
    if (!pagination.value.hasNextPage || loading.value.fetching) {
      return
    }
    
    await fetchInvitations(
      {
        page: pagination.value.currentPage + 1,
        limit: pagination.value.limit
      },
      true // append = true
    )
  }

  /**
   * Refrescar la lista de invitaciones
   */
  const refreshInvitations = async (): Promise<void> => {
    await fetchInvitations({ page: 1, limit: pagination.value.limit })
  }

  /**
   * Buscar una invitación en la lista local por ID
   */
  const findInvitationById = (id: string): IInvitation | undefined => {
    return invitations.value.find(inv => inv._id === id)
  }

  /**
   * Filtrar invitaciones por nombre de invitado
   */
  const filterInvitationsByName = (searchTerm: string): IInvitation[] => {
    if (!searchTerm.trim()) {
      return invitations.value
    }
    
    return invitations.value.filter(invitation =>
      invitation.guestName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  /**
   * Obtener estadísticas de invitaciones
   */
  const getInvitationStats = computed(() => {
    const totalGuests = invitations.value.reduce(
      (sum, invitation) => sum + invitation.numberOfCompanions + 1, // +1 para el invitado principal
      0
    )
    
    return {
      totalInvitations: invitations.value.length,
      totalGuests,
      averageCompanions: invitations.value.length > 0 
        ? (totalGuests - invitations.value.length) / invitations.value.length 
        : 0
    }
  })

  /**
   * Limpiar el estado del store
   */
  const clearStore = () => {
    invitations.value = []
    currentInvitation.value = null
    pagination.value = {
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      limit: 10,
      hasNextPage: false,
      hasPrevPage: false
    }
    clearErrors()
  }

  /**
   * Establecer la invitación actual
   */
  const setCurrentInvitation = (invitation: IInvitation | null) => {
    currentInvitation.value = invitation
  }

  return {
    // Estado
    invitations,
    currentInvitation,
    pagination,
    loading,
    errors,
    
    // Computed
    isLoading,
    hasErrors,
    totalInvitations,
    canLoadMore,
    getInvitationStats,
    
    // Acciones
    createInvitation,
    fetchInvitations,
    fetchInvitationById,
    updateInvitation,
    deleteInvitation,
    confirmInvitation,
    loadMoreInvitations,
    refreshInvitations,
    
    // Utilidades
    findInvitationById,
    filterInvitationsByName,
    clearStore,
    clearErrors,
    clearError,
    setCurrentInvitation
  }
})

export type InvitationStore = ReturnType<typeof useInvitationStore>