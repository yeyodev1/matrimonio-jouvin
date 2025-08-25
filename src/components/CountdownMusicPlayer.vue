<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Audio element reference
const audioElement = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.7)
const isMuted = ref(false)

// Countdown timer
const weddingDate = new Date('2025-11-01T17:00:00')
const timeLeft = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

let countdownInterval: number | null = null

// Computed properties
const progressPercentage = computed(() => {
  return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
})

const formattedCurrentTime = computed(() => {
  return formatTime(currentTime.value)
})

const formattedDuration = computed(() => {
  return formatTime(duration.value)
})

// Helper functions
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

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

// Audio controls
const togglePlay = () => {
  if (!audioElement.value) return
  
  if (isPlaying.value) {
    audioElement.value.pause()
  } else {
    audioElement.value.play()
  }
}

const skipForward = () => {
  if (!audioElement.value) return
  audioElement.value.currentTime = Math.min(audioElement.value.currentTime + 10, duration.value)
}

const skipBackward = () => {
  if (!audioElement.value) return
  audioElement.value.currentTime = Math.max(audioElement.value.currentTime - 10, 0)
}

const toggleMute = () => {
  if (!audioElement.value) return
  isMuted.value = !isMuted.value
  audioElement.value.muted = isMuted.value
}

const setVolume = (newVolume: number) => {
  if (!audioElement.value) return
  volume.value = newVolume
  audioElement.value.volume = newVolume
  if (newVolume > 0 && isMuted.value) {
    isMuted.value = false
    audioElement.value.muted = false
  }
}

const seekTo = (percentage: number) => {
  if (!audioElement.value || duration.value === 0) return
  const newTime = (percentage / 100) * duration.value
  audioElement.value.currentTime = newTime
}

// Audio event handlers
const onLoadedMetadata = () => {
  if (audioElement.value) {
    duration.value = audioElement.value.duration
    audioElement.value.volume = volume.value
  }
}

const onTimeUpdate = () => {
  if (audioElement.value) {
    currentTime.value = audioElement.value.currentTime
  }
}

const onPlay = () => {
  isPlaying.value = true
}

const onPause = () => {
  isPlaying.value = false
}

const onEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
}

