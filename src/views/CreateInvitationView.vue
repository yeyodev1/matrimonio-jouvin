<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInvitationStore } from '@/stores/invitationStore'
import { generateInvitationUrl as createInvitationUrl } from '@/utils/invitationUrls'
import type { CreateInvitationRequest } from '@/services/invitationService'

interface InvitationData {
  guestName: string
  numberOfGuests: number
  personalMessage: string
  invitationType: 'family' | 'friends' | 'formal'
}

const router = useRouter()
const invitationStore = useInvitationStore()

const form = reactive<InvitationData>({
  guestName: '',
  numberOfGuests: 1,
  personalMessage: '',
  invitationType: 'family'
})

const isGenerating = ref(false)
const generatedInvitation = ref<string>('')
const showPreview = ref(false)
const errors = ref<Record<string, string>>({})
const showSuccessMessage = ref(false)
const createdInvitation = ref<any>(null)

const invitationTypes = [
  { value: 'family', label: 'Familia', icon: 'fas fa-home', description: 'Tono cálido y familiar' },
  { value: 'friends', label: 'Amigos', icon: 'fas fa-users', description: 'Tono casual y amigable' },
  { value: 'formal', label: 'Formal', icon: 'fas fa-crown', description: 'Tono elegante y formal' }
]

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.guestName.trim()) {
    errors.value.guestName = 'El nombre del invitado es requerido'
  }

  if (form.numberOfGuests < 1 || form.numberOfGuests > 15) {
    errors.value.numberOfGuests = 'El número de invitados debe estar entre 1 y 15'
  }

  return Object.keys(errors.value).length === 0
}

const generateInvitationUrl = async () => {
  if (!validateForm()) return

  isGenerating.value = true
  showSuccessMessage.value = false

  try {
    // Crear la invitación en el backend
    const invitationData: CreateInvitationRequest = {
      guestName: form.guestName.trim(),
      numberOfCompanions: form.numberOfGuests - 1 // Restar 1 porque numberOfGuests incluye al invitado principal
    }

    const newInvitation = await invitationStore.createInvitation(invitationData)

    if (newInvitation) {
      createdInvitation.value = newInvitation

      // Generar URL profesional con el nombre del invitado en la ruta
      const invitationUrl = createInvitationUrl({
        guestName: form.guestName.trim(),
        companions: form.numberOfGuests - 1, // Acompañantes (sin contar al invitado principal)
        invitationId: newInvitation._id
      })

      generatedInvitation.value = `${window.location.origin}${invitationUrl}`
      showPreview.value = true
      showSuccessMessage.value = true
    } else {
      // Manejar error de creación
      errors.value.general = 'Error al crear la invitación. Por favor, intenta nuevamente.'
    }
  } catch (error) {
    console.error('Error creating invitation:', error)
    errors.value.general = 'Error al crear la invitación. Por favor, intenta nuevamente.'
  } finally {
    isGenerating.value = false
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(generatedInvitation.value)
    // Aquí podrías mostrar un toast de éxito
  } catch (err) {
    console.error('Error al copiar:', err)
  }
}

const shareViaWhatsApp = () => {
  const message = `¡Hola! Te comparto tu invitación personalizada para nuestra boda:\n\n${generatedInvitation.value}\n\n¡Esperamos verte ahí! 💕`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}

const resetForm = () => {
  Object.assign(form, {
    guestName: '',
    numberOfGuests: 1,
    personalMessage: '',
    invitationType: 'family'
  })
  errors.value = {}
  showPreview.value = false
  generatedInvitation.value = ''
  showSuccessMessage.value = false
  createdInvitation.value = null

  // Limpiar errores del store
  invitationStore.clearError('create')
}

const previewInvitation = () => {
  if (generatedInvitation.value) {
    window.open(generatedInvitation.value, '_blank')
  }
}

const goToManageInvitations = () => {
  router.push('/manage-invitations')
}

const guestText = computed(() => {
  if (form.numberOfGuests === 1) {
    return 'invitado'
  }
  return 'invitados'
})

// Computed para mostrar errores del store
const storeError = computed(() => {
  return invitationStore.errors.create
})

// Computed para mostrar estado de loading del store
const isCreating = computed(() => {
  return invitationStore.loading.creating
})

// Computed para mostrar estadísticas
const invitationStats = computed(() => {
  return invitationStore.getInvitationStats
})

