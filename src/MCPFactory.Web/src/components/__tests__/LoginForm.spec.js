import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import LoginForm from '@/components/auth/LoginForm.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRouter: vi.fn()
}))

describe('LoginForm', () => {
  let wrapper
  let authStore
  let mockRouter

  beforeEach(() => {
    mockRouter = {
      push: vi.fn()
    }
    useRouter.mockReturnValue(mockRouter)

    wrapper = mount(LoginForm, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          stubActions: false
        })],
        stubs: {
          LoadingSpinner: true
        }
      }
    })

    authStore = useAuthStore()
    // Set default mock behavior
    authStore.login = vi.fn().mockResolvedValue({ success: false })
  })

  describe('Form Rendering', () => {
    it('renders email and password inputs', () => {
      expect(wrapper.find('#email').exists()).toBe(true)
      expect(wrapper.find('#password').exists()).toBe(true)
    })

    it('renders remember me checkbox', () => {
      expect(wrapper.find('#remember-me').exists()).toBe(true)
    })

    it('renders submit button', () => {
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.exists()).toBe(true)
      expect(submitButton.text()).toContain('Sign in')
    })

    it('renders social login buttons', () => {
      const buttons = wrapper.findAll('button[type="button"]')
      expect(buttons.length).toBeGreaterThanOrEqual(2)
      expect(wrapper.text()).toContain('GitHub')
      expect(wrapper.text()).toContain('Google')
    })
  })

  describe('Form Validation', () => {
    it('shows email validation error for empty email', async () => {
      // Remove required attribute to test custom validation
      await wrapper.find('#email').element.removeAttribute('required')
      await wrapper.find('#password').element.removeAttribute('required')
      
      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.text()).toContain('Email is required')
    })

    it('shows email validation error for invalid email', async () => {
      await wrapper.find('#email').setValue('invalid-email')
      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.text()).toContain('Email is invalid')
    })

    it('shows password validation error for empty password', async () => {
      await wrapper.find('#email').setValue('test@example.com')
      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.text()).toContain('Password is required')
    })

    it('shows password validation error for short password', async () => {
      await wrapper.find('#email').setValue('test@example.com')
      await wrapper.find('#password').setValue('12345')
      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.text()).toContain('Password must be at least 6 characters')
    })
  })

  describe('Form Submission', () => {
    it('calls login action with correct data on valid submission', async () => {
      authStore.login = vi.fn().mockResolvedValue({ success: true })

      await wrapper.find('#email').setValue('test@example.com')
      await wrapper.find('#password').setValue('password123')
      await wrapper.find('#remember-me').setValue(true)
      await wrapper.find('form').trigger('submit.prevent')

      expect(authStore.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })

    it('redirects to dashboard on successful login', async () => {
      authStore.login = vi.fn().mockResolvedValue({ success: true })

      await wrapper.find('#email').setValue('test@example.com')
      await wrapper.find('#password').setValue('password123')
      await wrapper.find('form').trigger('submit.prevent')

      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })

    it('does not redirect on failed login', async () => {
      authStore.login = vi.fn().mockResolvedValue({ success: false })

      await wrapper.find('#email').setValue('test@example.com')
      await wrapper.find('#password').setValue('password123')
      await wrapper.find('form').trigger('submit.prevent')

      expect(mockRouter.push).not.toHaveBeenCalled()
    })
  })

  describe('Loading State', () => {
    it('disables submit button when loading', async () => {
      authStore.isLoading = true
      await wrapper.vm.$nextTick()

      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    it('shows loading spinner when loading', async () => {
      authStore.isLoading = true
      await wrapper.vm.$nextTick()

      expect(wrapper.findComponent({ name: 'LoadingSpinner' }).exists()).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('displays authentication error from store', async () => {
      authStore.error = 'Invalid credentials'
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Invalid credentials')
    })
  })

  describe('Input Styling', () => {
    it('applies error styling to invalid inputs', async () => {
      await wrapper.find('form').trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      const emailInput = wrapper.find('#email')
      expect(emailInput.classes()).toContain('border-red-500')
    })

    it('removes error styling when input becomes valid', async () => {
      // First trigger error
      await wrapper.find('form').trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      // Then fix the error
      await wrapper.find('#email').setValue('test@example.com')
      await wrapper.find('#password').setValue('password123')
      await wrapper.find('form').trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      const emailInput = wrapper.find('#email')
      expect(emailInput.classes()).not.toContain('border-red-500')
    })
  })
})