const handleProgressClick = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  if (target) {
    const rect = target.getBoundingClientRect()
    const percentage = ((event.clientX - rect.left) / rect.width) * 100
    seekTo(percentage)
  }
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
    <!-- Audio element -->
    <audio 
      ref="audioElement"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      preload="metadata"
    >
      <source src="/src/assets/song/voy-a-quererte.mp3" type="audio/mpeg">
      Tu navegador no soporta el elemento de audio.
    </audio>

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
      
      <!-- Versión Desktop -->
      <div class="desktop-player">
        <div class="audio-controls">
          <button @click="toggleMute" class="control-btn volume-btn" :class="{ 'muted': isMuted }">
            <i v-if="isMuted" class="fas fa-volume-mute"></i>
            <i v-else-if="volume < 0.5" class="fas fa-volume-down"></i>
            <i v-else class="fas fa-volume-up"></i>
          </button>
          <button @click="skipBackward" class="control-btn">
            <i class="fas fa-step-backward"></i>
          </button>
          <button @click="togglePlay" class="control-btn play-btn" :class="{ 'playing': isPlaying }">
            <i v-if="isPlaying" class="fas fa-pause"></i>
            <i v-else class="fas fa-play"></i>
          </button>
          <button @click="skipForward" class="control-btn">
            <i class="fas fa-step-forward"></i>
          </button>
          <button @click="() => seekTo(0)" class="control-btn">
            <i class="fas fa-redo"></i>
          </button>
        </div>
        
        <div class="progress-section">
          <span class="time-display">{{ formattedCurrentTime }}</span>
          <div class="progress-bar" @click="handleProgressClick">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
            <div class="progress-handle" :style="{ left: progressPercentage + '%' }"></div>
          </div>
          <span class="time-display">{{ formattedDuration }}</span>
        </div>
        
        <div class="volume-section">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            :value="volume" 
            @input="(e) => setVolume(parseFloat((e.target as HTMLInputElement).value))"
            class="volume-slider"
          >
        </div>
      </div>
      
      <!-- Versión Mobile -->
      <div class="mobile-player">
        <div class="mobile-controls">
          <button @click="skipBackward" class="mobile-btn">
            <i class="fas fa-step-backward"></i>
          </button>
          <button @click="togglePlay" class="mobile-btn play-btn" :class="{ 'playing': isPlaying }">
            <i v-if="isPlaying" class="fas fa-pause"></i>
            <i v-else class="fas fa-play"></i>
          </button>
          <button @click="skipForward" class="mobile-btn">
            <i class="fas fa-step-forward"></i>
          </button>
        </div>
        
        <div class="mobile-progress">
          <div class="progress-bar" @click="handleProgressClick">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          <div class="time-info">
            <span>{{ formattedCurrentTime }}</span>
            <span>{{ formattedDuration }}</span>
          </div>
        </div>
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
  
  /* Desktop Player */
  .desktop-player {
    display: block;
    
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  /* Mobile Player */
  .mobile-player {
    display: none;
    
    @media (max-width: 768px) {
      display: block;
    }
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
      
      &.volume-btn {
        &.muted {
          color: rgba($charcoal, 0.5);
        }
      }
    }
  }
  
  .progress-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    justify-content: center;
    
    .time-display {
      @include interface-font(400);
      color: $charcoal;
      font-size: 0.8rem;
      min-width: 40px;
      text-align: center;
    }
  }
  
  .progress-bar {
    flex: 1;
    max-width: 200px;
    height: 6px;
    background: rgba($charcoal, 0.1);
    border-radius: 3px;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      height: 8px;
      background: rgba($charcoal, 0.15);
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, $dusty-rose 0%, $dark-teal 100%);
      border-radius: 3px;
      transition: width 0.1s ease;
      position: relative;
    }
    
    .progress-handle {
      position: absolute;
      top: 50%;
      width: 12px;
      height: 12px;
      background: $white;
      border: 2px solid $dark-teal;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      transition: all 0.1s ease;
      opacity: 0;
    }
    
    &:hover .progress-handle {
      opacity: 1;
    }
  }
  
  .volume-section {
    display: flex;
    align-items: center;
    justify-content: center;
    
    .volume-slider {
      width: 80px;
      height: 3px;
      background: rgba($charcoal, 0.1);
      border-radius: 2px;
      outline: none;
      cursor: pointer;
      appearance: none;
      
      &::-webkit-slider-thumb {
        appearance: none;
        width: 12px;
        height: 12px;
        background: $dark-teal;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
      
      &::-moz-range-thumb {
        width: 12px;
        height: 12px;
        background: $dark-teal;
        border-radius: 50%;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
    }
  }
  
  /* Mobile Player Styles */
  .mobile-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    
    .mobile-btn {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      border: none;
      background: rgba($charcoal, 0.1);
      color: $charcoal;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:active {
        transform: scale(0.95);
      }
      
      &.play-btn {
        width: 55px;
        height: 55px;
        background: linear-gradient(135deg, $dusty-rose 0%, $warm-brown 100%);
        color: $white;
        font-size: 1.3rem;
        box-shadow: 0 4px 15px rgba($dusty-rose, 0.3);
        
        &.playing {
          background: linear-gradient(135deg, $dark-teal 0%, $primary-color 100%);
          box-shadow: 0 4px 15px rgba($dark-teal, 0.3);
        }
      }
    }
  }
  
  .mobile-progress {
    .progress-bar {
      width: 100%;
      max-width: 250px;
      height: 4px;
      margin: 0 auto 0.5rem;
      background: rgba($charcoal, 0.1);
      border-radius: 2px;
      position: relative;
      cursor: pointer;
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, $dusty-rose 0%, $dark-teal 100%);
        border-radius: 2px;
        transition: width 0.1s ease;
      }
      
      .progress-handle {
        display: none; /* Hide handle on mobile */
      }
    }
    
    .time-info {
      display: flex;
      justify-content: space-between;
      @include interface-font(400);
      color: rgba($charcoal, 0.7);
      font-size: 0.75rem;
      max-width: 250px;
      margin: 0 auto;
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