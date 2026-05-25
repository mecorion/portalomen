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

    <main class="app-content mantica-page">
      <AppTopbar title="Мантика" @export="handleExport" />

      <div class="mantica-workspace">
        <aside class="ui-card mantica-point-panel">
          <div class="mantica-panel-header">
            <h2>Точка графика</h2>
          </div>

          <div class="mantica-point-date">{{ selectedPoint.date }}</div>

          <div class="mantica-point-grid">
            <div class="mantica-point-metric">
              <span>Продажи ГТ</span>
              <strong>{{ formatNumber(selectedPoint.salesGt) }}</strong>
            </div>
            <div class="mantica-point-metric">
              <span>Уровень сервиса</span>
              <strong>{{ selectedPoint.serviceLevel }}%</strong>
            </div>
            <div class="mantica-point-metric">
              <span>Наполненность</span>
              <strong>{{ selectedPoint.fullness }}%</strong>
            </div>
            <div class="mantica-point-metric">
              <span>Цена за ед.</span>
              <strong>{{ formatMoney(selectedPoint.unitPrice) }}</strong>
            </div>
          </div>

          <div class="mantica-point-context">
            <div><span>basic_proc_id</span><strong>{{ filters.basicProcId }}</strong></div>
            <div><span>enrich_proc_id</span><strong>{{ filters.enrichProcId }}</strong></div>
            <div><span>Детализация</span><strong>{{ detailLabel }}</strong></div>
          </div>
        </aside>

        <aside class="ui-card mantica-filters">
          <div class="mantica-panel-header">
            <h2>Фильтры</h2>
            <button class="mantica-icon-button" type="button" aria-label="Фильтры">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              </svg>
            </button>
          </div>

          <div class="mantica-filter-list">
            <SelectUI v-model="filters.basicProcId" label="basic_proc_id" :options="basicProcOptions" />
            <SelectUI v-model="filters.enrichProcId" label="enrich_proc_id" :options="enrichProcOptions" />
            <DateRangeUI v-model="filters.dataPeriod" label="Данные за" />
            <DateRangeUI v-model="filters.analysisPeriod" label="Анализ. период" />
            <SelectUI v-model="filters.group" label="Группы" :options="groupOptions" />
            <SelectUI v-model="filters.category" label="Категории" :options="categoryOptions" />
            <SelectUI v-model="filters.rc" label="РЦ" :options="rcOptions" />
            <SelectUI v-model="filters.storeFormat" label="Формат ТТ" :options="storeFormatOptions" />
            <SelectUI v-model="filters.ka" label="KA" :options="kaOptions" />
            <SelectUI v-model="filters.tp" label="ТП" :options="tpOptions" />
            <SelectUI v-model="filters.detail" label="Детализация" :options="detailOptions" />
            <SelectUI v-model="filters.resultOutput" label="Вывод результата" :options="resultOutputOptions" />
            <SelectUI v-model="filters.exportMode" label="Режим выгрузки" :options="exportModeOptions" />
            <SelectUI v-model="filters.bpCorrection" label="Корректировка БП" :options="bpCorrectionOptions" />
            <SelectUI v-model="filters.aggregationMethod" label="Метод агрегации" :options="aggregationOptions" />
            <SelectUI v-model="filters.regularWeek" label="Обычная неделя" :options="regularWeekOptions" />
          </div>
        </aside>

        <section class="ui-card mantica-chart-card">
          <div class="mantica-panel-header">
            <h2>Продажи, сервис и цена</h2>

            <div class="mantica-legend">
              <span class="mantica-legend-item mantica-legend-item--sales">Продажи ГТ</span>
              <span class="mantica-legend-item mantica-legend-item--service">Сервис / наполненность</span>
              <span class="mantica-legend-item mantica-legend-item--price">Цена</span>
            </div>
          </div>

          <v-chart class="mantica-chart" :option="chartOption" autoresize @click="handleChartClick" />
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
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'

import AppSidebar from '../components/layout/AppSidebar.vue'
import AppTopbar from '../components/layout/AppTopbar.vue'
import DateRangeUI from '../components/ui/DateRangeUI.vue'
import SelectUI, { type SelectUIOption } from '../components/ui/SelectUI.vue'

use([CanvasRenderer, BarChart, LineChart, GridComponent, LegendComponent, TooltipComponent])

type ManticaPoint = {
  date: string
  salesGt: number
  serviceLevel: number
  fullness: number
  unitPrice: number
}

type ChartClickParams = {
  dataIndex?: number
}

