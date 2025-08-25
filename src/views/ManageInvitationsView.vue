<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInvitationStore } from '@/stores/invitationStore'
import type { IInvitation, UpdateInvitationRequest } from '@/services/invitationService'

const router = useRouter()
const invitationStore = useInvitationStore()

// Estado reactivo
const searchQuery = ref('')
const selectedInvitations = ref<string[]>([])
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref<'guestName' | 'numberOfCompanions' | 'createdAt' | 'confirmed'>('createdAt')
const sortOrder = ref<'asc' | 'desc'>('desc')
const confirmationFilter = ref<'all' | 'confirmed' | 'pending'>('all')

// Estado para edición
const editingInvitation = reactive({
  id: '',
  guestName: '',
  numberOfCompanions: 0
})

// Estado para eliminación
const deletingInvitation = ref<IInvitation | null>(null)

// Computed properties
const filteredInvitations = computed(() => {
  let filtered = invitationStore.invitations.filter(invitation => {
    const matchesSearch = invitation.guestName.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesConfirmation = confirmationFilter.value === 'all' ||
      (confirmationFilter.value === 'confirmed' && invitation.confirmed) ||
      (confirmationFilter.value === 'pending' && !invitation.confirmed)

    return matchesSearch && matchesConfirmation
  })

  // Ordenamiento
  filtered.sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy.value) {
      case 'guestName':
        aValue = a.guestName.toLowerCase()
        bValue = b.guestName.toLowerCase()
        break
      case 'numberOfCompanions':
        aValue = a.numberOfCompanions
        bValue = b.numberOfCompanions
        break
      case 'createdAt':
        aValue = new Date(a.createdAt)
        bValue = new Date(b.createdAt)
        break
      case 'confirmed':
        aValue = a.confirmed ? 1 : 0
        bValue = b.confirmed ? 1 : 0
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return filtered
})

const paginatedInvitations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredInvitations.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredInvitations.value.length / itemsPerPage.value)
})

const isAllSelected = computed(() => {
  return paginatedInvitations.value.length > 0 &&
    selectedInvitations.value.length === paginatedInvitations.value.length
})

const invitationStats = computed(() => {
  const stats = invitationStore.getInvitationStats
  const confirmedInvitations = invitationStore.invitations.filter(inv => inv.confirmed).length
  const pendingInvitations = invitationStore.invitations.filter(inv => !inv.confirmed).length
  const confirmedGuests = invitationStore.invitations
    .filter(inv => inv.confirmed)
    .reduce((total, invitation) => {
      return total + 1 + invitation.numberOfCompanions
    }, 0)

  return {
    ...stats,
    confirmedInvitations,
    pendingInvitations,
    confirmedGuests
  }
})

// Métodos
const loadInvitations = async () => {
  try {
    await invitationStore.fetchInvitations({ page: 1, limit: 100 })
  } catch (error) {
    console.error('Error loading invitations:', error)
  }
}

const openEditModal = (invitation: IInvitation) => {
  editingInvitation.id = invitation._id
  editingInvitation.guestName = invitation.guestName
  editingInvitation.numberOfCompanions = invitation.numberOfCompanions
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingInvitation.id = ''
  editingInvitation.guestName = ''
  editingInvitation.numberOfCompanions = 0
}

const saveInvitation = async () => {
  try {
    const updateData: UpdateInvitationRequest = {
      guestName: editingInvitation.guestName,
      numberOfCompanions: editingInvitation.numberOfCompanions
    }

    await invitationStore.updateInvitation(editingInvitation.id, updateData)
    closeEditModal()
  } catch (error) {
    console.error('Error updating invitation:', error)
  }
}

const openDeleteModal = (invitation: IInvitation) => {
  deletingInvitation.value = invitation
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deletingInvitation.value = null
}

const confirmDelete = async () => {
  if (deletingInvitation.value) {
    try {
      await invitationStore.deleteInvitation(deletingInvitation.value._id)
      closeDeleteModal()
    } catch (error) {
      console.error('Error deleting invitation:', error)
    }
  }
}

