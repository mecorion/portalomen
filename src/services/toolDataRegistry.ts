import manticaData from '../db/toolData/mantica.data.json'
import poirotData from '../db/toolData/poirot.data.json'
import type {
  ToolConfig,
  ToolDataPayload,
  ToolDataSource,
  ToolDataSources
} from '../types/toolConfig'

const toolDataPayloads = [poirotData, manticaData] as ToolDataPayload[]

export type ToolDataLoadResult =
  | {
    status: 'success'
    dataSources: ToolDataSources
    errors: []
  }
  | {
    status: 'not-found'
    dataSources?: undefined
    errors: []
  }
  | {
    status: 'invalid'
    dataSources?: undefined
    errors: string[]
  }

export async function fetchToolDataSources(config: ToolConfig): Promise<ToolDataLoadResult> {
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
