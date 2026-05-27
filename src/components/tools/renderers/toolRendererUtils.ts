import type {
  ToolDataRow,
  ToolDataSource,
  ToolInfoMetricConfig
} from '../../../types/toolConfig'

export function getFilteredRows(
  dataSourceId: string,
  dataSources: Record<string, ToolDataSource>,
  state: Record<string, unknown>
): ToolDataRow[] {
  const dataSource = dataSources[dataSourceId]

  if (!dataSource) {
    return []
  }

  const filterBy = dataSource.filterBy ?? {}

  return dataSource.rows.filter((row) => {
    return Object.entries(filterBy).every(([stateKey, rowField]) => {
      const stateValue = state[stateKey]
      return stateValue === undefined || stateValue === '' || stateValue === 'all' || row[rowField] === stateValue
    })
  })
}

export function getStringState(state: Record<string, unknown>, key: string): string {
  return String(state[key] ?? '')
}

export function getDateRangeState(state: Record<string, unknown>, key: string): [string, string] {
  const value = state[key]

  if (!Array.isArray(value)) {
    return ['', '']
  }

  return [String(value[0] ?? ''), String(value[1] ?? '')]
}

export function formatToolValue(value: unknown, format?: ToolInfoMetricConfig['format']): string {
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

export function formatStateValue(key: string, value: unknown): string {
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
