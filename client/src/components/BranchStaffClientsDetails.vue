<template>
	<div>
		<card>
			<div slot="card-title">Branch Staff Clients Details</div>
			<div slot="card-text">
				<custom-dialog :modal="dialog" :width="maxWidth">
					<div slot="modal-title">Update Details</div>
					<div slot="modal-text">
						<v-form @submit.prevent="updateDetails" ref="formUpdateDetails">
							<v-row>
								<v-col cols="6">
									<v-text-field
										label="Payment Date Created"
										:value="formatDate(detailsInfo.paymentDateCreated)"
										class="text-right"
										readonly
									>
									</v-text-field>
								</v-col>
								<v-col cols="6">
									<v-text-field
										label="Payment Date Updated"
										:value="formatDate(detailsInfo.paymentDateUpdated)"
										readonly
									>
									</v-text-field
								></v-col>
							</v-row>
							<v-row>
								<v-col cols="4">
									<v-text-field
										label="Actual Payment"
										v-model.number.trim="detailsInfoPayload.payment"
										:rules="[(v) => !!v || 'Payment is required!']"
										readonly
										type="number"
									>
									</v-text-field>
								</v-col>
								<v-col cols="4">
									<v-text-field
										:rules="[
											(v) => !!v.toString() || 'Penalty is required!',
											(v) => v >= 0 || 'Invalid Value!',
										]"
										label="Penalty"
										v-model.number.trim="detailsInfoPayload.penalty"
										type="number"
									>
									</v-text-field
								></v-col>
								<v-col cols="4">
									<v-text-field
										label="SK"
										v-model.number.trim="detailsInfoPayload.sk"
										:rules="[(v) => !!v || 'SK is required!', (v) => v >= 0 || 'Invalid Value!']"
										type="number"
									>
									</v-text-field>
								</v-col>
							</v-row>
							<v-card-actions class="justify-end">
								<v-btn
									color="primary darken-1"
									@click=";(dialog = !dialog), this.$refs.formUpdateDetails.resetValidation()"
									text
								>
									Close
								</v-btn>
								<v-btn
									:loading="btnUpdate"
									:disabled="btnUpdate"
									color="primary darken-1"
									type="submit"
									text
								>
									Update
								</v-btn>
							</v-card-actions>
						</v-form>
					</div>
				</custom-dialog>
				<v-data-table
					:headers="headers"
					:items="[...GP2_GETT_DATA_DETAILS]"
					:items-per-page="5"
					class="elevation-3"
					:search="search"
				>
					<template v-slot:item="{ item, headers }">
						<tr v-for="(detail, i) in item.details" :key="i">
							<td>{{ formatDate(detail.createdAt) }}</td>
							<td>₱ {{ detail.payment.toLocaleString() }}</td>
							<td>₱ {{ detail.penalty.toLocaleString() }}</td>
							<td>₱ {{ detail.sk.toLocaleString() }}</td>
							<td>{{ formatDate(detail.updatedAt) }}</td>
							<td>
								<v-btn @click="onUpdateDetails(detail)" icon
									><v-icon>
										mdi-pencil
									</v-icon></v-btn
								>
							</td>
						</tr>
						<tr v-if="item.details.length === 0">
							<td class="text-center" :colspan="headers.length">
								No results!
							</td>
						</tr>
					</template>
					<template
						v-slot:[`body.append`]="{ items }"
						v-if="GP2_GETT_DATA_DETAILS.details.length !== 0"
					>
						<tr class="font-weight-bold" v-for="(item, i) in items" :key="i">
							<td>Totals</td>
							<td>₱ {{ item.totals.payment }}</td>
							<td>₱ {{ item.totals.penalty }}</td>
							<td>₱ {{ item.totals.sk }}</td>
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
	import Card from '@/components/Card'
	import CustomDialog from '@/components/Dialog'
	import moment from 'moment'
	import { mapActions, mapGetters } from 'vuex'
	export default {
		data() {
			return {
				dialog: false,
				maxWidth: '700px',
				search: '',
				detailsInfo: {},
				detailsInfoPayload: {},
				btnUpdate: false,
				headers: [
					{
						text: 'Payment Date Created',
					},
					{
						text: 'Actual Payment',
					},
					{
						text: 'Penalty',
					},
					{
						text: 'SK',
					},
					{
						text: 'Payment Date Updated',
					},
					{
						text: 'Action',
					},
				],
			}
		},
		created() {
			console.log(this.GP2_GETT_DATA_DETAILS)
		},
		methods: {
			...mapActions({
				GP2_GET_DATA_DETAILS: 'gp2/GP2_GET_DATA_DETAILS',
				GP2_UPDATE_DETAILS: 'gp2/GP2_UPDATE_DETAILS',
			}),
			onUpdateDetails(details) {
				this.dialog = true
				this.detailsInfoPayload.id = details.uuid
				this.detailsInfoPayload.codename = this.$route.params.codename
				this.detailsInfoPayload.uuid = this.$route.params.uuid
				this.detailsInfo.paymentDateCreated = details.createdAt
				this.detailsInfo.paymentDateUpdated = details.updatedAt
				this.detailsInfoPayload.payment = details.payment
				this.detailsInfoPayload.penalty = details.penalty
				this.detailsInfoPayload.sk = details.sk
			},
			updateDetails() {
				if (this.$refs.formUpdateDetails.validate()) {
					this.btnUpdate = true
					this.GP2_UPDATE_DETAILS(this.detailsInfoPayload)
						.then((response) => {
							this.btnUpdate = false
							this.dialog = false
							this.$refs.formUpdateDetails.resetValidation()
							this.GP2_GET_DATA_DETAILS(this.$route.params)
						})
						.catch((error) => {
							console.error(error)
							this.btnUpdate = false
							this.$toast.error('Something went wrong...')
						})
				}
			},
			formatDate(date) {
				return moment(date).format('MMMM DD, YYYY')
			},
		},
		computed: {
			...mapGetters({ GP2_GETT_DATA_DETAILS: 'gp2/GP2_GETT_DATA_DETAILS' }),
		},
		components: {
			Card,
			CustomDialog,
		},
	}
</script>
