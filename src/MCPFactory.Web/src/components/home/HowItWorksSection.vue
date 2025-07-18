<template>
  <section id="how-it-works" class="py-24 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
    <div class="mx-auto max-w-7xl">
      <!-- Section header -->
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-base font-semibold leading-7 text-indigo-400">Simple process</h2>
        <p class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          From code to MCP server in minutes
        </p>
        <p class="mt-6 text-lg leading-8 text-gray-300">
          MCPFactory's intelligent pipeline handles all the complexity for you. 
          Just import your code and we'll do the rest.
        </p>
      </div>

      <!-- Steps -->
      <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          <div v-for="(step, index) in steps" :key="step.name" class="relative">
            <!-- Step number -->
            <div class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 ring-1 ring-indigo-500/20">
              <span class="text-2xl font-bold text-indigo-400">{{ index + 1 }}</span>
            </div>
            
            <!-- Connector line (not on last item) -->
            <div v-if="index < steps.length - 1" class="absolute left-8 top-16 hidden h-full w-0.5 bg-gray-700 lg:block"></div>
            
            <dt class="text-xl font-semibold leading-7 text-white">
              {{ step.name }}
            </dt>
            <dd class="mt-4 text-base leading-7 text-gray-400">
              {{ step.description }}
            </dd>
            
            <!-- Code example -->
            <div class="mt-6 rounded-lg bg-gray-900/50 p-4 ring-1 ring-gray-700">
              <pre class="text-sm text-gray-300 overflow-x-auto"><code>{{ step.code }}</code></pre>
            </div>
          </div>
        </dl>
      </div>

      <!-- CTA -->
      <div class="mt-16 flex justify-center">
        <div class="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-gray-700 hover:ring-gray-600">
          Ready to get started?
          <button @click="$router.push('/dashboard')" class="font-semibold text-indigo-400">
            <span class="absolute inset-0" aria-hidden="true"></span>
            Create your first MCP server <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    name: 'Import your code',
    description: 'Upload OpenAPI specs, GraphQL schemas, or point to your GitHub repo. MCPFactory supports all major formats and languages.',
    code: `// Option 1: Upload OpenAPI spec
{
  "openapi": "3.0.0",
  "paths": { ... }
}

// Option 2: Import from URL
https://api.example.com/openapi.json

// Option 3: Connect GitHub
github.com/yourorg/yourapi`
  },
  {
    name: 'AI generates MCP tools',
    description: 'Our AI analyzes your code structure and creates optimal MCP tool definitions with proper typing and documentation.',
    code: `// AI-generated MCP tools
export const tools = [
  {
    name: "search_products",
    description: "Search products by criteria",
    inputSchema: { ... },
    handler: async (params) => { ... }
  },
  {
    name: "create_order",
    description: "Create a new order",
    inputSchema: { ... },
    handler: async (params) => { ... }
  }
]`
  },
  {
    name: 'Deploy instantly',
    description: 'Choose where to run your MCP server: our cloud, your infrastructure, or download for local use. It\'s ready in seconds.',
    code: `# Hosted on MCPFactory Cloud
https://api.mcpfactory.com/v1/yourserver

# Self-hosted with Docker
docker run mcpfactory/yourserver:latest

# NPM package
npm install @yourorg/mcp-server`
  }
]
</script>