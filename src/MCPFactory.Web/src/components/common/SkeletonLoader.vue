<template>
  <div class="skeleton-loader" :class="[type, className]">
    <div v-if="type === 'text'" class="skeleton-text">
      <div v-for="n in lines" :key="n" class="skeleton-line" :style="getLineStyle(n)"></div>
    </div>
    <div v-else-if="type === 'card'" class="skeleton-card">
      <div class="skeleton-header">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-title-group">
          <div class="skeleton-title"></div>
          <div class="skeleton-subtitle"></div>
        </div>
      </div>
      <div class="skeleton-content">
        <div v-for="n in 3" :key="n" class="skeleton-line"></div>
      </div>
      <div class="skeleton-footer">
        <div class="skeleton-button"></div>
        <div class="skeleton-button"></div>
      </div>
    </div>
    <div v-else-if="type === 'table'" class="skeleton-table">
      <div class="skeleton-table-header">
        <div v-for="n in columns" :key="n" class="skeleton-cell"></div>
      </div>
      <div v-for="row in rows" :key="row" class="skeleton-table-row">
        <div v-for="n in columns" :key="n" class="skeleton-cell"></div>
      </div>
    </div>
    <div v-else-if="type === 'form'" class="skeleton-form">
      <div v-for="n in fields" :key="n" class="skeleton-field">
        <div class="skeleton-label"></div>
        <div class="skeleton-input"></div>
      </div>
    </div>
    <div v-else-if="type === 'stats'" class="skeleton-stats">
      <div v-for="n in 4" :key="n" class="skeleton-stat">
        <div class="skeleton-stat-label"></div>
        <div class="skeleton-stat-value"></div>
        <div class="skeleton-stat-change"></div>
      </div>
    </div>
    <div v-else-if="type === 'avatar'" class="skeleton-avatar" :style="avatarStyle"></div>
    <div v-else-if="type === 'button'" class="skeleton-button" :style="buttonStyle"></div>
    <div v-else class="skeleton-rect" :style="rectStyle"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'card', 'table', 'form', 'stats', 'avatar', 'button', 'rect'].includes(value)
  },
  lines: {
    type: Number,
    default: 3
  },
  rows: {
    type: Number,
    default: 5
  },
  columns: {
    type: Number,
    default: 4
  },
  fields: {
    type: Number,
    default: 4
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: 'auto'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  className: {
    type: String,
    default: ''
  },
  animated: {
    type: Boolean,
    default: true
  }
})

const avatarStyle = computed(() => ({
  width: props.size === 'sm' ? '32px' : props.size === 'lg' ? '64px' : '48px',
  height: props.size === 'sm' ? '32px' : props.size === 'lg' ? '64px' : '48px'
}))

const buttonStyle = computed(() => ({
  width: props.width,
  height: props.size === 'sm' ? '32px' : props.size === 'lg' ? '48px' : '40px'
}))

const rectStyle = computed(() => ({
  width: props.width,
  height: props.height
}))

const getLineStyle = (index) => {
  // Last line is often shorter
  if (index === props.lines) {
    return { width: '60%' }
  }
  return {}
}
</script>

<style scoped>
.skeleton-loader {
  @apply w-full;
}

/* Base skeleton animation */
@keyframes skeleton-loading {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

/* Common skeleton styles */
.skeleton-line,
.skeleton-avatar,
.skeleton-button,
.skeleton-rect,
.skeleton-cell,
.skeleton-label,
.skeleton-input,
.skeleton-stat-label,
.skeleton-stat-value,
.skeleton-stat-change,
.skeleton-title,
.skeleton-subtitle {
  @apply bg-gray-700 rounded;
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.05) 20%,
    rgba(255, 255, 255, 0.1) 60%,
    rgba(255, 255, 255, 0)
  );
  background-size: 200px 100%;
  background-repeat: no-repeat;
  animation: skeleton-loading 1.4s ease-in-out infinite;
}

/* Text skeleton */
.skeleton-text .skeleton-line {
  @apply h-4 mb-2;
}

.skeleton-text .skeleton-line:last-child {
  @apply mb-0;
}

/* Card skeleton */
.skeleton-card {
  @apply bg-gray-800 rounded-lg p-6 border border-gray-700;
}

.skeleton-header {
  @apply flex items-center mb-4;
}

.skeleton-avatar {
  @apply w-12 h-12 rounded-full mr-4;
}

.skeleton-title-group {
  @apply flex-1;
}

.skeleton-title {
  @apply h-5 w-3/4 mb-2;
}

.skeleton-subtitle {
  @apply h-4 w-1/2;
}

.skeleton-content {
  @apply mb-4;
}

.skeleton-footer {
  @apply flex gap-3;
}

.skeleton-button {
  @apply h-9 w-24;
}

/* Table skeleton */
.skeleton-table {
  @apply w-full;
}

.skeleton-table-header {
  @apply flex gap-4 mb-4 pb-4 border-b border-gray-700;
}

.skeleton-table-row {
  @apply flex gap-4 py-3;
}

.skeleton-cell {
  @apply h-4 flex-1;
}

/* Form skeleton */
.skeleton-field {
  @apply mb-4;
}

.skeleton-label {
  @apply h-4 w-1/4 mb-2;
}

.skeleton-input {
  @apply h-10 w-full;
}

/* Stats skeleton */
.skeleton-stats {
  @apply grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4;
}

.skeleton-stat {
  @apply bg-gray-800 rounded-lg p-6 border border-gray-700;
}

.skeleton-stat-label {
  @apply h-4 w-3/4 mb-2;
}

.skeleton-stat-value {
  @apply h-8 w-1/2 mb-2;
}

.skeleton-stat-change {
  @apply h-3 w-1/3;
}

/* Size variations */
.skeleton-loader.sm .skeleton-line {
  @apply h-3;
}

.skeleton-loader.lg .skeleton-line {
  @apply h-5;
}

/* Disable animation if requested */
.skeleton-loader:not(.animated) .skeleton-line,
.skeleton-loader:not(.animated) .skeleton-avatar,
.skeleton-loader:not(.animated) .skeleton-button,
.skeleton-loader:not(.animated) .skeleton-rect,
.skeleton-loader:not(.animated) .skeleton-cell,
.skeleton-loader:not(.animated) .skeleton-label,
.skeleton-loader:not(.animated) .skeleton-input,
.skeleton-loader:not(.animated) .skeleton-stat-label,
.skeleton-loader:not(.animated) .skeleton-stat-value,
.skeleton-loader:not(.animated) .skeleton-stat-change,
.skeleton-loader:not(.animated) .skeleton-title,
.skeleton-loader:not(.animated) .skeleton-subtitle {
  animation: none;
}
</style>