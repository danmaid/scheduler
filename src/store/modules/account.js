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
    msalInstance: new Msal.UserAgentApplication(msalConfig)
  },
  mutations: {},
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
    }
  }
}
