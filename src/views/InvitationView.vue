<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isCardOpen = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)
const isAudioPlaying = ref(false)

const openCard = async () => {
  if (!isCardOpen.value) {
    isCardOpen.value = true
    
    // Reproducir música después de un pequeño delay para la animación
    setTimeout(async () => {
      if (audioRef.value) {
        try {
          await audioRef.value.play()
          isAudioPlaying.value = true
        } catch (error) {
          console.log('Autoplay bloqueado, el usuario debe interactuar primero')
        }
      }
    }, 500)
  }
}

const toggleAudio = () => {
  if (audioRef.value) {
    if (isAudioPlaying.value) {
      audioRef.value.pause()
      isAudioPlaying.value = false
    } else {
      audioRef.value.play()
      isAudioPlaying.value = true
    }
  }
}
</script>

<template>
  <main class="invitation-container">
    <!-- Audio element (hidden) -->
    <audio 
      ref="audioRef" 
      loop 
      preload="auto"
      @ended="isAudioPlaying = false"
    >
      <source src="/src/assets/song/voy-a-quererte.mp3" type="audio/mpeg">
    </audio>

    <!-- Card Container -->
    <div class="card-wrapper">
      <div 
        class="wedding-card" 
        :class="{ 'card-open': isCardOpen }"
        @click="openCard"
      >
        <!-- Card Front (Closed State) -->
        <div class="card-front">
          <div class="card-content">
            <div class="floral-decoration top"></div>
            <h1 class="couple-names">Génesis & Christopher</h1>
            <p class="invitation-text">Te invitamos a celebrar nuestro amor</p>
            <div class="date-preview">1 de Noviembre, 2025</div>
            <div class="tap-hint">Toca para abrir</div>
            <div class="floral-decoration bottom"></div>
          </div>
        </div>

        <!-- Card Back (Open State) -->
        <div class="card-back">
          <div class="card-content">
            <div class="floral-decoration top"></div>
            
            <h1 class="couple-names-full">Génesis y Christopher</h1>
            
            <div class="bible-verse">
              <p class="verse-text">
                "Ya no son dos, sino uno solo.<br>
                Por tanto, lo que Dios ha unido,<br>
                que no lo separe el hombre"
              </p>
              <p class="verse-reference">Mateo 19:6</p>
            </div>

            <div class="wedding-details">
              <div class="date-section">
                <h3>Fecha</h3>
                <p>Sábado, 1 de Noviembre de 2025</p>
              </div>
              
              <div class="ceremony-section">
                <h3>Ceremonia Religiosa</h3>
                <p>Iglesia San Gabriel de la Dolorosa</p>
                <p class="time">5:00 PM</p>
              </div>
              
              <div class="reception-section">
                <h3>Recepción</h3>
                <p>Edificio Las Cámaras</p>
                <p class="time">7:00 PM</p>
              </div>
            </div>

            <div class="blessing-text">
              <p>Con el amor que nos une, la bendición de Dios<br>y el apoyo de nuestros padres</p>
            </div>

            <div class="floral-decoration bottom"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Audio Controls (appears after card opens) -->
    <div v-if="isCardOpen" class="audio-controls">
      <button 
        @click="toggleAudio" 
        class="audio-toggle"
        :class="{ 'playing': isAudioPlaying }"
      >
        <i v-if="isAudioPlaying" class="fas fa-pause"></i>
        <i v-else class="fas fa-play"></i>
      </button>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@import '@/styles/colorVariables.module.scss';
@import '@/styles/fonts.modules.scss';

