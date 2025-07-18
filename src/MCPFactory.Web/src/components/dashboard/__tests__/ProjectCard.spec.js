import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectCard from '@/components/dashboard/ProjectCard.vue'

describe('ProjectCard', () => {
  let wrapper
  
  const mockProject = {
    id: '1',
    name: 'Test Project',
    description: 'A test project description',
    type: 'openapi',
    status: 'active',
    version: '1.2.3',
    apiCalls: 12500,
    updatedAt: new Date(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
  }

  beforeEach(() => {
    wrapper = mount(ProjectCard, {
      props: {
        project: mockProject
      }
    })
  })

  describe('Project Information Display', () => {
    it('displays project name and description', () => {
      expect(wrapper.find('h3').text()).toBe('Test Project')
      expect(wrapper.text()).toContain('A test project description')
    })

    it('displays project status with correct styling', () => {
      const statusBadge = wrapper.find('.rounded-full')
      expect(statusBadge.text()).toBe('active')
      expect(statusBadge.classes()).toContain('bg-green-900/50')
      expect(statusBadge.classes()).toContain('text-green-400')
    })

    it('displays project type', () => {
      expect(wrapper.text()).toContain('Type')
      expect(wrapper.text()).toContain('openapi')
    })

    it('displays formatted API calls count', () => {
      expect(wrapper.text()).toContain('API Calls')
      expect(wrapper.text()).toContain('12.5K')
    })

    it('displays project version', () => {
      expect(wrapper.text()).toContain('Version')
      expect(wrapper.text()).toContain('v1.2.3')
    })
  })

  describe('Status Styling', () => {
    it('applies correct classes for active status', () => {
      const statusBadge = wrapper.find('.rounded-full')
      expect(statusBadge.classes()).toContain('bg-green-900/50')
      expect(statusBadge.classes()).toContain('text-green-400')
    })

    it('applies correct classes for draft status', async () => {
      await wrapper.setProps({
        project: { ...mockProject, status: 'draft' }
      })
      
      const statusBadge = wrapper.find('.rounded-full')
      expect(statusBadge.classes()).toContain('bg-yellow-900/50')
      expect(statusBadge.classes()).toContain('text-yellow-400')
    })

    it('applies correct classes for error status', async () => {
      await wrapper.setProps({
        project: { ...mockProject, status: 'error' }
      })
      
      const statusBadge = wrapper.find('.rounded-full')
      expect(statusBadge.classes()).toContain('bg-red-900/50')
      expect(statusBadge.classes()).toContain('text-red-400')
    })

    it('applies correct classes for deploying status', async () => {
      await wrapper.setProps({
        project: { ...mockProject, status: 'deploying' }
      })
      
      const statusBadge = wrapper.find('.rounded-full')
      expect(statusBadge.classes()).toContain('bg-blue-900/50')
      expect(statusBadge.classes()).toContain('text-blue-400')
    })

    it('applies default classes for unknown status', async () => {
      await wrapper.setProps({
        project: { ...mockProject, status: 'unknown' }
      })
      
      const statusBadge = wrapper.find('.rounded-full')
      expect(statusBadge.classes()).toContain('bg-gray-900/50')
      expect(statusBadge.classes()).toContain('text-gray-400')
    })
  })

  describe('Date Formatting', () => {
    it('shows "today" for current date', () => {
      const today = new Date()
      wrapper = mount(ProjectCard, {
        props: {
          project: { ...mockProject, updatedAt: today }
        }
      })
      
      expect(wrapper.text()).toContain('Updated today')
    })

    it('shows "yesterday" for previous day', () => {
      const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24)
      wrapper = mount(ProjectCard, {
        props: {
          project: { ...mockProject, updatedAt: yesterday }
        }
      })
      
      expect(wrapper.text()).toContain('Updated yesterday')
    })

    it('shows days ago for recent dates', () => {
      const threeDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
      wrapper = mount(ProjectCard, {
        props: {
          project: { ...mockProject, updatedAt: threeDaysAgo }
        }
      })
      
      expect(wrapper.text()).toContain('Updated 3 days ago')
    })

    it('shows weeks ago for older dates', () => {
      const twoWeeksAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)
      wrapper = mount(ProjectCard, {
        props: {
          project: { ...mockProject, updatedAt: twoWeeksAgo }
        }
      })
      
      expect(wrapper.text()).toContain('Updated 2 weeks ago')
    })

    it('shows full date for very old dates', () => {
      const oldDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 60)
      wrapper = mount(ProjectCard, {
        props: {
          project: { ...mockProject, updatedAt: oldDate }
        }
      })
      
      expect(wrapper.text()).toMatch(/Updated \d{1,2}\/\d{1,2}\/\d{4}/)
    })
  })

  describe('Number Formatting', () => {
    it('formats large numbers in millions', async () => {
      await wrapper.setProps({
        project: { ...mockProject, apiCalls: 2500000 }
      })
      
      expect(wrapper.text()).toContain('2.5M')
    })

    it('formats thousands with K suffix', async () => {
      await wrapper.setProps({
        project: { ...mockProject, apiCalls: 5600 }
      })
      
      expect(wrapper.text()).toContain('5.6K')
    })

    it('shows raw number for small values', async () => {
      await wrapper.setProps({
        project: { ...mockProject, apiCalls: 450 }
      })
      
      expect(wrapper.text()).toContain('450')
    })

    it('handles zero API calls', async () => {
      await wrapper.setProps({
        project: { ...mockProject, apiCalls: 0 }
      })
      
      expect(wrapper.text()).toContain('0')
    })
  })

  describe('Action Buttons', () => {
    it('always shows view details button', () => {
      const viewButton = wrapper.find('button').text()
      expect(viewButton).toBe('View Details')
    })

    it('shows deploy button for active projects', () => {
      const buttons = wrapper.findAll('button')
      expect(buttons[1].text()).toBe('Deploy')
    })

    it('shows configure button for non-active projects', async () => {
      await wrapper.setProps({
        project: { ...mockProject, status: 'draft' }
      })
      
      const buttons = wrapper.findAll('button')
      expect(buttons[1].text()).toBe('Configure')
    })

    it('emits view event when view button clicked', async () => {
      const viewButton = wrapper.find('button')
      await viewButton.trigger('click')
      
      expect(wrapper.emitted('view')).toBeTruthy()
      expect(wrapper.emitted('view')[0][0]).toEqual(mockProject)
    })

    it('emits deploy event when deploy button clicked', async () => {
      const deployButton = wrapper.findAll('button')[1]
      await deployButton.trigger('click')
      
      expect(wrapper.emitted('deploy')).toBeTruthy()
      expect(wrapper.emitted('deploy')[0][0]).toEqual(mockProject)
    })

    it('emits configure event when configure button clicked', async () => {
      const draftProject = { ...mockProject, status: 'draft' }
      await wrapper.setProps({
        project: draftProject
      })
      
      const configureButton = wrapper.findAll('button')[1]
      await configureButton.trigger('click')
      
      expect(wrapper.emitted('configure')).toBeTruthy()
      expect(wrapper.emitted('configure')[0][0]).toEqual(draftProject)
    })
  })

  describe('Visual Effects', () => {
    it('has hover shadow effect on card', () => {
      const card = wrapper.find('.bg-gray-800')
      expect(card.classes()).toContain('hover:shadow-xl')
      expect(card.classes()).toContain('transition-shadow')
    })

    it('has hover effects on buttons', () => {
      const viewButton = wrapper.find('button')
      expect(viewButton.classes()).toContain('hover:bg-gray-600')
      expect(viewButton.classes()).toContain('transition-colors')
      
      const deployButton = wrapper.findAll('button')[1]
      expect(deployButton.classes()).toContain('hover:bg-indigo-700')
      expect(deployButton.classes()).toContain('transition-colors')
    })
  })

  describe('Responsive Layout', () => {
    it('uses grid layout for stats', () => {
      const statsGrid = wrapper.find('.grid.grid-cols-3')
      expect(statsGrid.exists()).toBe(true)
    })

    it('uses flex layout for action buttons', () => {
      const buttonContainer = wrapper.find('.flex.space-x-3')
      expect(buttonContainer.exists()).toBe(true)
    })
  })
})