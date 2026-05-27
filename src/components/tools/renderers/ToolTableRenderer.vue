<template>
  <div class="tool-panel-header">
    <h2>{{ component.title }}</h2>

    <div class="tool-toolbar">
      <button class="tool-icon-button" type="button" aria-label="Обновить">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M20 12a8 8 0 0 1-13.5 5.8M4 12A8 8 0 0 1 17.5 6.2M18 3v4h-4M6 21v-4h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button class="tool-icon-button" type="button" aria-label="Фильтр">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
        </svg>
      </button>
      <button class="tool-icon-button" type="button" aria-label="Скачать">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 4v11M8 11l4 4 4-4M5 20h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </div>

  <DataTableUI
    :data="rows"
    :columns="component.columns"
    :height="component.height ?? 430"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import DataTableUI from '../../ui/DataTableUI.vue'
import type {
  ToolDataSource,
  ToolTableComponentConfig
} from '../../../types/toolConfig'
import { getFilteredRows } from './toolRendererUtils'

const props = defineProps<{
  component: ToolTableComponentConfig
  dataSources: Record<string, ToolDataSource>
  state: Record<string, unknown>
}>()

defineEmits<{
  stateChange: [key: string, value: unknown]
}>()

const rows = computed(() => getFilteredRows(
  props.component.dataSourceId,
  props.dataSources,
  props.state
))
</script>
