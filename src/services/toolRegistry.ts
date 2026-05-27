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

export function getToolNavigationItems(): ToolNavigationItem[] {
  return toolConfigs
    .map((tool) => ({
      label: tool.navigation.label,
      path: `/tools/${tool.slug}`,
      icon: tool.navigation.icon,
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
