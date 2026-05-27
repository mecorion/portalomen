<template>
  <Chart
    :type="dashboardStore.chartType"
    :labels="dashboardStore.chartLabels"
    :series="chartSeries"
    :y-axes="yAxes"
    :height="300"
    legend
    legend-position="top"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Chart from '../Chart/Chart.vue'
import type { ChartSeries } from '../Chart/types'
import { useDashboardStore } from '../../stores/dashboardStore'

const dashboardStore = useDashboardStore()

const yAxes = [
  {},
  {
    splitLine: false
  }
]

const chartSeries = computed<ChartSeries[]>(() => {
  const series: ChartSeries[] = []

  if (dashboardStore.activeMetrics.includes('revenue')) {
    series.push({
      name: 'Выручка, ₽',
      data: dashboardStore.revenueData,
      color: '#1677ff',
      area: dashboardStore.chartType === 'line',
      lineWidth: 3,
      symbolSize: 7
    })
  }

  if (dashboardStore.activeMetrics.includes('profit')) {
    series.push({
      name: 'Прибыль, ₽',
      data: dashboardStore.profitData,
      color: '#06b6d4',
      lineWidth: 2.4,
      symbolSize: 6
    })
  }

  if (dashboardStore.activeMetrics.includes('orders')) {
    series.push({
      name: 'Заказы, шт.',
      data: dashboardStore.ordersData,
      color: '#7c3aed',
      yAxisIndex: 1,
      dashed: true,
      lineWidth: 2.4,
      symbolSize: 6
    })
  }

  return series
})
</script>
