import type { ChartAxisConfig, ChartGridConfig, ChartLegendPosition, ChartSeries, ChartType } from '../components/Chart/types'

export type ToolDensity = 'compact' | 'comfortable' | 'spacious'
export type ToolLayoutType = 'filters-left-main-stack' | 'point-filters-chart'
export type ToolComponentType = 'filters' | 'chart' | 'table' | 'info-panel'
export type ToolFilterType = 'select' | 'dateRange' | 'search'
export type ToolDataFieldType = 'string' | 'number' | 'date' | 'boolean'

export type ToolContract = {
  id: string
  slug: string
  title: string
  version: number
  catalog: ToolCatalogContract
  navigation: ToolNavigationContract
  persistence: ToolPersistenceContract
  defaultState: Record<string, unknown>
  layout: ToolLayoutContract
  dataSources: Record<string, ToolDataSourceContract>
}

export type ToolCatalogContract = {
  description: string
  accentColor: string
}

export type ToolNavigationContract = {
  label: string
  icon: string
  order: number
}

export type ToolPersistenceContract = {
  key: string
  state: boolean
  configCache: boolean
}

export type ToolLayoutContract = {
  type: ToolLayoutType
  density: ToolDensity
  areas: ToolLayoutAreaContract[]
}

export type ToolLayoutAreaContract = {
  id: string
  title?: string
  sticky?: boolean
  components: ToolComponentContract[]
}

export type ToolComponentContract =
  | ToolFiltersComponentContract
  | ToolChartComponentContract
  | ToolTableComponentContract
  | ToolInfoPanelComponentContract

export type ToolFiltersComponentContract = {
  id: string
  type: 'filters'
  title?: string
  fields: ToolFilterContract[]
}

export type ToolFilterContract = {
  id: string
  label: string
  type: ToolFilterType
  placeholder?: string
  options?: Array<{ label: string; value: string }>
  defaultValue?: unknown
}

export type ToolChartComponentContract = {
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
    series: ToolChartSeriesContract[]
  }
}

export type ToolChartSeriesContract = Omit<ChartSeries, 'data'> & {
  field: string
}

export type ToolTableComponentContract = {
  id: string
  type: 'table'
  title?: string
  dataSourceId: string
  height?: number
  columns: ToolTableColumnContract[]
}

export type ToolTableColumnContract = {
  prop: string
  label: string
  width?: number
  minWidth?: number
  fixed?: boolean
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  format?: 'number' | 'money' | 'percent'
  showOverflowTooltip?: boolean
}

export type ToolInfoPanelComponentContract = {
  id: string
  type: 'info-panel'
  title?: string
  dataSourceId?: string
  selectedIndexStateKey?: string
  dateField?: string
  metrics: ToolInfoMetricContract[]
  context?: ToolInfoMetricContract[]
}

export type ToolInfoMetricContract = {
  label: string
  field?: string
  stateKey?: string
  format?: 'number' | 'money' | 'percent' | 'text'
}

export type ToolDataSourceContract = {
  id: string
  fields: Record<string, ToolDataFieldContract>
  filterBy?: Record<string, string>
}

export type ToolDataFieldContract = {
  label?: string
  type: ToolDataFieldType
}
