<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import DashboardView from './views/dashboard/DashboardView.vue'
import UIShowcase from './views/ui/UIShowcase.vue'

const currentHash = ref(window.location.hash || '#/')

const currentView = computed(() => {
  return currentHash.value === '#/ui' ? UIShowcase : DashboardView
})

function syncHash() {
  currentHash.value = window.location.hash || '#/'
}

onMounted(() => {
  window.addEventListener('hashchange', syncHash)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', syncHash)
})
</script>

<template>
  <component :is="currentView" />
</template>
