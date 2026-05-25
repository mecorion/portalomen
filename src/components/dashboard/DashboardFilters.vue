<template>
  <SectionUI title="Фильтры">
    <FilterBarUI class="dashboard-filter-bar">
      <DateRangeUI
        v-model="periodProxy"
        label="Период"
      />

      <SelectUI
        v-model="groupProxy"
        label="Группировка"
        :options="groupOptions"
      />

      <SelectUI
        v-model="dashboardStore.filters.category"
        label="Категория"
        :options="categoryOptions"
      />

      <SelectUI
        v-model="dashboardStore.filters.region"
        label="Регион"
        :options="regionOptions"
      />

      <SearchInputUI
        v-model="dashboardStore.filters.search"
        label="Поиск"
        placeholder="Дата, категория, регион"
      />

      <template #actions>
        <ButtonUI variant="ghost" @click="resetFilters">
          Сбросить
        </ButtonUI>

        <ButtonUI variant="primary">
          Применить
        </ButtonUI>
      </template>
    </FilterBarUI>
  </SectionUI>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useDashboardStore, type GroupType } from '../../stores/dashboardStore'
import ButtonUI from '../ui/ButtonUI.vue'
import DateRangeUI from '../ui/DateRangeUI.vue'
import FilterBarUI from '../ui/FilterBarUI.vue'
import SearchInputUI from '../ui/SearchInputUI.vue'
import SectionUI from '../ui/SectionUI.vue'
import SelectUI, { type SelectUIOption } from '../ui/SelectUI.vue'

const dashboardStore = useDashboardStore()

const periodProxy = computed<[string, string]>({
  get() {
    return dashboardStore.filters.period ?? ['', '']
  },
  set(value) {
    dashboardStore.filters.period = value
  }
})

const groupProxy = computed<string>({
  get() {
    return dashboardStore.filters.group
  },
  set(value) {
    dashboardStore.filters.group = value as GroupType
  }
})

const groupOptions: SelectUIOption[] = [
  { label: 'По дням', value: 'day' },
  { label: 'По неделям', value: 'week' },
  { label: 'По месяцам', value: 'month' }
]

const categoryOptions: SelectUIOption[] = [
  { label: 'Все категории', value: 'all' },
  { label: 'Электроника', value: 'Электроника' },
  { label: 'Бытовая техника', value: 'Бытовая техника' },
  { label: 'Дом и сад', value: 'Дом и сад' }
]

const regionOptions: SelectUIOption[] = [
  { label: 'Все регионы', value: 'all' },
  { label: 'Алматы', value: 'Алматы' },
  { label: 'Астана', value: 'Астана' }
]

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
