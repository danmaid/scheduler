import Vue from 'vue'
import Vuex from 'vuex'
import account from './modules/account'

import loglevel from 'loglevel'
loglevel.setDefaultLevel('debug')
const logger = loglevel.getLogger('store')

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    calendarList: load(),
    baseDate: new Date(new Date().setHours(0, 0, 0, 0))
  },
  mutations: {
    setBaseDate(state, date) {
      state.baseDate = date
    }
  },
  actions: {
    async getCalendarView({ dispatch }, { baseUrl, startDateTime, endDateTime }) {
      logger.debug(baseUrl, startDateTime, endDateTime)
      const accessToken = await dispatch('account/getAccessToken')
      const headers = new Headers()
      headers.append('Authorization', 'Bearer ' + accessToken)
      headers.append('Prefer', 'outlook.timezone="Tokyo Standard Time"')
      const url = new URL(`${baseUrl}/calendarView`)
      url.searchParams.append('startDateTime', startDateTime.toISOString())
      url.searchParams.append('endDateTime', endDateTime.toISOString())
      const res = await fetch(url, { headers })
      logger.debug(res)
      const data = await res.json()
      return data.value.map(v => ({
        id: v.id,
        subject: v.subject,
        start: new Date(v.start.dateTime),
        end: new Date(v.end.dateTime)
      }))
    }
  },
  modules: {
    account
  }
})

function load() {
  try {
    return JSON.parse(localStorage.getItem('calendarList'))
  } catch {
    return []
  }
}

store.watch(state => state.calendarList, newValue => {
  logger.info('changed', newValue)
  localStorage.setItem('calendarList', JSON.stringify(newValue))
})

export default store
