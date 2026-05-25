<template>
  <SectionUI title="Динамика показателей">
    <template #actions>
      <DashboardChartControls />
    </template>

    <DashboardChart />
  </SectionUI>
</template>

<script setup lang="ts">
import SectionUI from '../ui/SectionUI.vue'
import DashboardChart from './DashboardChart.vue'
import DashboardChartControls from './DashboardChartControls.vue'
</script>