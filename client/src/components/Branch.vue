<template>
	<div>
		<Card v-if="!$route.params.slug">
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
											:rules="[(v) => !!v || 'Branch Name is required']"
										>
										</v-text-field>
									</v-col>
								</v-row>
							</v-container>
						</v-form>
					</div>
					<div slot="modal-action">
						<v-btn color="primary darken-1" text @click=";(dialog = !dialog), $refs.formBranch.reset()">
							Close
						</v-btn>
						<v-btn color="primary darken-1" @click="addBranch" :loading="loading" text>
							Add
						</v-btn>
					</div>
				</custom-dialog>
			</div>
			<div slot="card-text">
				<v-card class="mb-6 elevation-5" v-if="$route.path.split('/')[1] !== 'gp2'">
					<v-card-text>
						<v-row>
							<v-col cols="12">
								<v-btn color="blue" if rounded outlined dark @click.stop="dialog = true">
									<v-icon left dark>
										mdi-plus
									</v-icon>
									Add Branch
								</v-btn>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
				<v-text-field
					class="mb-6 elevation-4"
					solo
					v-model="search"
					append-icon="mdi-magnify"
					label="Search branch..."
					single-line
					hide-details
				></v-text-field>
				<v-data-table
					:headers="headers"
					:items="filteredData"
					:items-per-page="5"
					class="elevation-10 mb-6"
					:search="search"
				>
					<template v-slot:item="{ item }">
						<tr>
							<td>
								{{ $titleize(item.branchName) }}
							</td>
							<td class="text-center " v-if="$route.path.split('/')[1] == 'gp2'">
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
		</Card>
		<router-view :data="BRANCH_GETT_SLUG"></router-view>
	</div>
</template>

<script>
import CustomDialog from '@/components/Dialogs/Dialog'
import Card from '@/components/Card'
import { mapActions, mapGetters } from 'vuex'
export default {
	data() {
		return {
			filteredData: [],
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
			loading: false,
		}
	},
	created() {
		this.filteredData = this.BRANCH_GETT_DATA
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
				this.loading = true
				this.BRANCH_INSERT_DATA(this.formBranch)
					.then(({ data }) => {
						this.filteredData.push(data.msg)
						this.$toast.success(`${this.formBranch.branchName} is added!`.toUpperCase())
						this.loading = false
						this.dialog = false
						this.$refs.formBranch.reset()
					})
					.catch((error) => {
						this.loading = false
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
