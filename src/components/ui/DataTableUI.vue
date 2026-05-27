<template>
  <el-table
    class="ui-data-table"
    :class="`ui-data-table--${density}`"
    :data="data"
    :height="height"
    :border="border"
    :default-sort="defaultSort"
    :empty-text="emptyText"
  >
    <el-table-column
      v-if="selectable"
      type="selection"
      width="42"
      fixed="left"
    />

    <el-table-column
      v-for="column in columns"
      :key="column.prop"
      :prop="column.prop"
      :label="column.label"
      :width="column.width"
      :min-width="column.minWidth"
      :fixed="column.fixed"
      :sortable="column.sortable"
      :align="column.align"
      :header-align="column.headerAlign ?? column.align"
      :show-overflow-tooltip="column.showOverflowTooltip ?? true"
    >
      <template #default="{ row }">
        <span :class="{ 'ds-number-cell': column.align === 'right' }">
          {{ formatValue(row[column.prop], column.format) }}
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
export type DataTableRow = Record<string, unknown>

export type DataTableColumn = {
  prop: string
  label: string
  width?: number
  minWidth?: number
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  format?: 'number' | 'money' | 'percent' | 'text'
  showOverflowTooltip?: boolean
}

withDefaults(
  defineProps<{
    data: DataTableRow[]
    columns: DataTableColumn[]
    height?: number | string
    border?: boolean
    selectable?: boolean
    density?: 'compact' | 'comfortable'
    defaultSort?: Record<string, unknown>
    emptyText?: string
  }>(),
  {
    height: undefined,
    border: true,
    selectable: false,
    density: 'compact',
    defaultSort: undefined,
    emptyText: 'Нет данных'
  }
)

function formatValue(value: unknown, format?: DataTableColumn['format']): string {
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
    return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(Number(value))}%`
  }

  return String(value)
}
</script>
