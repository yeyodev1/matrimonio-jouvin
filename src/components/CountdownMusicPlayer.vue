<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineEmits } from 'vue'

// Props
const props = defineProps({
  isAudioPlaying: {
    type: Boolean,
    required: true
  }
})

// Emits
const emit = defineEmits(['toggle-audio'])

// Countdown timer
const weddingDate = new Date('2025-11-01T17:00:00')
const timeLeft = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

let countdownInterval: number | null = null

const updateCountdown = () => {
  const now = new Date().getTime()
  const distance = weddingDate.getTime() - now
  
  if (distance > 0) {
    timeLeft.value = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    }
  } else {
    timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
}

const handleToggleAudio = () => {
  emit('toggle-audio')
}

onMounted(() => {
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<template>
  <div class="countdown-music-player">
    <!-- Header con fecha -->
    <div class="countdown-header">
      <p class="month">Noviembre</p>
      <p class="day">Sábado <span class="date">1</span> <span class="year">2025</span></p>
    </div>
    
    <!-- Contador regresivo -->
    <div class="countdown-timer">
      <p class="faltan-label">FALTAN</p>
      <div class="time-display">
        <span class="time-number">{{ String(timeLeft.days).padStart(2, '0') }}</span>
        <span class="separator">:</span>
        <span class="time-number">{{ String(timeLeft.hours).padStart(2, '0') }}</span>
        <span class="separator">:</span>
        <span class="time-number">{{ String(timeLeft.minutes).padStart(2, '0') }}</span>
        <span class="separator">:</span>
        <span class="time-number">{{ String(timeLeft.seconds).padStart(2, '0') }}</span>
      </div>
      <div class="time-labels">
        <span class="time-label">DÍAS</span>
        <span class="time-label">HORAS</span>
        <span class="time-label">MINUTOS</span>
        <span class="time-label">SEGUNDOS</span>
      </div>
    </div>
    
    <!-- Reproductor de música -->
    <div class="music-section">
      <p class="music-text">Dale PLAY a nuestra canción</p>
      <div class="audio-controls">
        <button class="control-btn" disabled>
          <i class="fas fa-heart"></i>
        </button>
        <button class="control-btn" disabled>
          <i class="fas fa-step-backward"></i>
        </button>
        <button 
          @click="handleToggleAudio" 
          class="control-btn play-btn"
          :class="{ 'playing': isAudioPlaying }"
        >
          <i v-if="isAudioPlaying" class="fas fa-pause"></i>
          <i v-else class="fas fa-play"></i>
        </button>
        <button class="control-btn" disabled>
          <i class="fas fa-step-forward"></i>
        </button>
        <button class="control-btn" disabled>
          <i class="fas fa-redo"></i>
        </button>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :class="{ 'playing': isAudioPlaying }"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/colorVariables.module.scss';
@import '@/styles/fonts.modules.scss';

.countdown-music-player {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  min-width: 280px;
  text-align: center;
  
  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    min-width: auto;
    padding: 1rem;
  }
}

.countdown-header {
  margin-bottom: 1rem;
  
  .month {
    @include special-font(400);
    font-size: 1.2rem;
    color: $dark-teal;
    margin: 0 0 0.25rem 0;
  }
  
  .day {
    @include interface-font(400);
    font-size: 0.9rem;
    color: $charcoal;
    margin: 0;
    
    .date {
      font-size: 1.1rem;
      font-weight: 600;
    }
    
    .year {
      font-size: 0.8rem;
      opacity: 0.7;
    }
  }
}

.countdown-timer {
  margin-bottom: 1.5rem;
  
  .faltan-label {
    @include interface-font(600);
    font-size: 0.8rem;
    color: $charcoal;
    margin: 0 0 0.5rem 0;
    letter-spacing: 1px;
  }
  
  .time-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
    
    .time-number {
      @include interface-font(700);
      font-size: 1.8rem;
      color: $dark-teal;
      min-width: 2.5rem;
      
      @media (max-width: 768px) {
        font-size: 1.4rem;
        min-width: 2rem;
      }
    }
    
    .separator {
      font-size: 1.5rem;
      color: $dusty-rose;
      font-weight: 300;
      
      @media (max-width: 768px) {
        font-size: 1.2rem;
      }
    }
  }
  
  .time-labels {
    display: flex;
    justify-content: space-between;
    
    .time-label {
      @include interface-font(500);
      font-size: 0.6rem;
      color: $charcoal;
      opacity: 0.7;
      letter-spacing: 0.5px;
      flex: 1;
      text-align: center;
      
      @media (max-width: 768px) {
        font-size: 0.55rem;
      }
    }
  }
}

.music-section {
  .music-text {
    @include special-font(400);
    font-size: 1rem;
    color: $dark-teal;
    margin: 0 0 1rem 0;
  }
  
  .audio-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    
    .control-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: rgba($charcoal, 0.1);
      color: $charcoal;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      &:not(:disabled):hover {
        background: rgba($dusty-rose, 0.2);
        transform: translateY(-1px);
      }
      
      &.play-btn {
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, $dusty-rose 0%, $warm-brown 100%);
        color: $white;
        font-size: 1.2rem;
        box-shadow: 0 4px 15px rgba($dusty-rose, 0.3);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba($dusty-rose, 0.4);
        }
        
        &.playing {
          background: linear-gradient(135deg, $dark-teal 0%, $primary-color 100%);
          box-shadow: 0 4px 15px rgba($dark-teal, 0.3);
          
          &:hover {
            box-shadow: 0 6px 20px rgba($dark-teal, 0.4);
          }
        }
      }
    }
  }
  
  .progress-bar {
    width: 100%;
    height: 4px;
    background: rgba($charcoal, 0.1);
    border-radius: 2px;
    overflow: hidden;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, $dusty-rose 0%, $dark-teal 100%);
      width: 0%;
      border-radius: 2px;
      transition: width 0.3s ease;
      
      &.playing {
        width: 35%;
        animation: progressPulse 2s ease-in-out infinite;
      }
    }
  }
}

@keyframes progressPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>