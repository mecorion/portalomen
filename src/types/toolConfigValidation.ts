import type {
  ToolComponentConfig,
  ToolConfig,
  ToolDataSourceConfig
} from './toolConfig'

export type ToolConfigValidationResult =
  | {
    valid: true
    config: ToolConfig
    errors: []
  }
  | {
    valid: false
    config?: undefined
    errors: string[]
  }

const layoutTypes = ['filters-left-main-stack', 'point-filters-chart']
const densities = ['compact', 'comfortable', 'spacious']
const componentTypes = ['filters', 'chart', 'table', 'info-panel']
const filterTypes = ['select', 'dateRange', 'search']

export function validateToolConfig(value: unknown): ToolConfigValidationResult {
  const errors: string[] = []

  if (!isRecord(value)) {
    return {
      valid: false,
      errors: ['config должен быть объектом']
    }
  }

  requiredString(value, 'id', errors)
  requiredString(value, 'slug', errors)
  requiredString(value, 'title', errors)
  requiredNumber(value, 'version', errors)

  validateCatalog(value.catalog, errors)
  validateNavigation(value.navigation, errors)
  validatePersistence(value.persistence, errors)

  if (!isRecord(value.defaultState)) {
    errors.push('defaultState должен быть объектом')
  }

  validateDataSources(value.dataSources, errors)
  validateLayout(value.layout, value.dataSources, errors)

  if (errors.length) {
    return {
      valid: false,
      errors
    }
  }

  return {
    valid: true,
    config: value as ToolConfig,
    errors: []
  }
}

function validateCatalog(value: unknown, errors: string[]) {
  if (!isRecord(value)) {
    errors.push('catalog должен быть объектом')
    return
  }

  requiredString(value, 'description', errors, 'catalog')
  requiredString(value, 'accentColor', errors, 'catalog')
}

function validateNavigation(value: unknown, errors: string[]) {
  if (!isRecord(value)) {
    errors.push('navigation должен быть объектом')
    return
  }

  requiredString(value, 'label', errors, 'navigation')
  requiredString(value, 'icon', errors, 'navigation')
  requiredNumber(value, 'order', errors, 'navigation')
}

function validatePersistence(value: unknown, errors: string[]) {
  if (!isRecord(value)) {
    errors.push('persistence должен быть объектом')
    return
  }

  requiredString(value, 'key', errors, 'persistence')
  requiredBoolean(value, 'state', errors, 'persistence')
  requiredBoolean(value, 'configCache', errors, 'persistence')
}

function validateDataSources(value: unknown, errors: string[]) {
  if (!isRecord(value)) {
    errors.push('dataSources должен быть объектом')
    return
  }

  Object.entries(value).forEach(([id, dataSource]) => {
    const path = `dataSources.${id}`

    if (!isRecord(dataSource)) {
      errors.push(`${path} должен быть объектом`)
      return
    }

    requiredString(dataSource, 'id', errors, path)

    if (dataSource.filterBy !== undefined && !isStringRecord(dataSource.filterBy)) {
      errors.push(`${path}.filterBy должен быть объектом string -> string`)
    }
  })
}

function validateLayout(layout: unknown, dataSources: unknown, errors: string[]) {
  if (!isRecord(layout)) {
    errors.push('layout должен быть объектом')
    return
  }

  if (!isOneOf(layout.type, layoutTypes)) {
    errors.push(`layout.type должен быть одним из: ${layoutTypes.join(', ')}`)
  }

  if (!isOneOf(layout.density, densities)) {
    errors.push(`layout.density должен быть одним из: ${densities.join(', ')}`)
  }

  if (!Array.isArray(layout.areas) || !layout.areas.length) {
    errors.push('layout.areas должен быть непустым массивом')
    return
  }

  const dataSourceMap = isRecord(dataSources) ? dataSources as Record<string, ToolDataSourceConfig> : {}

  layout.areas.forEach((area, areaIndex) => {
    validateArea(area, areaIndex, dataSourceMap, errors)
  })
}

function validateArea(value: unknown, index: number, dataSources: Record<string, ToolDataSourceConfig>, errors: string[]) {
  const path = `layout.areas[${index}]`

  if (!isRecord(value)) {
    errors.push(`${path} должен быть объектом`)
    return
  }

  requiredString(value, 'id', errors, path)

  if (!Array.isArray(value.components)) {
    errors.push(`${path}.components должен быть массивом`)
    return
  }

  value.components.forEach((component, componentIndex) => {
    validateComponent(component, `${path}.components[${componentIndex}]`, dataSources, errors)
  })
}

