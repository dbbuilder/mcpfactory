import { ref, watch, isRef } from 'vue'
import { useLoadingState } from './useLoadingState'

export function useAsyncData(fetcher, options = {}) {
  const {
    immediate = true,
    watch: watchSource = null,
    transform = (data) => data,
    default: defaultValue = null,
    onError = null,
    retry = 0,
    retryDelay = 1000
  } = options

  const data = ref(defaultValue)
  const error = ref(null)
  const { isLoading, withLoading } = useLoadingState()

  const execute = async (...args) => {
    error.value = null
    let attempts = 0

    const attempt = async () => {
      try {
        const result = await withLoading(() => fetcher(...args))
        data.value = transform(result)
        return result
      } catch (err) {
        if (attempts < retry) {
          attempts++
          await new Promise(resolve => setTimeout(resolve, retryDelay))
          return attempt()
        }
        
        error.value = err
        if (onError) {
          onError(err)
        }
        throw err
      }
    }

    return attempt()
  }

  const refresh = () => execute()

  // Watch for reactive dependencies
  if (watchSource) {
    const sources = Array.isArray(watchSource) ? watchSource : [watchSource]
    watch(
      sources,
      () => {
        if (immediate) {
          execute()
        }
      },
      { immediate }
    )
  } else if (immediate) {
    execute()
  }

  return {
    data,
    error,
    isLoading,
    execute,
    refresh
  }
}