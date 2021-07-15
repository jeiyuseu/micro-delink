<template>
	<div>
		<Card>
			<div slot="card-title">
				Completed Accounts
			</div>
			<div slot="card-text">
				<v-card class="elevation-5 mb-6">
					<v-card-text>
						<v-row>
							<v-col cols="12">
								<v-btn class="mr-3" outlined rounded color="orange darken-4" @click="renew">
									<v-icon left dark> mdi-refresh </v-icon>
									Renew to reloan
								</v-btn>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
				<v-alert color="green darken-2" dark icon="mdi-check" border="right" prominent>
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
								{{ $titleize(client.clientInfo.firstName + ' ' + client.clientInfo.middleInitial + ' ' + client.clientInfo.lastName) }}
							</td>
							<td>{{ formatNumber(client.lr) }}</td>
							<td>{{ formatNumber(client.skCum) }}</td>
							<td>{{ formatNumber(client.wi) }}</td>
							<td>{{ formatNumber(client.pastDue) }}</td>
							<td>
								{{ client.userInfo === null ? '' : $titleize(client.userInfo.firstName + ' ' + client.userInfo.lastName) }}
								{{ client.userInfo === null ? '' : moment(client.updatedAt).fromNow() ? ' | ' + moment(client.updatedAt).fromNow() : '' }}
							</td>
							<td class="text-center">
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-icon color="blue darken-4" @click="dialogEditClient(client, item)" v-bind="attrs" v-on="on" class="mr-2">
											mdi-pencil
										</v-icon>
									</template>
									<span>Edit Client</span>
								</v-tooltip>
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-icon
											:disabled="!isReloanable"
											color="orange darken-4"
											@click="reloan(client, item)"
											v-bind="attrs"
											v-on="on"
											class="mr-2"
										>
											mdi-refresh-circle
										</v-icon>
									</template>
									<span>Reloan</span>
								</v-tooltip>
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-icon
											color="green darken-4"
											@click="dialogWithdraw(client, item)"
											v-bind="attrs"
											v-on="on"
											class="mr-2"
											:disabled="client.skCum === 0"
										>
											mdi-arrow-down-bold-circle-outline
										</v-icon>
									</template>
									<span>Withdraw</span>
								</v-tooltip>
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-btn
											:disabled="client.skCum !== 0"
											@click="dialogDeleteClient(client)"
											icon
											color="red darken-4"
											v-bind="attrs"
											v-on="on"
										>
											<v-icon> mdi-delete </v-icon>
										</v-btn>
									</template>
									<span>Delete</span>
								</v-tooltip>
							</td>
						</tr>
						<tr v-if="item.gpClients.length === 0">
							<td :colspan="headers.length" class="text-center">No clients!</td>
						</tr>

						<tr class="grey lighten-3 font-weight-bold" v-if="item.gpClients.length !== 0">
							<td class="text-center">Total</td>
							<td>
								{{ formatNumber(item.totals.lr) }}
							</td>
							<td>
								{{ formatNumber(item.totals.skCum) }}
							</td>
							<td>
								{{ formatNumber(item.totals.wi) }}
							</td>
							<td>
								{{ formatNumber(item.totals.pastDue) }}
							</td>

							<td></td>
							<td></td>
						</tr>
					</template>
				</v-data-table>
				<EditClient
					:editClusterClientToggle="editClusterClientToggle"
					:clientInfo="editClientInfo"
					:items="items"
					:edit="edit"
					@close-edit-client="editClusterClientToggle = false"
				/>
				<Renew :renewToggle="renewToggle" @close-renew="renewToggle = false" @refresh-renew-info="refreshRenewInfo" />
				<Reloan
					:reloanToggle="reloanToggle"
					:reloanInfo="reloanInfo"
					:items="items"
					@refresh-reloan-clients="refreshReloanClients"
					@close-reloan="reloanToggle = false"
				/>
				<DeleteDialog
					:dialogDeleteToggle="dialogDeleteToggle"
					:loading="loading"
					:deleted="deleted"
					@close-delete="dialogDeleteToggle = false"
				/>
				<DeleteDialog />
				<WithdrawDialog
					:dialogWithdrawToggle="dialogWithdrawToggle"
					:items="items"
					:loading="loading"
					:withdraw="withdraw"
					@close-withdraw="dialogWithdrawToggle = false"
				/>
			</div>
		</Card>
		<Withdrawals :responseWithdraw="responseWithdraw" :responseEdit="responseEdit" />
	</div>
</template>

<script>
import Card from './Card'
import EditClient from '@/components/Dialogs/EditClusterClient'
import Renew from '@/components/Dialogs/Renew'
import Reloan from '@/components/Dialogs/Reloan'
import Withdrawals from '@/components/Withdrawals'
import WithdrawDialog from '@/components/Dialogs/Withdraw'
import DeleteDialog from '@/components/Dialogs/Delete'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { EventBus } from '../helpers/event-bus'
import moment from 'moment'

