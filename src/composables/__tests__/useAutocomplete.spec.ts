import { describe, expect, it, vi } from 'vitest'
import { useAutocomplete } from '../useAutocomplete'
import type { PublicApi } from '@/types'

const testResponseData = {
  count: 2,
  entries: [
    {
      API: 'Mocky',
      Description: 'Mock user defined test JSON for REST API endpoints',
      Auth: '',
      HTTPS: true,
      Cors: 'yes',
      Link: 'https://designer.mocky.io/',
      Category: 'Development',
    },
    {
      API: 'BaconMockup',
      Description: 'Resizable bacon placeholder images',
      Auth: '',
      HTTPS: true,
      Cors: 'yes',
      Link: 'https://baconmockup.com/',
      Category: 'Food & Drink',
    },
  ],
}

const testFetch = vi.fn()

vi.stubGlobal('fetch', testFetch)

describe('useAutocomplete', async () => {
  it('should fetch and transform data when fetchSuggestions is called', async () => {
    const query = 'mock'
    const url = 'https://mockurl.com'
    const queryParam = 'q'
    const transformData = (data: { entries: PublicApi[] }) =>
      data.entries.map(entry => ({ label: entry.API, value: entry.Link }))
    testFetch.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        const testResponse = {
          ok: true,
          json() {
            return new Promise((resolve) => {
              resolve(testResponseData)
            })
          },
        }
        resolve(testResponse)
      })
    })
    const { isLoading, hasFailed, data, fetchSuggestions } = useAutocomplete<PublicApi>(url, {
      queryParam,
      transformData,
      debounceDuration: 0,
    })

    await fetchSuggestions(query)

    expect(isLoading.value).toBe(false)
    expect(hasFailed.value).toBe(false)
    expect(data.value).toEqual([
      { label: 'Mocky', value: 'https://designer.mocky.io/' },
      { label: 'BaconMockup', value: 'https://baconmockup.com/' },
    ])
  })

  it('should set hasFailed to true when fetchSuggestions fails', async () => {
    const query = 'mock'
    const url = 'https://mockurl.com'
    const queryParam = 'q'
    const transformData = (data: { entries: PublicApi[] }) =>
      data.entries.map(entry => ({ label: entry.API, value: entry.Link }))
    testFetch.mockImplementationOnce(() => {
      return new Promise((resolve, reject) => {
        reject(new Error('Fetch failed'))
      })
    })
    const { isLoading, hasFailed, data, fetchSuggestions } = useAutocomplete(url, {
      queryParam,
      transformData,
      debounceDuration: 0,
    })

    await fetchSuggestions(query)

    expect(isLoading.value).toBe(false)
    expect(hasFailed.value).toBe(true)
    expect(data.value).toEqual([])
  })

  it('should throw an error if url is invalid', () => {
    const queryParam = 'q'
    const transformData = (data: { entries: PublicApi[] }) =>
      data.entries.map(entry => ({ label: entry.API, value: entry.Link }))
    expect(() => useAutocomplete('invalid_url', { queryParam, transformData })).toThrow(Error)
  })

  it('should throw an error if queryParam is not provided', () => {
    const url = 'https://mockurl.com'
    const transformData = (data: { entries: PublicApi[] }) =>
      data.entries.map(entry => ({ label: entry.API, value: entry.Link }))

    // @ts-expect-error for test case
    expect(() => useAutocomplete(url, { transformData })).toThrow(Error)
  })
})
