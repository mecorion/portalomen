<template>
  <section class="stats-grid">
    <div class="stat-card revenue">
      <div class="stat-label">
        Общая выручка
      </div>

      <div class="stat-value">
        {{ formatMoney(dashboardStore.totalRevenue) }}
      </div>

      <div class="stat-description">
        За выбранный период
      </div>
    </div>

    <div class="stat-card profit">
      <div class="stat-label">
        Общая прибыль
      </div>

      <div class="stat-value">
        {{ formatMoney(dashboardStore.totalProfit) }}
      </div>

      <div class="stat-description">
        После расходов
      </div>
    </div>

    <div class="stat-card orders">
      <div class="stat-label">
        Всего заказов
      </div>

      <div class="stat-value">
        {{ dashboardStore.totalOrders }}
      </div>

      <div class="stat-description">
        Количество заказов
      </div>
    </div>

    <div class="stat-card conversion">
      <div class="stat-label">
        Средняя конверсия
      </div>

      <div class="stat-value">
        {{ dashboardStore.averageConversion }}%
      </div>

      <div class="stat-description">
        Средний показатель
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useDashboardStore } from '../../stores/dashboardStore'

const dashboardStore = useDashboardStore()

function formatMoney(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽'
}
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 20px;
}

.stat-card {
  position: relative;

  background: #ffffff;

  border-radius: 16px;

  padding: 22px;

  overflow: hidden;

  border: 1px solid #edf2f7;

  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
}

.stat-card::before {
  content: '';

  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 4px;
}

.stat-card.revenue::before {
  background: #1677ff;
}

.stat-card.profit::before {
  background: #38bdf8;
}

.stat-card.orders::before {
  background: #6366f1;
}

.stat-card.conversion::before {
  background: #06b6d4;
}

.stat-label {
  color: #718096;

  font-size: 13px;

  font-weight: 600;

  margin-bottom: 14px;
}

.stat-value {
  color: #1f2937;

  font-size: 30px;

  font-weight: 800;

  margin-bottom: 10px;

  line-height: 1;
}

.stat-description {
  color: #94a3b8;

  font-size: 12px;
}
</style>