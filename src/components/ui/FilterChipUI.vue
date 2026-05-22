<template>
  <button
    class="ui-filter-chip"
    type="button"
    @click="$emit('remove')"
  >
    <span class="ui-filter-chip__label">{{ label }}</span>
    <span class="ui-filter-chip__value">{{ value }}</span>
    <span class="ui-filter-chip__remove" aria-hidden="true">x</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string
}>()

defineEmits<{
  remove: []
}>()
</script>
