import { api as config } from 'config'
import loglevel from 'loglevel'
loglevel.setDefaultLevel('debug')
const logger = loglevel.getLogger('account')

export default {
  namespaced: true,
  state: {
    users: undefined,
    userCalendars: undefined,
    groups: undefined,
    groupCalendars: undefined
  },
  mutations: {
    setUsers(state, payload) {
      state.users = payload
    },
    setUserCalendars(state, payload) {
      state.userCalendars = payload
    },
    setGroups(state, payload) {
      state.groups = payload
    },
    setGroupCalendars(state, payload) {
      state.groupCalendars = payload
    }
  },
  getters: {},
  actions: {
    async getUserCalendars({ commit, dispatch }) {
      const accessToken = await dispatch('account/getAccessToken', null, { root: true })
      const headers = new Headers()
      headers.append('Authorization', 'Bearer ' + accessToken)
      const url = new URL(`${config.baseurl}/users`)
      url.searchParams.append('$select', 'id,displayName')
      const res = await fetch(url, { headers })
      logger.debug(res)
      const data = await res.json()
      commit('setUsers', data.value)
      const calendars = []
      for (let user of data.value) {
        const url = new URL(`${config.baseurl}/users/${user.id}/calendar`)
        url.searchParams.append('$select', 'id,owner')
        const res = await fetch(url, { headers })
        logger.debug(res)
        if (res.ok) {
          const data = await res.json()
          logger.debug(data)
          data.userId = user.id
          data.name = data.owner.name
          calendars.push(data)
        }
      }
      commit('setUserCalendars', calendars)
    },
    async getGroupCalendars({ commit, dispatch }) {
      const accessToken = await dispatch('account/getAccessToken', null, { root: true })
      const headers = new Headers()
      headers.append('Authorization', 'Bearer ' + accessToken)
      const url = new URL(`${config.baseurl}/groups`)
      url.searchParams.append('$select', 'id,displayName')
      const res = await fetch(url, { headers })
      logger.debug(res)
      const data = await res.json()
      commit('setGroups', data.value)
      const calendars = []
      for (let group of data.value) {
        const url = new URL(`${config.baseurl}/groups/${group.id}/calendar`)
        url.searchParams.append('$select', 'id,owner')
        const res = await fetch(url, { headers })
        logger.debug(res)
        if (res.ok) {
          const data = await res.json()
          logger.debug(data)
          data.groupId = group.id
          data.name = data.owner.name
          calendars.push(data)
        }
      }
      commit('setGroupCalendars', calendars)
    },
    async getCalendarView({ dispatch }, { baseUrl, startDateTime, endDateTime }) {
      logger.debug(baseUrl, startDateTime, endDateTime)
      const accessToken = await dispatch('account/getAccessToken', null, { root: true })
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
  }
}
