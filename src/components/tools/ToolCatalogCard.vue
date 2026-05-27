<template>
  <button class="tool-catalog-card" type="button" @click="emit('open')">
    <span class="tool-catalog-card__icon" :style="{ '--tool-accent': item.accentColor }">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          :d="item.icon"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>

    <span class="tool-catalog-card__content">
      <span class="tool-catalog-card__title">{{ item.title }}</span>
      <span class="tool-catalog-card__description">{{ item.description }}</span>
    </span>

    <span class="tool-catalog-card__arrow" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
  </button>
</template>

<script setup lang="ts">
import type { ToolCatalogItem } from '../../services/toolRegistry'

defineProps<{
  item: ToolCatalogItem
}>()

const emit = defineEmits<{
  open: []
}>()
</script>
