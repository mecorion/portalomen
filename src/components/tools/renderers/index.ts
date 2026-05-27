import type { Component } from 'vue'

import ToolChartRenderer from './ToolChartRenderer.vue'
import ToolFiltersRenderer from './ToolFiltersRenderer.vue'
import ToolInfoPanelRenderer from './ToolInfoPanelRenderer.vue'
import ToolTableRenderer from './ToolTableRenderer.vue'
import type { ToolComponentType } from '../../../types/toolConfig'

export const toolComponentRegistry: Record<ToolComponentType, Component> = {
  filters: ToolFiltersRenderer,
  chart: ToolChartRenderer,
  table: ToolTableRenderer,
  'info-panel': ToolInfoPanelRenderer
}

export function getToolComponentRenderer(type: ToolComponentType): Component {
  return toolComponentRegistry[type]
}
