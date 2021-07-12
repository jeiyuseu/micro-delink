<template>
	<Dialog :modal="editClusterClientToggle" :width="'700px'">
		<div slot="modal-title" class="d-flex justify-space-between" style="width: 100%">
			Edit Client |
			{{ Object.keys(clientInfo).length === 0 || $titleize(fullName) }}
		</div>
		<div slot="modal-text">
			<v-form @submit.prevent="editClient" ref="formEditCusterClient">
				<v-container>
					<v-row>
						<!-- <v-col cols="6">
							<v-autocomplete
								:label="`* Select Client`"
								:items="clients"
								:item-text="(item) => (item.firstName + ' ' + item.middleInitial + ' ' + item.lastName).toUpperCase()"
								item-value="uuid"
								prepend-inner-icon="mdi-account-plus"

								disabled
								v-model.trim.number="formData.clientInfo.uuid"
								:rules="[(v) => !!v || `Must have a client `]"
								
							>
							</v-autocomplete>
						</v-col> -->
						<v-col cols="12">
							<v-text-field
								label="* Loan Receivable "
								required
								type="number"
								autocomplete="off"
								prepend-inner-icon="mdi-currency-php"
								v-model.trim.number="formData.lr"
								:rules="[
									(v) => !v.length >= 0 || 'Loan Receivable is required!',
									(v) => /^[0-9]+$/.test(v) || 'Numbers only!',
								]"
							>
							</v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="4">
							<v-text-field
								label="* SK Cum "
								required
								type="number"
								autocomplete="off"
								prepend-inner-icon="mdi-currency-php"
								v-model.trim.number="formData.skCum"
								:rules="[(v) => !v.length >= 0 || 'SK Cum is required!', (v) => /^[0-9]+$/.test(v) || 'Numbers only!']"
							>
							</v-text-field>
						</v-col>
						<v-col cols="4">
							<v-text-field
								label="* W.I "
								required
								type="number"
								autocomplete="off"
								prepend-inner-icon="mdi-currency-php"
								v-model.trim.number="formData.wi"
								:rules="[(v) => !v.length >= 0 || 'W.I is required!', (v) => /^[0-9]+$/.test(v) || 'Numbers only!']"
							>
							</v-text-field>
						</v-col>
						<v-col cols="4">
							<v-text-field
								label="* Past Due "
								required
								type="number"
								autocomplete="off"
								prepend-inner-icon="mdi-currency-php"
								v-model.trim.number="formData.pastDue"
								:rules="[
									(v) => !v.length >= 0 || 'Past Due is required!',
									(v) => /^[0-9]+$/.test(v) || 'Numbers only!',
								]"
							>
							</v-text-field>
						</v-col>
					</v-row>
				</v-container>
			</v-form>
		</div>
		<div slot="modal-action">
			<v-btn color="primary darken-4" text @click="$emit('close-edit-client')">
				Close
			</v-btn>
			<v-btn color="primary darken-4" class="font-weight-black" :loading="loading" @click="submit" text>
				Edit
			</v-btn>
		</div>
	</Dialog>
</template>

<script>
import Dialog from './Dialog.vue'
import { mapActions } from 'vuex'
export default {
	props: {
		editClusterClientToggle: Boolean,
		// clients:Array, future update for changing client
		edit: Function,
		clientInfo: Object,
		items: Object,
		loading: Boolean,
	},

	components: {
		Dialog,
	},

	computed: {
		formData: {
			get() {
				return Object.assign({}, this.clientInfo)
			},
		},
		fullName: function() {
			return (
				this.clientInfo.clientInfo.firstName +
				' ' +
				this.clientInfo.clientInfo.middleInitial +
				' ' +
				this.clientInfo.clientInfo.lastName
			)
		},
	},
	methods: {
		submit: function() {
			if (this.$refs.formEditCusterClient.validate()) {
				this.edit(this.formData)
			}
		},
		// ...mapActions({ GP_EDIT_CLIENT: 'gp/GP_EDIT_CLIENT' }),
		// editClient: function() {
		// 	if (this.$refs.formEditCusterClient.validate()) {
		// 		this.loading = true
		// 		this.GP_EDIT_CLIENT(this.formData)
		// 			.then(({ data }) => {
		// 				for (const key in data.msg) {
		// 					this.clientInfo[key] = data.msg[key]
		// 				}
		// 				this.items.totals = data.msg.totals
		// 				this.$emit('refresh-update-clients')
		// 				this.loading = false
		// 				this.resetForm()
		// 				this.$toasted.success(this.$titleize(this.fullName) + ' is edited!', { icon: 'check' })
		// 			})
		// 			.catch((error) => {
		// 				console.log(error)
		// 				this.loading = false
		// 				this.$toasted.error('Something went wrong...', { icon: 'close' })
		// 			})
		// 	}
		// },
	},
}
</script>
