<template>
	<div>
		<Card>
			<div slot="card-title">Branch Staff Clients</div>
			<div slot="card-text">
				<v-card class="elevation-5 mb-6">
					<v-card-text>
						<v-row>
							<v-col cols="12">
								<v-btn class="mr-3" outlined rounded color="blue" @click="addNewClusterToggle = true">
									<v-icon left dark> mdi-plus </v-icon>
									Add New Cluster
								</v-btn>
								<v-btn
									:to="`${$route.params.codename}/completed-accounts`"
									outlined
									rounded
									color="success"
									class="mr-3"
								>
									<v-icon left dark> mdi-check </v-icon>
									Completed Accounts
								</v-btn>
								<v-btn v-if="printToggle" @click="printToggle = !printToggle" outlined rounded color="success">
									<v-icon left dark> mdi-file-excel </v-icon>
									Select to Print
								</v-btn>
								<v-btn
									@click="exportExcel"
									:loading="btnExport"
									:disabled="selected.length === 0"
									outlined
									rounded
									color="success"
									v-if="!printToggle"
								>
									<v-icon left dark> mdi-check </v-icon>
									{{ selected.length }} Selected, Click Again to Print!
								</v-btn>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
				<v-text-field
					solo
					class="elevation-4 mb-6"
					v-model="search"
					append-icon="mdi-magnify"
					label="Search code #... E.G MA-TA1, MA-TB2, MA-TB3"
					single-line
					hide-details
				></v-text-field>
				<v-data-table
					v-model="selected"
					:headers="headers"
					:items="filteredData"
					:single-select="printToggle"
					:show-select="!printToggle"
					:expanded.sync="expanded"
					:single-expand="false"
					item-key="uuid"
					class="elevation-10 mb-6"
				>
					<template v-slot:item="{ item, expand, isExpanded, isSelected, select }">
						<tr class="blue darken-4 white--text ">
							<td v-if="!printToggle">
								<v-simple-checkbox
									color="white"
									class=""
									dark
									:value="isSelected"
									@input="select($event)"
								></v-simple-checkbox>
							</td>
							<td class="font-weight-bold text-uppercase">
								{{ item.staffCodeNameId + '-' + item.codeNameId }}
							</td>
							<td>{{ moment().diff(item.dateOfFirstPayment, 'weeks') }}</td>
							<td>{{ item.weeksToPay }} Weeks</td>
							<td>{{ item.loanCycle }}</td>
							<td>{{ moment(item.dateOfReleased).format('MMMM DD, YYYY') }}</td>
							<td>
								{{ moment(item.dateOfFirstPayment).format('MMMM DD, YYYY') }}
							</td>
							<td>
								{{ moment(item.dateOfLastPayment).format('MMMM DD, YYYY') }}
							</td>
							<td class="text-center">
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-icon
											class="mr-3"
											dark
											v-bind="attrs"
											v-on="on"
											@click="expand((isExpanded = true)), (clusterId = item.uuid), (addNewClusterClientToggle = true)"
											>mdi-plus</v-icon
										>
									</template>
									<span>Add Clients</span>
								</v-tooltip>
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-icon class="mr-3" dark v-bind="attrs" v-on="on" @click="dialogEditInfo(item)">mdi-pencil</v-icon>
									</template>
									<span>Edit Details</span>
								</v-tooltip>
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-icon class="mr-3" dark v-bind="attrs" @click="dialogDeleteInfo(item)" v-on="on"
											>mdi-delete-circle</v-icon
										>
									</template>
									<span>Delete</span>
								</v-tooltip>
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-icon class="mr-3" v-bind="attrs" v-on="on" dark @click="expand(!isExpanded)">
											{{ isExpanded ? 'mdi-arrow-right' : 'mdi-arrow-down' }}</v-icon
										>
									</template>
									<span> {{ isExpanded ? 'Hide Clients' : 'Show Clients' }}</span>
								</v-tooltip>
							</td>
						</tr>
					</template>

					<template v-slot:expanded-item="{ item, headers }">
						<tr class="grey lighten-3">
							<th v-if="!printToggle"></th>
							<th colspan="2">Client Name</th>
							<th>LR</th>
							<th>SK CUM</th>
							<th>W.I</th>
							<th>Past Due</th>
							<th>Updated By</th>
							<th class="text-center">Action</th>
						</tr>

						<tr v-for="(client, i) in item.gp2Clients" :key="client.uuid">
							<td v-if="!printToggle"></td>
							<td colspan="2" class="font-weight-bold">
								{{ parseInt(i) + 1 }}.
								{{
									$titleize(
										client.clientInfo.firstName +
											' ' +
											client.clientInfo.middleInitial +
											' ' +
											client.clientInfo.lastName
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
											color="success"
											v-bind="attrs"
											v-on="on"
											class="mr-2"
											@click="dialogEditClient(client, item)"
										>
											mdi-pencil
										</v-icon>
									</template>
									<span>Edit Client</span>
								</v-tooltip>
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-icon
											color="warning"
											v-bind="attrs"
											v-on="on"
											class="mr-2"
											@click="dialogUpdateInfo(client, item)"
										>
											mdi-update
										</v-icon>
									</template>
									<span>Update Payment</span>
								</v-tooltip>

								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-btn
											icon
											color="info"
											v-bind="attrs"
											v-on="on"
											:to="`${$route.params.codename}/${client.clientInfo.slug}.${client.clientInfo.uuid}`"
										>
											<v-icon> mdi-eye </v-icon>
										</v-btn>
									</template>
									<span>View Payment History</span>
								</v-tooltip>
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-btn icon color="error" v-bind="attrs" v-on="on" @click="dialogDeleteClient(client)">
											<v-icon> mdi-delete </v-icon>
										</v-btn>
									</template>
									<span>Delete</span>
								</v-tooltip>
							</td>
						</tr>
						<tr v-if="item.gp2Clients.length === 0">
							<td :colspan="headers.length" class="text-center">No clients!</td>
						</tr>

						<tr class="grey lighten-3 font-weight-bold" v-if="item.gp2Clients.length !== 0">
							<td v-if="!printToggle"></td>
							<td colspan="2" class="text-center">Total</td>
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
			</div>
		</Card>

		<AddNewCluster
			:addNewClusterToggle="addNewClusterToggle"
			@close-new-cluster-toggle="addNewClusterToggle = false"
			@new-cluster="(data) => filteredData.push(data)"
		/>
		<AddNewClusterClient
			:addNewClusterClientToggle="addNewClusterClientToggle"
			:clients="CLIENT_GETT_DATA_ALL.clients"
			:id="clusterId"
			@close-new-cluster-client-toggle="addNewClusterClientToggle = false"
			@append-cluster-client="refreshClients"
		/>
		<EditInfo :editToggle="editToggle" :editInfo="editInfo" @close-edit-info="editToggle = false" />
		<UpdateClient
			:updateToggle="updateToggle"
			:clientInfo="clientInfo"
			:items="items"
			@update-clients="refreshUpdateClients"
			@close-update-client="updateToggle = false"
		/>
		<!-- future update, changing client when editing :clients="CLIENT_GETT_DATA_ALL.clients" -->
		<EditClient
			:editClusterClientToggle="editClusterClientToggle"
			:items="items"
			:clientInfo="editClientInfo"
			@refresh-update-clients="refreshUpdateClients"
			@close-edit-client="editClusterClientToggle = false"
		/>
		<DeleteDialog
			:dialogDeleteToggle="dialogDeleteToggle"
			:loading="loading"
			:deleted="deleted"
			@close-delete="dialogDeleteToggle = false"
		/>
	</div>
</template>

<script>
import smoothReflow from 'vue-smooth-reflow'
import AddNewCluster from '@/components/Dialogs/AddNewCluster'
import AddNewClusterClient from '@/components/Dialogs/AddNewClusterClient'
import EditInfo from '@/components/Dialogs/EditGp2Info'
import UpdateClient from '@/components/Dialogs/UpdateGp2Client'
import EditClient from '@/components/Dialogs/EditClusterClient'
import DeleteDialog from '@/components/Dialogs/Delete'
import Card from '@/components/Card'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ExcelJS from 'exceljs'
import FileSaver from 'file-saver'
import moment from 'moment'
import { EventBus } from '../helpers/event-bus'

export default {
	mixins: [smoothReflow],
	data() {
		return {
			addNewClusterToggle: false,
			addNewClusterClientToggle: false,
			editClusterClientToggle: false,
			dialogDeleteToggle: false,
			updateToggle: false,
			clusterId: '',
			maxWidth: '700px',
			search: '',
			btnExport: false,
			filteredData: [],
			editInfo: {},
			clientInfo: {},
			editClientInfo: {},
			items: {},
			editToggle: false,
			expanded: [],
			loading: false,
			selected: [],
			printToggle: true,
			headers: [
				{
					text: 'Code #',
					align: 'start',
					sortable: false,
					width: '300px',
				},
				{
					text: 'Week #',
					align: 'start',
					sortable: false,
				},
				{
					text: 'Loan Term',
					align: 'start',
					sortable: false,
				},
				{
					text: 'Loan Cycle',
					align: 'start',
					sortable: false,
				},
				{
					text: 'Date of Released',
					align: 'start',
					sortable: false,
				},
				{
					text: 'Date of First Payment',
					align: 'start',
					sortable: false,
				},
				{
					text: 'Date of Last Payment',
					align: 'start',
					sortable: false,
				},
				{
					text: 'Action',
					align: 'center',
					sortable: false,
				},
			],

			clientUpdateForm: {
				codename: this.$route.params.codename,
				clientUuid: null,
				gp2InfoUuid: null,
				installment: null,
				sk: null,
				penalty: null,
				updatedBy: null,
			},
		}
	},
	mounted() {
		this.$smoothReflow()
	},
	components: {
		Card,
		AddNewClusterClient,
		EditInfo,
		AddNewCluster,
		UpdateClient,
		EditClient,
		DeleteDialog,
	},
	created() {
		this.filteredData = this.GP2_GETT_DATA.gp2Info || []
	},
	methods: {
		...mapMutations('info', ['SET_INFO', 'SET_UUID', 'SET_STATUS']),
		...mapActions({
			GP2_GET_DATA: 'gp2/GP2_GET_DATA',
			GP2_INSERT_CLIENT: 'gp2/GP2_INSERT_CLIENT',
			GP2_UPDATE_CLIENT: 'gp2/GP2_UPDATE_CLIENT',
			GP2_DELETE_CLIENT: 'gp2/GP2_DELETE_CLIENT',
			GP2_DELETE_INFO: 'gp2/GP2_DELETE_INFO',
		}),
		refreshClients: function(data) {
			this.filteredData.forEach((value) => {
				if (value.uuid === data.id) {
					data.clients.forEach((value1) => {
						value.gp2Clients.push(value1)
						value.totals = data.totals
					})
				}
			})
		},
		refreshUpdateClients: function(id) {
			this.filteredData.forEach((value) => {
				if (id === value.uuid) {
					value.gp2Clients = value.gp2Clients.filter((value) => value.lr !== 0)
					if (value.gp2Clients.length === 0) {
						this.filteredData = this.filteredData.filter((value) => value.uuid !== id)
					}
				}
			})
		},
		clearMutationInfo: function() {
			this.SET_INFO('')
			this.SET_UUID('')
			this.SET_STATUS('')
		},
		dialogEditClient: function(client, items) {
			this.editClientInfo = client
			this.editClusterClientToggle = true
			this.items = items
		},
		dialogEditInfo: function(info) {
			this.editToggle = true
			this.editInfo = info
			EventBus.$emit('editInfo', info)
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
		dialogDeleteInfo: function(item) {
			this.dialogDeleteToggle = true
			const { codeNameId, staffCodeNameId } = item
			this.SET_INFO((staffCodeNameId + '-' + codeNameId).toUpperCase())
			this.SET_UUID(item.uuid)
			this.SET_STATUS('deleting-info')
		},
		deleted: function(uuid) {
			this.loading = true
			if (this.STATUS_GETT === 'deleting-client') {
				this.GP2_DELETE_CLIENT({ uuid })
					.then(({ data }) => {
						this.loading = false
						this.filteredData.forEach((value) => {
							if (data.msg.infoId === value.uuid) {
								value.gp2Clients = value.gp2Clients.filter((value) => value.uuid !== data.msg.clientId)
								if (value.gp2Clients.length === 0) {
									this.filteredData = this.filteredData.filter((value) => value.uuid !== data.msg.infoId)
								}
								value.totals = data.msg.totals
							}
						})

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
			} else if (this.STATUS_GETT === 'deleting-info') {
				this.GP2_DELETE_INFO({ uuid })
					.then(({ data }) => {
						this.loading = false
						console.log(data)
						this.filteredData = this.filteredData.filter((value) => value.uuid !== data.msg.infoId)
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
			}
		},
		exportExcel: async function() {
			this.btnExport = true

			try {
				const workbook = new ExcelJS.Workbook()
				const worksheet = workbook.addWorksheet('My Sheet')
				worksheet.getColumn('B').width = '25'
				worksheet.getColumn('D').width = '15'
				worksheet.getColumn('E').width = '13'
				worksheet.getColumn('F').width = '13'
				worksheet.getColumn('H').width = '13'
				worksheet.getColumn('I').width = '15'
				worksheet.getColumn('L').width = '15'

				let colCum
				let row3 = 3
				let row4 = 4
				let row5 = 5
				let row6 = 6
				let row6_spacing = 0
				let row12_spacing_total = 0
				this.selected.forEach((value) => {
					let row8 = value.gp2Clients.length + 7
					worksheet.getCell(`B${row3}`).value = 'Codename:'
					worksheet.getCell(`B${row3}`).font = { bold: true }
					worksheet.getCell(`C${row3}`).value = (value.staffCodeNameId + '-' + value.codeNameId).toUpperCase()

					worksheet.getCell(`B${row4}`).value = 'Date of Released:'
					worksheet.getCell(`B${row4}`).font = { bold: true }

					worksheet.getCell(`C${row4}`).value = moment(value.dateOfReleased).format('MMMM DD, YYYY')

					worksheet.getCell(`E${row4}`).value = 'Date of First Payment:'
					worksheet.getCell(`E${row4}`).font = { bold: true }
					worksheet.getCell(`G${row4}`).value = moment(value.dateOfFirstPayment).format('MMMM DD, YYYY')

					worksheet.getCell(`E${row3}`).value = 'Loan Term:'
					worksheet.getCell(`E${row3}`).font = { bold: true }
					worksheet.getCell(`F${row3}`).value = value.weeksToPay + ' Weeks'

					worksheet.getCell(`I${row4}`).value = 'Date of Last Payment:'
					worksheet.getCell(`I${row4}`).font = { bold: true }
					worksheet.getCell(`K${row4}`).value = moment(value.dateOfLastPayment).format('MMMM DD, YYYY')

					worksheet.getCell(`I${row3}`).value = 'Date Printed:'
					worksheet.getCell(`I${row3}`).font = { bold: true }
					worksheet.getCell(`J${row3}`).value = moment().format('MMMM DD, YYYY')

					worksheet.getRow(row8 + row12_spacing_total).style = {
						font: { bold: true },
						alignment: { horizontal: 'center' },
					}

					worksheet.getCell(`B${row8 + row12_spacing_total}`).value = 'Total'
					worksheet.mergeCells(`J${row8 + row12_spacing_total}:L${row8 + row12_spacing_total}`)
	
					worksheet.getRow(row5).style = {
						font: { bold: true },
						alignment: { horizontal: 'center' },
					}

					worksheet.mergeCells(`C${row3}:D${row3}`)
					worksheet.mergeCells(`C${row4}:D${row4}`)
					worksheet.mergeCells(`G${row4}:H${row4}`)
					worksheet.mergeCells(`K${row4}:L${row4}`)
					worksheet.mergeCells(`J${row5}:L${row5}`)

					worksheet.getCell(`B${row5}`).value = 'Clientname'
					worksheet.getCell(`C${row5}`).value = 'LR'
					worksheet.getCell(`D${row5}`).value = 'SK CUM'
					worksheet.getCell(`E${row5}`).value = 'Past Due'
					worksheet.getCell(`F${row5}`).value = 'Penalty'
					worksheet.getCell(`G${row5}`).value = 'WI'
					worksheet.getCell(`H${row5}`).value = 'COL CUM'
					worksheet.getCell(`I${row5}`).value = 'Week #'
					worksheet.getCell(`J${row5}`).value = 'Signature'

					value.gp2Clients.forEach((client, index) => {
						if (value.weeksToPay === 18) {
							//16 weeks
							colCum = (client.loanAmount * 124.2) / 100 - client.lr
						} else {
							colCum = (client.loanAmount * 120) / 100 - client.lr
						}

						worksheet.mergeCells(`J${row6 + row6_spacing}:L${row6 + row6_spacing}`)
						worksheet.getRow(row6 + row6_spacing).style = {
							alignment: { horizontal: 'center' },
						}
						worksheet.getCell(`A${row6 + row6_spacing}`).value = index + 1 + '. '
						worksheet.getCell(`B${row6 + row6_spacing}`).value = (
							client.clientInfo.firstName +
							' ' +
							client.clientInfo.middleInitial +
							' ' +
							client.clientInfo.lastName
						).toUpperCase()
						worksheet.getCell(`C${row6 + row6_spacing}`).value = client.lr.toLocaleString()
						worksheet.getCell(`D${row6 + row6_spacing}`).value = client.skCum ? client.skCum.toLocaleString() : '-'
						worksheet.getCell(`E${row6 + row6_spacing}`).value = client.pastDue ? client.pastDue.toLocaleString() : '-'
						worksheet.getCell(`G${row6 + row6_spacing}`).value = client.wi ? client.wi.toLocaleString() : '-'
						worksheet.getCell(`H${row6 + row6_spacing}`).value = colCum ? colCum.toLocaleString() : '-'
						worksheet.getCell(`I${row6 + row6_spacing}`).value = value.dateOfFirstPayment
							? moment().diff(value.dateOfFirstPayment, 'weeks')
							: '-'

						row6++
					})
					worksheet.getCell(`C${row8 + row12_spacing_total}`).value = value.totals.lr
						? value.totals.lr.toLocaleString()
						: '-'
					worksheet.getCell(`D${row8 + row12_spacing_total}`).value = value.totals.skCum
						? value.totals.skCum.toLocaleString()
						: '-'
					worksheet.getCell(`E${row8 + row12_spacing_total}`).value = value.totals.pastDue
						? value.totals.pastDue.toLocaleString()
						: '-'
					worksheet.getCell(`G${row8 + row12_spacing_total}`).value = value.totals.wi
						? value.totals.wi.toLocaleString()
						: '-'

					row3 += value.gp2Clients.length + 6
					row4 += value.gp2Clients.length + 6
					row5 += value.gp2Clients.length + 6
					row8 += value.gp2Clients.length + 6

					row6_spacing += 6
					row12_spacing_total += value.gp2Clients.length + 6
				})
				worksheet.columns.forEach((col) => {
					const cols = worksheet.getColumn(col.number)

					cols.eachCell((cell) => {
						cell.border = {
							top: { style: 'thin' },
							left: { style: 'thin' },
							bottom: { style: 'thin' },
							right: { style: 'thin' },
						}
					})
				})

				const data = await workbook.xlsx.writeBuffer()

				FileSaver.saveAs(
					new Blob([data], {
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					}),
					this.$route.params.codename + '-' + moment().unix()
				)
				this.selected = []
				this.btnExport = false
				this.printToggle = true
				this.$toasted.success('Successfully exported!', { icon: 'check' })
			} catch (error) {
				console.log(error)
				this.btnExport = false
				this.printToggle = true
				this.$toasted.error('Something went wrong...', { icon: 'close' })
			}
			// this.GP2_GET_DATA(this.$route.params.codename)
			// 	.then(async (response) => {
			// 		const workbook = new ExcelJS.Workbook()
			// 		const worksheet = workbook.addWorksheet('My Sheet')
			// 		const gp2Data = response.data

			// 		let colCum
			// 		let row3 = 3
			// 		let row4 = 4
			// 		let row5 = 5
			// 		let row6 = 6
			// 		let row6_spacing = 0
			// 		let row8 = 8

			// 		worksheet.getColumn('B').width = '25'
			// 		worksheet.getColumn('D').width = '15'
			// 		worksheet.getColumn('E').width = '13'
			// 		worksheet.getColumn('F').width = '13'
			// 		worksheet.getColumn('H').width = '13'
			// 		worksheet.getColumn('I').width = '15'
			// 		worksheet.getColumn('L').width = '15'

			// 		gp2Data.gp2Info.forEach((data) => {
			// 			worksheet.getCell(`B${row3}`).value = 'Codename:'
			// 			worksheet.getCell(`B${row3}`).font = { bold: true }
			// 			worksheet.getCell(`C${row3}`).value = data.id

			// 			worksheet.getCell(`B${row4}`).value = 'Date of Released:'
			// 			worksheet.getCell(`B${row4}`).font = { bold: true }

			// 			worksheet.getCell(`C${row4}`).value = moment(data.dateOfReleased).format('MMMM DD, YYYY')

			// 			worksheet.getCell(`E${row4}`).value = 'Date of First Payment:'
			// 			worksheet.getCell(`E${row4}`).font = { bold: true }
			// 			worksheet.getCell(`G${row4}`).value = moment(data.dateOfFirstPayment).format('MMMM DD, YYYY')

			// 			worksheet.getCell(`E${row3}`).value = 'Loan Term:'
			// 			worksheet.getCell(`E${row3}`).font = { bold: true }
			// 			worksheet.getCell(`F${row3}`).value = data.weeksToPay

			// 			worksheet.getCell(`I${row4}`).value = 'Date of Last Payment:'
			// 			worksheet.getCell(`I${row4}`).font = { bold: true }
			// 			worksheet.getCell(`K${row4}`).value = moment(data.dateOfLastPayment).format('MMMM DD, YYYY')

			// 			worksheet.getCell(`I${row3}`).value = 'Date:'
			// 			worksheet.getCell(`I${row3}`).font = { bold: true }
			// 			worksheet.getCell(`J${row3}`).value = moment().format('MMMM DD, YYYY')

			// 			worksheet.getRow(row8).style = {
			// 				font: { bold: true },
			// 				alignment: { horizontal: 'center' },
			// 			}

			// 			worksheet.getCell(`B${row8}`).value = 'Total'

			// 			worksheet.getRow(row5).style = {
			// 				font: { bold: true },
			// 				alignment: { horizontal: 'center' },
			// 			}

			// 			worksheet.mergeCells(`C${row3}:D${row3}`)
			// 			worksheet.mergeCells(`C${row4}:D${row4}`)
			// 			worksheet.mergeCells(`G${row4}:H${row4}`)
			// 			worksheet.mergeCells(`K${row4}:L${row4}`)
			// 			worksheet.mergeCells(`J${row5}:L${row5}`)
			// 			worksheet.mergeCells(`J${row8}:L${row8}`)

			// 			worksheet.getCell(`B${row5}`).value = 'Clientname'
			// 			worksheet.getCell(`C${row5}`).value = 'LR'
			// 			worksheet.getCell(`D${row5}`).value = 'SK CUM'
			// 			worksheet.getCell(`E${row5}`).value = 'Past Due'
			// 			worksheet.getCell(`F${row5}`).value = 'Penalty'
			// 			worksheet.getCell(`G${row5}`).value = 'WI'
			// 			worksheet.getCell(`H${row5}`).value = 'COL CUM'
			// 			worksheet.getCell(`I${row5}`).value = 'Week #'
			// 			worksheet.getCell(`J${row5}`).value = 'Signature'

			// 			data.gp2Clients.forEach((client, index) => {
			// 				if (data.weeksToPay === 16) {
			// 					//16 weeks
			// 					colCum = client.loanAmount * 1.2 - client.lr
			// 				}

			// 				worksheet.mergeCells(`J${row6 + row6_spacing}:L${row6 + row6_spacing}`)
			// 				worksheet.getRow(row6 + row6_spacing).style = {
			// 					alignment: { horizontal: 'center' },
			// 				}
			// 				worksheet.getCell(`A${row6 + row6_spacing}`).value = index + 1 + '. '
			// 				worksheet.getCell(`B${row6 + row6_spacing}`).value = (client.clientInfo.firstName + ' ' + client.clientInfo.middleInitial + ' ' + client.clientInfo.lastName).toUpperCase()
			// 				worksheet.getCell(`C${row6 + row6_spacing}`).value = client.lr.toLocaleString()
			// 				worksheet.getCell(`D${row6 + row6_spacing}`).value = client.skCum ? client.skCum.toLocaleString() : '-'
			// 				worksheet.getCell(`E${row6 + row6_spacing}`).value = client.pastDue ? client.pastDue.toLocaleString() : '-'
			// 				worksheet.getCell(`G${row6 + row6_spacing}`).value = client.wi ? client.wi.toLocaleString() : '-'
			// 				worksheet.getCell(`H${row6 + row6_spacing}`).value = colCum ? colCum.toLocaleString() : '-'
			// 				worksheet.getCell(`I${row6 + row6_spacing}`).value = data.dateOfFirstPayment ? moment().diff(data.dateOfFirstPayment, 'weeks') : '-'

			// 				row6++
			// 			})

			// 			worksheet.getCell(`C${row8}`).value = data.totals.lr ? data.totals.lr.toLocaleString() : '-'
			// 			worksheet.getCell(`D${row8}`).value = data.totals.skCum ? data.totals.skCum.toLocaleString() : '-'
			// 			worksheet.getCell(`E${row8}`).value = data.totals.pastDue ? data.totals.pastDue.toLocaleString() : '-'
			// 			worksheet.getCell(`G${row8}`).value = data.totals.wi ? data.totals.wi.toLocaleString() : '-'

			// 			row3 += 7
			// 			row4 += 7
			// 			row5 += 7
			// 			row8 += 7

			// 			row6_spacing += 5
			// 		})

			// 		worksheet.columns.forEach((col) => {
			// 			const cols = worksheet.getColumn(col.number)

			// 			cols.eachCell((cell) => {
			// 				cell.border = {
			// 					top: { style: 'thin' },
			// 					left: { style: 'thin' },
			// 					bottom: { style: 'thin' },
			// 					right: { style: 'thin' },
			// 				}
			// 			})
			// 		})

			// 		const data = await workbook.xlsx.writeBuffer()

			// 		FileSaver.saveAs(
			// 			new Blob([data], {
			// 				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			// 			}),
			// 			this.$route.params.codename + '-' + moment().unix()
			// 		)
			// this.btnExport = false

			// })
			// .catch((error) => {
			// 	console.log(error)
			// 	this.btnExport = false
			// 	this.$toasted.error('Something went wrong...', { icon: 'close' })
			// })
		},
	},
	computed: {
		...mapGetters({
			GP2_GETT_DATA: 'gp2/GP2_GETT_DATA',
			CLIENT_GETT_DATA_ALL: 'clients/CLIENT_GETT_DATA_ALL',
			AUTH_GETT_USER: 'auth/AUTH_GETT_USER',
			INFO_GETT: 'info/INFO_GETT',
			STATUS_GETT: 'info/STATUS_GETT',
		}),
	},
	watch: {
		search: function(v) {
			this.filteredData = this.GP2_GETT_DATA.gp2Info.filter((value) => value.codeNameId.includes(v.toLowerCase()))
		},
		selected: function(v) {
			if (v.length === 0) {
				this.printToggle = true
			}
		},
	},
}
</script>
