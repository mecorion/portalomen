<template>
    <div
        class="app-layout"
        :class="{
            'app-layout--sidebar-collapsed': sidebarCollapsed,
            'app-layout--sidebar-mobile-open': mobileSidebarOpen
        }"
    >
        <button
            class="mobile-sidebar-toggle"
            type="button"
            aria-label="Открыть меню"
            @click="mobileSidebarOpen = true"
        >
            <span></span>
            <span></span>
            <span></span>
        </button>

        <button
            v-if="mobileSidebarOpen"
            class="mobile-sidebar-backdrop"
            type="button"
            aria-label="Закрыть меню"
            @click="mobileSidebarOpen = false"
        ></button>

        <AppSidebar
            :collapsed="sidebarCollapsed"
            :mobile-open="mobileSidebarOpen"
            @close="mobileSidebarOpen = false"
            @toggle="handleSidebarToggle"
        />

        <main class="app-content">
            <AppTopbar title="Дашборд" @export="handleExport" />

            <DashboardFilters />
            <DashboardChartSection />
            <DashboardTable />
        </main>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import { useDashboardStore } from '../../stores/dashboardStore'

import AppSidebar from '../../components/layout/AppSidebar.vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'

import DashboardFilters from '../../components/dashboard/DashboardFilters.vue'
// import DashboardStats from '../../components/dashboard/DashboardStats.vue'
import DashboardChartSection from '../../components/dashboard/DashboardChartSection.vue'
import DashboardTable from '../../components/dashboard/DashboardTable.vue'

import { useCsvExport } from '../../composables/useCsvExport'

const dashboardStore = useDashboardStore()

const { exportToCsv } = useCsvExport()

const sidebarCollapsed = ref(false)
const mobileSidebarOpen = ref(false)

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

function handleSidebarToggle() {
  if (window.matchMedia('(max-width: 760px)').matches) {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
    return
  }

  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<style scoped>
.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 44px;
    padding: 0 12px;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 28px;
}

.logo-icon {
    stroke: #ffffff;
}

.menu {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.menu-item {
    height: 46px;
    border: none;
    border-radius: 10px;
    padding: 0 16px;
    text-align: left;
    background: transparent;
    color: #ffffff;
    font-size: 14px;
    cursor: pointer;
}

.menu-item:hover,
.menu-item.active {
    background: rgba(255, 255, 255, 0.16);
}

.support-card {
    margin-top: auto;
    margin-bottom: 18px;
    padding: 16px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.14);
}

.support-title {
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 8px;
}

.support-text {
    font-size: 13px;
    opacity: 0.9;
    margin-bottom: 14px;
}

.support-button {
    width: 100%;
    height: 36px;
    border: none;
    border-radius: 8px;
    color: #ffffff;
    background: rgba(255, 255, 255, 0.18);
    cursor: pointer;
}

.profile {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
}

.avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.22);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
}

.profile-name {
    font-size: 13px;
    font-weight: 700;
}

.profile-role {
    font-size: 12px;
    opacity: 0.85;
}

.content {
    flex: 1;
    padding: 22px 28px;
    overflow: auto;
}

.topbar {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22px;
}

.topbar h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
}

.topbar-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.icon-button,
.export-button {
    height: 36px;
    border: none;
    border-radius: 9px;
    cursor: pointer;
}

.icon-button {
    width: 36px;
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
}

.export-button {
    padding: 0 18px;
    background: #087cff;
    color: #ffffff;
    font-weight: 600;
}

.table-card {
    padding: 18px 22px;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
}

.section-header h2 {
    margin: 0;
    font-size: 17px;
    font-weight: 700;
}


.table-placeholder {
    height: 360px;
    border-radius: 12px;
    border: 1px dashed #d8e4f2;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #718096;
}

.dashboard-table {
    width: 100%;
    font-size: 13px;
}

.dashboard-table :deep(.el-table__cell) {
    padding: 5px 0;
}

.dashboard-table :deep(.cell) {
    padding: 0 8px;
}

.dashboard-table :deep(.el-input__wrapper),
.dashboard-table :deep(.el-select__wrapper) {
    min-height: 30px;
    border-radius: 7px;
    box-shadow: 0 0 0 1px #dce7f5 inset;
}

.dashboard-table :deep(.el-input-number) {
    width: 100%;
}

.dashboard-table :deep(.el-input-number .el-input__wrapper) {
    width: 100%;
}

.dashboard-table :deep(.el-input-number__increase),
.dashboard-table :deep(.el-input-number__decrease) {
    width: 22px;
}

.dashboard-table :deep(.el-table__header th) {
    background: #f8fbff;
    color: #5f6f89;
    font-weight: 700;
}

.dashboard-table :deep(.el-table__row:hover > td) {
    background: #f5f9ff;
}

.metric-switcher :deep(.el-checkbox-button__inner) {
    padding: 8px 14px;
    font-size: 13px;
}

.number-cell {
    display: block;
    width: 100%;
    text-align: right;
    font-variant-numeric: tabular-nums;
    color: #1f2937;
    font-weight: 600;
}

</style>
