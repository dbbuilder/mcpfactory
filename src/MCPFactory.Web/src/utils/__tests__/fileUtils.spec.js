import { describe, it, expect, vi } from 'vitest'
import {
  removeBOM,
  safeJsonParse,
  formatJson,
  readFileAsText,
  validateJson,
  detectFileType,
  formatFileSize,
  validateOpenApiSpec
} from '../fileUtils'

describe('fileUtils', () => {
  describe('removeBOM', () => {
    it('removes BOM from string starting with BOM', () => {
      const withBOM = '\uFEFFhello world'
      expect(removeBOM(withBOM)).toBe('hello world')
    })

    it('returns string unchanged if no BOM present', () => {
      const withoutBOM = 'hello world'
      expect(removeBOM(withoutBOM)).toBe('hello world')
    })

    it('handles empty strings', () => {
      expect(removeBOM('')).toBe('')
    })
  })

  describe('safeJsonParse', () => {
    it('successfully parses valid JSON', () => {
      const json = '{"name": "test", "value": 123}'
      const result = safeJsonParse(json)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual({ name: 'test', value: 123 })
      expect(result.error).toBeNull()
    })

    it('handles JSON with BOM', () => {
      const jsonWithBOM = '\uFEFF{"name": "test"}'
      const result = safeJsonParse(jsonWithBOM)
      
      expect(result.success).toBe(true)
      expect(result.data).toEqual({ name: 'test' })
    })

    it('handles invalid JSON', () => {
      const invalidJson = '{"name": invalid}'
      const result = safeJsonParse(invalidJson)
      
      expect(result.success).toBe(false)
      expect(result.data).toBeNull()
      expect(result.error).toBeInstanceOf(Error)
    })

    it('handles empty strings', () => {
      const result = safeJsonParse('')
      
      expect(result.success).toBe(false)
      expect(result.error.message).toContain('Empty JSON string')
    })

    it('handles non-string inputs', () => {
      const result = safeJsonParse(null)
      
      expect(result.success).toBe(false)
      expect(result.error.message).toContain('Input must be a string')
    })
  })

  describe('formatJson', () => {
    it('formats JavaScript objects to pretty JSON', () => {
      const obj = { name: 'test', nested: { value: 123 } }
      const formatted = formatJson(obj)
      
      expect(formatted).toContain('{\n')
      expect(formatted).toContain('  "name": "test"')
      expect(formatted).toContain('  "nested": {')
    })

    it('handles circular references', () => {
      const obj = { name: 'test' }
      obj.circular = obj
      
      expect(() => formatJson(obj)).not.toThrow()
    })
  })

  describe('readFileAsText', () => {
    it('reads text file content', async () => {
      const file = new File(['Hello, World!'], 'test.txt', { type: 'text/plain' })
      const content = await readFileAsText(file)
      
      expect(content).toBe('Hello, World!')
    })

    it('removes BOM from file content', async () => {
      const fileWithBOM = new File(['\uFEFFHello, World!'], 'test.txt', { type: 'text/plain' })
      const content = await readFileAsText(fileWithBOM)
      
      expect(content).toBe('Hello, World!')
    })

    it('handles empty files', async () => {
      const emptyFile = new File([''], 'empty.txt', { type: 'text/plain' })
      const content = await readFileAsText(emptyFile)
      
      expect(content).toBe('')
    })
  })

  describe('validateJson', () => {
    it('validates correct JSON structure', () => {
      const json = '{"name": "test", "value": 123}'
      const result = validateJson(json)
      
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
      expect(result.data).toEqual({ name: 'test', value: 123 })
    })

    it('provides error details for invalid JSON', () => {
      const invalidJson = '{"name": "test"'
      const result = validateJson(invalidJson)
      
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Unexpected end of JSON input')
    })
  })

  describe('detectFileType', () => {
    it('detects OpenAPI JSON files', () => {
      const content = '{"openapi": "3.0.0", "info": {"title": "Test API"}}'
      expect(detectFileType('api.json', content)).toBe('openapi')
    })

    it('detects OpenAPI YAML files by extension', () => {
      const content = 'openapi: 3.0.0'
      expect(detectFileType('api.yaml', content)).toBe('openapi')
    })

    it('detects GraphQL files', () => {
      expect(detectFileType('schema.graphql', '')).toBe('graphql')
      expect(detectFileType('schema.gql', '')).toBe('graphql')
    })

    it('detects Protobuf files', () => {
      expect(detectFileType('service.proto', '')).toBe('protobuf')
    })

    it('detects Python files', () => {
      expect(detectFileType('module.py', '')).toBe('python')
    })

    it('detects JavaScript files', () => {
      expect(detectFileType('script.js', '')).toBe('javascript')
      expect(detectFileType('script.mjs', '')).toBe('javascript')
    })

    it('detects TypeScript files', () => {
      expect(detectFileType('component.ts', '')).toBe('typescript')
      expect(detectFileType('component.tsx', '')).toBe('typescript')
    })

    it('detects SQL files', () => {
      expect(detectFileType('database.sql', '')).toBe('database')
    })

    it('returns unknown for unrecognized files', () => {
      expect(detectFileType('file.xyz', '')).toBe('unknown')
    })
  })

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(100)).toBe('100 Bytes')
      expect(formatFileSize(1023)).toBe('1023 Bytes')
    })

    it('formats KB correctly', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(2048)).toBe('2.0 KB')
    })

    it('formats MB correctly', () => {
      expect(formatFileSize(1048576)).toBe('1.0 MB')
      expect(formatFileSize(1572864)).toBe('1.5 MB')
    })

    it('formats GB correctly', () => {
      expect(formatFileSize(1073741824)).toBe('1.0 GB')
      expect(formatFileSize(2147483648)).toBe('2.0 GB')
    })

    it('handles negative values', () => {
      expect(formatFileSize(-100)).toBe('0 Bytes')
    })
  })

  describe('validateOpenApiSpec', () => {
    it('validates correct OpenAPI 3.0 spec', () => {
      const spec = {
        openapi: '3.0.0',
        info: {
          title: 'Test API',
          version: '1.0.0'
        },
        paths: {}
      }
      
      const result = validateOpenApiSpec(spec)
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('validates correct Swagger 2.0 spec', () => {
      const spec = {
        swagger: '2.0',
        info: {
          title: 'Test API',
          version: '1.0.0'
        },
        paths: {}
      }
      
      const result = validateOpenApiSpec(spec)
      expect(result.valid).toBe(true)
    })

    it('detects missing required fields', () => {
      const spec = {
        openapi: '3.0.0'
      }
      
      const result = validateOpenApiSpec(spec)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Missing required field: info')
    })

    it('detects invalid spec version', () => {
      const spec = {
        openapi: '4.0.0',
        info: { title: 'Test', version: '1.0.0' },
        paths: {}
      }
      
      const result = validateOpenApiSpec(spec)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Unsupported OpenAPI version: 4.0.0')
    })

    it('validates path operations', () => {
      const spec = {
        openapi: '3.0.0',
        info: { title: 'Test', version: '1.0.0' },
        paths: {
          '/users': {
            get: {
              responses: {
                '200': { description: 'Success' }
              }
            }
          }
        }
      }
      
      const result = validateOpenApiSpec(spec)
      expect(result.valid).toBe(true)
    })
  })
})