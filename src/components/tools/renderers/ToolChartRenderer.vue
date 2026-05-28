<template>
  <div class="tool-panel-header">
    <h2>{{ component.title }}</h2>
  </div>

  <Chart
    :type="component.chart.type"
    :labels="chartLabels"
    :series="chartSeries"
    :legend="component.chart.legend"
    :legend-position="component.chart.legendPosition"
    :height="component.chart.height"
    :mobile-height="component.chart.mobileHeight"
    :grid="component.chart.grid"
    :y-axes="component.chart.yAxes"
    @point-click="handlePointClick"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import Chart from '../../Chart/Chart.vue'
import type { ChartSeries } from '../../Chart/types'
import type {
  ToolChartComponentConfig,
  ToolDataSource
} from '../../../types/toolConfig'

const props = defineProps<{
  component: ToolChartComponentConfig
  dataSources: Record<string, ToolDataSource>
  state: Record<string, unknown>
}>()

const emit = defineEmits<{
  stateChange: [key: string, value: unknown]
}>()

const rows = computed(() => getFilteredRows(
  props.component.dataSourceId,
  props.dataSources
))

const chartLabels = computed(() => {
  return rows.value.map((row) => String(row[props.component.labelField] ?? ''))
})

const chartSeries = computed<ChartSeries[]>(() => {
  return props.component.chart.series.map(({ field, ...series }) => ({
    ...series,
    data: rows.value.map((row) => row[field])
  }))
})

function handlePointClick(params: unknown) {
  const point = params as { dataIndex?: number }

  if (typeof point.dataIndex === 'number') {
    emit('stateChange', `${props.component.id}:selectedIndex`, point.dataIndex)
    emit('stateChange', 'selectedPointIndex', point.dataIndex)
  }
}

function getFilteredRows(
  dataSourceId: string,
  dataSources: Record<string, ToolDataSource>
) {
  return dataSources[dataSourceId]?.rows ?? []
}
</script>
