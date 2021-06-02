<template>
	<div>
		<card>
			<div slot="card-title">Clients</div>
			<div slot="card-button"></div>
			<div slot="card-text">
				<custom-dialog :modal="dialog" :width="maxWidth">
					<div slot="modal-title">
						Add New Client
					</div>
					<div slot="modal-text">
						<v-form @submit.prevent="addClient" ref="formClient">
							<v-container>
								<v-row>
									<v-col cols="4">
										<v-text-field
											label="* Last Name"
											name="lastName"
											v-model.trim="clientForm.lastName"
											required
											type="text"
											prepend-inner-icon="mdi-account"
											maxlength="15"
											autocomplete="off"
											:rules="[(v) => !!v || 'Last name is required!', (v) => /^[a-z A-zÑñ.]+$/.test(v) || 'Letters only!']"
										>
										</v-text-field>
									</v-col>
									<v-col cols="4">
										<v-text-field
											label="* First Name"
											name="firstName"
											v-model.trim="clientForm.firstName"
											required
											prepend-inner-icon="mdi-account"
											autocomplete="off"
											maxlength="15"
											:rules="[(v) => !!v || 'First name is required!', (v) => /^[a-z A-zÑñ.]+$/.test(v) || 'Letters only!']"
										>
										</v-text-field>
									</v-col>
									<v-col cols="4">
										<v-text-field
											label="Middle Initial"
											v-model.trim="clientForm.middleInitial"
											required
											prepend-inner-icon="mdi-account"
											autocomplete="off"
											:rules="[
												(v) =>
													v.length > 0
														? /^[a-zA-ZÑñ]{1,2}(\.){1,1}$/.test(v) || 'At least one or two characters & must contain a one (.) at the end'
														: true,
											]"
										>
										</v-text-field>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="4">
										<v-text-field
											v-model.trim="clientForm.birthdate"
											label="Birthday"
											name="birthdate"
											type="tel"
											v-mask="'##/##/####'"
											prepend-inner-icon="mdi-calendar"
											autocomplete="off"
											placeholder="mm/dd/yyyy"
											:rules="[
												(v) => (v.length > 0 ? moment(v, 'MM/DD/YYYY', true).isValid() || 'Invalid Date' : true),
												(v) =>
													v.length > 9
														? (v.split('/')[2] >= 1900 && v.split('/')[2] <= 3000) || 'Invalid Year! (Min of 1900 & Max of 3000)'
														: true,
											]"
											required
										></v-text-field>
									</v-col>
									<v-col cols="4">
										<v-text-field
											label="Contact No."
											v-mask="'(####) ### ####'"
											:rules="[(v) => (v.length > 0 ? v.length >= 15 || 'Invalid number!' : true)]"
											type="tel"
											placeholder="(09XX) XXX XXXX"
											autocomplete="off"
											v-model.number.trim="clientForm.contactNo"
											required
											prepend-inner-icon="mdi-phone"
										>
										</v-text-field>
									</v-col>
									<v-col cols="4">
										<v-textarea
											rows="1"
											label="* Address"
											autocomplete="off"
											v-model.trim="clientForm.address"
											name="address"
											prepend-inner-icon="mdi-map-marker"
											:rules="[(v) => !!v || 'Address is required!']"
										>
										</v-textarea>
									</v-col>
								</v-row>
							</v-container>
							<v-card-actions class="justify-end">
								<v-btn color="primary darken-1" @click=";(dialog = !dialog), formReset()" text>
									Close
								</v-btn>
								<v-btn color="primary darken-1" :disabled="btnAddClient" :loading="btnAddClient" type="submit" text>
									Add
								</v-btn>
							</v-card-actions>
						</v-form>
					</div>
				</custom-dialog>
				<custom-dialog :modal="dialogDelete" width="290px">
					<div slot="modal-title">Delete {{ dialogInfoDelete.name }}?</div>
					<div slot="modal-text">{{ dialogInfoDelete.name }} is deleted...</div>
					<div slot="modal-action" class="text-right">
						<v-spacer></v-spacer>
						<v-btn color="red darken-1" @click.stop="dialogDelete = false" text>Cancel</v-btn>
						<v-btn color="red darken-2" class="font-weight-black" :loading="btnDeleteClient" @click="deleteClient" text>Delete</v-btn>
					</div>
				</custom-dialog>
				<custom-dialog :modal="dialogEdit" :width="maxWidth">
					<div slot="modal-title">Edit</div>
					<div slot="modal-text">
						<v-form @submit.prevent="editClient" ref="formClientEdit">
							<v-container>
								<v-row>
									<v-col cols="4">
										<v-text-field
											label="* Last Name"
											name="lastName"
											value=""
											v-model.trim="dialogInfoEdit.lastName"
											prepend-inner-icon="mdi-account"
											autocomplete="off"
											maxlength="20"
											:rules="[(v) => !!v || 'Last name is required!', (v) => /^[a-z A-zÑñ.]+$/.test(v) || 'Letters only!']"
										>
										</v-text-field>
									</v-col>
									<v-col cols="4">
										<v-text-field
											label="* First Name"
											name="firstName"
											v-model.trim="dialogInfoEdit.firstName"
											prepend-inner-icon="mdi-account"
											autocomplete="off"
											maxlength="20"
											:rules="[(v) => !!v || 'First name is required!', (v) => /^[a-z A-zÑñ.]+$/.test(v) || 'Letters only!']"
										>
										</v-text-field>
									</v-col>
									<v-col cols="4">
										<v-text-field
											label="Middle Initial"
											v-model.trim="dialogInfoEdit.middleInitial"
											prepend-inner-icon="mdi-account"
											autocomplete="off"
											:rules="[
												(v) =>
													v.length > 0
														? /^[a-zA-ZÑñ]{1,2}(\.){1,1}$/.test(v) || 'At least one or two characters & must contain a one (.) at the end'
														: true,
											]"
										>
										</v-text-field>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="4">
										<v-text-field
											v-model.trim="dialogInfoEdit.birthdate"
											label="Birthday"
											name="birthdate"
											type="tel"
											v-mask="'##/##/####'"
											prepend-inner-icon="mdi-calendar"
											autocomplete="off"
											placeholder="mm/dd/yyyy"
											:rules="[
												(v) => (v.length > 0 ? moment(v, 'MM/DD/YYYY', true).isValid() || 'Invalid Date' : true),
												(v) =>
													v.length > 9
														? (v.split('/')[2] >= 1900 && v.split('/')[2] <= 3000) || 'Invalid Year! (Min of 1900 & Max of 3000)'
														: true,
											]"
										></v-text-field>
									</v-col>
									<v-col cols="4">
										<v-text-field
											label="Contact No."
											v-mask="'(####) ### ####'"
											autocomplete="off"
											placeholder="(09XX) XXX XXXX"
											:rules="[(v) => (v.length > 0 ? v.length >= 15 || 'Invalid number!' : true)]"
											v-model.number.trim="dialogInfoEdit.contactNo"
											required
											prepend-inner-icon="mdi-phone"
											type="tel"
										>
										</v-text-field>
									</v-col>
									<v-col cols="4">
										<v-textarea
											rows="1"
											label="* Address"
											autocomplete="off"
											v-model.trim="dialogInfoEdit.address"
											name="address"
											prepend-inner-icon="mdi-map-marker"
											:rules="[(v) => !!v || 'Address is required!']"
										>
										</v-textarea>
									</v-col>
								</v-row>
							</v-container>
							<v-card-actions class="justify-end">
								<v-btn color="blue darken-1" @click="dialogEdit = false" text>Cancel</v-btn>
								<v-btn color="blue darken-2" class="font-weight-black" :loading="btnEditClient" type="submit" text>Edit</v-btn>
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
								<v-btn color="blue" outlined rounded @click.stop="dialog = true">
									<v-icon dark left>
										mdi-plus
									</v-icon>
									Add Client
								</v-btn>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
				<v-card-title>
					<v-text-field prepend-inner-icon="mdi-magnify" label="Search..." single-line hide-details v-model.trim="search"> </v-text-field
				></v-card-title>
				<v-data-table
					:headers="headers"
					:items="filteredData"
					:items-per-page="10"
					:footer-props="{
						'items-per-page-options': [10, 20, 30],
					}"
					class="elevation-1"
					item-key="id"
					:server-items-length="filteredTotalData"
					:options.sync="setOptions"
					:loading="loading"
					loading-text="Loading... Please wait"
				>
					<template v-slot:item="{ item }">
						<tr>
							<td>
								{{ (item.firstName + ' ' + item.lastName + ' ' + item.middleInitial).toUpperCase() }}
							</td>
							<td>
								{{ item.loanCycle || 0 }}
							</td>
							<td>
								{{ item.address.toUpperCase() }}
							</td>
							<td>
								<v-btn @click="deleteClientInfo(item)" color="error" icon>
									<v-icon>mdi-delete</v-icon>
								</v-btn>
								<v-btn color="warning" @click="editClientInfo(item)" icon>
									<v-icon>mdi-pencil</v-icon>
								</v-btn>
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
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
	name: 'Clients',
	data() {
		return {
			filteredData: [],
			filteredTotalData: {},
			dateMenu: false,
			dialog: false,
			dialogDelete: false,
			dialogInfoDelete: { id: '', name: '' },
			dialogInfoEdit: {
				firstName: '',
				lastName: '',
				middleInitial: '',
				birthdate: '',
				contactNo: '',
				address: '',
			},
			dialogEdit: false,
			maxWidth: '800px',
			clients: [],
			search: '',
			loading: false,
			waitSearch: false,
			btnAddClient: false,
			error: '',
			btnDeleteClient: false,
			btnEditClient: false,
			clientUuid: '',
			clientForm: {
				firstName: '',
				lastName: '',
				middleInitial: '',
				birthdate: '',
				contactNo: '',
				address: '',
			},
			rules: {
				middleInitial: (value) => {
					const pattern = /^[A-Za-z]{1,2}(\.{1,1})$/
					return value == '' ? this.value || 'Middle Initial is required!' : pattern.test(value) || 'Must contain a (.)'
				},
			},
			headers: [
				{
					text: 'Client Name',
					align: 'start',
					sortable: true,
				},
				{
					text: 'Loan Cycle',
					align: 'start',
				},
				{
					text: 'Address',
					align: 'start',
				},
				{
					text: 'Action',
					align: 'start',
				},
			],
		}
	},
	created() {
		this.filteredData = this.CLIENT_GETT_DATA.clients
		this.filteredTotalData = this.CLIENT_GETT_DATA.totalItems
	},
	components: {
		Card,
		CustomDialog,
	},
	computed: {
		...mapGetters({
			CLIENT_GETT_DATA: 'clients/CLIENT_GETT_DATA',
			CLIENT_GETT_OPTIONS: 'clients/CLIENT_GETT_OPTIONS',
		}),
		setOptions: {
			get() {
				return this.CLIENT_GETT_OPTIONS
			},
			set(value) {
				this.$store.commit('clients/CLIENT_SET_OPTIONS', value)
			},
		},
	},
	methods: {
		...mapActions({
			CLIENT_GET_DATA: 'clients/CLIENT_GET_DATA',
			CLIENT_GET_DATA_ALL: 'clients/CLIENT_GET_DATA_ALL',
			CLIENT_INSERT_DATA: 'clients/CLIENT_INSERT_DATA',
			CLIENT_DELETE: 'clients/CLIENT_DELETE',
			CLIENT_UPDATE: 'clients/CLIENT_UPDATE',
		}),
		reloadData: function() {
			this.filteredData = this.CLIENT_GETT_DATA.clients
			this.filteredTotalData = this.CLIENT_GETT_DATA.totalItems
		},
		formReset: function() {
			for (const key in this.clientForm) {
				this.clientForm[key] = ''
			}
			this.$refs.formClient.resetValidation()
		},
		addClient: function() {
			if (this.$refs.formClient.validate()) {
				this.btnAddClient = true
				this.CLIENT_INSERT_DATA(this.clientForm)
					.then(({ data }) => {
						this.filteredData.push(data.msg)
						this.filteredTotalData++
						this.btnAddClient = false
						this.dialog = false
						this.$toast.success(
							`${this.clientForm.firstName} ${this.clientForm.middleInitial} ${this.clientForm.lastName} is added!`.toUpperCase()
						)
						this.formReset()
					})
					.catch((error) => {
						this.btnAddClient = false
						this.$toast.error(
							`${this.clientForm.firstName} ${this.clientForm.middleInitial} ${this.clientForm.lastName} is exist!`.toUpperCase()
						)
					})
			}
		},
		deleteClientInfo: async function(item) {
			this.dialogInfoDelete.name = (item.firstName + ' ' + item.lastName).toLocaleLowerCase()
			this.dialogInfoDelete.id = item.uuid
			this.dialogDelete = true
		},
		editClientInfo: async function(item) {
			const [year, month, day] = item.birthdate !== null ? item.birthdate.split('-') : []
			this.dialogInfoEdit.id = item.uuid
			this.dialogInfoEdit.firstName = item.firstName
			this.dialogInfoEdit.lastName = item.lastName
			this.dialogInfoEdit.middleInitial = item.middleInitial
			this.dialogInfoEdit.birthdate = item.birthdate === null ? '' : month + '/' + day + '/' + year
			this.dialogInfoEdit.contactNo = item.contactNo
			this.dialogInfoEdit.address = item.address
			this.dialogEdit = true
		},
		editClient: function() {
			if (this.$refs.formClientEdit.validate()) {
				this.btnEditClient = true
				this.CLIENT_UPDATE(this.dialogInfoEdit)
					.then(({ data }) => {
						this.filteredData.filter((value) => {
							if (value.uuid === data.msg.uuid) {
								for (const key in value) {
									value[key] = data.msg[key]
								}
							}
						})
						this.$toast.success('Client Updated!')
						this.btnEditClient = false
						this.dialogEdit = false
					})
					.catch((error) => {
						this.btnEditClient = false
						console.log(error)
						this.$toast.error('Something went wrong...')
					})
			}
		},
		deleteClient: function() {
			this.btnDeleteClient = true
			this.CLIENT_DELETE(this.dialogInfoDelete.id)
				.then(({ data }) => {
					const remainingData = this.filteredData.filter((value) => value.uuid !== this.dialogInfoDelete.id)
					this.filteredData = remainingData
					this.filteredTotalData--
					this.$toast.success(data.msg)
					this.btnDeleteClient = false
					this.dialogDelete = false
				})
				.catch((error) => {
					this.btnDeleteClient = false
					console.log(error)
					this.$toast.error('Something went wrong...')
				})
		},
	},

	watch: {
		setOptions: async function() {
			this.loading = true
			this.CLIENT_GET_DATA()
				.then(() => {
					this.loading = false
					this.reloadData()
				})
				.catch((error) => {
					console.log(error)
					this.$toast.error('Something went wrong...')
					this.$Progress.fail()
				})
		},
		search: function(val) {
			this.$store.commit('clients/CLIENT_SET_SEARCH', val.toLowerCase())
			this.loading = true
			if (!this.waitSearch) {
				setTimeout(async () => {
					await this.CLIENT_GET_DATA()
					this.reloadData()
					this.waitSearch = false
					this.loading = false
				}, 2000)
				this.waitSearch = true
			}
		},
	},
}
</script>

<style scoped>
input,
textarea {
	text-transform: uppercase;
}
</style>