// Cargar invitaciones existentes al montar el componente
onMounted(async () => {
  try {
    await invitationStore.fetchAllInvitations()
  } catch (error) {
    console.error('Error loading invitations:', error)
  }
})
</script>

<template>
  <div class="create-invitation-container">
    <!-- Botón de regreso al dashboard -->
    <button @click="goToManageInvitations" class="back-to-dashboard-button" title="Volver al Dashboard">
      <i class="fas fa-arrow-left"></i>
      <span>Dashboard</span>
    </button>
    
    <div class="header-section">
      <i class="fas fa-magic header-icon"></i>
      <h1 class="main-title">Crear Invitación Personalizada</h1>
      <p class="subtitle">Genera invitaciones únicas para cada uno de tus invitados</p>
      
      <!-- Estadísticas de invitaciones -->
      <div v-if="invitationStats.totalInvitations > 0" class="stats-container">
        <div class="stat-item">
          <i class="fas fa-envelope"></i>
          <div class="stat-content">
            <span class="stat-number">{{ invitationStats.totalInvitations }}</span>
            <span class="stat-label">Invitaciones</span>
          </div>
        </div>
        <div class="stat-item">
          <i class="fas fa-users"></i>
          <div class="stat-content">
            <span class="stat-number">{{ invitationStats.totalGuests }}</span>
            <span class="stat-label">Invitados</span>
          </div>
        </div>
        <div class="stat-item">
          <i class="fas fa-chart-line"></i>
          <div class="stat-content">
            <span class="stat-number">{{ invitationStats.averageCompanions.toFixed(1) }}</span>
            <span class="stat-label">Promedio acompañantes</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!showPreview" class="form-container">
      <form @submit.prevent="generateInvitationUrl" class="invitation-form">
        <!-- Nombre del invitado -->
        <div class="form-group">
          <label for="guestName" class="form-label">
            <i class="fas fa-user"></i>
            Nombre del invitado *
          </label>
          <input
            id="guestName"
            v-model="form.guestName"
            type="text"
            class="form-input"
            :class="{ 'error': errors.guestName }"
            placeholder="Ej: María García, Familia Rodríguez, Los Pérez"
            required
          />
          <span v-if="errors.guestName" class="error-message">{{ errors.guestName }}</span>
        </div>

        <!-- Número de invitados -->
        <div class="form-group">
          <label for="numberOfGuests" class="form-label">
            <i class="fas fa-users"></i>
            Número de {{ guestText }} *
          </label>
          <div class="number-input-container">
            <button 
              type="button" 
              @click="form.numberOfGuests = Math.max(1, form.numberOfGuests - 1)"
              class="number-btn"
              :disabled="form.numberOfGuests <= 1"
            >
              <i class="fas fa-minus"></i>
            </button>
            <input
              id="numberOfGuests"
              v-model.number="form.numberOfGuests"
              type="number"
              min="1"
              max="15"
              class="number-input"
              :class="{ 'error': errors.numberOfGuests }"
            />
            <button 
              type="button" 
              @click="form.numberOfGuests = Math.min(15, form.numberOfGuests + 1)"
              class="number-btn"
              :disabled="form.numberOfGuests >= 15"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <span v-if="errors.numberOfGuests" class="error-message">{{ errors.numberOfGuests }}</span>
          <small class="help-text">Máximo 15 invitados por invitación</small>
        </div>

        <!-- Tipo de invitación -->
        <div class="form-group">
          <label class="form-label">
            <i class="fas fa-palette"></i>
            Tipo de invitación
          </label>
          <div class="invitation-types">
            <label 
              v-for="type in invitationTypes" 
              :key="type.value"
              class="type-option"
              :class="{ 'selected': form.invitationType === type.value }"
            >
              <input
                v-model="form.invitationType"
                type="radio"
                :value="type.value"
                class="type-radio"
              />
              <div class="type-content">
                <i :class="type.icon" class="type-icon"></i>
                <div class="type-info">
                  <span class="type-label">{{ type.label }}</span>
                  <span class="type-description">{{ type.description }}</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Mensaje personalizado -->
        <div class="form-group">
          <label for="personalMessage" class="form-label">
            <i class="fas fa-heart"></i>
            Mensaje personalizado (opcional)
          </label>
          <textarea
            id="personalMessage"
            v-model="form.personalMessage"
            class="form-textarea"
            placeholder="Ej: Querida familia, esperamos compartir este día tan especial con ustedes..."
            rows="3"
            maxlength="200"
          ></textarea>
          <small class="help-text">{{ form.personalMessage.length }}/200 caracteres</small>
        </div>

        <!-- Mensaje de error general -->
        <div v-if="errors.general || storeError" class="error-container">
          <i class="fas fa-exclamation-triangle"></i>
          <span>{{ errors.general || storeError }}</span>
        </div>

        <!-- Botón generar -->
        <button
          type="submit"
          class="generate-button"
          :disabled="isGenerating || isCreating"
        >
          <i v-if="isGenerating || isCreating" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-magic"></i>
          {{ (isGenerating || isCreating) ? 'Creando invitación...' : 'Crear Invitación' }}
        </button>
      </form>
    </div>

    <!-- Vista previa de la invitación generada -->
    <div v-else class="preview-container">
      <div class="preview-header">
        <i class="fas fa-check-circle success-icon"></i>
        <h2 class="preview-title">¡Invitación Creada Exitosamente!</h2>
        <p class="preview-subtitle">Tu invitación ha sido guardada y está lista para compartir</p>
        <div v-if="createdInvitation" class="invitation-id">
          <small><strong>ID:</strong> {{ createdInvitation._id }}</small>
        </div>
      </div>

      <div class="invitation-preview">
        <div class="invitation-details">
          <div class="detail-item">
            <i class="fas fa-user"></i>
            <span><strong>Invitado:</strong> {{ form.guestName }}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-users"></i>
            <span><strong>Número de {{ guestText }}:</strong> {{ form.numberOfGuests }}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-users-cog"></i>
            <span><strong>Acompañantes:</strong> {{ form.numberOfGuests - 1 }}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-tag"></i>
            <span><strong>Tipo:</strong> {{invitationTypes.find(t => t.value === form.invitationType)?.label}}</span>
          </div>
          <div v-if="form.personalMessage" class="detail-item">
            <i class="fas fa-heart"></i>
            <span><strong>Mensaje:</strong> {{ form.personalMessage }}</span>
          </div>
          <div v-if="createdInvitation" class="detail-item">
            <i class="fas fa-calendar"></i>
            <span><strong>Creada:</strong> {{ new Date(createdInvitation.createdAt).toLocaleString('es-ES') }}</span>
          </div>
        </div>

        <div class="url-container">
          <label class="url-label">
            <i class="fas fa-link"></i>
            URL de la invitación:
          </label>
          <div class="url-input-group">
            <input
              :value="generatedInvitation"
              readonly
              class="url-input"
            />
            <button @click="copyToClipboard" class="copy-button" title="Copiar URL">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="previewInvitation" class="preview-button">
            <i class="fas fa-eye"></i>
            Ver Invitación
          </button>
          <button @click="shareViaWhatsApp" class="whatsapp-button">
            <i class="fab fa-whatsapp"></i>
            Compartir por WhatsApp
          </button>
        </div>
      </div>

      <div class="action-buttons-container">
        <button @click="resetForm" class="new-invitation-button">
          <i class="fas fa-plus"></i>
          Crear Nueva Invitación
        </button>
        <button @click="goToManageInvitations" class="manage-invitations-button">
          <i class="fas fa-list-alt"></i>
          Ver Dashboard
        </button>
      </div>
    </div>

    <!-- Decoración de fondo -->
    <div class="background-decoration">
      <i class="fas fa-heart heart-1"></i>
      <i class="fas fa-star star-1"></i>
      <i class="fas fa-leaf leaf-1"></i>
      <i class="fas fa-heart heart-2"></i>
      <i class="fas fa-star star-2"></i>
      <i class="fas fa-leaf leaf-2"></i>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.modules.scss' as *;

