<template>
  <div class="ds-chart-controls">
    <el-checkbox-group
      v-model="dashboardStore.activeMetrics"
      class="ds-metric-switcher"
    >
      <el-checkbox-button label="revenue">
        Выручка
      </el-checkbox-button>

      <el-checkbox-button label="profit">
        Прибыль
      </el-checkbox-button>

      <el-checkbox-button label="orders">
        Заказы
      </el-checkbox-button>
    </el-checkbox-group>

    <el-select
      v-model="dashboardStore.chartType"
      style="width: 160px"
    >
      <el-option label="Линия" value="line" />
      <el-option label="Столбцы" value="bar" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '../../stores/dashboardStore'

const dashboardStore = useDashboardStore()
</script>