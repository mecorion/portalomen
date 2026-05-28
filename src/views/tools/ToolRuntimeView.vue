<template>
  <AppShellLayout
    :title="toolConfig?.title ?? 'Инструмент'"
    content-class="tool-runtime-page"
    @export="handleExport"
  >
    <div v-if="loading" class="tool-runtime-status ui-card">Загрузка инструмента</div>
    <div v-else-if="configErrors.length" class="tool-runtime-status tool-runtime-status--error ui-card">
      <strong>Конфиг инструмента некорректен</strong>
      <span v-for="error in configErrors" :key="error">{{ error }}</span>
    </div>
    <div v-else-if="!toolConfig" class="tool-runtime-status ui-card">Инструмент не найден</div>

    <ToolLayoutRenderer
      v-else
      :config="toolConfig"
      :data-sources="filteredDataSources"
      :state="toolState"
      @state-change="setToolState"
    />
  </AppShellLayout>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import AppShellLayout from '../../components/layout/AppShellLayout.vue'
import ToolLayoutRenderer from '../../components/tools/ToolLayoutRenderer.vue'
import { loadPersistedState, savePersistedState } from '../../composables/usePersistedState'
import { applyToolDataFilters } from '../../services/toolDataFilters'
import { fetchToolDataSources } from '../../services/toolDataRegistry'
import { fetchToolConfig } from '../../services/toolRegistry'
import type { ToolConfig, ToolDataSources } from '../../types/toolConfig'

const route = useRoute()

const loading = ref(false)
const toolConfig = ref<ToolConfig>()
const toolDataSources = ref<ToolDataSources>({})
const configErrors = ref<string[]>([])
const toolState = reactive<Record<string, unknown>>({})

const filteredDataSources = computed(() => {
  return applyToolDataFilters(toolDataSources.value, toolState)
})

watch(
  () => route.params.slug,
  async (slug) => {
    await loadTool(String(slug ?? ''))
  },
  { immediate: true }
)

watch(
  toolState,
  () => {
    if (!toolConfig.value?.persistence.state) {
      return
    }

    savePersistedState(
      `${toolConfig.value.persistence.key}:state`,
      { ...toolState },
      toolConfig.value.version
    )
  },
  { deep: true }
)

async function loadTool(slug: string) {
  loading.value = true
  toolConfig.value = undefined
  toolDataSources.value = {}
  configErrors.value = []
  clearToolState()

  const result = await fetchToolConfig(slug)

  if (result.status === 'invalid') {
    configErrors.value = result.errors
    loading.value = false
    return
  }

  if (result.status === 'not-found') {
    loading.value = false
    return
  }

  const dataResult = await fetchToolDataSources(result.config)

  if (dataResult.status === 'invalid') {
    configErrors.value = dataResult.errors
    loading.value = false
    return
  }

  if (dataResult.status === 'not-found') {
    configErrors.value = [`Данные инструмента ${result.config.slug} не найдены`]
    loading.value = false
    return
  }

  toolConfig.value = result.config
  toolDataSources.value = dataResult.dataSources

  if (result.config) {
    restoreToolState(result.config)
  }

  loading.value = false
}

function restoreToolState(config: ToolConfig) {
  const storedState = loadPersistedState<Record<string, unknown>>(
    `${config.persistence.key}:state`,
    config.version
  )

  Object.assign(toolState, config.defaultState, storedState ?? {})
}

function clearToolState() {
  Object.keys(toolState).forEach((key) => {
    delete toolState[key]
  })
}

function setToolState(key: string, value: unknown) {
  toolState[key] = value
}

function handleExport() {
  // Export will be routed through config-driven data sources later.
}
</script>
