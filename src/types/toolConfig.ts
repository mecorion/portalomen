import type { ChartAxisConfig, ChartGridConfig, ChartLegendPosition, ChartSeries, ChartType } from '../components/Chart/types'

export type ToolDensity = 'compact' | 'comfortable' | 'spacious'
export type ToolLayoutType = 'filters-left-main-stack' | 'point-filters-chart'
export type ToolComponentType = 'filters' | 'chart' | 'table' | 'info-panel'
export type ToolFilterType = 'select' | 'dateRange' | 'search'

export type ToolConfig = {
  id: string
  slug: string
  title: string
  version: number
  navigation: {
    label: string
    icon: string
    order: number
  }
  persistence: {
    key: string
    state: boolean
    configCache: boolean
  }
  defaultState: Record<string, unknown>
  layout: ToolLayoutConfig
  dataSources: Record<string, ToolDataSource>
}

export type ToolLayoutConfig = {
  type: ToolLayoutType
  density: ToolDensity
  areas: ToolLayoutArea[]
}

export type ToolLayoutArea = {
  id: string
  title?: string
  sticky?: boolean
  components: ToolComponentConfig[]
}

export type ToolComponentConfig =
  | ToolFiltersComponentConfig
  | ToolChartComponentConfig
  | ToolTableComponentConfig
  | ToolInfoPanelComponentConfig

export type ToolFiltersComponentConfig = {
  id: string
  type: 'filters'
  title?: string
  fields: ToolFilterConfig[]
}

export type ToolFilterConfig = {
  id: string
  label: string
  type: ToolFilterType
  placeholder?: string
  options?: Array<{ label: string; value: string }>
  defaultValue?: unknown
}

export type ToolChartComponentConfig = {
  id: string
  type: 'chart'
  title?: string
  dataSourceId: string
  labelField: string
  chart: {
    type?: ChartType
    legend?: boolean
    legendPosition?: ChartLegendPosition
    height?: number
    mobileHeight?: number
    grid?: ChartGridConfig
    yAxes?: ChartAxisConfig[]
    series: ToolChartSeriesConfig[]
  }
}

export type ToolChartSeriesConfig = Omit<ChartSeries, 'data'> & {
  field: string
}

export type ToolTableComponentConfig = {
  id: string
  type: 'table'
  title?: string
  dataSourceId: string
  height?: number
  columns: ToolTableColumnConfig[]
}

export type ToolTableColumnConfig = {
  prop: string
  label: string
  width?: number
  fixed?: boolean
  align?: 'left' | 'center' | 'right'
  format?: 'number' | 'money' | 'percent'
}

export type ToolInfoPanelComponentConfig = {
  id: string
  type: 'info-panel'
  title?: string
  dataSourceId?: string
  selectedIndexStateKey?: string
  dateField?: string
  metrics: ToolInfoMetricConfig[]
  context?: ToolInfoMetricConfig[]
}

export type ToolInfoMetricConfig = {
  label: string
  field?: string
  stateKey?: string
  format?: 'number' | 'money' | 'percent' | 'text'
}

export type ToolDataSource = {
  id: string
  rows: ToolDataRow[]
  filterBy?: Record<string, string>
}

export type ToolDataRow = Record<string, string | number | null>
