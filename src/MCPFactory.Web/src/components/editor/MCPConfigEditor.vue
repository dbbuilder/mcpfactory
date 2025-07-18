<template>
  <div class="mcp-config-editor">
    <!-- Editor Header -->
    <div class="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h3 class="text-lg font-medium text-white">MCP Configuration</h3>
          <div class="flex items-center space-x-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
              :class="activeTab === tab.id 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'"
            >
              {{ tab.name }}
            </button>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="formatCode"
            class="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
          >
            <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Format
          </button>
          <button
            @click="validateConfig"
            class="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
          >
            <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Validate
          </button>
        </div>
      </div>
    </div>

    <!-- Editor Content -->
    <div class="relative">
      <!-- Configuration Tab -->
      <div v-show="activeTab === 'config'" class="h-[600px]">
        <codemirror
          v-model="configCode"
          :style="{ height: '100%' }"
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="configExtensions"
          @ready="handleReady"
          @change="handleChange"
        />
      </div>

      <!-- Generated Code Tab -->
      <div v-show="activeTab === 'generated'" class="h-[600px]">
        <codemirror
          v-model="generatedCode"
          :style="{ height: '100%' }"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="jsExtensions"
          :readonly="true"
        />
      </div>

      <!-- Tools Tab -->
      <div v-show="activeTab === 'tools'" class="h-[600px] overflow-y-auto bg-gray-900">
        <div class="p-4">
          <div v-if="detectedTools.length === 0" class="text-center py-8">
            <p class="text-gray-400">No tools detected yet. Configure your MCP server to see available tools.</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="tool in detectedTools"
              :key="tool.name"
              class="bg-gray-800 rounded-lg p-4 border border-gray-700"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-white">{{ tool.name }}</h4>
                  <p class="mt-1 text-sm text-gray-400">{{ tool.description }}</p>
                </div>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="tool.validated ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'"
                >
                  {{ tool.validated ? 'Valid' : 'Needs Review' }}
                </span>
              </div>
              
              <div class="mt-3">
                <h5 class="text-xs font-medium text-gray-300 mb-2">Input Schema</h5>
                <pre class="bg-gray-900 rounded p-2 text-xs text-gray-400 overflow-x-auto">{{ JSON.stringify(tool.inputSchema, null, 2) }}</pre>
              </div>
              
              <div class="mt-3 flex items-center space-x-2">
                <button class="text-xs text-indigo-400 hover:text-indigo-300">Edit</button>
                <span class="text-gray-600">•</span>
                <button class="text-xs text-indigo-400 hover:text-indigo-300">Test</button>
                <span class="text-gray-600">•</span>
                <button class="text-xs text-red-400 hover:text-red-300">Remove</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Tab -->
      <div v-show="activeTab === 'preview'" class="h-[600px] overflow-y-auto bg-gray-900">
        <div class="p-4">
          <h4 class="text-sm font-medium text-gray-300 mb-4">Live Preview</h4>
          <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">Test Tool</label>
                <select
                  v-model="selectedTestTool"
                  class="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a tool to test</option>
                  <option v-for="tool in detectedTools" :key="tool.name" :value="tool.name">
                    {{ tool.name }}
                  </option>
                </select>
              </div>
              
              <div v-if="selectedTestTool">
                <label class="block text-sm font-medium text-gray-400 mb-2">Input Parameters</label>
                <textarea
                  v-model="testInput"
                  rows="4"
                  class="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                  placeholder='{"param1": "value1", "param2": "value2"}'
                ></textarea>
              </div>
              
              <button
                @click="runTest"
                :disabled="!selectedTestTool"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Run Test
              </button>
              
              <div v-if="testResult" class="mt-4">
                <h5 class="text-sm font-medium text-gray-400 mb-2">Result</h5>
                <pre class="bg-gray-900 rounded p-3 text-sm text-gray-300 overflow-x-auto">{{ testResult }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Validation Errors -->
    <div v-if="validationErrors.length > 0" class="bg-red-900/20 border-t border-red-800 px-4 py-3">
      <div class="flex items-start">
        <svg class="h-5 w-5 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium text-red-300">Validation Errors</p>
          <ul class="mt-1 text-sm text-red-300 list-disc list-inside">
            <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Status Bar -->
    <div class="bg-gray-800 border-t border-gray-700 px-4 py-2 text-xs text-gray-400 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <span>Line {{ cursorPosition.line }}, Column {{ cursorPosition.column }}</span>
        <span>{{ configCode.length }} characters</span>
      </div>
      <div class="flex items-center space-x-4">
        <span v-if="lastSaved" class="text-green-400">
          Saved {{ formatTime(lastSaved) }}
        </span>
        <span v-else class="text-yellow-400">
          Unsaved changes
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView } from '@codemirror/view'
import { safeJsonParse, formatJson } from '@/utils/fileUtils'

