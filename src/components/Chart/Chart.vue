<template>
  <div class="chart-ui" :style="chartStyle">
    <div v-if="showTypeSwitcher" class="chart-ui__toolbar">
      <button
        v-for="chartType in availableTypes"
        :key="chartType"
        class="chart-ui__type-button"
        :class="{ 'chart-ui__type-button--active': currentType === chartType }"
        type="button"
        @click="setType(chartType)"
      >
        {{ typeLabels[chartType] ?? chartType }}
      </button>
    </div>

    <v-chart class="chart-ui__canvas" :option="chartOption" autoresize @click="emit('pointClick', $event)" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent
} from 'echarts/components'
import type {
  ChartAxisConfig,
  ChartGridConfig,
  ChartLegendPosition,
  ChartOption,
  ChartSeries,
  ChartType
} from './types'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent
])

const props = withDefaults(defineProps<{
  labels: Array<string | number>
  series: ChartSeries[]
  type?: ChartType
  legend?: boolean
  legendPosition?: ChartLegendPosition
  legendSelectable?: boolean
  showTypeSwitcher?: boolean
  availableTypes?: ChartType[]
  height?: number | string
  mobileHeight?: number | string
  yAxes?: ChartAxisConfig[]
  grid?: ChartGridConfig
  boundaryGap?: boolean
  optionOverride?: ChartOption
}>(), {
  type: 'line',
  legend: true,
  legendPosition: 'top',
  legendSelectable: true,
  showTypeSwitcher: false,
  height: 320,
  boundaryGap: false
})

const emit = defineEmits<{
  'update:type': [type: ChartType]
  pointClick: [params: unknown]
}>()

const availableTypes = computed<ChartType[]>(() => props.availableTypes?.length ? props.availableTypes : ['line', 'bar'])
const currentType = ref<ChartType>(props.type)

const typeLabels: Record<ChartType, string> = {
  line: 'Линия',
  bar: 'Столбцы'
}

const palette = [
  '#1677ff',
  '#22c55e',
  '#7c3aed',
  '#f59e0b',
  '#06b6d4',
  '#ef4444',
  '#2563eb',
  '#42b883',
  '#8b5cf6'
]

const chartStyle = computed(() => ({
  '--chart-ui-height': toSizeValue(props.height),
  '--chart-ui-mobile-height': toSizeValue(props.mobileHeight ?? props.height)
}))

const legendOption = computed(() => {
  const base = {
    show: props.legend,
    selectedMode: props.legendSelectable,
    itemWidth: 10,
    itemHeight: 10,
    textStyle: {
      color: '#5f6f89',
      fontSize: 12,
      fontWeight: 700
    }
  }

  if (props.legendPosition === 'bottom') {
    return { ...base, bottom: 0, left: 'center' }
  }

  if (props.legendPosition === 'left') {
    return { ...base, left: 0, top: 'middle', orient: 'vertical' }
  }

  if (props.legendPosition === 'right') {
    return { ...base, right: 0, top: 'middle', orient: 'vertical' }
  }

  return { ...base, top: 0, right: 12 }
})

const gridOption = computed(() => {
  const top = props.legend && props.legendPosition === 'top' ? 42 : 28
  const bottom = props.legend && props.legendPosition === 'bottom' ? 46 : 36
  const left = props.legend && props.legendPosition === 'left' ? 112 : 56
  const right = props.legend && props.legendPosition === 'right' ? 112 : 36

  return {
    left,
    right,
    top,
    bottom,
    containLabel: false,
    ...props.grid
  }
})

const yAxisOption = computed(() => {
  const axes = props.yAxes?.length ? props.yAxes : [{}]

  return axes.map((axis, index) => ({
    type: 'value',
    name: axis.name,
    position: axis.position,
    min: axis.min,
    max: axis.max,
    offset: axis.offset,
    axisLabel: {
      color: '#718096',
      fontSize: 12,
      formatter: axis.formatter
    },
    axisLine: {
      lineStyle: {
        color: '#dce7f5'
      }
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: axis.splitLine ?? index === 0,
      lineStyle: {
        color: '#edf2f7'
      }
    }
  }))
})

const seriesOption = computed(() => {
  return props.series.map((serie, index) => {
    const serieType = serie.type ?? currentType.value
    const color = serie.color ?? palette[index % palette.length]
    const isLine = serieType === 'line'

    return {
      name: serie.name,
      type: serieType,
      yAxisIndex: serie.yAxisIndex ?? 0,
      stack: serie.stack,
      smooth: serie.smooth ?? isLine,
      showSymbol: serie.showSymbol ?? isLine,
      symbol: 'circle',
      symbolSize: serie.symbolSize ?? (index === 0 ? 7 : 6),
      barWidth: serie.barWidth,
      lineStyle: {
        width: serie.lineWidth ?? (index === 0 ? 3 : 2.4),
        type: serie.dashed ? 'dashed' : 'solid',
        color
      },
      itemStyle: {
        color,
        borderRadius: serieType === 'bar' ? [5, 5, 0, 0] : 0
      },
      areaStyle: serie.area && isLine
        ? {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: colorToRgba(color, 0.18) },
              { offset: 1, color: colorToRgba(color, 0.02) }
            ]
          }
        }
        : undefined,
      data: serie.data.map((value) => value ?? null)
    }
  })
})

const chartOption = computed(() => deepMerge({
  color: palette,
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#ffffff',
    borderColor: '#dce7f5',
    borderWidth: 1,
    textStyle: {
      color: '#1f2937',
      fontSize: 12
    },
    axisPointer: {
      lineStyle: {
        color: '#c8d8ee'
      }
    }
  },
  legend: legendOption.value,
  grid: gridOption.value,
  xAxis: {
    type: 'category',
    boundaryGap: props.boundaryGap || currentType.value === 'bar',
    data: props.labels,
    axisLine: {
      lineStyle: {
        color: '#dce7f5'
      }
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#718096',
      fontSize: 12
    }
  },
  yAxis: yAxisOption.value,
  series: seriesOption.value
}, props.optionOverride ?? {}))

watch(() => props.type, (type) => {
  currentType.value = type
})

function setType(type: ChartType) {
  currentType.value = type
  emit('update:type', type)
}

function colorToRgba(color: string, alpha: number) {
  if (!color.startsWith('#')) {
    return color
  }

  const hex = color.slice(1)
  const fullHex = hex.length === 3
    ? hex.split('').map((value) => value + value).join('')
    : hex
  const value = Number.parseInt(fullHex, 16)
  const red = (value >> 16) & 255
  const green = (value >> 8) & 255
  const blue = value & 255

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

function toSizeValue(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function deepMerge(base: ChartOption, override: ChartOption): ChartOption {
  const result: ChartOption = { ...base }

  Object.entries(override).forEach(([key, value]) => {
    const currentValue = result[key]

    if (isRecord(currentValue) && isRecord(value)) {
      result[key] = deepMerge(currentValue, value)
      return
    }

    result[key] = value
  })

  return result
}
</script>

<style scoped>
.chart-ui {
  position: relative;
  display: grid;
  height: var(--chart-ui-height);
  min-width: 0;
}

.chart-ui__canvas {
  width: 100%;
  height: 100%;
  min-height: 0;
}

.chart-ui__toolbar {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: inline-flex;
  gap: 4px;
  padding: 3px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: #ffffff;
}

.chart-ui__type-button {
  height: 26px;
  padding: 0 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--color-muted);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.chart-ui__type-button--active {
  background: #eaf3ff;
  color: var(--color-primary);
}

@media (max-width: 760px) {
  .chart-ui {
    height: var(--chart-ui-mobile-height);
  }
}
</style>
