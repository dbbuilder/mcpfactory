<template>
  <div class="min-h-screen pt-20 bg-gray-900">
    <!-- Header -->
    <div class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
      <div class="mx-auto max-w-4xl text-center">
        <h1 class="text-base font-semibold leading-7 text-indigo-400">Pricing</h1>
        <p class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Choose the right plan for your needs
        </p>
      </div>
      <p class="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">
        Start free and scale as you grow. All plans include core MCP features, unlimited projects, and community support.
      </p>
      
      <!-- Billing Toggle -->
      <div class="mt-10 flex justify-center">
        <div class="relative flex rounded-lg bg-gray-800 p-1">
          <button
            @click="billingPeriod = 'monthly'"
            :class="billingPeriod === 'monthly' ? 'bg-white text-gray-900' : 'text-gray-300'"
            class="relative rounded-md py-2 px-4 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Monthly billing
          </button>
          <button
            @click="billingPeriod = 'annual'"
            :class="billingPeriod === 'annual' ? 'bg-white text-gray-900' : 'text-gray-300'"
            class="relative rounded-md py-2 px-4 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Annual billing
            <span class="ml-1.5 inline-flex items-center rounded-full bg-indigo-500 px-2 py-0.5 text-xs font-medium text-white">
              Save 20%
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Pricing Cards -->
    <div class="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
      <div class="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-6xl lg:grid-cols-3">
        <!-- Free Tier -->
        <div class="flex flex-col rounded-3xl bg-gray-800 shadow-xl ring-1 ring-gray-700">
          <div class="p-8">
            <h3 class="text-2xl font-bold leading-8 text-white">Starter</h3>
            <p class="mt-4 text-base leading-7 text-gray-300">
              Perfect for trying out MCPFactory and small projects
            </p>
            <p class="mt-6 flex items-baseline gap-x-1">
              <span class="text-5xl font-bold tracking-tight text-white">$0</span>
              <span class="text-base font-medium leading-7 text-gray-400">/month</span>
            </p>
            <a
              href="/register"
              class="mt-8 block w-full rounded-md bg-gray-700 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </a>
          </div>
          <div class="flex flex-1 flex-col p-8 pt-0">
            <h4 class="text-sm font-semibold leading-6 text-gray-300">What's included</h4>
            <ul role="list" class="mt-6 flex flex-1 flex-col gap-y-3">
              <li v-for="feature in tiers.starter.features" :key="feature" class="flex items-start">
                <svg class="h-6 w-5 flex-none text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                </svg>
                <span class="ml-3 text-sm leading-6 text-gray-300">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Pro Tier -->
        <div class="flex flex-col rounded-3xl bg-gray-800 shadow-xl ring-2 ring-indigo-500">
          <div class="p-8">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-bold leading-8 text-white">Professional</h3>
              <p class="rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                Most popular
              </p>
            </div>
            <p class="mt-4 text-base leading-7 text-gray-300">
              For teams and growing businesses with production needs
            </p>
            <p class="mt-6 flex items-baseline gap-x-1">
              <span class="text-5xl font-bold tracking-tight text-white">
                ${{ billingPeriod === 'monthly' ? '49' : '39' }}
              </span>
              <span class="text-base font-medium leading-7 text-gray-400">/month</span>
              <span v-if="billingPeriod === 'annual'" class="text-sm text-gray-400">
                (billed annually)
              </span>
            </p>
            <a
              href="/register"
              class="mt-8 block w-full rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Start free trial
            </a>
          </div>
          <div class="flex flex-1 flex-col p-8 pt-0">
            <h4 class="text-sm font-semibold leading-6 text-gray-300">Everything in Starter, plus</h4>
            <ul role="list" class="mt-6 flex flex-1 flex-col gap-y-3">
              <li v-for="feature in tiers.professional.features" :key="feature" class="flex items-start">
                <svg class="h-6 w-5 flex-none text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                </svg>
                <span class="ml-3 text-sm leading-6 text-gray-300">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Enterprise Tier -->
        <div class="flex flex-col rounded-3xl bg-gray-800 shadow-xl ring-1 ring-gray-700">
          <div class="p-8">
            <h3 class="text-2xl font-bold leading-8 text-white">Enterprise</h3>
            <p class="mt-4 text-base leading-7 text-gray-300">
              Advanced features for large teams and custom requirements
            </p>
            <p class="mt-6 flex items-baseline gap-x-1">
              <span class="text-5xl font-bold tracking-tight text-white">Custom</span>
            </p>
            <a
              href="/contact"
              class="mt-8 block w-full rounded-md bg-gray-700 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Contact sales
            </a>
          </div>
          <div class="flex flex-1 flex-col p-8 pt-0">
            <h4 class="text-sm font-semibold leading-6 text-gray-300">Everything in Professional, plus</h4>
            <ul role="list" class="mt-6 flex flex-1 flex-col gap-y-3">
              <li v-for="feature in tiers.enterprise.features" :key="feature" class="flex items-start">
                <svg class="h-6 w-5 flex-none text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                </svg>
                <span class="ml-3 text-sm leading-6 text-gray-300">{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Feature Comparison -->
    <div class="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
      <div class="mx-auto max-w-4xl text-center">
        <h2 class="text-base font-semibold leading-7 text-indigo-400">Compare plans</h2>
        <p class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Detailed feature comparison
        </p>
      </div>
      
      <div class="mt-16 overflow-hidden shadow ring-1 ring-gray-700 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-sm font-semibold text-white">Features</th>
              <th scope="col" class="px-6 py-3 text-center text-sm font-semibold text-white">Starter</th>
              <th scope="col" class="px-6 py-3 text-center text-sm font-semibold text-white">Professional</th>
              <th scope="col" class="px-6 py-3 text-center text-sm font-semibold text-white">Enterprise</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700 bg-gray-900">
            <tr v-for="feature in comparisonFeatures" :key="feature.name">
              <td class="px-6 py-4 text-sm text-gray-300">
                <div>
                  <div class="font-medium">{{ feature.name }}</div>
                  <div v-if="feature.description" class="text-gray-400">{{ feature.description }}</div>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span v-if="feature.starter === true" class="text-green-400">
                  <svg class="mx-auto h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span v-else-if="feature.starter === false" class="text-gray-500">
                  <svg class="mx-auto h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                <span v-else class="text-sm text-gray-300">{{ feature.starter }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                <span v-if="feature.professional === true" class="text-green-400">
                  <svg class="mx-auto h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span v-else-if="feature.professional === false" class="text-gray-500">
                  <svg class="mx-auto h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                <span v-else class="text-sm text-gray-300">{{ feature.professional }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                <span v-if="feature.enterprise === true" class="text-green-400">
                  <svg class="mx-auto h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span v-else-if="feature.enterprise === false" class="text-gray-500">
                  <svg class="mx-auto h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                <span v-else class="text-sm text-gray-300">{{ feature.enterprise }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
      <div class="mx-auto max-w-4xl">
        <h2 class="text-2xl font-bold leading-10 tracking-tight text-white">Frequently asked questions</h2>
        <dl class="mt-10 space-y-8">
          <div v-for="faq in faqs" :key="faq.question">
            <dt class="text-base font-semibold leading-7 text-white">
              {{ faq.question }}
            </dt>
            <dd class="mt-2 text-base leading-7 text-gray-300">
              {{ faq.answer }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSEO, generateStructuredData } from '@/composables/useSEO'

const billingPeriod = ref('monthly')


const tiers = {
  starter: {
    features: [
      '3 MCP servers',
      '1,000 API calls/month',
      'Community support',
      'Basic analytics',
      'Public deployments',
      'Standard SLA'
    ]
  },
  professional: {
    features: [
      'Unlimited MCP servers',
      '100,000 API calls/month',
      'Priority support',
      'Advanced analytics',
      'Private deployments',
      'Custom domains',
      '99.9% uptime SLA',
      'Team collaboration'
    ]
  },
  enterprise: {
    features: [
      'Unlimited API calls',
      'Dedicated support',
      'Enterprise SSO',
      'Audit logs',
      'On-premise deployment',
      'Custom integrations',
      '99.99% uptime SLA',
      'SLA guarantees'
    ]
  }
}

const comparisonFeatures = [
  {
    name: 'MCP Servers',
    starter: '3',
    professional: 'Unlimited',
    enterprise: 'Unlimited'
  },
  {
    name: 'API Calls',
    description: 'Monthly limit for all MCP servers',
    starter: '1,000',
    professional: '100,000',
    enterprise: 'Unlimited'
  },
  {
    name: 'Import Methods',
    starter: true,
    professional: true,
    enterprise: true
  },
  {
    name: 'Auto-generation',
    starter: true,
    professional: true,
    enterprise: true
  },
  {
    name: 'Custom Domains',
    starter: false,
    professional: true,
    enterprise: true
  },
  {
    name: 'Team Members',
    starter: '1',
    professional: '10',
    enterprise: 'Unlimited'
  },
  {
    name: 'Analytics & Monitoring',
    starter: 'Basic',
    professional: 'Advanced',
    enterprise: 'Custom'
  },
  {
    name: 'Support',
    starter: 'Community',
    professional: 'Priority',
    enterprise: 'Dedicated'
  },
  {
    name: 'SLA',
    starter: 'Standard',
    professional: '99.9%',
    enterprise: '99.99%'
  },
  {
    name: 'SSO & SAML',
    starter: false,
    professional: false,
    enterprise: true
  },
  {
    name: 'Audit Logs',
    starter: false,
    professional: 'Limited',
    enterprise: true
  },
  {
    name: 'On-premise Deployment',
    starter: false,
    professional: false,
    enterprise: true
  }
]

const faqs = [
  {
    question: 'Can I change my plan later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated difference. When downgrading, we\'ll credit your account for the unused time.'
  },
  {
    question: 'What happens if I exceed my API call limit?',
    answer: 'We\'ll notify you when you reach 80% of your limit. If you exceed it, your MCP servers will continue to work but at a reduced rate. You can upgrade your plan or purchase additional API calls.'
  },
  {
    question: 'Do you offer discounts for non-profits or education?',
    answer: 'Yes! We offer 50% off Professional plans for verified non-profit organizations and educational institutions. Contact our sales team for more information.'
  },
  {
    question: 'Can I self-host MCPFactory?',
    answer: 'Self-hosting is available for Enterprise customers. This includes full source code access, deployment scripts, and dedicated support for your installation.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, ACH transfers for annual plans, and wire transfers for Enterprise contracts. All payments are processed securely through Stripe.'
  }
]

// SEO configuration
useSEO({
  title: 'Pricing - Choose Your Plan',
  description: 'Start free and scale as you grow. All plans include core MCP features, unlimited projects, and community support.',
  keywords: 'MCPFactory pricing, MCP server pricing, API transformation pricing',
  jsonLd: generateStructuredData('FAQPage', {
    questions: faqs
  })
})
</script>