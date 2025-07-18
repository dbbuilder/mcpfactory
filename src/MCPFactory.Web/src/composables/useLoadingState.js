import { ref, computed } from 'vue'

export function useLoadingState(initialState = false) {
  const isLoading = ref(initialState)
  const loadingCount = ref(0)

  const startLoading = () => {
    loadingCount.value++
    isLoading.value = true
  }

  const stopLoading = () => {
    loadingCount.value = Math.max(0, loadingCount.value - 1)
    if (loadingCount.value === 0) {
      isLoading.value = false
    }
  }

  const resetLoading = () => {
    loadingCount.value = 0
    isLoading.value = false
  }

  const withLoading = async (fn) => {
    startLoading()
    try {
      return await fn()
    } finally {
      stopLoading()
    }
  }

  return {
    isLoading: computed(() => isLoading.value),
    loadingCount: computed(() => loadingCount.value),
    startLoading,
    stopLoading,
    resetLoading,
    withLoading
  }
}