.invitation-container {
  min-height: 100vh;
  background: linear-gradient(135deg, $cream-white 0%, lighten($cream-white, 2%) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;

  // Subtle background pattern
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(circle at 20% 80%, rgba($dusty-rose, 0.03) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba($dark-teal, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }
}

.card-wrapper {
  perspective: 1000px;
  width: 100%;
  max-width: 400px;
  
  @media (min-width: 768px) {
    max-width: 500px;
  }
}

.wedding-card {
  position: relative;
  width: 100%;
  height: 600px;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  @media (min-width: 768px) {
    height: 700px;
  }

  &.card-open {
    transform: rotateY(180deg);
    cursor: default;
  }

  &:hover:not(.card-open) {
    transform: translateY(-5px) scale(1.02);
    
    .card-front {
      box-shadow: 0 20px 40px rgba($dark-teal, 0.15);
    }
  }
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba($dark-teal, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card-front {
  background: linear-gradient(135deg, $cream-white 0%, lighten($cream-white, 1%) 100%);
  border: 2px solid rgba($dusty-rose, 0.2);
}

.card-back {
  background: linear-gradient(135deg, $cream-white 0%, lighten($cream-white, 1%) 100%);
  border: 2px solid rgba($dark-teal, 0.2);
  transform: rotateY(180deg);
}

.card-content {
  padding: 2rem 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  
  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
}

.floral-decoration {
  position: absolute;
  width: 60px;
  height: 60px;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
  }
  
  &.top {
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    
    &::before {
      width: 8px;
      height: 8px;
      background: $dusty-rose;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    
    &::after {
      width: 4px;
      height: 4px;
      background: $warm-brown;
      top: 15px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  
  &.bottom {
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%) rotate(180deg);
    
    &::before {
      width: 6px;
      height: 6px;
      background: $dark-teal;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    
    &::after {
      width: 3px;
      height: 3px;
      background: $dusty-rose;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}

// Front card styles
.couple-names {
  @include heading-font(700);
  font-size: 2.5rem;
  color: $dark-teal;
  margin: 1rem 0;
  letter-spacing: -0.02em;
  
  @media (min-width: 768px) {
    font-size: 3rem;
  }
}

.invitation-text {
  @include accent-font(400);
  font-size: 1.1rem;
  color: $warm-brown;
  margin: 1rem 0;
  font-style: italic;
  
  @media (min-width: 768px) {
    font-size: 1.3rem;
  }
}

.date-preview {
  @include body-font(500);
  font-size: 1rem;
  color: $dark-teal;
  margin: 1.5rem 0;
  padding: 0.8rem 1.5rem;
  background: rgba($dusty-rose, 0.1);
  border-radius: 25px;
  border: 1px solid rgba($dusty-rose, 0.2);
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
}

.tap-hint {
  @include interface-font(400);
  font-size: 0.9rem;
  color: rgba($dark-teal, 0.6);
  margin-top: auto;
  padding: 0.5rem 1rem;
  background: rgba($warm-brown, 0.1);
  border-radius: 15px;
  animation: pulse 2s infinite;
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

// Back card styles
.couple-names-full {
  @include heading-font(600);
  font-size: 2rem;
  color: $dark-teal;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
}

.bible-verse {
  margin: 1.5rem 0;
  
  .verse-text {
    @include special-font(400);
    font-size: 0.95rem;
    color: $warm-brown;
    line-height: 1.6;
    margin-bottom: 0.5rem;
    
    @media (min-width: 768px) {
      font-size: 1.1rem;
    }
  }
  
  .verse-reference {
    @include interface-font(500);
    font-size: 0.85rem;
    color: rgba($dark-teal, 0.7);
    
    @media (min-width: 768px) {
      font-size: 0.9rem;
    }
  }
}

.wedding-details {
  margin: 2rem 0;
  width: 100%;
  
  > div {
    margin-bottom: 1.5rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  h3 {
    @include accent-font(600);
    font-size: 1.1rem;
    color: $dark-teal;
    margin-bottom: 0.5rem;
    
    @media (min-width: 768px) {
      font-size: 1.2rem;
    }
  }
  
  p {
    @include body-font(400);
    font-size: 0.9rem;
    color: rgba($dark-teal, 0.8);
    margin: 0.2rem 0;
    
    @media (min-width: 768px) {
      font-size: 1rem;
    }
    
    &.time {
      @include interface-font(600);
      color: $warm-brown;
      font-size: 1rem;
      
      @media (min-width: 768px) {
        font-size: 1.1rem;
      }
    }
  }
}

.blessing-text {
  margin-top: auto;
  
  p {
    @include accent-font(400);
    font-size: 0.85rem;
    color: rgba($dark-teal, 0.7);
    font-style: italic;
    line-height: 1.5;
    
    @media (min-width: 768px) {
      font-size: 0.95rem;
    }
  }
}

// Audio controls
.audio-controls {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.audio-toggle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid $dusty-rose;
  background: rgba($cream-white, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba($dusty-rose, 0.3);
  }
  
  &.playing {
    border-color: $warm-brown;
    background: rgba($warm-brown, 0.1);
    animation: musicPulse 1.5s infinite;
  }
}

@keyframes musicPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

// Responsive adjustments
@media (max-width: 480px) {
  .invitation-container {
    padding: 0.5rem;
  }
  
  .wedding-card {
    height: 550px;
  }
  
  .card-content {
    padding: 1.5rem 1rem;
  }
  
  .couple-names {
    font-size: 2rem;
  }
  
  .couple-names-full {
    font-size: 1.8rem;
  }
}
</style>
