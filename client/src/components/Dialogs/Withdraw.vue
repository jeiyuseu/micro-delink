<template>
	<div>
		<Dialog :modal="dialogWithdrawToggle" :width="width">
			<div slot="modal-title">Withdraw {{ formatNumber(items.skCum) }} ?</div>
			<div slot="modal-text">
				<v-form @submit.prevent="submit" ref="formWithdraw">
					<v-text-field
						label="* SK Amount"
						v-model.number.trim="formDatas.amount"
						:rules="[
							(v) => !!v || 'SK Amount is required!',
							(v) => v <= items.skCum || `Your withdraw amount is greater than your SK CUM - ₱ ${items.skCum} !`,
						]"
						type="number"
						prepend-inner-icon="mdi-currency-php"
					>
					</v-text-field>
				</v-form>
			</div>
			<div slot="modal-action" class="text-right">
				<v-spacer></v-spacer>
				<v-btn color="green darken-4" @click="closeDialog" text>Cancel</v-btn>
				<v-btn color="green darken-4" class="font-weight-black" :loading="loading" @click="submit" text>Withdraw</v-btn>
			</div>
		</Dialog>
	</div>
</template>

<script>
import Dialog from './Dialog.vue'
export default {
	props: {
		loading: Boolean,
		dialogWithdrawToggle: Boolean,
		withdraw: Function,
		items: Object,
	},
	data() {
		return {
			width: '500px',
			formDatas: {
				amount: '',
			},
		}
	},
	computed: {
		formData: {
			get() {
				return Object.assign({}, { ...this.items, ...this.formDatas })
			},
		},
	},
	methods: {
		submit: function() {
			if (this.$refs.formWithdraw.validate()) {
				this.withdraw(this.formData)
				this.closeDialog()
			}
		},
		closeDialog: function() {
			this.$refs.formWithdraw.reset()
			this.$emit('close-withdraw')
		},
		formatNumber: function(value) {
			return value && value.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
		},
	},
	components: {
		Dialog,
	},
}
</script>
