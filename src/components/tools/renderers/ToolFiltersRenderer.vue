<template>
  <div class="tool-filter-list">
    <template v-for="field in component.fields" :key="field.id">
      <SelectUI
        v-if="field.type === 'select'"
        :model-value="getStringState(state, field.id)"
        :label="field.label"
        :placeholder="field.placeholder"
        :options="field.options ?? []"
        @update:model-value="setState(field.id, $event)"
      />

      <DateRangeUI
        v-else-if="field.type === 'dateRange'"
        :model-value="getDateRangeState(state, field.id)"
        :label="field.label"
        @update:model-value="setState(field.id, $event)"
      />

      <SearchInputUI
        v-else-if="field.type === 'search'"
        :model-value="getStringState(state, field.id)"
        :label="field.label"
        :placeholder="field.placeholder"
        @update:model-value="setState(field.id, $event)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import DateRangeUI from '../../ui/DateRangeUI.vue'
import SearchInputUI from '../../ui/SearchInputUI.vue'
import SelectUI from '../../ui/SelectUI.vue'
import type { ToolFiltersComponentConfig } from '../../../types/toolConfig'
import { getDateRangeState, getStringState } from './toolRendererUtils'

defineProps<{
  component: ToolFiltersComponentConfig
  state: Record<string, unknown>
}>()

const emit = defineEmits<{
  stateChange: [key: string, value: unknown]
}>()

function setState(key: string, value: unknown) {
  emit('stateChange', key, value)
}
</script>
