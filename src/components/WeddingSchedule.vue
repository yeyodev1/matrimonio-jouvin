<script setup lang="ts">
import { ref } from 'vue'

// Datos del cronograma
const scheduleItems = ref([
  {
    time: '5:00 PM',
    title: 'Inicio de',
    subtitle: 'Misa',
    icon: 'rings',
    side: 'right'
  },
  {
    time: '6:00 PM',
    title: 'Sesión de fotos',
    subtitle: 'en iglesia',
    icon: 'camera',
    side: 'left'
  },
  {
    time: '7:00 PM',
    title: 'Recepción de',
    subtitle: 'Invitados',
    icon: 'reception',
    side: 'right'
  },
  {
    time: '7:30 PM',
    title: 'Inicio de',
    subtitle: 'Programa',
    icon: 'program',
    side: 'left'
  },
  {
    time: '2:00 AM',
    title: 'Fin del',
    subtitle: 'Evento',
    icon: 'party',
    side: 'right'
  }
])
</script>

<template>
  <div class="wedding-schedule">
    <div class="schedule-header">
      <h2 class="schedule-title">ITINERARIO DE ACTIVIDADES</h2>
    </div>
    
    <div class="timeline-container">
      <!-- Línea vertical central -->
      <div class="timeline-line"></div>
      
      <!-- Items del cronograma -->
      <div 
        v-for="(item, index) in scheduleItems" 
        :key="index"
        class="timeline-item"
        :class="`timeline-item--${item.side}`"
      >
        <!-- Contenido del item -->
        <div class="timeline-content">
          <div class="time-display">{{ item.time }}</div>
          <div class="event-info">
            <div class="event-title">{{ item.title }}</div>
            <div v-if="item.subtitle" class="event-subtitle">{{ item.subtitle }}</div>
          </div>
        </div>
        
        <!-- Punto e icono en la línea -->
        <div class="timeline-point">
          <div class="timeline-icon">
            <!-- Iconos Font Awesome -->
            <i v-if="item.icon === 'rings'" class="fas fa-heart icon"></i>
            <i v-else-if="item.icon === 'camera'" class="fas fa-camera icon"></i>
            <i v-else-if="item.icon === 'reception'" class="fas fa-users icon"></i>
            <i v-else-if="item.icon === 'program'" class="fas fa-calendar-check icon"></i>
            <i v-else-if="item.icon === 'party'" class="fas fa-glass-cheers icon"></i>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Decoración floral -->
    <div class="floral-decoration">
      <svg viewBox="0 0 100 50" class="leaves">
        <path d="M10,40 Q20,20 30,40 Q40,20 50,40 Q60,20 70,40 Q80,20 90,40" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              opacity="0.3"/>
        <ellipse cx="25" cy="35" rx="8" ry="4" fill="currentColor" opacity="0.2"/>
        <ellipse cx="45" cy="30" rx="6" ry="3" fill="currentColor" opacity="0.25"/>
        <ellipse cx="65" cy="35" rx="7" ry="4" fill="currentColor" opacity="0.2"/>
        <ellipse cx="75" cy="25" rx="5" ry="3" fill="currentColor" opacity="0.3"/>
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wedding-schedule {
  width: 100%;
  max-width: 600px;
  margin: 2rem;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, $cream-white 0%, lighten($cream-white, 2%) 100%);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba($dark-teal, 0.1);
  border: 1px solid rgba($dusty-rose, 0.2);
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    padding: 2.5rem 2rem;
  }
}

.schedule-header {
  text-align: center;
  margin-bottom: 2.5rem;

  .schedule-title {
    @include heading-font(700);
    font-size: 1.2rem;
    color: $dark-teal;
    letter-spacing: 2px;
    margin: 0;

    @media (min-width: 768px) {
      font-size: 1.4rem;
      letter-spacing: 3px;
    }
  }
}

.timeline-container {
  position: relative;
  padding: 1rem 0;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, $dusty-rose, $warm-brown);
  transform: translateX(-50%);
  z-index: 1;
}

.timeline-item {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 2.5rem;
  z-index: 2;
  width: 100%;
  min-height: 60px;

  &:last-child {
    margin-bottom: 0;
  }

  &--left {
    justify-content: flex-end;

    .timeline-content {
      margin-right: 2rem;
      text-align: right;
      flex: 0 1 calc(50% - 3rem);
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      @media (min-width: 768px) {
        margin-right: 3rem;
        flex: 0 1 calc(50% - 4rem);
      }
    }

    .timeline-point {
      flex-shrink: 0;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &--right {
    justify-content: flex-start;

    .timeline-content {
      margin-left: 2rem;
      text-align: left;
      flex: 0 1 calc(50% - 3rem);
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      @media (min-width: 768px) {
        margin-left: 3rem;
        flex: 0 1 calc(50% - 4rem);
      }
    }

    .timeline-point {
      flex-shrink: 0;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}



.time-display {
  @include interface-font(700);
  font-size: 0.9rem;
  color: $dark-teal;
  margin-bottom: 0.3rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
}

.event-info {
  .event-title {
    @include accent-font(600);
    font-size: 0.85rem;
    color: $charcoal;
    line-height: 1.2;
    margin-bottom: 0.1rem;

    @media (min-width: 768px) {
      font-size: 0.95rem;
    }
  }

  .event-subtitle {
    @include accent-font(400);
    font-size: 0.8rem;
    color: rgba($charcoal, 0.8);
    line-height: 1.2;

    @media (min-width: 768px) {
      font-size: 0.9rem;
    }
  }
}

.timeline-point {
  width: 50px;
  height: 50px;
  background: $cream-white;
  border: 3px solid $dusty-rose;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba($dusty-rose, 0.3);
  z-index: 3;
  position: relative;

  @media (min-width: 768px) {
    width: 60px;
    height: 60px;
  }
}

.timeline-icon {
  .icon {
    font-size: 24px;
    color: $warm-brown;

    @media (min-width: 768px) {
      font-size: 28px;
    }
  }
}

.floral-decoration {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 120px;
  height: 60px;
  color: rgba($dusty-rose, 0.4);
  z-index: 1;

  .leaves {
    width: 100%;
    height: 100%;
  }

  @media (min-width: 768px) {
    width: 150px;
    height: 75px;
    bottom: 1.5rem;
    right: 1.5rem;
  }
}

/* Animaciones */
.timeline-item {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease-out forwards;

  @for $i from 1 through 7 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.1}s;
    }
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.timeline-point {
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(-50%) scale(1.1);
    box-shadow: 0 6px 20px rgba($dusty-rose, 0.4);
  }
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .wedding-schedule {
    margin: 1rem;
    padding: 1.5rem 0.8rem;
  }

  .timeline-item {
    margin-bottom: 2rem;
    min-height: 50px;

    &--left .timeline-content {
      margin-right: 1.5rem;
      flex: 0 1 calc(50% - 2rem);
    }

    &--right .timeline-content {
      margin-left: 1.5rem;
      flex: 0 1 calc(50% - 2rem);
    }
  }

  .timeline-point {
    width: 40px;
    height: 40px;
  }

  .timeline-icon .icon {
    width: 20px;
    height: 20px;
  }

  .time-display {
    font-size: 0.8rem;
  }

  .event-title {
    font-size: 0.75rem;
  }

  .event-subtitle {
    font-size: 0.7rem;
  }
}
</style>