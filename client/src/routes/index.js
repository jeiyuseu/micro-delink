import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import NotFound from '@/components/404'

Vue.use(VueRouter)

const Router = new VueRouter({
	base: '/',
	mode: 'history',
	routes: [
		{
			path: '/',
			component: () => import('@/components/Dashboard'),
			name: 'dashboard',
			meta: { title: 'Dashboard', requiredAuth: true },
		},
		{
			path: '/login',
			component: () => import('@/components/Login'),
			name: 'login',
			meta: { title: 'Login', requiredAuth: false },
		},
		{
			path: '/register',
			component: () => import('@/components/Register'),
			name: 'register',
			meta: { title: 'Register', requiredAuth: false },
		},
		{
			path: '/branch',
			component: () => import('@/components/Branch'),
			name: 'branch',
			meta: { title: 'Branch', requiredAuth: true },
			beforeEnter: async (to, from, next) => {
				// if (store.getters['branch/GET_BRANCH'].length === 0) {

				try {
					await store.dispatch('branch/BRANCH_GET_DATA')
					// await store.dispatch('clients/CLIENT_GET_DATA')
					next()
				} catch (error) {
					console.error(error)
					next({ name: '404' })
				}

				// } else {
				//   next()
				// }
			},
			children: [
				{
					props: true,
					path: ':slug',
					component: () => import('@/components/BranchStaff'),
					name: 'branch-staff',
					meta: { title: 'Branch Staff' },
					beforeEnter: async (to, from, next) => {
						const existSlug = await store.getters['branch/BRANCH_GETT_DATA'].find((branch) => branch.slug === to.params.slug)
						if (existSlug) {
							await store.dispatch('branch/BRANCH_GET_DATA_SLUG', to.params.slug)
							next()
						} else {
							next({ name: '404' })
						}
					},
				},
				{
					props: true,
					path: ':slug/:codename',
					component: () => import('@/components/BranchStaffClients'),
					name: 'branch-staff-clients',
					meta: { title: 'Branch Staff Clients' },
					beforeEnter: async (to, from, next) => {
						// const existUuid = await store.getters['gp2/GET_GP2'].find(
						//   (gp2) => gp2.uuid === to.params.uuid
						// )
						// if (existUuid) {

						try {
							await store.dispatch('gp2/GP2_GET_DATA', to.params.codename)
							await store.dispatch('clients/CLIENT_GET_DATA_ALL')
							next()
						} catch (error) {
							console.error(error)
							// next({ name: '404' })
						}

						// } else {
						//   next({ name: '404' })
						// }
					},
				},
				{
					props: true,
					path: ':slug/:codename/completed-accounts',
					component: () => import('@/components/CompletedAccounts'),
					name: 'completed-accounts',
					meta: { title: 'Completed Accounts' },
					beforeEnter: async (to, from, next) => {
						// next()
						// try {
						// 	await store.dispatch('gp2/GP2_GET_DATA_DETAILS', to.params)
						// 	next()
						// } catch (error) {
						// 	console.error(error)
						// 	next({ name: '404' })
						// }

						try {
							await store.dispatch('gp2/GP2_GET_DATA_COMPLETED', to.params.codename)
							next()
						} catch (error) {
							console.error(error)
							// next({ name: '404' })
						}
					},
				},
				{
					props: true,
					path: ':slug/:codename/:uuid',
					component: () => import('@/components/BranchStaffClientsDetails'),
					name: 'branch-staff-clients-details',
					meta: { title: 'Branch Staff Clients Details' },
					beforeEnter: async (to, from, next) => {
						try {
							await store.dispatch('gp2/GP2_GET_DATA_DETAILS', to.params)
							next()
						} catch (error) {
							console.error(error)
							// next({ name: '404' })
						}
					},
				},
			],
		},
		{
			path: '/clients',
			component: () => import('@/components/Clients'),
			name: 'clients',
			meta: { title: 'Clients', requiredAuth: true },
		},
		{
			path: '/staffs',
			component: () => import('@/components/Staffs'),
			name: 'staffs',
			meta: { title: 'Staffs', requiredAuth: true },
			beforeEnter: async (to, from, next) => {
				try {
					await store.dispatch('staffs/STAFF_GET_DATA')
					await store.dispatch('branch/BRANCH_GET_DATA')
					next()
				} catch (error) {
					next({ name: '404' })
					console.error(error)
				}
			},
		},
		{ path: '*', redirect: { name: '404' } },
		{
			path: '/404-not-found',
			name: '404',
			component: NotFound,
			meta: { title: '404 Not Found', requiredAuth: true },
		},
	],
})

Router.beforeEach(async (to, from, next) => {
	document.title = to.meta.title
	const auth = await store.getters['auth/AUTH_GETT_IS_AUTHENTICATED']
	const requiredAuth = to.matched.some((record) => record.meta.requiredAuth)
	if (requiredAuth && !auth) next('login')
	else if (!requiredAuth && auth) next('/')
	else next()
})

export default Router
