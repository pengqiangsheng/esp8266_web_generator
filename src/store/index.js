import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    mqttConfig: {}
  },
  mutations: {
    SETCONFIG (state, config) {
      state.mqttConfig = config
    }
  },
  actions: {
    initConfig ({ commit }, config) {
      commit('SETCONFIG', config)
    }
  },
  getters: {
    mqttConfig: state => {
      return state.mqttConfig
    }
  }
})

export default store