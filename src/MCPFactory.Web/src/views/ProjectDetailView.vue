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
        
        <div class="mt-4 flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold tracking-tight text-white">
              {{ project.name }}
            </h1>
            <p class="mt-2 text-lg text-gray-400">
              {{ project.description }}
            </p>
            <div class="mt-4 flex items-center space-x-4 text-sm">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="statusClasses">
                {{ project.status }}
              </span>
              <span class="text-gray-400">
                Type: {{ project.type }}
              </span>
              <span class="text-gray-400">
                Version: v{{ project.version }}
              </span>
              <span class="text-gray-400">
                Updated {{ formatDate(project.updatedAt) }}
              </span>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <button
              @click="saveProject"
              :disabled="saving"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <LoadingSpinner v-if="saving" type="circle" size="sm" color="white" />
              <span v-else>Save</span>
            </button>
            
            <button
              @click="deployProject"
              :disabled="deploying || project.status !== 'active'"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {{ deploying ? 'Deploying...' : 'Deploy' }}
            </button>
            
            <button
              class="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-700">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in projectTabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="activeTab === tab.id 
              ? 'border-indigo-500 text-white' 
              : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'"
          >
            {{ tab.name }}
            <span v-if="tab.count" class="ml-2 py-0.5 px-2 rounded-full text-xs"
              :class="activeTab === tab.id ? 'bg-indigo-900/50 text-indigo-300' : 'bg-gray-800 text-gray-400'">
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="mt-8">
        <!-- Configuration Tab -->
        <div v-show="activeTab === 'configuration'">
          <MCPConfigEditor
            :project-id="projectId"
            :initial-config="project.config"
            @save="handleConfigSave"
            @change="hasChanges = true"
          />
        </div>

        <!-- Logs Tab -->
        <div v-show="activeTab === 'logs'" class="bg-gray-800 rounded-lg p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-white">Activity Logs</h3>
              <button class="text-sm text-indigo-400 hover:text-indigo-300">
                Download Logs
              </button>
            </div>
            <div v-if="logsLoading" class="h-96">
              <SkeletonLoader type="text" :lines="10" />
            </div>
            <div v-else class="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm text-gray-300">
              <div v-for="log in logs" :key="log.id" class="mb-2">
                <span class="text-gray-500">{{ formatTimestamp(log.timestamp) }}</span>
                <span class="ml-2" :class="logLevelClass(log.level)">{{ log.level }}</span>
                <span class="ml-2">{{ log.message }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Metrics Tab -->
        <div v-show="activeTab === 'metrics'" class="bg-gray-800 rounded-lg p-6">
          <div class="space-y-6">
            <h3 class="text-lg font-medium text-white">Usage Metrics</h3>
            
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div v-for="metric in metrics" :key="metric.name" class="bg-gray-900 rounded-lg p-4">
                <dt class="text-sm font-medium text-gray-400">{{ metric.name }}</dt>
                <dd class="mt-1 text-2xl font-semibold text-white">{{ metric.value }}</dd>
                <dd class="mt-1 text-sm text-gray-400">{{ metric.change }}</dd>
              </div>
            </div>
            
            <!-- Chart placeholder -->
            <div class="bg-gray-900 rounded-lg p-8 h-64 flex items-center justify-center">
              <p class="text-gray-500">Usage chart coming soon</p>
            </div>
          </div>
        </div>

        <!-- Deployments Tab -->
        <div v-show="activeTab === 'deployments'" class="space-y-4">
          <div v-for="deployment in deployments" :key="deployment.id" 
            class="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div class="flex items-start justify-between">
              <div>
                <h4 class="text-sm font-medium text-white">
                  Deployment #{{ deployment.id }}
                </h4>
                <p class="mt-1 text-sm text-gray-400">
                  {{ deployment.environment }} • {{ formatDate(deployment.deployedAt) }}
                </p>
              </div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="deploymentStatusClasses(deployment.status)">
                {{ deployment.status }}
              </span>
            </div>
            
            <div class="mt-4 text-sm text-gray-400">
              <p>Version: {{ deployment.version }}</p>
              <p>Endpoint: <code class="text-indigo-400">{{ deployment.endpoint }}</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import MCPConfigEditor from '@/components/editor/MCPConfigEditor.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'

const route = useRoute()
const projectsStore = useProjectsStore()

const projectId = computed(() => route.params.id)
const activeTab = ref('configuration')
const hasChanges = ref(false)
const saving = ref(false)
const deploying = ref(false)
const logsLoading = ref(false)

// Mock data
const project = ref({
  id: projectId.value,
  name: 'Weather API Server',
  description: 'MCP server for OpenWeatherMap API integration',
  type: 'openapi',
  status: 'active',
  version: '1.2.0',
  updatedAt: new Date(),
  config: {
    name: 'weather-api-server',
    version: '1.2.0',
    description: 'MCP server for OpenWeatherMap API integration',
    tools: [
      {
        name: 'get_current_weather',
        description: 'Get current weather for a city',
        inputSchema: {
          type: 'object',
          properties: {
            city: { type: 'string', description: 'City name' },
            units: { type: 'string', enum: ['metric', 'imperial'], default: 'metric' }
          },
          required: ['city']
        }
      },
      {
        name: 'get_forecast',
        description: 'Get weather forecast for a city',
        inputSchema: {
          type: 'object',
          properties: {
            city: { type: 'string', description: 'City name' },
            days: { type: 'number', minimum: 1, maximum: 7, default: 5 }
          },
          required: ['city']
        }
      }
    ]
  }
})

const logs = ref([
  { id: 1, timestamp: new Date(), level: 'INFO', message: 'MCP server started successfully' },
  { id: 2, timestamp: new Date(Date.now() - 60000), level: 'DEBUG', message: 'Loaded 2 tools from configuration' },
  { id: 3, timestamp: new Date(Date.now() - 120000), level: 'INFO', message: 'Tool get_current_weather called with params: {city: "London"}' },
  { id: 4, timestamp: new Date(Date.now() - 180000), level: 'ERROR', message: 'Rate limit exceeded for API key' },
  { id: 5, timestamp: new Date(Date.now() - 240000), level: 'INFO', message: 'Configuration updated' }
])

const metrics = ref([
  { name: 'Total Calls', value: '45.2K', change: '+12% from last week' },
  { name: 'Success Rate', value: '99.8%', change: '+0.2% from last week' },
  { name: 'Avg Response', value: '142ms', change: '-18ms from last week' },
  { name: 'Active Users', value: '238', change: '+45 from last week' }
])

const deployments = ref([
  {
    id: '3',
    environment: 'Production',
    status: 'active',
    version: '1.2.0',
    deployedAt: new Date(),
    endpoint: 'https://api.mcpfactory.com/v1/weather-api'
  },
  {
    id: '2',
    environment: 'Staging',
    status: 'inactive',
    version: '1.1.0',
    deployedAt: new Date(Date.now() - 86400000 * 7),
    endpoint: 'https://staging-api.mcpfactory.com/v1/weather-api'
  }
])

const projectTabs = computed(() => [
  { id: 'configuration', name: 'Configuration' },
  { id: 'logs', name: 'Logs', count: logs.value.length },
  { id: 'metrics', name: 'Metrics' },
  { id: 'deployments', name: 'Deployments', count: deployments.value.length }
])

const statusClasses = computed(() => {
  const status = project.value.status
  const classes = {
    active: 'bg-green-900/50 text-green-400',
    draft: 'bg-yellow-900/50 text-yellow-400',
    error: 'bg-red-900/50 text-red-400',
    deploying: 'bg-blue-900/50 text-blue-400'
  }
  return classes[status] || 'bg-gray-900/50 text-gray-400'
})

// Methods
const formatDate = (date) => {
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return d.toLocaleDateString()
}

const formatTimestamp = (date) => {
  return new Date(date).toLocaleTimeString()
}

const logLevelClass = (level) => {
  const classes = {
    'INFO': 'text-blue-400',
    'DEBUG': 'text-gray-400',
    'ERROR': 'text-red-400',
    'WARN': 'text-yellow-400'
  }
  return classes[level] || 'text-gray-400'
}

const deploymentStatusClasses = (status) => {
  const classes = {
    'active': 'bg-green-900/50 text-green-400',
    'inactive': 'bg-gray-900/50 text-gray-400',
    'failed': 'bg-red-900/50 text-red-400'
  }
  return classes[status] || 'bg-gray-900/50 text-gray-400'
}

const handleConfigSave = async (config) => {
  saving.value = true
  try {
    // Save configuration
    await projectsStore.updateProject(projectId.value, { config })
    hasChanges.value = false
  } catch (error) {
    console.error('Failed to save:', error)
  } finally {
    saving.value = false
  }
}

const saveProject = () => {
  // Trigger save in editor
  // The editor component will emit the save event
}

const deployProject = async () => {
  deploying.value = true
  try {
    await projectsStore.deployProject(projectId.value)
    // Refresh deployments
  } catch (error) {
    console.error('Failed to deploy:', error)
  } finally {
    deploying.value = false
  }
}

onMounted(async () => {
  // In production, fetch real project data
  // await projectsStore.fetchProject(projectId.value)
})
</script>