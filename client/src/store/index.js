import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import branch from './branch'
import clients from './clients'
import staffs from './staffs'
import gp from './gp'
import info from './info'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {},
	getters: {},
	actions: {},
	mutations: {},
	modules: { auth, branch, clients, staffs, gp, info },
})
