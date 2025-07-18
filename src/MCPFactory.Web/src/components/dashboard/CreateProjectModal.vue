<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          @click="$emit('close')"
        ></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <h3 class="text-lg leading-6 font-medium text-white">
              Create New MCP Project
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-400">
                Import your API or code to generate an MCP server
              </p>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="mt-5 space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-300">
                Project Name
              </label>
              <input
                v-model="form.name"
                type="text"
                id="name"
                required
                class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="My API Server"
              />
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                v-model="form.description"
                id="description"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Brief description of your MCP server"
              ></textarea>
            </div>

            <div>
              <label for="type" class="block text-sm font-medium text-gray-300">
                Import Type
              </label>
              <select
                v-model="form.type"
                id="type"
                required
                class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select type</option>
                <option value="openapi">OpenAPI / Swagger</option>
                <option value="graphql">GraphQL Schema</option>
                <option value="postman">Postman Collection</option>
                <option value="python">Python Module</option>
                <option value="javascript">JavaScript / TypeScript</option>
                <option value="database">SQL Database</option>
              </select>
            </div>

            <div v-if="form.type">
              <label class="block text-sm font-medium text-gray-300">
                Import Method
              </label>
              <div class="mt-2 space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="form.importMethod"
                    type="radio"
                    value="url"
                    class="h-4 w-4 border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="ml-2 text-sm text-gray-300">Import from URL</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.importMethod"
                    type="radio"
                    value="file"
                    class="h-4 w-4 border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="ml-2 text-sm text-gray-300">Upload file</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="form.importMethod"
                    type="radio"
                    value="github"
                    class="h-4 w-4 border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="ml-2 text-sm text-gray-300">Connect GitHub</span>
                </label>
              </div>
            </div>

            <div v-if="form.importMethod === 'url'">
              <label for="url" class="block text-sm font-medium text-gray-300">
                URL
              </label>
              <input
                v-model="form.url"
                type="url"
                id="url"
                required
                class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="https://api.example.com/openapi.json"
              />
            </div>

            <div v-if="form.importMethod === 'file'">
              <label for="file" class="block text-sm font-medium text-gray-300">
                File
              </label>
              <input
                type="file"
                id="file"
                @change="handleFileChange"
                required
                class="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
              />
            </div>
          </form>

          <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              @click="handleSubmit"
              :disabled="loading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
            >
              {{ loading ? 'Creating...' : 'Create Project' }}
            </button>
            <button
              @click="$emit('close')"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:col-start-1 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useProjectsStore } from '@/stores/projects'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'created'])

const projectsStore = useProjectsStore()
const loading = ref(false)

const form = ref({
  name: '',
  description: '',
  type: '',
  importMethod: 'url',
  url: '',
  file: null
})

const handleFileChange = (event) => {
  form.value.file = event.target.files[0]
}

const handleSubmit = async () => {
  loading.value = true
  
  try {
    const projectData = {
      name: form.value.name,
      description: form.value.description,
      type: form.value.type,
      importMethod: form.value.importMethod,
      url: form.value.url
    }
    
    const result = await projectsStore.createProject(projectData)
    
    if (result.success) {
      emit('created', result.project)
      emit('close')
      resetForm()
    }
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    type: '',
    importMethod: 'url',
    url: '',
    file: null
  }
}
</script>