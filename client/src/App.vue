<template>
	<v-app id="app">
		<v-app-bar elevation="1" class="blue darken-4 " app fixed>
			<v-app-bar-nav-icon color="white" v-if="AUTH_GETT_IS_AUTHENTICATED" @click="drawer = !drawer"></v-app-bar-nav-icon>
			<v-toolbar-title class="overline font-weight-black text-uppercase white--text">Micro-Delink</v-toolbar-title>
			<v-spacer></v-spacer>
		</v-app-bar>

		<v-navigation-drawer v-if="AUTH_GETT_IS_AUTHENTICATED" v-model="drawer" color="#000080" app flat dark width="200">
			<template v-slot:prepend v-if="AUTH_GETT_IS_AUTHENTICATED">
				<v-list-item class="blue darken-4" two-line>
					<!-- <v-list-item-avatar>
						<img src="https://randomuser.me/api/portraits/women/81.jpg" />
					</v-list-item-avatar> -->
					<v-list-item-content>
						<v-list-item-title class="font-weight-bold">{{ AUTH_GETT_USER.name.toUpperCase() }}</v-list-item-title>
						<v-list-item-subtitle>
							<button @click="logOut" color="white" text>Log Out</button>
						</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</template>

			<v-list app>
				<v-subheader class=" font-weight-bold white--text">MAIN</v-subheader>
				<v-divider class="mb-2"></v-divider>
				<v-list-item-group v-model="setActiveLink">
					<v-list-item v-for="(menu, i) in menus" :key="i" @click="$router.push({ path: menu.link }).catch(() => {})">
						<v-list-item-icon>
							<v-icon v-text="menu.icon"></v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title class="font-weight-black overline" v-text="menu.text.toUpperCase()"></v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list-item-group>
			</v-list>
		</v-navigation-drawer>

		<v-main class="grey lighten-2 d-flex">
			<v-container fluid>
				<v-row no-gutters>
					<v-col cols="12">
						<vue-progress-bar></vue-progress-bar>
						<router-view></router-view>
					</v-col>
				</v-row>
			</v-container>
		</v-main>
	</v-app>
</template>

<script>
	import { mapActions, mapGetters } from 'vuex'

	export default {
		data() {
			return {
				drawer: true,
				menus: [
					{
						text: 'Dashboard',
						icon: 'mdi-chart-box',
						link: '/',
						name: 'dashboard',
					},
					{
						text: 'Branches',
						icon: 'mdi-office-building',
						link: '/branch',
						name: 'branch',
					},
					{
						text: 'Clients',
						icon: 'mdi-account-multiple',
						link: '/clients',
						name: 'clients',
					},
					{
						text: 'Staffs',
						icon: 'mdi-account-supervisor-outline',
						link: '/staffs',
						name: 'staffs',
					},
				],
			}
		},
		methods: {
			logOut() {
				this.$store.dispatch('auth/AUTH_LOG_OUT').then(() => {
					this.$router.replace('/login')
				})
			},
		},
		computed: {
			...mapGetters({
				AUTH_GETT_IS_AUTHENTICATED: 'auth/AUTH_GETT_IS_AUTHENTICATED',
				AUTH_GETT_USER: 'auth/AUTH_GETT_USER',
			}),
			setActiveLink: {
				get() {
					let index = this.menus.findIndex((value) => value.name === this.$route.path.split('/')[1])
					return index
				},
				set(newValue) {
					return newValue
				},
			},
		},
	}
</script>

<style>
	.toasting {
		font-size: 140% !important;
		font-weight: 800 !important;
		padding: 15px !important;
	}
</style>
