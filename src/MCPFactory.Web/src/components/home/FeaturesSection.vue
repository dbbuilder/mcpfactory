<template>
  <section id="features" class="py-24 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <!-- Section header -->
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-base font-semibold leading-7 text-indigo-400">Everything you need</h2>
        <p class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Build MCP servers for any code
        </p>
        <p class="mt-6 text-lg leading-8 text-gray-300">
          MCPFactory provides a complete platform to transform your existing code into AI-ready MCP servers 
          with enterprise-grade features.
        </p>
      </div>

      <!-- Features grid -->
      <div class="mx-auto mt-16 max-w-7xl">
        <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
          <div v-for="feature in features" :key="feature.name" class="relative pl-16">
            <dt class="text-base font-semibold leading-7 text-white">
              <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
                <component :is="feature.icon" class="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              {{ feature.name }}
            </dt>
            <dd class="mt-2 text-base leading-7 text-gray-400">{{ feature.description }}</dd>
          </div>
        </dl>
      </div>

      <!-- Feature showcase -->
      <div class="mx-auto mt-24 max-w-7xl">
        <div class="relative overflow-hidden rounded-3xl bg-gray-800/50 px-6 pb-9 pt-64 shadow-2xl sm:px-12 lg:max-w-none lg:px-8 lg:pb-16 xl:px-10 xl:pb-20">
          <img
            class="absolute inset-0 h-full w-full object-cover brightness-50"
            src="https://images.unsplash.com/photo-1630450202872-e0829c9d6172?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt=""
          />
          <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-purple-900/20"></div>
          
          <div class="relative mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-4xl lg:text-left">
            <h3 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Enterprise-ready from day one
            </h3>
            <p class="mt-6 text-lg leading-8 text-gray-300">
              MCPFactory comes with everything you need to run MCP servers at scale. From development 
              to production, we've got you covered with enterprise features, security, and support.
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <button @click="$router.push('/pricing')" class="btn-primary">
                View enterprise features
              </button>
              <a href="#" class="text-sm font-semibold leading-6 text-white">
                Talk to sales <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <!-- Stats -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 p-8">
            <dl class="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3 text-center lg:text-left">
              <div v-for="stat in stats" :key="stat.label">
                <dt class="text-sm font-medium text-gray-400">{{ stat.label }}</dt>
                <dd class="mt-1 text-3xl font-bold tracking-tight text-white">{{ stat.value }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    name: 'Universal Import',
    description: 'Import REST APIs, GraphQL schemas, OpenAPI specs, SQL databases, Python modules, JavaScript libraries, and more.',
    icon: 'CloudArrowUpIcon'
  },
  {
    name: 'AI-Powered Generation',
    description: 'Our AI analyzes your code structure and automatically generates optimal MCP tool mappings with proper types.',
    icon: 'SparklesIcon'
  },
  {
    name: 'Comprehensive Testing',
    description: 'Every generated server comes with automated tests, type checking, and MCP protocol compliance validation.',
    icon: 'ShieldCheckIcon'
  },
  {
    name: 'One-Click Deploy',
    description: 'Deploy to our managed cloud, your own infrastructure, or download for local hosting. Works everywhere.',
    icon: 'RocketLaunchIcon'
  },
  {
    name: 'Real-time Monitoring',
    description: 'Track usage, performance, and errors with built-in observability. Know how your MCP servers are performing.',
    icon: 'ChartBarIcon'
  },
  {
    name: 'Enterprise Security',
    description: 'SOC2 compliant with end-to-end encryption, API key management, rate limiting, and audit logs.',
    icon: 'LockClosedIcon'
  }
]

const stats = [
  { label: 'Uptime SLA', value: '99.99%' },
  { label: 'Average response time', value: '<50ms' },
  { label: 'Daily API calls', value: '1M+' }
]

// Icon components (simplified for demo)
const CloudArrowUpIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
  </svg>`
}

const SparklesIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a1.5 1.5 0 00-1.006-1.006L15.75 7.5l1.035-.259a1.5 1.5 0 001.006-1.006L18 5.25l.259 1.035a1.5 1.5 0 001.006 1.006L20.25 7.5l-1.035.259a1.5 1.5 0 00-1.006 1.006zM16.894 17.801L16.5 19.5l-.394-1.699a2.25 2.25 0 00-1.607-1.607L12.75 15.75l1.699-.394a2.25 2.25 0 001.607-1.607L16.5 12l.394 1.699a2.25 2.25 0 001.607 1.607l1.699.394-1.699.394a2.25 2.25 0 00-1.607 1.607z" />
  </svg>`
}

const ShieldCheckIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>`
}

const RocketLaunchIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>`
}

const ChartBarIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>`
}

const LockClosedIcon = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>`
}
</script>