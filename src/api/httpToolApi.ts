import type {
  ToolConfig,
  ToolDataPayload,
  ToolDataSource,
  ToolDataSources
} from '../types/toolConfig'
import { createApiClient } from './client'
import type {
  ToolAccessContext,
  ToolApi,
  ToolCatalogItem,
  ToolConfigLoadResult,
  ToolDataLoadResult,
  ToolNavigationItem
} from './toolApi'

type ApiEnvelope<T> = {
  data: T
}

export type HttpToolApiOptions = {
  baseUrl: string
}

export function createHttpToolApi(options: HttpToolApiOptions): ToolApi {
  const client = createApiClient({
    baseUrl: options.baseUrl
  })

  return {
    async listNavigationItems(): Promise<ToolNavigationItem[]> {
      return [
        {
          label: 'Инструменты',
          path: '/tools',
          icon: 'M4 6h7v7H4V6ZM13 6h7v7h-7V6ZM4 15h7v3H4v-3ZM13 15h7v3h-7v-3Z',
          order: 10
        }
      ]
    },

    async listTools(_accessContext?: ToolAccessContext): Promise<ToolCatalogItem[]> {
      const result = await client.get<ApiEnvelope<ToolCatalogItem[]>>('/api/tools')

      if (result.status === 'error') {
        console.warn('Не удалось загрузить каталог инструментов:', result.error)
        return []
      }

      return result.data.data
    },

    async getToolConfig(slug: string, _accessContext?: ToolAccessContext): Promise<ToolConfigLoadResult> {
      const result = await client.get<ApiEnvelope<ToolConfig>>(`/api/tools/${slug}`)

      if (result.status === 'error') {
        if (result.error.status === 404) {
          return {
            status: 'not-found',
            errors: []
          }
        }

        if (result.error.status === 403) {
          return {
            status: 'forbidden',
            errors: []
          }
        }

        return {
          status: 'invalid',
          errors: [result.error.message]
        }
      }

      return {
        status: 'success',
        config: result.data.data,
        errors: []
      }
    },

    async getToolDataSources(
      config: ToolConfig,
      _accessContext?: ToolAccessContext
    ): Promise<ToolDataLoadResult> {
      const result = await client.get<ApiEnvelope<ToolDataPayload>>(`/api/tools/${config.slug}/data`)

      if (result.status === 'error') {
        if (result.error.status === 404) {
          return {
            status: 'not-found',
            errors: []
          }
        }

        if (result.error.status === 403) {
          return {
            status: 'forbidden',
            errors: []
          }
        }

        return {
          status: 'invalid',
          errors: [result.error.message]
        }
      }

      return {
        status: 'success',
        dataSources: mergeDataSourceDefinitions(config, result.data.data),
        errors: []
      }
    }
  }
}

function mergeDataSourceDefinitions(config: ToolConfig, payload: ToolDataPayload): ToolDataSources {
  return Object.fromEntries(
    Object.entries(config.dataSources).map(([dataSourceId, sourceConfig]) => {
      const sourceData = payload.dataSources[dataSourceId]
      const dataSource: ToolDataSource = {
        ...sourceConfig,
        rows: sourceData?.rows ?? []
      }

      return [dataSourceId, dataSource]
    })
  )
}
