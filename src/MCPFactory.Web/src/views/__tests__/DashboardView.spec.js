import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import DashboardView from '@/views/DashboardView.vue'
import { useProjectsStore } from '@/stores/projects'
import { useRouter } from 'vue-router'
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import ProjectCard from '@/components/dashboard/ProjectCard.vue'
import CreateProjectModal from '@/components/dashboard/CreateProjectModal.vue'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
  RouterLink: {
    name: 'RouterLink',
    template: '<a><slot /></a>',
    props: ['to']
  }
}))

// Mock child components
vi.mock('@/components/dashboard/DashboardStats.vue', () => ({
  default: {
    name: 'DashboardStats',
    props: ['stats', 'loading'],
    template: '<div class="dashboard-stats">Stats: {{ stats.length }}</div>'
  }
}))

vi.mock('@/components/dashboard/ProjectCard.vue', () => ({
  default: {
    name: 'ProjectCard',
    props: ['project'],
    emits: ['view', 'deploy', 'configure'],
    template: '<div class="project-card">{{ project.name }}</div>'
  }
}))

vi.mock('@/components/dashboard/CreateProjectModal.vue', () => ({
  default: {
    name: 'CreateProjectModal',
    props: ['isOpen'],
    emits: ['close', 'created'],
    template: '<div v-if="isOpen" class="create-project-modal">Create Project Modal</div>'
  }
}))

vi.mock('@/components/common/SkeletonLoader.vue', () => ({
  default: {
    name: 'SkeletonLoader',
    props: ['type', 'animated'],
    template: '<div class="skeleton-loader"><slot /></div>'
  }
}))

