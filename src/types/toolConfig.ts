import type {
  ToolChartComponentContract,
  ToolChartSeriesContract,
  ToolComponentContract,
  ToolContract,
  ToolDataSourceContract,
  ToolFilterContract,
  ToolFiltersComponentContract,
  ToolInfoMetricContract,
  ToolInfoPanelComponentContract,
  ToolLayoutAreaContract,
  ToolLayoutContract,
  ToolTableColumnContract,
  ToolTableComponentContract
} from './toolContract'

export type {
  ToolComponentType,
  ToolDataFieldContract,
  ToolDataFieldType,
  ToolDensity,
  ToolFilterType,
  ToolLayoutType
} from './toolContract'

export type ToolConfig = ToolContract
export type ToolLayoutConfig = ToolLayoutContract
export type ToolLayoutArea = ToolLayoutAreaContract
export type ToolComponentConfig = ToolComponentContract
export type ToolFiltersComponentConfig = ToolFiltersComponentContract
export type ToolFilterConfig = ToolFilterContract
export type ToolChartComponentConfig = ToolChartComponentContract
export type ToolChartSeriesConfig = ToolChartSeriesContract
export type ToolTableComponentConfig = ToolTableComponentContract
export type ToolTableColumnConfig = ToolTableColumnContract
export type ToolInfoPanelComponentConfig = ToolInfoPanelComponentContract
export type ToolInfoMetricConfig = ToolInfoMetricContract
export type ToolDataSourceConfig = ToolDataSourceContract

export type ToolDataSource = ToolDataSourceConfig & {
  rows: ToolDataRow[]
}

export type ToolDataSources = Record<string, ToolDataSource>

export type ToolDataPayload = {
  slug: string
  dataSources: Record<string, {
    id: string
    rows: ToolDataRow[]
  }>
}

export type ToolDataRow = Record<string, string | number | null>
