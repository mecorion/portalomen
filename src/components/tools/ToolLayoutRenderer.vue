<template>
  <div class="tool-runtime-layout" :class="layoutClass" :data-density="config.layout.density">
    <section
      v-for="area in config.layout.areas"
      :key="area.id"
      class="tool-runtime-area"
      :class="[
        `tool-runtime-area--${area.id}`,
        { 'ui-card': area.id !== 'main' },
        { 'tool-runtime-area--sticky': area.sticky }
      ]"
    >
      <div v-if="area.title" class="tool-panel-header">
        <h2>{{ area.title }}</h2>

        <button class="tool-icon-button" type="button" aria-label="Фильтры">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <ToolComponentRenderer
        v-for="component in area.components"
        :key="component.id"
        :component="component"
        :data-sources="dataSources"
        :state="state"
        @state-change="handleStateChange"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import ToolComponentRenderer from './ToolComponentRenderer.vue'
import type { ToolConfig, ToolDataSources } from '../../types/toolConfig'

const props = defineProps<{
  config: ToolConfig
  dataSources: ToolDataSources
  state: Record<string, unknown>
}>()

const emit = defineEmits<{
  stateChange: [key: string, value: unknown]
}>()

const layoutClass = computed(() => `tool-runtime-layout--${props.config.layout.type}`)

function handleStateChange(key: string, value: unknown) {
  emit('stateChange', key, value)
}
</script>
