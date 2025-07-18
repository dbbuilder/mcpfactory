import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  describe('Props', () => {
    it('renders with default props', () => {
      const wrapper = mount(LoadingSpinner)
      expect(wrapper.find('.loading-spinner').exists()).toBe(true)
      expect(wrapper.find('svg').exists()).toBe(true)
      expect(wrapper.classes()).toContain('size-md')
      expect(wrapper.classes()).toContain('color-primary')
    })

    it('renders different spinner types', async () => {
      const wrapper = mount(LoadingSpinner, {
        props: { type: 'dots' }
      })
      expect(wrapper.find('.loading-dots').exists()).toBe(true)
      expect(wrapper.findAll('.loading-dots span')).toHaveLength(3)

      await wrapper.setProps({ type: 'pulse' })
      expect(wrapper.find('.loading-pulse').exists()).toBe(true)

      await wrapper.setProps({ type: 'bars' })
      expect(wrapper.find('.loading-bars').exists()).toBe(true)
      expect(wrapper.findAll('.loading-bars span')).toHaveLength(4)
    })

    it('applies size classes correctly', async () => {
      const wrapper = mount(LoadingSpinner)
      
      const sizes = ['sm', 'md', 'lg', 'xl']
      for (const size of sizes) {
        await wrapper.setProps({ size })
        expect(wrapper.classes()).toContain(`size-${size}`)
      }
    })

    it('applies color classes correctly', async () => {
      const wrapper = mount(LoadingSpinner)
      
      const colors = ['primary', 'white', 'gray', 'success', 'error', 'warning']
      for (const color of colors) {
        await wrapper.setProps({ color })
        expect(wrapper.classes()).toContain(`color-${color}`)
      }
    })

    it('shows loading text when showText is true', () => {
      const wrapper = mount(LoadingSpinner, {
        props: {
          showText: true,
          text: 'Custom loading text'
        }
      })
      
      expect(wrapper.find('.loading-text').exists()).toBe(true)
      expect(wrapper.find('.loading-text').text()).toBe('Custom loading text')
    })

    it('positions text correctly', async () => {
      const wrapper = mount(LoadingSpinner, {
        props: {
          showText: true,
          textPosition: 'bottom'
        }
      })
      
      expect(wrapper.find('.loading-text').classes()).toContain('text-bottom')
      
      await wrapper.setProps({ textPosition: 'right' })
      expect(wrapper.find('.loading-text').classes()).toContain('text-right')
    })
  })

  describe('SVG Size', () => {
    it('calculates correct SVG size based on size prop', () => {
      const sizeMap = {
        sm: 16,
        md: 24,
        lg: 32,
        xl: 48
      }

      for (const [size, expectedSize] of Object.entries(sizeMap)) {
        const wrapper = mount(LoadingSpinner, {
          props: { size }
        })
        
        const svg = wrapper.find('svg')
        expect(svg.attributes('width')).toBe(String(expectedSize))
        expect(svg.attributes('height')).toBe(String(expectedSize))
      }
    })
  })
})