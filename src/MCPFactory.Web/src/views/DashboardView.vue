<template>
  <div class="min-h-screen bg-gray-900 pt-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between">
        <div class="min-w-0 flex-1">
          <h1 class="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl">
            Dashboard
          </h1>
          <p class="mt-1 text-sm text-gray-400">
            Manage your MCP servers and monitor their performance
          </p>
        </div>
        <div class="mt-4 flex md:ml-4 md:mt-0">
          <router-link
            to="/import"
            class="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            New Project
          </router-link>
        </div>
      </div>

      <!-- Stats -->
      <div class="mt-8">
        <DashboardStats :stats="stats" />
      </div>

      <!-- Filters and Search -->
      <div class="mt-8 flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label for="search" class="sr-only">Search projects</label>
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="search"
              id="search"
              class="block w-full rounded-md border-0 bg-gray-800 py-2 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-gray-700 focus:text-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search projects..."
            />
          </div>
        </div>
        <select
          v-model="statusFilter"
          class="rounded-md border-0 bg-gray-800 py-2 pl-3 pr-10 text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="error">Error</option>
        </select>
        <select
          v-model="sortBy"
          class="rounded-md border-0 bg-gray-800 py-2 pl-3 pr-10 text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          <option value="updated">Last Updated</option>
          <option value="created">Created</option>
          <option value="name">Name</option>
          <option value="calls">API Calls</option>
        </select>
      </div>

      <!-- Projects Grid -->
      <div v-if="loading" class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="bg-gray-800 rounded-lg p-6 animate-pulse">
          <div class="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div class="h-3 bg-gray-700 rounded w-full mb-2"></div>
          <div class="h-3 bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>

      <div v-else-if="projects.length === 0" class="mt-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-white">No projects</h3>
        <p class="mt-1 text-sm text-gray-400">Get started by creating a new MCP project.</p>
        <div class="mt-6">
          <router-link
            to="/import"
            class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            New Project
          </router-link>
        </div>
      </div>

      <div v-else class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
          @view="handleViewProject"
          @deploy="handleDeployProject"
          @configure="handleConfigureProject"
        />
      </div>

      <!-- Create Project Modal -->
      <CreateProjectModal
        :is-open="showCreateModal"
        @close="showCreateModal = false"
        @created="handleProjectCreated"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import ProjectCard from '@/components/dashboard/ProjectCard.vue'
import CreateProjectModal from '@/components/dashboard/CreateProjectModal.vue'

const router = useRouter()
const projectsStore = useProjectsStore()

const showCreateModal = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('updated')

const loading = computed(() => projectsStore.loading)

// Mock data for development
const projects = ref([
  {
    id: '1',
    name: 'Weather API Server',
    description: 'MCP server for OpenWeatherMap API integration',
    type: 'openapi',
    status: 'active',
    version: '1.2.0',
    apiCalls: 45200,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
  },
  {
    id: '2',
    name: 'Database Query Tool',
    description: 'SQL database access through MCP',
    type: 'database',
    status: 'active',
    version: '2.0.1',
    apiCalls: 128400,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60)
  },
  {
    id: '3',
    name: 'Python Analytics',
    description: 'Data analysis tools via MCP',
    type: 'python',
    status: 'draft',
    version: '0.1.0',
    apiCalls: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
  }
])

const stats = computed(() => [
  {
    name: 'Total Projects',
    value: projects.value.length,
    change: '+12%',
    changeType: 'increase'
  },
  {
    name: 'Active Servers',
    value: projects.value.filter(p => p.status === 'active').length,
    change: '+4.75%',
    changeType: 'increase'
  },
  {
    name: 'API Calls Today',
    value: '24.5K',
    change: '-2.1%',
    changeType: 'decrease'
  },
  {
    name: 'Avg Response Time',
    value: '45',
    unit: 'ms',
    change: '-8%',
    changeType: 'increase'
  }
])

const filteredProjects = computed(() => {
  let result = [...projects.value]
  
  // Search filter
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    result = result.filter(project => 
      project.name.toLowerCase().includes(search) ||
      project.description?.toLowerCase().includes(search)
    )
  }
  
  // Status filter
  if (statusFilter.value !== 'all') {
    result = result.filter(project => project.status === statusFilter.value)
  }
  
  // Sorting
  const sortFunctions = {
    updated: (a, b) => b.updatedAt - a.updatedAt,
    created: (a, b) => b.createdAt - a.createdAt,
    name: (a, b) => a.name.localeCompare(b.name),
    calls: (a, b) => b.apiCalls - a.apiCalls
  }
  
  result.sort(sortFunctions[sortBy.value])
  
  return result
})

const handleViewProject = (project) => {
  router.push(`/dashboard/projects/${project.id}`)
}

const handleDeployProject = async (project) => {
  const result = await projectsStore.deployProject(project.id)
  if (result.success) {
    // Show success notification
  }
}

const handleConfigureProject = (project) => {
  router.push(`/dashboard/projects/${project.id}/configure`)
}

const handleProjectCreated = (project) => {
  projects.value.unshift(project)
}

onMounted(async () => {
  // In production, this would fetch from API
  // await projectsStore.fetchProjects()
})

// Update filters in store when they change
watch([searchQuery, statusFilter, sortBy], () => {
  projectsStore.setFilters({
    search: searchQuery.value,
    status: statusFilter.value,
    sortBy: sortBy.value
  })
})
</script>