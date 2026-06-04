<template>
  <AppShellLayout title="Админка" content-class="admin-page">
    <header class="admin-header">
      <div>
        <p class="admin-header__eyebrow">Portal Omen Admin</p>
        <h1>Управление платформой</h1>
        <p>Настройка навигации, инструментов и пользователей в одном рабочем контуре.</p>
      </div>

      <div class="admin-header__actions">
        <ButtonUI variant="ghost">История изменений</ButtonUI>
        <ButtonUI variant="primary">Опубликовать</ButtonUI>
      </div>
    </header>

    <section class="admin-summary">
      <CardUI v-for="item in summaryItems" :key="item.label" flat>
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <small>{{ item.caption }}</small>
      </CardUI>
    </section>

    <TabsUI v-model="activeTab" :tabs="tabs" variant="pills" />

    <main class="admin-workspace">
      <section v-if="activeTab === 'sidebar'" class="admin-section">
        <div class="admin-section__head">
          <div>
            <h2>Sidebar</h2>
            <p>Порядок разделов, видимость и быстрые настройки меню портала.</p>
          </div>
          <ButtonUI variant="secondary">Добавить раздел</ButtonUI>
        </div>

        <div class="admin-grid admin-grid--sidebar">
          <CardUI>
            <div class="admin-card-title">
              <h3>Пункты меню</h3>
              <BadgeUI variant="info">Draft</BadgeUI>
            </div>

            <DataTableUI
              :data="sidebarRows"
              :columns="sidebarColumns"
              :height="360"
            />
          </CardUI>

          <CardUI>
            <div class="admin-card-title">
              <h3>Параметры</h3>
              <BadgeUI variant="warning">Local</BadgeUI>
            </div>

            <div class="admin-form-grid">
              <InputUI v-model="sidebarDraft.label" label="Название" />
              <SelectUI v-model="sidebarDraft.type" label="Тип" :options="sidebarTypeOptions" />
              <InputUI v-model="sidebarDraft.path" label="Маршрут" />
              <SelectUI v-model="sidebarDraft.visibility" label="Видимость" :options="visibilityOptions" />
            </div>

            <div class="admin-card-actions">
              <ButtonUI variant="ghost">Сбросить</ButtonUI>
              <ButtonUI variant="primary">Сохранить</ButtonUI>
            </div>
          </CardUI>
        </div>
      </section>

      <section v-else-if="activeTab === 'tools'" class="admin-section">
        <div class="admin-section__head">
          <div>
            <h2>Инструменты</h2>
            <p>Создание runtime-инструментов и подготовка конфигов к публикации.</p>
          </div>
          <ButtonUI variant="primary">Создать инструмент</ButtonUI>
        </div>

        <div class="admin-grid">
          <CardUI>
            <div class="admin-card-title">
              <h3>Новый инструмент</h3>
              <BadgeUI variant="neutral">ToolContract</BadgeUI>
            </div>

            <div class="admin-form-grid admin-form-grid--two">
              <InputUI v-model="toolDraft.title" label="Название" />
              <InputUI v-model="toolDraft.slug" label="Slug" />
              <SelectUI v-model="toolDraft.layout" label="Layout" :options="layoutOptions" />
              <SelectUI v-model="toolDraft.status" label="Статус" :options="toolStatusOptions" />
            </div>

            <div class="admin-card-actions">
              <ButtonUI variant="secondary">Открыть builder</ButtonUI>
              <ButtonUI variant="primary">Создать draft</ButtonUI>
            </div>
          </CardUI>

          <CardUI>
            <div class="admin-card-title">
              <h3>Очередь публикации</h3>
              <BadgeUI variant="success">2 active</BadgeUI>
            </div>

            <DataTableUI
              :data="toolRows"
              :columns="toolColumns"
              :height="300"
            />
          </CardUI>
        </div>
      </section>

      <section v-else class="admin-section">
        <div class="admin-section__head">
          <div>
            <h2>Пользователи</h2>
            <p>Роли, доступ к инструментам и состояние учетных записей.</p>
          </div>
          <ButtonUI variant="primary">Пригласить</ButtonUI>
        </div>

        <div class="admin-grid">
          <CardUI>
            <div class="admin-card-title">
              <h3>Список пользователей</h3>
              <BadgeUI variant="info">PORTAL.core</BadgeUI>
            </div>

            <DataTableUI
              :data="userRows"
              :columns="userColumns"
              :height="360"
            />
          </CardUI>

          <CardUI>
            <div class="admin-card-title">
              <h3>Роли и доступы</h3>
              <BadgeUI variant="warning">Mock</BadgeUI>
            </div>

            <div class="admin-role-list">
              <div v-for="role in roles" :key="role.code" class="admin-role">
                <div>
                  <strong>{{ role.title }}</strong>
                  <span>{{ role.description }}</span>
                </div>
                <BadgeUI :variant="role.system ? 'success' : 'neutral'">
                  {{ role.system ? 'system' : 'custom' }}
                </BadgeUI>
              </div>
            </div>
          </CardUI>
        </div>
      </section>
    </main>
  </AppShellLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import AppShellLayout from '../../components/layout/AppShellLayout.vue'
