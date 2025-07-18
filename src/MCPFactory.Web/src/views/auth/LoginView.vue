<template>
  <div class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-900">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <router-link to="/" class="flex justify-center">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          MCPFactory
        </h1>
      </router-link>
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-white">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-400">
        Or
        <router-link to="/register" class="font-medium text-indigo-400 hover:text-indigo-300">
          start your free trial
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script setup>
import LoginForm from '@/components/auth/LoginForm.vue'
</script>