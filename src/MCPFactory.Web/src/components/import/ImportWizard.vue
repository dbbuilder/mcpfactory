<template>
  <div class="max-w-4xl mx-auto">
    <!-- Progress Steps -->
    <nav aria-label="Progress" class="mb-8">
      <ol role="list" class="flex items-center justify-center">
        <li v-for="(step, stepIdx) in steps" :key="step.name" :class="[stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative']">
          <div v-if="stepIdx !== steps.length - 1" class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="h-0.5 w-full" :class="stepIdx < currentStep ? 'bg-indigo-600' : 'bg-gray-700'"></div>
          </div>
          <button
            @click="currentStep = stepIdx"
            :disabled="stepIdx > furthestStep"
            class="relative flex h-8 w-8 items-center justify-center rounded-full"
            :class="[
              stepIdx < currentStep ? 'bg-indigo-600 hover:bg-indigo-900' : '',
              stepIdx === currentStep ? 'bg-white ring-2 ring-gray-300' : '',
              stepIdx > currentStep ? 'bg-gray-700' : ''
            ]"
          >
            <span v-if="stepIdx < currentStep" class="h-5 w-5 text-white">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
            <span v-else class="h-2.5 w-2.5 rounded-full" :class="stepIdx === currentStep ? 'bg-indigo-600' : 'bg-transparent'"></span>
          </button>
          <span class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">{{ step.name }}</span>
        </li>
      </ol>
    </nav>

    <!-- Wizard Content -->
    <div class="mt-12 bg-gray-800 rounded-lg shadow-xl p-8">
      <!-- Step 1: Select Type -->
      <div v-if="currentStep === 0" class="space-y-6">
        <div>
          <h3 class="text-lg font-medium text-white">What type of code are you importing?</h3>
          <p class="mt-2 text-sm text-gray-400">
            MCPFactory supports multiple code formats and API specifications.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label
            v-for="type in importTypes"
            :key="type.id"
            class="relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none"
            :class="[
              wizardData.type === type.id ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-700',
              'hover:border-gray-600'
            ]"
          >
            <input
              type="radio"
              v-model="wizardData.type"
              :value="type.id"
              class="sr-only"
            />
            <span class="flex flex-1">
              <span class="flex flex-col">
                <span class="block text-sm font-medium text-white">{{ type.name }}</span>
                <span class="mt-1 flex items-center text-sm text-gray-400">{{ type.description }}</span>
                <span class="mt-6 text-sm font-medium text-gray-300">Examples:</span>
                <span class="mt-1 text-sm text-gray-400">{{ type.examples }}</span>
              </span>
            </span>
            <svg
              v-if="wizardData.type === type.id"
              class="h-5 w-5 text-indigo-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </label>
        </div>
      </div>

      <!-- Step 2: Import Method -->
      <div v-if="currentStep === 1" class="space-y-6">
        <div>
          <h3 class="text-lg font-medium text-white">How would you like to import your {{ selectedType?.name }}?</h3>
          <p class="mt-2 text-sm text-gray-400">
            Choose the most convenient way to provide your code or specification.
          </p>
        </div>

        <div class="space-y-4">
          <label
            v-for="method in importMethods"
            :key="method.id"
            class="relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none"
            :class="[
              wizardData.method === method.id ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-700',
              'hover:border-gray-600'
            ]"
          >
            <input
              type="radio"
              v-model="wizardData.method"
              :value="method.id"
              class="sr-only"
            />
            <span class="flex flex-1 items-center">
              <span class="flex flex-col flex-1">
                <span class="block text-sm font-medium text-white">{{ method.name }}</span>
                <span class="mt-1 text-sm text-gray-400">{{ method.description }}</span>
              </span>
              <component :is="method.icon" class="h-8 w-8 text-gray-400 ml-4" />
            </span>
          </label>
        </div>

        <!-- Import Fields -->
        <div v-if="wizardData.method" class="mt-6">
          <div v-if="wizardData.method === 'url'" class="space-y-4">
            <div>
              <label for="url" class="block text-sm font-medium text-gray-300">URL</label>
              <input
                id="url"
                v-model="wizardData.url"
                type="url"
                class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                :placeholder="urlPlaceholder"
              />
            </div>
            <div v-if="wizardData.type === 'openapi'">
              <label for="auth" class="block text-sm font-medium text-gray-300">Authentication (optional)</label>
              <select
                id="auth"
                v-model="wizardData.auth.type"
                class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">No authentication</option>
                <option value="apikey">API Key</option>
                <option value="bearer">Bearer Token</option>
                <option value="basic">Basic Auth</option>
              </select>
            </div>
          </div>

          <div v-else-if="wizardData.method === 'file'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300">Upload File</label>
              <div class="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-600 px-6 pt-5 pb-6">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="flex text-sm text-gray-400">
                    <label for="file-upload" class="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300">
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        type="file"
                        class="sr-only"
                        @change="handleFileUpload"
                        :accept="fileAccept"
                      />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-400">{{ fileTypes }}</p>
                </div>
              </div>
              <div v-if="wizardData.file" class="mt-4">
                <div class="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <div class="flex items-center">
                    <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-white">{{ wizardData.file.name }}</p>
                      <p class="text-xs text-gray-400">{{ formatFileSize(wizardData.file.size) }}</p>
                    </div>
                  </div>
                  <button @click="wizardData.file = null" class="text-gray-400 hover:text-gray-300">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="wizardData.method === 'github'" class="space-y-4">
            <div>
              <label for="repo" class="block text-sm font-medium text-gray-300">Repository URL</label>
              <input
                id="repo"
                v-model="wizardData.github.repo"
                type="url"
                class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="https://github.com/username/repository"
              />
            </div>
            <div>
              <label for="branch" class="block text-sm font-medium text-gray-300">Branch (optional)</label>
              <input
                id="branch"
                v-model="wizardData.github.branch"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="main"
              />
            </div>
            <div>
              <label for="path" class="block text-sm font-medium text-gray-300">File Path (optional)</label>
              <input
                id="path"
                v-model="wizardData.github.path"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="/src/api/openapi.json"
              />
            </div>
          </div>

          <div v-else-if="wizardData.method === 'paste'" class="space-y-4">
            <div>
              <label for="content" class="block text-sm font-medium text-gray-300">Paste your {{ selectedType?.name }}</label>
              <textarea
                id="content"
                v-model="wizardData.content"
                @blur="validatePastedContent"
                rows="12"
                class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                :placeholder="contentPlaceholder"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Configure -->
      <div v-if="currentStep === 2" class="space-y-6">
        <div>
          <h3 class="text-lg font-medium text-white">Configure your MCP server</h3>
          <p class="mt-2 text-sm text-gray-400">
            Customize how your code will be exposed through the MCP protocol.
          </p>
        </div>

        <div class="space-y-4">
          <div>
            <label for="server-name" class="block text-sm font-medium text-gray-300">Server Name</label>
            <input
              id="server-name"
              v-model="wizardData.config.name"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="my-api-server"
            />
            <p class="mt-1 text-xs text-gray-400">This will be used as the MCP server identifier</p>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-300">Description</label>
            <textarea
              id="description"
              v-model="wizardData.config.description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="A brief description of what your MCP server does"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Tool Selection</label>
            <div class="bg-gray-700 rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm text-gray-300">Auto-detect tools from code</span>
                <button
                  type="button"
                  @click="wizardData.config.autoDetect = !wizardData.config.autoDetect"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  :class="wizardData.config.autoDetect ? 'bg-indigo-600' : 'bg-gray-600'"
                >
                  <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="wizardData.config.autoDetect ? 'translate-x-5' : 'translate-x-0'"
                  ></span>
                </button>
              </div>
              <p class="text-xs text-gray-400">
                MCPFactory will analyze your code and automatically create MCP tools for detected functions and endpoints
              </p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Advanced Options</label>
            <div class="space-y-3">
              <label class="flex items-center">
                <input
                  v-model="wizardData.config.includeAuth"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="ml-2 text-sm text-gray-300">Include authentication handling</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="wizardData.config.includeRateLimit"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="ml-2 text-sm text-gray-300">Add rate limiting</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="wizardData.config.includeCache"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span class="ml-2 text-sm text-gray-300">Enable response caching</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 4: Review -->
      <div v-if="currentStep === 3" class="space-y-6">
        <div>
          <h3 class="text-lg font-medium text-white">Review and create</h3>
          <p class="mt-2 text-sm text-gray-400">
            Review your configuration before creating the MCP server.
          </p>
        </div>

        <div class="bg-gray-700 rounded-lg p-6 space-y-4">
          <div>
            <h4 class="text-sm font-medium text-gray-300">Import Details</h4>
            <dl class="mt-2 space-y-2">
              <div class="flex justify-between text-sm">
                <dt class="text-gray-400">Type:</dt>
                <dd class="text-white">{{ selectedType?.name }}</dd>
              </div>
              <div class="flex justify-between text-sm">
                <dt class="text-gray-400">Method:</dt>
                <dd class="text-white">{{ selectedMethod?.name }}</dd>
              </div>
              <div v-if="wizardData.method === 'url'" class="flex justify-between text-sm">
                <dt class="text-gray-400">URL:</dt>
                <dd class="text-white truncate ml-4">{{ wizardData.url }}</dd>
              </div>
              <div v-else-if="wizardData.method === 'file'" class="flex justify-between text-sm">
                <dt class="text-gray-400">File:</dt>
                <dd class="text-white">{{ wizardData.file?.name }}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-300">Server Configuration</h4>
            <dl class="mt-2 space-y-2">
              <div class="flex justify-between text-sm">
                <dt class="text-gray-400">Name:</dt>
                <dd class="text-white">{{ wizardData.config.name || 'Not set' }}</dd>
              </div>
              <div class="flex justify-between text-sm">
                <dt class="text-gray-400">Auto-detect tools:</dt>
                <dd class="text-white">{{ wizardData.config.autoDetect ? 'Yes' : 'No' }}</dd>
              </div>
              <div class="text-sm">
                <dt class="text-gray-400 mb-1">Features:</dt>
                <dd class="text-white">
                  <span v-if="wizardData.config.includeAuth" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-900/50 text-indigo-300 mr-2">
                    Authentication
                  </span>
                  <span v-if="wizardData.config.includeRateLimit" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-900/50 text-indigo-300 mr-2">
                    Rate Limiting
                  </span>
                  <span v-if="wizardData.config.includeCache" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-900/50 text-indigo-300">
                    Caching
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div v-if="error" class="rounded-md bg-red-900/50 p-4">
          <p class="text-sm text-red-300">{{ error }}</p>
        </div>
      </div>

      <!-- Navigation -->
      <div class="mt-8 flex justify-between">
        <button
          v-if="currentStep > 0"
          @click="prevStep"
          class="inline-flex items-center px-4 py-2 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Back
        </button>
        <div v-else></div>

        <button
          v-if="currentStep < steps.length - 1"
          @click="nextStep"
          :disabled="!canProceed"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <svg class="ml-2 -mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>

        <button
          v-else
          @click="createProject"
          :disabled="loading || !canProceed"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LoadingSpinner v-if="loading" type="circle" size="sm" color="white" />
          <span v-else>Create MCP Server</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { 
  readFileAsText, 
  validateJson, 
  detectFileType,
  validateOpenApiSpec,
  safeJsonParse 
} from '@/utils/fileUtils'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const projectsStore = useProjectsStore()

