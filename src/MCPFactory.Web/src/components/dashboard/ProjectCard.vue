<template>
  <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
    <div class="p-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-white">{{ project.name }}</h3>
          <p class="mt-1 text-sm text-gray-400">{{ project.description }}</p>
        </div>
        <div class="ml-4">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="statusClasses"
          >
            {{ project.status }}
          </span>
        </div>
      </div>

      <div class="mt-4 flex items-center text-sm text-gray-400">
        <svg class="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Updated {{ formatDate(project.updatedAt) }}
      </div>

      <div class="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p class="text-gray-400">Type</p>
          <p class="mt-1 font-medium text-white">{{ project.type }}</p>
        </div>
        <div>
          <p class="text-gray-400">API Calls</p>
          <p class="mt-1 font-medium text-white">{{ formatNumber(project.apiCalls) }}</p>
        </div>
        <div>
          <p class="text-gray-400">Version</p>
          <p class="mt-1 font-medium text-white">v{{ project.version }}</p>
        </div>
      </div>

      <div class="mt-6 flex space-x-3">
        <button
          @click="$emit('view', project)"
          class="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          View Details
        </button>
        <button
          v-if="project.status === 'active'"
          @click="$emit('deploy', project)"
          class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Deploy
        </button>
        <button
          v-else
          @click="$emit('configure', project)"
          class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Configure
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'deploy', 'configure'])

const statusClasses = computed(() => {
  const status = props.project.status
  const classes = {
    active: 'bg-green-900/50 text-green-400',
    draft: 'bg-yellow-900/50 text-yellow-400',
    error: 'bg-red-900/50 text-red-400',
    deploying: 'bg-blue-900/50 text-blue-400'
  }
  return classes[status] || 'bg-gray-900/50 text-gray-400'
})

const formatDate = (date) => {
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return d.toLocaleDateString()
}

const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}
</script>