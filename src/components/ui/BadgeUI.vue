<template>
  <span
    class="ui-badge"
    :class="[`ui-badge--${variant}`, `ui-badge--${size}`]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
    size?: 'sm' | 'md'
  }>(),
  {
    variant: 'neutral',
    size: 'md'
  }
)
</script>
