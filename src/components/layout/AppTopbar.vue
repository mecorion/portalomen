<template>
  <header class="app-topbar">
    <h1>{{ title }}</h1>

    <div class="app-topbar__actions">
      <button class="ds-icon-button">🔔</button>

      <button class="ds-export-button" @click="$emit('export')">
        Экспорт
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()

defineEmits<{
  export: []
}>()
</script>