.create-invitation-container {
  min-height: 100vh;
  padding: 2rem 1rem;
  position: relative;
  overflow-x: hidden;
}

.back-to-dashboard-button {
  @include body-font(600);
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.95);
  color: $primary-color;
  border: 2px solid $primary-color;
  border-radius: 50px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    background: $primary-color;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(68, 93, 87, 0.3);
  }

  i {
    font-size: 1rem;
  }

  span {
    @media (max-width: 480px) {
      display: none;
    }
  }

  @media (max-width: 768px) {
    top: 1rem;
    left: 1rem;
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;

  .header-icon {
    font-size: 3.5rem;
    color: $primary-color;
    margin-bottom: 1rem;
    animation: sparkle 2s ease-in-out infinite;
  }

  .main-title {
    @include heading-font(700);
    font-size: 2.8rem;
    color: $primary-color;
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
      font-size: 2.2rem;
    }
  }

  .subtitle {
    @include body-font(400);
    font-size: 1.2rem;
    color: $charcoal;
    max-width: 600px;
    margin: 0 auto;
  }

  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    max-width: 800px;
    margin: 2rem auto 0;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }

  .stat-item {
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
}

.form-container {
  max-width: 700px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 2rem;
    margin: 0 1rem;
  }
}

.invitation-form {
  .form-group {
    margin-bottom: 2.5rem;
  }

  .form-label {
    @include body-font(600);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: $primary-color;
    margin-bottom: 1rem;
    font-size: 1.1rem;

    i {
      color: $secondary-color;
      width: 24px;
      font-size: 1.2rem;
    }
  }

  .form-input,
  .form-textarea {
    @include body-font(400);
    width: 90%;
    padding: 1.25rem;
    border: 2px solid #e9ecef;
    border-radius: 16px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 4px rgba(68, 93, 87, 0.1);
    }

    &.error {
      border-color: #dc3545;
      box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.1);
    }

    &::placeholder {
      color: #6c757d;
    }
  }

  .form-textarea {
    resize: vertical;
    min-height: 120px;
  }
}

