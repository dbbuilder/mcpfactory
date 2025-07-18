<template>
  <Transition name="fade">
    <div v-if="isLoading" class="loading-overlay" :class="{ 'is-global': global }">
      <div class="loading-content">
        <LoadingSpinner
          :type="spinnerType"
          :size="spinnerSize"
          :color="spinnerColor"
          :show-text="showText"
          :text="text"
        />
        <div v-if="showProgress && progress !== null" class="loading-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
          </div>
          <span class="progress-text">{{ progress }}%</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: 'Loading...'
  },
  showText: {
    type: Boolean,
    default: true
  },
  spinnerType: {
    type: String,
    default: 'circle'
  },
  spinnerSize: {
    type: String,
    default: 'lg'
  },
  spinnerColor: {
    type: String,
    default: 'primary'
  },
  global: {
    type: Boolean,
    default: false
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: null,
    validator: (value) => value === null || (value >= 0 && value <= 100)
  }
})

const emit = defineEmits(['update:modelValue'])

const isLoading = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  isLoading.value = newValue
})

watch(isLoading, (newValue) => {
  emit('update:modelValue', newValue)
  
  // Prevent body scroll when global overlay is shown
  if (props.global) {
    if (newValue) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})
</script>

<style scoped>
.loading-overlay {
  @apply absolute inset-0 z-40 flex items-center justify-center bg-gray-900 bg-opacity-75;
}

.loading-overlay.is-global {
  @apply fixed;
}

.loading-content {
  @apply text-center;
}

.loading-progress {
  @apply mt-6 w-64;
}

.progress-bar {
  @apply relative h-2 w-full overflow-hidden rounded-full bg-gray-700;
}

.progress-fill {
  @apply absolute left-0 top-0 h-full bg-indigo-500 transition-all duration-300 ease-out;
}

.progress-text {
  @apply mt-2 block text-sm font-medium text-gray-300;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>