<template>
  <div>
    <div v-if="!loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.name"
        class="bg-gray-800 overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6"
      >
        <dt class="text-sm font-medium text-gray-400">{{ stat.name }}</dt>
        <dd class="mt-1 flex items-baseline justify-between">
          <div class="flex items-baseline text-2xl font-semibold text-white">
            {{ stat.value }}
            <span v-if="stat.unit" class="ml-2 text-sm font-medium text-gray-400">
              {{ stat.unit }}
            </span>
          </div>
          <div
            v-if="stat.change"
            class="inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0"
            :class="stat.changeType === 'increase' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'"
          >
            <svg
              class="-ml-1 mr-0.5 h-4 w-4 flex-shrink-0"
              :class="stat.changeType === 'increase' ? 'text-green-400' : 'text-red-400'"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                v-if="stat.changeType === 'increase'"
                fill-rule="evenodd"
                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
              <path
                v-else
                fill-rule="evenodd"
                d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            {{ stat.change }}
          </div>
        </dd>
      </div>
    </div>
    <SkeletonLoader v-else type="stats" />
  </div>
</template>

<script setup>
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'

defineProps({
  stats: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>