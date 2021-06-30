export default {
	namespaced: true,
	state: {
		info: '',
		uuid: '',
		status: '',
	},
	actions: {},
	mutations: {
		SET_INFO: (state, value) => {
			state.info = value
		},
		SET_UUID: (state, value) => {
			state.uuid = value
		},
		SET_STATUS: (state, value) => {
			state.status = value
		},
	},
	getters: {
		INFO_GETT: (state) => {
			return state.info
		},
		UUID_GETT: (state) => {
			return state.uuid
		},
		STATUS_GETT: (state) => {
			return state.status
		},
	},
}
