import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/settings', name: 'settings', component: () => import('../views/Settings.vue') },
    { path: '/week/:date', name: 'week', props: true, component: () => import('../views/Week.vue') },
    { path: '/week', redirect: { name: 'week', params: { date: formatDate(new Date()) } } },
    { path: '/custom/:value', name: 'custom', props: true, component: () => import('../views/Custom.vue') },
    { path: '/custom', redirect: { name: 'custom', params: { value: 'new' } } },
    { path: '/day/:date', name: 'day', props: true, component: () => import('../views/Day.vue') },
    { path: '/day', redirect: { name: 'day', params: { date: formatDate(new Date()) } } },
    { path: '/', redirect: '/week' }
  ]
})

function formatDate(date: Date) {
  const yyyy = date.getFullYear()
  const mm = ('00' + (date.getMonth() + 1)).slice(-2)
  const dd = ('00' + date.getDate()).slice(-2)
  return `${yyyy}-${mm}-${dd}`
}

export default router
