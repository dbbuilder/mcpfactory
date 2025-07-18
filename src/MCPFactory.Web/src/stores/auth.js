import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token'))
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)
  const isLoading = computed(() => loading.value)

  // Actions
  async function login(credentials) {
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.login(credentials)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('auth_token', response.token)
      return { success: true }
    } catch (err) {
      error.value = err.message || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.register(userData)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('auth_token', response.token)
      return { success: true }
    } catch (err) {
      error.value = err.message || 'Registration failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('auth_token')
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) return
    
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.getProfile()
      user.value = response.user
    } catch (err) {
      error.value = err.message || 'Failed to fetch user'
      if (err.status === 401) {
        await logout()
      }
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(profileData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.updateProfile(profileData)
      user.value = response.user
      return { success: true }
    } catch (err) {
      error.value = err.message || 'Update failed'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    currentUser,
    isLoading,
    // Actions
    login,
    register,
    logout,
    fetchUser,
    updateProfile
  }
})