import manticaConfig from '../db/tools/mantica.json'
import poirotConfig from '../db/tools/poirot.json'
import type { ToolConfig } from '../types/toolConfig'
import { validateToolConfig } from '../types/toolConfigValidation'

const rawToolConfigs = [poirotConfig, manticaConfig] as unknown[]
const toolConfigEntries = rawToolConfigs.map((rawConfig) => ({
  rawConfig,
  validation: validateToolConfig(rawConfig)
}))
const toolValidationResults = toolConfigEntries.map((entry) => entry.validation)
const toolConfigs = toolValidationResults
  .filter((result) => result.valid)
  .map((result) => result.config)

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
  reportInvalidToolConfigs()

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

export async function fetchToolConfig(slug: string): Promise<ToolConfigLoadResult> {
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

  if (tool.persistence.configCache) {
    localStorage.setItem(`${tool.persistence.key}:config`, JSON.stringify(tool))
  }

  return {
    status: 'success',
    config: structuredClone(tool),
    errors: []
  }
}

function reportInvalidToolConfigs() {
  const invalidResults = toolValidationResults.filter((result) => !result.valid)

  if (!invalidResults.length) {
    return
  }

  console.warn('Некорректные конфиги инструментов:', invalidResults.map((result) => result.errors))
}

function getRawToolSlug(value: unknown) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined
  }

  const slug = (value as Record<string, unknown>).slug
  return typeof slug === 'string' ? slug : undefined
}
