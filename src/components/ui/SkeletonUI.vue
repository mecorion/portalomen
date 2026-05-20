<template>
  <div
    class="ui-skeleton"
    :class="[
      `ui-skeleton--${variant}`,
      {
        'ui-skeleton--shimmer': shimmer
      }
    ]"
    :style="style"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'text' | 'heading' | 'avatar' | 'button' | 'card' | 'circle' | 'block'
    width?: string
    height?: string
    shimmer?: boolean
  }>(),
  {
    variant: 'text',
    shimmer: false
  }
)

const style = computed(() => ({
  width: props.width,
  height: props.height
}))
</script>
