<script setup lang="ts">
import { ref } from 'vue'

// Importar la imagen del código de vestimenta
import dressCodeImage from '@/assets/codigo-vestimenta/codigo-vestimenta.webp'

// Función para abrir la imagen de transferencia
const openTransferImage = () => {
  window.open('https://res.cloudinary.com/dpimsaaa4/image/upload/v1756219280/Ge%CC%81nesis_y_Christopher_-_Tu_historia_qczhsv.png', '_blank')
}
</script>

<template>
  <div class="dress-code-gifts">
    <!-- Sección Código de Vestimenta -->
    <div class="dress-code-section">
      <h2 class="section-title">CÓDIGO DE VESTIMENTA</h2>
      <p class="dress-code-type">Formal</p>
      
      <!-- Imagen de la pareja -->
      <div class="couple-image">
        <img :src="dressCodeImage" alt="Código de vestimenta - Pareja" class="dress-image" />
      </div>
      
      <!-- Siluetas de la pareja -->
      <div class="couple-silhouettes">
        <div class="silhouette">
          <i class="fas fa-male"></i>
        </div>
        <div class="silhouette">
          <i class="fas fa-female"></i>
        </div>
      </div>
      
      <p class="dress-note">(El color verde oliva se reserva para la corte)</p>
    </div>

    <!-- Sección Sugerencia de Regalos -->
    <div class="gifts-section">
      <h2 class="section-title">SUGERENCIA DE REGALOS</h2>
      
      <div class="gift-icon">
        <i class="fas fa-gift"></i>
      </div>
      
      <div class="gift-message">
        <p>Su presencia en nuestra boda será el mejor regalo. Pero si desean darnos un obsequio, les dejamos estas opciones:</p>
      </div>
      
      <div class="transfer-section">
        <h3 class="transfer-title">SOBRE CERRADO</h3>
        <div class="qr-code">
          <i class="fas fa-envelope"></i>
        </div>
        <p class="transfer-hint">Se entrega en recepción</p>
      </div>
      <div class="transfer-section" @click="openTransferImage">
        <h3 class="transfer-title">TRANSFERENCIA</h3>
        <div class="qr-code">
          <i class="fas fa-money-bill-wave"></i>
        </div>
        <p class="transfer-hint">Toca aquí para ver la cuenta</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dress-code-gifts {
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;

  @media (min-width: 768px) {
    gap: 4rem;
  }
}

.dress-code-section,
.gifts-section {
  text-align: center;
  padding: 1rem 0;

  @media (min-width: 768px) {
    padding: 1.5rem 0;
  }
}

.section-title {
  @include heading-font(700);
  font-size: 1.2rem;
  color: $dark-teal;
  letter-spacing: 2px;
  margin: 0 0 1.5rem 0;

  @media (min-width: 768px) {
    font-size: 1.4rem;
    letter-spacing: 3px;
    margin-bottom: 2rem;
  }
}

.dress-code-type {
  @include accent-font(600);
  font-size: 1.1rem;
  color: $charcoal;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
}

.couple-image {
  margin: 1.5rem 0;
  display: flex;
  justify-content: center;

  .dress-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    max-height: 280px;
    object-fit: cover;

    @media (min-width: 768px) {
      max-height: 320px;
    }
  }
}

.couple-silhouettes {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin: 1.5rem 0;

  .silhouette {
    font-size: 3rem;
    color: $charcoal;
    opacity: 0.8;

    @media (min-width: 768px) {
      font-size: 3.5rem;
    }
  }
}

.dress-note {
  @include interface-font(400);
  font-size: 0.9rem;
  color: rgba($charcoal, 0.7);
  font-style: italic;
  margin-top: 1rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
}



.gift-icon {
  font-size: 3rem;
  color: $dark-teal;
  margin: 1rem 0 1.5rem 0;

  @media (min-width: 768px) {
    font-size: 3.5rem;
    margin: 1.5rem 0 2rem 0;
  }
}

.gift-message {
  margin-bottom: 2rem;

  p {
    @include interface-font(400);
    font-size: 0.95rem;
    color: $charcoal;
    line-height: 1.6;
    margin: 0;

    @media (min-width: 768px) {
      font-size: 1.05rem;
      line-height: 1.7;
    }
  }
}

.transfer-section {
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 1rem;
  border-radius: 12px;

  &:hover {
    background: rgba($dark-teal, 0.05);
    transform: translateY(-2px);
  }

  .transfer-title {
    @include accent-font(600);
    font-size: 1rem;
    color: $dark-teal;
    letter-spacing: 1px;
    margin-bottom: 1rem;

    @media (min-width: 768px) {
      font-size: 1.1rem;
      letter-spacing: 1.5px;
    }
  }

  .transfer-hint {
    @include interface-font(400);
    font-size: 0.8rem;
    color: rgba($charcoal, 0.6);
    margin-top: 0.5rem;
    font-style: italic;

    @media (min-width: 768px) {
      font-size: 0.9rem;
    }
  }
}

.qr-code {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  font-size: 4rem;
  color: $charcoal;
  opacity: 0.8;

  @media (min-width: 768px) {
    font-size: 5rem;
  }
}

// Animaciones
.dress-code-section,
.gifts-section {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease-out forwards;

  &:nth-child(2) {
    animation-delay: 0.2s;
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
  .dress-code-gifts {
    margin: 1rem;
    gap: 2rem;
  }

  .section-title {
    font-size: 1rem;
    letter-spacing: 1.5px;
  }

  .couple-silhouettes {
    gap: 1.5rem;

    .silhouette {
      font-size: 2.5rem;
    }
  }

  .gift-icon {
    font-size: 2.5rem;
  }

  .qr-code {
    font-size: 3rem;
  }
}
</style>