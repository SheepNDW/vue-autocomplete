# vue-autocomplete

An implementation of autocomplete with Vue 3 Composition API. This implementation is based on the tutorial provided on [Run That Line](https://runthatline.com/vue-3-autocomplete-how-to-build-a-reusable-composable/).


## Usage
The `useAutocomplete` function is exposed from the `./src/composables/useAutocomplete.ts` file. This function can be used to fetch data and implement autocomplete functionality in your Vue 3 application. The useAutocomplete function takes two arguments:

- `url`: The URL to fetch the data from.
- `options`: An object containing the following properties:
    - `queryParam`: The name of the query parameter to use when making the request.
    - `transformData`: A function that transforms the data returned from the server.
    - `debounceDuration`: The duration of the debounce period in milliseconds.

```vue
<script setup>
import { useAutocomplete } from './src/composables/useAutocomplete'

const { data, isLoading, hasFailed, fetchSuggestions } = useAutocomplete(
  'https://example.com',
  {
    queryParam: 'q',
    transformData: (data) => {
      // Transform the data as required
    },
    debounceDuration: 1000,
  }
)
</script>

<template>
  <div>
    <!-- Your template code here -->
  </div>
</template>
```

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```
