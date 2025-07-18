import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import analytics from './plugins/analytics'
import monitoring from './plugins/monitoring'
import './assets/css/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Analytics configuration
app.use(analytics, {
  debug: import.meta.env.DEV,
  trackPages: true,
  providers: {
    google: {
      measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
      enabled: !!import.meta.env.VITE_GA_MEASUREMENT_ID
    },
    plausible: {
      domain: import.meta.env.VITE_PLAUSIBLE_DOMAIN,
      enabled: !!import.meta.env.VITE_PLAUSIBLE_DOMAIN
    }
  }
})

// Monitoring configuration
app.use(monitoring, {
  debug: import.meta.env.DEV,
  environment: import.meta.env.MODE,
  providers: {
    sentry: {
      dsn: import.meta.env.VITE_SENTRY_DSN,
      enabled: !!import.meta.env.VITE_SENTRY_DSN,
      tracesSampleRate: 0.1
    }
  }
})

app.mount('#app')