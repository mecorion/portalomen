<template>
  <div class="ui-progress-wrap">
    <div v-if="label || showValue" class="ui-progress__meta">
      <span>{{ label }}</span>
      <span v-if="showValue">{{ normalizedValue }}%</span>
    </div>

    <div
      class="ui-progress"
      :class="[
        `ui-progress--${variant}`,
        `ui-progress--${size}`,
        {
          'ui-progress--striped': striped,
          'ui-progress--animated': animated,
          'ui-progress--indeterminate': indeterminate
        }
      ]"
    >
      <div
        class="ui-progress__bar"
        :style="{ width: indeterminate ? undefined : `${normalizedValue}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value?: number
    label?: string
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
    size?: 'xs' | 'sm' | 'md' | 'lg'
    showValue?: boolean
    striped?: boolean
    animated?: boolean
    indeterminate?: boolean
  }>(),
  {
    value: 0,
    variant: 'primary',
    size: 'md',
    showValue: false,
    striped: false,
    animated: false,
    indeterminate: false
  }
)

const normalizedValue = computed(() => Math.min(100, Math.max(0, props.value)))
</script>
