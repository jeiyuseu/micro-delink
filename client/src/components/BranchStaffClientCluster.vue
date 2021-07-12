<template>
	<Card>
		<div slot="card-title">
			Cluster Clients
		</div>
		<div slot="card-text">
			<v-card class="elevation-5 mb-6">
				<v-card-text>
					<v-row>
						<v-col cols="12">
							<v-btn class="mr-3" outlined rounded @click="addNewClusterClientToggle = true" color="blue darken-4">
								<v-icon left dark> mdi-plus </v-icon>
								Add Client
							</v-btn>
							<v-btn
								:to="`${$route.params.codeno}/completed-accounts`"
								outlined
								rounded
								color="success darken-4"
								class="mr-3"
							>
								<v-icon left dark> mdi-check </v-icon>
								Completed Accounts / Withdrawals
							</v-btn>
							<v-btn class="mr-3" @click="dialogCr = true" outlined rounded color="orange darken-4">
								<v-icon left dark> mdi-recycle-variant </v-icon>
								Cluster Resolution
							</v-btn>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>

			<v-alert color="primary darken-2" dark icon="mdi-information" border="right" prominent>
				<v-row>
					<v-col cols="4">
						<h4><v-icon dark small>mdi-account</v-icon> Staff Name : {{ $titleize(staffName) }}</h4>
						<h4>
							<v-icon dark small>mdi-card-account-details</v-icon> Code No. :
							{{ codeNo.toUpperCase() }}
						</h4>
						<h4><v-icon dark small>mdi-calendar-range</v-icon> Loan Term : {{ loanTerm }}</h4>
					</v-col>
					<v-col cols="4">
						<h4><v-icon dark small>mdi-view-week</v-icon> Week No. : {{ weekNo }}</h4>
						<h4><v-icon dark small>mdi-power-cycle</v-icon> Loan Cycle : {{ loanCycle }}</h4>
					</v-col>
					<v-col cols="4">
						<h4><v-icon dark small>mdi-calendar</v-icon> Date of Released : {{ dateOfReleased }}</h4>
						<h4><v-icon dark small>mdi-calendar</v-icon> Date of First Payment : {{ dateOfFirstPayment }}</h4>
						<h4><v-icon dark small>mdi-calendar</v-icon> Date of Last Payment : {{ dateOfLastPayment }}</h4>
					</v-col>
				</v-row>
			</v-alert>

			<v-data-table :headers="headers" :items="[...filteredData]" class="elevation-10 mb-6">
				<template v-slot:item="{ item }">
					<tr v-for="(client, i) in item.gpClients" :key="i" class="font-weight-bold ">
						<td>
							{{ parseInt(i) + 1 }}.
							{{
								$titleize(
									client.clientInfo.firstName + ' ' + client.clientInfo.middleInitial + ' ' + client.clientInfo.lastName
								)
							}}
						</td>
						<td>₱ {{ client.lr.toLocaleString() }}</td>
						<td>₱ {{ client.skCum.toLocaleString() }}</td>
						<td>₱ {{ client.wi.toLocaleString() }}</td>
						<td>₱ {{ client.pastDue.toLocaleString() }}</td>
						<td>
							{{
								client.userInfo === null ? '' : $titleize(client.userInfo.firstName + ' ' + client.userInfo.lastName)
							}}
							{{
								client.userInfo === null
									? ''
									: moment(client.updatedAt).fromNow()
									? ' | ' + moment(client.updatedAt).fromNow()
									: ''
							}}
						</td>
						<td class="text-center">
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<v-icon
										color="blue darken-4"
										@click="dialogEditClient(client, item)"
										v-bind="attrs"
										v-on="on"
										class="mr-2"
									>
										mdi-pencil
									</v-icon>
								</template>
								<span>Edit Client</span>
							</v-tooltip>
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<v-icon
										color="yellow darken-4"
										@click="dialogUpdateInfo(client, item)"
										v-bind="attrs"
										v-on="on"
										class="mr-2"
									>
										mdi-update
									</v-icon>
								</template>
								<span>Update Payment</span>
							</v-tooltip>
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<v-btn @click="dialogDeleteClient(client)" icon color="red darken-4" v-bind="attrs" v-on="on">
										<v-icon> mdi-delete </v-icon>
									</v-btn>
								</template>
								<span>Delete</span>
							</v-tooltip>
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										icon
										color="green darken-4"
										v-bind="attrs"
										v-on="on"
										:to="`${$route.params.codeno}/${client.clientInfo.slug}.${client.clientInfo.uuid}/payments`"
									>
										<v-icon> mdi-eye </v-icon>
									</v-btn>
								</template>
								<span>View Payment History</span>
							</v-tooltip>
						</td>
					</tr>
					<tr v-if="item.gpClients.length === 0">
						<td :colspan="headers.length" class="text-center">No clients!</td>
					</tr>

					<tr class="grey lighten-3 font-weight-bold" v-if="item.gpClients.length !== 0">
						<td class="text-center">Total</td>
						<td>
							₱
							{{ item.totals.lr.toLocaleString() }}
						</td>
						<td>
							₱
							{{ item.totals.skCum.toLocaleString() }}
						</td>
						<td>
							₱
							{{ item.totals.wi.toLocaleString() }}
						</td>
						<td>
							₱
							{{ item.totals.pastDue.toLocaleString() }}
						</td>

						<td></td>
						<td></td>
					</tr>
				</template>
			</v-data-table>
			<AddNewClusterClient
				:addNewClusterClientToggle="addNewClusterClientToggle"
				:clients="CLIENT_GETT_DATA_ALL.clients"
				@close-new-cluster-client-toggle="addNewClusterClientToggle = false"
				@append-cluster-client="refreshClients"
			/>
			<EditClient
				:editClusterClientToggle="editClusterClientToggle"
				:edit="edit"
				:clientInfo="editClientInfo"
				:loading="loading"
				@close-edit-client="editClusterClientToggle = false"
			/>
			<UpdateClient
				:updateToggle="updateToggle"
				:clientInfo="clientInfo"
				:items="items"
				@update-clients="refreshUpdateClients"
				@close-update-client="updateToggle = false"
			/>
			<DeleteDialog
				:dialogDeleteToggle="dialogDeleteToggle"
				:loading="loading"
				:deleted="deleted"
				@close-delete="dialogDeleteToggle = false"
			/>
			<ClusterResolution :dialogCr="dialogCr" :cr="clusterResolution" @close-dialog="dialogCr = false" />
		</div>
	</Card>
