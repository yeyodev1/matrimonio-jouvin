/**
 * Utilidades para generar URLs profesionales de invitaciones
 * 
 * Este archivo contiene funciones helper para crear URLs semánticas y profesionales
 * que incluyen el nombre del invitado en la ruta, mejorando la experiencia del usuario
 * y el SEO de la aplicación.
 */

export interface InvitationUrlParams {
  guestName: string
  companions?: number
  invitationId?: string
}

/**
 * Formatea un nombre de invitado para uso en URLs
 * Convierte espacios en guiones y codifica caracteres especiales
 * 
 * @param name - Nombre del invitado
 * @returns Nombre formateado para URL
 * 
 * @example
 * formatGuestNameForUrl('María José García') // 'Mar%C3%ADa-Jos%C3%A9-Garc%C3%ADa'
 * formatGuestNameForUrl('Juan & Ana') // 'Juan-%26-Ana'
 */
export const formatGuestNameForUrl = (name: string): string => {
  return encodeURIComponent(name.trim().replace(/\s+/g, '-'))
}

/**
 * Decodifica un nombre de invitado desde una URL
 * Convierte guiones en espacios y decodifica caracteres especiales
 * 
 * @param encodedName - Nombre codificado desde la URL
 * @returns Nombre decodificado y formateado
 * 
 * @example
 * decodeGuestNameFromUrl('Mar%C3%ADa-Jos%C3%A9-Garc%C3%ADa') // 'María José García'
 * decodeGuestNameFromUrl('Juan-%26-Ana') // 'Juan & Ana'
 */
export const decodeGuestNameFromUrl = (encodedName: string): string => {
  return decodeURIComponent(encodedName).replace(/-/g, ' ')
}

/**
 * Genera una URL profesional para una invitación específica
 * 
 * @param params - Parámetros de la invitación
 * @returns URL completa de la invitación
 * 
 * @example
 * generateInvitationUrl({
 *   guestName: 'María José García',
 *   companions: 2,
 *   invitationId: 'inv-123'
 * })
 * // '/invitation/Mar%C3%ADa-Jos%C3%A9-Garc%C3%ADa?companions=2&id=inv-123'
 */
export const generateInvitationUrl = (params: InvitationUrlParams): string => {
  const { guestName, companions, invitationId } = params
  
  // Formatear el nombre para la URL
  const formattedName = formatGuestNameForUrl(guestName)
  
  // Construir la URL base
  let url = `/invitation/${formattedName}`
  
  // Agregar query parameters si existen
  const queryParams = new URLSearchParams()
  
  if (companions && companions > 0) {
    queryParams.append('companions', companions.toString())
  }
  
  if (invitationId) {
    queryParams.append('id', invitationId)
  }
  
  const queryString = queryParams.toString()
  return queryString ? `${url}?${queryString}` : url
}

/**
 * Genera una URL completa (con dominio) para compartir
 * 
 * @param params - Parámetros de la invitación
 * @param baseUrl - URL base del sitio (opcional, se detecta automáticamente)
 * @returns URL completa para compartir
 * 
 * @example
 * generateShareableUrl({
 *   guestName: 'María José García',
 *   companions: 2
 * })
 * // 'https://mi-boda.com/invitation/Mar%C3%ADa-Jos%C3%A9-Garc%C3%ADa?companions=2'
 */
export const generateShareableUrl = (params: InvitationUrlParams, baseUrl?: string): string => {
  const relativePath = generateInvitationUrl(params)
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  return `${base}${relativePath}`
}

/**
 * Ejemplos de URLs profesionales para diferentes tipos de invitados
 */
export const urlExamples = {
  // Invitado individual
  individual: generateInvitationUrl({
    guestName: 'María García',
    invitationId: 'inv-001'
  }),
  
  // Pareja
  couple: generateInvitationUrl({
    guestName: 'Juan y Ana Pérez',
    companions: 1,
    invitationId: 'inv-002'
  }),
  
  // Familia
  family: generateInvitationUrl({
    guestName: 'Familia Rodríguez',
    companions: 3,
    invitationId: 'inv-003'
  }),
  
  // Invitado con caracteres especiales
  specialChars: generateInvitationUrl({
    guestName: 'José María & Sofía',
    companions: 1,
    invitationId: 'inv-004'
  })
}

/**
 * Valida si una URL de invitación tiene el formato correcto
 * 
 * @param url - URL a validar
 * @returns true si la URL es válida
 */
export const isValidInvitationUrl = (url: string): boolean => {
  const invitationUrlPattern = /^\/invitation\/[^/]+(?:\?.*)?$/
  return invitationUrlPattern.test(url)
}

/**
 * Extrae los parámetros de una URL de invitación
 * 
 * @param url - URL de invitación
 * @returns Parámetros extraídos o null si la URL no es válida
 */
export const parseInvitationUrl = (url: string): InvitationUrlParams | null => {
  if (!isValidInvitationUrl(url)) {
    return null
  }
  
  try {
    const urlObj = new URL(url, 'http://localhost')
    const pathParts = urlObj.pathname.split('/')
    const encodedGuestName = pathParts[2]
    
    if (!encodedGuestName) {
      return null
    }
    
    const guestName = decodeGuestNameFromUrl(encodedGuestName)
    const companions = urlObj.searchParams.get('companions')
    const invitationId = urlObj.searchParams.get('id')
    
    return {
      guestName,
      companions: companions ? parseInt(companions, 10) : undefined,
      invitationId: invitationId || undefined
    }
  } catch {
    return null
  }
}