const emit = defineEmits(['created'])

// Wizard state
const currentStep = ref(0)
const furthestStep = ref(0)
const loading = ref(false)
const error = ref(null)

const steps = [
  { name: 'Type' },
  { name: 'Import' },
  { name: 'Configure' },
  { name: 'Review' }
]

const wizardData = ref({
  type: '',
  method: '',
  url: '',
  file: null,
  fileContent: '', // Store cleaned file content
  content: '',
  github: {
    repo: '',
    branch: '',
    path: ''
  },
  auth: {
    type: '',
    apiKey: '',
    token: '',
    username: '',
    password: ''
  },
  config: {
    name: '',
    description: '',
    autoDetect: true,
    includeAuth: false,
    includeRateLimit: false,
    includeCache: false
  }
})

// Import types configuration
const importTypes = [
  {
    id: 'openapi',
    name: 'OpenAPI / Swagger',
    description: 'REST API specifications in OpenAPI 3.0 or Swagger 2.0 format',
    examples: 'OpenAPI JSON/YAML, Swagger docs, Postman collections'
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    description: 'GraphQL schemas and operations',
    examples: 'Schema files, .graphql files, introspection results'
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Python modules, classes, and functions',
    examples: '.py files, Jupyter notebooks, Python packages'
  },
  {
    id: 'javascript',
    name: 'JavaScript / TypeScript',
    description: 'JS/TS modules, classes, and functions',
    examples: '.js, .ts, .mjs files, NPM packages'
  },
  {
    id: 'database',
    name: 'Database',
    description: 'SQL schemas and stored procedures',
    examples: 'SQL DDL, database schemas, stored procedures'
  },
  {
    id: 'grpc',
    name: 'gRPC',
    description: 'Protocol buffer definitions',
    examples: '.proto files, gRPC service definitions'
  }
]

