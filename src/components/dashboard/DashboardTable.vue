<template>

    <SectionUI title="Данные продаж">
        <template #actions>
            <ButtonUI variant="primary" @click="dashboardStore.addRow" :disabled="isReadOnlyTable">
                Добавить запись
            </ButtonUI>
        </template>

        <AlertUI
            v-if="isReadOnlyTable"
            class="ds-table-alert"
            title="Редактирование недоступно"
            description="Для недельной и месячной группировки таблица показывает агрегированные данные."
            variant="info"
            icon="i"
        />

        <el-table :data="dashboardStore.groupedRows" class="ds-table" height="520" border
            :default-sort="{ prop: 'date', order: 'ascending' }">
            <el-table-column type="selection" width="42" />

            <el-table-column prop="date" label="Дата" width="120" sortable>
                <template #default="{ row }">
                    <el-input v-model="row.date" size="small" />
                </template>
            </el-table-column>

            <el-table-column prop="revenue" label="Выручка, ₽" min-width="150" sortable align="right"
                header-align="right">
                <template #default="{ row }">
                    <el-input-number v-if="!isReadOnlyTable" v-model="row.revenue" size="small" :min="0"
                        :controls="true" controls-position="right" />

                    <span v-else class="ds-number-cell">
                        {{ formatMoney(row.revenue) }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column prop="profit" label="Прибыль, ₽" min-width="150" sortable align="right"
                header-align="right">
                <template #default="{ row }">
                    <el-input-number v-if="!isReadOnlyTable" v-model="row.profit" size="small" :min="0"
                        controls-position="right" />

                    <span v-else class="ds-number-cell">
                        {{ formatMoney(row.profit) }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column prop="orders" label="Заказы, шт." min-width="130" sortable align="right"
                header-align="right">
                <template #default="{ row }">
                    <el-input-number v-if="!isReadOnlyTable" v-model="row.orders" size="small" :min="0"
                        controls-position="right" />

                    <span v-else class="ds-number-cell">
                        {{ formatNumber(row.orders) }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column prop="averageCheck" label="Средний чек, ₽" min-width="150" sortable align="right"
                header-align="right">
                <template #default="{ row }">
                    <el-input-number v-if="!isReadOnlyTable" v-model="row.averageCheck" size="small" :min="0"
                        controls-position="right" />

                    <span v-else class="ds-number-cell">
                        {{ formatMoney(row.averageCheck) }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column prop="conversion" label="Конверсия, %" min-width="140" sortable align="right"
                header-align="right">
                <template #default="{ row }">
                    <el-input-number v-if="!isReadOnlyTable" v-model="row.conversion" size="small" :min="0" :step="0.1"
                        controls-position="right" />

                    <span v-else class="ds-number-cell">
                        {{ formatPercent(row.conversion) }}
                    </span>
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
                    <ButtonUI variant="danger" size="sm" @click="dashboardStore.deleteRow(row.id)">
                        Удалить
                    </ButtonUI>
                </template>
            </el-table-column>
        </el-table>
    </SectionUI>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AlertUI from '../ui/AlertUI.vue'
import ButtonUI from '../ui/ButtonUI.vue'
import SectionUI from '../ui/SectionUI.vue'
import { useDashboardStore } from '../../stores/dashboardStore'

const dashboardStore = useDashboardStore()

const isReadOnlyTable = computed(() => {
    return dashboardStore.filters.group !== 'day'
})

function formatMoney(value: number): string {
    return new Intl.NumberFormat('ru-RU').format(value) + ' ₽'
}

function formatNumber(value: number): string {
    return new Intl.NumberFormat('ru-RU').format(value)
}

function formatPercent(value: number): string {
    return value.toFixed(2) + '%'
}
</script>
