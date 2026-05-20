<template>
  <section class="ds-card ds-card--section">
    <div
      v-if="title || $slots.actions"
      class="ds-section-header"
    >
      <h2 v-if="title">
        {{ title }}
      </h2>

      <div v-if="$slots.actions">
        <slot name="actions" />
      </div>
    </div>

    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>