const importMethods = [
  {
    id: 'url',
    name: 'Import from URL',
    description: 'Provide a direct URL to your specification',
    icon: 'LinkIcon'
  },
  {
    id: 'file',
    name: 'Upload File',
    description: 'Upload a file from your computer',
    icon: 'DocumentIcon'
  },
  {
    id: 'github',
    name: 'Connect GitHub',
    description: 'Import directly from a GitHub repository',
    icon: 'CodeIcon'
  },
  {
    id: 'paste',
    name: 'Paste Code',
    description: 'Paste your code or specification directly',
    icon: 'ClipboardIcon'
  }
]

// Computed properties
const selectedType = computed(() => 
  importTypes.find(t => t.id === wizardData.value.type)
)

const selectedMethod = computed(() =>
  importMethods.find(m => m.id === wizardData.value.method)
)

const urlPlaceholder = computed(() => {
  const placeholders = {
    openapi: 'https://api.example.com/openapi.json',
    graphql: 'https://api.example.com/graphql/schema',
    python: 'https://github.com/user/repo/blob/main/module.py',
    javascript: 'https://cdn.jsdelivr.net/npm/package@latest/index.js',
    database: 'https://example.com/schema.sql',
    grpc: 'https://github.com/user/repo/blob/main/service.proto'
  }
  return placeholders[wizardData.value.type] || 'https://example.com/specification'
})

