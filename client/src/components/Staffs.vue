<template>
	<div>
		<card>
			<div slot="card-title">Staffs</div>
			<div slot="card-button" class="float-right">
				<custom-dialog :modal="dialog" :width="maxWidth">
					<div slot="modal-title">
						Add New Staff
					</div>
					<div slot="modal-text">
						<v-form @submit.prevent="addStaff" ref="formStaff">
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
												{{ item.branchName.toUpperCase() }}
											</template>
											<template v-slot:item="{ item }">
												{{ item.branchName.toUpperCase() }}
											</template>
										</v-select>
									</v-col>
								</v-row>
							</v-container>
							<v-card-actions class="justify-end">
								<v-btn color="primary darken-1" @click=";(dialog = !dialog), $refs.formStaff.reset()" text>
									Close
								</v-btn>
								<v-btn color="primary darken-1" :disabled="btnAddStaff" :loading="btnAddStaff" type="submit" text>
									Add
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
								<v-btn color="primary" outlined rounded dark @click.stop="dialog = true">
									<v-icon dark left>
										mdi-plus
									</v-icon>
									Add Staff
								</v-btn>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
				<v-card-title> <v-text-field v-model="search" append-icon="mdi-magnify" label="Search staff..." single-line hide-details></v-text-field></v-card-title>
				<v-data-table :headers="headers" :items="STAFF_GETT_DATA" :items-per-page="5" class="elevation-1">
					<template v-slot:item="{ item }">
						<tr>
							<td>{{ (item.firstName + ' ' + item.lastName).toUpperCase() }}</td>
							<td>{{ item.branch.branchName.toUpperCase() }}</td>
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

	export default {
		data() {
			return {
				dialog: false,
				maxWidth: '700px',
				search: '',
				btnAddStaff: false,
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
		methods: {
			...mapActions({
				STAFF_GET_DATA: 'staffs/STAFF_GET_DATA',
				STAFF_INSERT_DATA: 'staffs/STAFF_INSERT_DATA',
			}),
			addStaff() {
				if (this.$refs.formStaff.validate()) {
					this.btnAddStaff = true
					this.STAFF_INSERT_DATA(this.staffForm)
						.then(async (response) => {
							await this.STAFF_GET_DATA()
							this.$toast.success(`${this.staffForm.firstName} ${this.staffForm.lastName} is added!`.toUpperCase())
							this.btnAddStaff = false
							this.dialog = false
							this.$refs.formStaff.reset()
						})
						.catch((error) => {
							this.btnAddStaff = false
							this.$toast.error(error.response.data.error)
							console.error(error)
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
