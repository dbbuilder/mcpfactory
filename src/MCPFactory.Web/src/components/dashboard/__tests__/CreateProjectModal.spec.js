import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import CreateProjectModal from '@/components/dashboard/CreateProjectModal.vue'
import { useProjectsStore } from '@/stores/projects'

// Mock Teleport
global.Teleport = {
  name: 'Teleport',
  template: '<div><slot /></div>'
}

describe('CreateProjectModal', () => {
  let wrapper
  let projectsStore

  beforeEach(() => {
    wrapper = mount(CreateProjectModal, {
      props: {
        isOpen: true
      },
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          stubActions: false
        })],
        stubs: {
          Teleport: true
        }
      }
    })

    projectsStore = useProjectsStore()
    projectsStore.createProject = vi.fn().mockResolvedValue({ 
      success: false, 
      error: 'Creation failed' 
    })
  })

  describe('Modal Display', () => {
    it('shows modal when isOpen is true', () => {
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
      expect(wrapper.find('h3').text()).toBe('Create New MCP Project')
    })

    it('hides modal when isOpen is false', async () => {
      await wrapper.setProps({ isOpen: false })
      expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
    })

    it('renders modal title and description', () => {
      expect(wrapper.find('h3').text()).toBe('Create New MCP Project')
      expect(wrapper.text()).toContain('Import your API or code to generate an MCP server')
    })
  })

  describe('Form Fields', () => {
    it('renders all initial form fields', () => {
      expect(wrapper.find('#name').exists()).toBe(true)
      expect(wrapper.find('#description').exists()).toBe(true)
      expect(wrapper.find('#type').exists()).toBe(true)
    })

    it('shows import method options when type is selected', async () => {
      await wrapper.find('#type').setValue('openapi')
      await nextTick()
      
      expect(wrapper.text()).toContain('Import Method')
      expect(wrapper.find('input[value="url"]').exists()).toBe(true)
      expect(wrapper.find('input[value="file"]').exists()).toBe(true)
      expect(wrapper.find('input[value="github"]').exists()).toBe(true)
    })

    it('shows URL input when URL method is selected', async () => {
      await wrapper.find('#type').setValue('openapi')
      await wrapper.find('input[value="url"]').setValue(true)
      await nextTick()
      
      expect(wrapper.find('#url').exists()).toBe(true)
      expect(wrapper.find('#url').attributes('placeholder')).toBe('https://api.example.com/openapi.json')
    })

    it('shows file input when file method is selected', async () => {
      await wrapper.find('#type').setValue('openapi')
      await wrapper.find('input[value="file"]').setValue(true)
      await nextTick()
      
      expect(wrapper.find('input[type="file"]').exists()).toBe(true)
    })

    it('hides import method options when no type selected', async () => {
      await wrapper.find('#type').setValue('')
      await nextTick()
      
      expect(wrapper.text()).not.toContain('Import Method')
    })
  })

  describe('Type Options', () => {
    it('provides all project type options', () => {
      const typeSelect = wrapper.find('#type')
      const options = typeSelect.findAll('option')
      
      expect(options[0].text()).toBe('Select type')
      expect(options[1].text()).toBe('OpenAPI / Swagger')
      expect(options[2].text()).toBe('GraphQL Schema')
      expect(options[3].text()).toBe('Postman Collection')
      expect(options[4].text()).toBe('Python Module')
      expect(options[5].text()).toBe('JavaScript / TypeScript')
      expect(options[6].text()).toBe('SQL Database')
    })
  })

  describe('Form Validation', () => {
    it('requires name field', () => {
      const nameInput = wrapper.find('#name')
      expect(nameInput.attributes('required')).toBeDefined()
    })

    it('requires type field', () => {
      const typeSelect = wrapper.find('#type')
      expect(typeSelect.attributes('required')).toBeDefined()
    })

    it('requires URL when URL method selected', async () => {
      await wrapper.find('#type').setValue('openapi')
      await wrapper.find('input[value="url"]').setValue(true)
      await nextTick()
      
      const urlInput = wrapper.find('#url')
      expect(urlInput.attributes('required')).toBeDefined()
    })

    it('requires file when file method selected', async () => {
      await wrapper.find('#type').setValue('openapi')
      await wrapper.find('input[value="file"]').setValue(true)
      await nextTick()
      
      const fileInput = wrapper.find('input[type="file"]')
      expect(fileInput.attributes('required')).toBeDefined()
    })
  })

  describe('Form Submission', () => {
    it('submits form with correct data', async () => {
      projectsStore.createProject = vi.fn().mockResolvedValue({
        success: true,
        project: { id: '123', name: 'Test Project' }
      })

      await wrapper.find('#name').setValue('Test Project')
      await wrapper.find('#description').setValue('Test Description')
      await wrapper.find('#type').setValue('openapi')
      await wrapper.find('input[value="url"]').setValue(true)
      await wrapper.find('#url').setValue('https://example.com/api.json')
      
      await wrapper.find('button').trigger('click')
      
      expect(projectsStore.createProject).toHaveBeenCalledWith({
        name: 'Test Project',
        description: 'Test Description',
        type: 'openapi',
        importMethod: 'url',
        url: 'https://example.com/api.json'
      })
    })

    it('emits created and close events on success', async () => {
      const mockProject = { id: '123', name: 'Test Project' }
      projectsStore.createProject = vi.fn().mockResolvedValue({
        success: true,
        project: mockProject
      })

      await wrapper.find('#name').setValue('Test Project')
      await wrapper.find('#type').setValue('openapi')
      
      await wrapper.findAll('button')[0].trigger('click')
      await nextTick()
      
      expect(wrapper.emitted('created')).toBeTruthy()
      expect(wrapper.emitted('created')[0][0]).toEqual(mockProject)
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('does not emit events on failure', async () => {
      projectsStore.createProject = vi.fn().mockResolvedValue({
        success: false,
        error: 'Creation failed'
      })

      await wrapper.find('#name').setValue('Test Project')
      await wrapper.find('#type').setValue('openapi')
      
      await wrapper.findAll('button')[0].trigger('click')
      await nextTick()
      
      expect(wrapper.emitted('created')).toBeFalsy()
      expect(wrapper.emitted('close')).toBeFalsy()
    })

    it('resets form after successful creation', async () => {
      projectsStore.createProject = vi.fn().mockResolvedValue({
        success: true,
        project: { id: '123', name: 'Test Project' }
      })

      await wrapper.find('#name').setValue('Test Project')
      await wrapper.find('#description').setValue('Test Description')
      await wrapper.find('#type').setValue('openapi')
      
      await wrapper.findAll('button')[0].trigger('click')
      await nextTick()
      
      expect(wrapper.vm.form.name).toBe('')
      expect(wrapper.vm.form.description).toBe('')
      expect(wrapper.vm.form.type).toBe('')
      expect(wrapper.vm.form.importMethod).toBe('url')
    })
  })

  describe('File Handling', () => {
    it('handles file selection', async () => {
      await wrapper.find('#type').setValue('openapi')
      await wrapper.find('input[value="file"]').setValue(true)
      await nextTick()
      
      const file = new File(['content'], 'test.json', { type: 'application/json' })
      const fileInput = wrapper.find('input[type="file"]')
      
      Object.defineProperty(fileInput.element, 'files', {
        value: [file],
        writable: false
      })
      
      await fileInput.trigger('change')
      
      expect(wrapper.vm.form.file).toStrictEqual(file)
    })
  })

  describe('Loading State', () => {
    it('shows loading text when submitting', async () => {
      // Set the loading ref directly since it's internal to the component
      wrapper.vm.loading = true
      await nextTick()
      
      const submitButton = wrapper.findAll('button')[0]
      expect(submitButton.text()).toBe('Creating...')
      expect(submitButton.attributes('disabled')).toBeDefined()
    })

    it('restores button text after submission', async () => {
      projectsStore.createProject = vi.fn().mockResolvedValue({
        success: true,
        project: { id: '123' }
      })

      await wrapper.find('#name').setValue('Test Project')
      await wrapper.find('#type').setValue('openapi')
      
      const submitButton = wrapper.findAll('button')[0]
      await submitButton.trigger('click')
      await nextTick()
      
      expect(submitButton.text()).toBe('Create Project')
      expect(submitButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('Modal Actions', () => {
    it('emits close event when clicking cancel', async () => {
      const cancelButton = wrapper.findAll('button')[1]
      await cancelButton.trigger('click')
      
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('emits close event when clicking backdrop', async () => {
      const backdrop = wrapper.find('.bg-gray-900.bg-opacity-75')
      await backdrop.trigger('click')
      
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('Import Method Defaults', () => {
    it('defaults to URL import method', () => {
      expect(wrapper.vm.form.importMethod).toBe('url')
    })

    it('preserves import method when changing types', async () => {
      await wrapper.find('#type').setValue('openapi')
      await wrapper.find('input[value="file"]').setValue(true)
      
      expect(wrapper.vm.form.importMethod).toBe('file')
      
      await wrapper.find('#type').setValue('graphql')
      
      expect(wrapper.vm.form.importMethod).toBe('file')
    })
  })
})