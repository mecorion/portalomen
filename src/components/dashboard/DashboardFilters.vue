<template>
  <section class="ds-card ds-card--section ds-filters-grid">
    <div class="ds-filter-item">
      <label>Период</label>

      <el-date-picker
        v-model="dashboardStore.filters.period"
        type="daterange"
        format="DD.MM.YYYY"
        value-format="YYYY-MM-DD"
        start-placeholder="Начало"
        end-placeholder="Конец"
      />
    </div>

    <div class="ds-filter-item">
      <label>Группировка</label>

      <el-select v-model="dashboardStore.filters.group">
        <el-option label="По дням" value="day" />
        <el-option label="По неделям" value="week" />
        <el-option label="По месяцам" value="month" />
      </el-select>
    </div>

    <div class="ds-filter-item">
      <label>Категория</label>

      <el-select v-model="dashboardStore.filters.category">
        <el-option label="Все категории" value="all" />
        <el-option label="Электроника" value="Электроника" />
        <el-option label="Бытовая техника" value="Бытовая техника" />
        <el-option label="Дом и сад" value="Дом и сад" />
      </el-select>
    </div>

    <div class="ds-filter-item">
      <label>Регион</label>

      <el-select v-model="dashboardStore.filters.region">
        <el-option label="Все регионы" value="all" />
        <el-option label="Алматы" value="Алматы" />
        <el-option label="Астана" value="Астана" />
      </el-select>
    </div>

    <div class="ds-filter-item">
      <label>Поиск</label>

      <el-input
        v-model="dashboardStore.filters.search"
        placeholder="Дата, категория, регион"
        clearable
      />
    </div>

    <div class="ds-filter-actions">
      <el-button type="primary">
        Применить
      </el-button>

      <el-button @click="resetFilters">
        Сбросить
      </el-button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useDashboardStore } from '../../stores/dashboardStore'

const dashboardStore = useDashboardStore()

function resetFilters() {
  dashboardStore.filters = {
    category: 'all',
    region: 'all',
    period: ['2024-05-01', '2024-05-31'],
    group: 'day',
    search: ''
  }

  dashboardStore.saveState()
}
</script>