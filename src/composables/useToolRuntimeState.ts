import { reactive, watch, type Ref } from 'vue'

import {
  loadPersistedState,
  savePersistedState
} from './usePersistedState'
import type { ToolConfig } from '../types/toolConfig'

export type ToolRuntimeState = Record<string, unknown>

export function useToolRuntimeState(config: Ref<ToolConfig | undefined>) {
  const state = reactive<ToolRuntimeState>({})

  watch(
    state,
    () => {
      const currentConfig = config.value

      if (!currentConfig?.persistence.state) {
        return
      }

      savePersistedState(
        getToolRuntimeStateKey(currentConfig),
        { ...state },
        currentConfig.version
      )
    },
    { deep: true }
  )

  function restore(nextConfig: ToolConfig) {
    clear()

    const storedState = nextConfig.persistence.state
      ? loadPersistedState<ToolRuntimeState>(
        getToolRuntimeStateKey(nextConfig),
        nextConfig.version
      )
      : undefined

    Object.assign(state, nextConfig.defaultState, storedState ?? {})
  }

  function clear() {
    Object.keys(state).forEach((key) => {
      delete state[key]
    })
  }

  function setValue(key: string, value: unknown) {
    state[key] = value
  }

  return {
    state,
    restore,
    clear,
    setValue
  }
}

export function getToolRuntimeStateKey(config: ToolConfig): string {
  return `${config.persistence.key}:state`
}
