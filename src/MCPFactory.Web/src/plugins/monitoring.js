// Error monitoring and performance tracking
// Supports Sentry, LogRocket, and custom monitoring

export class Monitoring {
  constructor(options = {}) {
    this.providers = new Map()
    this.debug = options.debug || false
    this.enabled = options.enabled !== false
    this.environment = options.environment || 'production'
    
    // Initialize providers
    if (options.providers) {
      Object.entries(options.providers).forEach(([name, config]) => {
        if (config.enabled !== false) {
          this.addProvider(name, config)
        }
      })
    }
    
    // Set up global error handler
    if (this.enabled) {
      this.setupGlobalErrorHandler()
    }
  }

  addProvider(name, config) {
    if (!this.enabled) return

    switch (name) {
      case 'sentry':
        this.initSentry(config)
        break
      case 'logrocket':
        this.initLogRocket(config)
        break
      case 'custom':
        this.providers.set(name, config)
        break
      default:
        console.warn(`Unknown monitoring provider: ${name}`)
    }
  }

  initSentry(config) {
    if (typeof window === 'undefined' || !config.dsn) return

    // Dynamically import Sentry
    import('@sentry/vue').then(({ init, vueRouterInstrumentation }) => {
      const options = {
        dsn: config.dsn,
        environment: this.environment,
        integrations: [],
        tracesSampleRate: config.tracesSampleRate || 0.1,
        ...config.options
      }

      // Add Vue Router integration if available
      if (config.router) {
        options.integrations.push(
          vueRouterInstrumentation(config.router)
        )
      }

      init(options)

      this.providers.set('sentry', {
        captureException: (error, context) => {
          import('@sentry/vue').then(({ captureException }) => {
            captureException(error, context)
          })
        },
        captureMessage: (message, level) => {
          import('@sentry/vue').then(({ captureMessage }) => {
            captureMessage(message, level)
          })
        },
        setUser: (user) => {
          import('@sentry/vue').then(({ setUser }) => {
            setUser(user)
          })
        }
      })
    }).catch(err => {
      console.error('Failed to initialize Sentry:', err)
    })
  }

  initLogRocket(config) {
    if (typeof window === 'undefined' || !config.appId) return

    // Dynamically import LogRocket
    import('logrocket').then((LogRocket) => {
      LogRocket.default.init(config.appId, config.options || {})

      this.providers.set('logrocket', {
        captureException: (error) => {
          LogRocket.default.captureException(error)
        },
        captureMessage: (message) => {
          LogRocket.default.captureMessage(message)
        },
        identify: (userId, traits) => {
          LogRocket.default.identify(userId, traits)
        }
      })

      // Integrate with Sentry if both are enabled
      if (this.providers.has('sentry') && config.integrateSentry) {
        LogRocket.default.getSessionURL((sessionURL) => {
          import('@sentry/vue').then(({ configureScope }) => {
            configureScope(scope => {
              scope.setExtra('sessionURL', sessionURL)
            })
          })
        })
      }
    }).catch(err => {
      console.error('Failed to initialize LogRocket:', err)
    })
  }

  setupGlobalErrorHandler() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      this.captureException(new Error(event.reason), {
        tags: { type: 'unhandledRejection' }
      })
    })

    // Handle global errors
    window.addEventListener('error', event => {
      this.captureException(event.error || new Error(event.message), {
        tags: { type: 'globalError' }
      })
    })
  }

  captureException(error, context = {}) {
    if (!this.enabled) return

    if (this.debug) {
      console.error('Monitoring exception:', error, context)
    }

    this.providers.forEach(provider => {
      try {
        provider.captureException(error, context)
      } catch (err) {
        console.error('Failed to capture exception:', err)
      }
    })
  }

  captureMessage(message, level = 'info') {
    if (!this.enabled) return

    if (this.debug) {
      console.log('Monitoring message:', message, level)
    }

    this.providers.forEach(provider => {
      if (provider.captureMessage) {
        try {
          provider.captureMessage(message, level)
        } catch (err) {
          console.error('Failed to capture message:', err)
        }
      }
    })
  }

  setUser(user) {
    if (!this.enabled) return

    this.providers.forEach(provider => {
      if (provider.setUser || provider.identify) {
        try {
          if (provider.setUser) {
            provider.setUser(user)
          } else if (provider.identify) {
            provider.identify(user.id || user.email, user)
          }
        } catch (err) {
          console.error('Failed to set user:', err)
        }
      }
    })
  }

  // Performance monitoring
  trackPerformance(metric, value, tags = {}) {
    if (!this.enabled) return

    if (this.debug) {
      console.log('Performance metric:', metric, value, tags)
    }

    // Send to providers that support custom metrics
    this.providers.forEach(provider => {
      if (provider.trackMetric) {
        try {
          provider.trackMetric(metric, value, tags)
        } catch (err) {
          console.error('Failed to track metric:', err)
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
    const monitoring = new Monitoring({
      ...options,
      router: app.config.globalProperties.$router
    })
    
    // Make monitoring available globally
    app.config.globalProperties.$monitoring = monitoring
    app.provide('monitoring', monitoring)
    
    // Vue error handler
    app.config.errorHandler = (error, instance, info) => {
      monitoring.captureException(error, {
        tags: { source: 'vue' },
        extra: { info, componentName: instance?.$options.name }
      })
    }
    
    // Vue warning handler (development only)
    if (process.env.NODE_ENV !== 'production') {
      app.config.warnHandler = (msg, instance, trace) => {
        monitoring.captureMessage(`Vue warning: ${msg}`, 'warning')
      }
    }
  }
}