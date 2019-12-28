import * as Msal from 'msal'
import { auth as config } from 'config'
import loglevel from 'loglevel'
loglevel.setDefaultLevel('debug')
const logger = loglevel.getLogger('account')

const msalConfig = {
  auth: {
    clientId: config.clientId
  }
}

export default {
  namespaced: true,
  state: {
    msalInstance: new Msal.UserAgentApplication(msalConfig),
    me: undefined,
    calendars: undefined,
    calendarGroups: undefined,
    calendarGroupCalendars: undefined,
    groups: undefined,
    groupsCalendars: undefined
  },
  mutations: {
    setMe(state, payload) {
      state.me = payload
    },
    setCalendars(state, payload) {
      state.calendars = payload
    },
    setCalendarGroups(state, payload) {
      state.calendarGroups = payload
    },
    setCalendarGroupCalendars(state, payload) {
      state.calendarGroupCalendars = payload
    },
    setGroups(state, payload) {
      state.groups = payload
    },
    setGroupsCalendars(state, payload) {
      state.groupsCalendars = payload
    }
  },
  getters: {},
  actions: {
    async login({ state }) {
      const res = await state.msalInstance.loginPopup()
      logger.debug(res)
    },
    async getAccessToken({ state }) {
      const tokenRequest = { scopes: ['user.read', 'Calendars.Read', 'Calendars.Read.Shared', 'User.ReadBasic.All', 'Group.Read.All'] }
      try {
        const res = await state.msalInstance.acquireTokenSilent(tokenRequest)
        logger.debug(res)
        return res.accessToken
      } catch (err) {
        if (err.name === 'InteractionRequiredAuthError') {
          const res = await state.msalInstance.acquireTokenPopup(tokenRequest)
          logger.debug(res)
          return res.accessToken
        }
      }
    },
    async getMe({ commit, dispatch }) {
      const accessToken = await dispatch('getAccessToken')
      const headers = new Headers()
      headers.append('Authorization', 'Bearer ' + accessToken)
      const res = await fetch('https://graph.microsoft.com/v1.0/me', { headers })
      logger.debug(res)
      const data = await res.json()
      commit('setMe', data)
    },
    async getCalendars({ commit, dispatch }) {
      const accessToken = await dispatch('getAccessToken')
      const headers = new Headers()
      headers.append('Authorization', 'Bearer ' + accessToken)
      const res = await fetch('https://graph.microsoft.com/v1.0/me/calendars', { headers })
      logger.debug(res)
      const data = await res.json()
      commit('setCalendars', data)
    },
    async getCalendarGroups({ commit, dispatch }) {
      const accessToken = await dispatch('getAccessToken')
      const headers = new Headers()
      headers.append('Authorization', 'Bearer ' + accessToken)
      const res = await fetch('https://graph.microsoft.com/v1.0/me/calendarGroups', { headers })
      logger.debug(res)
      const data = await res.json()
      commit('setCalendarGroups', data)
    },
    async getCalendarGroupCalendars({ commit, dispatch }) {
      const accessToken = await dispatch('getAccessToken')
      const headers = new Headers()
      headers.append('Authorization', 'Bearer ' + accessToken)
      const res = await fetch('https://graph.microsoft.com/v1.0/me/calendarGroups', { headers })
      logger.debug(res)
      const groups = await res.json()
      for (let group of groups.value) {
        const res = await fetch(`https://graph.microsoft.com/v1.0/me/calendarGroups/${group.id}/calendars`, { headers })
        logger.debug(res)
        const data = await res.json()
        logger.debug(data)
      }
    },
    async getGroups({ commit, dispatch }) {
      const accessToken = await dispatch('getAccessToken')
      const headers = new Headers()
      headers.append('Authorization', 'Bearer ' + accessToken)
      const res = await fetch('https://graph.microsoft.com/v1.0/groups', { headers })
      logger.debug(res)
      const data = await res.json()
      commit('setGroups', data)
    },
    async getGroupsCalendars({ commit, dispatch }) {
      const accessToken = await dispatch('getAccessToken')
      const headers = new Headers()
      headers.append('Authorization', 'Bearer ' + accessToken)
      const res = await fetch('https://graph.microsoft.com/v1.0/groups', { headers })
      logger.debug(res)
      const data = await res.json()
      const calendars = []
      for (let group of data.value) {
        const res = await fetch(`https://graph.microsoft.com/v1.0/groups/${group.id}/calendar`, { headers })
        logger.debug(res)
        const data = await res.json()
        logger.debug(data)
        calendars.push(data)
      }
      commit('setGroupsCalendars', calendars)
    }
  }
}
