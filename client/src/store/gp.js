import api from '@/services/api'
import routes from '@/routes'
export default {
	namespaced: true,
	state: {
		gpInfo: {},
		gpClients: {},
		gpDetails: {},
		gpCompleted: {},
		gpWithdrawals: {},
		gpInfoCodename: {},
	},
	getters: {
		GP_GETT_DATA_INFO: (state) => {
			return state.gpInfo
		},
		GP_GETT_DATA_CLIENTS: (state) => {
			return state.gpClients
		},
		GP_GETT_DATA_DETAILS: (state) => {
			return state.gpDetails
		},
		GP_GETT_DATA_WITHDRAWALS: (state) => {
			return state.gpWithdrawals
		},
		GP_GETT_DATA_COMPLETED: (state) => {
			return state.gpCompleted
		},
	},
	actions: {
		GP_GET_DATA_INFO: ({ commit }, codename) => {
			return new Promise((resolve, reject) => {
				api
					.get(`gp/${codename}`)
					.then((response) => {
						commit('GP_SET_DATA_INFO', response.data)
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP_GET_DATA_CLIENTS: ({ commit }, payload) => {
			const { codename, codeno } = payload
			return new Promise((resolve, reject) => {
				api
					.get(`gp/${codename}/${codeno}`)
					.then((response) => {
						commit('GP_SET_DATA_CLIENTS', response.data)
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP_GET_DATA_COMPLETED: ({ commit }, payload) => {
			const { codename, codeno } = payload
			return new Promise((resolve, reject) => {
				api
					.get(`gp/${codename}/${codeno}/completed-accounts`)
					.then((response) => {
						commit('GP_SET_DATA_COMPLETED', response.data)
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP_GET_DATA_WITHDRAWALS: ({ commit }, payload) => {
			const { codename, codeno } = payload
			return new Promise((resolve, reject) => {
				api
					.get(`gp/${codename}/${codeno}/withdrawals`)
					.then((response) => {
						commit('GP_SET_DATA_COMPLETED', response.data)
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP_INSERT_CLUSTER: (context, payload) => {
			const { codename } = routes.currentRoute.params
			return new Promise((resolve, reject) => {
				api
					.post(`gp/${codename}`, { ...payload })
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP_INSERT_CLUSTER_CLIENT: (context, payload) => {
			const { codename, codeno } = routes.currentRoute.params

			return new Promise((resolve, reject) => {
				api
					.post(`gp/${codename}/${codeno}`, payload)
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP_UPDATE_CLIENT: ({ rootGetters }, payload) => {
			const { uuid, installment, sk, penalty } = payload
			const { codename } = routes.currentRoute.params
			return new Promise((resolve, reject) => {
				api
					.patch(`gp/${codename}/${uuid}/update-client`, {
						installment,
						sk,
						penalty,
						userId: rootGetters['auth/AUTH_GETT_USER'].uuid,
					})
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP_EDIT_CLIENT: ({ rootGetters }, payload) => {
			//future update
			//change client when editing
			const { uuid, lr, skCum, wi, pastDue } = payload
			const { codename } = routes.currentRoute.params
			return new Promise((resolve, reject) => {
				api
					.patch(`gp/${codename}/${uuid}/edit-client`, {
						uuid,
						lr,
						wi,
						skCum,
						pastDue,
						userId: rootGetters['auth/AUTH_GETT_USER'].uuid,
					})
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP_EDIT_CLIENT_COMPLETED: ({ rootGetters }, payload) => {
			//future update
			//change client when editing
			const { uuid, lr, skCum, wi, pastDue } = payload
			const { codename } = routes.currentRoute.params
			return new Promise((resolve, reject) => {
				api
					.patch(`gp/${codename}/${uuid}/edit-client-completed`, {
						uuid,
						lr,
						wi,
						skCum,
						pastDue,
						userId: rootGetters['auth/AUTH_GETT_USER'].uuid,
					})
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP_DELETE_CLIENT: ({ rootGetters }, payload) => {
			const { uuid } = payload
			const { codename } = routes.currentRoute.params
			return new Promise((resolve, reject) => {
				api
					.delete(`gp/${codename}/${uuid}/delete-client`)
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP_DELETE_CLIENT_COMPLETED: ({ rootGetters }, payload) => {
			const { uuid } = payload
			const { codename } = routes.currentRoute.params
			return new Promise((resolve, reject) => {
				api
					.delete(`gp/${codename}/${uuid}/delete-client-completed`)
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP_DELETE_INFO: ({ rootGetters }, payload) => {
			const { uuid } = payload
			const { codename } = routes.currentRoute.params
			return new Promise((resolve, reject) => {
				api
					.delete(`gp/${codename}/${uuid}/delete-info`)
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP_RENEW: ({ _ }, payload) => {
			const { codename } = routes.currentRoute.params
			return new Promise((resolve, reject) => {
				api
					.patch(`gp/${codename}/completed-accounts/${payload.uuid}/renew`, payload)
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP_RELOAN: ({ _ }, payload) => {
			const { codename } = routes.currentRoute.params
			return new Promise((resolve, reject) => {
				api
					.patch(`gp/${codename}/completed-accounts/${payload.uuid}/reloan`, payload)
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP_GET_DATA_DETAILS: ({ commit }, payload) => {
			const { codename, uuid } = payload
			return new Promise((resolve, reject) => {
				api
					.get(`gp/${codename}/${uuid}/payments`)
					.then((response) => {
						commit('GP_SET_DATA_DETAILS', response.data.msg)
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP_EDIT_DETAILS: ({ commit }, payload) => {
			const { uuid, payment, sk, penalty } = payload
			const { codename } = routes.currentRoute.params
			return new Promise((resolve, reject) => {
				api
					.patch(`gp/${codename}/${payload.uuid}/edit-details`, { uuid, payment, sk, penalty })
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},

		GP_EXPORT_XLSX: ({ _ }, codename) => {
			return new Promise((resolve, reject) => {
				api
					.get(`gp/${codename}/export`)
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP_EDIT_INFO: ({ _ }, payload) => {
			const { uuid, codeNameId, dateOfFirstPayment, dateOfLastPayment, dateOfReleased, weeksToPay } = payload
			const { codename } = routes.currentRoute.params
			return new Promise((resolve, reject) => {
				api
					.patch(`gp/${codename}/${uuid}/edit-info`, {
						codename: codeNameId,
						dateOfFirstPayment,
						dateOfLastPayment,
						dateOfReleased,
						weeksToPay,
					})
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GP_CLUSTER_RESOLUTION: ({ _ }, payload) => {
			const { uuid } = payload
			const { codename } = routes.currentRoute.params
			return new Promise((resolve, reject) => {
				api
					.patch(`gp/${codename}/${uuid}/cluster-resolution`)
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
		GP_SET_DATA_INFO: (state, data) => {
			state.gpInfo = data
		},
		GP_SET_DATA_CLIENTS: (state, data) => {
			state.gpClients = data
		},
		GP_SET_DATA_DETAILS: (state, data) => {
			state.gpDetails = data
		},
		GP_SET_DATA_COMPLETED: (state, data) => {
			state.gpCompleted = data
		},
		GP_SET_DATA_WITHDRAWALS: (state, data) => {
			state.gpWithdrawals = data
		},
	},
}