const props = defineProps({
  projectId: {
    type: String,
    required: true
  },
  initialConfig: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['save', 'change'])

// Editor state
const activeTab = ref('config')
const configCode = ref('')
const generatedCode = ref('')
const detectedTools = ref([])
const validationErrors = ref([])
const cursorPosition = ref({ line: 1, column: 1 })
const lastSaved = ref(null)

// Test state
const selectedTestTool = ref('')
const testInput = ref('')
const testResult = ref('')

// Tabs configuration
const tabs = [
  { id: 'config', name: 'Configuration' },
  { id: 'generated', name: 'Generated Code' },
  { id: 'tools', name: 'Tools' },
  { id: 'preview', name: 'Preview' }
]

// CodeMirror extensions
const configExtensions = [
  json(),
  oneDark,
  EditorView.theme({
    '&': { height: '100%' },
    '.cm-scroller': { overflow: 'auto' }
  })
]

const jsExtensions = [
  javascript(),
  oneDark,
  EditorView.theme({
    '&': { height: '100%' },
    '.cm-scroller': { overflow: 'auto' }
  })
]

// Initialize with default config
const defaultConfig = {
  name: 'my-mcp-server',
  version: '1.0.0',
  description: 'MCP server generated by MCPFactory',
  tools: [],
  options: {
    autoDetect: true,
    includeAuth: false,
    includeRateLimit: false,
    includeCache: false
  }
}

// Methods
const handleReady = (payload) => {
  // Editor is ready
  console.log('Editor ready:', payload)
}

const handleChange = (value, viewUpdate) => {
  // Update cursor position
  const state = viewUpdate.state
  const pos = state.selection.main.head
  const line = state.doc.lineAt(pos)
  cursorPosition.value = {
    line: line.number,
    column: pos - line.from + 1
  }
  
  // Mark as unsaved
  emit('change', value)
}

const formatCode = () => {
  const result = safeJsonParse(configCode.value)
  if (result.success) {
    configCode.value = formatJson(result.data)
    validationErrors.value = []
  } else {
    validationErrors.value = [`JSON Error: ${result.error.message}`]
  }
}

const validateConfig = async () => {
  validationErrors.value = []
  
  // Parse JSON
  const result = safeJsonParse(configCode.value)
  if (!result.success) {
    validationErrors.value = [`JSON Error: ${result.error.message}`]
    return
  }
  
  const config = result.data
  
  // Validate required fields
  if (!config.name) {
    validationErrors.value.push('Missing required field: name')
  }
  
  if (!config.version) {
    validationErrors.value.push('Missing required field: version')
  }
  
  // Validate tools
  if (config.tools && Array.isArray(config.tools)) {
    config.tools.forEach((tool, index) => {
      if (!tool.name) {
        validationErrors.value.push(`Tool ${index + 1}: Missing name`)
      }
      if (!tool.description) {
        validationErrors.value.push(`Tool ${index + 1}: Missing description`)
      }
      if (!tool.inputSchema) {
        validationErrors.value.push(`Tool ${index + 1}: Missing inputSchema`)
      }
    })
    
    // Update detected tools
    detectedTools.value = config.tools.map(tool => ({
      ...tool,
      validated: !!(tool.name && tool.description && tool.inputSchema)
    }))
  }
  
  // Generate code if valid
  if (validationErrors.value.length === 0) {
    generateMCPCode(config)
  }
}

const generateMCPCode = (config) => {
  // Generate MCP server code
  const tools = config.tools || []
  
  generatedCode.value = `import { MCPServer } from '@mcpfactory/sdk';

const server = new MCPServer({
  name: '${config.name}',
  version: '${config.version}',
  description: '${config.description || ''}'
});

${tools.map(tool => `
server.addTool({
  name: '${tool.name}',
  description: '${tool.description}',
  inputSchema: ${JSON.stringify(tool.inputSchema, null, 2).split('\n').map((line, i) => i === 0 ? line : '  ' + line).join('\n')},
  handler: async (params) => {
    // TODO: Implement ${tool.name} handler
    throw new Error('Not implemented');
  }
});`).join('\n')}

export default server;`
}

const runTest = async () => {
  try {
    const input = safeJsonParse(testInput.value)
    if (!input.success) {
      testResult.value = `Invalid input JSON: ${input.error.message}`
      return
    }
    
    // In a real implementation, this would call the API
    testResult.value = JSON.stringify({
      success: true,
      output: {
        message: `Test executed for tool: ${selectedTestTool.value}`,
        input: input.data,
        timestamp: new Date().toISOString()
      }
    }, null, 2)
  } catch (error) {
    testResult.value = `Error: ${error.message}`
  }
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return date.toLocaleDateString()
}

// Initialize
onMounted(() => {
  if (props.initialConfig && Object.keys(props.initialConfig).length > 0) {
    configCode.value = formatJson(props.initialConfig)
  } else {
    configCode.value = formatJson(defaultConfig)
  }
  
  // Auto-validate on mount
  validateConfig()
})

// Watch for external config changes
watch(() => props.initialConfig, (newConfig) => {
  if (newConfig && Object.keys(newConfig).length > 0) {
    configCode.value = formatJson(newConfig)
    validateConfig()
  }
})

// Auto-save functionality
let saveTimeout
watch(configCode, () => {
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    const result = safeJsonParse(configCode.value)
    if (result.success) {
      emit('save', result.data)
      lastSaved.value = new Date()
    }
  }, 2000) // Auto-save after 2 seconds of inactivity
})
</script>

<style scoped>
.mcp-config-editor {
  @apply bg-gray-900 rounded-lg overflow-hidden shadow-xl;
}
</style>