import BadgeUI from '../../components/ui/BadgeUI.vue'
import ButtonUI from '../../components/ui/ButtonUI.vue'
import CardUI from '../../components/ui/CardUI.vue'
import DataTableUI, { type DataTableColumn, type DataTableRow } from '../../components/ui/DataTableUI.vue'
import InputUI from '../../components/ui/InputUI.vue'
import SelectUI, { type SelectUIOption } from '../../components/ui/SelectUI.vue'
import TabsUI, { type TabsUIItem } from '../../components/ui/TabsUI.vue'

const activeTab = ref('sidebar')

const tabs: TabsUIItem[] = [
  { label: 'Sidebar', value: 'sidebar' },
  { label: 'Инструменты', value: 'tools' },
  { label: 'Пользователи', value: 'users' }
]

const summaryItems = [
  { label: 'Инструменты', value: '2', caption: 'published' },
  { label: 'Draft configs', value: '4', caption: 'ожидают ревью' },
  { label: 'Пользователи', value: '18', caption: 'активные' },
  { label: 'Роли', value: '3', caption: 'system/custom' }
]

const sidebarDraft = ref({
  label: 'Инструменты',
  type: 'section',
  path: '/tools',
  visibility: 'admin'
})

const toolDraft = ref({
  title: 'Новый инструмент',
  slug: 'new-tool',
  layout: 'filters-left-main-stack',
  status: 'draft'
})

const sidebarTypeOptions: SelectUIOption[] = [
  { label: 'Раздел', value: 'section' },
  { label: 'Ссылка', value: 'link' },
  { label: 'Группа', value: 'group' }
]

const visibilityOptions: SelectUIOption[] = [
  { label: 'Администраторы', value: 'admin' },
  { label: 'Все пользователи', value: 'all' },
  { label: 'Скрыт', value: 'hidden' }
]

const layoutOptions: SelectUIOption[] = [
  { label: 'Фильтры слева + контент', value: 'filters-left-main-stack' },
  { label: 'Панель + фильтры + график', value: 'point-filters-chart' }
]

const toolStatusOptions: SelectUIOption[] = [
  { label: 'Draft', value: 'draft' },
  { label: 'Review', value: 'review' },
  { label: 'Published', value: 'published' }
]

const sidebarColumns: DataTableColumn[] = [
  { prop: 'label', label: 'Раздел', minWidth: 140, fixed: true },
  { prop: 'path', label: 'Маршрут', minWidth: 120 },
  { prop: 'order', label: 'Порядок', width: 96, align: 'right', format: 'number' },
  { prop: 'visibility', label: 'Видимость', width: 130 }
]

const sidebarRows: DataTableRow[] = [
  { label: 'Дашборд', path: '/', order: 1, visibility: 'all' },
  { label: 'Инструменты', path: '/tools', order: 2, visibility: 'all' },
  { label: 'Админка', path: '/admin', order: 3, visibility: 'admin' },
  { label: 'Документация', path: '/docs', order: 4, visibility: 'admin' }
]

const toolColumns: DataTableColumn[] = [
  { prop: 'title', label: 'Инструмент', minWidth: 140, fixed: true },
  { prop: 'slug', label: 'Slug', width: 120 },
  { prop: 'status', label: 'Статус', width: 110 },
  { prop: 'version', label: 'Версия', width: 90, align: 'right', format: 'number' }
]

const toolRows: DataTableRow[] = [
  { title: 'Пуаро', slug: 'poirot', status: 'published', version: 1 },
  { title: 'Мантика', slug: 'mantica', status: 'published', version: 1 },
  { title: 'Промо монитор', slug: 'promo-monitor', status: 'draft', version: 1 }
]

const userColumns: DataTableColumn[] = [
  { prop: 'name', label: 'Пользователь', minWidth: 160, fixed: true },
  { prop: 'role', label: 'Роль', width: 130 },
  { prop: 'status', label: 'Статус', width: 120 },
  { prop: 'tools', label: 'Инструменты', width: 120, align: 'right', format: 'number' }
]

const userRows: DataTableRow[] = [
  { name: 'Алексей Демин', role: 'admin', status: 'active', tools: 2 },
  { name: 'Мария Орлова', role: 'manager', status: 'active', tools: 1 },
  { name: 'Иван Ковалев', role: 'user', status: 'blocked', tools: 0 }
]

const roles = [
  { code: 'admin', title: 'Администратор', description: 'Полный доступ к платформе и публикации.', system: true },
  { code: 'manager', title: 'Менеджер', description: 'Работа с инструментами и просмотр данных.', system: false },
  { code: 'user', title: 'Пользователь', description: 'Базовый доступ к опубликованным инструментам.', system: true }
]
</script>
