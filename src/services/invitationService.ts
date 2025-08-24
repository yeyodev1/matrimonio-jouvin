import APIBase from './httpBase'
import type { AxiosResponse } from 'axios'

// Interface para la invitación basada en el modelo
export interface IInvitation {
  _id: string
  guestName: string
  numberOfCompanions: number
  createdAt: string
  updatedAt: string
}

// Interface para crear una nueva invitación
export interface CreateInvitationRequest {
  guestName: string
  numberOfCompanions: number
}

// Interface para actualizar una invitación
export interface UpdateInvitationRequest {
  guestName?: string
  numberOfCompanions?: number
}

// Interface para la respuesta de la API
export interface APIResponse<T> {
  message: string
  invitation?: T
  invitations?: T[]
  pagination?: {
    currentPage: number
    totalPages: number
    totalCount: number
    limit: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// Interface para parámetros de paginación
export interface PaginationParams {
  page?: number
  limit?: number
}

class InvitationService extends APIBase {
  private readonly endpoint = 'invitations'

  /**
   * Crear una nueva invitación
   * @param invitationData - Datos de la invitación a crear
   * @returns Promise con la respuesta de la API
   */
  async createInvitation(
    invitationData: CreateInvitationRequest
  ): Promise<AxiosResponse<APIResponse<IInvitation>>> {
    try {
      const response = await this.post<APIResponse<IInvitation>>(
        this.endpoint,
        invitationData
      )
      return response
    } catch (error) {
      console.error('Error creating invitation:', error)
      throw error
    }
  }

  /**
   * Obtener todas las invitaciones con paginación
   * @param params - Parámetros de paginación
   * @returns Promise con la respuesta de la API
   */
  async getAllInvitations(
    params: PaginationParams = {}
  ): Promise<AxiosResponse<APIResponse<IInvitation>>> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.page) {
        queryParams.append('page', params.page.toString())
      }
      
      if (params.limit) {
        queryParams.append('limit', params.limit.toString())
      }

      const endpoint = queryParams.toString() 
        ? `${this.endpoint}?${queryParams.toString()}`
        : this.endpoint

      const response = await this.get<APIResponse<IInvitation>>(endpoint)
      return response
    } catch (error) {
      console.error('Error getting all invitations:', error)
      throw error
    }
  }

  /**
   * Obtener una invitación por ID
   * @param id - ID de la invitación
   * @returns Promise con la respuesta de la API
   */
  async getInvitationById(
    id: string
  ): Promise<AxiosResponse<APIResponse<IInvitation>>> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Invitation ID is required')
      }

      const response = await this.get<APIResponse<IInvitation>>(
        `${this.endpoint}/${id}`
      )
      return response
    } catch (error) {
      console.error('Error getting invitation by ID:', error)
      throw error
    }
  }

  /**
   * Actualizar una invitación
   * @param id - ID de la invitación
   * @param updateData - Datos a actualizar
   * @returns Promise con la respuesta de la API
   */
  async updateInvitation(
    id: string,
    updateData: UpdateInvitationRequest
  ): Promise<AxiosResponse<APIResponse<IInvitation>>> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Invitation ID is required')
      }

      if (!updateData.guestName && updateData.numberOfCompanions === undefined) {
        throw new Error('At least one field (guestName or numberOfCompanions) is required for update')
      }

      const response = await this.put<APIResponse<IInvitation>>(
        `${this.endpoint}/${id}`,
        updateData
      )
      return response
    } catch (error) {
      console.error('Error updating invitation:', error)
      throw error
    }
  }

  /**
   * Eliminar una invitación
   * @param id - ID de la invitación
   * @returns Promise con la respuesta de la API
   */
  async deleteInvitation(
    id: string
  ): Promise<AxiosResponse<APIResponse<IInvitation>>> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Invitation ID is required')
      }

      const response = await this.delete<APIResponse<IInvitation>>(
        `${this.endpoint}/${id}`
      )
      return response
    } catch (error) {
      console.error('Error deleting invitation:', error)
      throw error
    }
  }

  /**
   * Verificar el estado de salud de la API
   * @returns Promise con la respuesta de la API
   */
  async healthCheck(): Promise<AxiosResponse<{ message: string; timestamp: string }>> {
    try {
      const response = await this.get<{ message: string; timestamp: string }>('health')
      return response
    } catch (error) {
      console.error('Error checking API health:', error)
      throw error
    }
  }
}

// Exportar una instancia singleton del servicio
const invitationService = new InvitationService()
export default invitationService

// También exportar la clase para casos donde se necesite una nueva instancia
export { InvitationService }