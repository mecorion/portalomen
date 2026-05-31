import type {
  ToolConfig,
  ToolDataSources
} from '../types/toolConfig'

export type ToolAccessContext = {
  userId: string
  roles: string[]
}

export type ToolNavigationItem = {
  label: string
  path: string
  icon: string
  order: number
}

export type ToolCatalogItem = {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  accentColor: string
  path: string
  order: number
  access: {
    allowed: boolean
  }
}

export type ToolConfigLoadResult =
  | {
    status: 'success'
    config: ToolConfig
    errors: []
  }
  | {
    status: 'not-found'
    config?: undefined
    errors: []
  }
  | {
    status: 'invalid'
    config?: undefined
    errors: string[]
  }
  | {
    status: 'forbidden'
    config?: undefined
    errors: []
  }

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
  | {
    status: 'forbidden'
    dataSources?: undefined
    errors: []
  }

export type ToolApi = {
  listNavigationItems(): Promise<ToolNavigationItem[]>
  listTools(accessContext?: ToolAccessContext): Promise<ToolCatalogItem[]>
  getToolConfig(slug: string, accessContext?: ToolAccessContext): Promise<ToolConfigLoadResult>
  getToolDataSources(config: ToolConfig, accessContext?: ToolAccessContext): Promise<ToolDataLoadResult>
}
