<template>
	<Dialog :modal="addNewClusterClientToggle" :width="'800px'">
		<div slot="modal-title" class="d-flex justify-space-between" style="width: 100%">
			Add New Cluster Client
			<v-btn-toggle v-model="toggleNone">
				<v-btn
					><v-icon color="primary darken-4" @click="addClientInput">
						mdi-plus-thick
					</v-icon></v-btn
				>
				<v-btn
					><v-icon color="primary darken-4" @click="revertClientInput" :disabled="formDatas.length <= 1">
						mdi-minus-thick
					</v-icon></v-btn
				>
			</v-btn-toggle>
		</div>
		<div slot="modal-text">
			<v-alert dense :v-if="errors" v-for="(error, i) in errors" :key="i" type="error"
				>{{ $titleize(error.split(':')[1]) }}
			</v-alert>
			<v-form @submit.prevent="addNewClusterClient" ref="formNewCusterClient">
				<v-container>
					<v-row v-for="(formData, i) in formDatas" :key="i">
						<v-col cols="6">
							<v-autocomplete
								:label="`* Select Client ${i + 1}`"
								:items="filteredData"
								:item-text="(item) => $titleize(item.firstName + ' ' + item.middleInitial + ' ' + item.lastName)"
								item-value="uuid"
								prepend-inner-icon="mdi-account-plus"
								clearable
								:rules="[(v) => !!v || `Must have a client ${i + 1}`]"
								v-model="formDatas[i].id"
							>
							</v-autocomplete>
						</v-col>
						<v-col cols="6">
							<v-text-field
								label="* Loan Amount "
								required
								type="number"
								autocomplete="off"
								prepend-inner-icon="mdi-currency-php"
								v-model.trim.number="formDatas[i].loanAmount"
								:rules="[(v) => !!v || 'Loan Amount is required!', (v) => /^[0-9]+$/.test(v) || 'Numbers only!']"
							>
							</v-text-field>
						</v-col>
					</v-row>
				</v-container>
			</v-form>
		</div>
		<div slot="modal-action">
			<v-btn color="primary darken-4" text @click="resetForm">
				Close
			</v-btn>
			<v-btn color="primary darken-4" class="font-weight-black" :loading="loading" @click="addNewClusterClient" text>
				Add
			</v-btn>
		</div>
	</Dialog>
</template>

<script>
import Dialog from './Dialog.vue'
import { mapActions } from 'vuex'
export default {
	props: {
		addNewClusterClientToggle: Boolean,
		clients: Array,
	},
	data() {
		return {
			loading: false,
			filteredData: [],
			data: {},
			elementCounts: 1,
			toggleNone: null,
			errors: [],
			isSelectedClientExists: false,
			formDatas: [
				{
					id: '',
					loanAmount: '',
				},
			],
		}
	},

	components: {
		Dialog,
	},
	created() {
		this.filteredData = this.clients || []
	},

	methods: {
		...mapActions({
			GP_INSERT_CLUSTER_CLIENT: 'gp/GP_INSERT_CLUSTER_CLIENT',
		}),
		addClientInput: function() {
			this.formDatas.push({ id: '', loanAmount: '' })
		},
		revertClientInput: function() {
			this.formDatas.pop()
		},
		resetForm: function() {
			this.$emit('close-new-cluster-client-toggle')
			this.$refs.formNewCusterClient.reset()
			this.formDatas = [{ id: '', loanAmount: '' }]
			this.errors = []
		},
		addNewClusterClient: function() {
			if (this.$refs.formNewCusterClient.validate()) {
				this.loading = true
				this.GP_INSERT_CLUSTER_CLIENT(this.formDatas)
					.then(({ data }) => {
						this.loading = false
						this.$emit('append-cluster-client', data.msg)
						this.$toasted.success('Client(s) added!', { icon: 'check' })
						this.resetForm()
					})
					.catch((error) => {
						console.log(error)
						this.loading = false
						this.errors = error.response.data.error
					})
			}
		},
	},
}
</script>
