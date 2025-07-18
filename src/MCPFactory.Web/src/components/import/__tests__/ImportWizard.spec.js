import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import ImportWizard from '@/components/import/ImportWizard.vue'
import { useProjectsStore } from '@/stores/projects'
import { useRouter } from 'vue-router'
import * as fileUtils from '@/utils/fileUtils'

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRouter: vi.fn()
}))

// Mock file utilities
vi.mock('@/utils/fileUtils', () => ({
  readFileAsText: vi.fn().mockResolvedValue('test content'),
  validateJson: vi.fn().mockReturnValue({ valid: true, data: {} }),
  detectFileType: vi.fn().mockReturnValue('json'),
  validateOpenApiSpec: vi.fn().mockReturnValue({ valid: true, errors: [], warnings: [] }),
  safeJsonParse: vi.fn().mockReturnValue({ success: true, data: {} })
}))

// Mock LoadingSpinner component
vi.mock('@/components/common/LoadingSpinner.vue', () => ({
  default: {
    name: 'LoadingSpinner',
    template: '<div class="loading-spinner"></div>'
  }
}))

describe('ImportWizard', () => {
  let wrapper
  let mockRouter
  let projectsStore

  beforeEach(() => {
    mockRouter = {
      push: vi.fn()
    }
    useRouter.mockReturnValue(mockRouter)

    wrapper = mount(ImportWizard, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          stubActions: false
        })]
      }
    })

    projectsStore = useProjectsStore()
  })

  describe('Step Navigation', () => {
    it('starts at step 0 (Type selection)', () => {
      expect(wrapper.vm.currentStep).toBe(0)
      expect(wrapper.text()).toContain('What type of code are you importing?')
    })

    it('shows all step indicators', () => {
      const steps = wrapper.findAll('nav ol li')
      expect(steps).toHaveLength(4)
      expect(steps[0].text()).toContain('Type')
      expect(steps[1].text()).toContain('Import')
      expect(steps[2].text()).toContain('Configure')
      expect(steps[3].text()).toContain('Review')
    })

    it('prevents navigation to future steps', () => {
      const stepButtons = wrapper.findAll('nav button')
      expect(stepButtons[1].attributes('disabled')).toBeDefined()
      expect(stepButtons[2].attributes('disabled')).toBeDefined()
      expect(stepButtons[3].attributes('disabled')).toBeDefined()
    })

    it('allows navigation through wizard', async () => {
      // Set type and advance
      wrapper.vm.wizardData.type = 'openapi'
      wrapper.vm.currentStep = 1
      wrapper.vm.furthestStep = 1
      await nextTick()
      
      expect(wrapper.vm.currentStep).toBe(1)
    })
  })

  describe('Step 1: Type Selection', () => {
    it('displays import type options', () => {
      const radioInputs = wrapper.findAll('input[type="radio"]')
      expect(radioInputs.length).toBeGreaterThan(0)
    })

    it('selects import type', async () => {
      const openApiOption = wrapper.find('input[value="openapi"]')
      await openApiOption.setValue(true)
      
      expect(wrapper.vm.wizardData.type).toBe('openapi')
    })

    it('validates type selection', () => {
      // Initially no type selected
      expect(wrapper.vm.canProceed).toBe(false)
      
      // Select a type
      wrapper.vm.wizardData.type = 'openapi'
      expect(wrapper.vm.canProceed).toBe(true)
    })
  })

  describe('Step 2: Import Method', () => {
    beforeEach(async () => {
      wrapper.vm.wizardData.type = 'openapi'
      wrapper.vm.currentStep = 1
      await nextTick()
    })

    it('displays import method options', () => {
      expect(wrapper.text()).toContain('How would you like to import')
    })

    it('shows URL input when URL method selected', async () => {
      wrapper.vm.wizardData.method = 'url'
      await nextTick()
      
      const urlInput = wrapper.find('input[type="url"]')
      expect(urlInput.exists()).toBe(true)
    })

    it('shows file upload when file method selected', async () => {
      wrapper.vm.wizardData.method = 'file'
      await nextTick()
      
      expect(wrapper.text()).toContain('Upload a file')
      expect(wrapper.find('input[type="file"]').exists()).toBe(true)
    })

    it('shows GitHub fields when GitHub method selected', async () => {
      wrapper.vm.wizardData.method = 'github'
      await nextTick()
      
      expect(wrapper.find('input#repo').exists()).toBe(true)
      expect(wrapper.find('input#branch').exists()).toBe(true)
    })

    it('shows textarea when paste method selected', async () => {
      wrapper.vm.wizardData.method = 'paste'
      await nextTick()
      
      const textarea = wrapper.find('textarea')
      expect(textarea.exists()).toBe(true)
    })

    it('handles file upload', async () => {
      wrapper.vm.wizardData.method = 'file'
      await nextTick()
      
      const file = new File(['{"openapi": "3.0.0"}'], 'api.json', { type: 'application/json' })
      
      // Simulate file selection
      await wrapper.vm.handleFileUpload({
        target: { files: [file] }
      })
      
      expect(wrapper.vm.wizardData.file).toBeTruthy()
      expect(fileUtils.readFileAsText).toHaveBeenCalled()
    })
  })

  describe('Step 3: Configuration', () => {
    beforeEach(async () => {
      wrapper.vm.wizardData.type = 'openapi'
      wrapper.vm.wizardData.method = 'url'
      wrapper.vm.wizardData.url = 'https://example.com/api.json'
      wrapper.vm.currentStep = 2
      await nextTick()
    })

    it('shows configuration options', () => {
      expect(wrapper.text()).toContain('Configure your MCP server')
      expect(wrapper.find('input#server-name').exists()).toBe(true)
      expect(wrapper.find('textarea#description').exists()).toBe(true)
    })

    it('manages feature toggles', async () => {
      // Test auto-detect toggle
      const initialAutoDetect = wrapper.vm.wizardData.config.autoDetect
      wrapper.vm.wizardData.config.autoDetect = !initialAutoDetect
      await nextTick()
      
      expect(wrapper.vm.wizardData.config.autoDetect).toBe(!initialAutoDetect)
      
      // Test feature checkboxes
      wrapper.vm.wizardData.config.includeAuth = true
      wrapper.vm.wizardData.config.includeRateLimit = true
      wrapper.vm.wizardData.config.includeCache = true
      await nextTick()
      
      expect(wrapper.vm.wizardData.config.includeAuth).toBe(true)
      expect(wrapper.vm.wizardData.config.includeRateLimit).toBe(true)
      expect(wrapper.vm.wizardData.config.includeCache).toBe(true)
    })
  })

  describe('Step 4: Review', () => {
    beforeEach(async () => {
      wrapper.vm.wizardData = {
        type: 'openapi',
        method: 'url',
        url: 'https://example.com/api.json',
        config: {
          name: 'test-server',
          description: 'Test description',
          autoDetect: true,
          includeAuth: true,
          includeRateLimit: false,
          includeCache: true
        }
      }
      wrapper.vm.currentStep = 3
      await nextTick()
    })

    it('displays review summary', () => {
      expect(wrapper.text()).toContain('Review and create')
      expect(wrapper.text()).toContain('OpenAPI / Swagger')
      expect(wrapper.text()).toContain('https://example.com/api.json')
      expect(wrapper.text()).toContain('test-server')
    })

    it('shows enabled features', () => {
      expect(wrapper.text()).toContain('Authentication')
      expect(wrapper.text()).not.toContain('Rate Limiting')
      expect(wrapper.text()).toContain('Caching')
    })

    it('displays create button on final step', () => {
      const buttons = wrapper.findAll('button')
      const createButton = buttons.find(btn => btn.text().includes('Create MCP Server'))
      expect(createButton).toBeTruthy()
    })
  })

  describe('Navigation Controls', () => {
    it('handles back navigation', async () => {
      wrapper.vm.currentStep = 2
      await nextTick()
      
      await wrapper.vm.prevStep()
      expect(wrapper.vm.currentStep).toBe(1)
    })

    it('validates before proceeding', () => {
      // Step 0: Type selection required
      wrapper.vm.currentStep = 0
      expect(wrapper.vm.canProceed).toBe(false)
      
      wrapper.vm.wizardData.type = 'openapi'
      expect(wrapper.vm.canProceed).toBe(true)
      
      // Step 1: Method and input required
      wrapper.vm.currentStep = 1
      expect(wrapper.vm.canProceed).toBe(false)
      
      wrapper.vm.wizardData.method = 'url'
      wrapper.vm.wizardData.url = 'https://example.com'
      expect(wrapper.vm.canProceed).toBe(true)
    })
  })

  describe('Project Creation', () => {
    beforeEach(async () => {
      wrapper.vm.wizardData = {
        type: 'openapi',
        method: 'url',
        url: 'https://example.com/api.json',
        config: {
          name: 'test-server',
          description: 'Test description',
          autoDetect: true,
          includeAuth: false,
          includeRateLimit: false,
          includeCache: false
        }
      }
      wrapper.vm.currentStep = 3
      await nextTick()
    })

    it('creates project with correct data', async () => {
      projectsStore.createProject = vi.fn().mockResolvedValue({
        success: true,
        project: {
          id: 'project-123',
          name: 'test-server'
        }
      })
      
      await wrapper.vm.createProject()
      
      expect(projectsStore.createProject).toHaveBeenCalledWith(expect.objectContaining({
        name: 'test-server',
        description: 'Test description',
        type: 'openapi',
        importMethod: 'url',
        url: 'https://example.com/api.json',
        config: expect.objectContaining({
          name: 'test-server',
          description: 'Test description',
          autoDetect: true
        })
      }))
    })

    it('handles creation errors', async () => {
      projectsStore.createProject = vi.fn().mockRejectedValue(new Error('Creation failed'))
      
      await wrapper.vm.createProject()
      
      expect(wrapper.vm.error).toBe('Failed to create project. Please try again.')
    })

    it('redirects after successful creation', async () => {
      projectsStore.createProject = vi.fn().mockResolvedValue({
        success: true,
        project: {
          id: 'project-123',
          name: 'test-server'
        }
      })
      
      await wrapper.vm.createProject()
      
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/projects/project-123')
    })

    it('emits created event', async () => {
      projectsStore.createProject = vi.fn().mockResolvedValue({
        success: true,
        project: {
          id: 'project-123',
          name: 'test-server'
        }
      })
      
      await wrapper.vm.createProject()
      
      expect(wrapper.emitted('created')).toBeTruthy()
      expect(wrapper.emitted('created')[0][0]).toEqual({
        id: 'project-123',
        name: 'test-server'
      })
    })
  })

  describe('Validation', () => {
    it('validates pasted content', async () => {
      wrapper.vm.wizardData.type = 'openapi'
      wrapper.vm.wizardData.method = 'paste'
      wrapper.vm.wizardData.content = '{"openapi": "3.0.0"}'
      
      await wrapper.vm.validatePastedContent()
      
      // Should call validation functions
      expect(fileUtils.detectFileType).toHaveBeenCalled()
      expect(fileUtils.validateJson).toHaveBeenCalled()
    })

    it('validates OpenAPI spec', async () => {
      wrapper.vm.wizardData.type = 'openapi'
      wrapper.vm.wizardData.method = 'paste'
      wrapper.vm.wizardData.content = '{"openapi": "3.0.0"}'
      
      await wrapper.vm.validatePastedContent()
      
      expect(fileUtils.validateOpenApiSpec).toHaveBeenCalled()
    })
  })
})