<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Actualizar título de la página
onMounted(() => {
  document.title = '404 - Página no encontrada'
})

const goHome = () => {
  router.push('/login')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <!-- Decoración floral -->
      <div class="floral-decoration top">
        <svg viewBox="0 0 100 50" class="floral-svg">
          <path d="M20,25 Q30,10 40,25 Q50,40 60,25 Q70,10 80,25" 
                stroke="currentColor" 
                fill="none" 
                stroke-width="2"/>
          <circle cx="20" cy="25" r="3" fill="currentColor"/>
          <circle cx="40" cy="25" r="3" fill="currentColor"/>
          <circle cx="60" cy="25" r="3" fill="currentColor"/>
          <circle cx="80" cy="25" r="3" fill="currentColor"/>
        </svg>
      </div>

      <!-- Número 404 -->
      <div class="error-number">
        <span class="number-4">4</span>
        <span class="number-0">0</span>
        <span class="number-4">4</span>
      </div>

      <!-- Mensaje principal -->
      <h1 class="error-title">Página no encontrada</h1>
      <p class="error-message">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>

      <!-- Botones de acción -->
      <div class="action-buttons">
        <button @click="goBack" class="btn-secondary">
          <i class="fas fa-arrow-left"></i>
          Volver atrás
        </button>
        <button @click="goHome" class="btn-primary">
          <i class="fas fa-home"></i>
          Ir al inicio
        </button>
      </div>

      <!-- Decoración floral inferior -->
      <div class="floral-decoration bottom">
        <svg viewBox="0 0 100 50" class="floral-svg">
          <path d="M20,25 Q30,40 40,25 Q50,10 60,25 Q70,40 80,25" 
                stroke="currentColor" 
                fill="none" 
                stroke-width="2"/>
          <circle cx="20" cy="25" r="3" fill="currentColor"/>
          <circle cx="40" cy="25" r="3" fill="currentColor"/>
          <circle cx="60" cy="25" r="3" fill="currentColor"/>
          <circle cx="80" cy="25" r="3" fill="currentColor"/>
        </svg>
      </div>
    </div>

    <!-- Partículas flotantes -->
    <div class="floating-particles">
      <div class="particle" v-for="i in 6" :key="i"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/colorVariables.module.scss';
@import '@/styles/fonts.modules.scss';

.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $cream-white 0%, lighten($cream-white, 5%) 100%);
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  position: relative;
  z-index: 2;
  animation: fadeInUp 0.8s ease-out;
}

.floral-decoration {
  margin: 2rem auto;
  
  &.top {
    margin-bottom: 3rem;
  }
  
  &.bottom {
    margin-top: 3rem;
  }
  
  .floral-svg {
    width: 200px;
    height: 50px;
    color: $dusty-rose;
    opacity: 0.7;
  }
}

.error-number {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  span {
    @include heading-font(700);
    font-size: 8rem;
    line-height: 1;
    color: $dark-teal;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    animation: bounce 2s ease-in-out infinite;
    
    &.number-0 {
      color: $dusty-rose;
      animation-delay: 0.2s;
    }
    
    &:last-child {
      animation-delay: 0.4s;
    }
  }
}

.error-title {
  @include heading-font(600);
  font-size: 2.5rem;
  color: $charcoal;
  margin-bottom: 1rem;
  letter-spacing: 0.5px;
}

.error-message {
  @include body-font(400);
  font-size: 1.2rem;
  color: rgba($charcoal, 0.8);
  margin-bottom: 3rem;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  @include interface-font(500);
  padding: 1rem 2rem;
  border-radius: 50px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  min-width: 160px;
  justify-content: center;
  
  i {
    font-size: 0.9rem;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.btn-primary {
  background: linear-gradient(135deg, $dusty-rose 0%, $warm-brown 100%);
  color: $white;
  box-shadow: 0 4px 15px rgba($dusty-rose, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, darken($dusty-rose, 5%) 0%, darken($warm-brown, 5%) 100%);
    box-shadow: 0 8px 25px rgba($dusty-rose, 0.4);
  }
}

.btn-secondary {
  background: $white;
  color: $charcoal;
  border: 2px solid rgba($charcoal, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: rgba($charcoal, 0.05);
    border-color: rgba($charcoal, 0.3);
  }
}

.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: $dusty-rose;
  border-radius: 50%;
  opacity: 0.3;
  animation: float 6s ease-in-out infinite;
  
  &:nth-child(1) {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    top: 60%;
    left: 20%;
    animation-delay: 1s;
    background: $dark-teal;
  }
  
  &:nth-child(3) {
    top: 30%;
    right: 15%;
    animation-delay: 2s;
  }
  
  &:nth-child(4) {
    bottom: 40%;
    right: 25%;
    animation-delay: 3s;
    background: $warm-brown;
  }
  
  &:nth-child(5) {
    bottom: 20%;
    left: 30%;
    animation-delay: 4s;
  }
  
  &:nth-child(6) {
    top: 70%;
    right: 40%;
    animation-delay: 5s;
    background: $dark-teal;
  }
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(120deg);
  }
  66% {
    transform: translateY(10px) rotate(240deg);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .not-found-container {
    padding: 1rem;
  }
  
  .error-number span {
    font-size: 6rem;
  }
  
  .error-title {
    font-size: 2rem;
  }
  
  .error-message {
    font-size: 1.1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 280px;
  }
  
  .floral-decoration .floral-svg {
    width: 150px;
  }
}

@media (max-width: 480px) {
  .error-number span {
    font-size: 4.5rem;
  }
  
  .error-title {
    font-size: 1.8rem;
  }
  
  .error-message {
    font-size: 1rem;
  }
}
</style>