import Vue from 'vue'
import Vuex from 'vuex'
import microsoft from './modules/microsoft'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    calendars: load(),
    baseDate: new Date(new Date().setHours(0, 0, 0, 0))
  },
  mutations: {
    setBaseDate(state, date) {
      state.baseDate = date
    },
    setCalendars(state, list) {
      state.calendars = list
    }
  },
  actions: {
    async getCalendarView({ dispatch }, { baseUrl, startDateTime, endDateTime }) {
      console.debug(baseUrl, startDateTime, endDateTime)
      const accessToken = await dispatch('account/getAccessToken')
      const headers = new Headers()
      headers.append('Authorization', 'Bearer ' + accessToken)
      headers.append('Prefer', 'outlook.timezone="Tokyo Standard Time"')
      const url = new URL(`${baseUrl}/calendarView`)
      url.searchParams.append('startDateTime', startDateTime.toISOString())
      url.searchParams.append('endDateTime', endDateTime.toISOString())
      const res = await fetch(url, { headers })
      console.debug(res)
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
    microsoft
  }
})

function load() {
  try {
    return JSON.parse(localStorage.getItem('calendars')) || []
  } catch {
    return []
  }
}

store.watch(state => state.calendars, v => {
  console.info('calendars saved.', v)
  localStorage.setItem('calendars', JSON.stringify(v))
})

export default store
