import api from '@/services/api'

export default {
	namespaced: true,
	state: {
		client: [],
		clients: [],
		options: {},
		search: '',
	},
	getters: {
		CLIENT_GETT_DATA(state) {
			return state.client
		},
		CLIENT_GETT_DATA_ALL(state) {
			return state.clients
		},
		CLIENT_GETT_OPTIONS(state) {
			return state.options
		},
	},
	actions: {
		CLIENT_GET_DATA: ({ commit, state }) => {
			const payload = {}
			payload.page = state.options.page
			payload.items = state.options.itemsPerPage
			if (state.search) {
				payload.search = state.search
			}

			return new Promise((resolve, reject) => {
				api
					.get('/clients', { params: payload })
					.then((response) => {
						commit('CLIENT_SET_DATA', response.data)
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},

		CLIENT_GET_DATA_ALL: ({ commit }) => {
			return new Promise((resolve, reject) => {
				api
					.get('/clients')
					.then((response) => {
						commit('CLIENT_SET_CLIENTS_ALL', response.data)
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},

		CLIENT_INSERT_DATA: (_, payload) => {
			return new Promise((resolve, reject) => {
				api
					.post('/clients', payload)
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		CLIENT_UPDATE: (_, payload) => {
			return new Promise((resolve, reject) => {
				api
					.patch('/clients/' + payload.id, payload)
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		CLIENT_DELETE: (_, id) => {
			return new Promise((resolve, reject) => {
				api
					.delete('/clients/' + id)
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
		CLIENT_SET_DATA(state, data) {
			state.client = data
		},
		CLIENT_SET_CLIENTS_ALL(state, data) {
			state.clients = data
		},
		CLIENT_SET_OPTIONS(state, options) {
			state.options = options
		},
		CLIENT_SET_SEARCH(state, search) {
			state.search = search
		},
	},
}
