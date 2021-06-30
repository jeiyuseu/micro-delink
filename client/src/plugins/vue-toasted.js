import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted, {
	theme: 'toasted-primary',
	position: 'top-right',
	duration: 10000,
	keepOnHover: true,
	className: ['toasting'],
	iconPack: 'mdi',
})