function validateComponent(
  value: unknown,
  path: string,
  dataSources: Record<string, ToolDataSourceConfig>,
  errors: string[]
) {
  if (!isRecord(value)) {
    errors.push(`${path} должен быть объектом`)
    return
  }

  requiredString(value, 'id', errors, path)

  if (!isOneOf(value.type, componentTypes)) {
    errors.push(`${path}.type должен быть одним из: ${componentTypes.join(', ')}`)
    return
  }

  const component = value as ToolComponentConfig

  if (component.type === 'filters') {
    validateFiltersComponent(component, path, errors)
    return
  }

  if (component.type === 'chart') {
    validateDataSourceReference(component.dataSourceId, path, dataSources, errors)
    requiredString(component, 'labelField', errors, path)

    if (!isRecord(component.chart)) {
      errors.push(`${path}.chart должен быть объектом`)
      return
    }

    if (!Array.isArray(component.chart.series) || !component.chart.series.length) {
      errors.push(`${path}.chart.series должен быть непустым массивом`)
    }

    component.chart.series?.forEach((series, index) => {
      if (!isRecord(series)) {
        errors.push(`${path}.chart.series[${index}] должен быть объектом`)
        return
      }

      requiredString(series, 'name', errors, `${path}.chart.series[${index}]`)
      requiredString(series, 'field', errors, `${path}.chart.series[${index}]`)
    })

    return
  }

  if (component.type === 'table') {
    validateDataSourceReference(component.dataSourceId, path, dataSources, errors)

    if (!Array.isArray(component.columns) || !component.columns.length) {
      errors.push(`${path}.columns должен быть непустым массивом`)
      return
    }

    component.columns.forEach((column, index) => {
      if (!isRecord(column)) {
        errors.push(`${path}.columns[${index}] должен быть объектом`)
        return
      }

      requiredString(column, 'prop', errors, `${path}.columns[${index}]`)
      requiredString(column, 'label', errors, `${path}.columns[${index}]`)
    })

    return
  }

  if (component.type === 'info-panel') {
    if (component.dataSourceId) {
      validateDataSourceReference(component.dataSourceId, path, dataSources, errors)
    }

    if (!Array.isArray(component.metrics) || !component.metrics.length) {
      errors.push(`${path}.metrics должен быть непустым массивом`)
    }
  }
}

function validateFiltersComponent(component: Extract<ToolComponentConfig, { type: 'filters' }>, path: string, errors: string[]) {
  if (!Array.isArray(component.fields) || !component.fields.length) {
    errors.push(`${path}.fields должен быть непустым массивом`)
    return
  }

  component.fields.forEach((field, index) => {
    const fieldPath = `${path}.fields[${index}]`

    requiredString(field, 'id', errors, fieldPath)
    requiredString(field, 'label', errors, fieldPath)

    if (!isOneOf(field.type, filterTypes)) {
      errors.push(`${fieldPath}.type должен быть одним из: ${filterTypes.join(', ')}`)
    }

    if (field.options !== undefined && !Array.isArray(field.options)) {
      errors.push(`${fieldPath}.options должен быть массивом`)
    }
  })
}

function validateDataSourceReference(
  dataSourceId: string | undefined,
  path: string,
  dataSources: Record<string, ToolDataSourceConfig>,
  errors: string[]
) {
  if (!dataSourceId) {
    errors.push(`${path}.dataSourceId обязателен`)
    return
  }

  if (!dataSources[dataSourceId]) {
    errors.push(`${path}.dataSourceId ссылается на неизвестный dataSource: ${dataSourceId}`)
  }
}

function requiredString(value: Record<string, unknown>, key: string, errors: string[], path?: string) {
  if (typeof value[key] !== 'string' || value[key] === '') {
    errors.push(`${fieldPath(key, path)} должен быть непустой строкой`)
  }
}

function requiredNumber(value: Record<string, unknown>, key: string, errors: string[], path?: string) {
  if (typeof value[key] !== 'number') {
    errors.push(`${fieldPath(key, path)} должен быть числом`)
  }
}

function requiredBoolean(value: Record<string, unknown>, key: string, errors: string[], path?: string) {
  if (typeof value[key] !== 'boolean') {
    errors.push(`${fieldPath(key, path)} должен быть boolean`)
  }
}

function fieldPath(key: string, path?: string) {
  return path ? `${path}.${key}` : key
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return isRecord(value)
    && Object.values(value).every((item) => typeof item === 'string')
}

function isOneOf(value: unknown, allowedValues: string[]) {
  return typeof value === 'string' && allowedValues.includes(value)
}
