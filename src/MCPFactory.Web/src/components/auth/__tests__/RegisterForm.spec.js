import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { nextTick } from 'vue'

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRouter: vi.fn()
}))

describe('RegisterForm', () => {
  let wrapper
  let authStore
  let mockRouter

  beforeEach(() => {
    mockRouter = {
      push: vi.fn()
    }
    useRouter.mockReturnValue(mockRouter)

    wrapper = mount(RegisterForm, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          stubActions: false
        })]
      }
    })

    authStore = useAuthStore()
    // Set default mock behavior
    authStore.register = vi.fn().mockResolvedValue({ success: false })
  })

  describe('Form Rendering', () => {
    it('renders all required input fields', () => {
      expect(wrapper.find('#name').exists()).toBe(true)
      expect(wrapper.find('#email').exists()).toBe(true)
      expect(wrapper.find('#password').exists()).toBe(true)
      expect(wrapper.find('#confirmPassword').exists()).toBe(true)
      expect(wrapper.find('#terms').exists()).toBe(true)
    })

    it('renders submit button', () => {
      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.exists()).toBe(true)
      expect(submitButton.text()).toContain('Create account')
    })

    it('renders terms and privacy links', () => {
      const links = wrapper.findAll('a')
      expect(links.length).toBeGreaterThanOrEqual(2)
      expect(wrapper.text()).toContain('Terms of Service')
      expect(wrapper.text()).toContain('Privacy Policy')
    })
  })

  describe('Form Validation', () => {
    it('validates name field', async () => {
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()
      
      expect(wrapper.text()).toContain('Name is required')
      
      // Test minimum length
      await wrapper.find('#name').setValue('A')
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()
      
      expect(wrapper.text()).toContain('Name must be at least 2 characters')
    })

    it('validates email field', async () => {
      await wrapper.find('#name').setValue('John Doe')
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()
      
      expect(wrapper.text()).toContain('Email is required')
      
      // Test invalid email
      await wrapper.find('#email').setValue('invalid-email')
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()
      
      expect(wrapper.text()).toContain('Email is invalid')
    })

    it('validates password requirements', async () => {
      await wrapper.find('#name').setValue('John Doe')
      await wrapper.find('#email').setValue('john@example.com')
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()
      
      expect(wrapper.text()).toContain('Password is required')
      
      // Test minimum length
      await wrapper.find('#password').setValue('short')
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()
      
      expect(wrapper.text()).toContain('Password must be at least 8 characters')
      
      // Test complexity requirements
      await wrapper.find('#password').setValue('longenough')
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()
      
      expect(wrapper.text()).toContain('Password must contain uppercase, lowercase, and number')
    })

    it('validates password confirmation', async () => {
      await wrapper.find('#name').setValue('John Doe')
      await wrapper.find('#email').setValue('john@example.com')
      await wrapper.find('#password').setValue('ValidPass123')
      await wrapper.find('#confirmPassword').setValue('DifferentPass123')
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()
      
      expect(wrapper.text()).toContain('Passwords do not match')
    })

    it('validates terms agreement', async () => {
      await wrapper.find('#name').setValue('John Doe')
      await wrapper.find('#email').setValue('john@example.com')
      await wrapper.find('#password').setValue('ValidPass123')
      await wrapper.find('#confirmPassword').setValue('ValidPass123')
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()
      
      expect(wrapper.text()).toContain('You must agree to the terms')
    })

    it('clears errors when input becomes valid', async () => {
      // First trigger errors
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()
      
      expect(wrapper.text()).toContain('Name is required')
      
      // Then fix the error
      await wrapper.find('#name').setValue('John Doe')
      await wrapper.find('#email').setValue('john@example.com')
      await wrapper.find('#password').setValue('ValidPass123')
      await wrapper.find('#confirmPassword').setValue('ValidPass123')
      await wrapper.find('#terms').setValue(true)
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()
      
      expect(wrapper.text()).not.toContain('Name is required')
    })
  })

  describe('Form Submission', () => {
    it('calls register action with correct data on valid submission', async () => {
      authStore.register = vi.fn().mockResolvedValue({ success: true })

      await wrapper.find('#name').setValue('John Doe')
      await wrapper.find('#email').setValue('john@example.com')
      await wrapper.find('#password').setValue('ValidPass123')
      await wrapper.find('#confirmPassword').setValue('ValidPass123')
      await wrapper.find('#terms').setValue(true)
      await wrapper.find('form').trigger('submit.prevent')

      expect(authStore.register).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'ValidPass123'
      })
    })

    it('redirects to dashboard on successful registration', async () => {
      authStore.register = vi.fn().mockResolvedValue({ success: true })

      await wrapper.find('#name').setValue('John Doe')
      await wrapper.find('#email').setValue('john@example.com')
      await wrapper.find('#password').setValue('ValidPass123')
      await wrapper.find('#confirmPassword').setValue('ValidPass123')
      await wrapper.find('#terms').setValue(true)
      await wrapper.find('form').trigger('submit.prevent')

      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })

    it('does not redirect on failed registration', async () => {
      authStore.register = vi.fn().mockResolvedValue({ success: false })

      await wrapper.find('#name').setValue('John Doe')
      await wrapper.find('#email').setValue('john@example.com')
      await wrapper.find('#password').setValue('ValidPass123')
      await wrapper.find('#confirmPassword').setValue('ValidPass123')
      await wrapper.find('#terms').setValue(true)
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

    it('shows loading text when submitting', async () => {
      authStore.isLoading = true
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Creating account...')
      expect(wrapper.find('svg.animate-spin').exists()).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('displays authentication error from store', async () => {
      authStore.error = 'Email already exists'
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Email already exists')
      expect(wrapper.find('.bg-red-900\\/50').exists()).toBe(true)
    })
  })

  describe('Input Styling', () => {
    it('applies error styling to invalid inputs', async () => {
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()

      const nameInput = wrapper.find('#name')
      expect(nameInput.classes()).toContain('border-red-500')
    })

    it('removes error styling when input becomes valid', async () => {
      // First trigger error
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()

      // Then fix the error
      await wrapper.find('#name').setValue('John Doe')
      await wrapper.find('#email').setValue('john@example.com')
      await wrapper.find('#password').setValue('ValidPass123')
      await wrapper.find('#confirmPassword').setValue('ValidPass123')
      await wrapper.find('#terms').setValue(true)
      await wrapper.find('form').trigger('submit.prevent')
      await nextTick()

      const nameInput = wrapper.find('#name')
      expect(nameInput.classes()).not.toContain('border-red-500')
    })
  })

  describe('Password Visibility', () => {
    it('uses password type for password fields', () => {
      const passwordInput = wrapper.find('#password')
      const confirmPasswordInput = wrapper.find('#confirmPassword')
      
      expect(passwordInput.attributes('type')).toBe('password')
      expect(confirmPasswordInput.attributes('type')).toBe('password')
    })
  })

  describe('Autocomplete', () => {
    it('sets appropriate autocomplete attributes', () => {
      expect(wrapper.find('#name').attributes('autocomplete')).toBe('name')
      expect(wrapper.find('#email').attributes('autocomplete')).toBe('email')
      expect(wrapper.find('#password').attributes('autocomplete')).toBe('new-password')
      expect(wrapper.find('#confirmPassword').attributes('autocomplete')).toBe('new-password')
    })
  })
})