<template>
  <div
    class="ui-card"
    :class="{
      'ui-card--section': section,
      'ui-card--padding': padding
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    section?: boolean
    padding?: boolean
  }>(),
  {
    section: false,
    padding: true
  }
)
</script>