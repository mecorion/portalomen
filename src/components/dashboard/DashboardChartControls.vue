<template>
  <div class="ds-chart-controls">
    <div class="ds-metric-buttons">
      <ButtonUI
        v-for="metric in metricOptions"
        :key="metric.value"
        size="sm"
        :variant="dashboardStore.activeMetrics.includes(metric.value) ? 'primary' : 'secondary'"
        @click="toggleMetric(metric.value)"
      >
        {{ metric.label }}
      </ButtonUI>
    </div>

    <SelectUI
      v-model="chartTypeProxy"
      class="ds-chart-type-select"
      :options="chartTypeOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useDashboardStore, type ChartMetric, type ChartType } from '../../stores/dashboardStore'
import ButtonUI from '../ui/ButtonUI.vue'
import SelectUI, { type SelectUIOption } from '../ui/SelectUI.vue'

const dashboardStore = useDashboardStore()

const metricOptions: Array<{ label: string; value: ChartMetric }> = [
  { label: 'Выручка', value: 'revenue' },
  { label: 'Прибыль', value: 'profit' },
  { label: 'Заказы', value: 'orders' }
]

const chartTypeOptions: SelectUIOption[] = [
  { label: 'Линия', value: 'line' },
  { label: 'Столбцы', value: 'bar' }
]

const chartTypeProxy = computed<string>({
  get() {
    return dashboardStore.chartType
  },
  set(value) {
    dashboardStore.setChartType(value as ChartType)
  }
})

function toggleMetric(metric: ChartMetric) {
  const current = dashboardStore.activeMetrics

  if (current.includes(metric)) {
    if (current.length === 1) {
      return
    }

    dashboardStore.setActiveMetrics(current.filter((item) => item !== metric))
    return
  }

  dashboardStore.setActiveMetrics([...current, metric])
}
</script>
