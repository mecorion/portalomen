<template>
  <div
    class="app-layout"
    :class="{
      'app-layout--sidebar-collapsed': sidebarCollapsed,
      'app-layout--sidebar-mobile-open': mobileSidebarOpen
    }"
  >
    <button
      class="mobile-sidebar-toggle"
      type="button"
      aria-label="Открыть меню"
      @click="mobileSidebarOpen = true"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <button
      v-if="mobileSidebarOpen"
      class="mobile-sidebar-backdrop"
      type="button"
      aria-label="Закрыть меню"
      @click="mobileSidebarOpen = false"
    ></button>

    <AppSidebar
      :collapsed="sidebarCollapsed"
      :mobile-open="mobileSidebarOpen"
      @close="mobileSidebarOpen = false"
      @toggle="handleSidebarToggle"
    />

    <main class="app-content" :class="contentClass">
      <AppTopbar :title="title" @export="emit('export')" />
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'

withDefaults(
  defineProps<{
    title: string
    contentClass?: string
  }>(),
  {
    contentClass: ''
  }
)

const emit = defineEmits<{
  export: []
}>()

const sidebarCollapsed = ref(false)
const mobileSidebarOpen = ref(false)

function handleSidebarToggle() {
  if (window.matchMedia('(max-width: 760px)').matches) {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
    return
  }

  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>
