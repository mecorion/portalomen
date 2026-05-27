import { onMounted, watch, type WatchSource } from 'vue'

type PersistedPayload<T> = {
  version: number
  state: T
}

export type PersistedStateOptions<T> = {
  key: string
  version?: number
  source: WatchSource<T>
  restore: (state: Partial<T>) => void
  deep?: boolean
  immediate?: boolean
}

export function usePersistedState<T extends Record<string, unknown>>(options: PersistedStateOptions<T>) {
  const version = options.version ?? 1

  onMounted(() => {
    const state = loadPersistedState<T>(options.key, version)

    if (state) {
      options.restore(state)
    }
  })

  watch(
    options.source,
    (state) => {
      savePersistedState(options.key, state, version)
    },
    {
      deep: options.deep ?? true,
      immediate: options.immediate ?? false
    }
  )
}

export function loadPersistedState<T>(key: string, version = 1): Partial<T> | undefined {
  const rawValue = localStorage.getItem(key)

  if (!rawValue) {
    return undefined
  }

  try {
    const parsedValue = JSON.parse(rawValue) as PersistedPayload<T> | Partial<T>

    if (isVersionedPayload<T>(parsedValue)) {
      return parsedValue.version === version ? parsedValue.state : undefined
    }

    return parsedValue
  } catch {
    return undefined
  }
}

export function savePersistedState<T>(key: string, state: T, version = 1) {
  const payload: PersistedPayload<T> = {
    version,
    state
  }

  localStorage.setItem(key, JSON.stringify(payload))
}

function isVersionedPayload<T>(value: PersistedPayload<T> | Partial<T>): value is PersistedPayload<T> {
  return typeof value === 'object'
    && value !== null
    && 'version' in value
    && 'state' in value
}
