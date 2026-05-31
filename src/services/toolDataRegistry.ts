import { getToolApi } from '../api'
import type { ToolDataLoadResult } from '../api'
import type { ToolConfig } from '../types/toolConfig'

export type { ToolDataLoadResult } from '../api'

export async function fetchToolDataSources(config: ToolConfig): Promise<ToolDataLoadResult> {
  return getToolApi().getToolDataSources(config)
}
