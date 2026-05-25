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

    <main class="app-content poirot-page">
      <AppTopbar title="Пуаро" @export="handleExport" />

      <div class="poirot-workspace">
        <aside class="poirot-filters ui-card">
          <div class="poirot-panel-header">
            <h2>Фильтры</h2>
            <button class="poirot-icon-button" type="button" aria-label="Фильтры">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <div class="poirot-filter-list">
            <SelectUI v-model="filters.procId" label="proc_id" :options="procOptions" />
            <SelectUI v-model="filters.rc" label="РЦ" :options="rcOptions" />
            <SelectUI v-model="filters.tt" label="ТТ" :options="ttOptions" />
            <SelectUI v-model="filters.group" label="Группа" :options="groupOptions" />
            <SelectUI v-model="filters.position" label="Позиция" :options="positionOptions" />
            <DateRangeUI v-model="filters.period" label="Период" />
          </div>
        </aside>

        <section class="poirot-main">
          <section class="ui-card poirot-chart-card">
            <div class="poirot-panel-header">
              <h2>Динамика показателей</h2>

              <div class="poirot-toolbar">
                <SelectUI v-model="groupBy" class="poirot-group-select" :options="groupByOptions" />
                <button class="poirot-icon-button" type="button" aria-label="Меню">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v.01M12 12v.01M12 19v.01" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            <v-chart class="poirot-chart" :option="chartOption" autoresize />
          </section>

          <section class="ui-card poirot-table-card">
            <div class="poirot-panel-header">
              <h2>Данные</h2>

              <div class="poirot-toolbar">
                <button class="poirot-icon-button" type="button" aria-label="Обновить">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20 12a8 8 0 0 1-13.5 5.8M4 12A8 8 0 0 1 17.5 6.2M18 3v4h-4M6 21v-4h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
                <button class="poirot-icon-button" type="button" aria-label="Фильтр">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                  </svg>
                </button>
                <button class="poirot-icon-button" type="button" aria-label="Скачать">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4v11M8 11l4 4 4-4M5 20h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <el-table
              :data="filteredRows"
              class="poirot-table"
              height="430"
              border
            >
              <el-table-column prop="procId" label="proc_id" width="82" fixed />
              <el-table-column prop="rc" label="РЦ" width="82" fixed />
              <el-table-column prop="tt" label="ТТ" width="92" />
              <el-table-column prop="group" label="Группа" width="110" />
              <el-table-column prop="position" label="Позиция" width="118" />
              <el-table-column prop="date" label="Дата" width="112" />
              <el-table-column v-for="metric in metricColumns" :key="metric.prop" :prop="metric.prop" :label="metric.label" width="126" align="right" header-align="right">
                <template #default="{ row }">
                  <span class="ds-number-cell">{{ formatMetric(row[metric.prop]) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </section>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'

import AppSidebar from '../components/layout/AppSidebar.vue'
import AppTopbar from '../components/layout/AppTopbar.vue'
import DateRangeUI from '../components/ui/DateRangeUI.vue'
import SelectUI, { type SelectUIOption } from '../components/ui/SelectUI.vue'

use([CanvasRenderer, LineChart, GridComponent, LegendComponent, TooltipComponent])

type PoirotRow = {
  procId: string
  rc: string
  tt: string
  group: string
  position: string
  date: string
  metric1: number
  metric2: number
  metric3: number
  metric4: number
  metric5: number
  metric6: number
  metric7?: number
  metric8?: number
  metric9?: number
}

const sidebarCollapsed = ref(false)
const mobileSidebarOpen = ref(false)
const groupBy = ref('day')

const filters = reactive({
  procId: 'all',
  rc: 'all',
  tt: 'all',
  group: 'all',
  position: 'all',
  period: ['2025-05-01', '2025-05-31'] as [string, string]
})

const emptyOption = { label: 'Выберите значение', value: 'all' }
const procOptions: SelectUIOption[] = [emptyOption, { label: '1001', value: '1001' }, { label: '1002', value: '1002' }]
const rcOptions: SelectUIOption[] = [emptyOption, { label: 'РЦ-01', value: 'РЦ-01' }, { label: 'РЦ-02', value: 'РЦ-02' }]
const ttOptions: SelectUIOption[] = [emptyOption, { label: 'ТТ-001', value: 'ТТ-001' }, { label: 'ТТ-002', value: 'ТТ-002' }]
const groupOptions: SelectUIOption[] = [emptyOption, { label: 'Группа A', value: 'Группа A' }, { label: 'Группа B', value: 'Группа B' }]
const positionOptions: SelectUIOption[] = [emptyOption, { label: 'Позиция 1', value: 'Позиция 1' }, { label: 'Позиция 2', value: 'Позиция 2' }]
const groupByOptions: SelectUIOption[] = [
  { label: 'По дням', value: 'day' },
  { label: 'По неделям', value: 'week' },
  { label: 'По месяцам', value: 'month' }
]

const metricColumns = Array.from({ length: 9 }, (_, index) => ({
  prop: `metric${index + 1}` as keyof PoirotRow,
  label: `Показатель ${index + 1}`
}))

const rows: PoirotRow[] = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1
  const date = `${String(day).padStart(2, '0')}.05.2025`
  const procId = day > 18 ? '1002' : '1001'
  const rc = day % 5 === 0 ? 'РЦ-02' : 'РЦ-01'
  const tt = day % 4 === 0 ? 'ТТ-002' : 'ТТ-001'
  const group = day % 6 === 0 ? 'Группа B' : 'Группа A'
  const position = day % 7 === 0 ? 'Позиция 2' : 'Позиция 1'

  return {
    procId,
    rc,
    tt,
    group,
    position,
    date,
    metric1: 2300 + day * 62 + (day % 4) * 55,
    metric2: 1850 + day * 45 + (day % 3) * 40,
    metric3: 950 + day * 30 + (day % 5) * 35,
    metric4: 1200 + day * 36 + (day % 4) * 42,
    metric5: 800 + day * 26 + (day % 3) * 28,
    metric6: 650 + day * 22 + (day % 6) * 24,
    metric7: day > 11 ? 160 + (day - 11) * 45 : undefined,
    metric8: day > 18 ? 180 + (day - 18) * 62 : undefined,
    metric9: day > 25 ? 170 + (day - 25) * 88 : undefined
  }
})

