<template>
	<div>
		<card>
			<div slot="card-title">Staffs</div>
			<div slot="card-button" class="float-right">
				<custom-dialog :modal="dialog" :width="maxWidth">
					<div slot="modal-title">
						{{ vFormStatus === 'onAdd' ? '	Add New Staff' : 'Edit Staff' }}
					</div>
					<div slot="modal-text">
						<v-form @submit.prevent="vFormStatus === 'onAdd' ? addStaff() : editStaff()" ref="formStaff">
							<v-container>
								<v-row>
									<v-col cols="4">
										<v-text-field
											autocomplete="off"
											label="* First Name"
											v-model.trim="staffForm.firstName"
											name="firstName"
											prepend-inner-icon="mdi-account"
											required
											:rules="[(v) => !!v || 'First name is required!']"
										>
										</v-text-field>
									</v-col>
									<v-col cols="4">
										<v-text-field
											autocomplete="off"
											label="* Last Name"
											v-model.trim="staffForm.lastName"
											name="lastName"
											prepend-inner-icon="mdi-account"
											required
											:rules="[(v) => !!v || 'Last name is required!']"
										>
										</v-text-field>
									</v-col>
									<v-col cols="4">
										<v-text-field
											autocomplete="off"
											label="* Codename"
											v-model.trim="staffForm.codeName"
											name="codeName"
											prepend-inner-icon="mdi-hard-hat"
											required
											:rules="[(v) => !!v || 'Codename is required!']"
										>
										</v-text-field>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="4">
										<v-text-field
											autocomplete="off"
											label="ID No."
											v-model.trim.number="staffForm.idNo"
											type="number"
											name="idNo"
											prepend-inner-icon="mdi-card-account-details"
											:rules="[(v) => v >= 0 || 'Invalid I.D No.']"
										>
										</v-text-field>
									</v-col>
									<v-col cols="4">
										<v-text-field
											autocomplete="off"
											label="Contact No. "
											v-mask="'(####) ### ####'"
											:rules="[(v) => (v.length > 0 ? v.length >= 15 || 'Invalid number!' : true)]"
											type="tel"
											placeholder="(09XX) XXX XXXX"
											v-model.trim.number="staffForm.contactNo"
											name="contactNo"
											prepend-inner-icon="mdi-phone"
										>
										</v-text-field>
									</v-col>
									<v-col cols="4">
										<v-textarea autocomplete="off" rows="1" auto-grow label="Address" prepend-inner-icon="mdi-map-marker" v-model.trim="staffForm.address" name="address" required> </v-textarea>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="6">
										<v-select
											:items="BRANCH_GETT_DATA"
											item-value="uuid"
											prepend-inner-icon="mdi-domain"
											label="* Assigned Branch"
											v-model="staffForm.uuidBranchId"
											:rules="[(v) => !!v || 'Branch is required!']"
										>
											<template v-slot:selection="{ item }">
												{{ $titleize(item.branchName) }}
											</template>
											<template v-slot:item="{ item }">
												{{ $titleize(item.branchName) }}
											</template>
										</v-select>
									</v-col>
								</v-row>
							</v-container>
						</v-form>
					</div>
					<div slot="modal-action">
						<v-btn color="primary darken-1" @click="toggleDialog" text>
							Close
						</v-btn>
						<v-btn color="primary darken-1" :loading="btnToggle" @click="vFormStatus === 'onAdd' ? addStaff() : editStaff()" text>
							{{ vFormStatus === 'onAdd' ? 'Add' : 'Edit' }}
						</v-btn>
					</div>
				</custom-dialog>
			</div>
			<div slot="card-text">
				<v-card class="elevation-5 mb-6">
					<v-card-text>
						<v-row>
							<v-col cols="12">
								<v-btn color="primary" outlined rounded dark @click="toggleDialog(), (vFormStatus = 'onAdd')">
									<v-icon dark left>
										mdi-plus
									</v-icon>
									Add Staff
								</v-btn>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
				<v-text-field solo class="elevation-4 mb-6" v-model="search" append-icon="mdi-magnify" label="Search staff..." single-line hide-details></v-text-field>
				<v-data-table :headers="headers" :items="filteredData" :items-per-page="5" class="elevation-10 mb-6">
					<template v-slot:item="{ item }">
						<tr>
							<td>{{ $titleize(item.firstName + ' ' + item.lastName) }}</td>
							<td>{{ $titleize(item.branch.branchName) }}</td>
							<td class="text-center">
								<v-btn :disabled="true" color="error" icon>
									<v-icon>mdi-delete</v-icon>
								</v-btn>
								<v-btn color="warning" @click="editStaffInfo(item)" icon>
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
	import CustomDialog from '@/components/Dialogs/Dialog'
	import Card from '@/components/Card'
	import { mapActions, mapGetters } from 'vuex'

	export default {
		data() {
			return {
				dialog: false,
				maxWidth: '700px',
				search: '',
				btnToggle: false,
				filteredData: [],
				vFormStatus: 'onAdd',
				headers: [
					{
						text: 'Staff Name',
						align: 'start',
						sortable: false,
					},
					{
						text: 'Branch Assigned',
						align: 'start',
						sortable: false,
					},
					{
						text: 'Action',
						align: 'center',
						sortable: false,
					},
				],
				staffForm: {
					uuidBranchId: '',
					firstName: '',
					lastName: '',
					codeName: '',
					idNo: '',
					contactNo: '',
					address: '',
				},
			}
		},
		components: {
			Card,
			CustomDialog,
		},
		created() {
			this.filteredData = this.STAFF_GETT_DATA
		},
		methods: {
			...mapActions({
				STAFF_GET_DATA: 'staffs/STAFF_GET_DATA',
				STAFF_INSERT_DATA: 'staffs/STAFF_INSERT_DATA',
				STAFF_UPDATE_DATA: 'staffs/STAFF_UPDATE_DATA',
			}),
			toggleDialog() {
				this.dialog = !this.dialog
				this.formReset()
			},
			formReset: function() {
				for (const key in this.staffForm) {
					this.staffForm[key] = ''
				}
				this.$refs.formStaff.resetValidation()
				delete this.staffForm.uuid
			},
			addStaff: function() {
				if (this.$refs.formStaff.validate()) {
					this.btnToggle = true
					this.STAFF_INSERT_DATA(this.staffForm)
						.then(({ data }) => {
							this.filteredData.push(data.msg)
							this.$toasted.success(this.$titleize(data.msg.firstName + ' ' + data.msg.lastName) + ' is added!', { icon: 'check' })
							this.btnToggle = false
							this.dialog = false
							this.formReset()
						})
						.catch((error) => {
							this.btnToggle = false
							this.$toasted.error('Something went wrong...', { icon: 'close' })
							console.error(error)
						})
				}
			},
			editStaffInfo: function(data) {
				this.dialog = true
				this.vFormStatus = 'onUpdate'
				for (const key in this.staffForm) {
					this.staffForm[key] = data[key]
				}
				this.staffForm.uuidBranchId = data.branch.uuid
				this.staffForm.uuid = data.uuid
			},
			editStaff: function() {
				if (this.$refs.formStaff.validate()) {
					this.STAFF_UPDATE_DATA(this.staffForm).then(({ data }) => {
						this.filteredData.filter((value) => {
							if (value.uuid === data.msg.uuid) {
								for (const key in value) {
									value[key] = data.msg[key]
								}
							}
						})
						this.$toast.success('Staff updated!')
						this.dialog = false
						this.btnToggle = false
						this.formReset()
					})
				}
			},
		},
		computed: {
			...mapGetters({
				STAFF_GETT_DATA: 'staffs/STAFF_GETT_DATA',
				BRANCH_GETT_DATA: 'branch/BRANCH_GETT_DATA',
			}),
		},
		mounted() {
			//check if branch state is set
			// if (this.data.length === 0) {
			//   this.$Progress.start()
			//   this.get()
			//     .then(() => {
			//       this.$Progress.finish()
			//     })
			//     .catch((error) => {
			//       console.error(error.response.data.error.message)
			//       this.$Progress.fail()
			//     })
			// }
		},
	}
</script>