const sidebarCollapsed = ref(false)
const mobileSidebarOpen = ref(false)
const selectedIndex = ref(0)

const filters = reactive({
  basicProcId: 'basic-184',
  enrichProcId: 'enrich-642',
  dataPeriod: ['2026-04-18', '2026-06-17'] as [string, string],
  analysisPeriod: ['2026-05-18', '2026-05-25'] as [string, string],
  group: 'all',
  category: 'all',
  rc: 'all',
  storeFormat: 'all',
  ka: 'all',
  tp: 'all',
  detail: 'day',
  resultOutput: 'chart',
  exportMode: 'screen',
  bpCorrection: 'enabled',
  aggregationMethod: 'sum',
  regularWeek: 'yes'
})

const allOption = { label: 'Все', value: 'all' }
const basicProcOptions: SelectUIOption[] = [
  { label: 'basic-184', value: 'basic-184' },
  { label: 'basic-203', value: 'basic-203' }
]
const enrichProcOptions: SelectUIOption[] = [
  { label: 'enrich-642', value: 'enrich-642' },
  { label: 'enrich-711', value: 'enrich-711' }
]
const groupOptions: SelectUIOption[] = [{ label: 'Все группы', value: 'all' }, { label: 'Группа A', value: 'group-a' }, { label: 'Группа B', value: 'group-b' }]
const categoryOptions: SelectUIOption[] = [{ label: 'Все категории', value: 'all' }, { label: 'Категория 1', value: 'cat-1' }, { label: 'Категория 2', value: 'cat-2' }]
const rcOptions: SelectUIOption[] = [allOption, { label: 'РЦ-01', value: 'rc-01' }, { label: 'РЦ-02', value: 'rc-02' }]
const storeFormatOptions: SelectUIOption[] = [allOption, { label: 'Гипермаркет', value: 'hyper' }, { label: 'Дискаунтер', value: 'discount' }]
const kaOptions: SelectUIOption[] = [allOption, { label: 'KA-01', value: 'ka-01' }, { label: 'KA-02', value: 'ka-02' }]
const tpOptions: SelectUIOption[] = [allOption, { label: 'ТП Север', value: 'north' }, { label: 'ТП Юг', value: 'south' }]
const detailOptions: SelectUIOption[] = [
  { label: 'День', value: 'day' },
  { label: 'Неделя', value: 'week' },
  { label: 'Месяц', value: 'month' }
]
const resultOutputOptions: SelectUIOption[] = [
  { label: 'График', value: 'chart' },
  { label: 'Таблица', value: 'table' },
  { label: 'График + таблица', value: 'both' }
]
const exportModeOptions: SelectUIOption[] = [
  { label: 'Экран', value: 'screen' },
  { label: 'CSV', value: 'csv' },
  { label: 'XLSX', value: 'xlsx' }
]
const bpCorrectionOptions: SelectUIOption[] = [
  { label: 'Включена', value: 'enabled' },
  { label: 'Отключена', value: 'disabled' }
]
const aggregationOptions: SelectUIOption[] = [
  { label: 'Сумма', value: 'sum' },
  { label: 'Среднее', value: 'avg' },
  { label: 'Медиана', value: 'median' }
]
const regularWeekOptions: SelectUIOption[] = [
  { label: 'Да', value: 'yes' },
  { label: 'Нет', value: 'no' }
]

const points: ManticaPoint[] = Array.from({ length: 8 }, (_, index) => {
  const day = 18 + index

  return {
    date: `${String(day).padStart(2, '0')}.05.2026`,
    salesGt: 8200 + index * 520 + (index % 3) * 280,
    serviceLevel: 91 + (index % 4) * 1.4 - (index === 5 ? 2.2 : 0),
    fullness: 78 + index * 1.9 + (index % 2) * 1.5,
    unitPrice: 145 + index * 4 + (index % 3) * 3
  }
})

const selectedPoint = computed(() => points[selectedIndex.value] ?? points[0])

