import { createRouter, createWebHashHistory } from 'vue-router'

import DashboardView from '../views/dashboard/DashboardView.vue'
import ManticaView from '../views/ManticaView.vue'
import PoirotView from '../views/PoirotView.vue'
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
      path: '/poirot',
      name: 'poirot',
      component: PoirotView
    },
    {
      path: '/mantica',
      name: 'mantica',
      component: ManticaView
    },
    {
      path: '/ui',
      name: 'ui-showcase',
      component: UIShowcase
    }
  ]
})
