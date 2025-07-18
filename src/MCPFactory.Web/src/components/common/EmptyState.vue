<template>
  <div class="empty-state" :class="sizeClass">
    <div class="empty-icon" v-if="icon || $slots.icon">
      <slot name="icon">
        <component :is="icon" class="icon" />
      </slot>
    </div>
    
    <h3 class="empty-title" v-if="title">{{ title }}</h3>
    
    <p class="empty-description" v-if="description">{{ description }}</p>
    
    <div class="empty-actions" v-if="$slots.action || actionText">
      <slot name="action">
        <button
          v-if="actionText"
          @click="$emit('action')"
          class="action-button"
        >
          {{ actionText }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: [Object, String],
    default: null
  },
  title: {
    type: String,
    default: 'No data found'
  },
  description: {
    type: String,
    default: null
  },
  actionText: {
    type: String,
    default: null
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const emit = defineEmits(['action'])

const sizeClass = computed(() => `size-${props.size}`)
</script>

<style scoped>
.empty-state {
  @apply flex flex-col items-center justify-center text-center py-12;
}

.empty-icon {
  @apply mb-4;
}

.empty-icon .icon {
  @apply text-gray-400;
}

.empty-title {
  @apply font-medium text-white;
}

.empty-description {
  @apply text-gray-400 max-w-sm mx-auto;
}

.empty-actions {
  @apply flex items-center justify-center space-x-3;
}

.action-button {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
}

/* Size variations */
.size-sm .empty-icon .icon {
  @apply h-8 w-8;
}

.size-sm .empty-title {
  @apply text-sm;
}

.size-sm .empty-description {
  @apply mt-1 text-xs;
}

.size-sm .empty-actions {
  @apply mt-4;
}

.size-md .empty-icon .icon {
  @apply h-12 w-12;
}

.size-md .empty-title {
  @apply text-base;
}

.size-md .empty-description {
  @apply mt-2 text-sm;
}

.size-md .empty-actions {
  @apply mt-6;
}

.size-lg .empty-icon .icon {
  @apply h-16 w-16;
}

.size-lg .empty-title {
  @apply text-lg;
}

.size-lg .empty-description {
  @apply mt-2 text-base;
}

.size-lg .empty-actions {
  @apply mt-8;
}
</style>