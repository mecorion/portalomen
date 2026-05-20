<template>
  <component
    :is="as"
    class="ui-typography"
    :class="[`ui-typography--${variant}`, { 'ui-typography--muted': muted }]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: string
    variant?: 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption' | 'code'
    muted?: boolean
  }>(),
  {
    as: 'p',
    variant: 'body',
    muted: false
  }
)
</script>