describe('DashboardView', () => {
  let wrapper
  let mockRouter
  let projectsStore

  beforeEach(() => {
    mockRouter = {
      push: vi.fn()
    }
    useRouter.mockReturnValue(mockRouter)

    wrapper = mount(DashboardView, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          stubActions: false
        })],
        stubs: {
          RouterLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    projectsStore = useProjectsStore()
    projectsStore.loading = false
  })

  describe('Page Layout', () => {
    it('renders dashboard header', () => {
      expect(wrapper.find('h1').text()).toBe('Dashboard')
      expect(wrapper.text()).toContain('Manage your MCP servers')
    })

    it('renders new project button', () => {
      const newProjectLink = wrapper.find('a[href="/import"]')
      expect(newProjectLink.exists()).toBe(true)
      expect(newProjectLink.text()).toContain('New Project')
    })

    it('renders dashboard stats component', () => {
      const stats = wrapper.findComponent(DashboardStats)
      expect(stats.exists()).toBe(true)
      expect(stats.props('loading')).toBe(false)
      expect(stats.props('stats')).toHaveLength(4)
    })
  })

  describe('Search and Filters', () => {
    it('renders search input', () => {
      const searchInput = wrapper.find('input[type="search"]')
      expect(searchInput.exists()).toBe(true)
      expect(searchInput.attributes('placeholder')).toBe('Search projects...')
    })

    it('renders status filter', () => {
      const statusSelect = wrapper.findAll('select')[0]
      expect(statusSelect.exists()).toBe(true)
      const options = statusSelect.findAll('option')
      expect(options[0].text()).toBe('All Status')
      expect(options[1].text()).toBe('Active')
      expect(options[2].text()).toBe('Draft')
      expect(options[3].text()).toBe('Error')
    })

    it('renders sort by dropdown', () => {
      const sortSelect = wrapper.findAll('select')[1]
      expect(sortSelect.exists()).toBe(true)
      const options = sortSelect.findAll('option')
      expect(options[0].text()).toBe('Last Updated')
      expect(options[1].text()).toBe('Created')
      expect(options[2].text()).toBe('Name')
      expect(options[3].text()).toBe('API Calls')
    })

    it('filters projects by search query', async () => {
      const searchInput = wrapper.find('input[type="search"]')
      await searchInput.setValue('Weather')
      
      await nextTick()
      
      const projectCards = wrapper.findAllComponents(ProjectCard)
      expect(projectCards).toHaveLength(1)
      expect(projectCards[0].props('project').name).toBe('Weather API Server')
    })

    it('filters projects by status', async () => {
      const statusSelect = wrapper.findAll('select')[0]
      await statusSelect.setValue('active')
      
      await nextTick()
      
      const projectCards = wrapper.findAllComponents(ProjectCard)
      expect(projectCards).toHaveLength(2)
      projectCards.forEach(card => {
        expect(card.props('project').status).toBe('active')
      })
    })

    it('sorts projects by selected criteria', async () => {
      const sortSelect = wrapper.findAll('select')[1]
      await sortSelect.setValue('name')
      
      await nextTick()
      
      const projectCards = wrapper.findAllComponents(ProjectCard)
      const names = projectCards.map(card => card.props('project').name)
      expect(names).toEqual(['Database Query Tool', 'Python Analytics', 'Weather API Server'])
    })
  })

  describe('Project Display', () => {
    it('displays project cards when projects exist', () => {
      const projectCards = wrapper.findAllComponents(ProjectCard)
      expect(projectCards).toHaveLength(3)
    })

    it('shows loading skeleton when loading', async () => {
      projectsStore.loading = true
      await nextTick()
      
      const skeleton = wrapper.findComponent(SkeletonLoader)
      expect(skeleton.exists()).toBe(true)
      expect(skeleton.props('type')).toBe('card')
      expect(skeleton.props('animated')).toBe(true)
    })

    it('shows empty state when no projects', async () => {
      wrapper.vm.projects = []
      await nextTick()
      
      expect(wrapper.text()).toContain('No projects')
      expect(wrapper.text()).toContain('Get started by creating a new MCP project')
      const emptyStateButton = wrapper.findAll('a[href="/import"]')[1]
      expect(emptyStateButton.exists()).toBe(true)
    })
  })

  describe('Project Actions', () => {
    it('handles view project action', async () => {
      const projectCard = wrapper.findComponent(ProjectCard)
      await projectCard.vm.$emit('view', { id: '123' })
      
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/projects/123')
    })

    it('handles deploy project action', async () => {
      projectsStore.deployProject = vi.fn().mockResolvedValue({ success: true })
      
      const projectCard = wrapper.findComponent(ProjectCard)
      await projectCard.vm.$emit('deploy', { id: '123' })
      
      expect(projectsStore.deployProject).toHaveBeenCalledWith('123')
    })

    it('handles configure project action', async () => {
      const projectCard = wrapper.findComponent(ProjectCard)
      await projectCard.vm.$emit('configure', { id: '123' })
      
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/projects/123/configure')
    })
  })

  describe('Create Project Modal', () => {
    it('does not show modal by default', () => {
      const modal = wrapper.findComponent(CreateProjectModal)
      expect(modal.props('isOpen')).toBe(false)
    })

    it('handles project creation', async () => {
      const modal = wrapper.findComponent(CreateProjectModal)
      const newProject = {
        id: '4',
        name: 'New Project',
        status: 'draft'
      }
      
      await modal.vm.$emit('created', newProject)
      await nextTick()
      
      // Should add new project to the beginning of the list
      expect(wrapper.vm.projects[0]).toEqual(newProject)
    })
  })

  describe('Statistics', () => {
    it('calculates correct statistics', () => {
      const stats = wrapper.vm.stats
      
      expect(stats[0].name).toBe('Total Projects')
      expect(stats[0].value).toBe(3)
      
      expect(stats[1].name).toBe('Active Servers')
      expect(stats[1].value).toBe(2)
      
      expect(stats[2].name).toBe('API Calls Today')
      expect(stats[2].value).toBe('24.5K')
      
      expect(stats[3].name).toBe('Avg Response Time')
      expect(stats[3].value).toBe('45')
      expect(stats[3].unit).toBe('ms')
    })
  })

  describe('Store Integration', () => {
    it('updates store filters when local filters change', async () => {
      projectsStore.setFilters = vi.fn()
      
      // Change search
      await wrapper.find('input[type="search"]').setValue('test')
      
      // Change status
      await wrapper.findAll('select')[0].setValue('active')
      
      // Change sort
      await wrapper.findAll('select')[1].setValue('name')
      
      // Allow watchers to trigger
      await nextTick()
      
      expect(projectsStore.setFilters).toHaveBeenCalledWith({
        search: 'test',
        status: 'active',
        sortBy: 'name'
      })
    })
  })

  describe('Responsive Layout', () => {
    it('uses responsive grid for project cards', () => {
      const projectGrid = wrapper.find('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3')
      expect(projectGrid.exists()).toBe(true)
    })

    it('has responsive header layout', () => {
      const header = wrapper.find('.md\\:flex.md\\:items-center.md\\:justify-between')
      expect(header.exists()).toBe(true)
    })
  })
})