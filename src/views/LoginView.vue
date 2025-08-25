<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

// Contraseña de administración (en producción debería estar en variables de entorno)
const ADMIN_PASSWORD = 'genesis2025'

// Actualizar título de la página
onMounted(() => {
  document.title = 'Acceso Administrativo - Boda Génesis y Christopher'
})

const handleLogin = async () => {
  if (!password.value.trim()) {
    errorMessage.value = 'Por favor ingresa la contraseña'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  // Simular delay de autenticación
  await new Promise(resolve => setTimeout(resolve, 800))

  if (password.value === ADMIN_PASSWORD) {
    // Guardar estado de autenticación
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('authTimestamp', Date.now().toString())
    
    // Redireccionar al panel de administración
    router.push('/manage-invitations')
  } else {
    errorMessage.value = 'Contraseña incorrecta. Inténtalo de nuevo.'
    password.value = ''
  }

  isLoading.value = false
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleLogin()
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <!-- Header decorativo -->
      <div class="login-header">
        <div class="couple-initials">
          <span class="initial">G</span>
          <div class="heart-divider">
            <i class="fas fa-heart"></i>
          </div>
          <span class="initial">C</span>
        </div>
        <h1 class="login-title">Panel de Administración</h1>
        <p class="login-subtitle">Acceso exclusivo para la gestión de invitaciones</p>
      </div>

      <!-- Formulario de login -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="password" class="form-label">
            <i class="fas fa-lock"></i>
            Contraseña de acceso
          </label>
          <div class="password-input-container">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ 'error': errorMessage }"
              placeholder="Ingresa la contraseña"
              @keypress="handleKeyPress"
              :disabled="isLoading"
              autocomplete="current-password"
            >
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="password-toggle"
              :disabled="isLoading"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          {{ errorMessage }}
        </div>

        <!-- Botón de login -->
        <button
          type="submit"
          class="login-button"
          :disabled="isLoading || !password.trim()"
          :class="{ 'loading': isLoading }"
        >
          <span v-if="!isLoading" class="button-content">
            <i class="fas fa-sign-in-alt"></i>
            Acceder al Panel
          </span>
          <span v-else class="button-content">
            <i class="fas fa-spinner fa-spin"></i>
            Verificando...
          </span>
        </button>
      </form>

      <!-- Footer informativo -->
      <div class="login-footer">
        <p class="footer-text">
          <i class="fas fa-shield-alt"></i>
          Acceso seguro y protegido
        </p>
      </div>
    </div>

    <!-- Decoración de fondo -->
    <div class="background-decoration">
      <div class="decoration-element" v-for="i in 8" :key="i"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/colorVariables.module.scss';
@import '@/styles/fonts.modules.scss';

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $cream-white 0%, lighten($cream-white, 3%) 50%, $cream-white 100%);
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.login-content {
  background: rgba($white, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba($white, 0.8);
  position: relative;
  z-index: 2;
  animation: fadeInScale 0.8s ease-out;
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.couple-initials {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  .initial {
    @include heading-font(700);
    font-size: 3rem;
    color: $dark-teal;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, $dusty-rose 0%, $warm-brown 100%);
    color: $white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 25px rgba($dusty-rose, 0.3);
  }
  
  .heart-divider {
    color: $dusty-rose;
    font-size: 1.5rem;
    animation: heartbeat 2s ease-in-out infinite;
  }
}

.login-title {
  @include heading-font(600);
  font-size: 2rem;
  color: $charcoal;
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
}

.login-subtitle {
  @include body-font(400);
  color: rgba($charcoal, 0.7);
  font-size: 1rem;
  line-height: 1.5;
}

.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  @include interface-font(500);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: $charcoal;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  
  i {
    color: $dusty-rose;
  }
}

.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  @include interface-font(400);
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid rgba($charcoal, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  background: $white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: $dusty-rose;
    box-shadow: 0 0 0 3px rgba($dusty-rose, 0.1);
  }
  
  &.error {
    border-color: #e74c3c;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
  }
  
  &:disabled {
    background: rgba($charcoal, 0.05);
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: rgba($charcoal, 0.5);
  }
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: rgba($charcoal, 0.6);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    color: $dusty-rose;
    background: rgba($dusty-rose, 0.1);
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.error-message {
  @include interface-font(400);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  border-left: 4px solid #e74c3c;
}

.login-button {
  @include interface-font(600);
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, $dusty-rose 0%, $warm-brown 100%);
  color: $white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba($dusty-rose, 0.3);
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, darken($dusty-rose, 5%) 0%, darken($warm-brown, 5%) 100%);
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba($dusty-rose, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  .button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }
}

.login-footer {
  text-align: center;
  
  .footer-text {
    @include interface-font(400);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: rgba($charcoal, 0.6);
    font-size: 0.9rem;
    
    i {
      color: $dark-teal;
    }
  }
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.decoration-element {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba($dusty-rose, 0.1) 0%, rgba($dark-teal, 0.1) 100%);
  animation: float 8s ease-in-out infinite;
  
  &:nth-child(1) {
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    top: 20%;
    right: 15%;
    animation-delay: 1s;
    width: 80px;
    height: 80px;
  }
  
  &:nth-child(3) {
    bottom: 30%;
    left: 5%;
    animation-delay: 2s;
    width: 120px;
    height: 120px;
  }
  
  &:nth-child(4) {
    bottom: 10%;
    right: 20%;
    animation-delay: 3s;
  }
  
  &:nth-child(5) {
    top: 50%;
    left: 2%;
    animation-delay: 4s;
    width: 60px;
    height: 60px;
  }
  
  &:nth-child(6) {
    top: 70%;
    right: 5%;
    animation-delay: 5s;
    width: 90px;
    height: 90px;
  }
  
  &:nth-child(7) {
    top: 30%;
    left: 50%;
    animation-delay: 6s;
    width: 70px;
    height: 70px;
  }
  
  &:nth-child(8) {
    bottom: 50%;
    right: 50%;
    animation-delay: 7s;
    width: 110px;
    height: 110px;
  }
}

/* Animaciones */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes heartbeat {
  0%, 50%, 100% {
    transform: scale(1);
  }
  25%, 75% {
    transform: scale(1.1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-30px) rotate(120deg);
  }
  66% {
    transform: translateY(15px) rotate(240deg);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-content {
    padding: 2rem;
    margin: 1rem;
  }
  
  .couple-initials .initial {
    width: 50px;
    height: 50px;
    font-size: 2.5rem;
  }
  
  .login-title {
    font-size: 1.8rem;
  }
  
  .login-subtitle {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .login-content {
    padding: 1.5rem;
  }
  
  .couple-initials {
    gap: 0.75rem;
    
    .initial {
      width: 45px;
      height: 45px;
      font-size: 2rem;
    }
    
    .heart-divider {
      font-size: 1.2rem;
    }
  }
  
  .login-title {
    font-size: 1.6rem;
  }
}
</style>