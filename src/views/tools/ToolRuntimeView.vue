<template>
  <div
    class="app-layout"
    :class="{
      'app-layout--sidebar-collapsed': sidebarCollapsed,
      'app-layout--sidebar-mobile-open': mobileSidebarOpen
    }"
  >
    <button
      class="mobile-sidebar-toggle"
      type="button"
      aria-label="Открыть меню"
      @click="mobileSidebarOpen = true"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <button
      v-if="mobileSidebarOpen"
      class="mobile-sidebar-backdrop"
      type="button"
      aria-label="Закрыть меню"
      @click="mobileSidebarOpen = false"
    ></button>

    <AppSidebar
      :collapsed="sidebarCollapsed"
      :mobile-open="mobileSidebarOpen"
      @close="mobileSidebarOpen = false"
      @toggle="handleSidebarToggle"
    />

    <main class="app-content tool-runtime-page">
      <AppTopbar :title="toolConfig?.title ?? 'Инструмент'" @export="handleExport" />

      <div v-if="loading" class="tool-runtime-status ui-card">Загрузка инструмента</div>
      <div v-else-if="!toolConfig" class="tool-runtime-status ui-card">Инструмент не найден</div>

      <ToolLayoutRenderer
        v-else
        :config="toolConfig"
        :state="toolState"
        @state-change="setToolState"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import AppSidebar from '../../components/layout/AppSidebar.vue'
import AppTopbar from '../../components/layout/AppTopbar.vue'
import ToolLayoutRenderer from '../../components/tools/ToolLayoutRenderer.vue'
import { fetchToolConfig } from '../../services/toolRegistry'
import type { ToolConfig } from '../../types/toolConfig'

const route = useRoute()

const sidebarCollapsed = ref(false)
const mobileSidebarOpen = ref(false)
const loading = ref(false)
const toolConfig = ref<ToolConfig>()
const toolState = reactive<Record<string, unknown>>({})

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

    localStorage.setItem(`${toolConfig.value.persistence.key}:state`, JSON.stringify(toolState))
  },
  { deep: true }
)

async function loadTool(slug: string) {
  loading.value = true
  toolConfig.value = undefined
  clearToolState()

  const config = await fetchToolConfig(slug)
  toolConfig.value = config

  if (config) {
    restoreToolState(config)
  }

  loading.value = false
}

function restoreToolState(config: ToolConfig) {
  const storedState = readStoredState(config.persistence.key)

  Object.assign(toolState, config.defaultState, storedState)
}

function readStoredState(key: string): Record<string, unknown> {
  const storedValue = localStorage.getItem(`${key}:state`)

  if (!storedValue) {
    return {}
  }

  try {
    const parsedValue = JSON.parse(storedValue)
    return typeof parsedValue === 'object' && parsedValue !== null ? parsedValue : {}
  } catch {
    return {}
  }
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

function handleSidebarToggle() {
  if (window.matchMedia('(max-width: 760px)').matches) {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
    return
  }

  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>
