import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MCPConfigEditor from '@/components/editor/MCPConfigEditor.vue'

// Mock CodeMirror
vi.mock('vue-codemirror', () => ({
  Codemirror: {
    name: 'Codemirror',
    props: ['modelValue', 'extensions', 'style', 'autofocus', 'indentWithTab', 'tabSize', 'readonly'],
    emits: ['update:modelValue', 'ready', 'change'],
    template: '<div class="mock-codemirror"><textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @change="$emit(\'change\', $event.target.value, { state: { selection: { main: { head: 0 } }, doc: { lineAt: () => ({ number: 1, from: 0 }) } } })"></textarea></div>'
  }
}))

// Mock CodeMirror extensions
vi.mock('@codemirror/lang-javascript', () => ({ javascript: vi.fn() }))
vi.mock('@codemirror/lang-json', () => ({ json: vi.fn() }))
vi.mock('@codemirror/theme-one-dark', () => ({ oneDark: {} }))
vi.mock('@codemirror/view', () => ({ EditorView: { theme: vi.fn() } }))

describe('MCPConfigEditor', () => {
  let wrapper

  const defaultProps = {
    projectId: 'test-project-123',
    initialConfig: {}
  }

  const mockConfig = {
    name: 'test-mcp-server',
    version: '1.0.0',
    description: 'Test MCP server',
    tools: [
      {
        name: 'testTool',
        description: 'A test tool',
        inputSchema: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    ]
  }

  beforeEach(() => {
    wrapper = mount(MCPConfigEditor, {
      props: defaultProps
    })
  })

  describe('Component Structure', () => {
    it('renders editor header with title', () => {
      expect(wrapper.find('h3').text()).toBe('MCP Configuration')
    })

    it('renders all tabs', () => {
      const tabs = wrapper.findAll('button').filter(btn => 
        ['Configuration', 'Generated Code', 'Tools', 'Preview'].includes(btn.text())
      )
      expect(tabs).toHaveLength(4)
    })

    it('renders format and validate buttons', () => {
      const buttons = wrapper.findAll('button')
      const formatButton = buttons.find(btn => btn.text().includes('Format'))
      const validateButton = buttons.find(btn => btn.text().includes('Validate'))
      
      expect(formatButton).toBeTruthy()
      expect(validateButton).toBeTruthy()
    })

    it('renders status bar', () => {
      const statusBar = wrapper.find('.bg-gray-800.border-t')
      expect(statusBar.exists()).toBe(true)
      expect(statusBar.text()).toContain('Line 1, Column 1')
    })
  })

  describe('Tab Switching', () => {
    it('shows config tab by default', () => {
      // Check that the config tab is the active tab by default
      expect(wrapper.vm.activeTab).toBe('config')
      
      // Verify config content area exists
      const textareas = wrapper.findAll('textarea')
      expect(textareas.length).toBeGreaterThan(0)
    })

    it('switches to generated code tab', async () => {
      const generatedTab = wrapper.findAll('button').find(btn => btn.text() === 'Generated Code')
      await generatedTab.trigger('click')
      
      expect(wrapper.vm.activeTab).toBe('generated')
    })

    it('switches to tools tab', async () => {
      const toolsTab = wrapper.findAll('button').find(btn => btn.text() === 'Tools')
      await toolsTab.trigger('click')
      
      expect(wrapper.vm.activeTab).toBe('tools')
    })

    it('switches to preview tab', async () => {
      const previewTab = wrapper.findAll('button').find(btn => btn.text() === 'Preview')
      await previewTab.trigger('click')
      
      expect(wrapper.vm.activeTab).toBe('preview')
    })
  })

  describe('Configuration Editing', () => {
    it('initializes with default config', () => {
      const textarea = wrapper.find('textarea')
      const value = JSON.parse(textarea.element.value)
      
      expect(value).toHaveProperty('name', 'my-mcp-server')
      expect(value).toHaveProperty('version', '1.0.0')
      expect(value).toHaveProperty('description')
      expect(value).toHaveProperty('tools')
      expect(value).toHaveProperty('options')
    })

    it('loads initial config from props', async () => {
      wrapper = mount(MCPConfigEditor, {
        props: {
          ...defaultProps,
          initialConfig: mockConfig
        }
      })
      await nextTick()
      
      const textarea = wrapper.find('textarea')
      const value = JSON.parse(textarea.element.value)
      
      expect(value.name).toBe('test-mcp-server')
      expect(value.tools).toHaveLength(1)
    })

    it('emits change event when config is edited', async () => {
      const textarea = wrapper.find('textarea')
      const newConfig = JSON.stringify({ name: 'updated-server' })
      
      await textarea.setValue(newConfig)
      await textarea.trigger('change')
      
      expect(wrapper.emitted('change')).toBeTruthy()
      expect(wrapper.emitted('change')[0][0]).toBe(newConfig)
    })
  })

  describe('Format Functionality', () => {
    it('formats valid JSON', async () => {
      const textarea = wrapper.find('textarea')
      const unformattedJson = '{"name":"test","version":"1.0.0"}'
      
      await textarea.setValue(unformattedJson)
      
      const formatButton = wrapper.findAll('button').find(btn => btn.text().includes('Format'))
      await formatButton.trigger('click')
      
      await nextTick()
      
      const formattedValue = textarea.element.value
      expect(formattedValue).toContain('{\n')
      expect(formattedValue).toContain('  "name": "test"')
    })

    it('shows error for invalid JSON', async () => {
      const textarea = wrapper.find('textarea')
      await textarea.setValue('{ invalid json }')
      
      const formatButton = wrapper.findAll('button').find(btn => btn.text().includes('Format'))
      await formatButton.trigger('click')
      
      await nextTick()
      
      const errors = wrapper.find('.bg-red-900\\/20')
      expect(errors.exists()).toBe(true)
      expect(errors.text()).toContain('JSON Error')
    })
  })

  describe('Validation', () => {
    it('validates config successfully', async () => {
      const textarea = wrapper.find('textarea')
      await textarea.setValue(JSON.stringify(mockConfig))
      
      const validateButton = wrapper.findAll('button').find(btn => btn.text().includes('Validate'))
      await validateButton.trigger('click')
      
      await nextTick()
      
      // No validation errors should be shown
      const errors = wrapper.find('.bg-red-900\\/20')
      expect(errors.exists()).toBe(false)
    })

    it('shows validation errors for missing fields', async () => {
      const textarea = wrapper.find('textarea')
      await textarea.setValue('{}')
      
      const validateButton = wrapper.findAll('button').find(btn => btn.text().includes('Validate'))
      await validateButton.trigger('click')
      
      await nextTick()
      
      const errors = wrapper.find('.bg-red-900\\/20')
      expect(errors.exists()).toBe(true)
      expect(errors.text()).toContain('Missing required field: name')
      expect(errors.text()).toContain('Missing required field: version')
    })

    it('validates tool configurations', async () => {
      const invalidConfig = {
        name: 'test',
        version: '1.0.0',
        tools: [{ name: 'tool1' }] // Missing description and inputSchema
      }
      
      const textarea = wrapper.find('textarea')
      await textarea.setValue(JSON.stringify(invalidConfig))
      
      const validateButton = wrapper.findAll('button').find(btn => btn.text().includes('Validate'))
      await validateButton.trigger('click')
      
      await nextTick()
      
      const errors = wrapper.find('.bg-red-900\\/20')
      expect(errors.text()).toContain('Tool 1: Missing description')
      expect(errors.text()).toContain('Tool 1: Missing inputSchema')
    })
  })

  describe('Code Generation', () => {
    it('generates MCP server code', async () => {
      const textarea = wrapper.find('textarea')
      await textarea.setValue(JSON.stringify(mockConfig))
      
      const validateButton = wrapper.findAll('button').find(btn => btn.text().includes('Validate'))
      await validateButton.trigger('click')
      
      await nextTick()
      
      // Switch to generated code tab
      const generatedTab = wrapper.findAll('button').find(btn => btn.text() === 'Generated Code')
      await generatedTab.trigger('click')
      
      const generatedTextarea = wrapper.findAll('textarea')[1]
      const generatedCode = generatedTextarea.element.value
      
      expect(generatedCode).toContain("import { MCPServer } from '@mcpfactory/sdk'")
      expect(generatedCode).toContain("name: 'test-mcp-server'")
      expect(generatedCode).toContain("server.addTool({")
      expect(generatedCode).toContain("name: 'testTool'")
    })
  })

  describe('Tools Display', () => {
    it('shows detected tools', async () => {
      const textarea = wrapper.find('textarea')
      await textarea.setValue(JSON.stringify(mockConfig))
      
      const validateButton = wrapper.findAll('button').find(btn => btn.text().includes('Validate'))
      await validateButton.trigger('click')
      
      await nextTick()
      
      // Switch to tools tab
      const toolsTab = wrapper.findAll('button').find(btn => btn.text() === 'Tools')
      await toolsTab.trigger('click')
      
      expect(wrapper.text()).toContain('testTool')
      expect(wrapper.text()).toContain('A test tool')
      expect(wrapper.text()).toContain('Valid')
    })

    it('shows empty state when no tools', async () => {
      const toolsTab = wrapper.findAll('button').find(btn => btn.text() === 'Tools')
      await toolsTab.trigger('click')
      
      expect(wrapper.text()).toContain('No tools detected yet')
    })
  })

  describe('Preview Functionality', () => {
    it('allows tool testing', async () => {
      // Set up config with tools
      const textarea = wrapper.find('textarea')
      await textarea.setValue(JSON.stringify(mockConfig))
      
      const validateButton = wrapper.findAll('button').find(btn => btn.text().includes('Validate'))
      await validateButton.trigger('click')
      
      await nextTick()
      
      // Switch to preview tab
      const previewTab = wrapper.findAll('button').find(btn => btn.text() === 'Preview')
      await previewTab.trigger('click')
      
      // Select a tool
      const toolSelect = wrapper.find('select')
      await toolSelect.setValue('testTool')
      
      // Add test input
      const testInputArea = wrapper.findAll('textarea').find(el => 
        el.attributes('placeholder')?.includes('param1')
      )
      await testInputArea.setValue('{"message": "test"}')
      
      // Run test
      const runButton = wrapper.findAll('button').find(btn => btn.text().includes('Run Test'))
      await runButton.trigger('click')
      
      await nextTick()
      
      expect(wrapper.text()).toContain('Test executed for tool: testTool')
    })
  })

  describe('Auto-save', () => {
    it('emits save event after config changes', async () => {
      vi.useFakeTimers()
      
      const textarea = wrapper.find('textarea')
      await textarea.setValue(JSON.stringify(mockConfig))
      await textarea.trigger('change')
      
      // Fast-forward time to trigger auto-save
      vi.advanceTimersByTime(2500)
      await nextTick()
      
      expect(wrapper.emitted('save')).toBeTruthy()
      expect(wrapper.emitted('save')[0][0]).toEqual(mockConfig)
      
      vi.useRealTimers()
    })

    it('updates last saved indicator', async () => {
      vi.useFakeTimers()
      
      const textarea = wrapper.find('textarea')
      await textarea.setValue(JSON.stringify(mockConfig))
      await textarea.trigger('change')
      
      vi.advanceTimersByTime(2500)
      await nextTick()
      
      expect(wrapper.text()).toContain('Saved just now')
      
      vi.useRealTimers()
    })
  })

  describe('Cursor Position', () => {
    it('updates cursor position on change', async () => {
      const textarea = wrapper.find('textarea')
      await textarea.trigger('change')
      
      expect(wrapper.text()).toContain('Line 1, Column 1')
    })
  })
})