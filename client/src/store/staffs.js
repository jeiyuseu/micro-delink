import api from '@/services/api'

export default {
	namespaced: true,
	state: {
		staffs: [],
	},
	getters: {
		STAFF_GETT_DATA(state) {
			return state.staffs
		},
	},
	actions: {
		STAFF_GET_DATA: ({ commit }) => {
			return new Promise((resolve, reject) => {
				api
					.get('/staffs')
					.then((response) => {
						commit('STAFF_SET_DATA', response.data)
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		STAFF_INSERT_DATA: (_, payload) => {
			return new Promise((resolve, reject) => {
				api
					.post('/staffs', payload)
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		STAFF_UPDATE_DATA: (_, payload) => {
			return new Promise((resolve, reject) => {
				api
					.patch('/staffs/'+payload.uuid,payload)
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
		STAFF_SET_DATA(state, staffs) {
			state.staffs = staffs
		},
	},
}