const contentPlaceholder = computed(() => {
  const placeholders = {
    openapi: '{\n  "openapi": "3.0.0",\n  "info": { ... },\n  "paths": { ... }\n}',
    graphql: 'type Query {\n  user(id: ID!): User\n}\n\ntype User {\n  id: ID!\n  name: String!\n}',
    python: 'def my_function(param1, param2):\n    """Function description"""\n    return result',
    javascript: 'export function myFunction(param1, param2) {\n  // Function implementation\n  return result;\n}',
    database: 'CREATE TABLE users (\n  id INT PRIMARY KEY,\n  name VARCHAR(255)\n);',
    grpc: 'syntax = "proto3";\n\nservice MyService {\n  rpc MyMethod (Request) returns (Response);\n}'
  }
  return placeholders[wizardData.value.type] || 'Paste your code here...'
})

const fileAccept = computed(() => {
  const accepts = {
    openapi: '.json,.yaml,.yml',
    graphql: '.graphql,.gql',
    python: '.py,.ipynb',
    javascript: '.js,.ts,.mjs,.jsx,.tsx',
    database: '.sql',
    grpc: '.proto'
  }
  return accepts[wizardData.value.type] || '*'
})

const fileTypes = computed(() => {
  const types = {
    openapi: 'JSON, YAML files up to 10MB',
    graphql: 'GraphQL schema files up to 5MB',
    python: 'Python files up to 5MB',
    javascript: 'JavaScript/TypeScript files up to 5MB',
    database: 'SQL files up to 10MB',
    grpc: 'Proto files up to 5MB'
  }
  return types[wizardData.value.type] || 'Files up to 10MB'
})

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return wizardData.value.type !== ''
    case 1:
      if (!wizardData.value.method) return false
      switch (wizardData.value.method) {
        case 'url':
          return wizardData.value.url !== ''
        case 'file':
          return wizardData.value.file !== null
        case 'github':
          return wizardData.value.github.repo !== ''
        case 'paste':
          return wizardData.value.content !== ''
        default:
          return false
      }
    case 2:
      return wizardData.value.config.name !== ''
    case 3:
      return true
    default:
      return false
  }
})

