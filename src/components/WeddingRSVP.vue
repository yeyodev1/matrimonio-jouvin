<script setup lang="ts">
import { ref, computed } from 'vue'
import type { IInvitation } from '@/services/invitationService'

// Props
const props = defineProps({
  invitationData: {
    type: Object as () => IInvitation | null,
    default: null
  },
  guestName: {
    type: String,
    required: true
  },
  companionsCount: {
    type: Number,
    default: 0
  },
  invitationId: {
    type: String,
    required: true
  }
})

// Computed para generar mensaje personalizado
const personalizedMessage = computed(() => {
  const baseMessage = `¡Hola! Soy ${props.guestName} y confirmo mi asistencia a la boda de Génesis y Christopher el 1 de Noviembre de 2025.`
  
  if (props.companionsCount > 0) {
    const companionText = props.companionsCount === 1 ? '1 acompañante' : `${props.companionsCount} acompañantes`
    return `${baseMessage} Asistiré con ${companionText}.`
  }
  
  return baseMessage
})

// Función para abrir WhatsApp
const openWhatsApp = () => {
  const phoneNumber = '+1234567890' // Reemplazar con el número real
  const message = encodeURIComponent(personalizedMessage.value)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
  window.open(whatsappUrl, '_blank')
}
</script>

<template>
  <div class="wedding-rsvp">
    <!-- Sección Información del Invitado -->
    <div class="guest-info-section">
      <div class="guest-details">
        <h3 class="guest-greeting">Querido/a</h3>
        <h2 class="guest-name-display">{{ guestName }}</h2>
        <p v-if="companionsCount > 0" class="companions-display">
          {{ companionsCount === 1 ? 'y tu acompañante' : `y tus ${companionsCount} acompañantes` }}
        </p>
        <div class="invitation-decoration">
          <div class="heart-divider">♥</div>
        </div>
      </div>
    </div>

    <!-- Sección NO NIÑOS -->
    <div class="no-children-section">
      <div class="decorative-leaves decorative-leaves--top">
        <i class="fas fa-leaf"></i>
        <i class="fas fa-leaf"></i>
        <i class="fas fa-leaf"></i>
      </div>
      
      <div class="content-wrapper">
        <p class="intro-text">
          Porque queremos que disfruten nuestra boda<br>
          al máximo, amablemente les solicitamos:
        </p>
        
        <h2 class="no-children-title">NO NIÑOS</h2>
        
        <p class="explanation-text">
          Amamos a los niños, pero por razones de<br>
          seguridad, nuestra boda será solo para<br>
          adultos
        </p>
      </div>
    </div>

    <!-- Sección Confirmar Asistencia -->
    <div class="rsvp-section">
      <div class="whatsapp-icon">
        <i class="fab fa-whatsapp"></i>
      </div>
      
      <h3 class="rsvp-title">CONFIRMAR ASISTENCIA</h3>
      
      <button @click="openWhatsApp" class="confirm-button">
        <i class="fab fa-whatsapp"></i>
        Confirmar aquí
      </button>
    </div>

    <!-- Mensaje Final -->
    <div class="final-message-section">
      <p class="waiting-text">ESPERAMOS CONTAR CON SU PRESENCIA</p>
      
      <div class="elegant-message">
        <p class="te-esperamos">¡Te esperamos!</p>
      </div>
      
      <div class="decorative-leaves decorative-leaves--bottom">
        <i class="fas fa-leaf"></i>
        <i class="fas fa-leaf"></i>
        <i class="fas fa-leaf"></i>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wedding-rsvp {
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  text-align: center;

  @media (min-width: 768px) {
    gap: 4rem;
  }
}

// Sección Información del Invitado
.guest-info-section {
  padding: 2rem 1rem;
  background: linear-gradient(135deg, rgba($cream-white, 0.8) 0%, rgba($dusty-rose, 0.05) 100%);
  border-radius: 12px;
  border: 1px solid rgba($dusty-rose, 0.2);
  box-shadow: 0 8px 25px rgba($dark-teal, 0.08);

  @media (min-width: 768px) {
    padding: 2.5rem 2rem;
  }
}

.guest-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.guest-greeting {
  @include interface-font(400);
  font-size: 1rem;
  color: rgba($dark-teal, 0.7);
  margin: 0;
  font-style: italic;

  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
}

.guest-name-display {
  @include heading-font(600);
  font-size: 1.8rem;
  color: $dark-teal;
  margin: 0;
  text-transform: capitalize;

  @media (min-width: 768px) {
    font-size: 2.2rem;
  }
}

.companions-display {
  @include accent-font(400);
  font-size: 0.95rem;
  color: rgba($warm-brown, 0.8);
  margin: 0;
  font-style: italic;

  @media (min-width: 768px) {
    font-size: 1.05rem;
  }
}

.invitation-decoration {
  margin-top: 1rem;
}

