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

type ValidationContext = {
  areaIds: Set<string>
  componentIds: Set<string>
  filterIds: Set<string>
}

const layoutTypes = ['filters-left-main-stack', 'point-filters-chart']
const densities = ['compact', 'comfortable', 'spacious']
const componentTypes = ['filters', 'chart', 'table', 'info-panel']
const filterTypes = ['select', 'dateRange', 'search']
const dataFieldTypes = ['string', 'number', 'date', 'boolean']

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

  const defaultState = isRecord(value.defaultState) ? value.defaultState : undefined

  if (!defaultState) {
    errors.push('defaultState должен быть объектом')
  }

  validateDataSources(value.dataSources, errors)

  const context = createValidationContext()
  validateLayout(value.layout, value.dataSources, context, errors)
  validateDataSourceBindings(value.dataSources, context.filterIds, errors)

  if (defaultState) {
    validateDefaultState(defaultState, context.filterIds, errors)
  }

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

    if (!isRecord(dataSource.fields) || !Object.keys(dataSource.fields).length) {
      errors.push(`${path}.fields должен быть непустым объектом`)
    } else {
      validateDataSourceFields(dataSource.fields, path, errors)
    }

    if (dataSource.filterBy !== undefined && !isStringRecord(dataSource.filterBy)) {
      errors.push(`${path}.filterBy должен быть объектом string -> string`)
    }
  })
}

function validateDataSourceFields(
  fields: Record<string, unknown>,
  path: string,
  errors: string[]
) {
  Object.entries(fields).forEach(([fieldName, fieldConfig]) => {
    const fieldPath = `${path}.fields.${fieldName}`

    if (!fieldName) {
      errors.push(`${path}.fields содержит пустое имя поля`)
    }

    if (!isRecord(fieldConfig)) {
      errors.push(`${fieldPath} должен быть объектом`)
      return
    }

    if (!isOneOf(fieldConfig.type, dataFieldTypes)) {
      errors.push(`${fieldPath}.type должен быть одним из: ${dataFieldTypes.join(', ')}`)
    }

    if (fieldConfig.label !== undefined && typeof fieldConfig.label !== 'string') {
      errors.push(`${fieldPath}.label должен быть строкой`)
    }
  })
}

function validateLayout(
  layout: unknown,
  dataSources: unknown,
  context: ValidationContext,
  errors: string[]
) {
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
    validateArea(area, areaIndex, dataSourceMap, context, errors)
  })
}

function validateArea(
  value: unknown,
  index: number,
  dataSources: Record<string, ToolDataSourceConfig>,
  context: ValidationContext,
  errors: string[]
) {
  const path = `layout.areas[${index}]`

  if (!isRecord(value)) {
    errors.push(`${path} должен быть объектом`)
    return
  }

  requiredString(value, 'id', errors, path)
  registerUniqueString(value.id, context.areaIds, `${path}.id`, 'area.id', errors)

  if (!Array.isArray(value.components)) {
    errors.push(`${path}.components должен быть массивом`)
    return
  }

  value.components.forEach((component, componentIndex) => {
    validateComponent(component, `${path}.components[${componentIndex}]`, dataSources, context, errors)
  })
}

function validateComponent(
  value: unknown,
  path: string,
  dataSources: Record<string, ToolDataSourceConfig>,
  context: ValidationContext,
  errors: string[]
) {
  if (!isRecord(value)) {
    errors.push(`${path} должен быть объектом`)
    return
  }

  requiredString(value, 'id', errors, path)
  registerUniqueString(value.id, context.componentIds, `${path}.id`, 'component.id', errors)

  if (!isOneOf(value.type, componentTypes)) {
    errors.push(`${path}.type должен быть одним из: ${componentTypes.join(', ')}`)
    return
  }

  const component = value as ToolComponentConfig

  if (component.type === 'filters') {
    validateFiltersComponent(component, path, context, errors)
    return
  }

  if (component.type === 'chart') {
    validateDataSourceReference(component.dataSourceId, path, dataSources, errors)
    requiredString(component, 'labelField', errors, path)
    validateDataSourceFieldReference(component.dataSourceId, component.labelField, `${path}.labelField`, dataSources, errors)

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
      validateDataSourceFieldReference(
        component.dataSourceId,
        typeof series.field === 'string' ? series.field : undefined,
        `${path}.chart.series[${index}].field`,
        dataSources,
        errors
      )
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
      validateDataSourceFieldReference(
        component.dataSourceId,
        typeof column.prop === 'string' ? column.prop : undefined,
        `${path}.columns[${index}].prop`,
        dataSources,
        errors
      )
    })

    return
  }

  if (component.type === 'info-panel') {
    if (component.dataSourceId) {
      validateDataSourceReference(component.dataSourceId, path, dataSources, errors)
      validateDataSourceFieldReference(component.dataSourceId, component.dateField, `${path}.dateField`, dataSources, errors)
    }

    if (!Array.isArray(component.metrics) || !component.metrics.length) {
      errors.push(`${path}.metrics должен быть непустым массивом`)
    }

    component.metrics?.forEach((metric, index) => {
      validateInfoMetric(metric, `${path}.metrics[${index}]`, component.dataSourceId, dataSources, errors)
    })

    component.context?.forEach((metric, index) => {
      validateInfoMetric(metric, `${path}.context[${index}]`, component.dataSourceId, dataSources, errors)
    })
  }
}

