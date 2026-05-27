<template>
  <div
    class="tool-component"
    :class="{ 'ui-card': component.type === 'chart' || component.type === 'table' }"
  >
    <component
      :is="renderer"
      :component="component"
      :data-sources="dataSources"
      :state="state"
      @state-change="handleStateChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { getToolComponentRenderer } from './renderers'
import type { ToolComponentConfig, ToolDataSource } from '../../types/toolConfig'

const props = defineProps<{
  component: ToolComponentConfig
  dataSources: Record<string, ToolDataSource>
  state: Record<string, unknown>
}>()

const emit = defineEmits<{
  stateChange: [key: string, value: unknown]
}>()

const renderer = computed(() => getToolComponentRenderer(props.component.type))

function handleStateChange(key: string, value: unknown) {
  emit('stateChange', key, value)
}
</script>
