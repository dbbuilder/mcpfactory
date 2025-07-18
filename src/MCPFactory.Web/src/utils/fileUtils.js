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
    // Remove BOM if present
    const cleanString = removeBOM(jsonString.trim())
    
    // Try to parse
    return {
      success: true,
      data: JSON.parse(cleanString)
    }
  } catch (error) {
    // Try to extract line and column from error
    const match = error.message.match(/position (\d+)/)
    const position = match ? parseInt(match[1]) : null
    
    // Try to find the problematic line
    let line = null
    let column = null
    if (position !== null) {
      const lines = jsonString.split('\n')
      let currentPosition = 0
      for (let i = 0; i < lines.length; i++) {
        if (currentPosition + lines[i].length >= position) {
          line = i + 1
          column = position - currentPosition
          break
        }
        currentPosition += lines[i].length + 1 // +1 for newline
      }
    }
    
    return {
      success: false,
      error: {
        message: error.message,
        line,
        column,
        position
      }
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
      error: result.error
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
    return JSON.stringify(obj, null, indent)
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
 * Detect file type from content
 * @param {string} content - File content
 * @returns {string} Detected file type
 */
export function detectFileType(content) {
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
  
  if (!spec.info) {
    errors.push('Missing required info object')
  } else {
    if (!spec.info.title) errors.push('Missing info.title')
    if (!spec.info.version) errors.push('Missing info.version')
  }
  
  if (!spec.paths) {
    errors.push('Missing required paths object')
  }
  
  // Check for common issues
  if (spec.openapi && spec.openapi.startsWith('2.')) {
    warnings.push('Using OpenAPI 2.x (Swagger) - consider upgrading to 3.x')
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}