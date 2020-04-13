import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/settings',
      name: 'settings',
      component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
    },
    {
      path: '/custom/:value',
      name: 'custom',
      props: true,
      component: () => import('../views/Custom.vue')
    },
    {
      path: '/custom',
      redirect: { name: 'custom', params: { value: 'new' } }
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
})

export default router
