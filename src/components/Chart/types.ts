export type ChartType = 'line' | 'bar'
export type ChartLegendPosition = 'top' | 'bottom' | 'left' | 'right'

export type ChartSeries = {
  name: string
  data: Array<number | string | null | undefined>
  type?: ChartType
  color?: string
  yAxisIndex?: number
  smooth?: boolean
  dashed?: boolean
  area?: boolean
  showSymbol?: boolean
  symbolSize?: number
  lineWidth?: number
  barWidth?: number
  stack?: string
}

export type ChartAxisConfig = {
  name?: string
  position?: 'left' | 'right'
  min?: number
  max?: number
  offset?: number
  formatter?: string | ((value: number) => string)
  splitLine?: boolean
}

export type ChartGridConfig = {
  left?: number
  right?: number
  top?: number
  bottom?: number
}

export type ChartOption = Record<string, unknown>
