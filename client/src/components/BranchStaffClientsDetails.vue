<template>
	<div>
		<Card>
			<div slot="card-title">Branch Staff Clients Details</div>
			<div slot="card-text">
				<v-data-table
					hide-default-footer
					:headers="headers"
					:items="[...filteredData]"
					:items-per-page="5"
					class="elevation-10 mb-6"
					:search="search"
				>
					<template v-slot:item="{ item, headers }">
						<tr class="font-weight-bold" v-for="detail in item.details" :key="detail.uuid">
							<td>{{ formatDate(detail.createdAt) }}</td>
							<td>{{ formatNumber(detail.payment) }}</td>
							<td>{{ formatNumber(detail.sk) }}</td>
							<td>{{ formatNumber(detail.penalty) }}</td>
							<td>{{ formatDate(detail.updatedAt) }}</td>
							<td>
								<v-btn @click="dialogEditDetails(detail)" icon
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
					<template v-slot:[`body.append`]="{ items }" v-if="filteredData.details.length !== 0">
						<tr class="font-weight-bold" v-for="(item, i) in items" :key="i">
							<td>Totals</td>
							<td>{{ formatNumber(item.totals.payment) }}</td>
							<td>{{ formatNumber(item.totals.sk) }}</td>
							<td>{{ formatNumber(item.totals.penalty) }}</td>
							<td></td>
							<td></td>
						</tr>
					</template>
				</v-data-table>
			</div>
		</Card>
		<EditClientPaymentDetails
			:editClientPaymentToggle="editClientPaymentToggle"
			:detailsInfo="detailsInfo"
			@client-details="refreshClientDetails"
			@close-edit-client-payment="editClientPaymentToggle = false"
		/>
	</div>
</template>

<script>
import Card from '@/components/Card'
import EditClientPaymentDetails from '@/components/Dialogs/EditClientPaymentDetails'
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'

export default {
	data() {
		return {
			editClientPaymentToggle: false,
			search: '',
			detailsInfo: {},
			filteredData: [],
			headers: [
				{
					text: 'Payment Date Created',
				},
				{
					text: 'Actual Payment',
				},
				{
					text: 'SK',
				},
				{
					text: 'Penalty',
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
		this.filteredData = this.GP_GETT_DATA_DETAILS || []
	},

	methods: {
		dialogEditDetails: function(details) {
			this.editClientPaymentToggle = true
			this.detailsInfo = details
		},
		refreshClientDetails: function(data) {
			this.filteredData.details.forEach((value) => {
				if (value.uuid === data.msg.uuid) {
					for (const key in data.msg) {
						value[key] = data.msg[key]
					}
				}
				this.filteredData.totals = data.msg.totals
			})
		},
		formatDate(date) {
			return moment(date).format('MMMM DD, YYYY')
		},
		formatNumber: function(value) {
			return value && value.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
		},
	},
	computed: {
		...mapGetters({ GP_GETT_DATA_DETAILS: 'gp/GP_GETT_DATA_DETAILS' }),
	},
	components: {
		Card,
		EditClientPaymentDetails,
	},
}
</script>
