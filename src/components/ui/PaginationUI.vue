<template>
  <nav class="ui-pagination" aria-label="Pagination">
    <button
      class="ui-pagination__item"
      type="button"
      :disabled="modelValue <= 1"
      @click="go(modelValue - 1)"
    >
      Prev
    </button>

    <button
      v-for="page in pages"
      :key="page"
      class="ui-pagination__item"
      :class="{ 'ui-pagination__item--active': page === modelValue }"
      type="button"
      @click="go(page)"
    >
      {{ page }}
    </button>

    <button
      class="ui-pagination__item"
      type="button"
      :disabled="modelValue >= total"
      @click="go(modelValue + 1)"
    >
      Next
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    total: number
    visiblePages?: number
  }>(),
  {
    visiblePages: 5
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const pages = computed(() => {
  const half = Math.floor(props.visiblePages / 2)
  const start = Math.max(1, Math.min(props.modelValue - half, props.total - props.visiblePages + 1))
  const end = Math.min(props.total, start + props.visiblePages - 1)

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})

function go(page: number) {
  emit('update:modelValue', Math.min(props.total, Math.max(1, page)))
}
</script>
