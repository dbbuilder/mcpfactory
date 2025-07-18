<template>
  <section class="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-gray-900 to-purple-900/20"></div>
      <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20"></div>
    </div>
    
    <div class="relative max-w-7xl mx-auto text-center">
      <div class="mb-8 animate-slideUp">
        <span class="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold text-indigo-400 ring-1 ring-indigo-500/20">
          🚀 Now supporting gRPC and Database schemas
        </span>
      </div>
      
      <h1 class="text-5xl sm:text-7xl font-bold tracking-tight mb-8 animate-slideUp" style="animation-delay: 0.1s">
        Any Code. Any API.<br>
        <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          One MCP Server.
        </span>
      </h1>
      
      <p class="text-xl text-gray-300 max-w-3xl mx-auto mb-10 animate-slideUp" style="animation-delay: 0.2s">
        Transform REST APIs, GraphQL endpoints, Python libraries, JavaScript modules, or any code 
        into certified MCP servers. Make your code AI-ready in minutes, not months.
      </p>
      
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slideUp" style="animation-delay: 0.3s">
        <button @click="$router.push('/dashboard')" class="w-full sm:w-auto btn-primary">
          Start Building Free
        </button>
        <button @click="scrollToDemo" class="w-full sm:w-auto btn-secondary">
          View Live Demo
        </button>
      </div>

      <TrustBadges />
    </div>
  </section>
</template>

<script setup>
import TrustBadges from '@/components/home/TrustBadges.vue'

const scrollToDemo = () => {
  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
}
</script>