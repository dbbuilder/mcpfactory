import { api } from './api'

export const projectsService = {
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/projects${queryString ? `?${queryString}` : ''}`)
  },

  async getById(id) {
    return api.get(`/projects/${id}`)
  },

  async create(projectData) {
    return api.post('/projects', projectData)
  },

  async update(id, updates) {
    return api.patch(`/projects/${id}`, updates)
  },

  async delete(id) {
    return api.delete(`/projects/${id}`)
  },

  async deploy(id) {
    return api.post(`/projects/${id}/deploy`)
  },

  async getDeployments(id) {
    return api.get(`/projects/${id}/deployments`)
  },

  async getLogs(id, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/projects/${id}/logs${queryString ? `?${queryString}` : ''}`)
  },

  async getMetrics(id, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/projects/${id}/metrics${queryString ? `?${queryString}` : ''}`)
  },

  async importFromUrl(url, type) {
    return api.post('/projects/import', { url, type })
  },

  async importFromFile(file, type) {
    return api.upload('/projects/import/file', file, { type })
  },

  async validateConfig(config) {
    return api.post('/projects/validate', { config })
  },

  async generateMCP(projectId) {
    return api.post(`/projects/${projectId}/generate`)
  },

  async testMCP(projectId, testData) {
    return api.post(`/projects/${projectId}/test`, testData)
  }
}