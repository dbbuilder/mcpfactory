import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import { authService } from '@/services/auth'
import { api } from '@/services/api'

// Mock the API module with named export
vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}))

// Mock auth service
vi.mock('@/services/auth', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getProfile: vi.fn()
  }
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = localStorageMock

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('Initial State', () => {
    it('should initialize with no user and loading false', () => {
      const store = useAuthStore()
      expect(store.user).toBeNull()
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should load token from localStorage if available', () => {
      localStorageMock.getItem.mockReturnValue('test-token')
      const store = useAuthStore()
      expect(store.token).toBe('test-token')
      expect(store.isAuthenticated).toBe(true)
    })
  })

  describe('Login', () => {
    it('should successfully login a user', async () => {
      const mockResponse = {
        user: { id: 1, email: 'test@example.com' },
        token: 'new-token'
      }
      authService.login.mockResolvedValueOnce(mockResponse)

      const store = useAuthStore()
      const result = await store.login({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
      expect(store.user).toEqual(mockResponse.user)
      expect(store.token).toBe('new-token')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', 'new-token')
      expect(result.success).toBe(true)
    })

    it('should handle login errors', async () => {
      const mockError = new Error('Invalid credentials')
      authService.login.mockRejectedValueOnce(mockError)

      const store = useAuthStore()
      const result = await store.login({
        email: 'test@example.com',
        password: 'wrong-password'
      })

      expect(store.error).toBe('Invalid credentials')
      expect(store.user).toBeNull()
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid credentials')
    })

    it('should set loading state during login', async () => {
      authService.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      const store = useAuthStore()
      const loginPromise = store.login({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(store.isLoading).toBe(true)
      await loginPromise
      expect(store.isLoading).toBe(false)
    })
  })

  describe('Register', () => {
    it('should successfully register a new user', async () => {
      const mockResponse = {
        user: { id: 1, email: 'new@example.com', name: 'New User' },
        token: 'new-token'
      }
      authService.register.mockResolvedValueOnce(mockResponse)

      const store = useAuthStore()
      const result = await store.register({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123'
      })

      expect(authService.register).toHaveBeenCalledWith({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123'
      })
      expect(store.user).toEqual(mockResponse.user)
      expect(result.success).toBe(true)
    })
  })

  describe('Logout', () => {
    it('should clear user data on logout', async () => {
      // Setup authenticated state
      const store = useAuthStore()
      store.user = { id: 1, email: 'test@example.com' }
      store.token = 'test-token'

      await store.logout()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token')
    })
  })

  describe('Fetch User', () => {
    it('should fetch current user data', async () => {
      const mockResponse = { user: { id: 1, email: 'test@example.com', name: 'Test User' } }
      authService.getProfile.mockResolvedValueOnce(mockResponse)

      const store = useAuthStore()
      store.token = 'test-token'
      
      await store.fetchUser()

      expect(authService.getProfile).toHaveBeenCalled()
      expect(store.user).toEqual(mockResponse.user)
    })

    it('should handle fetch user errors', async () => {
      const error = new Error('Unauthorized')
      error.status = 401
      authService.getProfile.mockRejectedValueOnce(error)

      const store = useAuthStore()
      store.token = 'invalid-token'
      
      await store.fetchUser()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
    })
  })
})