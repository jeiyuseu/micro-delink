<template>
	<Dialog :modal="addNewClusterClientToggle" :width="'800px'">
		<div slot="modal-title" class="d-flex justify-space-between" style="width: 100%">
			Add New Cluster Client
			<v-btn-toggle v-model="toggleNone">
				<v-btn><v-icon color="primary darken-4" @click="formDatas.push({ id: '', loanAmount: '' })"> mdi-plus-thick </v-icon></v-btn>
				<v-btn><v-icon color="primary darken-4" @click="formDatas.pop()" :disabled="formDatas.length <= 1"> mdi-minus-thick </v-icon></v-btn>
			</v-btn-toggle>
		</div>
		<div slot="modal-text">
			<v-form @submit.prevent="addNewClusterClient" ref="formNewCusterClient">
				<v-container>
					<v-row v-for="(formData, i) in formDatas" :key="i">
						<v-col cols="6">
							<v-autocomplete
								:label="`* Select Client ${i + 1}`"
								:items="clients"
								:item-text="(item) => (item.firstName + ' ' + item.middleInitial + ' ' + item.lastName).toUpperCase()"
								item-value="uuid"
								prepend-inner-icon="mdi-account-plus"
								clearable
								@input="selectCLient"
								return-object
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
			<v-btn color="primary darken-1" text @click="resetForm">
				Close
			</v-btn>
			<v-btn color="primary darken-2" class="font-weight-black" :loading="loading" @click="addNewClusterClient" text>
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
			alert: Object,
			id: String,
		},
		data() {
			return {
				loading: false,
				data: {},
				selectCLient: [],
				elementCounts: 1,
				toggleNone: null,
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

		methods: {
			...mapActions({ GP2_INSERT_CLUSTER_CLIENT: 'gp2/GP2_INSERT_CLUSTER_CLIENT' }),
			test: function(client) {
				console.log(client)
			},
			resetForm: function() {
				this.$emit('close-new-cluster-client-toggle')
				this.$refs.formNewCusterClient.reset()
				this.formDatas = [{ id: '', loanAmount: '' }]
			},
			addNewClusterClient: function() {
				if (this.$refs.formNewCusterClient.validate()) {
					this.loading = true
					this.GP2_INSERT_CLUSTER_CLIENT({ formData: this.formDatas, clusterId: this.id })
						.then(({ data }) => {
							this.loading = false
							this.$emit('append-cluster-client', { ...data.msg, id: this.id })

							this.alert.type = 'success'

							this.alert.body = this.resetForm()
						})
						.catch((error) => {
							console.log(error)
							this.loading = false
							this.$toast.error(error.response.data.error)
						})
				}
			},
		},
	}
</script>
