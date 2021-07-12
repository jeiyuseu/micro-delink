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
			path: '/branch',
			component: () => import('@/components/Branch'),
			name: 'branch',
			meta: { title: 'Branch', requiredAuth: true },
			beforeEnter: async (to, from, next) => {
				try {
					await store.dispatch('branch/BRANCH_GET_DATA')

					next()
				} catch (error) {
					console.error(error)
					next({ name: '404' })
				}
			},
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
			path: '/gp2',
			component: () => import('@/components/Dashboard'),
			name: 'gp2-dashboard',
			meta: { title: 'GP2 | Dashboard', requiredAuth: true },
			children: [
				{
					path: 'branch',
					component: () => import('@/components/Branch'),
					name: 'gp2-branch',
					meta: { title: 'GP2 | Branch', requiredAuth: true },
					beforeEnter: async (to, from, next) => {
						try {
							await store.dispatch('branch/BRANCH_GET_DATA')

							next()
						} catch (error) {
							console.error(error)
							next({ name: '404' })
						}
					},
					children: [
						{
							props: true,
							path: ':slug',
							component: () => import('@/components/BranchStaff'),
							name: 'branch-staff',
							meta: { title: 'Branch Staff' },
							beforeEnter: async (to, from, next) => {
								const existSlug = await store.getters['branch/BRANCH_GETT_DATA'].find(
									(branch) => branch.slug === to.params.slug
								)
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
							component: () => import('@/components/BranchStaffClusters'),
							name: 'branch-staff-clients',
							meta: { title: 'Branch Staff Clients' },
							beforeEnter: async (to, from, next) => {
								try {
									await store.dispatch('gp/GP_GET_DATA_INFO', to.params.codename)
									next()
								} catch (error) {
									console.error(error)
								}
							},
						},

						{
							props: true,
							path: ':slug/:codename/:codeno',
							component: () => import('@/components/BranchStaffClientCluster'),
							name: 'branch-staff-client-cluster',
							meta: { title: 'Branch Staff Client Cluster' },
							beforeEnter: async (to, from, next) => {
								try {
									await store.dispatch('gp/GP_GET_DATA_CLIENTS', to.params)
									await store.dispatch('clients/CLIENT_GET_DATA_ALL')
									next()
								} catch (error) {
									console.error(error)
								}
							},
						},

						{
							props: true,
							path: ':slug/:codename/:codeno/completed-accounts',
							component: () => import('@/components/CompletedAccounts'),
							name: 'completed-accounts',
							meta: { title: 'Completed Accounts' },
							beforeEnter: async (to, from, next) => {
								try {
									await store.dispatch('gp/GP_GET_DATA_COMPLETED', to.params)
									next()
								} catch (error) {
									console.error(error)
								}
							},
						},
						{
							props: true,
							path: ':slug/:codename/:codeno/:uuid/payments',
							component: () => import('@/components/BranchStaffClientsDetails'),
							name: 'branch-staff-clients-details',
							meta: { title: 'Branch Staff Clients Details' },
							beforeEnter: async (to, from, next) => {
								try {
									await store.dispatch('gp/GP_GET_DATA_DETAILS', to.params)
									next()
								} catch (error) {
									console.error(error)
								}
							},
						},
					],
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
