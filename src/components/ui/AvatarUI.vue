<template>
  <span
    class="ui-avatar"
    :class="[
      `ui-avatar--${size}`,
      {
        'ui-avatar--rounded': rounded,
        'ui-avatar--ring': ring,
        [`ui-avatar--${status}`]: status
      }
    ]"
  >
    <img
      v-if="src && !imageFailed"
      class="ui-avatar__image"
      :src="src"
      :alt="alt"
      @error="imageFailed = true"
    />
    <span v-else class="ui-avatar__fallback">{{ fallbackText }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    name?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    rounded?: boolean
    ring?: boolean
    status?: 'online' | 'away' | 'busy' | 'offline'
  }>(),
  {
    alt: '',
    size: 'md',
    rounded: false,
    ring: false
  }
)

const imageFailed = ref(false)

const fallbackText = computed(() => {
  if (!props.name) {
    return '?'
  }

  return props.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
})
</script>
