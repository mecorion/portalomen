<template>
  <div
    class="ui-card"
    :class="{
      'ui-card--section': section,
      'ui-card--padding': padding,
      'ui-card--flat': flat
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
    flat?: boolean
  }>(),
  {
    section: false,
    padding: true,
    flat: false
  }
)
</script>
