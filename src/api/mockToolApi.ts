import manticaData from '../db/toolData/mantica.data.json'
import poirotData from '../db/toolData/poirot.data.json'
import manticaConfig from '../db/tools/mantica.json'
import poirotConfig from '../db/tools/poirot.json'
import type {
  ToolConfig,
  ToolDataPayload,
  ToolDataSource,
  ToolDataSources
} from '../types/toolConfig'
import { validateToolConfig } from '../types/toolConfigValidation'
import type {
  ToolAccessContext,
  ToolApi,
  ToolCatalogItem
} from './toolApi'

const defaultAccessContext: ToolAccessContext = {
  userId: 'demo-user',
  roles: ['admin']
}

const rawToolConfigs = [poirotConfig, manticaConfig] as unknown[]
const toolDataPayloads = [poirotData, manticaData] as ToolDataPayload[]
const toolConfigEntries = rawToolConfigs.map((rawConfig) => ({
  rawConfig,
  validation: validateToolConfig(rawConfig)
}))
const toolValidationResults = toolConfigEntries.map((entry) => entry.validation)
const toolConfigs = toolValidationResults
  .filter((result) => result.valid)
  .map((result) => result.config)

export const mockToolApi: ToolApi = {
  async listNavigationItems() {
    return [
      {
        label: 'Инструменты',
        path: '/tools',
        icon: 'M4 6h7v7H4V6ZM13 6h7v7h-7V6ZM4 15h7v3H4v-3ZM13 15h7v3h-7v-3Z',
        order: 10
      }
    ]
  },

  async listTools(accessContext = defaultAccessContext) {
    reportInvalidToolConfigs()

    return toolConfigs
      .map((tool) => createToolCatalogItem(tool, accessContext))
      .filter((tool) => tool.access.allowed)
      .sort((left, right) => left.order - right.order)
  },

  async getToolConfig(slug: string, accessContext = defaultAccessContext) {
    const entry = toolConfigEntries.find(({ rawConfig, validation }) => {
      return validation.valid
        ? validation.config.slug === slug
        : getRawToolSlug(rawConfig) === slug
    })

    if (entry && !entry.validation.valid) {
      return {
        status: 'invalid',
        errors: entry.validation.errors
      }
    }

    const tool = toolConfigs.find((config) => config.slug === slug)

    if (!tool) {
      return {
        status: 'not-found',
        errors: []
      }
    }

    if (!canAccessTool(tool, accessContext)) {
      return {
        status: 'forbidden',
        errors: []
      }
    }

    return {
      status: 'success',
      config: structuredClone(tool),
      errors: []
    }
  },

  async getToolDataSources(config: ToolConfig, accessContext = defaultAccessContext) {
    if (!canAccessTool(config, accessContext)) {
      return {
        status: 'forbidden',
        errors: []
      }
    }

    const payload = toolDataPayloads.find((item) => item.slug === config.slug)

    if (!payload) {
      return {
        status: 'not-found',
        errors: []
      }
    }

    const errors = validateToolDataPayload(config, payload)

    if (errors.length) {
      return {
        status: 'invalid',
        errors
      }
    }

    return {
      status: 'success',
      dataSources: mergeDataSourceDefinitions(config, payload),
      errors: []
    }
  }
}

function createToolCatalogItem(
  tool: ToolConfig,
  accessContext: ToolAccessContext
): ToolCatalogItem {
  return {
    id: tool.id,
    slug: tool.slug,
    title: tool.title,
    description: tool.catalog.description,
    icon: tool.navigation.icon,
    accentColor: tool.catalog.accentColor,
    path: `/tools/${tool.slug}`,
    order: tool.navigation.order,
    access: {
      allowed: canAccessTool(tool, accessContext)
    }
  }
}

function reportInvalidToolConfigs() {
  const invalidResults = toolValidationResults.filter((result) => !result.valid)

  if (!invalidResults.length) {
    return
  }

  console.warn('Некорректные конфиги инструментов:', invalidResults.map((result) => result.errors))
}

function validateToolDataPayload(config: ToolConfig, payload: ToolDataPayload): string[] {
  const errors: string[] = []

  Object.keys(config.dataSources).forEach((dataSourceId) => {
    const dataSource = payload.dataSources[dataSourceId]

    if (!dataSource) {
      errors.push(`Для dataSource ${dataSourceId} нет данных`)
      return
    }

    if (!Array.isArray(dataSource.rows)) {
      errors.push(`dataSource ${dataSourceId}.rows должен быть массивом`)
    }
  })

  Object.keys(payload.dataSources).forEach((dataSourceId) => {
    if (!config.dataSources[dataSourceId]) {
      errors.push(`Данные содержат неизвестный dataSource: ${dataSourceId}`)
    }
  })

  return errors
}

function mergeDataSourceDefinitions(config: ToolConfig, payload: ToolDataPayload): ToolDataSources {
  return Object.fromEntries(
    Object.entries(config.dataSources).map(([dataSourceId, sourceConfig]) => {
      const sourceData = payload.dataSources[dataSourceId]
      const dataSource: ToolDataSource = {
        ...sourceConfig,
        rows: sourceData.rows
      }

      return [dataSourceId, dataSource]
    })
  )
}

function canAccessTool(_tool: ToolConfig, accessContext: ToolAccessContext) {
  return accessContext.roles.includes('admin')
}

function getRawToolSlug(value: unknown) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined
  }

  const slug = (value as Record<string, unknown>).slug
  return typeof slug === 'string' ? slug : undefined
}