.number-input-container {
  display: flex;
  align-items: center;
  gap: 0;
  max-width: 200px;

  .number-btn {
    @include body-font(600);
    width: 50px;
    height: 50px;
    border: 2px solid #e9ecef;
    background: white;
    color: $primary-color;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:first-child {
      border-radius: 16px 0 0 16px;
      border-right: none;
    }

    &:last-child {
      border-radius: 0 16px 16px 0;
      border-left: none;
    }

    &:hover:not(:disabled) {
      background: $primary-color;
      color: white;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .number-input {
    @include body-font(600);
    width: 80px;
    height: 50px;
    border: 2px solid #e9ecef;
    border-left: none;
    border-right: none;
    text-align: center;
    font-size: 1.1rem;
    background: white;

    &:focus {
      outline: none;
      border-color: $primary-color;
    }

    &.error {
      border-color: #dc3545;
    }
  }
}

.invitation-types {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.type-option {
  cursor: pointer;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  background: white;

  &:hover {
    border-color: $primary-color;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(68, 93, 87, 0.15);
  }

  &.selected {
    border-color: $primary-color;
    background: rgba(68, 93, 87, 0.05);

    .type-icon {
      color: $primary-color;
    }
  }

  .type-radio {
    display: none;
  }

  .type-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .type-icon {
    font-size: 1.5rem;
    color: $secondary-color;
    transition: color 0.3s ease;
  }

  .type-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .type-label {
    @include body-font(600);
    color: $primary-color;
    font-size: 1rem;
  }

  .type-description {
    @include body-font(400);
    color: $charcoal;
    font-size: 0.875rem;
  }
}

.help-text {
  @include body-font(400);
  color: #6c757d;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
}

.error-message {
  @include body-font(400);
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
}

.error-container {
  @include body-font(500);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 12px;
  color: #dc3545;
  margin-bottom: 1.5rem;

  i {
    font-size: 1.2rem;
  }
}

.generate-button {
  @include body-font(600);
  width: 100%;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, $primary-color 0%, color.adjust($primary-color, $lightness: -10%) 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(68, 93, 87, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  i {
    font-size: 1.3rem;
  }
}

.preview-container {
  max-width: 800px;
  margin: 0 auto;

  .preview-header {
    text-align: center;
    margin-bottom: 3rem;

    .success-icon {
      font-size: 4rem;
      color: #28a745;
      margin-bottom: 1rem;
      animation: bounce 1s ease-out;
    }

    .preview-title {
      @include heading-font(600);
      font-size: 2.2rem;
      color: $primary-color;
      margin-bottom: 0.5rem;
    }

    .preview-subtitle {
      @include body-font(400);
      font-size: 1.1rem;
      color: $charcoal;
    }

    .invitation-id {
      margin-top: 1rem;
      padding: 0.75rem;
      background: rgba(68, 93, 87, 0.1);
      border-radius: 8px;

      small {
        @include body-font(400);
        color: $primary-color;
        font-size: 0.875rem;
      }
    }
  }
}

.invitation-preview {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 2rem;
    margin: 0 1rem 2rem;
  }
}

.invitation-details {
  display: grid;
  gap: 1rem;
  margin-bottom: 2.5rem;

  .detail-item {
    @include body-font(400);
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(68, 93, 87, 0.05);
    border-radius: 12px;

    i {
      color: $secondary-color;
      font-size: 1.2rem;
      width: 24px;
    }

    span {
      color: $charcoal;
      font-size: 1rem;
    }
  }
}

.url-container {
  margin-bottom: 2.5rem;

  .url-label {
    @include body-font(600);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: $primary-color;
    margin-bottom: 1rem;
    font-size: 1rem;

    i {
      color: $secondary-color;
    }
  }

  .url-input-group {
    display: flex;
    gap: 0;

    .url-input {
      @include body-font(400);
      flex: 1;
      padding: 1rem;
      border: 2px solid #e9ecef;
      border-radius: 12px 0 0 12px;
      border-right: none;
      background: #f8f9fa;
      font-size: 0.9rem;
      color: $charcoal;
    }

    .copy-button {
      @include body-font(600);
      padding: 1rem 1.5rem;
      background: $secondary-color;
      color: white;
      border: none;
      border-radius: 0 12px 12px 0;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: color.adjust($secondary-color, $lightness: -10%);
      }
    }
  }
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .preview-button,
  .whatsapp-button {
    @include body-font(600);
    padding: 1.25rem 2rem;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;

    &:hover {
      transform: translateY(-2px);
    }
  }

  .preview-button {
    background: transparent;
    color: $primary-color;
    border: 2px solid $primary-color;

    &:hover {
      background: $primary-color;
      color: white;
    }
  }

  .whatsapp-button {
    background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
    color: white;

    &:hover {
      box-shadow: 0 8px 25px rgba(37, 211, 102, 0.3);
    }
  }
}

.action-buttons-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.new-invitation-button {
  @include body-font(600);
  padding: 1rem 2rem;
  background: transparent;
  color: $primary-color;
  border: 2px solid $primary-color;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: $primary-color;
    color: white;
    transform: translateY(-2px);
  }

  i {
    font-size: 1rem;
  }
}

.manage-invitations-button {
  @include body-font(600);
  padding: 1rem 2rem;
  background: linear-gradient(135deg, $secondary-color 0%, color.adjust($secondary-color, $lightness: -10%) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(184, 134, 11, 0.3);
  }

  i {
    font-size: 1rem;
  }
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  .heart-1,
  .heart-2,
  .star-1,
  .star-2,
  .leaf-1,
  .leaf-2 {
    position: absolute;
    opacity: 0.08;
    animation: float 8s ease-in-out infinite;
  }

  .heart-1 {
    top: 15%;
    left: 8%;
    font-size: 2.5rem;
    color: $secondary-color;
    animation-delay: 0s;
  }

  .star-1 {
    top: 25%;
    right: 12%;
    font-size: 2rem;
    color: $accent-color;
    animation-delay: 2s;
  }

  .leaf-1 {
    top: 45%;
    left: 5%;
    font-size: 1.8rem;
    color: $primary-color;
    animation-delay: 4s;
  }

  .heart-2 {
    bottom: 30%;
    right: 8%;
    font-size: 2.2rem;
    color: $secondary-color;
    animation-delay: 1s;
  }

  .star-2 {
    bottom: 15%;
    left: 15%;
    font-size: 1.5rem;
    color: $accent-color;
    animation-delay: 3s;
  }

  .leaf-2 {
    top: 65%;
    right: 20%;
    font-size: 2rem;
    color: $primary-color;
    animation-delay: 5s;
  }
}

@keyframes sparkle {

  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }

  25% {
    transform: scale(1.1) rotate(5deg);
  }

  50% {
    transform: scale(1.05) rotate(-3deg);
  }

  75% {
    transform: scale(1.08) rotate(3deg);
  }
}

@keyframes bounce {

  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translateY(0);
  }

  40%,
  43% {
    transform: translateY(-20px);
  }

  70% {
    transform: translateY(-10px);
  }

  90% {
    transform: translateY(-4px);
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  33% {
    transform: translateY(-15px) rotate(8deg);
  }

  66% {
    transform: translateY(8px) rotate(-5deg);
  }
}
</style>