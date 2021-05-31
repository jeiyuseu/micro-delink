import api from '@/services/api'
export default {
	namespaced: true,
	state: {
		gp2: {},
		gp2Details: {},
		gp2Completed: {},
		gp2InfoCodename: {},
	},
	getters: {
		GP2_GETT_DATA: (state) => {
			return state.gp2
		},
		GP2_GETT_DATA_DETAILS: (state) => {
			return state.gp2Details
		},
		GP2_GETT_DATA_COMPLETED: (state) => {
			return state.gp2Completed
		},
		GP2_GETT_DATA_INFO_CODENAME: (state) => {
			return state.gp2InfoCodename
		},
	},
	actions: {
		GP2_GET_DATA: ({ commit }, codename) => {
			return new Promise((resolve, reject) => {
				api
					.get(`gp2/${codename}`)
					.then((response) => {
						commit('GP2_SET_DATA', response.data)
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP2_GET_DATA_COMPLETED: ({ commit }, codename) => {
			return new Promise((resolve, reject) => {
				api
					.get(`gp2/${codename}/completed-accounts`)
					.then((response) => {
						commit('GP2_SET_DATA_COMPLETED', response.data)
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP2_RELOAN: ({ _ }, payload) => {
			return new Promise((resolve, reject) => {
				api
					.patch(`gp2/${payload.codename}/completed-accounts`, payload.payload)
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP2_INSERT_CLIENT: ({ commit }, payload) => {
			return new Promise((resolve, reject) => {
				api
					.post(`gp2/${payload.codename}`, { ...payload })
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP2_UPDATE_CLIENT: ({ _ }, payload) => {
			return new Promise((resolve, reject) => {
				api
					.patch(`gp2/${payload.codename}`, { ...payload })
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP2_GET_DATA_DETAILS: ({ commit }, payload) => {
			return new Promise((resolve, reject) => {
				api
					.get(`gp2/${payload.codename}/${payload.uuid}`)
					.then((response) => {
						commit('GP2_SET_DATA_DETAILS', response.data.response)
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},

		GP2_UPDATE_DETAILS: ({ commit }, payload) => {
			return new Promise((resolve, reject) => {
				api
					.patch(`gp2/${payload.codename}/${payload.uuid}`, { ...payload })
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},

		GP2_EXPORT_XLSX: ({ _ }, codename) => {
			return new Promise((resolve, reject) => {
				api
					.get(`gp2/${codename}/export`)
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP2_INFO_CODENAME: ({ commit }, codename) => {
			return new Promise((resolve, reject) => {
				api
					.get(`gp2/${codename}/info`)
					.then((response) => {
						commit('GP2_SET_DATA_INFO_CODENAME', response.data)
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
	},
	mutations: {
		GP2_SET_DATA: (state, data) => {
			state.gp2 = data
		},
		GP2_SET_DATA_DETAILS: (state, data) => {
			state.gp2Details = data
		},
		GP2_SET_DATA_COMPLETED: (state, data) => {
			state.gp2Completed = data
		},
		GP2_SET_DATA_INFO_CODENAME: (state, data) => {
			state.gp2InfoCodename = data
		},
	},
}
