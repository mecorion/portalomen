<template>
  <section class="tools-catalog-layout">
    <div class="tools-catalog-layout__header">
      <div>
        <h2>Доступные инструменты</h2>
        <p>Выберите рабочий инструмент для анализа данных и корректировок.</p>
      </div>

      <span class="tools-catalog-layout__counter">{{ items.length }}</span>
    </div>

    <div class="tools-catalog-layout__grid">
      <ToolCatalogCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        @open="emit('open', item)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import ToolCatalogCard from './ToolCatalogCard.vue'
import type { ToolCatalogItem } from '../../services/toolRegistry'

defineProps<{
  items: ToolCatalogItem[]
}>()

const emit = defineEmits<{
  open: [item: ToolCatalogItem]
}>()
</script>
