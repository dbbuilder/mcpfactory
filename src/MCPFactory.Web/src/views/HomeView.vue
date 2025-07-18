<template>
  <div>
    <HeroSection />
    <InteractiveDemo />
    <FeaturesSection />
    <HowItWorksSection />
    <TestimonialsSection />
    <CTASection />
    <FooterSection />
  </div>
</template>

<script setup>
import HeroSection from '@/components/home/HeroSection.vue'
import InteractiveDemo from '@/components/home/InteractiveDemo.vue'
import FeaturesSection from '@/components/home/FeaturesSection.vue'
import HowItWorksSection from '@/components/home/HowItWorksSection.vue'
import TestimonialsSection from '@/components/home/TestimonialsSection.vue'
import CTASection from '@/components/home/CTASection.vue'
import FooterSection from '@/components/FooterSection.vue'
import { useSEO, generateStructuredData } from '@/composables/useSEO'

// SEO configuration
useSEO({
  title: 'MCPFactory - Transform Your Code into MCP Servers',
  titleTemplate: '%s | MCPFactory',
  description: 'Universal platform for transforming any code interface into Model Context Protocol (MCP) servers. Support for OpenAPI, GraphQL, Protobuf, and more.',
  keywords: 'MCP, Model Context Protocol, API transformation, code generation, OpenAPI, GraphQL',
  image: '/og-image.png',
  url: 'https://mcpfactory.com',
  jsonLd: generateStructuredData('SoftwareApplication', {
    name: 'MCPFactory',
    description: 'Universal platform for transforming any code interface into Model Context Protocol (MCP) servers',
    category: 'DeveloperApplication',
    pricing: {
      price: '0',
      currency: 'USD'
    }
  })
})
</script>