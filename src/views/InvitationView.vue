<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import CountdownMusicPlayer from '@/components/CountdownMusicPlayer.vue'

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

    <!-- Envelope Container -->
    <div class="envelope-wrapper">
      <div 
        class="envelope" 
        :class="{ 'envelope-opened': isCardOpen }"
        @click="openCard"
      >
        <!-- Envelope Back -->
        <div class="envelope-back"></div>
        
        <!-- Envelope Flap -->
        <div class="envelope-flap">
          <div class="flap-seal">
            <div class="seal-decoration"></div>
          </div>
        </div>
        
        <!-- Envelope Front -->
        <div class="envelope-front">
          <div class="envelope-address">
            <p class="to-label">Para:</p>
            <p class="guest-name">Nuestros queridos invitados</p>
            <div class="envelope-decoration">
              <div class="heart-seal">♥</div>
            </div>
          </div>
        </div>
        
        <!-- Letter/Card Inside -->
        <div class="letter" :class="{ 'letter-visible': isCardOpen }">
          <div class="letter-content">
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
        
        <!-- Tap hint (only visible when closed) -->
        <div v-if="!isCardOpen" class="tap-hint">Toca para abrir el sobre</div>
      </div>
    </div>

    <!-- Audio Controls (appears after envelope opens) -->
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
    
    <!-- Countdown Music Player Component -->
    <CountdownMusicPlayer 
      v-if="isCardOpen"
      :is-audio-playing="isAudioPlaying"
      @toggle-audio="toggleAudio"
    />
  </main>
</template>

<style lang="scss" scoped>
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

.envelope-wrapper {
  perspective: 1200px;
  width: 100%;
  max-width: 380px;

  @media (min-width: 768px) {
    max-width: 450px;
  }
}

.envelope {
  position: relative;
  width: 100%;
  height: 280px;
  transform-style: preserve-3d;
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  @media (min-width: 768px) {
    height: 320px;
  }

  @media (min-width: 1024px) {
    height: 350px;
  }

  &.envelope-opened {
    transform: scale(1.1) translateY(-10px);
    cursor: default;

    .envelope-flap {
      transform: rotateX(-180deg);
    }

    .envelope-front {
      transform: translateY(100%) rotateX(-15deg);
      opacity: 0.3;
    }

    .letter {
      transform: translateY(-50px) scale(1.05);
      opacity: 1;
      z-index: 10;
    }
  }

  &:hover:not(.envelope-opened) {
    transform: translateY(-8px) scale(1.03);

    .envelope-front {
      box-shadow: 0 25px 50px rgba($dark-teal, 0.2);
    }

    .envelope-flap {
      transform: rotateX(-10deg);
    }
  }
}

.envelope-back {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, lighten($cream-white, 2%) 0%, $cream-white 100%);
  border-radius: 8px;
  box-shadow: 0 15px 35px rgba($dark-teal, 0.15);
  border: 1px solid rgba($dusty-rose, 0.3);
  z-index: 1;

  .envelope-opened & {
    z-index: 0;
  }
}

.envelope-front {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, $cream-white 0%, lighten($cream-white, 1%) 100%);
  border-radius: 8px;
  box-shadow: 0 15px 35px rgba($dark-teal, 0.12);
  border: 1px solid rgba($dusty-rose, 0.25);
  z-index: 2;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: bottom;

  .envelope-opened & {
    z-index: 1;
  }
}

.envelope-flap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(135deg, darken($cream-white, 3%) 0%, darken($cream-white, 1%) 100%);
  transform-origin: bottom;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 3;
  border-radius: 8px 8px 0 0;
  border: 1px solid rgba($dusty-rose, 0.3);

  // Flap triangle shape
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}

.flap-seal {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, $dusty-rose 0%, darken($dusty-rose, 10%) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba($dusty-rose, 0.4);
}

.seal-decoration {
  width: 20px;
  height: 20px;
  background: $cream-white;
  border-radius: 50%;
  position: relative;

  &::before {
    content: '♥';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: $dusty-rose;
    font-size: 12px;
  }
}

.envelope-address {
  padding: 2rem 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  transition: opacity 0.5s ease-out;

  .envelope-opened & {
    opacity: 0;
    z-index: 1;
    pointer-events: none;
  }
}

.to-label {
  @include interface-font(400);
  font-size: 0.9rem;
  color: rgba($dark-teal, 0.6);
  margin: 0 0 0.5rem 0;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
}

.guest-name {
  @include accent-font(600);
  font-size: 1.3rem;
  color: $dark-teal;
  margin: 0 0 1.5rem 0;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
}

.envelope-decoration {
  margin-top: auto;
}

