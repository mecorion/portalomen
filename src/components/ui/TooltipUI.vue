<template>
  <span
    class="ui-tooltip"
    :class="[`ui-tooltip--${position}`, { 'ui-tooltip--dark': dark }]"
  >
    <slot />
    <span class="ui-tooltip__content">{{ text }}</span>
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    text: string
    position?: 'top' | 'right' | 'bottom' | 'left'
    dark?: boolean
  }>(),
  {
    position: 'top',
    dark: false
  }
)
</script>
