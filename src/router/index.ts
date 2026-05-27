import { createRouter, createWebHashHistory } from 'vue-router'

import DashboardView from '../views/dashboard/DashboardView.vue'
import ToolsCatalogView from '../views/tools/ToolsCatalogView.vue'
import ToolRuntimeView from '../views/tools/ToolRuntimeView.vue'
import UIShowcase from '../views/ui/UIShowcase.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/tools',
      name: 'tools-catalog',
      component: ToolsCatalogView
    },
    {
      path: '/tools/:slug',
      name: 'tool-runtime',
      component: ToolRuntimeView
    },
    {
      path: '/ui',
      name: 'ui-showcase',
      component: UIShowcase
    }
  ]
})
