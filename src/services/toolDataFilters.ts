import type {
  ToolDataRow,
  ToolDataSource,
  ToolDataSources
} from '../types/toolConfig'

const emptyFilterValues = new Set<unknown>([undefined, null, '', 'all'])

export function applyToolDataFilters(
  dataSources: ToolDataSources,
  state: Record<string, unknown>
): ToolDataSources {
  return Object.fromEntries(
    Object.entries(dataSources).map(([dataSourceId, dataSource]) => [
      dataSourceId,
      {
        ...dataSource,
        rows: filterRows(dataSource, state)
      }
    ])
  )
}

function filterRows(
  dataSource: ToolDataSource,
  state: Record<string, unknown>
): ToolDataRow[] {
  const filterBy = dataSource.filterBy ?? {}

  if (!Object.keys(filterBy).length) {
    return dataSource.rows
  }

  return dataSource.rows.filter((row) => {
    return Object.entries(filterBy).every(([stateKey, rowField]) => {
      return matchesFilter(row[rowField], state[stateKey])
    })
  })
}

function matchesFilter(rowValue: ToolDataRow[string], stateValue: unknown): boolean {
  if (emptyFilterValues.has(stateValue)) {
    return true
  }

  if (Array.isArray(stateValue)) {
    return matchesDateRange(rowValue, stateValue)
  }

  return String(rowValue) === String(stateValue)
}

function matchesDateRange(rowValue: ToolDataRow[string], stateValue: unknown[]): boolean {
  const [from, to] = stateValue
  const rowDate = parseToolDate(rowValue)
  const fromDate = parseToolDate(from)
  const toDate = parseToolDate(to)
  const hasRange = Boolean(fromDate || toDate)

  if (!hasRange) {
    return true
  }

  if (!rowDate) {
    return false
  }

  if (fromDate && rowDate < fromDate) {
    return false
  }

  if (toDate && rowDate > toDate) {
    return false
  }

  return true
}

function parseToolDate(value: unknown): number | undefined {
  if (typeof value !== 'string' || !value.trim()) {
    return undefined
  }

  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (isoMatch) {
    return Date.UTC(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]))
  }

  const ruMatch = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)

  if (ruMatch) {
    return Date.UTC(Number(ruMatch[3]), Number(ruMatch[2]) - 1, Number(ruMatch[1]))
  }

  return undefined
}
