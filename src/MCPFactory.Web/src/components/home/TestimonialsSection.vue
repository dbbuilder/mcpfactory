<template>
  <section class="py-24 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <!-- Section header -->
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Loved by developers worldwide
        </h2>
        <p class="mt-4 text-lg leading-8 text-gray-300">
          See what teams are building with MCPFactory
        </p>
      </div>

      <!-- Testimonials grid -->
      <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <div v-for="testimonial in testimonials" :key="testimonial.author.name" 
             class="flex flex-col justify-between rounded-2xl bg-gray-800/50 p-8 ring-1 ring-gray-700">
          <div>
            <!-- Rating stars -->
            <div class="flex gap-x-1 text-indigo-400">
              <svg v-for="i in 5" :key="i" class="h-5 w-5 flex-none" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" />
              </svg>
            </div>
            
            <blockquote class="mt-6 text-base leading-7 text-gray-300">
              <p>"{{ testimonial.quote }}"</p>
            </blockquote>
          </div>
          
          <div class="mt-6 flex items-center gap-x-4">
            <img class="h-12 w-12 rounded-full bg-gray-700" :src="testimonial.author.avatar" :alt="testimonial.author.name" />
            <div>
              <div class="text-sm font-semibold text-white">{{ testimonial.author.name }}</div>
              <div class="text-sm text-gray-400">{{ testimonial.author.role }}</div>
            </div>
          </div>
          
          <!-- Company logo -->
          <div class="mt-6 flex items-center">
            <div class="text-sm font-medium text-gray-500">{{ testimonial.company }}</div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="mx-auto mt-16 max-w-7xl">
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-8 py-16 text-center ring-1 ring-indigo-500/20">
          <div class="mx-auto max-w-2xl">
            <h3 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Join thousands of developers building with MCPFactory
            </h3>
            <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Start building AI-ready APIs today. No credit card required.
            </p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
              <button @click="$router.push('/dashboard')" class="btn-primary">
                Get started for free
              </button>
              <a href="#" class="text-sm font-semibold leading-6 text-white">
                Schedule a demo <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          
          <!-- Background decoration -->
          <div class="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl" aria-hidden="true">
            <div class="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-indigo-500 to-purple-500 opacity-25"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  {
    quote: "MCPFactory transformed our entire API infrastructure in just one afternoon. What would have taken months of development was done in hours. The AI-generated MCP servers just work.",
    author: {
      name: 'Sarah Chen',
      role: 'CTO at DataFlow',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    company: 'DataFlow Inc.'
  },
  {
    quote: "We've integrated 50+ internal APIs with AI assistants using MCPFactory. The automatic type generation and testing framework saved us countless hours of manual work.",
    author: {
      name: 'Marcus Johnson',
      role: 'Engineering Lead at TechCorp',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    company: 'TechCorp'
  },
  {
    quote: "The best part is how MCPFactory handles all the edge cases. Complex authentication, rate limiting, error handling - it's all there. We just focus on our business logic.",
    author: {
      name: 'Emily Rodriguez',
      role: 'Senior Developer at CloudScale',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    company: 'CloudScale'
  }
]
</script>