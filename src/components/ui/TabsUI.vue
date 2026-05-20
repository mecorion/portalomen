<template>
  <div class="ui-tabs" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      class="ui-tabs__item"
      :class="{ 'ui-tabs__item--active': tab.value === modelValue }"
      type="button"
      role="tab"
      :aria-selected="tab.value === modelValue"
      @click="emit('update:modelValue', tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
export type TabsUIItem = {
  label: string
  value: string
}

defineProps<{
  modelValue: string
  tabs: TabsUIItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
