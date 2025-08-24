import axios from 'axios'
import type { AxiosResponse, AxiosRequestConfig } from 'axios'
import { ref } from 'vue'

// Extender la interfaz de AxiosRequestConfig para incluir metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: number
    }
  }
}

// Estado global para el aviso de conexión lenta
const showSlowWarning = ref(false)
const isSlowConnection = ref(false)

// Función para detectar conexión lenta basada en Network Information API
const checkNetworkSpeed = (): boolean => {
  const nav = navigator as any
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection
  
  if (connection) {
    const slowTypes = ['slow-2g', '2g']
    const is3gSlow = connection.effectiveType === '3g' && (connection.downlink || 0) < 1.5
    return slowTypes.includes(connection.effectiveType || '') || is3gSlow
  }
  
  return false
}

// Función para mostrar el aviso de conexión lenta
const showSlowConnectionWarning = () => {
  if (!showSlowWarning.value) {
    showSlowWarning.value = true
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      showSlowWarning.value = false
    }, 5000)
  }
}

// Función para ocultar el aviso manualmente
const hideSlowConnectionWarning = () => {
  showSlowWarning.value = false
}

// Exportar funciones y estado para uso global
export { showSlowWarning, hideSlowConnectionWarning }

class APIBase {
  private baseUrl: string
  private axiosInstance = axios.create()

  constructor() {
    this.baseUrl = import.meta.env.VITE_BAKANO_API || 'http://localhost:8100/api'
    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Interceptor de request para detectar conexión lenta inicial
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Verificar conexión lenta al inicio del request
        isSlowConnection.value = checkNetworkSpeed()
        
        // Agregar timestamp para medir duración
        config.metadata = { startTime: Date.now() }
        
        // Configurar timeout más corto para detectar conexiones lentas
        config.timeout = config.timeout || 15000 // 15 segundos
        
        return config
      },
      (error) => Promise.reject(error)
    )

    // Interceptor de response para detectar timeouts y respuestas lentas
    this.axiosInstance.interceptors.response.use(
      (response) => {
        const config = response.config as any
        const duration = Date.now() - (config.metadata?.startTime || 0)
        
        // Si el request tomó más de 5 segundos o hay conexión lenta, mostrar aviso
        if (duration > 5000 || isSlowConnection.value) {
          showSlowConnectionWarning()
        }
        
        return response
      },
      (error) => {
        // Detectar timeouts y errores de red
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          showSlowConnectionWarning()
        }
        
        // Si hay conexión lenta detectada, mostrar aviso
        if (isSlowConnection.value) {
          showSlowConnectionWarning()
        }
        
        return Promise.reject(error)
      }
    )
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint}`
  }

  protected getHeaders(): { [key: string]: string } {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    }

    const accessToken = localStorage.getItem('access_token')
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    } else {
      console.log('❌ DEBUG - No access token found in localStorage')
    }
    return headers
  }

  protected async get<T>(
    endpoint: string,
    headers?: { [key: string]: string },
  ): Promise<AxiosResponse<T>> {
    const url = this.buildUrl(endpoint)
    try {
      return await this.axiosInstance.get<T>(url, {
        headers: headers ? headers : this.getHeaders(),
      })
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorDetails = {
          status: error.response.status,
          message: error.response.data?.message || error.message,
        }
        throw errorDetails
      }

      throw { status: 500, message: 'Unknown error' }
    }
  }

  protected async post<T>(
    endpoint: string,
    data: unknown,
    headers?: { [key: string]: string },
  ): Promise<AxiosResponse<T>> {
    const url = this.buildUrl(endpoint)
    const isFormData = data instanceof FormData

    const finalHeaders = headers
      ? headers
      : isFormData
        ? { ...this.getHeaders() /* omit 'Content-Type' */ }
        : this.getHeaders()

    if (isFormData) {
      delete finalHeaders['Content-Type'] // ❗️ remove it if using FormData
    }

    try {
      return await this.axiosInstance.post<T>(url, data, {
        headers: finalHeaders,
      })
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw {
          status: error.response.status,
          message: error.response.data?.message || error.message,
        }
      }
      throw { status: 500, message: 'Unknown error' }
    }
  }

  protected async uploadFile<T>(endpoint: string, file: File): Promise<AxiosResponse<T>> {
    const url = this.buildUrl(endpoint)
    const formData = new FormData()

    if (!file) {
      throw new Error('No file provided')
    }

    formData.append('file', file)

    try {
      return await this.axiosInstance.post<T>(url, formData, {
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      })
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorDetails = {
          status: error.response.status,
          message: error.response.data?.message || error.message,
        }
        throw errorDetails
      }

      throw { status: 500, message: 'Unknown error' }
    }
  }

  protected async put<T>(endpoint: string, data: unknown): Promise<AxiosResponse<T>> {
    const url = this.buildUrl(endpoint)
    try {
      return await this.axiosInstance.put<T>(url, data, {
        headers: this.getHeaders(),
      })
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorDetails = {
          status: error.response.status,
          message: error.response.data?.message || error.message,
        }
        throw errorDetails
      }

      throw { status: 500, message: 'Unknown error' }
    }
  }

  protected async patch<T>(endpoint: string, data: unknown): Promise<AxiosResponse<T>> {
    const url = this.buildUrl(endpoint)
    try {
      return await this.axiosInstance.patch<T>(url, data, {
        headers: this.getHeaders(),
      })
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorDetails = {
          status: error.response.status,
          message: error.response.data?.message || error.message,
        }
        throw errorDetails
      }

      throw { status: 500, message: 'Unknown error' }
    }
  }

  protected async delete<T>(endpoint: string): Promise<AxiosResponse<T>> {
    const url = this.buildUrl(endpoint)
    try {
      return await this.axiosInstance.delete<T>(url, {
        headers: this.getHeaders(),
      })
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorDetails = {
          status: error.response.status,
          message: error.response.data?.message || error.message,
        }
        throw errorDetails
      }

      throw { status: 500, message: 'Unknown error' }
    }
  }
}

export default APIBase
