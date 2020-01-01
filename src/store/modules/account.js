import * as Msal from 'msal'
import { auth as config, api } from 'config'
import loglevel from 'loglevel'
loglevel.setDefaultLevel('debug')
const logger = loglevel.getLogger('account')

const msalConfig = { auth: { clientId: config.clientId } }

export default {
  namespaced: true,
  state: {
    msalInstance: new Msal.UserAgentApplication(msalConfig),
    loggedin: false,
    me: undefined
  },
  mutations: {
    setLoggedin(state, bool) {
      state.loggedin = bool
    },
    setMe(state, me) {
      state.me = me
    }
  },
  getters: {},
  actions: {
    async login({ state, commit }) {
      const res = await state.msalInstance.loginPopup()
      logger.debug(res)
      commit('setLoggedin', true)
    },
    async logout({ state, commit }) {
      const res = await state.msalInstance.logout()
      logger.debug(res)
      commit('setLoggedin', false)
    },
    async getAccessToken({ state, commit }, scopes) {
      if (scopes == null) { scopes = ['user.read'] }
      // const tokenRequest = { scopes: ['user.read', 'Calendars.Read', 'Calendars.Read.Shared', 'User.ReadBasic.All', 'Group.Read.All'] }
      const tokenRequest = { scopes }
      try {
        const res = await state.msalInstance.acquireTokenSilent(tokenRequest)
        logger.debug(res)
        commit('setLoggedin', true)
        return res.accessToken
      } catch (err) {
        if (err.name === 'InteractionRequiredAuthError') {
          const res = await state.msalInstance.acquireTokenPopup(tokenRequest)
          logger.debug(res)
          commit('setLoggedin', true)
          return res.accessToken
        }
      }
    },
    async getMe({ commit, dispatch }) {
      const accessToken = await dispatch('getAccessToken')
      const headers = new Headers()
      headers.append('Authorization', 'Bearer ' + accessToken)
      const url = new URL(`${api.baseurl}/me`)
      const res = await fetch(url, { headers })
      logger.debug(res)
      const data = await res.json()
      commit('setMe', data)
      return data
    }
  }
}
