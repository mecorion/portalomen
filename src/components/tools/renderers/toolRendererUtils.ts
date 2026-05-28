import type {
  ToolInfoMetricConfig
} from '../../../types/toolConfig'

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
