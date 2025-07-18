<template>
  <nav class="fixed w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <router-link to="/" class="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              MCPFactory
            </router-link>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <router-link 
                v-for="item in navigation" 
                :key="item.name"
                :to="item.to"
                class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                :class="{ 'text-white bg-gray-800': $route.path === item.to }"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <router-link to="/dashboard" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Sign in
          </router-link>
          <router-link to="/" class="bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-md text-sm font-semibold transition-all">
            Start Free
          </router-link>
        </div>
        <div class="md:hidden">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-400 hover:text-white p-2">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="mobileMenuOpen" class="md:hidden bg-gray-900 border-b border-gray-800">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            @click="mobileMenuOpen = false"
            class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            :class="{ 'text-white bg-gray-800': $route.path === item.to }"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const mobileMenuOpen = ref(false)

const navigation = [
  { name: 'Features', to: '/#features' },
  { name: 'How it Works', to: '/#how-it-works' },
  { name: 'Pricing', to: '/pricing' },
  { name: 'Docs', to: '/docs' }
]
</script>