.heart-seal {
  font-size: 2rem;
  color: $dusty-rose;
  animation: heartbeat 2s infinite;
}

@keyframes heartbeat {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

.letter {
  position: absolute;
  top: 2%;
  left: 2%;
  width: 96%;
  height: 70vh;
  max-height: 600px;
  background: linear-gradient(135deg, $cream-white 0%, lighten($cream-white, 2%) 100%);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba($dark-teal, 0.2);
  border: 2px solid rgba($dark-teal, 0.1);
  transform: translateY(20px) scale(0.85);
  opacity: 0;
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.5s;
  z-index: 1;
  overflow-y: auto;
  overflow-x: hidden;

  @media (min-width: 768px) {
    height: 75vh;
    max-height: 700px;
    left: 3%;
    width: 94%;
    top: 1%;
  }

  @media (min-width: 1024px) {
    height: 80vh;
    max-height: 750px;
  }

  &.letter-visible {
    transform: translateY(-40px) scale(1.05);
    opacity: 1;
    z-index: 15;
  }
}

.letter-content {
  padding: 1.2rem 1rem;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  position: relative;
  gap: 1rem;

  @media (min-width: 768px) {
    padding: 1.8rem 1.5rem;
    gap: 1.2rem;
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

// Tap hint for envelope
.tap-hint {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  @include interface-font(400);
  font-size: 0.85rem;
  color: rgba($dark-teal, 0.7);
  padding: 0.6rem 1.2rem;
  background: rgba($cream-white, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba($dusty-rose, 0.3);
  animation: pulse 2.5s infinite;
  box-shadow: 0 5px 15px rgba($dark-teal, 0.1);

  @media (min-width: 768px) {
    font-size: 0.9rem;
    bottom: -60px;
  }
}

@keyframes pulse {

  0%,
  100% {
    opacity: 0.7;
    transform: translateX(-50%) scale(1);
  }

  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.05);
  }
}

// Letter content styles
.couple-names-full {
  @include heading-font(600);
  font-size: 1.4rem;
  color: $dark-teal;
  margin: 0.3rem 0 0.8rem 0;

  @media (min-width: 768px) {
    font-size: 1.8rem;
    margin: 0.5rem 0 1rem 0;
  }
}

.bible-verse {
  margin: 0.5rem 0;

  .verse-text {
    @include special-font(400);
    font-size: 0.8rem;
    color: $warm-brown;
    line-height: 1.3;
    margin-bottom: 0.2rem;

    @media (min-width: 768px) {
      font-size: 0.9rem;
      line-height: 1.4;
      margin-bottom: 0.3rem;
    }
  }

  .verse-reference {
    @include interface-font(500);
    font-size: 0.7rem;
    color: rgba($dark-teal, 0.7);

    @media (min-width: 768px) {
      font-size: 0.8rem;
    }
  }
}

.wedding-details {
  margin: 0.5rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  @media (min-width: 768px) {
    gap: 1rem;
  }

  >div {
    margin-bottom: 0;
  }

  h3 {
    @include accent-font(600);
    font-size: 0.9rem;
    color: $dark-teal;
    margin-bottom: 0.2rem;

    @media (min-width: 768px) {
      font-size: 1rem;
      margin-bottom: 0.3rem;
    }
  }

  p {
    @include body-font(400);
    font-size: 0.75rem;
    color: rgba($dark-teal, 0.8);
    margin: 0.05rem 0;

    @media (min-width: 768px) {
      font-size: 0.85rem;
      margin: 0.1rem 0;
    }

    &.time {
      @include interface-font(600);
      color: $warm-brown;
      font-size: 0.8rem;

      @media (min-width: 768px) {
        font-size: 0.9rem;
      }
    }
  }
}

.blessing-text {
  margin: 0.3rem 0;

  p {
    @include accent-font(400);
    font-size: 0.7rem;
    color: rgba($dark-teal, 0.7);
    font-style: italic;
    line-height: 1.2;

    @media (min-width: 768px) {
      font-size: 0.8rem;
      line-height: 1.3;
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

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

// Responsive adjustments
@media (max-width: 480px) {
  .invitation-container {
    padding: 0.5rem;
  }

  .envelope-wrapper {
    max-width: 340px;
  }

  .envelope {
    height: 250px;
  }

  .letter {
    height: 60vh;
    max-height: 400px;
  }

  .letter-content {
    padding: 1.5rem 1rem;
  }

  .couple-names-full {
    font-size: 1.6rem;
  }

  .guest-name {
    font-size: 1.1rem;
  }

  .tap-hint {
    bottom: -40px;
    font-size: 0.8rem;
  }
}
</style>
