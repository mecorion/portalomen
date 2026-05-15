<template>
    <div class="dashboard-layout">
        <aside class="sidebar">
            <div class="logo">
                <svg class="logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M20.9423 3.05768C23.4117 5.52701 21.4099 11.5324 16.4712 16.4711C11.5326 21.4097 5.5272 23.4115 3.05787 20.9422C0.588547 18.4728 2.59033 12.4675 7.52899 7.5288C12.4676 2.59014 18.473 0.588345 20.9423 3.05768ZM3.05768 3.05782C0.588349 5.52715 2.59013 11.5325 7.52879 16.4712C12.4674 21.4099 18.4728 23.4117 20.9421 20.9423C23.4115 18.473 21.4097 12.4676 16.471 7.52894C11.5324 2.59028 5.527 0.588485 3.05768 3.05782Z"
                        stroke-width="1.5" />
                    <path
                        d="M14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5C13.3807 9.5 14.5 10.6193 14.5 12Z"
                        stroke-width="1.5" />
                </svg>
                <span>OMEN</span>
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
                    <el-date-picker v-model="dashboardStore.filters.period" type="daterange" format="DD.MM.YYYY"
                        value-format="YYYY-MM-DD" start-placeholder="Начало" end-placeholder="Конец" />
                </div>

                <div class="filter-item">
                    <label>Группировка</label>
                    <el-select v-model="dashboardStore.filters.group" placeholder="Группировка">
                        <el-option label="По дням" value="day" />
                        <el-option label="По неделям" value="week" />
                        <el-option label="По месяцам" value="month" />
                    </el-select>
                </div>

                <div class="filter-item">
                    <label>Категория</label>
                    <el-select v-model="dashboardStore.filters.category">
                        <el-option label="Все категории" value="all" />
                        <el-option label="Электроника" value="Электроника" />
                        <el-option label="Бытовая техника" value="Бытовая техника" />
                        <el-option label="Дом и сад" value="Дом и сад" />
                    </el-select>
                </div>

                <div class="filter-item">
                    <label>Регион</label>
                    <el-select v-model="dashboardStore.filters.region">
                        <el-option label="Все регионы" value="all" />
                        <el-option label="Алматы" value="Алматы" />
                        <el-option label="Астана" value="Астана" />
                    </el-select>
                </div>

                <div class="filter-actions">
                    <el-button type="primary">Применить</el-button>
                    <el-button>Сбросить</el-button>
                </div>
            </section>

            <DashboardStats />

            <section class="chart-card">
                <div class="section-header">
                    <h2>Динамика показателей</h2>
                    <el-select model-value="line" style="width: 180px">
                        <el-option label="Линейный график" value="line" />
                        <el-option label="Столбчатый график" value="bar" />
                    </el-select>
                </div>

                <DashboardChart />
            </section>

            <section class="table-card">
                <div class="section-header">
                    <h2>Данные за период</h2>

                    <el-button type="primary" @click="dashboardStore.addRow">
                        Добавить запись
                    </el-button>
                </div>

                <el-table :data="dashboardStore.groupedRows" class="dashboard-table" height="520" border>
                    <el-table-column type="selection" width="42" />

                    <el-table-column prop="date" label="Дата" width="120">
                        <template #default="{ row }">
                            <el-input v-model="row.date" size="small" />
                        </template>
                    </el-table-column>

                    <el-table-column prop="revenue" label="Выручка, ₽" min-width="150">
                        <template #default="{ row }">
                            <el-input-number v-model="row.revenue" size="small" :min="0" :controls="true"
                                controls-position="right" />
                        </template>
                    </el-table-column>

                    <el-table-column prop="profit" label="Прибыль, ₽" min-width="150">
                        <template #default="{ row }">
                            <el-input-number v-model="row.profit" size="small" :min="0" controls-position="right" />
                        </template>
                    </el-table-column>

                    <el-table-column prop="orders" label="Заказы, шт." min-width="130">
                        <template #default="{ row }">
                            <el-input-number v-model="row.orders" size="small" :min="0" controls-position="right" />
                        </template>
                    </el-table-column>

                    <el-table-column prop="averageCheck" label="Средний чек, ₽" min-width="150">
                        <template #default="{ row }">
                            <el-input-number v-model="row.averageCheck" size="small" :min="0"
                                controls-position="right" />
                        </template>
                    </el-table-column>

                    <el-table-column prop="conversion" label="Конверсия, %" min-width="140">
                        <template #default="{ row }">
                            <el-input-number v-model="row.conversion" size="small" :min="0" :step="0.1"
                                controls-position="right" />
                        </template>
                    </el-table-column>

                    <el-table-column prop="category" label="Категория" min-width="180">
                        <template #default="{ row }">
                            <el-select v-model="row.category" size="small">
                                <el-option label="Электроника" value="Электроника" />
                                <el-option label="Бытовая техника" value="Бытовая техника" />
                                <el-option label="Дом и сад" value="Дом и сад" />
                            </el-select>
                        </template>
                    </el-table-column>

                    <el-table-column label="Действия" width="110" fixed="right">
                        <template #default="{ row }">
                            <el-button text size="small" type="danger" @click="dashboardStore.deleteRow(row.id)">
                                Удалить
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '../../stores/dashboardStore'
import DashboardChart from '../../components/dashboard/DashboardChart.vue'
import DashboardStats from '../../components/dashboard/DashboardStats.vue'

const dashboardStore = useDashboardStore()
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
    gap: 10px;
    height: 44px;
    padding: 0 12px;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 28px;
}

.logo-icon {
    stroke: #ffffff;
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

.dashboard-table {
    width: 100%;
    font-size: 13px;
}

.dashboard-table :deep(.el-table__cell) {
    padding: 5px 0;
}

.dashboard-table :deep(.cell) {
    padding: 0 8px;
}

.dashboard-table :deep(.el-input__wrapper),
.dashboard-table :deep(.el-select__wrapper) {
    min-height: 30px;
    border-radius: 7px;
    box-shadow: 0 0 0 1px #dce7f5 inset;
}

.dashboard-table :deep(.el-input-number) {
    width: 100%;
}

.dashboard-table :deep(.el-input-number .el-input__wrapper) {
    width: 100%;
}

.dashboard-table :deep(.el-input-number__increase),
.dashboard-table :deep(.el-input-number__decrease) {
    width: 22px;
}

.dashboard-table :deep(.el-table__header th) {
    background: #f8fbff;
    color: #5f6f89;
    font-weight: 700;
}

.dashboard-table :deep(.el-table__row:hover > td) {
    background: #f5f9ff;
}
</style>