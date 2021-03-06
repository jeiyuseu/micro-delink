<template>
	<div>
		<Dialog :modal="renewToggle" :width="'700px'">
			<div slot="modal-title">
				Renew
			</div>
			<div slot="modal-text">
				<v-form @submit.prevent="renew" ref="formRenew">
					<v-container>
						<v-row>
							<v-col cols="6">
								<v-menu
									ref="dateOfReleased"
									v-model="menuDateOfReleased"
									:close-on-content-click="false"
									transition="scale-transition"
									offset-y
									max-width="290px"
									min-width="auto"
								>
									<template v-slot:activator="{ on, attrs }">
										<v-text-field
											label="* Date of Released"
											v-mask="'####-##-##'"
											prepend-inner-icon="mdi-calendar"
											autocomplete="off"
											v-bind="attrs"
											v-on="on"
											clearable
											v-model.trim="formData.dateOfReleased"
											:rules="[(v) => !!v || 'Date of releasaed is required!']"
										></v-text-field>
									</template>

									<v-date-picker v-model.trim="formData.dateOfReleased" no-title scrollable>
										<v-spacer></v-spacer>
										<div class="justify-end">
											<v-btn text color="primary" @click="menuDateOfReleased = false">
												Cancel
											</v-btn>
											<v-btn text color="primary" @click="$refs.dateOfReleased.save(formData.dateOfReleased)">
												OK
											</v-btn>
										</div>
									</v-date-picker>
								</v-menu>
							</v-col>
							<v-col cols="6">
								<v-select
									:items="[
										{ desc: '18 Weeks', value: 18 },
										{ desc: '24 Weeks', value: 24 },
									]"
									item-text="desc"
									item-value="value"
									prepend-inner-icon="mdi-view-week"
									:rules="[(v) => !!v || 'Loan Term is required!']"
									label="* Loan Term"
									@change="loanTerm"
									v-model="formData.weeksToPay"
								></v-select>
							</v-col>
						</v-row>

						<v-row>
							<v-col cols="6">
								<v-menu
									ref="dateOfFirstPayment"
									v-model="menuFirstOfPayment"
									:close-on-content-click="false"
									transition="scale-transition"
									offset-y
									max-width="290px"
									min-width="auto"
								>
									<template v-slot:activator="{ on, attrs }">
										<v-text-field
											label="* Date of First Payment"
											v-mask="'####-##-##'"
											:rules="[(v) => !!v || 'Date of First Payment is required!']"
											autocomplete="off"
											v-bind="attrs"
											clearable
											prepend-inner-icon="mdi-calendar"
											v-on="on"
											v-model="formData.dateOfFirstPayment"
										></v-text-field>
									</template>

									<v-date-picker v-model="formData.dateOfFirstPayment" @change="loanTerm" no-title scrollable>
										<v-spacer></v-spacer>
										<div class="justify-end">
											<v-btn text color="primary" @click="menuFirstOfPayment = false">
												Cancel
											</v-btn>
											<v-btn text color="primary" @click="$refs.dateOfFirstPayment.save(formData.dateOfFirstPayment)">
												OK
											</v-btn>
										</div>
									</v-date-picker>
								</v-menu>
							</v-col>
							<v-col cols="6">
								<v-text-field
									v-model="formData.dateOfLastPayment"
									label="* Date of Last Payment"
									autocomplete="off"
									:rules="[(v) => !!v || 'Date of Last Payment is required!']"
									prepend-inner-icon="mdi-calendar"
									readonly
								></v-text-field>
							</v-col>
						</v-row>
					</v-container>
				</v-form>
			</div>
			<div slot="modal-action">
				<v-btn color="primary darken-4" @click="$emit('close-renew')" text>
					Close
				</v-btn>
				<v-btn color="primary darken-4" class="font-weight-black" @click="renew" :loading="loading" text>
					Renew
				</v-btn>
			</div>
		</Dialog>
	</div>
</template>

<script>
import Dialog from './Dialog'
import { mapActions } from 'vuex'
import { EventBus } from '../../helpers/event-bus'
export default {
	props: {
		renewToggle: Boolean,
	},
	data() {
		return {
			menuFirstOfPayment: false,
			menuDateOfReleased: false,
			loading: false,
			formData: {},
		}
	},
	created() {
		EventBus.$on('renewInfo', (item) => {
			this.formData = Object.assign({}, item)
		})
	},
	methods: {
		...mapActions({ GP_RENEW: 'gp/GP_RENEW' }),
		renew: function() {
			if (this.$refs.formRenew.validate()) {
				this.loading = true
				const { dateOfFirstPayment, dateOfLastPayment, dateOfReleased, uuid, weeksToPay } = this.formData
				this.GP_RENEW({
					dateOfFirstPayment,
					dateOfLastPayment,
					dateOfReleased,
					uuid,
					weeksToPay,
				})
					.then(({ data }) => {
						this.$toasted.success(this.formData.codeNo.toUpperCase() + ' renewed successfully!', { icon: 'check' })
						this.$emit('refresh-renew-info', data.msg)
						this.$emit('close-renew')
						this.loading = false
					})
					.catch((error) => {
						console.log(error)
						this.loading = false
						this.$toasted.error('Something went wrong...', { icon: 'close' })
					})
			}
		},
		loanTerm: function() {
			if (this.formData.weeksToPay === 18) {
				const date = new Date(this.formData.dateOfFirstPayment)
				date.setDate(date.getDate() + 126)
				const newMonth = '0' + (date.getMonth() + 1)
				const newDate = '0' + date.getDate()
				const newYear = date.getFullYear()
				this.formData.dateOfLastPayment = newYear ? `${newYear}-${newMonth.slice(-2)}-${newDate.slice(-2)}` : ''
			} else if (this.formData.weeksToPay === 24) {
				const date = new Date(this.formData.dateOfFirstPayment)
				date.setDate(date.getDate() + 168)
				const newMonth = '0' + (date.getMonth() + 1)
				const newDate = '0' + date.getDate()
				const newYear = date.getFullYear()
				this.formData.dateOfLastPayment = newYear ? `${newYear}-${newMonth.slice(-2)}-${newDate.slice(-2)}` : ''
			}
		},
	},
	components: {
		Dialog,
	},
}
</script>
