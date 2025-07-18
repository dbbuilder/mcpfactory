// File utilities for handling encoding and format issues

/**
 * Remove BOM (Byte Order Mark) from UTF-8 strings
 * @param {string} str - Input string that may contain BOM
 * @returns {string} String without BOM
 */
export function removeBOM(str) {
  if (str.charCodeAt(0) === 0xFEFF) {
    return str.slice(1)
  }
  return str
}

/**
 * Safely parse JSON with BOM handling and error recovery
 * @param {string} jsonString - JSON string to parse
 * @returns {Object} Parsed object or error details
 */
export function safeJsonParse(jsonString) {
  try {
    // Validate input
    if (typeof jsonString !== 'string') {
      throw new Error('Input must be a string')
    }
    
    if (jsonString.trim() === '') {
      throw new Error('Empty JSON string')
    }
    
    // Remove BOM if present
    const cleanString = removeBOM(jsonString.trim())
    
    // Try to parse
    return {
      success: true,
      data: JSON.parse(cleanString),
      error: null
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error
    }
  }
}

/**
 * Read file as text with proper encoding handling
 * @param {File} file - File object to read
 * @returns {Promise<string>} File content as string
 */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        // Remove BOM and normalize line endings
        const content = removeBOM(event.target.result)
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
        resolve(content)
      } catch (error) {
        reject(new Error(`Failed to read file: ${error.message}`))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    // Always read as UTF-8
    reader.readAsText(file, 'UTF-8')
  })
}

/**
 * Validate JSON structure
 * @param {string} jsonString - JSON string to validate
 * @returns {Object} Validation result
 */
export function validateJson(jsonString) {
  const result = safeJsonParse(jsonString)
  
  if (!result.success) {
    return {
      valid: false,
      error: result.error.message
    }
  }
  
  // Additional validation for common issues
  const warnings = []
  
  // Check for trailing commas (common issue)
  if (/,\s*[}\]]/.test(jsonString)) {
    warnings.push('Possible trailing comma detected')
  }
  
  // Check for single quotes (should be double)
  if (/'[^']*':/.test(jsonString) || /:\s*'[^']*'/.test(jsonString)) {
    warnings.push('Single quotes detected - JSON requires double quotes')
  }
  
  // Check for undefined values
  if (/:\s*undefined/.test(jsonString)) {
    warnings.push('Undefined values are not valid in JSON')
  }
  
  return {
    valid: true,
    data: result.data,
    warnings
  }
}

/**
 * Format JSON with proper indentation and no BOM
 * @param {Object} obj - Object to stringify
 * @param {number} indent - Number of spaces for indentation
 * @returns {string} Formatted JSON string
 */
export function formatJson(obj, indent = 2) {
  try {
    // Handle circular references
    const seen = new WeakSet()
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]'
        }
        seen.add(value)
      }
      return value
    }, indent)
  } catch (error) {
    throw new Error(`Failed to format JSON: ${error.message}`)
  }
}

/**
 * Convert various file formats to JSON
 * @param {string} content - File content
 * @param {string} type - File type (yaml, xml, etc.)
 * @returns {Promise<Object>} Converted JSON object
 */
export async function convertToJson(content, type) {
  const cleanContent = removeBOM(content)
  
  switch (type) {
    case 'yaml':
    case 'yml':
      // For YAML, we would need to import a YAML parser
      // import yaml from 'js-yaml'
      // return yaml.load(cleanContent)
      throw new Error('YAML parsing not implemented - install js-yaml')
      
    case 'xml':
      // For XML, we would need an XML parser
      throw new Error('XML parsing not implemented')
      
    case 'json':
    default:
      const result = safeJsonParse(cleanContent)
      if (!result.success) {
        throw new Error(result.error.message)
      }
      return result.data
  }
}

/**
 * Detect file type from filename and content
 * @param {string} filename - File name
 * @param {string} content - File content
 * @returns {string} Detected file type
 */
export function detectFileType(filename, content = '') {
  // Check by file extension first
  const ext = filename.split('.').pop().toLowerCase()
  
  // OpenAPI/Swagger
  if (ext === 'json' || ext === 'yaml' || ext === 'yml') {
    if (content.includes('openapi') || content.includes('swagger')) {
      return 'openapi'
    }
  }
  
  // GraphQL
  if (ext === 'graphql' || ext === 'gql') {
    return 'graphql'
  }
  
  // Protocol Buffers
  if (ext === 'proto') {
    return 'protobuf'
  }
  
  // Python
  if (ext === 'py') {
    return 'python'
  }
  
  // JavaScript/TypeScript
  if (ext === 'js' || ext === 'mjs' || ext === 'cjs') {
    return 'javascript'
  }
  if (ext === 'ts' || ext === 'tsx') {
    return 'typescript'
  }
  
  // SQL/Database
  if (ext === 'sql') {
    return 'database'
  }
  
  // Fallback to content detection
  const trimmed = content.trim()
  
  // JSON detection
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    return 'json'
  }
  
  // YAML detection
  if (trimmed.includes('---') || /^\s*\w+:\s/m.test(trimmed)) {
    return 'yaml'
  }
  
  // XML detection
  if (trimmed.startsWith('<?xml') || /<\w+[^>]*>/.test(trimmed)) {
    return 'xml'
  }
  
  return 'unknown'
}

/**
 * Create a Blob with proper UTF-8 encoding (no BOM)
 * @param {string} content - Content to save
 * @param {string} mimeType - MIME type
 * @returns {Blob} Blob object
 */
export function createUtf8Blob(content, mimeType = 'application/json') {
  // Ensure no BOM in content
  const cleanContent = removeBOM(content)
  
  // Create blob with explicit UTF-8 encoding
  return new Blob([cleanContent], {
    type: `${mimeType};charset=utf-8`
  })
}

/**
 * Download content as file with proper encoding
 * @param {string} content - Content to download
 * @param {string} filename - Filename
 * @param {string} mimeType - MIME type
 */
export function downloadFile(content, filename, mimeType = 'application/json') {
  const blob = createUtf8Blob(content, mimeType)
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  
  // Clean up
  URL.revokeObjectURL(url)
}

/**
 * Validate OpenAPI/Swagger specification
 * @param {Object} spec - OpenAPI specification object
 * @returns {Object} Validation result
 */
export function validateOpenApiSpec(spec) {
  const errors = []
  const warnings = []
  
  // Check for required fields
  if (!spec.openapi && !spec.swagger) {
    errors.push('Missing openapi or swagger version field')
  }
  
  // Check OpenAPI version
  if (spec.openapi && !spec.openapi.startsWith('3.')) {
    errors.push(`Unsupported OpenAPI version: ${spec.openapi}`)
  }
  
  if (!spec.info) {
    errors.push('Missing required field: info')
  } else {
    if (!spec.info.title) errors.push('Missing required field: info.title')
    if (!spec.info.version) errors.push('Missing required field: info.version')
  }
  
  if (!spec.paths) {
    errors.push('Missing required field: paths')
  }
  
  // Check for common issues
  if (spec.swagger) {
    warnings.push('Using OpenAPI 2.x (Swagger) - consider upgrading to 3.x')
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes <= 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  const size = bytes / Math.pow(k, i)
  // Always show one decimal place for KB and above
  return (i === 0 ? size : size.toFixed(1)) + ' ' + sizes[i]
}