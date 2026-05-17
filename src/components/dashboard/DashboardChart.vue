<template>
  <v-chart class="chart" :option="chartOption" autoresize />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { useDashboardStore } from '../../stores/dashboardStore'

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'

import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  BarChart
])

const dashboardStore = useDashboardStore()

const chartOption = computed(() => {
  const series = []

  if (dashboardStore.activeMetrics.includes('revenue')) {
    series.push({
      name: 'Выручка, ₽',
      type: dashboardStore.chartType,
      smooth: dashboardStore.chartType === 'line',
      yAxisIndex: 0,
      symbol: 'circle',
      symbolSize: 7,
      lineStyle: {
        width: 3,
        color: '#1677ff'
      },
      itemStyle: {
        color: '#1677ff'
      },
      areaStyle: dashboardStore.chartType === 'line'
        ? {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(22, 119, 255, 0.18)' },
              { offset: 1, color: 'rgba(22, 119, 255, 0.02)' }
            ]
          }
        }
        : undefined,
      data: dashboardStore.revenueData
    })
  }

  if (dashboardStore.activeMetrics.includes('profit')) {
    series.push({
      name: 'Прибыль, ₽',
      type: dashboardStore.chartType,
      smooth: dashboardStore.chartType === 'line',
      yAxisIndex: 0,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 2,
        color: '#38bdf8'
      },
      itemStyle: {
        color: '#38bdf8'
      },
      data: dashboardStore.profitData
    })
  }

  if (dashboardStore.activeMetrics.includes('orders')) {
    series.push({
      name: 'Заказы, шт.',
      type: dashboardStore.chartType,
      smooth: dashboardStore.chartType === 'line',
      yAxisIndex: 1,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 2,
        type: 'dashed',
        color: '#6366f1'
      },
      itemStyle: {
        color: '#6366f1'
      },
      data: dashboardStore.ordersData
    })
  }

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: '#dce7f5',
      borderWidth: 1,
      textStyle: {
        color: '#1f2937',
        fontSize: 12
      }
    },

    legend: {
      top: 0,
      right: 12,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: '#5f6f89',
        fontSize: 12
      }
    },

    grid: {
      left: 56,
      right: 36,
      top: 42,
      bottom: 36
    },

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dashboardStore.chartLabels,
      axisLine: {
        lineStyle: {
          color: '#dce7f5'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#718096',
        fontSize: 12
      }
    },

    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: '#718096',
          fontSize: 12
        },
        splitLine: {
          lineStyle: {
            color: '#edf2f7'
          }
        }
      },
      {
        type: 'value',
        axisLabel: {
          color: '#718096',
          fontSize: 12
        },
        splitLine: {
          show: false
        }
      }
    ],

    series
  }
})
</script>

<style scoped>
.chart {
  width: 100%;
  height: 300px;
}
</style>