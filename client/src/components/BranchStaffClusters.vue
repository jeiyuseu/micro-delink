<template>
	<div>
		<Card>
			<div slot="card-title">
				Cluster List
			</div>
			<div slot="card-text">
				<v-alert v-if="selected.length !== 0" border="bottom" colored-border type="info" elevation="4"
					>Selected :
					<span
						v-for="(select, i) in selected"
						class="font-weight-medium text-uppercase text-decoration-underline"
						:key="i"
					>
						<b class="mx-">{{ codeName.toUpperCase() }}-{{ select.codeNameId }}</b>
					</span>
				</v-alert>
				<v-card class="elevation-5 mb-6">
					<v-card-text>
						<v-row>
							<v-col cols="12">
								<v-btn class="mr-3" outlined rounded color="blue darken-4" @click="addNewClusterToggle = true">
									<v-icon left dark> mdi-plus </v-icon>
									Add New Cluster
								</v-btn>

								<v-btn v-if="printToggle" @click="printToggle = !printToggle" outlined rounded color="success darken-4">
									<v-icon left dark> mdi-file-excel </v-icon>
									Select to Print
								</v-btn>
								<v-btn
									@click="exportExcel"
									:loading="btnExport"
									:disabled="selected.length === 0"
									outlined
									rounded
									color="success darken-4"
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
					label="Search Code #, Name..."
					single-line
					clearable
					hide-details
				></v-text-field>
				<v-data-table
					v-model="selected"
					:headers="headers"
					:items="filteredData"
					:single-select="printToggle"
					:show-select="!printToggle"
					:expanded.sync="expanded"
					:single-expand="true"
					item-key="uuid"
					class="elevation-10 mb-6"
				>
					<template v-slot:item="{ item, isSelected, select }">
						<tr class="font-weight-bold">
							<td v-if="!printToggle">
								<v-simple-checkbox :value="isSelected" @input="select($event)"></v-simple-checkbox>
							</td>
							<td class="text-uppercase">
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
										<v-icon class="mr-3" color="blue darken-4" v-bind="attrs" v-on="on" @click="dialogEditInfo(item)"
											>mdi-pencil</v-icon
										>
									</template>
									<span>Edit Details</span>
								</v-tooltip>
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-icon class="mr-3" color="red darken-4" v-bind="attrs" @click="dialogDeleteInfo(item)" v-on="on"
											>mdi-delete-circle</v-icon
										>
									</template>
									<span>Delete</span>
								</v-tooltip>
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-btn
											class="pr-3"
											icon
											color="green darken-4"
											:to="`${$route.params.codename}/${item.codeNameId}`"
										>
											<v-icon v-on="on" right v-bind="attrs">
												mdi-eye
											</v-icon>
										</v-btn>
									</template>
									<span>View Clients</span>
								</v-tooltip>
							</td>
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
		<EditInfo :editToggle="editToggle" :editInfo="editInfo" @close-edit-info="editToggle = false" />
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
import EditInfo from '@/components/Dialogs/EditGpInfo'
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
			dialogDeleteToggle: false,
			updateToggle: false,
			maxWidth: '700px',
			search: '',
			btnExport: false,
			filteredData: [],
			editInfo: {},
			clientInfo: {},
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
				gpInfoUuid: null,
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
		EditInfo,
		AddNewCluster,
		DeleteDialog,
	},
	created() {
		this.filteredData = this.GP_GETT_DATA_INFO.gpInfo || []
	},
	methods: {
		...mapMutations('info', ['SET_INFO', 'SET_UUID', 'SET_STATUS']),
		...mapActions({
			GP_INSERT_CLIENT: 'gp/GP_INSERT_CLIENT',
			GP_UPDATE_CLIENT: 'gp/GP_UPDATE_CLIENT',
			GP_DELETE_CLIENT: 'gp/GP_DELETE_CLIENT',
			GP_DELETE_INFO: 'gp/GP_DELETE_INFO',
		}),
		refreshClients: function(data) {
			this.filteredData.forEach((value) => {
				if (value.uuid === data.id) {
					data.clients.forEach((value1) => {
						value.gpClients.push(value1)
						value.totals = data.totals
					})
				}
			})
		},
		refreshUpdateClients: function(id) {
			this.filteredData.forEach((value) => {
				if (id === value.uuid) {
					value.gpClients = value.gpClients.filter((value) => value.lr !== 0)
					if (value.gpClients.length === 0) {
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

		dialogDeleteInfo: function(item) {
			this.dialogDeleteToggle = true
			const { codeNameId, staffCodeNameId } = item
			this.SET_INFO((staffCodeNameId + '-' + codeNameId).toUpperCase())
			this.SET_UUID(item.uuid)
			this.SET_STATUS('deleting-info')
		},
		deleted: function(uuid) {
			this.loading = true
			if (this.STATUS_GETT === 'deleting-info') {
				this.GP_DELETE_INFO({ uuid })
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

				let colCum, totalColCum
				let row3 = 3
				let row4 = 4
				let row5 = 5
				let row6 = 6
				let row6_spacing = 0
				let row1_spacing_total = 0
				this.selected.forEach((value) => {
					let row8 = value.gpClients.length + 7
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

					worksheet.getRow(row8 + row1_spacing_total).style = {
						font: { bold: true },
						alignment: { horizontal: 'center' },
					}

					worksheet.getCell(`B${row8 + row1_spacing_total}`).value = 'Total'
					worksheet.mergeCells(`J${row8 + row1_spacing_total}:L${row8 + row1_spacing_total}`)

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

					value.gpClients.forEach((client, index) => {
						if (value.weeksToPay === 18) {
							//16 weeks
							colCum = (client.loanAmount * 124.2) / 100 - client.lr
							totalColCum = (value.totals.loanAmount * 124.2) / 100 - value.totals.lr
						} else {
							colCum = (client.loanAmount * 120) / 100 - client.lr
							totalColCum = (value.totals.loanAmount * 120) / 100 - value.totals.lr
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
					worksheet.getCell(`C${row8 + row1_spacing_total}`).value = value.totals.lr
						? value.totals.lr.toLocaleString()
						: '-'
					worksheet.getCell(`D${row8 + row1_spacing_total}`).value = value.totals.skCum
						? value.totals.skCum.toLocaleString()
						: '-'
					worksheet.getCell(`E${row8 + row1_spacing_total}`).value = value.totals.pastDue
						? value.totals.pastDue.toLocaleString()
						: '-'
					worksheet.getCell(`G${row8 + row1_spacing_total}`).value = value.totals.wi
						? value.totals.wi.toLocaleString()
						: '-'
					worksheet.getCell(`H${row8 + row1_spacing_total}`).value = totalColCum ? totalColCum.toLocaleString() : '-'

					row3 += value.gpClients.length + 6
					row4 += value.gpClients.length + 6
					row5 += value.gpClients.length + 6
					row8 += value.gpClients.length + 6

					row6_spacing += 6
					row1_spacing_total += value.gpClients.length + 6
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
				this.selected = []
				console.log(error)
				this.btnExport = false
				this.printToggle = true
				this.$toasted.error('Something went wrong...', { icon: 'close' })
			}
		},
	},
	computed: {
		...mapGetters({
			GP_GETT_DATA_INFO: 'gp/GP_GETT_DATA_INFO',
			CLIENT_GETT_DATA_ALL: 'clients/CLIENT_GETT_DATA_ALL',
			AUTH_GETT_USER: 'auth/AUTH_GETT_USER',
			INFO_GETT: 'info/INFO_GETT',
			STATUS_GETT: 'info/STATUS_GETT',
		}),
		staffName: function() {
			return this.GP_GETT_DATA_INFO.firstName + ' ' + this.GP_GETT_DATA_INFO.lastName
		},
		codeName: function() {
			return this.GP_GETT_DATA_INFO.codeName
		},
	},
	watch: {
		search: function(v) {
			this.filteredData = this.GP_GETT_DATA_INFO.gpInfo.filter((info) => info.codeNameId.includes(v.toLowerCase()))
		},
		selected: function(v) {
			if (v.length === 0) {
				this.printToggle = true
			}
		},
	},
}
</script>
