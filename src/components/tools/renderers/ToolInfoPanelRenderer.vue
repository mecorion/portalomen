<template>
  <div class="tool-info-date">{{ selectedRow?.[component.dateField ?? 'date'] }}</div>

  <div class="tool-info-grid">
    <div v-for="metric in component.metrics" :key="metric.label" class="tool-info-metric">
      <span>{{ metric.label }}</span>
      <strong>{{ formatToolValue(metric.field ? selectedRow?.[metric.field] : undefined, metric.format) }}</strong>
    </div>
  </div>

  <div v-if="component.context?.length" class="tool-info-context">
    <div v-for="item in component.context" :key="item.label">
      <span>{{ item.label }}</span>
      <strong>{{ formatContextValue(item) }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type {
  ToolDataSource,
  ToolInfoMetricConfig,
  ToolInfoPanelComponentConfig
} from '../../../types/toolConfig'
import {
  formatStateValue,
  formatToolValue
} from './toolRendererUtils'

const props = defineProps<{
  component: ToolInfoPanelComponentConfig
  dataSources: Record<string, ToolDataSource>
  state: Record<string, unknown>
}>()

defineEmits<{
  stateChange: [key: string, value: unknown]
}>()

const selectedRow = computed(() => {
  if (!props.component.dataSourceId) {
    return undefined
  }

  const selectedIndex = Number(props.state[props.component.selectedIndexStateKey ?? 'selectedIndex'] ?? 0)
  const rows = props.dataSources[props.component.dataSourceId]?.rows ?? []

  return rows[selectedIndex] ?? rows[0]
})

function formatContextValue(item: ToolInfoMetricConfig): string {
  if (item.stateKey) {
    return formatStateValue(item.stateKey, props.state[item.stateKey])
  }

  return formatToolValue(item.field ? selectedRow.value?.[item.field] : undefined, item.format)
}
</script>
