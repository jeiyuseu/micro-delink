import Vue from 'vue'
import App from './App.vue'
import router from './routes'
import api from '@/services/api'
import vuetify from './plugins/vuetify'
import '@mdi/font/css/materialdesignicons.min.css'
import './plugins/vue-toast-notification'
import './plugins/vue-toasted'
import 'typeface-roboto'
import './plugins/vue-progressbar'
import './plugins/moment'
import './plugins/vue-mask'
import './plugins/titleize'
import store from '@/store'
import { sync } from 'vuex-router-sync'

export const EventBus = new Vue()

sync(store, router)
Vue.config.productionTip = false

store
	.dispatch('auth/AUTH_REFRESH_TOKEN')
	.then(({ data }) => {
		api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
		store.commit('auth/AUTH_SET_USER', data.user)
	})
	.finally(() => {
		const app = new Vue({
			store,
			router,
			vuetify,
			render: (h) => h(App),
		}).$mount('#app')

		api.interceptors.request.use((config) => {
			app.$Progress.start() // for every request start the progress
			return config
		})

		api.interceptors.response.use(
			(response) => {
				app.$Progress.finish() // finish when a response is received
				return response
			},
			(error) => {
				app.$Progress.fail() // finish when a response is fail
				return Promise.reject(error)
			}
		)
	})
