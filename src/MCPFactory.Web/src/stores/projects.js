import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { projectsService } from '@/services/projects'

export const useProjectsStore = defineStore('projects', () => {
  // State
  const projects = ref([])
  const currentProject = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    search: '',
    status: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  // Getters
  const filteredProjects = computed(() => {
    let result = [...projects.value]
    
    // Search filter
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      result = result.filter(project => 
        project.name.toLowerCase().includes(search) ||
        project.description?.toLowerCase().includes(search)
      )
    }
    
    // Status filter
    if (filters.value.status !== 'all') {
      result = result.filter(project => project.status === filters.value.status)
    }
    
    // Sorting
    result.sort((a, b) => {
      const aVal = a[filters.value.sortBy]
      const bVal = b[filters.value.sortBy]
      const order = filters.value.sortOrder === 'asc' ? 1 : -1
      
      if (aVal < bVal) return -1 * order
      if (aVal > bVal) return 1 * order
      return 0
    })
    
    return result
  })

  const projectCount = computed(() => projects.value.length)
  const activeProjectCount = computed(() => 
    projects.value.filter(p => p.status === 'active').length
  )

  // Actions
  async function fetchProjects() {
    loading.value = true
    error.value = null
    
    try {
      const response = await projectsService.getAll()
      projects.value = response.projects
    } catch (err) {
      error.value = err.message || 'Failed to fetch projects'
    } finally {
      loading.value = false
    }
  }

  async function fetchProject(id) {
    loading.value = true
    error.value = null
    
    try {
      const response = await projectsService.getById(id)
      currentProject.value = response.project
      return response.project
    } catch (err) {
      error.value = err.message || 'Failed to fetch project'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createProject(projectData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await projectsService.create(projectData)
      projects.value.unshift(response.project)
      return { success: true, project: response.project }
    } catch (err) {
      error.value = err.message || 'Failed to create project'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function updateProject(id, updates) {
    loading.value = true
    error.value = null
    
    try {
      const response = await projectsService.update(id, updates)
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = response.project
      }
      if (currentProject.value?.id === id) {
        currentProject.value = response.project
      }
      return { success: true, project: response.project }
    } catch (err) {
      error.value = err.message || 'Failed to update project'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function deleteProject(id) {
    loading.value = true
    error.value = null
    
    try {
      await projectsService.delete(id)
      projects.value = projects.value.filter(p => p.id !== id)
      if (currentProject.value?.id === id) {
        currentProject.value = null
      }
      return { success: true }
    } catch (err) {
      error.value = err.message || 'Failed to delete project'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function deployProject(id) {
    loading.value = true
    error.value = null
    
    try {
      const response = await projectsService.deploy(id)
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = response.project
      }
      return { success: true, deployment: response.deployment }
    } catch (err) {
      error.value = err.message || 'Failed to deploy project'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearCurrentProject() {
    currentProject.value = null
  }

  return {
    // State
    projects,
    currentProject,
    loading,
    error,
    filters,
    // Getters
    filteredProjects,
    projectCount,
    activeProjectCount,
    // Actions
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    deployProject,
    setFilters,
    clearCurrentProject
  }
})