function validateFiltersComponent(
  component: Extract<ToolComponentConfig, { type: 'filters' }>,
  path: string,
  context: ValidationContext,
  errors: string[]
) {
  if (!Array.isArray(component.fields) || !component.fields.length) {
    errors.push(`${path}.fields должен быть непустым массивом`)
    return
  }

  component.fields.forEach((field, index) => {
    const fieldPath = `${path}.fields[${index}]`

    requiredString(field, 'id', errors, fieldPath)
    registerUniqueString(field.id, context.filterIds, `${fieldPath}.id`, 'filter.id', errors)
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

function validateDataSourceFieldReference(
  dataSourceId: string | undefined,
  fieldName: string | undefined,
  path: string,
  dataSources: Record<string, ToolDataSourceConfig>,
  errors: string[]
) {
  if (!dataSourceId || !fieldName) {
    return
  }

  const dataSource = dataSources[dataSourceId]

  if (!dataSource || !dataSource.fields[fieldName]) {
    errors.push(`${path} ссылается на неизвестное поле dataSource ${dataSourceId}: ${fieldName}`)
  }
}

function validateDataSourceBindings(
  dataSources: unknown,
  filterIds: Set<string>,
  errors: string[]
) {
  if (!isRecord(dataSources)) {
    return
  }

  Object.entries(dataSources).forEach(([dataSourceId, dataSource]) => {
    if (!isRecord(dataSource) || !isStringRecord(dataSource.filterBy)) {
      return
    }

    Object.entries(dataSource.filterBy).forEach(([filterId, fieldName]) => {
      if (!filterIds.has(filterId)) {
        errors.push(`dataSources.${dataSourceId}.filterBy.${filterId} ссылается на неизвестный filter.id`)
      }

      if (!isRecord(dataSource.fields) || !dataSource.fields[fieldName]) {
        errors.push(`dataSources.${dataSourceId}.filterBy.${filterId} ссылается на неизвестное поле: ${fieldName}`)
      }
    })
  })
}

function validateDefaultState(
  defaultState: Record<string, unknown>,
  filterIds: Set<string>,
  errors: string[]
) {
  filterIds.forEach((filterId) => {
    if (!(filterId in defaultState)) {
      errors.push(`defaultState должен содержать значение для filter.id ${filterId}`)
    }
  })
}

function validateInfoMetric(
  metric: unknown,
  path: string,
  dataSourceId: string | undefined,
  dataSources: Record<string, ToolDataSourceConfig>,
  errors: string[]
) {
  if (!isRecord(metric)) {
    errors.push(`${path} должен быть объектом`)
    return
  }

  requiredString(metric, 'label', errors, path)

  if (metric.field !== undefined) {
    validateDataSourceFieldReference(dataSourceId, String(metric.field), `${path}.field`, dataSources, errors)
  }
}

function createValidationContext(): ValidationContext {
  return {
    areaIds: new Set(),
    componentIds: new Set(),
    filterIds: new Set()
  }
}

function registerUniqueString(
  value: unknown,
  values: Set<string>,
  path: string,
  entityName: string,
  errors: string[]
) {
  if (typeof value !== 'string' || !value) {
    return
  }

  if (values.has(value)) {
    errors.push(`${path} должен быть уникальным, повторяется ${entityName}: ${value}`)
    return
  }

  values.add(value)
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
