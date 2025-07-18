// Base API configuration and utilities
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.mcpfactory.com/v1'

class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.status = status
    this.data = data
  }
}

async function handleResponse(response) {
  const data = await response.json().catch(() => null)
  
  if (!response.ok) {
    throw new ApiError(
      data?.message || `HTTP Error ${response.status}`,
      response.status,
      data
    )
  }
  
  return data
}

function getAuthHeaders() {
  const token = localStorage.getItem('auth_token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

export const api = {
  async get(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers
      },
      ...options
    })
    return handleResponse(response)
  },

  async post(endpoint, data, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    })
    return handleResponse(response)
  },

  async put(endpoint, data, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    })
    return handleResponse(response)
  },

  async patch(endpoint, data, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    })
    return handleResponse(response)
  },

  async delete(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers
      },
      ...options
    })
    return handleResponse(response)
  },

  async upload(endpoint, file, additionalData = {}) {
    const formData = new FormData()
    formData.append('file', file)
    
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value)
    })

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders()
      },
      body: formData
    })
    return handleResponse(response)
  }
}