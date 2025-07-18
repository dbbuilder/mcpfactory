<template>
  <div class="loading-spinner" :class="[sizeClass, colorClass]">
    <svg v-if="type === 'circle'" class="animate-spin" :width="svgSize" :height="svgSize" viewBox="0 0 24 24" fill="none">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    
    <div v-else-if="type === 'dots'" class="loading-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
    
    <div v-else-if="type === 'pulse'" class="loading-pulse"></div>
    
    <div v-else-if="type === 'bars'" class="loading-bars">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    
    <span v-if="showText" class="loading-text" :class="textPositionClass">{{ text }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'circle',
    validator: (value) => ['circle', 'dots', 'pulse', 'bars'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'white', 'gray', 'success', 'error', 'warning'].includes(value)
  },
  text: {
    type: String,
    default: 'Loading...'
  },
  showText: {
    type: Boolean,
    default: false
  },
  textPosition: {
    type: String,
    default: 'bottom',
    validator: (value) => ['bottom', 'right'].includes(value)
  },
  fullScreen: {
    type: Boolean,
    default: false
  },
  overlay: {
    type: Boolean,
    default: false
  }
})

const sizeClass = computed(() => `size-${props.size}`)
const colorClass = computed(() => `color-${props.color}`)
const textPositionClass = computed(() => `text-${props.textPosition}`)

const svgSize = computed(() => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
  }
  return sizes[props.size]
})
</script>

<style scoped>
.loading-spinner {
  @apply inline-flex items-center justify-center;
}

/* Full screen overlay */
.loading-spinner.fullscreen {
  @apply fixed inset-0 z-50 bg-gray-900 bg-opacity-75;
}

.loading-spinner.overlay {
  @apply absolute inset-0 z-10 bg-gray-900 bg-opacity-50;
}

/* Size variations */
.loading-spinner.size-sm {
  @apply space-x-2;
}

.loading-spinner.size-md {
  @apply space-x-3;
}

.loading-spinner.size-lg {
  @apply space-x-4;
}

.loading-spinner.size-xl {
  @apply space-x-5;
}

/* Color variations */
.loading-spinner.color-primary {
  @apply text-indigo-500;
}

.loading-spinner.color-white {
  @apply text-white;
}

.loading-spinner.color-gray {
  @apply text-gray-400;
}

.loading-spinner.color-success {
  @apply text-green-500;
}

.loading-spinner.color-error {
  @apply text-red-500;
}

.loading-spinner.color-warning {
  @apply text-yellow-500;
}

/* Loading text */
.loading-text {
  @apply text-sm font-medium;
}

.loading-text.text-bottom {
  @apply mt-2 block w-full text-center;
}

.loading-text.text-right {
  @apply ml-3;
}

/* Dots animation */
.loading-dots {
  @apply flex space-x-1;
}

.loading-dots span {
  @apply block rounded-full bg-current;
  animation: dot-pulse 1.4s ease-in-out infinite both;
}

.size-sm .loading-dots span {
  @apply w-1.5 h-1.5;
}

.size-md .loading-dots span {
  @apply w-2 h-2;
}

.size-lg .loading-dots span {
  @apply w-2.5 h-2.5;
}

.size-xl .loading-dots span {
  @apply w-3 h-3;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes dot-pulse {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Pulse animation */
.loading-pulse {
  @apply relative rounded-full bg-current;
}

.size-sm .loading-pulse {
  @apply w-4 h-4;
}

.size-md .loading-pulse {
  @apply w-6 h-6;
}

.size-lg .loading-pulse {
  @apply w-8 h-8;
}

.size-xl .loading-pulse {
  @apply w-12 h-12;
}

.loading-pulse::before {
  content: '';
  @apply absolute inset-0 rounded-full bg-current;
  animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.95);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Bars animation */
.loading-bars {
  @apply flex items-end;
}

.loading-bars span {
  @apply bg-current mx-0.5;
  animation: bar-scale 1s ease-in-out infinite;
}

.size-sm .loading-bars span {
  @apply w-0.5 h-3;
}

.size-md .loading-bars span {
  @apply w-1 h-4;
}

.size-lg .loading-bars span {
  @apply w-1 h-5;
}

.size-xl .loading-bars span {
  @apply w-1.5 h-6;
}

.loading-bars span:nth-child(1) {
  animation-delay: 0s;
}

.loading-bars span:nth-child(2) {
  animation-delay: 0.1s;
}

.loading-bars span:nth-child(3) {
  animation-delay: 0.2s;
}

.loading-bars span:nth-child(4) {
  animation-delay: 0.3s;
}

@keyframes bar-scale {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}
</style>