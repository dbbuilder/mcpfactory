<template>
  <div class="w-full max-w-md">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-300">
          Full name
        </label>
        <div class="mt-1">
          <input
            id="name"
            v-model="form.name"
            name="name"
            type="text"
            autocomplete="name"
            required
            class="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
        </div>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-300">
          Email address
        </label>
        <div class="mt-1">
          <input
            id="email"
            v-model="form.email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-300">
          Password
        </label>
        <div class="mt-1">
          <input
            id="password"
            v-model="form.password"
            name="password"
            type="password"
            autocomplete="new-password"
            required
            class="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            :class="{ 'border-red-500': errors.password }"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
        </div>
      </div>

      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-300">
          Confirm password
        </label>
        <div class="mt-1">
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            name="confirmPassword"
            type="password"
            autocomplete="new-password"
            required
            class="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            :class="{ 'border-red-500': errors.confirmPassword }"
          />
          <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-500">{{ errors.confirmPassword }}</p>
        </div>
      </div>

      <div class="flex items-start">
        <input
          id="terms"
          v-model="form.agreeToTerms"
          name="terms"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
          :class="{ 'border-red-500': errors.agreeToTerms }"
        />
        <label for="terms" class="ml-2 block text-sm text-gray-300">
          I agree to the
          <a href="/terms" class="font-medium text-indigo-400 hover:text-indigo-300">Terms of Service</a>
          and
          <a href="/privacy" class="font-medium text-indigo-400 hover:text-indigo-300">Privacy Policy</a>
        </label>
      </div>
      <p v-if="errors.agreeToTerms" class="mt-1 text-sm text-red-500">{{ errors.agreeToTerms }}</p>

      <div v-if="authError" class="rounded-md bg-red-900/50 p-4">
        <p class="text-sm text-red-300">{{ authError }}</p>
      </div>

      <div>
        <button
          type="submit"
          :disabled="isLoading"
          class="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!isLoading">Create account</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating account...
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

const errors = ref({})
const authError = computed(() => authStore.error)
const isLoading = computed(() => authStore.isLoading)

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.name) {
    errors.value.name = 'Name is required'
  } else if (form.value.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters'
  }
  
  if (!form.value.email) {
    errors.value.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = 'Email is invalid'
  }
  
  if (!form.value.password) {
    errors.value.password = 'Password is required'
  } else if (form.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.value.password)) {
    errors.value.password = 'Password must contain uppercase, lowercase, and number'
  }
  
  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  }
  
  if (!form.value.agreeToTerms) {
    errors.value.agreeToTerms = 'You must agree to the terms'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  const result = await authStore.register({
    name: form.value.name,
    email: form.value.email,
    password: form.value.password
  })
  
  if (result.success) {
    router.push('/dashboard')
  }
}
</script>