<template>
	<div>
		<Dialog :modal="reloanToggle" :width="'700px'">
			<div slot="modal-title">
				Reloan |
				<span class="font-weight-bold">{{ Object.keys(reloanInfo).length === 0 || $titleize(fullName) }}</span>
			</div>
			<div slot="modal-text">
				<v-form @submit.prevent="reloan" ref="formReloan">
					<v-container>
						<v-row>
							<v-col cols="4">
								<v-text-field label="SK Cum" v-model.number="reloanInfo.skCum" readonly type="number" prepend-inner-icon="mdi-currency-php" autocomplete="off"> </v-text-field>
							</v-col>
							<v-col cols="4">
								<v-text-field label="W.I" v-model.number="reloanInfo.wi" readonly type="number" prepend-inner-icon="mdi-currency-php" autocomplete="off"> </v-text-field>
							</v-col>
							<v-col cols="4">
								<v-text-field label="Past Due" v-model.number="reloanInfo.pastDue" readonly type="number" prepend-inner-icon="mdi-currency-php" autocomplete="off"> </v-text-field>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="12">
								<v-text-field label="* Loan Amount" v-model.number="formData.loanAmount" type="number" prepend-inner-icon="mdi-currency-php" autocomplete="off"> </v-text-field>
							</v-col>
						</v-row>
					</v-container>
				</v-form>
			</div>
			<div slot="modal-action">
				<v-btn color="primary darken-1" @click="$emit('close-reloan')" text>
					Close
				</v-btn>
				<v-btn color="primary darken-2" class="font-weight-black" @click="reloan" :loading="loading" text>
					Reloan
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
			reloanToggle: Boolean,
			reloanInfo: Object,
			items: Object,
		},
		data() {
			return {
				loading: false,
			}
		},
		computed: {
			formData: {
				get() {
					return Object.assign({}, this.reloanInfo)
				},
			},
			fullName: function() {
				return this.reloanInfo.clientInfo.firstName + ' ' + this.reloanInfo.clientInfo.middleInitial + ' ' + this.reloanInfo.clientInfo.lastName
			},
		},
		methods: {
			...mapActions({ GP2_RELOAN: 'gp2/GP2_RELOAN' }),
			reloan: function() {
				if (this.$refs.formReloan.validate()) {
					this.loading = true
					const { uuid, loanAmount } = this.formData
					this.GP2_RELOAN({ uuid, loanAmount })
						.then(({ data }) => {
							for (const key in data.msg.totals) {
								this.items.totals[key] = data.msg.totals[key]
							}

							for (const key in data.msg) {
								this.reloanInfo[key] = data.msg[key]
							}

							this.$emit('close-reloan')
							this.$emit('refresh-reloan-clients', data.msg.infoId)
							this.$toasted.success(this.$titleize(this.fullName) + ' reloaned successfully!', { icon: 'check' })
							this.loading = false
						})
						.catch((error) => {
							console.log(error)
							this.loading = false
							this.$toasted.error('Something went wrong...', { icon: 'close' })
						})
				}
			},
		},
		components: {
			Dialog,
		},
	}
</script>