const deleteSelectedInvitations = async () => {
  try {
    for (const id of selectedInvitations.value) {
      await invitationStore.deleteInvitation(id)
    }
    selectedInvitations.value = []
  } catch (error) {
    console.error('Error deleting invitations:', error)
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedInvitations.value = []
  } else {
    selectedInvitations.value = paginatedInvitations.value.map(inv => inv._id)
  }
}

const toggleSort = (field: 'guestName' | 'numberOfCompanions' | 'createdAt' | 'confirmed') => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}

const toggleConfirmation = async (invitationId: string) => {
  try {
    const invitation = invitationStore.invitations.find(inv => inv._id === invitationId)
    if (invitation) {
      await invitationStore.confirmInvitation(invitationId, !invitation.confirmed)
    }
  } catch (error) {
    console.error('Error al cambiar estado de confirmación:', error)
  }
}

const goToCreateInvitation = () => {
  router.push('/create-invitation')
}

const generateInvitationUrl = (invitation: IInvitation) => {
  const guestNameForUrl = invitation.guestName.toLowerCase().replace(/\s+/g, '-')
  return `${window.location.origin}/invitation/${guestNameForUrl}?companions=${invitation.numberOfCompanions}&id=${invitation._id}`
}

const copyInvitationUrl = async (invitation: IInvitation) => {
  const url = generateInvitationUrl(invitation)
  try {
    await navigator.clipboard.writeText(url)
    // Aquí podrías agregar una notificación de éxito
  } catch (error) {
    console.error('Error copying URL:', error)
  }
}

