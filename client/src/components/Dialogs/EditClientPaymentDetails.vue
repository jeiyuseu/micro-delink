<template>
	<div>
		<Dialog :modal="editClientPaymentToggle" :width="'700px'">
			<div slot="modal-title">Edit Details</div>
			<div slot="modal-text">
				<v-form @submit.prevent="editDetails" ref="formEditClientPaymentDetails">
					<v-row>
						<v-col cols="6">
							<v-text-field :value="formatDate(detailsInfo.createdAt)" label="Payment Date Created" class="text-right" disabled> </v-text-field>
						</v-col>
						<v-col cols="6"> <v-text-field :value="formatDate(detailsInfo.updatedAt)" label="Payment Date Updated" disabled> </v-text-field></v-col>
					</v-row>
					<v-row>
						<v-col cols="4">
							<v-text-field v-model="formData.payment" label="Actual Payment" :rules="[(v) => !!v || 'Payment is required!']" disabled type="number"> </v-text-field>
						</v-col>

						<v-col cols="4">
							<v-text-field label="SK" v-model="formData.sk" :rules="[(v) => !!v || 'SK is required!', (v) => v >= 0 || 'Invalid Value!']" type="number"> </v-text-field>
						</v-col>
						<v-col cols="4">
							<v-text-field v-model="formData.penalty" :rules="[(v) => !!v.toString() || 'Penalty is required!', (v) => v >= 0 || 'Invalid Value!']" label="Penalty" type="number"> </v-text-field
						></v-col>
					</v-row>
				</v-form>
			</div>
			<div slot="modal-action">
				<v-btn color="primary darken-1" @click="$emit('close-edit-client-payment')" text>
					Close
				</v-btn>
				<v-btn color="primary darken-2" :loading="loading" @click="editDetails" class="font-weight-black" text>
					Update
				</v-btn>
			</div>
		</Dialog>
	</div>
</template>

<script>
	import Dialog from './Dialog.vue'
	import moment from 'moment'
	import { mapActions } from 'vuex'
	export default {
		props: {
			editClientPaymentToggle: Boolean,
			detailsInfo: Object,
		},
		data() {
			return {
				loading: false,
			}
		},
		components: {
			Dialog,
		},
		computed: {
			formData: {
				get() {
					return Object.assign({}, this.detailsInfo)
				},
			},
		},
		methods: {
			...mapActions({
				GP2_EDIT_DETAILS: 'gp2/GP2_EDIT_DETAILS',
			}),
			editDetails() {
				if (this.$refs.formEditClientPaymentDetails.validate()) {
					this.loading = true
					this.GP2_EDIT_DETAILS(this.formData)
						.then(({ data }) => {
							this.loading = false
							this.$emit('client-details', data)
							this.$emit('close-edit-client-payment')
							this.$toasted.success('Payment Edited!', { icon: 'check' })
						})
						.catch((error) => {
							console.error(error)
							this.loading = false
							this.$toasted.error('Something went wrong...', { icon: 'close' })
						})
				}
			},
			formatDate(date) {
				return moment(date).format('MMMM DD, YYYY')
			},
		},
	}
</script>
