<template>
  <aside
    class="app-sidebar"
    :class="{
      'app-sidebar--collapsed': collapsed,
      'app-sidebar--mobile-open': mobileOpen
    }"
  >
    <div class="sidebar-logo">
      <div class="sidebar-logo__brand">
        <svg
          class="sidebar-logo__icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.9423 3.05768C23.4117 5.52701 21.4099 11.5324 16.4712 16.4711C11.5326 21.4097 5.5272 23.4115 3.05787 20.9422C0.588547 18.4728 2.59033 12.4675 7.52899 7.5288C12.4676 2.59014 18.473 0.588345 20.9423 3.05768ZM3.05768 3.05782C0.588349 5.52715 2.59013 11.5325 7.52879 16.4712C12.4674 21.4099 18.4728 23.4117 20.9421 20.9423C23.4115 18.473 21.4097 12.4676 16.471 7.52894C11.5324 2.59028 5.527 0.588485 3.05768 3.05782Z"
            stroke-width="1.5"
          />
          <path
            d="M14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5C13.3807 9.5 14.5 10.6193 14.5 12Z"
            stroke-width="1.5"
          />
        </svg>

        <span class="sidebar-label">OMEN</span>
      </div>

      <button
        class="sidebar-toggle"
        type="button"
        :aria-label="collapsed ? 'Развернуть меню' : 'Свернуть меню'"
        @click="$emit('toggle')"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            :d="collapsed ? 'M9 6L15 12L9 18' : 'M15 6L9 12L15 18'"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <nav class="sidebar-menu">
      <button
        v-for="item in menuItems"
        :key="item.label"
        class="sidebar-menu__item"
        :class="{ active: isActiveItem(item.path) }"
        :title="collapsed ? item.label : undefined"
        @click="item.action?.()"
      >
        <svg
          class="sidebar-menu__icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            :d="item.icon"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <span class="sidebar-label">{{ item.label }}</span>
      </button>
    </nav>

    <div class="sidebar-support">
      <div class="sidebar-support__title">Нужна помощь?</div>
      <div class="sidebar-support__text">Обратитесь в поддержку</div>
      <button class="sidebar-support__button">Написать</button>
    </div>

    <div class="sidebar-profile">
      <div class="sidebar-profile__avatar">AD</div>

      <div class="sidebar-profile__info">
        <div class="sidebar-profile__name">Алексей Демин</div>
        <div class="sidebar-profile__role">Администратор</div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getToolNavigationItems } from '../../services/toolRegistry'

defineProps<{
  collapsed?: boolean
  mobileOpen?: boolean
}>()

const emit = defineEmits<{
  toggle: []
  close: []
}>()

const route = useRoute()
const router = useRouter()

const currentPath = computed(() => route.path)

const menuItems = [
  { label: 'Дашборд', path: '/', icon: 'M4 13h6V4H4v9ZM14 20h6V4h-6v16ZM4 20h6v-3H4v3Z', action: goDashboard },
  ...getToolNavigationItems().map((item) => ({
    label: item.label,
    path: item.path,
    icon: item.icon,
    action: () => goPath(item.path)
  })),
  { label: 'UI Kit', path: '/ui', icon: 'M12 3L4 7l8 4 8-4-8-4ZM4 12l8 4 8-4M4 17l8 4 8-4', action: goShowcase },
  { label: 'Документация', path: '/docs', icon: 'M5 4h10a4 4 0 0 1 4 4v12H7a2 2 0 0 1-2-2V4ZM7 4v14M9 8h6M9 12h6', action: () => goPath('/docs') },
  { label: 'Продажи', icon: 'M4 19h16M7 16V9M12 16V5M17 16v-4' },
  { label: 'Клиенты', icon: 'M16 11a4 4 0 1 0-8 0M4 20a8 8 0 0 1 16 0' },
  { label: 'Товары', icon: 'M6 7h12l-1 13H7L6 7ZM9 7a3 3 0 0 1 6 0' },
  { label: 'Маркетинг', icon: 'M4 13l4-8v14l-4-6ZM8 13h4l8 4V7l-8 4H8' },
  { label: 'Финансы', icon: 'M12 3v18M17 7.5C16.2 6.6 14.7 6 12.8 6 10.2 6 8 7.1 8 9s2 2.5 4 3 4 1 4 3-2 3-4.5 3C9.7 18 8.2 17.4 7 16.5' },
  { label: 'Настройки', icon: 'M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5ZM19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5l-.3 3a7 7 0 0 0-1.7 1L5.1 6l-2 3.5 2 1.5A7 7 0 0 0 5 12c0 .3 0 .7.1 1l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.3 3h5l.3-3a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5c.1-.3.1-.7.1-1Z' }
]

function goDashboard() {
  goPath('/')
}

function goShowcase() {
  goPath('/ui')
}

function goPath(path: string) {
  router.push(path)
  emit('close')
}

function isActiveItem(path?: string) {
  if (!path) {
    return false
  }

  if (path === '/tools') {
    return currentPath.value === '/tools' || currentPath.value.startsWith('/tools/')
  }

  return path === currentPath.value
}
</script>
