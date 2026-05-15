<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-icon">▥</div>
        <span>Analytics</span>
      </div>

      <nav class="menu">
        <button class="menu-item active">Дашборд</button>
        <button class="menu-item">Отчеты</button>
        <button class="menu-item">Продажи</button>
        <button class="menu-item">Клиенты</button>
        <button class="menu-item">Товары</button>
        <button class="menu-item">Маркетинг</button>
        <button class="menu-item">Финансы</button>
        <button class="menu-item">Настройки</button>
      </nav>

      <div class="support-card">
        <div class="support-title">Нужна помощь?</div>
        <div class="support-text">Обратитесь в поддержку</div>
        <button class="support-button">Написать</button>
      </div>

      <div class="profile">
        <div class="avatar">AD</div>
        <div>
          <div class="profile-name">Алексей Демин</div>
          <div class="profile-role">Администратор</div>
        </div>
      </div>
    </aside>

    <main class="content">
      <header class="topbar">
        <h1>Дашборд</h1>

        <div class="topbar-actions">
          <button class="icon-button">🔔</button>
          <button class="export-button">Экспорт</button>
        </div>
      </header>

      <section class="filters-card">
        <div class="filter-item">
          <label>Период</label>
          <el-date-picker
            v-model="filters.period"
            type="daterange"
            format="DD.MM.YYYY"
            value-format="YYYY-MM-DD"
            start-placeholder="Начало"
            end-placeholder="Конец"
          />
        </div>

        <div class="filter-item">
          <label>Группировка</label>
          <el-select v-model="filters.group" placeholder="Группировка">
            <el-option label="По дням" value="day" />
            <el-option label="По неделям" value="week" />
            <el-option label="По месяцам" value="month" />
          </el-select>
        </div>

        <div class="filter-item">
          <label>Категория</label>
          <el-select v-model="filters.category" placeholder="Категория">
            <el-option label="Все категории" value="all" />
            <el-option label="Электроника" value="electronics" />
            <el-option label="Бытовая техника" value="home" />
            <el-option label="Дом и сад" value="garden" />
          </el-select>
        </div>

        <div class="filter-item">
          <label>Регион</label>
          <el-select v-model="filters.region" placeholder="Регион">
            <el-option label="Все регионы" value="all" />
            <el-option label="Алматы" value="almaty" />
            <el-option label="Астана" value="astana" />
          </el-select>
        </div>

        <div class="filter-actions">
          <el-button type="primary">Применить</el-button>
          <el-button>Сбросить</el-button>
        </div>
      </section>

      <section class="chart-card">
        <div class="section-header">
          <h2>Динамика показателей</h2>
          <el-select model-value="line" style="width: 180px">
            <el-option label="Линейный график" value="line" />
            <el-option label="Столбчатый график" value="bar" />
          </el-select>
        </div>

        <div class="chart-placeholder">
          Здесь будет график
        </div>
      </section>

      <section class="table-card">
        <div class="section-header">
          <h2>Данные за период</h2>
          <el-button type="primary">Добавить запись</el-button>
        </div>

        <div class="table-placeholder">
          Здесь будет таблица
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const filters = reactive({
  period: ['2024-05-01', '2024-05-31'],
  group: 'day',
  category: 'all',
  region: 'all'
})
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f9ff;
  color: #1f2937;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.sidebar {
  width: 248px;
  min-width: 248px;
  background: linear-gradient(180deg, #1683ff 0%, #0066e6 100%);
  color: #ffffff;
  padding: 22px 16px;
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 44px;
  padding: 0 12px;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 28px;
}

.logo-icon {
  font-size: 24px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  height: 46px;
  border: none;
  border-radius: 10px;
  padding: 0 16px;
  text-align: left;
  background: transparent;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.menu-item:hover,
.menu-item.active {
  background: rgba(255, 255, 255, 0.16);
}

.support-card {
  margin-top: auto;
  margin-bottom: 18px;
  padding: 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.14);
}

.support-title {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 8px;
}

.support-text {
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 14px;
}

.support-button {
  width: 100%;
  height: 36px;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.18);
  cursor: pointer;
}

.profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
}

.profile-name {
  font-size: 13px;
  font-weight: 700;
}

.profile-role {
  font-size: 12px;
  opacity: 0.85;
}

.content {
  flex: 1;
  padding: 22px 28px;
  overflow: auto;
}

.topbar {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

.topbar h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-button,
.export-button {
  height: 36px;
  border: none;
  border-radius: 9px;
  cursor: pointer;
}

.icon-button {
  width: 36px;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
}

.export-button {
  padding: 0 18px;
  background: #087cff;
  color: #ffffff;
  font-weight: 600;
}

.filters-card,
.chart-card,
.table-card {
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  border: 1px solid #edf2f7;
}

.filters-card {
  display: grid;
  grid-template-columns: 260px 190px 220px 190px auto;
  gap: 16px;
  align-items: end;
  padding: 18px 22px;
  margin-bottom: 20px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-item label {
  font-size: 12px;
  color: #718096;
  font-weight: 600;
}

.filter-actions {
  display: flex;
  gap: 10px;
}

.chart-card {
  padding: 20px 22px;
  margin-bottom: 20px;
}

.table-card {
  padding: 18px 22px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-header h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
}

.chart-placeholder {
  height: 290px;
  border-radius: 12px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px dashed #d8e4f2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
}

.table-placeholder {
  height: 360px;
  border-radius: 12px;
  border: 1px dashed #d8e4f2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
}
</style>