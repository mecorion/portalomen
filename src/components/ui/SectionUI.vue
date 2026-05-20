<template>
  <CardUI
    section
    padding
  >
    <div
      v-if="title || $slots.actions"
      class="ui-section-header"
    >
      <h2 v-if="title">
        {{ title }}
      </h2>

      <div
        v-if="$slots.actions"
        class="ui-section-actions"
      >
        <slot name="actions" />
      </div>
    </div>

    <slot />
  </CardUI>
</template>

<script setup lang="ts">
import CardUI from './CardUI.vue'

defineProps<{
  title?: string
}>()
</script>