import { describe, it, expect } from 'vitest'
import { useLoadingState } from '../useLoadingState'

describe('useLoadingState', () => {
  it('initializes with default state', () => {
    const { isLoading, loadingCount } = useLoadingState()
    
    expect(isLoading.value).toBe(false)
    expect(loadingCount.value).toBe(0)
  })

  it('initializes with custom initial state', () => {
    const { isLoading } = useLoadingState(true)
    
    expect(isLoading.value).toBe(true)
  })

  describe('startLoading', () => {
    it('sets loading to true and increments count', () => {
      const { isLoading, loadingCount, startLoading } = useLoadingState()
      
      startLoading()
      
      expect(isLoading.value).toBe(true)
      expect(loadingCount.value).toBe(1)
    })

    it('increments count on multiple calls', () => {
      const { loadingCount, startLoading } = useLoadingState()
      
      startLoading()
      startLoading()
      startLoading()
      
      expect(loadingCount.value).toBe(3)
    })
  })

  describe('stopLoading', () => {
    it('decrements count and sets loading to false when count reaches 0', () => {
      const { isLoading, loadingCount, startLoading, stopLoading } = useLoadingState()
      
      startLoading()
      expect(isLoading.value).toBe(true)
      
      stopLoading()
      
      expect(loadingCount.value).toBe(0)
      expect(isLoading.value).toBe(false)
    })

    it('keeps loading true when count is still positive', () => {
      const { isLoading, loadingCount, startLoading, stopLoading } = useLoadingState()
      
      startLoading()
      startLoading()
      stopLoading()
      
      expect(loadingCount.value).toBe(1)
      expect(isLoading.value).toBe(true)
    })

    it('prevents count from going negative', () => {
      const { loadingCount, stopLoading } = useLoadingState()
      
      stopLoading()
      stopLoading()
      
      expect(loadingCount.value).toBe(0)
    })
  })

  describe('resetLoading', () => {
    it('resets all loading state', () => {
      const { isLoading, loadingCount, startLoading, resetLoading } = useLoadingState()
      
      startLoading()
      startLoading()
      startLoading()
      
      resetLoading()
      
      expect(loadingCount.value).toBe(0)
      expect(isLoading.value).toBe(false)
    })
  })

  describe('withLoading', () => {
    it('wraps async function with loading state', async () => {
      const { isLoading, withLoading } = useLoadingState()
      
      const asyncFn = () => new Promise(resolve => setTimeout(() => resolve('result'), 10))
      
      const promise = withLoading(asyncFn)
      
      // Loading should be true immediately
      expect(isLoading.value).toBe(true)
      
      const result = await promise
      
      // Loading should be false after completion
      expect(isLoading.value).toBe(false)
      expect(result).toBe('result')
    })

    it('handles errors and still stops loading', async () => {
      const { isLoading, withLoading } = useLoadingState()
      
      const asyncFn = () => Promise.reject(new Error('Test error'))
      
      try {
        await withLoading(asyncFn)
      } catch (error) {
        expect(error.message).toBe('Test error')
      }
      
      expect(isLoading.value).toBe(false)
    })

    it('handles synchronous functions', async () => {
      const { isLoading, withLoading } = useLoadingState()
      
      const syncFn = () => 'sync result'
      
      const result = await withLoading(syncFn)
      
      expect(result).toBe('sync result')
      expect(isLoading.value).toBe(false)
    })
  })

  describe('Concurrent loading', () => {
    it('handles multiple concurrent operations correctly', async () => {
      const { isLoading, loadingCount, withLoading } = useLoadingState()
      
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
      
      // Start three concurrent operations
      const promise1 = withLoading(() => delay(10))
      const promise2 = withLoading(() => delay(20))
      const promise3 = withLoading(() => delay(30))
      
      // All should be loading
      expect(isLoading.value).toBe(true)
      expect(loadingCount.value).toBe(3)
      
      // Wait for first to complete
      await promise1
      expect(isLoading.value).toBe(true)
      expect(loadingCount.value).toBe(2)
      
      // Wait for second to complete
      await promise2
      expect(isLoading.value).toBe(true)
      expect(loadingCount.value).toBe(1)
      
      // Wait for last to complete
      await promise3
      expect(isLoading.value).toBe(false)
      expect(loadingCount.value).toBe(0)
    })
  })
})