import Vue from 'vue'
import App from './App.vue'
import router from './routes'
import api from '@/services/api.js'

import vuetify from './plugins/vuetify'
import '@mdi/font/css/materialdesignicons.min.css'
import './plugins/vue-toast-notification'
import 'typeface-roboto'
import './plugins/vue-progressbar'
import './plugins/moment'
import './plugins/vue-mask'

import { sync } from 'vuex-router-sync'
import store from '@/store'

Vue.config.productionTip = false

sync(store, router)

store
	.dispatch('auth/AUTH_REFRESH_TOKEN')
	.then(({ data }) => {
		api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
		store.commit('auth/AUTH_SET_USER', data.user)
	})
	.finally(() => {
		new Vue({
			vuetify,
			store,
			router,
			render: (h) => h(App),
		}).$mount('#app')
	})
