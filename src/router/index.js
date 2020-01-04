import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
  },
  {
    path: '/day',
    name: 'day',
    component: () => import('../views/Day.vue')
  },
  {
    path: '/week',
    name: 'week',
    component: () => import('../views/Week.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
