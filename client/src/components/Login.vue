<template>
	<v-main>
		<v-container fluid fill-height>
			<v-layout align-center justify-center>
				<v-flex xs12 sm8 md4>
					<v-card class="elevation-12 pa-3">
						<v-card-title>
							<h3 justify-center>Login</h3>
						</v-card-title>

						<v-alert dense :value="!!error" transition="scale-transition" text type="error">
							{{ error }}
						</v-alert>

						<v-card-text>
							<v-form @submit.prevent="login" ref="formLogin">
								<v-text-field
									v-model.trim="loginForm.username"
									prepend-inner-icon="mdi-account"
									name="username"
									label="Username"
									required
									:rules="[(v) => !!v || 'This username is required']"
									type="text"
								></v-text-field>
								<v-text-field
									id="password"
									v-model.trim="loginForm.password"
									prepend-inner-icon="mdi-lock"
									name="password"
									label="Password"
									required
									:rules="[(v) => !!v || 'This password is required']"
									type="password"
								></v-text-field>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="primary" type="submit" :loading="loading">Login</v-btn>
									<v-btn to="/register">Register</v-btn>
								</v-card-actions>
							</v-form>
						</v-card-text>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
	</v-main>
</template>

<script>
	import { mapActions } from 'vuex'
	import api from '@/services/api'
	export default {
		name: 'Login',
		data() {
			return {
				loading: false,
				error: '',
				loginForm: {
					username: '',
					password: '',
				},
			}
		},

		methods: {
			...mapActions({ AUTH_LOG_IN: 'auth/AUTH_LOG_IN', AUTH_REFRESH_TOKEN: 'auth/AUTH_REFRESH_TOKEN' }),
			async login() {
				if (this.$refs.formLogin.validate()) {
					this.loading = true
					try {
						const response = await this.AUTH_LOG_IN(this.loginForm)
						api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
						this.$toast.success('Login Success!')
						this.$store.commit('auth/AUTH_SET_USER', response.data.user)
						this.$router.push('/')
						this.loading = false
						this.error = ''
					} catch (error) {
						this.error = error.response.data.error
						this.loading = false
					}
				}
			},
		},
	}
</script>

<style></style>
