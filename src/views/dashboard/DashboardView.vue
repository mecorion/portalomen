<template>
    <AppShellLayout title="Дашборд" @export="handleExport">
        <DashboardFilters />
        <DashboardChartSection />
        <DashboardTable />
    </AppShellLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import {
  useDashboardStore,
  type ChartMetric,
  type ChartType,
  type DashboardFilters as DashboardFiltersState
} from '../../stores/dashboardStore'

import AppShellLayout from '../../components/layout/AppShellLayout.vue'

import DashboardFilters from '../../components/dashboard/DashboardFilters.vue'
import DashboardChartSection from '../../components/dashboard/DashboardChartSection.vue'
import DashboardTable from '../../components/dashboard/DashboardTable.vue'

import { useCsvExport } from '../../composables/useCsvExport'
import { usePersistedState } from '../../composables/usePersistedState'

const dashboardStore = useDashboardStore()

const { exportToCsv } = useCsvExport()

type DashboardPersistedState = {
  filters: DashboardFiltersState
  activeMetrics: ChartMetric[]
  chartType: ChartType
}

usePersistedState<DashboardPersistedState>({
  key: 'dashboard-state',
  version: 1,
  source: computed(() => ({
    filters: dashboardStore.filters,
    activeMetrics: dashboardStore.activeMetrics,
    chartType: dashboardStore.chartType
  })),
  restore(state) {
    if (state.filters) {
      dashboardStore.filters = state.filters
    }

    if (state.activeMetrics) {
      dashboardStore.activeMetrics = state.activeMetrics
    }

    if (state.chartType) {
      dashboardStore.chartType = state.chartType
    }
  }
})

function handleExport() {
  const headers = [
    'Дата',
    'Выручка',
    'Прибыль',
    'Заказы',
    'Средний чек',
    'Конверсия',
    'Категория',
    'Регион'
  ]

  const rows = dashboardStore.groupedRows.map((row) => [
    row.date,
    row.revenue,
    row.profit,
    row.orders,
    row.averageCheck,
    row.conversion,
    row.category,
    row.region
  ])

  exportToCsv('dashboard-export.csv', headers, rows)
}

</script>
