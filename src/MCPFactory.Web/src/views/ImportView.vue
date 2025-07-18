<template>
  <div class="min-h-screen bg-gray-900 pt-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <router-link to="/dashboard" class="inline-flex items-center text-sm text-gray-400 hover:text-gray-300">
          <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </router-link>
        <h1 class="mt-4 text-3xl font-bold tracking-tight text-white">
          Create New MCP Server
        </h1>
        <p class="mt-2 text-lg text-gray-400">
          Import your code and let MCPFactory generate an MCP server automatically
        </p>
      </div>

      <!-- Import Wizard -->
      <ImportWizard @created="handleProjectCreated" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import ImportWizard from '@/components/import/ImportWizard.vue'

const router = useRouter()

const handleProjectCreated = (project) => {
  // The wizard already navigates to the project page
  // This is here for any additional logic needed
  console.log('Project created:', project)
}
</script>