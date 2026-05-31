import { mockToolApi } from '../api'
import type {
  ToolCatalogItem,
  ToolConfigLoadResult,
  ToolNavigationItem
} from '../api'

export type {
  ToolCatalogItem,
  ToolConfigLoadResult,
  ToolNavigationItem
} from '../api'

export async function getToolNavigationItems(): Promise<ToolNavigationItem[]> {
  return mockToolApi.listNavigationItems()
}

export async function fetchToolCatalog(): Promise<ToolCatalogItem[]> {
  return mockToolApi.listTools()
}

export async function fetchToolConfig(slug: string): Promise<ToolConfigLoadResult> {
  const result = await mockToolApi.getToolConfig(slug)

  if (result.status === 'success' && result.config.persistence.configCache) {
    localStorage.setItem(`${result.config.persistence.key}:config`, JSON.stringify(result.config))
  }

  return result
}
