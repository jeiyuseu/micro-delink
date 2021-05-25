import jwtDecode from 'jwt-decode'
import api from '@/services/api'

export default {
	namespaced: true,
	state: {
		user: null,
	},
	mutations: {
		AUTH_SET_USER: (state, user) => {
			state.user = user
		},
	},
	getters: {
		AUTH_GETT_IS_AUTHENTICATED: (state) => {
			return !!state.user
		},

		AUTH_GETT_USER: (state) => {
			return state.user
		},
	},
	actions: {
		AUTH_LOG_IN: (context, credentials) => {
			return new Promise((resolve, reject) => {
				api
					.post('/login', credentials)
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},

		AUTH_REGISTER: (context, credentials) => {
			return new Promise((resolve, reject) => {
				api
					.post('/register', credentials)
					.then((response) => {
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},

		AUTH_REFRESH_TOKEN: ({ commit, dispatch }, token) => {
			return new Promise((resolve, reject) => {
				api
					.post('/auth', { token })
					.then((response) => {
						api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
						commit('AUTH_SET_USER', response.data.user)
						dispatch('AUTH_AUTO_REFRESH_TOKEN', response.data.token)
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},

		AUTH_AUTO_REFRESH_TOKEN: ({ dispatch }, token) => {
			const { exp } = jwtDecode(token)
			const now = Date.now() / 1000
			let onRefresh = exp - now
			setTimeout(() => dispatch('AUTH_REFRESH_TOKEN', token), onRefresh * 1000 - 500)
		},

		AUTH_LOG_OUT: ({ commit }) => {
			return new Promise((resolve, reject) => {
				api
					.get('/logout')
					.then((response) => {
						commit('AUTH_SET_USER', null)
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
	},
}
