<template>
  <section class="py-24 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
    <div class="mx-auto max-w-7xl">
      <div class="relative isolate overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl rounded-3xl sm:px-24">
        <!-- Background pattern -->
        <svg
          class="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="grid-pattern"
              width="80"
              height="80"
              x="50%"
              y="-1"
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" stroke-width="0" fill="url(#grid-pattern)" />
        </svg>
        
        <!-- Gradient overlay -->
        <div
          class="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6"
          aria-hidden="true"
        >
          <div
            class="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-30"
          ></div>
        </div>

        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to make your code AI-ready?
          </h2>
          <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Join thousands of developers who are already building the future with MCPFactory. 
            Start free and scale as you grow.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <button @click="$router.push('/dashboard')" class="btn-primary text-lg px-8 py-4">
              Start building for free
            </button>
            <a href="/docs" class="text-sm font-semibold leading-6 text-white">
              Read the docs <span aria-hidden="true">→</span>
            </a>
          </div>
          
          <!-- Features list -->
          <dl class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-4 text-left sm:grid-cols-2">
            <div v-for="feature in ctaFeatures" :key="feature" class="flex items-center gap-x-3">
              <svg class="h-5 w-5 flex-none text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm text-gray-300">{{ feature }}</span>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const ctaFeatures = [
  'No credit card required',
  'Free tier forever',
  'Deploy unlimited MCP servers',
  'Full API access',
  'Community support',
  'Cancel anytime'
]
</script>