<template>
	<div>
		<Card :alertType="alert.type" :body="alert.body">
			<div slot="card-title">
				Completed Accounts
			</div>
			<div slot="card-text">
				<v-data-table :headers="headers" :items="filteredData" :expanded.sync="expanded" item-key="uuid" class="elevation-10 mb-6">
					<template v-slot:item="{ item, expand, isExpanded }">
						<tr class="blue darken-4 white--text">
							<td class="font-weight-bold text-uppercase">{{ item.staffCodeNameId + '-' + item.codeNameId }}</td>
							<td>{{ moment().diff(item.dateOfFirstPayment, 'weeks') }}</td>
							<td>{{ item.weeksToPay }} Weeks</td>
							<td>{{ item.loanCycle }}</td>
							<td>{{ moment(item.dateOfReleased).format('MMMM DD, YYYY') }}</td>
							<td>{{ moment(item.dateOfFirstPayment).format('MMMM DD, YYYY') }}</td>
							<td>{{ moment(item.dateOfLastPayment).format('MMMM DD, YYYY') }}</td>
							<td class="text-center">
								<v-icon dark class="mr-4" @click="expand(!isExpanded)"> {{ isExpanded ? 'mdi-arrow-right' : 'mdi-arrow-down' }}</v-icon>
								<v-icon dark @click="renewInfos(item)"> mdi-autorenew</v-icon>
							</td>
						</tr>
					</template>

					<template v-slot:expanded-item="{ item, headers }">
						<tr class="grey lighten-3">
							<th colspan="2">Client Name</th>
							<th>LR</th>
							<th>SK CUM</th>
							<th>W.I</th>
							<th>Past Due</th>
							<th>Updated By</th>
							<th class="text-center red--text"></th>
						</tr>
						<tr v-for="(client, i) in item.gp2Clients" :key="client.uuid">
							<td colspan="2" class="font-weight-bold ">
								{{ i + 1 }}.
								{{ $titleize(client.clientInfo.firstName + ' ' + client.clientInfo.middleInitial + ' ' + client.clientInfo.lastName) }}
							</td>
							<td>₱ {{ client.lr.toLocaleString() }}</td>
							<td>₱ {{ client.skCum.toLocaleString() }}</td>
							<td>₱ {{ client.wi.toLocaleString() }}</td>
							<td>₱ {{ client.pastDue.toLocaleString() }}</td>
							<td>
								{{ client.userInfo !== null ? $titleize(client.userInfo.firstName + ' ' + client.userInfo.lastName) : '' }}
								{{ client.userInfo !== null ? (moment(client.updatedAt).fromNow() ? ' | ' + moment(client.updatedAt).fromNow() : '') : '' }}
							</td>

							<td class="text-center">
								<v-icon class="mr-2" :disabled="!item.isVirgin" @click="reloanInfos(client, item)">
									mdi-pencil
								</v-icon>
							</td>
						</tr>
						<tr v-if="item.gp2Clients.length === 0">
							<td :colspan="headers.length" class="text-center">No clients!</td>
						</tr>
						<tr class="font-weight-black" v-if="item.gp2Clients.length !== 0">
							<td></td>
							<td></td>
							<td>
								₱r
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
						</tr>
					</template>
				</v-data-table>
			</div>
		</Card>
		<Renew :renewToggle="renewToggle" :renewInfo="renewInfo" @refresh-renew-clients="refreshRenewClients" @close-renew="renewToggle = false" :alert="alert" />
		<Reloan :reloanToggle="reloanToggle" :reloanInfo="reloanInfo" :items="items" @refresh-reloan-clients="refreshReloanClients" @close-reloan="reloanToggle = false" :alert="alert" />
	</div>
</template>

<script>
	import smoothReflow from 'vue-smooth-reflow'
	import Card from '@/components/Card'
	import Renew from '@/components/Dialogs/Renew'
	import Reloan from '@/components/Dialogs/Reloan'
	import { mapActions, mapGetters } from 'vuex'
	export default {
		mixins: [smoothReflow],
		data() {
			return {
				expanded: [],
				renewToggle: false,
				reloanToggle: false,
				errors: [],
				filteredData: [],
				renewInfo: {},
				reloanInfo: {},
				items: {},
				alert: {
					type: '',
					body: '',
				},
				headers: [
					{
						text: 'Code #',
						align: 'start',
						sortable: false,
						value: 'codeName',
					},
					{
						text: 'Week #',
						align: 'start',
						sortable: false,
						value: 'dateOfFirstPayment',
					},
					{
						text: 'Loan Term',
						align: 'start',
						sortable: false,
						value: 'weeksToPay',
					},
					{
						text: 'Loan Cycle',
						align: 'start',
						sortable: false,
						value: 'loanCycle',
					},
					{
						text: 'Date of Released',
						align: 'start',
						sortable: false,
						value: 'dateOfReleased',
					},
					{
						text: 'Date of First Payment',
						align: 'start',
						sortable: false,
						value: 'dateOfFirstPayment',
					},
					{
						text: 'Date of Last Payment',
						align: 'start',
						sortable: false,
						value: 'dateOfLastPayment',
					},
					{
						text: 'Action',
						align: 'center',
					},
				],
			}
		},
		mounted() {
			this.$smoothReflow()
		},
		created() {
			this.filteredData = this.GP2_GETT_DATA_COMPLETED.gp2Info
		},
		components: {
			Card,
			Renew,
			Reloan,
		},
		methods: {
			...mapActions({
				GP2_RELOAN: 'gp2/GP2_RELOAN',
				GP2_GET_DATA_COMPLETED: 'gp2/GP2_GET_DATA_COMPLETED',
			}),
			refreshRenewClients: function(infoId) {
				this.filteredData.forEach((value) => {
					if (infoId === value.uuid) {
						if (value.gp2Clients.length === 0) {
							this.filteredData = this.filteredData.filter((value) => value.uuid !== infoId)
						}
					}
				})
			},
			refreshReloanClients: function(id) {
				this.filteredData.forEach((value) => {
					if (id === value.uuid) {
						value.gp2Clients = value.gp2Clients.filter((value) => value.lr === 0)

						if (value.gp2Clients.length === 0) {
							this.filteredData = this.filteredData.filter((value) => value.uuid !== id)
						}
					}
				})
			},
			renewInfos: function(items) {
				this.renewToggle = true
				this.renewInfo = items
			},
			reloanInfos: function(client, items) {
				this.reloanToggle = true
				this.reloanInfo = client
				this.items = items
			},
			clearInfo: function() {
				for (const key in this.reloanInfo.info) {
					this.reloanInfo.info[key].clientId = ''
					this.reloanInfo.info[key].loanAmount = ''
				}
				for (const key in this.reloanInfo.client) {
					this.reloanInfo.client[key] = ''
				}
				this.$refs.formReloan.resetValidation()
			},
			// reloanInfos: function(item) {
			// 	this.info = item
			// 	this.reloanInfo.info.id = item.uuid
			// 	this.clientInfo = item.gp2Clients
			// 	this.reloanInfo.client.client1.clientId = item.gp2Clients[0].uuid
			// 	this.reloanInfo.client.client2.clientId = item.gp2Clients[1].uuid
			// },
		},
		computed: {
			...mapGetters({
				GP2_GETT_DATA_COMPLETED: 'gp2/GP2_GETT_DATA_COMPLETED',
			}),
		},
		watch: {
			search: function(v) {
				this.filteredData = this.GP2_GETT_DATA_COMPLETED.gp2Info.filter((value) => value.id.includes(v.toUpperCase()))
			},
		},
	}
</script>