const filteredRows = computed(() => rows.filter((row) => {
  return matches(filters.procId, row.procId)
    && matches(filters.rc, row.rc)
    && matches(filters.tt, row.tt)
    && matches(filters.group, row.group)
    && matches(filters.position, row.position)
}))

const chartOption = computed(() => {
  const palette = ['#1677ff', '#42b883', '#7c3aed', '#f59e0b', '#06b6d4', '#ef4444', '#2563eb', '#22c55e', '#8b5cf6']

  return {
    color: palette,
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: '#dce7f5',
      borderWidth: 1,
      textStyle: { color: '#1f2937', fontSize: 12 }
    },
    legend: { show: false },
    grid: { left: 56, right: 24, top: 26, bottom: 36 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: filteredRows.value.map((row) => row.date.slice(0, 5)),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#dce7f5' } },
      axisLabel: { color: '#718096', fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#718096', fontSize: 12 },
      splitLine: { lineStyle: { color: '#edf2f7' } }
    },
    series: metricColumns.map((metric, index) => ({
      name: metric.label,
      type: 'line',
      smooth: true,
      showSymbol: index < 6,
      symbolSize: 5,
      lineStyle: {
        width: index < 6 ? 2.4 : 2,
        type: index > 5 ? 'dashed' : 'solid'
      },
      data: filteredRows.value.map((row) => row[metric.prop] ?? null)
    }))
  }
})

function matches(filter: string, value: string) {
  return filter === 'all' || filter === value
}

function formatMetric(value: number | undefined): string {
  if (value === undefined) {
    return '-'
  }

  return new Intl.NumberFormat('ru-RU').format(value)
}

function handleExport() {
  // Placeholder for future CSV export integration.
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
.poirot-page {
  padding-top: 18px;
}

.poirot-workspace {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.poirot-filters,
.poirot-chart-card,
.poirot-table-card {
  padding: 16px;
}

.poirot-filters {
  position: sticky;
  top: 18px;
  min-height: calc(100vh - 36px);
}

.poirot-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.poirot-panel-header h2 {
  margin: 0;
  color: var(--color-text);
  font-size: 17px;
  font-weight: 800;
}

.poirot-filter-list {
  display: grid;
  gap: 18px;
}

.poirot-main {
  display: grid;
  gap: 16px;
  min-width: 0;
}

.poirot-chart {
  width: 100%;
  height: 420px;
}

.poirot-table {
  width: 100%;
  font-size: 13px;
}

.poirot-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.poirot-group-select {
  width: 142px;
}

.poirot-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: #ffffff;
  color: var(--color-text);
  cursor: pointer;
}

.poirot-icon-button:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

@media (max-width: 1100px) {
  .poirot-workspace {
    grid-template-columns: 1fr;
  }

  .poirot-filters {
    position: static;
    min-height: 0;
  }

  .poirot-filter-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .poirot-filter-list {
    grid-template-columns: 1fr;
  }

  .poirot-chart {
    height: 320px;
  }
}
</style>
