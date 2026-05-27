<template>
  <div
    class="tool-component"
    :class="{ 'ui-card': component.type === 'chart' || component.type === 'table' }"
  >
    <template v-if="component.type === 'filters'">
      <div class="tool-filter-list">
        <template v-for="field in component.fields" :key="field.id">
          <SelectUI
            v-if="field.type === 'select'"
            :model-value="stringState(field.id)"
            :label="field.label"
            :placeholder="field.placeholder"
            :options="field.options ?? []"
            @update:model-value="setState(field.id, $event)"
          />

          <DateRangeUI
            v-else-if="field.type === 'dateRange'"
            :model-value="dateRangeState(field.id)"
            :label="field.label"
            @update:model-value="setState(field.id, $event)"
          />

          <SearchInputUI
            v-else-if="field.type === 'search'"
            :model-value="stringState(field.id)"
            :label="field.label"
            :placeholder="field.placeholder"
            @update:model-value="setState(field.id, $event)"
          />
        </template>
      </div>
    </template>

    <template v-else-if="component.type === 'chart'">
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

    <template v-else-if="component.type === 'table'">
      <div class="tool-panel-header">
        <h2>{{ component.title }}</h2>

        <div class="tool-toolbar">
          <button class="tool-icon-button" type="button" aria-label="Обновить">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M20 12a8 8 0 0 1-13.5 5.8M4 12A8 8 0 0 1 17.5 6.2M18 3v4h-4M6 21v-4h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button class="tool-icon-button" type="button" aria-label="Фильтр">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
            </svg>
          </button>
          <button class="tool-icon-button" type="button" aria-label="Скачать">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v11M8 11l4 4 4-4M5 20h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <el-table :data="rows" class="tool-table" :height="component.height ?? 430" border>
        <el-table-column
          v-for="column in component.columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :fixed="column.fixed"
          :align="column.align"
          :header-align="column.align"
        >
          <template #default="{ row }">
            <span :class="{ 'ds-number-cell': column.align === 'right' }">
              {{ formatValue(row[column.prop], column.format) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <template v-else-if="component.type === 'info-panel'">
      <div class="tool-info-date">{{ selectedRow?.[component.dateField ?? 'date'] }}</div>

      <div class="tool-info-grid">
        <div v-for="metric in component.metrics" :key="metric.label" class="tool-info-metric">
          <span>{{ metric.label }}</span>
          <strong>{{ formatValue(metric.field ? selectedRow?.[metric.field] : undefined, metric.format) }}</strong>
        </div>
      </div>

      <div v-if="component.context?.length" class="tool-info-context">
        <div v-for="item in component.context" :key="item.label">
          <span>{{ item.label }}</span>
          <strong>{{ formatContextValue(item) }}</strong>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import Chart from '../Chart/Chart.vue'
import DateRangeUI from '../ui/DateRangeUI.vue'
import SearchInputUI from '../ui/SearchInputUI.vue'
import SelectUI from '../ui/SelectUI.vue'
import type { ChartSeries } from '../Chart/types'
import type {
  ToolComponentConfig,
  ToolDataSource,
  ToolDataRow,
  ToolInfoMetricConfig,
  ToolTableColumnConfig
} from '../../types/toolConfig'

const props = defineProps<{
  component: ToolComponentConfig
  dataSources: Record<string, ToolDataSource>
  state: Record<string, unknown>
}>()

const emit = defineEmits<{
  stateChange: [key: string, value: unknown]
}>()

const rows = computed(() => {
  const component = props.component

  if (component.type !== 'chart' && component.type !== 'table') {
    return []
  }

  return getFilteredRows(component.dataSourceId)
})

const chartLabels = computed(() => {
  const component = props.component

  if (component.type !== 'chart') {
    return []
  }

  return rows.value.map((row) => String(row[component.labelField] ?? ''))
})

const chartSeries = computed<ChartSeries[]>(() => {
  if (props.component.type !== 'chart') {
    return []
  }

  return props.component.chart.series.map(({ field, ...series }) => ({
    ...series,
    data: rows.value.map((row) => row[field])
  }))
})

const selectedRow = computed(() => {
  if (props.component.type !== 'info-panel' || !props.component.dataSourceId) {
    return undefined
  }

  const selectedIndex = Number(props.state[props.component.selectedIndexStateKey ?? 'selectedIndex'] ?? 0)
  return getFilteredRows(props.component.dataSourceId)[selectedIndex] ?? getFilteredRows(props.component.dataSourceId)[0]
})

function getFilteredRows(dataSourceId: string): ToolDataRow[] {
  const dataSource = props.dataSources[dataSourceId]

  if (!dataSource) {
    return []
  }

  const filterBy = dataSource.filterBy ?? {}

  return dataSource.rows.filter((row) => {
    return Object.entries(filterBy).every(([stateKey, rowField]) => {
      const stateValue = props.state[stateKey]
      return stateValue === undefined || stateValue === '' || stateValue === 'all' || row[rowField] === stateValue
    })
  })
}

function stringState(key: string): string {
  return String(props.state[key] ?? '')
}

function dateRangeState(key: string): [string, string] {
  const value = props.state[key]

  if (!Array.isArray(value)) {
    return ['', '']
  }

  return [String(value[0] ?? ''), String(value[1] ?? '')]
}

function setState(key: string, value: unknown) {
  emit('stateChange', key, value)
}

function handlePointClick(params: unknown) {
  if (props.component.type !== 'chart') {
    return
  }

  const point = params as { dataIndex?: number }

  if (typeof point.dataIndex === 'number') {
    emit('stateChange', `${props.component.id}:selectedIndex`, point.dataIndex)
    emit('stateChange', 'selectedPointIndex', point.dataIndex)
  }
}

function formatContextValue(item: ToolInfoMetricConfig): string {
  if (item.stateKey) {
    return formatStateValue(item.stateKey, props.state[item.stateKey])
  }

  return formatValue(item.field ? selectedRow.value?.[item.field] : undefined, item.format)
}

function formatStateValue(key: string, value: unknown): string {
  if (key === 'detail') {
    const labels: Record<string, string> = {
      day: 'День',
      week: 'Неделя',
      month: 'Месяц'
    }

    return labels[String(value)] ?? String(value ?? '-')
  }

  return String(value ?? '-')
}

function formatValue(value: unknown, format?: ToolTableColumnConfig['format'] | ToolInfoMetricConfig['format']): string {
  if (value === undefined || value === null || value === '') {
    return '-'
  }

  if (format === 'number') {
    return new Intl.NumberFormat('ru-RU').format(Number(value))
  }

  if (format === 'money') {
    return `${new Intl.NumberFormat('ru-RU').format(Math.round(Number(value)))} ₽`
  }

  if (format === 'percent') {
    return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(Number(value))}%`
  }

  return String(value)
}
</script>
