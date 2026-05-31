import { createHttpToolApi } from './httpToolApi'
import { mockToolApi } from './mockToolApi'
import type { ToolApi } from './toolApi'

const toolApiMode = import.meta.env.VITE_TOOL_API_MODE ?? 'mock'
const toolApiBaseUrl = import.meta.env.VITE_TOOL_API_BASE_URL ?? 'http://127.0.0.1:4000'

const toolApi: ToolApi = toolApiMode === 'http'
  ? createHttpToolApi({ baseUrl: toolApiBaseUrl })
  : mockToolApi

export function getToolApi(): ToolApi {
  return toolApi
}
