<template>
	<div>
		<custom-dialog :modal="dialog" :width="maxWidth">
			<div slot="modal-title">Reloan</div>
			<div slot="modal-text">
				<v-form @submit.prevent="reloan" ref="formReloan">
					<v-container>
						<v-row>
							<v-col cols="6">
								<v-menu ref="dateOfReleased" v-model="menuDateOfReleased" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field
											label="* Date of Released"
											v-mask="'####-##-##'"
											prepend-inner-icon="mdi-calendar"
											autocomplete="off"
											v-bind="attrs"
											v-on="on"
											clearable
											v-model.trim="reloanInfo.info.dateOfReleased"
											:rules="[(v) => !!v || 'Date of releasaed is required!']"
										></v-text-field>
									</template>

									<v-date-picker v-model.trim="reloanInfo.info.dateOfReleased" no-title scrollable>
										<v-spacer></v-spacer>
										<div class="justify-end">
											<v-btn text color="primary" @click="menuDateOfReleased = false">
												Cancel
											</v-btn>
											<v-btn text color="primary" @click="$refs.dateOfReleased.save(reloanInfo.info.dateOfReleased)">
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
									:rules="[(v) => !!v || 'Loan Term is required!']"
									label="* Loan Term"
									@change="loanTerm"
									v-model="reloanInfo.info.weeksToPay"
								></v-select>
							</v-col>
						</v-row>

						<v-row>
							<v-col cols="6">
								<v-menu ref="dateOfFirstPayment" v-model="menuFirstOfPayment" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
									<template v-slot:activator="{ on, attrs }">
										<v-text-field
											label="* Date of First Payment"
											v-mask="'####-##-##'"
											:rules="[(v) => !!v || 'Date of First Payment is required!']"
											autocomplete="off"
											v-bind="attrs"
											clearable
											prepend-inner-icon="mdi-calendar"
											v-on="on"
											v-model="reloanInfo.info.dateOfFirstPayment"
										></v-text-field>
									</template>

									<v-date-picker v-model="reloanInfo.info.dateOfFirstPayment" @change="loanTerm" no-title scrollable>
										<v-spacer></v-spacer>
										<div class="justify-end">
											<v-btn text color="primary" @click="menuFirstOfPayment = false">
												Cancel
											</v-btn>
											<v-btn text color="primary" @click="$refs.dateOfFirstPayment.save(reloanInfo.info.dateOfFirstPayment)">
												OK
											</v-btn>
										</div>
									</v-date-picker>
								</v-menu>
							</v-col>
							<v-col cols="6">
								<v-text-field
									v-model="reloanInfo.info.dateOfLastPayment"
									label="* Date of Last Payment"
									autocomplete="off"
									:rules="[(v) => !!v || 'Date of Last Payment is required!']"
									prepend-inner-icon="mdi-calendar"
									readonly
								></v-text-field>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="6">
								<v-autocomplete
									label="* Client 1"
									:items="clientInfo"
									readonly
									item-value="uuid"
									prepend-inner-icon="mdi-account-plus"
									:rules="[(v) => !!v || 'Client 1 is required!']"
									:item-text="(item) => (item.clientInfo.firstName + ' ' + item.clientInfo.lastName).toUpperCase()"
									v-model="reloanInfo.client.client1.clientId"
								>
								</v-autocomplete>
							</v-col>
							<v-col cols="6">
								<v-text-field
									label="* Loan Amount"
									v-model.number="reloanInfo.client.client1.loanAmount"
									required
									:rules="[(v) => !!v || 'Loan Amount is required!']"
									type="number"
									prepend-inner-icon="mdi-currency-php"
									autocomplete="off"
									class="branch-name"
								>
								</v-text-field>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="6">
								<v-autocomplete
									label="* Client 2"
									readonly
									:items="clientInfo"
									item-value="uuid"
									:rules="[(v) => !!v || 'Client 2 is required!']"
									prepend-inner-icon="mdi-account-plus"
									:item-text="(item) => (item.clientInfo.firstName + ' ' + item.clientInfo.lastName).toUpperCase()"
									v-model="reloanInfo.client.client2.clientId"
								>
								</v-autocomplete>
							</v-col>
							<v-col cols="6">
								<v-text-field
									v-model.number="reloanInfo.client.client2.loanAmount"
									label="* Loan Amount"
									class="branch-name"
									prepend-inner-icon="mdi-currency-php"
									autocomplete="off"
									:rules="[(v) => !!v || 'Loan Amount is required!']"
									type="number"
								>
								</v-text-field
							></v-col>
						</v-row>
					</v-container>
					<v-card-actions class="justify-end">
						<v-btn color="primary darken-1" @click=";(dialog = !dialog), $refs.formReloan.reset()" text>
							Close
						</v-btn>
						<v-btn color="primary darken-1" :loading="btnReloan" type="submit" text>
							Reloan
						</v-btn>
					</v-card-actions>
				</v-form>
			</div>
		</custom-dialog>
		<card>
			<div slot="card-title">
				Completed Accounts
			</div>

			<div slot="card-text">
				<v-card-title> <v-text-field v-model="search" append-icon="mdi-magnify" label="Search gp2 code or client name..." single-line hide-details></v-text-field></v-card-title>
				<v-data-table :headers="headers" :items="GP2_GETT_DATA_COMPLETED.gp2Info" :expanded.sync="expanded" :single-expand="true" item-key="uuid" class="elevation-2">
					<template v-slot:item="{ item, expand, isExpanded }">
						<tr class="blue darken-4 white--text">
							<td>{{ item.id }}</td>
							<td>{{ moment().diff(item.dateOfFirstPayment, 'weeks') }}</td>
							<td>{{ item.weeksToPay }} Weeks</td>
							<td>{{ moment(item.dateOfReleased).format('MMMM DD, YYYY') }}</td>
							<td>{{ moment(item.dateOfFirstPayment).format('MMMM DD, YYYY') }}</td>
							<td>{{ moment(item.dateOfLastPayment).format('MMMM DD, YYYY') }}</td>
							<td class="text-center">
								<v-icon dark class="mr-4" @click="expand(!isExpanded), (show = !show)"> {{ isExpanded ? 'mdi-arrow-right' : 'mdi-arrow-down' }}</v-icon>

								<v-icon dark @click=";(dialog = !dialog), reloanInfos(item)"> mdi-autorenew</v-icon>
							</td>
						</tr>
					</template>

					<template v-slot:expanded-item="{ item }">
						<tr class="grey lighten-3">
							<th>Client Name</th>
							<th>LR</th>
							<th>SK CUM</th>
							<th>W.I</th>
							<th>Past Due</th>
							<th>Updated By</th>
							<th class="text-center"></th>
						</tr>
						<tr v-for="(client, i) in item.gp2Clients" :key="i">
							<td>
								{{ i + 1 }}.
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
								<!--
								<v-icon class="mr-2" @click="dialogUpdateInfo(client, item)">
									mdi-pencil
								</v-icon>
								<v-btn icon :to="`${data.codeName}-gp2/${client.clientInfo.slug}.${item.uuid}`">
									<v-icon>
										mdi-eye
									</v-icon>
								</v-btn>
								-->
							</td>
						</tr>
						<tr>
							<td class="font-weight-black"></td>

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
						</tr>
					</template>
				</v-data-table>
			</div>
		</card>
	</div>
