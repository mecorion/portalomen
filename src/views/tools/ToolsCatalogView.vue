<template>
  <AppShellLayout title="Инструменты">
    <div v-if="loading" class="tool-runtime-status ui-card">Загрузка инструментов</div>

    <ToolCatalogLayout
      v-else
      :items="tools"
      @open="openTool"
    />
  </AppShellLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppShellLayout from '../../components/layout/AppShellLayout.vue'
import ToolCatalogLayout from '../../components/tools/ToolCatalogLayout.vue'
import { fetchToolCatalog, type ToolCatalogItem } from '../../services/toolRegistry'

const router = useRouter()

const loading = ref(false)
const tools = ref<ToolCatalogItem[]>([])

onMounted(async () => {
  loading.value = true
  tools.value = await fetchToolCatalog()
  loading.value = false
})

function openTool(item: ToolCatalogItem) {
  router.push(item.path)
}
</script>
