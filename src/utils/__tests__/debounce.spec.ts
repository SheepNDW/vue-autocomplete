import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { debounce } from '../debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('should call the callback only once after waiting period', () => {
    const callback = vi.fn()
    const debouncedCallback = debounce(callback, 100)

    debouncedCallback()
    debouncedCallback()
    debouncedCallback()

    expect(callback).not.toBeCalled()

    vi.advanceTimersByTime(50)

    debouncedCallback()

    expect(callback).not.toBeCalled()

    vi.advanceTimersByTime(100)

    expect(callback).toBeCalledTimes(1)
  })

  it('should call the callback with the latest arguments', () => {
    const callback = vi.fn()
    const debouncedCallback = debounce(callback, 100)

    debouncedCallback('foo')
    debouncedCallback('bar')

    vi.advanceTimersByTime(100)

    expect(callback).toBeCalledWith('bar')
  })
})
