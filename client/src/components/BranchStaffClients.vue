<template>
	<div>
		<card>
			<div slot="card-title">
				Branch Staff Clients
			</div>
			<div slot="card-button" class="float-right">
				<custom-dialog :modal="dialog" :width="maxWidth">
					<div slot="modal-title">
						Add New Clients
					</div>

					<div slot="modal-text">
						<v-alert dense outlined type="error" v-for="(error, index) in errors" :key="index">{{ error }}</v-alert>
						<v-form @submit.prevent="addGp2" ref="formStaffClients">
							<v-container>
								<v-radio-group v-model="chkBoxInfoDesc" mandatory>
									<v-row>
										<v-col cols="6">
											<v-row align="center" class="mt-0">
												<v-radio value="existing"></v-radio>
												<v-select
													:items="GP2_GETT_DATA_INFO_CODENAME"
													label="* For Existing Codename"
													prepend-inner-icon="mdi-text-box-outline"
													:item-text="(item) => item.name.toUpperCase()"
													:item-value="(item) => item.uuid"
													v-model="staffClientForm.info.infoDesc"
													:disabled="chkBoxInfoDesc === 'new' ? true : false"
													:rules="[ruleInfoDesc]"
													ref="infoDesc"
												></v-select>
											</v-row>
										</v-col>
										<v-col cols="6">
											<v-row align="center" class="mt-0">
												<v-radio value="new"></v-radio>
												<v-text-field
													v-model.trim="staffClientForm.info.newInfoDesc"
													label="* For New Codename"
													prepend-inner-icon="mdi-text-box-plus-outline"
													placeholder="E.G MA, MB, MC..."
													autocomplete="off"
													:disabled="chkBoxInfoDesc === 'existing' ? true : false"
													:rules="[ruleNewInfoDesc]"
													ref="newInfoDesc"
												></v-text-field>
											</v-row>
										</v-col>
									</v-row>
								</v-radio-group>
								<v-row>
									<v-col cols="6">
										<v-menu ref="dateOfReleased" v-model="menuDateOfReleased" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
											<template v-slot:activator="{ on, attrs }">
												<v-text-field
													v-model.trim="staffClientForm.info.dateOfReleased"
													label="* Date of Released"
													prepend-inner-icon="mdi-calendar"
													v-bind="attrs"
													v-mask="'####-##-##'"
													v-on="on"
													clearable
													autocomplete="off"
													:rules="[(v) => !!v || 'Date of released is required!']"
												></v-text-field>
											</template>

											<v-date-picker v-model.trim="staffClientForm.info.dateOfReleased" no-title scrollable>
												<v-spacer></v-spacer>
												<div class="justify-end">
													<v-btn text color="primary" @click="menuDateOfReleased = false">
														Cancel
													</v-btn>
													<v-btn text color="primary" @click="$refs.dateOfReleased.save(staffClientForm.info.dateOfReleased)">
														OK
													</v-btn>
												</div>
											</v-date-picker>
										</v-menu>
									</v-col>
									<v-col cols="6">
										<v-select
											:items="[{ desc: '16 Weeks', value: 16 }]"
											item-text="desc"
											item-value="value"
											prepend-inner-icon="mdi-view-week"
											label="* Loan Term"
											@change="loanTerm"
											v-model="staffClientForm.info.weeksToPay"
											:rules="[(v) => !!v || 'Loan Term is required!']"
										></v-select>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="6">
										<v-menu ref="dateOfFirstPayment" v-model="menuFirstOfPayment" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
											<template v-slot:activator="{ on, attrs }">
												<v-text-field
													v-model.trim="staffClientForm.info.dateOfFirstPayment"
													label="* Date of First Payment"
													autocomplete="off"
													v-bind="attrs"
													v-on="on"
													clearable
													prepend-inner-icon="mdi-calendar"
													:rules="[(v) => !!v || 'Date of first payment is required!']"
												></v-text-field>
											</template>

											<v-date-picker v-model.trim="staffClientForm.info.dateOfFirstPayment" no-title @change="loanTerm" scrollable>
												<v-spacer></v-spacer>
												<div class="justify-end">
													<v-btn text color="primary" @click="menuFirstOfPayment = false">
														Cancel
													</v-btn>
													<v-btn text color="primary" @click="$refs.dateOfFirstPayment.save(staffClientForm.info.dateOfFirstPayment)">
														OK
													</v-btn>
												</div>
											</v-date-picker>
										</v-menu>
									</v-col>
									<v-col cols="6">
										<v-text-field v-model.trim="staffClientForm.info.dateOfLastPayment" label="* Date of Last Payment" autocomplete="off" prepend-inner-icon="mdi-calendar" readonly></v-text-field>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="6">
										<v-autocomplete
											label="Client 1"
											:items="CLIENT_GETT_DATA_ALL.clients"
											:item-text="(item) => (item.firstName + ' ' + item.middleInitial + ' ' + item.lastName).toUpperCase()"
											item-value="uuid"
											prepend-inner-icon="mdi-account-plus"
											clearable
											:rules="[(v) => !!v || 'Must have a client!']"
											v-model="staffClientForm.client.client1.clientId"
										>
										</v-autocomplete>
									</v-col>
									<v-col cols="6">
										<v-text-field
											label="* Loan Amount"
											required
											type="number"
											autocomplete="off"
											class="branch-name"
											prepend-inner-icon="mdi-currency-php"
											v-model.trim.number="staffClientForm.client.client1.loanAmount"
											:rules="[(v) => !!v || 'Date of last payment is required!', (v) => /^[0-9]+$/.test(v) || 'Numbers only!']"
										>
										</v-text-field>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="6">
										<v-autocomplete
											label="Client 2"
											:items="CLIENT_GETT_DATA_ALL.clients"
											:item-text="(item) => (item.firstName + ' ' + item.middleInitial + ' ' + item.lastName).toUpperCase()"
											item-value="uuid"
											prepend-inner-icon="mdi-account-plus"
											clearable
											v-model="staffClientForm.client.client2.clientId"
											:rules="[(v) => !!v || 'Must have a client!']"
										>
										</v-autocomplete>
									</v-col>
									<v-col cols="6">
										<v-text-field
											label="* Loan Amount"
											v-model="staffClientForm.client.client2.loanAmount"
											class="branch-name"
											prepend-inner-icon="mdi-currency-php"
											autocomplete="off"
											type="number"
											:rules="[(v) => !!v || 'Loan amount is required!']"
										>
										</v-text-field
									></v-col>
								</v-row>
							</v-container>
							<v-card-actions class="justify-end">
								<v-btn color="primary darken-1" text @click=";(dialog = !dialog), $refs.formStaffClients.reset(), (errors = [])">
									Close
								</v-btn>
								<v-btn color="primary darken-2 " class="font-weight-black" :loading="btnAddClient" type="submit" text>
									Add
								</v-btn>
							</v-card-actions>
						</v-form>
					</div>
				</custom-dialog>
				<custom-dialog :modal="dialogUpdate" :width="maxWidth">
					<div slot="modal-title">Update | {{ this.dialogUpdateInfos.name.toUpperCase() }}</div>
					<div slot="modal-text">
						<v-form @submit.prevent="updateGp2" ref="formClientUpdate">
							<v-row>
								<v-col cols="6">
									<v-text-field label="Loan Receivable" class="text-right" :value="this.dialogUpdateInfos.lr.toLocaleString()" readonly> </v-text-field>
								</v-col>
								<v-col cols="6"> <v-text-field label="Weekly Installment" :value="this.dialogUpdateInfos.wi.toLocaleString()" readonly> </v-text-field></v-col>
							</v-row>
							<v-row>
								<v-col cols="4">
									<v-text-field
										v-model.number="clientUpdateForm.installment"
										label="Installment"
										type="number"
										:rules="[(v) => !!v || 'Installment is required!', (v) => v >= 0 || 'Invalid Number']"
										autocomplete="off"
									>
									</v-text-field>
								</v-col>
								<v-col cols="4">
									<v-text-field v-model.number="clientUpdateForm.sk" :rules="[(v) => !!v || 'SK is required!', (v) => v >= 0 || 'Invalid Number']" label="SK" type="number" autocomplete="off">
									</v-text-field
								></v-col>
								<v-col cols="4">
									<v-text-field label="Penalty" v-model.number="clientUpdateForm.penalty" type="number" :rules="[(v) => v >= 0 || 'Invalid Number']" autocomplete="off"> </v-text-field>
								</v-col>
							</v-row>
							<v-card-actions class="justify-end">
								<v-btn color="primary darken-1" text @click=";(dialogUpdate = !dialogUpdate), resetFields, $refs.formClientUpdate.resetValidation(), resetFields()">
									Close
								</v-btn>
								<v-btn color="primary darken-1" :loading="btnUpdateClient" :disabled="btnUpdateClient" type="submit" text>
									Update
								</v-btn>
							</v-card-actions>
						</v-form>
					</div>
				</custom-dialog>
			</div>
			<div slot="card-text">
				<v-card>
					<v-card-text>
						<v-row>
							<v-col cols="12">
								<v-btn class="mr-3" outlined rounded color="blue" dark @click.stop="dialog = true">
									<v-icon left dark>
										mdi-plus
									</v-icon>
									Add Clients
								</v-btn>
								<v-btn :to="`${$route.params.codename}/completed-accounts`" outlined rounded color="success" dark class="mr-3">
									<v-icon left dark>
										mdi-check
									</v-icon>
									Completed Accounts
								</v-btn>
								<v-btn @click="this.export" :loading="btnExport" outlined rounded color="success" dark>
									<v-icon left dark>
										mdi-file-excel
									</v-icon>
									Export To Excel
								</v-btn>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
				<v-card-title> <v-text-field v-model="search" append-icon="mdi-magnify" label="Search code #..." single-line hide-details></v-text-field></v-card-title>
				<v-data-table :headers="headers" :items="filteredData" :expanded.sync="expanded" :single-expand="false" item-key="uuid" class="elevation-2">
					<template v-slot:item="{ item, expand, isExpanded }">
						<tr class="blue darken-4 white--text">
							<td>{{ item.id }}</td>
							<td>{{ moment().diff(item.dateOfFirstPayment, 'weeks') }}</td>
							<td>{{ item.weeksToPay }} Weeks</td>
							<td>{{ item.loanCycle }}</td>
							<td>{{ moment(item.dateOfReleased).format('MMMM DD, YYYY') }}</td>
							<td>{{ moment(item.dateOfFirstPayment).format('MMMM DD, YYYY') }}</td>
							<td>{{ moment(item.dateOfLastPayment).format('MMMM DD, YYYY') }}</td>
							<td class="text-center">
								<v-icon dark @click="expand(!isExpanded), (show = !show)"> {{ isExpanded ? 'mdi-arrow-right' : 'mdi-arrow-down' }}</v-icon>
							</td>
						</tr>
					</template>

					<template v-slot:expanded-item="{ item }">
						<tr class="grey lighten-3">
							<th colspan="2">Client Name</th>
							<th>LR</th>
							<th>SK CUM</th>
							<th>W.I</th>
							<th>Past Due</th>
							<th>Updated By</th>
							<th class="text-center">Action</th>
						</tr>
						<tr v-for="(client, i) in item.gp2Clients" :key="client.uuid">
							<td colspan="2">
								{{ parseInt(i) + 1 }}.
								{{ (client.clientInfo.firstName + ' ' + client.clientInfo.middleInitial + ' ' + client.clientInfo.lastName).toUpperCase() }}
							</td>
							<td>₱ {{ client.lr.toLocaleString() }}</td>
							<td>₱ {{ client.skCum.toLocaleString() }}</td>
							<td>₱ {{ client.wi.toLocaleString() }}</td>
							<td>₱ {{ client.pastDue.toLocaleString() }}</td>
							<td>
								{{ client.userInfo !== null ? (client.userInfo.firstName + ' ' + client.userInfo.lastName).toUpperCase() : '' }}
								{{ client.userInfo !== null ? (moment(client.updatedAt).fromNow() ? ' | ' + moment(client.updatedAt).fromNow() : '') : '' }}
							</td>
							<td class="text-center">
								<v-icon color="warning" class="mr-2" @click="dialogUpdateInfo(client, item)">
									mdi-pencil
								</v-icon>
								<v-btn icon color="info" :to="`${$route.params.codename}/${client.clientInfo.slug}.${client.clientInfo.uuid}`">
									<v-icon>
										mdi-eye
									</v-icon>
								</v-btn>
							</td>
						</tr>
						<tr class="grey lighten-3 font-weight-bold">
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
		</card>
	</div>
