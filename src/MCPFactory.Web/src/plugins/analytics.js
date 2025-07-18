// Analytics plugin for Vue 3
// Supports multiple analytics providers

export class Analytics {
  constructor(options = {}) {
    this.providers = new Map()
    this.debug = options.debug || false
    this.enabled = options.enabled !== false
    
    // Initialize providers
    if (options.providers) {
      Object.entries(options.providers).forEach(([name, config]) => {
        if (config.enabled !== false) {
          this.addProvider(name, config)
        }
      })
    }
  }

  addProvider(name, config) {
    if (!this.enabled) return

    switch (name) {
      case 'google':
        this.initGoogleAnalytics(config)
        break
      case 'plausible':
        this.initPlausible(config)
        break
      case 'mixpanel':
        this.initMixpanel(config)
        break
      case 'custom':
        this.providers.set(name, config)
        break
      default:
        console.warn(`Unknown analytics provider: ${name}`)
    }
  }

  initGoogleAnalytics(config) {
    if (typeof window === 'undefined' || !config.measurementId) return

    // Load gtag script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    window.gtag = function() {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', config.measurementId, config.options || {})

    this.providers.set('google', {
      track: (event, params) => window.gtag('event', event, params),
      page: (path, params) => window.gtag('event', 'page_view', { page_path: path, ...params })
    })
  }

  initPlausible(config) {
    if (typeof window === 'undefined' || !config.domain) return

    // Load Plausible script
    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.dataset.domain = config.domain
    script.src = config.src || 'https://plausible.io/js/script.js'
    document.head.appendChild(script)

    this.providers.set('plausible', {
      track: (event, params) => {
        if (window.plausible) {
          window.plausible(event, { props: params })
        }
      },
      page: () => {} // Plausible tracks automatically
    })
  }

  initMixpanel(config) {
    if (typeof window === 'undefined' || !config.token) return

    // Mixpanel initialization code would go here
    // Simplified for brevity
    this.providers.set('mixpanel', {
      track: (event, params) => {
        if (window.mixpanel) {
          window.mixpanel.track(event, params)
        }
      },
      page: (path) => {
        if (window.mixpanel) {
          window.mixpanel.track('Page View', { path })
        }
      }
    })
  }

  track(event, params = {}) {
    if (!this.enabled) return

    if (this.debug) {
      console.log('Analytics track:', event, params)
    }

    this.providers.forEach(provider => {
      try {
        provider.track(event, params)
      } catch (error) {
        console.error('Analytics track error:', error)
      }
    })
  }

  page(path, params = {}) {
    if (!this.enabled) return

    if (this.debug) {
      console.log('Analytics page:', path, params)
    }

    this.providers.forEach(provider => {
      try {
        provider.page(path, params)
      } catch (error) {
        console.error('Analytics page error:', error)
      }
    })
  }

  identify(userId, traits = {}) {
    if (!this.enabled) return

    if (this.debug) {
      console.log('Analytics identify:', userId, traits)
    }

    // Implementation for user identification
    this.providers.forEach(provider => {
      if (provider.identify) {
        try {
          provider.identify(userId, traits)
        } catch (error) {
          console.error('Analytics identify error:', error)
        }
      }
    })
  }

  setEnabled(enabled) {
    this.enabled = enabled
  }
}

// Vue plugin
export default {
  install(app, options = {}) {
    const analytics = new Analytics(options)
    
    // Make analytics available globally
    app.config.globalProperties.$analytics = analytics
    app.provide('analytics', analytics)
    
    // Track route changes
    if (options.trackPages !== false) {
      const router = app.config.globalProperties.$router
      if (router) {
        router.afterEach((to) => {
          analytics.page(to.fullPath, {
            title: to.meta.title || document.title,
            ...to.meta.analytics
          })
        })
      }
    }
  }
}