const detailLabel = computed(() => {
  return detailOptions.find((option) => option.value === filters.detail)?.label ?? 'День'
})

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#ffffff',
    borderColor: '#dce7f5',
    borderWidth: 1,
    textStyle: { color: '#1f2937', fontSize: 12 }
  },
  legend: { show: false },
  grid: { left: 72, right: 116, top: 28, bottom: 42 },
  xAxis: {
    type: 'category',
    data: points.map((point) => point.date.slice(0, 5)),
    axisTick: { show: false },
    axisLine: { lineStyle: { color: '#dce7f5' } },
    axisLabel: { color: '#718096', fontSize: 12 }
  },
  yAxis: [
    {
      type: 'value',
      name: 'Продажи ГТ',
      position: 'left',
      axisLabel: { color: '#718096', fontSize: 12 },
      splitLine: { lineStyle: { color: '#edf2f7' } }
    },
    {
      type: 'value',
      name: '%',
      position: 'right',
      min: 70,
      max: 100,
      axisLabel: { color: '#718096', formatter: '{value}%' },
      splitLine: { show: false }
    },
    {
      type: 'value',
      name: '₽/ед',
      position: 'right',
      offset: 58,
      axisLabel: { color: '#718096', formatter: '{value}₽' },
      splitLine: { show: false }
    }
  ],
  series: [
    {
      name: 'Продажи ГТ',
      type: 'bar',
      yAxisIndex: 0,
      barWidth: 28,
      itemStyle: { color: '#1677ff', borderRadius: [5, 5, 0, 0] },
      data: points.map((point) => point.salesGt)
    },
    {
      name: 'Уровень сервиса',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      symbolSize: 7,
      lineStyle: { width: 3, color: '#22c55e' },
      itemStyle: { color: '#22c55e' },
      data: points.map((point) => point.serviceLevel)
    },
    {
      name: 'Наполненность',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      symbolSize: 6,
      lineStyle: { width: 2, type: 'dashed', color: '#f59e0b' },
      itemStyle: { color: '#f59e0b' },
      data: points.map((point) => point.fullness)
    },
    {
      name: 'Цена за единицу',
      type: 'line',
      yAxisIndex: 2,
      smooth: true,
      symbolSize: 6,
      lineStyle: { width: 2.5, color: '#7c3aed' },
      itemStyle: { color: '#7c3aed' },
      data: points.map((point) => point.unitPrice)
    }
  ]
}))

function handleChartClick(params: ChartClickParams) {
  if (typeof params.dataIndex === 'number') {
    selectedIndex.value = params.dataIndex
  }
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(Math.round(value))
}

function formatMoney(value: number): string {
  return `${new Intl.NumberFormat('ru-RU').format(Math.round(value))} ₽`
}

function handleExport() {
  // Placeholder for future export integration.
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
.mantica-page {
  padding-top: 18px;
}

.mantica-workspace {
  display: grid;
  grid-template-columns: 220px 310px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
}

.mantica-point-panel,
.mantica-filters,
.mantica-chart-card {
  padding: 14px;
}

.mantica-point-panel,
.mantica-filters {
  position: sticky;
  top: 18px;
  max-height: calc(100vh - 36px);
  overflow: auto;
}

.mantica-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.mantica-panel-header h2 {
  margin: 0;
  color: var(--color-text);
  font-size: 16px;
  font-weight: 800;
}

.mantica-filter-list {
  display: grid;
  gap: 12px;
}

.mantica-point-date {
  margin-bottom: 12px;
  color: var(--color-primary);
  font-size: 20px;
  font-weight: 800;
}

.mantica-point-grid,
.mantica-point-context {
  display: grid;
  gap: 8px;
}

.mantica-point-metric,
.mantica-point-context div {
  display: grid;
  gap: 4px;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: #f8fbff;
}

.mantica-point-metric span,
.mantica-point-context span {
  color: var(--color-muted);
  font-size: 11px;
  font-weight: 800;
}

.mantica-point-metric strong,
.mantica-point-context strong {
  color: var(--color-text);
  font-size: 15px;
  font-weight: 800;
}

.mantica-point-context {
  margin-top: 12px;
}

.mantica-chart {
  width: 100%;
  height: 660px;
}

.mantica-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: #ffffff;
  color: var(--color-text);
  cursor: pointer;
}

.mantica-icon-button:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.mantica-legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.mantica-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-muted);
  font-size: 12px;
  font-weight: 800;
}

.mantica-legend-item::before {
  content: '';
  width: 9px;
  height: 9px;
  border-radius: 999px;
}

.mantica-legend-item--sales::before {
  background: #1677ff;
}

.mantica-legend-item--service::before {
  background: #22c55e;
}

.mantica-legend-item--price::before {
  background: #7c3aed;
}

@media (max-width: 1280px) {
  .mantica-workspace {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .mantica-point-panel {
    grid-column: 1 / -1;
    position: static;
  }

  .mantica-point-grid,
  .mantica-point-context {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .mantica-workspace,
  .mantica-point-grid,
  .mantica-point-context {
    grid-template-columns: 1fr;
  }

  .mantica-filters {
    position: static;
    max-height: none;
  }

  .mantica-chart {
    height: 420px;
  }
}
</style>
