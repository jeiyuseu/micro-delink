import api from '@/services/api'

export default {
	namespaced: true,
	state: {
		branch: [],
		branchStaff: {},
		slug: null,
	},
	getters: {
		BRANCH_GETT_DATA(state) {
			return state.branch
		},
		BRANCH_GETT_SLUG(state) {
			return state.branchStaff
		},
	},
	actions: {
		BRANCH_GET_DATA: ({ commit }) => {
			return new Promise((resolve, reject) => {
				api
					.get('/branch')
					.then((response) => {
						commit('BRANCH_SET_DATA', response.data)
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		BRANCH_GET_DATA_SLUG: ({ commit }, slug) => {
			return new Promise((resolve, reject) => {
				api
					.get('/branch/' + slug)
					.then((response) => {
						commit('BRANCH_SET_SLUG', response.data)
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		BRANCH_INSERT_DATA(_, credentials) {
			return new Promise((resolve, reject) => {
				api
					.post('/branch', credentials)
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
	},
	mutations: {
		BRANCH_SET_DATA(state, branch) {
			state.branch = branch
		},
		BRANCH_SET_SLUG(state, branchStaff) {
			state.branchStaff = branchStaff
		},
	},
}
