import { ref, onMounted, onUnmounted } from 'vue'

export function useInfiniteScroll(loadMore, options = {}) {
  const {
    distance = 100,
    container = null,
    enabled = true
  } = options

  const isLoading = ref(false)
  const hasMore = ref(true)
  const error = ref(null)

  const handleScroll = async () => {
    if (!enabled || isLoading.value || !hasMore.value) return

    const element = container?.value || window
    const scrollElement = container?.value || document.documentElement

    const scrollTop = element === window 
      ? window.scrollY 
      : element.scrollTop
      
    const scrollHeight = scrollElement.scrollHeight
    const clientHeight = element === window 
      ? window.innerHeight 
      : element.clientHeight

    if (scrollTop + clientHeight >= scrollHeight - distance) {
      isLoading.value = true
      error.value = null

      try {
        const result = await loadMore()
        if (result === false) {
          hasMore.value = false
        }
      } catch (err) {
        error.value = err
      } finally {
        isLoading.value = false
      }
    }
  }

  const reset = () => {
    hasMore.value = true
    error.value = null
    isLoading.value = false
  }

  onMounted(() => {
    const element = container?.value || window
    element.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    const element = container?.value || window
    element.removeEventListener('scroll', handleScroll)
  })

  return {
    isLoading,
    hasMore,
    error,
    reset
  }
}