</template>

<script>
import Card from './Card'

import AddNewClusterClient from '@/components/Dialogs/AddNewClusterClient'
import EditClient from '@/components/Dialogs/EditClusterClient'
import UpdateClient from '@/components/Dialogs/UpdateGpClient'
import DeleteDialog from '@/components/Dialogs/Delete'
import ClusterResolution from '@/components/Dialogs/ClusterResolution'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
export default {
	data() {
		return {
			filteredData: [],
			addNewClusterClientToggle: false,
			editClusterClientToggle: false,
			updateToggle: false,
			dialogDeleteToggle: false,
			dialogCr: false,
			loading: false,
			editClientInfo: {},
			clientInfo: {},
			items: {},
			headers: [
				{
					text: 'Client Name',
					align: 'start',
					sortable: false,
				},
				{
					text: 'LR',
					align: 'start',
					sortable: false,
				},
				{
					text: 'SK CUM',
					align: 'start',
					sortable: false,
				},
				{
					text: 'W.I',
					align: 'start',
					sortable: false,
				},
				{
					text: 'Past Due',
					align: 'start',
					sortable: false,
				},
				{
					text: 'Updated By',
					align: 'start',
					sortable: false,
				},

				{
					text: 'Action',
					align: 'center',
					sortable: false,
				},
			],
		}
	},
	created() {
		this.filteredData = this.GP_GETT_DATA_CLIENTS
	},
	methods: {
		...mapMutations('info', ['SET_INFO', 'SET_UUID', 'SET_STATUS']),
		...mapActions({
			GP_DELETE_CLIENT: 'gp/GP_DELETE_CLIENT',
			GP_EDIT_CLIENT: 'gp/GP_EDIT_CLIENT',
			GP_CLUSTER_RESOLUTION: 'gp/GP_CLUSTER_RESOLUTION',
		}),
		refreshClients: function(data) {
			data.clients.forEach((value) => {
				this.filteredData.gpClients.push(value)
				this.filteredData.totals = data.totals
			})
		},
		refreshUpdateClients: function() {
			this.filteredData.gpClients = this.filteredData.gpClients.filter((value) => value.lr !== 0)
		},
		dialogEditClient: function(client, items) {
			this.editClientInfo = client
			this.items = items
			this.editClusterClientToggle = true
		},
		dialogUpdateInfo: function(client, items) {
			this.updateToggle = true
			this.clientInfo = client
			this.items = items
		},
		dialogDeleteClient: function(client) {
			this.dialogDeleteToggle = true
			const { firstName, middleInitial, lastName } = client.clientInfo
			this.SET_INFO(this.$titleize(firstName + ' ' + middleInitial + ' ' + lastName))
			this.SET_UUID(client.uuid)
			this.SET_STATUS('deleting-client')
		},
		edit: function(formData) {
			this.loading = true
			this.GP_EDIT_CLIENT(formData)
				.then(({ data }) => {
					this.filteredData.gpClients.forEach((value) => {
						if (value.uuid === data.msg.uuid) {
							for (const key in data.msg) {
								value[key] = data.msg[key]
							}
							this.$toasted.success(
								this.$titleize(
									value.clientInfo.firstName + ' ' + value.clientInfo.middleInitial + ' ' + value.clientInfo.lastName
								) + ' is edited!',
								{ icon: 'check' }
							)
						}
					})
					this.filteredData.totals = data.msg.totals
					this.refreshUpdateClients()
					this.loading = false
					this.editClusterClientToggle = false
				})
				.catch((error) => {
					console.log(error)
					this.loading = false
					this.editClusterClientToggle = false
					this.$toasted.error('Something went wrong...', { icon: 'close' })
				})
		},
		deleted: function(uuid) {
			if (this.STATUS_GETT === 'deleting-client') {
				this.GP_DELETE_CLIENT({ uuid })
					.then(({ data }) => {
						this.loading = false
						this.filteredData.gpClients = this.filteredData.gpClients.filter(
							(value) => value.uuid !== data.msg.clientId
						)
						this.filteredData.totals = data.msg.totals
						this.dialogDeleteToggle = false
						this.$toasted.success(this.$titleize(this.INFO_GETT) + ' is deleted!', { icon: 'check' })
						this.clearMutationInfo()
					})
					.catch((error) => {
						console.log(error)
						this.loading = false
						this.$toasted.error('Something went wrong...', { icon: 'close' })
						this.clearMutationInfo()
					})
			} else {
				this.loading = false
				this.$toasted.error('Something went wrong...', { icon: 'close' })
				this.clearMutationInfo()
			}
		},
		clusterResolution: function() {
			const { uuid } = this.filteredData
			this.GP_CLUSTER_RESOLUTION({ uuid })
				.then(({ data }) => {
					this.filteredData.gpClients.forEach((value) => {
						data.msg.forEach((client) => {
							for (const key in client) {
								value[key] = client[key]
							}
						})
					})
					this.refreshUpdateClients()
					this.dialogCr = false
					this.$toasted.success('Successfully clustered resolution!', { icon: 'close' })
				})
				.catch((error) => {
					this.dialogCr = false
					error.response.data.error.forEach((element) => {
						this.$toasted.error(this.$titleize(element), { icon: 'close' })
					})
					if (error.response.data.error.length === 0) {
						this.$toasted.error('Something went wrong...', { icon: 'close' })
					}
				})
		},
		clearMutationInfo: function() {
			this.SET_INFO('')
			this.SET_UUID('')
			this.SET_STATUS('')
		},
	},
	computed: {
		...mapGetters({
			GP_GETT_DATA_CLIENTS: 'gp/GP_GETT_DATA_CLIENTS',
			CLIENT_GETT_DATA_ALL: 'clients/CLIENT_GETT_DATA_ALL',
			INFO_GETT: 'info/INFO_GETT',
			STATUS_GETT: 'info/STATUS_GETT',
		}),
		staffName: function() {
			return this.filteredData.firstName + ' ' + this.filteredData.lastName
		},
		codeName: function() {
			return this.filteredData.codeName
		},
		codeNo: function() {
			return this.filteredData.codeName + '-' + this.filteredData.name
		},
		loanTerm: function() {
			return this.filteredData.weeksToPay + ' Weeks'
		},
		weekNo: function() {
			return moment().diff(this.filteredData.dateOfFirstPayment, 'weeks')
		},
		loanCycle: function() {
			return this.filteredData.loanCycle
		},
		dateOfReleased: function() {
			return moment(this.filteredData.dateOfReleased).format('MMMM DD, YYYY')
		},
		dateOfFirstPayment: function() {
			return moment(this.filteredData.dateOfFirstPayment).format('MMMM DD, YYYY')
		},
		dateOfLastPayment: function() {
			return moment(this.filteredData.dateOfLastPayment).format('MMMM DD, YYYY')
		},
	},
	components: {
		Card,
		AddNewClusterClient,
		EditClient,
		UpdateClient,
		DeleteDialog,
		ClusterResolution,
	},
}
</script>
