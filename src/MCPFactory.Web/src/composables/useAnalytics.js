import { inject } from 'vue'

export function useAnalytics() {
  const analytics = inject('analytics')
  
  if (!analytics) {
    console.warn('Analytics not installed. Please install the analytics plugin.')
    return {
      track: () => {},
      page: () => {},
      identify: () => {}
    }
  }
  
  return {
    track: (event, params) => analytics.track(event, params),
    page: (path, params) => analytics.page(path, params),
    identify: (userId, traits) => analytics.identify(userId, traits)
  }
}