import { watchEffect, isRef } from 'vue'

export function useSEO(options = {}) {
  const updateMeta = () => {
    const title = isRef(options.title) ? options.title.value : options.title
    const description = isRef(options.description) ? options.description.value : options.description
    const keywords = isRef(options.keywords) ? options.keywords.value : options.keywords
    const image = isRef(options.image) ? options.image.value : options.image
    const url = isRef(options.url) ? options.url.value : options.url
    
    // Update title
    if (title) {
      document.title = options.titleTemplate 
        ? options.titleTemplate.replace('%s', title)
        : title
    }
    
    // Update meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    
    // Open Graph tags
    updateMetaTag('og:title', title, 'property')
    updateMetaTag('og:description', description, 'property')
    updateMetaTag('og:image', image, 'property')
    updateMetaTag('og:url', url, 'property')
    updateMetaTag('og:type', options.type || 'website', 'property')
    
    // Twitter Card tags
    updateMetaTag('twitter:card', options.twitterCard || 'summary_large_image', 'name')
    updateMetaTag('twitter:title', title, 'name')
    updateMetaTag('twitter:description', description, 'name')
    updateMetaTag('twitter:image', image, 'name')
    
    // Additional meta tags
    if (options.meta) {
      Object.entries(options.meta).forEach(([key, value]) => {
        updateMetaTag(key, value)
      })
    }
    
    // JSON-LD structured data
    if (options.jsonLd) {
      updateJsonLd(options.jsonLd)
    }
  }
  
  // Watch for reactive changes
  watchEffect(updateMeta)
  
  return {
    updateMeta
  }
}

function updateMetaTag(name, content, attribute = 'name') {
  if (!content) return
  
  let element = document.querySelector(`meta[${attribute}="${name}"]`)
  
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  
  element.setAttribute('content', content)
}

function updateJsonLd(data) {
  let script = document.querySelector('script[type="application/ld+json"]')
  
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  
  script.textContent = JSON.stringify(data)
}

// Helper function to generate common structured data
export function generateStructuredData(type, data) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type
  }
  
  switch (type) {
    case 'Organization':
      return {
        ...baseData,
        name: data.name,
        url: data.url,
        logo: data.logo,
        sameAs: data.socialProfiles || []
      }
      
    case 'SoftwareApplication':
      return {
        ...baseData,
        name: data.name,
        description: data.description,
        applicationCategory: data.category || 'DeveloperApplication',
        operatingSystem: data.os || 'All',
        offers: data.pricing ? {
          '@type': 'Offer',
          price: data.pricing.price,
          priceCurrency: data.pricing.currency || 'USD'
        } : undefined
      }
      
    case 'FAQPage':
      return {
        ...baseData,
        mainEntity: data.questions.map(q => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer
          }
        }))
      }
      
    default:
      return { ...baseData, ...data }
  }
}