.heart-divider {
  font-size: 1.5rem;
  color: $dusty-rose;
  animation: heartbeat 2s infinite;
}

// Sección NO NIÑOS
.no-children-section {
  position: relative;
  padding: 2rem 1rem;

  @media (min-width: 768px) {
    padding: 2.5rem 1.5rem;
  }
}

.decorative-leaves {
  position: absolute;
  display: flex;
  gap: 0.5rem;
  color: rgba($dusty-rose, 0.4);
  font-size: 1.2rem;

  &--top {
    top: 1rem;
    right: 1rem;
    transform: rotate(15deg);
  }

  &--bottom {
    bottom: 1rem;
    left: 1rem;
    transform: rotate(-15deg);
  }

  i {
    animation: leafFloat 3s ease-in-out infinite;
    
    &:nth-child(2) {
      animation-delay: 0.5s;
    }
    
    &:nth-child(3) {
      animation-delay: 1s;
    }
  }

  @media (min-width: 768px) {
    font-size: 1.4rem;
    gap: 0.7rem;
  }
}

.content-wrapper {
  position: relative;
  z-index: 2;
}

.intro-text {
  @include interface-font(400);
  font-size: 0.95rem;
  color: $charcoal;
  line-height: 1.6;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    font-size: 1.05rem;
    line-height: 1.7;
    margin-bottom: 2rem;
  }
}

.no-children-title {
  @include heading-font(700);
  font-size: 1.8rem;
  color: $dark-teal;
  letter-spacing: 3px;
  margin: 1.5rem 0;
  text-shadow: 0 2px 4px rgba($dark-teal, 0.1);

  @media (min-width: 768px) {
    font-size: 2.2rem;
    letter-spacing: 4px;
    margin: 2rem 0;
  }
}

.explanation-text {
  @include interface-font(400);
  font-size: 0.9rem;
  color: rgba($charcoal, 0.8);
  line-height: 1.6;
  margin-top: 1rem;

  @media (min-width: 768px) {
    font-size: 1rem;
    line-height: 1.7;
  }
}

// Sección RSVP
.rsvp-section {
  padding: 1.5rem 1rem;

  @media (min-width: 768px) {
    padding: 2rem 1.5rem;
  }
}

.whatsapp-icon {
  font-size: 3.5rem;
  color: #25D366;
  margin-bottom: 1.5rem;
  animation: pulse 2s infinite;

  @media (min-width: 768px) {
    font-size: 4rem;
    margin-bottom: 2rem;
  }
}

.rsvp-title {
  @include heading-font(600);
  font-size: 1.1rem;
  color: $dark-teal;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    font-size: 1.3rem;
    letter-spacing: 3px;
    margin-bottom: 2rem;
  }
}

.confirm-button {
  @include accent-font(600);
  background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
    background: linear-gradient(135deg, #128C7E 0%, #25D366 100%);
  }

  &:active {
    transform: translateY(0);
  }

  i {
    font-size: 1.2rem;
  }

  @media (min-width: 768px) {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
    
    i {
      font-size: 1.3rem;
    }
  }
}

// Sección Mensaje Final
.final-message-section {
  position: relative;
  padding: 2rem 1rem;

  @media (min-width: 768px) {
    padding: 2.5rem 1.5rem;
  }
}

.waiting-text {
  @include accent-font(500);
  font-size: 0.9rem;
  color: rgba($charcoal, 0.7);
  letter-spacing: 2px;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    font-size: 1rem;
    letter-spacing: 3px;
    margin-bottom: 2.5rem;
  }
}

.elegant-message {
  margin: 2rem 0;
}

.te-esperamos {
  @include heading-font(400);
  font-size: 2rem;
  color: $dark-teal;
  font-style: italic;
  margin: 0;
  text-shadow: 0 2px 4px rgba($dark-teal, 0.1);
  position: relative;

  &::before,
  &::after {
    content: '~';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: rgba($dusty-rose, 0.5);
    font-size: 1.5rem;
  }

  &::before {
    left: -2rem;
  }

  &::after {
    right: -2rem;
  }

  @media (min-width: 768px) {
    font-size: 2.5rem;
    
    &::before,
    &::after {
      font-size: 2rem;
    }
    
    &::before {
      left: -3rem;
    }
    
    &::after {
      right: -3rem;
    }
  }
}

// Animaciones
@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes leafFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(5deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

// Animación de entrada
.no-children-section,
.rsvp-section,
.final-message-section {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease-out forwards;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Responsive adjustments
@media (max-width: 480px) {
  .wedding-rsvp {
    margin: 1rem;
    gap: 2rem;
  }

  .no-children-title {
    font-size: 1.5rem;
    letter-spacing: 2px;
  }

  .te-esperamos {
    font-size: 1.7rem;
    
    &::before,
    &::after {
      display: none;
    }
  }

  .confirm-button {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
  }

  .decorative-leaves {
    font-size: 1rem;
    gap: 0.3rem;
  }
}
</style>