</template>

<script>
	import Card from '@/components/Card'
	import CustomDialog from '@/components/Dialog'
	import { mapActions, mapGetters } from 'vuex'

	export default {
		data() {
			return {
				show: false,
				expanded: [],
				dialog: false,
				maxWidth: '700px',
				search: '',
				errors: [],
				menuDateOfReleased: false,
				menuFirstOfPayment: false,
				btnReloan: false,
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
				reloanInfo: {
					info: {
						id: '',
						dateOfReleased: '',
						dateOfFirstPayment: '',
						dateOfLastPayment: '',
						weeksToPay: '',
					},
					client: {
						client1: { clientId: '', loanAmount: '' },
						client2: { clientId: '', loanAmount: '' },
					},
				},
				clientInfo: {},
			}
		},
		components: {
			Card,
			CustomDialog,
		},
		methods: {
			...mapActions({
				GP2_RELOAN: 'gp2/GP2_RELOAN',
				GP2_GET_DATA_COMPLETED: 'gp2/GP2_GET_DATA_COMPLETED',
			}),
			reloanInfos: function(item) {
				this.info = item
				this.reloanInfo.info.id = item.uuid
				this.clientInfo = item.gp2Clients
				this.reloanInfo.client.client1.clientId = item.gp2Clients[0].uuid
				this.reloanInfo.client.client2.clientId = item.gp2Clients[1].uuid
			},
			reloan: function() {
				if (this.$refs.formReloan.validate()) {
					this.btnReloan = true
					this.GP2_RELOAN({ codename: this.$route.params.codename, payload: this.reloanInfo })
						.then(async ({ data }) => {
							await this.GP2_GET_DATA_COMPLETED(this.$route.params.codename)
							this.dialog = false
							this.btnReloan = false
							this.$toast.success(data.msg.toUpperCase())
						})
						.catch((error) => {
							console.log(error)
							this.btnReloan = false
							this.$toast.error('Something went wrong...')
						})
				}
			},
			loanTerm: function() {
				if (this.reloanInfo.info.weeksToPay === 16) {
					const date = new Date(this.reloanInfo.info.dateOfFirstPayment)
					date.setDate(date.getDate() + 112)
					const newMonth = '0' + (date.getMonth() + 1)
					const newDate = '0' + date.getDate()
					const newYear = date.getFullYear()

					this.reloanInfo.info.dateOfLastPayment = newYear ? `${newYear}-${newMonth.slice(-2)}-${newDate.slice(-2)}` : ''
				}
			},
		},
		computed: {
			...mapGetters({
				GP2_GETT_DATA_COMPLETED: 'gp2/GP2_GETT_DATA_COMPLETED',
				AUTH_GETT_USER: 'auth/AUTH_GETT_USER',
			}),
		},
	}
</script>
