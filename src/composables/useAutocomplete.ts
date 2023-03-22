import { type Ref, ref } from 'vue'
import { isValidUrl } from '@/utils/isValidUrl'
import { debounce } from '@/utils/debounce'

export interface Options {
  queryParam: string
  transformData?: (data: any) => any
  debounceDuration?: number
}

const DEFAULT_DEBOUNCE_DURATION = 1_000

export function useAutocomplete<T>(
  url: string,
  {
    queryParam,
    transformData = data => data,
    debounceDuration = DEFAULT_DEBOUNCE_DURATION,
  }: Options,
) {
  if (!isValidUrl(url))
    throw new Error(`${url} is not a valid URL!`)

  if (!queryParam)
    throw new Error('\'queryParam\' option is required')

  const isLoading = ref(false)
  const hasFailed = ref(false)
  const data = ref<T[]>([]) as Ref<T[]>

  async function fetchSuggestions(query: string): Promise<void> {
    try {
      isLoading.value = true
      hasFailed.value = false

      const _url = new URL(url)

      _url.search = new URLSearchParams({
        [queryParam]: query,
      }).toString()

      const res = await fetch(_url)
      const resJson = await res.json()
      data.value = transformData(resJson)
    } catch {
      hasFailed.value = true
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    hasFailed,
    data,
    fetchSuggestions: debounce(fetchSuggestions, debounceDuration),
  }
}