</template>

<script>
	import CustomDialog from '@/components/Dialog'
	import Card from '@/components/Card'
	import { mapActions, mapGetters } from 'vuex'
	import ExcelJS from 'exceljs'
	import FileSaver from 'file-saver'
	import moment from 'moment'

	export default {
		data() {
			return {
				test: '',
				total: 0,
				show: false,
				expanded: [],
				dialog: false,
				dialogUpdate: false,
				btnAddClient: false,
				btnUpdateClient: false,
				maxWidth: '700px',
				search: '',
				errors: [],
				btnExport: false,
				chkBoxInfoDesc: 'existing',
				menuDateOfReleased: false,
				menuFirstOfPayment: false,
				filteredData: [],
				dialogUpdateInfos: {
					name: '',
					lr: '',
					wi: '',
				},
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
				staffClientForm: {
					codename: this.$route.params.codename,
					info: {
						dateOfReleased: '',
						dateOfFirstPayment: '',
						dateOfLastPayment: '',
						weeksToPay: '',
						infoDesc: '',
						newInfoDesc: '',
					},
					client: {
						client1: {
							clientId: '',
							loanAmount: '',
						},
						client2: {
							clientId: '',
							loanAmount: '',
						},
					},
				},
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
		components: {
			Card,
			CustomDialog,
		},
		created() {
			this.filteredData = this.GP2_GETT_DATA.gp2Info || []
		},
		methods: {
			...mapActions({
				GP2_GET_DATA: 'gp2/GP2_GET_DATA',
				GP2_INSERT_CLIENT: 'gp2/GP2_INSERT_CLIENT',
				GP2_UPDATE_CLIENT: 'gp2/GP2_UPDATE_CLIENT',
				GP2_INFO_CODENAME: 'gp2/GP2_INFO_CODENAME',
			}),
			addGp2() {
				if (this.$refs.formStaffClients.validate()) {
					this.btnAddClient = true
					this.GP2_INSERT_CLIENT(this.staffClientForm)
						.then(async ({ data }) => {
							// this.$toast.success(data.msg.toUpperCase())
							this.dialog = false
							this.btnAddClient = false
							this.errors = []
							// await this.GP2_GET_DATA(this.$route.params.codename)
							this.filteredData.push(data.msg)
							// await this.GP2_INFO_CODENAME(this.$route.params.codename)

							this.$refs.formStaffClients.reset()
							console.log(data)
						})
						.catch((error) => {
							this.btnAddClient = false
							this.errors = error.response.data.error
							console.log(error)
						})
				}
			},
			updateGp2() {
				if (this.$refs.formClientUpdate.validate()) {
					this.btnUpdateClient = true
					this.GP2_UPDATE_CLIENT(this.clientUpdateForm)
						.then(async ({ data }) => {
							this.$toast.success(data.msg.toUpperCase())
							this.dialogUpdate = false
							this.btnUpdateClient = false
							this.resetFields()
							this.filteredData.forEach((value, index, array) => {
								value.gp2Clients.find((client) => {
									if (client.uuid === data.res.uuid) {
										client.loanAmount = data.res.loanAmount
										client.lr = data.res.lr
										client.wi = data.res.wi
										client.skCum = data.res.skCum
										client.userInfo = data.res.userInfo
										client.updatedAt = data.res.updatedAt
									}
								})
							})
						})
						.catch((error) => {
							console.log(error)
							this.btnUpdateClient = false
							this.$toast.error('Something went wrong...')
						})
				}
			},
			resetFields() {
				this.clientUpdateForm.installment = null
				this.clientUpdateForm.sk = null
				this.clientUpdateForm.penalty = null
				this.$refs.formClientUpdate.resetValidation()
			},
			dialogUpdateInfo(info, item) {
				this.dialogUpdate = true
				this.dialogUpdateInfos.name = `${info.clientInfo.firstName} ${info.clientInfo.lastName}`
				this.dialogUpdateInfos.lr = info.lr
				this.dialogUpdateInfos.wi = info.wi
				this.clientUpdateForm.clientUuid = info.clientInfo.uuid
				this.clientUpdateForm.gp2InfoUuid = item.uuid
				this.clientUpdateForm.updatedBy = this.AUTH_GETT_USER.uuid
			},

			loanTerm() {
				if (this.staffClientForm.info.weeksToPay === 16) {
					const date = new Date(this.staffClientForm.info.dateOfFirstPayment)
					date.setDate(date.getDate() + 112)
					const newMonth = '0' + (date.getMonth() + 1)
					const newDate = '0' + date.getDate()
					const newYear = date.getFullYear()
					this.staffClientForm.info.dateOfLastPayment = newYear ? `${newYear}-${newMonth.slice(-2)}-${newDate.slice(-2)}` : ''
				}
			},

			export: function() {
				this.btnExport = true
				this.GP2_GET_DATA(this.$route.params.codename)
					.then(async (response) => {
						const workbook = new ExcelJS.Workbook()
						const worksheet = workbook.addWorksheet('My Sheet')
						const gp2Data = response.data

						let colCum
						let row3 = 3
						let row4 = 4
						let row5 = 5
						let row6 = 6
						let row6_spacing = 0
						let row8 = 8

						worksheet.getColumn('B').width = '25'
						worksheet.getColumn('D').width = '15'
						worksheet.getColumn('E').width = '13'
						worksheet.getColumn('F').width = '13'
						worksheet.getColumn('H').width = '13'
						worksheet.getColumn('I').width = '15'
						worksheet.getColumn('L').width = '15'

						gp2Data.gp2Info.forEach((data) => {
							worksheet.getCell(`B${row3}`).value = 'Codename:'
							worksheet.getCell(`B${row3}`).font = { bold: true }
							worksheet.getCell(`C${row3}`).value = data.id

							worksheet.getCell(`B${row4}`).value = 'Date of Released:'
							worksheet.getCell(`B${row4}`).font = { bold: true }

							worksheet.getCell(`C${row4}`).value = moment(data.dateOfReleased).format('MMMM DD, YYYY')

							worksheet.getCell(`E${row4}`).value = 'Date of First Payment:'
							worksheet.getCell(`E${row4}`).font = { bold: true }
							worksheet.getCell(`G${row4}`).value = moment(data.dateOfFirstPayment).format('MMMM DD, YYYY')

							worksheet.getCell(`E${row3}`).value = 'Loan Term:'
							worksheet.getCell(`E${row3}`).font = { bold: true }
							worksheet.getCell(`F${row3}`).value = data.weeksToPay

							worksheet.getCell(`I${row4}`).value = 'Date of Last Payment:'
							worksheet.getCell(`I${row4}`).font = { bold: true }
							worksheet.getCell(`K${row4}`).value = moment(data.dateOfLastPayment).format('MMMM DD, YYYY')

							worksheet.getCell(`I${row3}`).value = 'Date:'
							worksheet.getCell(`I${row3}`).font = { bold: true }
							worksheet.getCell(`J${row3}`).value = moment().format('MMMM DD, YYYY')

							worksheet.getRow(row8).style = {
								font: { bold: true },
								alignment: { horizontal: 'center' },
							}

							worksheet.getCell(`B${row8}`).value = 'Total'

							worksheet.getRow(row5).style = {
								font: { bold: true },
								alignment: { horizontal: 'center' },
							}

							worksheet.mergeCells(`C${row3}:D${row3}`)
							worksheet.mergeCells(`C${row4}:D${row4}`)
							worksheet.mergeCells(`G${row4}:H${row4}`)
							worksheet.mergeCells(`K${row4}:L${row4}`)
							worksheet.mergeCells(`J${row5}:L${row5}`)
							worksheet.mergeCells(`J${row8}:L${row8}`)

							worksheet.getCell(`B${row5}`).value = 'Clientname'
							worksheet.getCell(`C${row5}`).value = 'LR'
							worksheet.getCell(`D${row5}`).value = 'SK CUM'
							worksheet.getCell(`E${row5}`).value = 'Past Due'
							worksheet.getCell(`F${row5}`).value = 'Penalty'
							worksheet.getCell(`G${row5}`).value = 'WI'
							worksheet.getCell(`H${row5}`).value = 'COL CUM'
							worksheet.getCell(`I${row5}`).value = 'Week #'
							worksheet.getCell(`J${row5}`).value = 'Signature'

							data.gp2Clients.forEach((client, index) => {
								if (data.weeksToPay === 16) {
									//16 weeks
									colCum = client.loanAmount * 1.2 - client.lr
								}

								worksheet.mergeCells(`J${row6 + row6_spacing}:L${row6 + row6_spacing}`)
								worksheet.getRow(row6 + row6_spacing).style = {
									alignment: { horizontal: 'center' },
								}
								worksheet.getCell(`A${row6 + row6_spacing}`).value = index + 1 + '. '
								worksheet.getCell(`B${row6 + row6_spacing}`).value = (client.clientInfo.firstName + ' ' + client.clientInfo.middleInitial + ' ' + client.clientInfo.lastName).toUpperCase()
								worksheet.getCell(`C${row6 + row6_spacing}`).value = client.lr.toLocaleString()
								worksheet.getCell(`D${row6 + row6_spacing}`).value = client.skCum ? client.skCum.toLocaleString() : '-'
								worksheet.getCell(`E${row6 + row6_spacing}`).value = client.pastDue ? client.pastDue.toLocaleString() : '-'
								worksheet.getCell(`G${row6 + row6_spacing}`).value = client.wi ? client.wi.toLocaleString() : '-'
								worksheet.getCell(`H${row6 + row6_spacing}`).value = colCum ? colCum.toLocaleString() : '-'
								worksheet.getCell(`I${row6 + row6_spacing}`).value = data.dateOfFirstPayment ? moment().diff(data.dateOfFirstPayment, 'weeks') : '-'

								row6++
							})

							worksheet.getCell(`C${row8}`).value = data.totals.lr ? data.totals.lr.toLocaleString() : '-'
							worksheet.getCell(`D${row8}`).value = data.totals.skCum ? data.totals.skCum.toLocaleString() : '-'
							worksheet.getCell(`E${row8}`).value = data.totals.pastDue ? data.totals.pastDue.toLocaleString() : '-'
							worksheet.getCell(`G${row8}`).value = data.totals.wi ? data.totals.wi.toLocaleString() : '-'

							row3 += 7
							row4 += 7
							row5 += 7
							row8 += 7

							row6_spacing += 5
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
						this.btnExport = false
						this.$toast.success('Successfully exported!')
					})
					.catch((error) => {
						console.log(error)
						this.btnExport = false
						this.$toast.error('Something went wrong...')
					})
			},
			ruleInfoDesc: function(val) {
				if (this.chkBoxInfoDesc === 'existing') {
					if (val === null || val.length === 0) {
						return 'Existing codename is required!'
					} else {
						return true
					}
				}
				return true
			},
			ruleNewInfoDesc: function(val) {
				if (this.chkBoxInfoDesc === 'new') {
					if (val === null || val.length === 0) {
						return 'New codename is required!'
					} else if (!/^[A-Za-z]+$/.test(val)) {
						return 'Letters Only!'
					} else if (val.length > 4) {
						return 'Maximum of 4 characters!'
					} else {
						return true
					}
				}
				return true
			},
		},
		computed: {
			...mapGetters({
				GP2_GETT_DATA: 'gp2/GP2_GETT_DATA',
				CLIENT_GETT_DATA_ALL: 'clients/CLIENT_GETT_DATA_ALL',
				AUTH_GETT_USER: 'auth/AUTH_GETT_USER',
				GP2_GETT_DATA_INFO_CODENAME: 'gp2/GP2_GETT_DATA_INFO_CODENAME',
			}),
		},
		watch: {
			chkBoxInfoDesc: function(val) {
				if (val === 'existing') {
					this.$refs.newInfoDesc.reset()
				} else if (val === 'new') {
					this.$refs.infoDesc.reset()
				}
			},
			search: function(v) {
				const data = this.GP2_GETT_DATA.gp2Info.filter((value) => value.id.includes(v.toUpperCase()))
				this.filteredData = data
			},
		},
	}
</script>
