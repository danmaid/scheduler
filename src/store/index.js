import Vue from 'vue'
import Vuex from 'vuex'
import account from './modules/account'
import calendars from './modules/calendars'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    account,
    calendars
  }
})