// Methods
const nextStep = () => {
  if (canProceed.value && currentStep.value < steps.length - 1) {
    currentStep.value++
    furthestStep.value = Math.max(furthestStep.value, currentStep.value)
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (file) {
    wizardData.value.file = file
    error.value = null
    
    // Validate file immediately for better UX
    try {
      const content = await readFileAsText(file)
      
      // Store the content for later use
      wizardData.value.fileContent = content
      
      // Validate based on type
      if (wizardData.value.type === 'openapi') {
        const fileType = detectFileType(content)
        
        if (fileType === 'json') {
          const validation = validateJson(content)
          if (!validation.valid) {
            error.value = `Invalid JSON: ${validation.error.message} (line ${validation.error.line || 'unknown'})`
            wizardData.value.file = null
            return
          }
          
          // Validate OpenAPI spec
          const specValidation = validateOpenApiSpec(validation.data)
          if (!specValidation.valid) {
            error.value = `Invalid OpenAPI spec: ${specValidation.errors.join(', ')}`
            wizardData.value.file = null
            return
          }
          
          if (specValidation.warnings.length > 0) {
            console.warn('OpenAPI warnings:', specValidation.warnings)
          }
        } else if (fileType === 'yaml') {
          // For YAML files, we'll validate on the server
          console.log('YAML file detected - will validate on server')
        }
      }
    } catch (err) {
      error.value = `Failed to read file: ${err.message}`
      wizardData.value.file = null
    }
  }
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const validatePastedContent = () => {
  if (!wizardData.value.content) return
  
  error.value = null
  
  // Validate based on type
  if (wizardData.value.type === 'openapi' || wizardData.value.type === 'graphql') {
    const fileType = detectFileType(wizardData.value.content)
    
    if (fileType === 'json') {
      const validation = validateJson(wizardData.value.content)
      if (!validation.valid) {
        error.value = `Invalid JSON: ${validation.error.message} (line ${validation.error.line || 'unknown'})`
        return
      }
      
      if (wizardData.value.type === 'openapi') {
        const specValidation = validateOpenApiSpec(validation.data)
        if (!specValidation.valid) {
          error.value = `Invalid OpenAPI spec: ${specValidation.errors.join(', ')}`
        } else if (specValidation.warnings.length > 0) {
          console.warn('OpenAPI warnings:', specValidation.warnings)
        }
      }
    }
  }
}

const createProject = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Prepare the content based on import method
    let content = ''
    
    if (wizardData.value.method === 'file') {
      // Use the pre-read and validated content
      content = wizardData.value.fileContent
    } else if (wizardData.value.method === 'paste') {
      // Use the pasted content (already validated)
      content = wizardData.value.content
    }
    
    const projectData = {
      name: wizardData.value.config.name,
      description: wizardData.value.config.description,
      type: wizardData.value.type,
      importMethod: wizardData.value.method,
      url: wizardData.value.url,
      content: content, // Use the cleaned content
      github: wizardData.value.github,
      config: wizardData.value.config
    }
    
    // If we have a file, send it separately for server-side processing
    if (wizardData.value.file && wizardData.value.method === 'file') {
      // For files, we might want to upload them separately
      // This depends on your backend API design
      projectData.fileName = wizardData.value.file.name
      projectData.fileSize = wizardData.value.file.size
    }
    
    const result = await projectsStore.createProject(projectData)
    
    if (result.success) {
      emit('created', result.project)
      router.push(`/dashboard/projects/${result.project.id}`)
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Failed to create project. Please try again.'
  } finally {
    loading.value = false
  }
}

// Icon components
const LinkIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>`
}

const DocumentIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>`
}

const CodeIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>`
}

const ClipboardIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>`
}
</script>