import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import branch from './branch'
import clients from './clients'
import staffs from './staffs'
import gp2 from './gp2'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  getters: {},
  actions: {},
  mutations: {},
  modules: { auth, branch, clients, staffs,gp2 },
})
