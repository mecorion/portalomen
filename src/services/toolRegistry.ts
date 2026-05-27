import manticaConfig from '../db/tools/mantica.json'
import poirotConfig from '../db/tools/poirot.json'
import type { ToolConfig } from '../types/toolConfig'

const toolConfigs = [poirotConfig, manticaConfig] as ToolConfig[]

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
}

export function getToolNavigationItems(): ToolNavigationItem[] {
  return [
    {
      label: 'Инструменты',
      path: '/tools',
      icon: 'M4 6h7v7H4V6ZM13 6h7v7h-7V6ZM4 15h7v3H4v-3ZM13 15h7v3h-7v-3Z',
      order: 10
    }
  ]
}

export async function fetchToolCatalog(): Promise<ToolCatalogItem[]> {
  return toolConfigs
    .map((tool) => ({
      id: tool.id,
      slug: tool.slug,
      title: tool.title,
      description: tool.catalog.description,
      icon: tool.navigation.icon,
      accentColor: tool.catalog.accentColor,
      path: `/tools/${tool.slug}`,
      order: tool.navigation.order
    }))
    .sort((left, right) => left.order - right.order)
}

export async function fetchToolConfig(slug: string): Promise<ToolConfig | undefined> {
  const tool = toolConfigs.find((config) => config.slug === slug)

  if (!tool) {
    return undefined
  }

  if (tool.persistence.configCache) {
    localStorage.setItem(`${tool.persistence.key}:config`, JSON.stringify(tool))
  }

  return structuredClone(tool)
}
