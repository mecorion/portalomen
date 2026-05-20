<template>
  <DsSection title="Динамика показателей">
    <template #actions>
      <DashboardChartControls />
    </template>

    <DashboardChart />
  </DsSection>
</template>

<script setup lang="ts">
import DsSection from '../ui/SectionUI.vue'
import DashboardChart from './DashboardChart.vue'
import DashboardChartControls from './DashboardChartControls.vue'
</script>