const shareViaWhatsApp = (invitation: IInvitation) => {
  const url = generateInvitationUrl(invitation)
  const message = `¡Hola ${invitation.guestName}! Te invitamos a nuestra boda. Aquí tienes tu invitación personalizada: ${url}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}

// Lifecycle
onMounted(() => {
  loadInvitations()
})
</script>

<template>
  <div class="manage-invitations-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <i class="fas fa-list-alt header-icon"></i>
          <h1 class="main-title">Gestión de Invitaciones</h1>
          <p class="subtitle">Administra todas las invitaciones de tu boda</p>
        </div>
        
        <button @click="goToCreateInvitation" class="create-button">
          <i class="fas fa-plus"></i>
          Nueva Invitación
        </button>
      </div>
      
      <!-- Estadísticas -->
      <div class="stats-grid">
        <div class="stat-card">
          <i class="fas fa-envelope"></i>
          <div class="stat-content">
            <span class="stat-number">{{ invitationStats.totalInvitations }}</span>
            <span class="stat-label">Total Invitaciones</span>
          </div>
        </div>
        <div class="stat-card confirmed">
          <i class="fas fa-check-circle"></i>
          <div class="stat-content">
            <span class="stat-number">{{ invitationStats.confirmedInvitations }}</span>
            <span class="stat-label">Confirmadas</span>
          </div>
        </div>
        <div class="stat-card pending">
          <i class="fas fa-clock"></i>
          <div class="stat-content">
            <span class="stat-number">{{ invitationStats.pendingInvitations }}</span>
            <span class="stat-label">Pendientes</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-users"></i>
          <div class="stat-content">
            <span class="stat-number">{{ invitationStats.confirmedGuests }}</span>
            <span class="stat-label">Invitados Confirmados</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="search-container">
        <i class="fas fa-search search-icon"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre del invitado..."
          class="search-input"
        >
      </div>
      
      <!-- Filtro de confirmación -->
      <div class="confirmation-filter">
        <select v-model="confirmationFilter" class="filter-select">
          <option value="all">Todas las invitaciones</option>
          <option value="confirmed">Confirmadas</option>
          <option value="pending">Pendientes</option>
        </select>
      </div>
      
      <div class="actions-container">
        <button
          v-if="selectedInvitations.length > 0"
          @click="deleteSelectedInvitations"
          class="bulk-delete-button"
        >
          <i class="fas fa-trash"></i>
          Eliminar Seleccionados ({{ selectedInvitations.length }})
        </button>
        
        <select v-model="itemsPerPage" class="items-per-page">
          <option value="10">10 por página</option>
          <option value="25">25 por página</option>
          <option value="50">50 por página</option>
        </select>
      </div>
    </div>

    <!-- Invitations Table -->
    <div class="table-container">
      <div v-if="invitationStore.isLoading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Cargando invitaciones...</p>
      </div>
      
      <div v-else-if="filteredInvitations.length === 0" class="empty-state">
        <i class="fas fa-inbox"></i>
        <h3>No hay invitaciones</h3>
        <p v-if="searchQuery">No se encontraron invitaciones que coincidan con "{{ searchQuery }}"</p>
        <p v-else>Aún no has creado ninguna invitación</p>
        <button @click="goToCreateInvitation" class="create-first-button">
          <i class="fas fa-plus"></i>
          Crear Primera Invitación
        </button>
      </div>
      
      <table v-else class="invitations-table">
        <thead>
          <tr>
            <th class="checkbox-column">
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
                class="checkbox"
              >
            </th>
            <th @click="toggleSort('guestName')" class="sortable">
              Nombre del Invitado
              <i class="fas fa-sort sort-icon" :class="{
                'fa-sort-up': sortBy === 'guestName' && sortOrder === 'asc',
                'fa-sort-down': sortBy === 'guestName' && sortOrder === 'desc'
              }"></i>
            </th>
            <th @click="toggleSort('numberOfCompanions')" class="sortable">
              Acompañantes
              <i class="fas fa-sort sort-icon" :class="{
                'fa-sort-up': sortBy === 'numberOfCompanions' && sortOrder === 'asc',
                'fa-sort-down': sortBy === 'numberOfCompanions' && sortOrder === 'desc'
              }"></i>
            </th>
            <th @click="toggleSort('createdAt')" class="sortable">
              Fecha de Creación
              <i class="fas fa-sort sort-icon" :class="{
                'fa-sort-up': sortBy === 'createdAt' && sortOrder === 'asc',
                'fa-sort-down': sortBy === 'createdAt' && sortOrder === 'desc'
              }"></i>
            </th>
            <th @click="toggleSort('confirmed')" class="sortable">
              Estado
              <i class="fas fa-sort sort-icon" :class="{
                'fa-sort-up': sortBy === 'confirmed' && sortOrder === 'asc',
                'fa-sort-down': sortBy === 'confirmed' && sortOrder === 'desc'
              }"></i>
            </th>
            <th class="actions-column">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invitation in paginatedInvitations" :key="invitation._id" class="invitation-row">
            <td class="checkbox-column">
              <input
                type="checkbox"
                :value="invitation._id"
                v-model="selectedInvitations"
                class="checkbox"
              >
            </td>
            <td class="guest-name">
              <div class="guest-info">
                <span class="name">{{ invitation.guestName }}</span>
                <small class="id">ID: {{ invitation._id.slice(0, 8) }}...</small>
              </div>
            </td>
            <td class="companions">
              <span class="companions-badge">{{ invitation.numberOfCompanions }}</span>
            </td>
            <td class="created-date">
              {{ new Date(invitation.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) }}
            </td>
            <td class="confirmation-status">
              <button
                @click="toggleConfirmation(invitation._id)"
                class="confirmation-toggle"
                :class="{ 'confirmed': invitation.confirmed, 'pending': !invitation.confirmed }"
              >
                <i :class="invitation.confirmed ? 'fas fa-check-circle' : 'fas fa-clock'"></i>
                {{ invitation.confirmed ? 'Confirmada' : 'Pendiente' }}
              </button>
            </td>
            <td class="actions-column">
              <div class="action-buttons">
                <button
                  @click="copyInvitationUrl(invitation)"
                  class="action-button copy-button"
                  title="Copiar URL"
                >
                  <i class="fas fa-copy"></i>
                </button>
                <button
                  @click="shareViaWhatsApp(invitation)"
                  class="action-button whatsapp-button"
                  title="Compartir por WhatsApp"
                >
                  <i class="fab fa-whatsapp"></i>
                </button>
                <button
                  @click="openEditModal(invitation)"
                  class="action-button edit-button"
                  title="Editar"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="openDeleteModal(invitation)"
                  class="action-button delete-button"
                  title="Eliminar"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination-container">
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="pagination-button"
      >
        <i class="fas fa-chevron-left"></i>
        Anterior
      </button>
      
      <div class="pagination-info">
        Página {{ currentPage }} de {{ totalPages }}
      </div>
      
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="pagination-button"
      >
        Siguiente
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Editar Invitación</h3>
          <button @click="closeEditModal" class="close-button">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-user"></i>
              Nombre del Invitado
            </label>
            <input
              v-model="editingInvitation.guestName"
              type="text"
              class="form-input"
              placeholder="Nombre completo del invitado"
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-users"></i>
              Número de Acompañantes
            </label>
            <div class="number-input-container">
              <button
                @click="editingInvitation.numberOfCompanions = Math.max(0, editingInvitation.numberOfCompanions - 1)"
                class="number-btn"
                type="button"
              >
                <i class="fas fa-minus"></i>
              </button>
              <input
                v-model.number="editingInvitation.numberOfCompanions"
                type="number"
                min="0"
                max="10"
                class="number-input"
              >
              <button
                @click="editingInvitation.numberOfCompanions = Math.min(10, editingInvitation.numberOfCompanions + 1)"
                class="number-btn"
                type="button"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeEditModal" class="cancel-button">
            Cancelar
          </button>
          <button @click="saveInvitation" class="save-button" :disabled="invitationStore.loading.updating">
            <i v-if="invitationStore.loading.updating" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            {{ invitationStore.loading.updating ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content delete-modal" @click.stop>
        <div class="modal-header">
          <h3>Confirmar Eliminación</h3>
          <button @click="closeDeleteModal" class="close-button">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="delete-warning">
            <i class="fas fa-exclamation-triangle"></i>
            <p>¿Estás seguro de que deseas eliminar la invitación de <strong>{{ deletingInvitation?.guestName }}</strong>?</p>
            <p class="warning-text">Esta acción no se puede deshacer.</p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeDeleteModal" class="cancel-button">
            Cancelar
          </button>
          <button @click="confirmDelete" class="delete-confirm-button" :disabled="invitationStore.loading.deleting">
            <i v-if="invitationStore.loading.deleting" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-trash"></i>
            {{ invitationStore.loading.deleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.modules.scss' as *;

.manage-invitations-container {
  min-height: 100vh;
  background: linear-gradient(135deg, $background-color 0%, color.adjust($background-color, $lightness: 3%) 100%);
  padding: 2rem 1rem;
}

.header-section {
  max-width: 1200px;
  margin: 0 auto 3rem;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1.5rem;
    }
  }

  .title-section {
    text-align: left;

    @media (max-width: 768px) {
      text-align: center;
    }
  }

  .header-icon {
    font-size: 3rem;
    color: $primary-color;
    margin-bottom: 1rem;
  }

  .main-title {
    @include heading-font(700);
    font-size: 2.5rem;
    color: $primary-color;
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  .subtitle {
    @include body-font(400);
    font-size: 1.1rem;
    color: $charcoal;
  }

  .create-button {
    @include body-font(600);
    padding: 1rem 2rem;
    background: linear-gradient(135deg, $primary-color 0%, color.adjust($primary-color, $lightness: -10%) 100%);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba($primary-color, 0.3);
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  i {
    font-size: 2rem;
    color: $secondary-color;
    width: 40px;
    text-align: center;
  }

  &.confirmed {
    border-left: 4px solid #28a745;

    i {
      color: #28a745;
    }
  }

  &.pending {
    border-left: 4px solid #ffc107;

    i {
      color: #ffc107;
    }
  }

  .stat-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stat-number {
    @include heading-font(700);
    font-size: 1.8rem;
    color: $primary-color;
    line-height: 1;
  }

  .stat-label {
    @include body-font(500);
    font-size: 0.875rem;
    color: $charcoal;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.filters-section {
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.search-container {
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: none;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: $charcoal;
    opacity: 0.6;
  }

  .search-input {
    @include body-font(400);
    padding: 1rem 1rem 1rem 3rem;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 4px rgba($primary-color, 0.1);
    }
  }
}

.actions-container {
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    justify-content: space-between;
  }
}

.bulk-delete-button {
  @include body-font(600);
  padding: 0.75rem 1.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: color.adjust(#dc3545, $lightness: -10%);
  }
}

.items-per-page,
.filter-select {
  @include body-font(400);
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: $primary-color;
  }
}

.confirmation-filter {
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    order: -1;
    width: 100%;
  }
}

.table-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;

  @media (max-width: 768px) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 0 -1rem;
    border-radius: 0;
  }
}

.loading-state,
.empty-state {
  padding: 4rem 2rem;
  text-align: center;

  i {
    font-size: 3rem;
    color: $secondary-color;
    margin-bottom: 1rem;
  }

  h3 {
    @include heading-font(600);
    font-size: 1.5rem;
    color: $primary-color;
    margin-bottom: 0.5rem;
  }

  p {
    @include body-font(400);
    color: $charcoal;
    margin-bottom: 1.5rem;
  }
}

.create-first-button {
  @include body-font(600);
  padding: 1rem 2rem;
  background: $primary-color;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba($primary-color, 0.3);
  }
}

.invitations-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px; // Ancho mínimo para scroll horizontal

  @media (max-width: 768px) {
    min-width: 900px; // Asegurar scroll horizontal en móviles
  }

  th {
    @include body-font(600);
    padding: 1rem;
    text-align: left;
    background: $background-color;
    color: $primary-color;
    border-bottom: 2px solid #e9ecef;
    white-space: nowrap; // Evitar que el texto se corte

    @media (max-width: 768px) {
      padding: 0.75rem 0.5rem;
      font-size: 0.85rem;
    }

    &.sortable {
      cursor: pointer;
      user-select: none;
      transition: background-color 0.3s ease;

      &:hover {
        background: color.adjust($background-color, $lightness: -3%);
      }
    }

    &.checkbox-column {
      width: 80px;
      text-align: center;
      min-width: 60px;
    }

    &.actions-column {
      width: 200px;
      text-align: center;
      min-width: 180px;

      @media (max-width: 768px) {
        min-width: 160px;
      }
    }
  }

  td {
    @include body-font(400);
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
    vertical-align: middle;
    white-space: nowrap; // Evitar que el texto se corte

    @media (max-width: 768px) {
      padding: 0.75rem 0.5rem;
      font-size: 0.85rem;
    }

    &.checkbox-column {
      text-align: center;
    }

    &.guest-name {
      min-width: 180px;

      @media (max-width: 768px) {
        min-width: 150px;
      }
    }

    &.companions {
      min-width: 100px;
      text-align: center;
    }

    &.created-date {
      min-width: 140px;

      @media (max-width: 768px) {
        min-width: 120px;
      }
    }

    &.confirmation-status {
      min-width: 130px;
      text-align: center;

      @media (max-width: 768px) {
        min-width: 110px;
      }
    }
  }

  .invitation-row {
    transition: background-color 0.3s ease;

    &:hover {
      background: rgba($background-color, 0.5);
    }
  }
}

.sort-icon {
  margin-left: 0.5rem;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.guest-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .name {
    font-weight: 600;
    color: $primary-color;
  }

  .id {
    font-size: 0.75rem;
    color: $charcoal;
    opacity: 0.7;
  }
}

.companions-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: $secondary-color;
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.875rem;
}

.confirmation-toggle {
  @include body-font(600);
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    gap: 0.3rem;
  }

  &.confirmed {
    background: #28a745;
    color: white;

    &:hover {
      background: color.adjust(#28a745, $lightness: -10%);
    }
  }

  &.pending {
    background: #ffc107;
    color: #212529;

    &:hover {
      background: color.adjust(#ffc107, $lightness: -10%);
    }
  }
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    gap: 0.3rem;
  }
}

.action-button {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }

  &.copy-button {
    background: $accent-color;
    color: white;

    &:hover {
      background: color.adjust($accent-color, $lightness: -10%);
    }
  }

  &.whatsapp-button {
    background: #25d366;
    color: white;

    &:hover {
      background: color.adjust(#25d366, $lightness: -10%);
    }
  }

  &.edit-button {
    background: $primary-color;
    color: white;

    &:hover {
      background: color.adjust($primary-color, $lightness: -10%);
    }
  }

  &.delete-button {
    background: #dc3545;
    color: white;

    &:hover {
      background: color.adjust(#dc3545, $lightness: -10%);
    }
  }
}

.pagination-container {
  max-width: 1200px;
  margin: 2rem auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
}

.pagination-button {
  @include body-font(600);
  padding: 0.75rem 1.5rem;
  background: white;
  color: $primary-color;
  border: 2px solid $primary-color;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: $primary-color;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.pagination-info {
  @include body-font(500);
  color: $charcoal;
}

// Modal Styles
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;

  &.delete-modal {
    max-width: 400px;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;

  h3 {
    @include heading-font(600);
    font-size: 1.25rem;
    color: $primary-color;
    margin: 0;
  }

  .close-button {
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    color: $charcoal;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
      background: #e9ecef;
    }
  }
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.form-group {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  @include body-font(600);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: $primary-color;
  margin-bottom: 0.5rem;

  i {
    color: $secondary-color;
  }
}

.form-input {
  @include body-font(400);
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 4px rgba($primary-color, 0.1);
  }
}

.number-input-container {
  display: flex;
  align-items: center;
  gap: 0;
  max-width: 200px;

  .number-btn {
    @include body-font(600);
    width: 40px;
    height: 40px;
    border: 2px solid #e9ecef;
    background: white;
    color: $primary-color;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:first-child {
      border-radius: 8px 0 0 8px;
      border-right: none;
    }

    &:last-child {
      border-radius: 0 8px 8px 0;
      border-left: none;
    }

    &:hover {
      background: $primary-color;
      color: white;
    }
  }

  .number-input {
    @include body-font(600);
    width: 60px;
    height: 40px;
    border: 2px solid #e9ecef;
    border-left: none;
    border-right: none;
    text-align: center;
    font-size: 1rem;
    background: white;

    &:focus {
      outline: none;
      border-color: $primary-color;
    }
  }
}

.cancel-button {
  @include body-font(600);
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: $charcoal;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e9ecef;
  }
}

.save-button {
  @include body-font(600);
  padding: 0.75rem 1.5rem;
  background: $primary-color;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: color.adjust($primary-color, $lightness: -10%);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.delete-confirm-button {
  @include body-font(600);
  padding: 0.75rem 1.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: color.adjust(#dc3545, $lightness: -10%);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.delete-warning {
  text-align: center;

  i {
    font-size: 3rem;
    color: #dc3545;
    margin-bottom: 1rem;
  }

  p {
    @include body-font(400);
    color: $charcoal;
    margin-bottom: 0.5rem;

    &.warning-text {
      font-size: 0.875rem;
      color: #dc3545;
      font-style: italic;
    }
  }
}

.checkbox {
  width: 18px;
  height: 18px;
  accent-color: $primary-color;
  cursor: pointer;
}
</style>