export default {
	data() {
		return {
			filteredData: [],
			renewToggle: false,
			editClusterClientToggle: false,
			reloanToggle: false,
			dialogDeleteToggle: false,
			dialogWithdrawToggle: false,
			loading: false,
			clusterId: '',
			editClientInfo: {},
			reloanInfo: {},
			clientInfo: {},
			responseEdit: {},
			responseWithdraw: {},
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
		this.filteredData = this.GP_GETT_DATA_COMPLETED
	},
	methods: {
		...mapMutations('info', ['SET_INFO', 'SET_UUID', 'SET_STATUS']),
		...mapActions({
			GP_EDIT_CLIENT_COMPLETED: 'gp/GP_EDIT_CLIENT_COMPLETED',
			GP_DELETE_CLIENT_COMPLETED: 'gp/GP_DELETE_CLIENT_COMPLETED',
			GP_INSERT_WITHDRAWALS: 'gp/GP_INSERT_WITHDRAWALS',
		}),
		dialogDeleteClient: function(client) {
			this.dialogDeleteToggle = true
			const { firstName, middleInitial, lastName } = client.clientInfo
			this.SET_INFO(this.$titleize(firstName + ' ' + middleInitial + ' ' + lastName))
			this.SET_UUID(client.uuid)
			this.SET_STATUS('deleting-client')
		},
		dialogWithdraw: function(client, item) {
			this.items = { clientId: client.uuid, uuid: item.uuid, skCum: client.skCum }
			this.dialogWithdrawToggle = true
		},
		refreshRenewInfo: function(data) {
			delete data.uuid
			for (const key in data) {
				this.filteredData[key] = data[key]
			}
		},
		refreshReloanClients: function() {
			this.filteredData.gpClients = this.filteredData.gpClients.filter((value) => value.lr === 0)
		},
		edit: function(formData) {
			this.loading = true
			this.GP_EDIT_CLIENT_COMPLETED(formData)
				.then(({ data }) => {
					this.filteredData.gpClients.forEach((value) => {
						if (value.clientInfo.uuid === data.msg.clientInfo.uuid) {
							value.clientInfo.skCum = data.msg.clientInfo.skCum
							for (const key in value) {
								value[key] = data.msg[key]
							}
							this.$toasted.success(
								this.$titleize(value.clientInfo.firstName + ' ' + value.clientInfo.middleInitial + ' ' + value.clientInfo.lastName) +
									' is edited!',
								{ icon: 'check' }
							)
						}
					})

					this.filteredData.totals = data.msg.totals
					this.responseEdit = data.msg
					this.refreshReloanClients()
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
				this.GP_DELETE_CLIENT_COMPLETED({ uuid })
					.then(({ data }) => {
						this.loading = false
						this.filteredData.gpClients = this.filteredData.gpClients.filter((value) => value.uuid !== data.msg.clientId)
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
		withdraw: function(data) {
			this.loading = true
			this.GP_INSERT_WITHDRAWALS(data)
				.then(({ data }) => {
					this.filteredData.gpClients.forEach((value) => {
						if (value.clientInfo.uuid === data.msg.clientInfo.uuid) {
							value.clientInfo.skCum = data.msg.clientInfo.skCum
							value.skCum = data.msg.clientInfo.skCum
						}
					})

					this.filteredData.totals.skCum = data.msg.totals.skCum
					this.responseWithdraw = data.msg
					this.loading = false
					this.dialogWithdrawToggle = false
					this.$toasted.success('Successfully withdraw!', { icon: 'check' })
				})
				.catch((error) => {
					this.$toasted.error('Something went wrong...', { icon: 'close' })
					console.log(error)
					this.loading = false
					this.dialogWithdrawToggle = false
				})
		},
		renew: function() {
			const { uuid, dateOfFirstPayment, dateOfLastPayment, dateOfReleased, weeksToPay } = this.filteredData
			this.renewToggle = true
			EventBus.$emit('renewInfo', {
				uuid,
				dateOfFirstPayment,
				dateOfLastPayment,
				dateOfReleased,
				weeksToPay,
				codeNo: this.codeNo,
			})
		},
		reloan: function(client, items) {
			this.reloanToggle = true
			this.reloanInfo = client
			this.items = items
		},
		dialogEditClient: function(client, items) {
			this.editClientInfo = client
			this.items = items
			this.editClusterClientToggle = true
		},
		formatNumber: function(value) {
			return value && value.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
		},
		clearMutationInfo: function() {
			this.SET_INFO('')
			this.SET_UUID('')
			this.SET_STATUS('')
		},
	},
	computed: {
		...mapGetters({
			GP_GETT_DATA_COMPLETED: 'gp/GP_GETT_DATA_COMPLETED',
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
		isReloanable: function() {
			return this.filteredData.isVirgin
		},
	},
	components: {
		Card,
		EditClient,
		Renew,
		Reloan,
		DeleteDialog,
		Withdrawals,
		WithdrawDialog,
	},
}
</script>
