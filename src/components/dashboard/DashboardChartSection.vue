<template>
  <section class="ds-card ds-card--section">
    <div class="ds-section-header">
      <h2>Динамика показателей</h2>

      <DashboardChartControls />
    </div>

    <DashboardChart />
  </section>
</template>

<script setup lang="ts">
import DashboardChart from './DashboardChart.vue'
import DashboardChartControls from './DashboardChartControls.vue'
</script>