<template>
	<div>
		<Dialog :modal="updateToggle" :width="'700px'">
			<div slot="modal-title">
				Update Client
			</div>
			<div slot="modal-text">
				<v-form @submit.prevent="updateClient" ref="formClientUpdate">
					<v-row>
						<v-col cols="6">
							<v-text-field label="Loan Receivable" :value="clientInfo.lr" class="text-right" readonly> </v-text-field>
						</v-col>
						<v-col cols="6"> <v-text-field label="Weekly Installment" :value="clientInfo.wi" readonly> </v-text-field></v-col>
					</v-row>
					<v-row>
						<v-col cols="4">
							<v-text-field
								v-model.number="formData.installment"
								label="Installment"
								type="number"
								:rules="[(v) => !!v || 'Installment is required!', (v) => v >= 0 || 'Invalid Number']"
								autocomplete="off"
							>
							</v-text-field>
						</v-col>
						<v-col cols="4">
							<v-text-field v-model.number="formData.sk" :rules="[(v) => !!v || 'SK is required!', (v) => v >= 0 || 'Invalid Number']" label="SK" type="number" autocomplete="off"> </v-text-field
						></v-col>
						<v-col cols="4">
							<v-text-field label="Penalty" v-model.number="formData.penalty" type="number" autocomplete="off"> </v-text-field>
						</v-col>
					</v-row>
				</v-form>
			</div>
			<div slot="modal-action">
				<v-btn color="primary darken-1" @click="$emit('close-update-client')" text>
					Close
				</v-btn>
				<v-btn color="primary darken-2" class="font-weight-black" :loading="loading" @click="updateClient" text>
					Update
				</v-btn>
			</div>
		</Dialog>
	</div>
</template>

<script>
	import Dialog from './Dialog'
	import { mapActions } from 'vuex'
	export default {
		props: {
			updateToggle: Boolean,
			clientInfo: Object,
			items: Object,
		},
		data() {
			return {
				loading: false,
				formData: {
					installment: '',
					sk: '',
					penalty: '',
				},
			}
		},
		methods: {
			...mapActions({ GP2_UPDATE_CLIENT: 'gp2/GP2_UPDATE_CLIENT' }),
			resetForm: function() {
				for (const key in this.formData) {
					this.formData[key] = ''
				}
				this.$refs.formClientUpdate.resetValidation()
			},
			updateClient: function() {
				if (this.$refs.formClientUpdate.validate()) {
					this.loading = true
					this.GP2_UPDATE_CLIENT({ ...this.formData, uuid: this.clientInfo.uuid })
						.then(({ data }) => {
							for (const key in data.msg.totals) {
								this.items.totals[key] = data.msg.totals[key]
							}
							delete data.msg.totals
							for (const key in data.msg) {
								this.clientInfo[key] = data.msg[key]
							}

							this.$emit('update-clients', data.msg.infoId)
							this.loading = false
							this.resetForm()

							this.$emit('close-update-client')
							this.$toast.success('updated!')
						})
						.catch((error) => {
							this.loading = false
							console.log(error)
							this.$toast.success('Something went wrong...')
						})
				}
			},
		},
		components: {
			Dialog,
		},
	}
</script>
