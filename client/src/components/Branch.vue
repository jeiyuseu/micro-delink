<template>
	<div>
		<card v-if="!$route.params.slug">
			<div slot="card-title">Branch</div>

			<div slot="card-button" class="float-right">
				<custom-dialog :modal="dialog" :width="maxWidth">
					<div slot="modal-title">
						Add New Branch
					</div>
					<div slot="modal-text">
						<v-form @submit.prevent="addBranch" ref="formBranch">
							<v-container>
								<v-row>
									<v-col cols="12">
										<v-text-field
											label="* Branch Name"
											name="branchName"
											v-model.trim="formBranch.branchName"
											required
											prepend-inner-icon="mdi-domain"
											class="branch-name"
											maxlength="20"
											:rules="[(v) => !!v || 'Branch is required']"
										>
										</v-text-field>
									</v-col>
								</v-row>
							</v-container>
							<v-card-actions class="justify-end">
								<v-btn color="primary darken-1" text @click=";(dialog = !dialog), $refs.formBranch.reset()">
									Close
								</v-btn>
								<v-btn color="primary darken-1" type="submit" :loading="btnAddBranch" text>
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
								<v-btn color="blue" rounded outlined dark @click.stop="dialog = true">
									<v-icon left dark>
										mdi-plus
									</v-icon>
									Add Branch
								</v-btn>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
				<v-card-title> <v-text-field v-model="search" append-icon="mdi-magnify" label="Search branch..." single-line hide-details></v-text-field></v-card-title>
				<v-data-table :headers="headers" :items="BRANCH_GETT_DATA" :items-per-page="5" class="elevation-1" :search="search">
					<template v-slot:item="{ item }">
						<tr>
							<td>
								{{ item.branchName.toUpperCase() }}
							</td>
							<td class="text-center ">
								<v-btn color="primary" rounded :to="'branch/' + item.slug" class="mr-2">
									<v-icon left dark>
										mdi-eye
									</v-icon>
									View Staffs</v-btn
								>
								<v-btn color="error" :disabled="true" rounded class="mr-2">
									<v-icon left dark>
										mdi-trash-can
									</v-icon>
									Delete Branch</v-btn
								>
							</td>
						</tr>
					</template>
				</v-data-table>
			</div>
		</card>
		<router-view :data="BRANCH_GETT_SLUG"></router-view>
	</div>
</template>

<script>
	import CustomDialog from '@/components/Dialog'
	import Card from '@/components/Card'
	import { mapActions, mapGetters } from 'vuex'
	export default {
		data() {
			return {
				headers: [
					{
						text: 'Branch Name',
						align: 'start',
						sortable: false,
						value: 'branchName',
					},
					{
						text: 'Action',
						align: 'center',
						sortable: false,
						value: false,
					},
				],
				formBranch: {
					branchName: '',
				},
				search: '',
				dialog: false,
				maxWidth: '600px',
				btnAddBranch: false,
			}
		},
		components: {
			Card,
			CustomDialog,
		},
		computed: {
			...mapGetters({
				BRANCH_GETT_DATA: 'branch/BRANCH_GETT_DATA',
				BRANCH_GETT_SLUG: 'branch/BRANCH_GETT_SLUG',
			}),
		},
		methods: {
			...mapActions({
				BRANCH_GET_DATA: 'branch/BRANCH_GET_DATA',
				BRANCH_INSERT_DATA: 'branch/BRANCH_INSERT_DATA',
			}),
			addBranch() {
				if (this.$refs.formBranch.validate()) {
					this.btnAddBranch = true
					this.BRANCH_INSERT_DATA(this.formBranch)
						.then(async () => {
							await this.BRANCH_GET_DATA()
							this.$toast.success(`${this.formBranch.branchName} is added!`.toUpperCase())
							this.btnAddBranch = false
							this.dialog = false
							this.$refs.formBranch.reset()
						})
						.catch((error) => {
							this.btnAddBranch = false
							console.log(error)
							this.$toast.error(`${this.formBranch.branchName} is exist!`)
						})
				}
			},
		},
		mounted() {
			//check if branch state is set to avoid multiple request
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

<style scoped>
	.branch-name input {
		text-transform: uppercase;
	}
</style>
