<template>
	<v-main>
		<v-container fluid fill-height>
			<v-layout align-center justify-center>
				<v-flex xs12 sm8 md4>
					<v-card class="elevation-10 pa-3">
						<v-card-title>
							<h3 justify-center>Register</h3>
						</v-card-title>
						<v-alert dense :value="!!error" transition="scale-transition" v-for="(error, i) in errors" :key="i" text type="error">
							{{ error.message }}
						</v-alert>
						<v-card-text>
							<v-form @submit.prevent="register" ref="formRegister">
								<v-row>
									<v-col cols="6">
										<v-text-field
											v-model.trim="registerForm.firstName"
											name="firstName"
											label="First Name"
											required
											:rules="[(v) => !!v || 'First Name is required']"
											type="text"
											tabindex="1"
										></v-text-field>
										<v-text-field
											v-model.trim="registerForm.email"
											name="email"
											label="Email"
											required
											:rules="[(v) => !!v || 'Email is required', rules.email]"
											type="email"
											tabindex="3"
										></v-text-field>
										<v-text-field
											v-model.trim="registerForm.password"
											name="password"
											label="Password"
											required
											:rules="[(v) => !!v || 'Password is required', (v) => v.length >= 6 || 'Minimum of 6 characters!']"
											type="password"
											tabindex="5"
										></v-text-field>
									</v-col>
									<v-col cols="6">
										<v-text-field
											v-model.trim="registerForm.lastName"
											name="lastName"
											label="Last Name"
											required
											:rules="[(v) => !!v || 'Last Name is Required']"
											type="text"
											tabindex="2"
										></v-text-field>
										<v-text-field
											id="password"
											v-model.trim="registerForm.username"
											name="username"
											label="Username"
											required
											:rules="[(v) => !!v || 'Username is required', (v) => v.length >= 4 || 'Minimum of 4 characters']"
											type="text"
											tabindex="4"
										></v-text-field>
										<v-text-field
											v-model.trim="registerForm.confirmPassword"
											name="confirmPassword"
											label="Confirm Password"
											required
											:rules="[(v) => v === this.registerForm.password || 'Password do not match!']"
											type="password"
											tabindex="6"
										></v-text-field>
									</v-col>
								</v-row>
							</v-form>
						</v-card-text>
						<v-card-actions class="justify-end">
							<v-btn color="primary" @click="register" :loading="loading">Register</v-btn>
							<v-btn to="/login">Login</v-btn>
						</v-card-actions>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
	</v-main>
</template>

<script>
	import { mapActions } from 'vuex'
	export default {
		name: 'Register',
		data() {
			return {
				loading: false,
				errors: {},
				registerForm: {
					firstName: '',
					lastName: '',
					username: '',
					email: '',
					password: '',
					confirmPassword: '',
				},
				rules: {
					email: (value) => {
						const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
						return pattern.test(value) || 'Invalid Email!'
					},
				},
			}
		},

		methods: {
			...mapActions({ post: 'auth/AUTH_REGISTER' }),
			register() {
				if (this.$refs.formRegister.validate()) {
					this.loading = true
					this.post(this.registerForm)
						.then(() => {
							this.loading = false
							this.$toasted.success('User created successfully!', { icon: 'check' })
							this.$refs.formRegister.reset()
							this.$router.push('/login')
						})
						.catch((error) => {
							this.loading = false
							this.$toasted.error('Something went wrong...', { icon: 'close' })
							console.log(error)
						})
				}
			},
		},
	}
</script>

<style></style>
