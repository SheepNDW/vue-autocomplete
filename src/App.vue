<script setup lang="ts">
import { ref } from 'vue'
import { useAutocomplete } from './composables/useAutocomplete'
import type { PublicApi } from './types'

const { fetchSuggestions, data, isLoading } = useAutocomplete<PublicApi>(
  'https://api.publicapis.org/entries',
  {
    queryParam: 'title',
    transformData: (data: { entries: PublicApi[] }) => data.entries,
    debounceDuration: 500,
  },
)

const searchQuery = ref('')
const selectedItem = ref<PublicApi | null>(null)
const isShowSuggestion = ref(false)

const onInput = () => {
  if (searchQuery.value.length > 2) {
    isShowSuggestion.value = true
    fetchSuggestions(searchQuery.value)
  } else {
    data.value = []
    selectedItem.value = null
  }
}

const onItemClick = (item: PublicApi) => {
  selectedItem.value = item
  isShowSuggestion.value = false
  searchQuery.value = item.API
}
</script>

<template>
  <div class="wrapper">
    <div class="content">
      <h1 class="headline">Search for a public APIs</h1>
      <input
        v-model="searchQuery"
        type="text"
        class="input"
        placeholder="search..."
        @input="onInput"
      >

      <ul v-if="isShowSuggestion" class="list">
        <strong
          v-if="isLoading"
          class="loader"
        >
          Loading...
        </strong>

        <li
          v-for="(item, index) in data"
          :key="index"
        >
          <button class="item" @click="onItemClick(item)">
            {{ item.API }}
          </button>
        </li>
      </ul>

      <div
        v-if="selectedItem"
        class="card"
      >
        <p>
          <strong>{{ selectedItem.API }}</strong>
        </p>

        <p>{{ selectedItem.Description }}</p>

        <p>{{ selectedItem.Link }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .wrapper {
    font-family: 'Courier New', Courier, monospace;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
  }

  .content {
    width: 500px;
    display: flex;
    flex-direction: column;
  }

  .headline {
    text-align: center;
  }

  .input {
    padding: 10px;
    border: 1px solid lightgray;
  }

  .list {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .loader {
    margin-top: 10px;
  }

  .item {
    border: 1px solid lightgray;
    padding: 10px;
    cursor: pointer;
    width: 100%;
    background-color: #fff;
    margin-top: 10px;
  }

  .card {
    margin-top: 10px;
    padding: 20px;
    border: 1px solid lightgray;
    word-wrap: break-word;
  }
</style>
