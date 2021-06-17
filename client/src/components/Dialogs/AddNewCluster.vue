<template>
	<Dialog :modal="addNewClusterToggle" :width="'700px'">
		<div slot="modal-title">
			Add New Cluster
		</div>
		<div slot="modal-text">
			<v-alert dense outlined type="error" v-for="(error, index) in errors" :key="index">{{ error }}</v-alert>
			<v-form @submit.prevent="addNewCluster" ref="formData">
				<v-container>
					<v-row>
						<v-col cols="12">
							<v-text-field
								v-model.trim="formData.clusterCode"
								label="* New Codename"
								prepend-inner-icon="mdi-text-box-plus-outline"
								placeholder="E.G MA-01, MB-02, MC-03..."
								autocomplete="off"
								:rules="[(v) => !!v || 'Must a have a codename!']"
							></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="6">
							<v-menu ref="dateOfReleased" v-model="menuDateOfReleased" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
								<template v-slot:activator="{ on, attrs }">
									<v-text-field
										v-model.trim="formData.dateOfReleased"
										label="* Date of Released"
										prepend-inner-icon="mdi-calendar"
										v-bind="attrs"
										readonly
										v-on="on"
										clearable
										autocomplete="off"
										:rules="[(v) => !!v || 'Date of released is required!']"
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
								:items="[{ desc: '16 Weeks', value: 16 }]"
								item-text="desc"
								item-value="value"
								prepend-inner-icon="mdi-view-week"
								label="* Loan Term"
								@change="loanTerm"
								v-model="formData.weeksToPay"
								:rules="[(v) => !!v || 'Loan Term is required!']"
							></v-select>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="6">
							<v-menu ref="dateOfFirstPayment" v-model="menuFirstOfPayment" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
								<template v-slot:activator="{ on, attrs }">
									<v-text-field
										v-model.trim="formData.dateOfFirstPayment"
										label="* Date of First Payment"
										autocomplete="off"
										v-bind="attrs"
										v-on="on"
										readonly
										clearable
										prepend-inner-icon="mdi-calendar"
										:rules="[(v) => !!v || 'Date of first payment is required!']"
									></v-text-field>
								</template>

								<v-date-picker v-model.trim="formData.dateOfFirstPayment" no-title @change="loanTerm" scrollable>
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
							<v-text-field v-model.trim="formData.dateOfLastPayment" label="* Date of Last Payment" autocomplete="off" prepend-inner-icon="mdi-calendar" readonly></v-text-field>
						</v-col>
					</v-row>
				</v-container>
			</v-form>
		</div>
		<div slot="modal-action">
			<v-btn color="primary darken-1" text @click="onClose">
				Close
			</v-btn>
			<v-btn color="primary darken-2" class="font-weight-black" :loading="loading" @click="addNewCluster" text>
				Add
			</v-btn>
		</div>
	</Dialog>
</template>

<script>
	import Dialog from './Dialog'
	import { mapActions } from 'vuex'
	export default {
		props: {
			addNewClusterToggle: Boolean,
			alert: Object,
		},
		data() {
			return {
				loading: false,
				errors: [],
				menuDateOfReleased: false,
				menuFirstOfPayment: false,
				btnAdd: false,
				formData: {
					dateOfReleased: '',
					dateOfFirstPayment: '',
					dateOfLastPayment: '',
					weeksToPay: '',
					clusterCode: '',
				},
			}
		},
		methods: {
			...mapActions({ GP2_INSERT_CLUSTER: 'gp2/GP2_INSERT_CLUSTER' }),
			onClose: function() {
				this.$emit('close-new-cluster-toggle')
				this.$refs.formData.reset()
			},
			loanTerm: function() {
				if (this.formData.weeksToPay === 16) {
					const date = new Date(this.formData.dateOfFirstPayment)
					date.setDate(date.getDate() + 112)
					const newMonth = '0' + (date.getMonth() + 1)
					const newDate = '0' + date.getDate()
					const newYear = date.getFullYear()
					this.formData.dateOfLastPayment = newYear ? `${newYear}-${newMonth.slice(-2)}-${newDate.slice(-2)}` : ''
				}
			},
			addNewCluster: function() {
				if (this.$refs.formData.validate()) {
					this.loading = true
					this.alert.body = ''
					this.GP2_INSERT_CLUSTER(this.formData)
						.then(({ data }) => {
							this.loading = false
							this.$emit('new-cluster', data.msg)
							this.alert.type = 'success'
							this.alert.body = data.msg.codeNameId.toUpperCase() + ' added successfully!'
							this.onClose()
						})
						.catch((error) => {
							this.loading = false
							this.alert.type = 'error'
							this.alert.body = error.response.data.error
							console.log(error)
						})
				}
			},
		},
		components: {
			Dialog,
		},
	}
</script>
