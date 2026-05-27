<template>
    <AppShellLayout title="Дашборд" @export="handleExport">
        <DashboardFilters />
        <DashboardChartSection />
        <DashboardTable />
    </AppShellLayout>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'

import { useDashboardStore } from '../../stores/dashboardStore'

import AppShellLayout from '../../components/layout/AppShellLayout.vue'

import DashboardFilters from '../../components/dashboard/DashboardFilters.vue'
import DashboardChartSection from '../../components/dashboard/DashboardChartSection.vue'
import DashboardTable from '../../components/dashboard/DashboardTable.vue'

import { useCsvExport } from '../../composables/useCsvExport'

const dashboardStore = useDashboardStore()

const { exportToCsv } = useCsvExport()

onMounted(() => {
  dashboardStore.loadState()
})

watch(
  () => dashboardStore.filters,
  () => {
    dashboardStore.saveState()
  },
  {
    deep: true
  }
)

watch(
  () => dashboardStore.activeMetrics,
  () => {
    dashboardStore.saveState()
  },
  {
    deep: true
  }
)

watch(
  () => dashboardStore.chartType,
  () => {
    dashboardStore.saveState()
  }
)

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
