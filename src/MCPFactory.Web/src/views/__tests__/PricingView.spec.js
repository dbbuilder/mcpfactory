import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PricingView from '../PricingView.vue'

// Mock useSEO composable
vi.mock('@/composables/useSEO', () => ({
  useSEO: vi.fn(),
  generateStructuredData: vi.fn()
}))

describe('PricingView', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PricingView)
  })

  describe('Billing Period Toggle', () => {
    it('defaults to monthly billing', () => {
      const monthlyButton = wrapper.find('button').element
      expect(monthlyButton.className).toContain('bg-white text-gray-900')
    })

    it('switches to annual billing when clicked', async () => {
      const buttons = wrapper.findAll('button')
      const annualButton = buttons.find(b => b.text().includes('Annual'))
      
      await annualButton.trigger('click')
      
      expect(annualButton.element.className).toContain('bg-white text-gray-900')
    })

    it('shows 20% savings badge on annual option', () => {
      expect(wrapper.text()).toContain('Save 20%')
    })
  })

  describe('Pricing Tiers', () => {
    it('displays all three pricing tiers', () => {
      const tiers = wrapper.findAll('.rounded-3xl')
      expect(tiers).toHaveLength(3)
    })

    it('displays correct tier names', () => {
      expect(wrapper.text()).toContain('Starter')
      expect(wrapper.text()).toContain('Professional')
      expect(wrapper.text()).toContain('Enterprise')
    })

    it('displays free price for Starter tier', () => {
      expect(wrapper.text()).toContain('$0')
    })

    it('displays monthly price for Professional tier', () => {
      expect(wrapper.text()).toContain('$49')
    })

    it('updates Professional price for annual billing', async () => {
      const annualButton = wrapper.findAll('button').find(b => b.text().includes('Annual'))
      await annualButton.trigger('click')
      
      expect(wrapper.text()).toContain('$39')
      expect(wrapper.text()).toContain('(billed annually)')
    })

    it('displays custom pricing for Enterprise', () => {
      expect(wrapper.text()).toContain('Custom')
    })
  })

  describe('Features', () => {
    it('displays features for each tier', () => {
      expect(wrapper.text()).toContain('3 MCP servers')
      expect(wrapper.text()).toContain('Unlimited MCP servers')
      expect(wrapper.text()).toContain('Enterprise SSO')
    })

    it('shows checkmarks for features', () => {
      const checkmarks = wrapper.findAll('svg path[fill-rule="evenodd"]')
      expect(checkmarks.length).toBeGreaterThan(0)
    })
  })

  describe('Feature Comparison Table', () => {
    it('displays comparison table headers', () => {
      expect(wrapper.text()).toContain('Features')
      expect(wrapper.text()).toContain('Starter')
      expect(wrapper.text()).toContain('Professional')
      expect(wrapper.text()).toContain('Enterprise')
    })

    it('displays feature rows', () => {
      expect(wrapper.text()).toContain('MCP Servers')
      expect(wrapper.text()).toContain('API Calls')
      expect(wrapper.text()).toContain('Team Members')
      expect(wrapper.text()).toContain('Support')
    })

    it('shows correct values in comparison table', () => {
      const table = wrapper.find('table')
      expect(table.text()).toContain('1,000')
      expect(table.text()).toContain('100,000')
      expect(table.text()).toContain('Unlimited')
    })

    it('displays checkmarks and X marks appropriately', () => {
      const table = wrapper.find('table')
      // Check for both checkmarks and X marks in the table
      const svgs = table.findAll('svg')
      expect(svgs.length).toBeGreaterThan(0)
    })
  })

  describe('CTA Buttons', () => {
    it('displays appropriate CTA for each tier', () => {
      const ctaButtons = wrapper.findAll('a')
      
      expect(ctaButtons[0].text()).toBe('Get started')
      expect(ctaButtons[1].text()).toBe('Start free trial')
      expect(ctaButtons[2].text()).toBe('Contact sales')
    })

    it('links to correct pages', () => {
      const ctaButtons = wrapper.findAll('a')
      
      expect(ctaButtons[0].attributes('href')).toBe('/register')
      expect(ctaButtons[1].attributes('href')).toBe('/register')
      expect(ctaButtons[2].attributes('href')).toBe('/contact')
    })
  })

  describe('FAQ Section', () => {
    it('displays FAQ heading', () => {
      expect(wrapper.text()).toContain('Frequently asked questions')
    })

    it('displays all FAQ items', () => {
      expect(wrapper.text()).toContain('Can I change my plan later?')
      expect(wrapper.text()).toContain('What happens if I exceed my API call limit?')
      expect(wrapper.text()).toContain('Do you offer discounts for non-profits or education?')
      expect(wrapper.text()).toContain('Can I self-host MCPFactory?')
      expect(wrapper.text()).toContain('What payment methods do you accept?')
    })

    it('displays FAQ answers', () => {
      expect(wrapper.text()).toContain('you can upgrade or downgrade your plan at any time')
      expect(wrapper.text()).toContain('50% off Professional plans')
      expect(wrapper.text()).toContain('Stripe')
    })
  })

  describe('Visual Indicators', () => {
    it('highlights Professional tier as most popular', () => {
      const proTier = wrapper.findAll('.rounded-3xl')[1]
      expect(proTier.classes()).toContain('ring-2')
      expect(proTier.classes()).toContain('ring-indigo-500')
      expect(proTier.text()).toContain('Most popular')
    })
  })
})