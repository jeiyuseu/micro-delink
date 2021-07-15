<template>
	<Card>
		<div slot="card-title">Withdrawals</div>
		<div slot="card-text">
			<v-data-table :headers="headers" :items="[...filteredData]" class="elevation-10 mb-6">
				<template v-slot:item="{ item }">
					<tr class="font-weight-bold" v-for="(client, i) in item.gpWithdrawals" :key="i">
						<td>
							{{
								`${i + 1}. ` +
									$titleize(client.clientInfo.firstName + ' ' + client.clientInfo.middleInitial + ' ' + client.clientInfo.lastName)
							}}
						</td>
						<td>{{ formatNumber(client.clientInfo.skCum) }}</td>
						<td>{{ formatNumber(client.amount) }}</td>
						<td>{{ formatData(client.createdAt) }}</td>
						<td>{{ $titleize(client.userInfo.firstName + ' ' + client.userInfo.lastName) }}</td>
					</tr>
					<tr v-if="item.gpWithdrawals.length === 0">
						<td :colspan="headers.length" class="text-center">No clients!</td>
					</tr>
					<tr class="grey lighten-3 font-weight-bold" v-if="item.gpWithdrawals.length !== 0">
						<td class="text-center">Total</td>
						<td></td>
						<td>
							{{ formatNumber(item.totals.amountWithdraw) }}
						</td>

						<td></td>
						<td></td>
					</tr>
				</template>
			</v-data-table>
		</div>
	</Card>
</template>

<script>
import Card from './Card.vue'
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
	props: {
		responseWithdraw: Object,
		responseEdit: Object,
	},
	data() {
		return {
			filteredData: [],
			headers: [
				{
					text: 'Client Name',
					align: 'start',
					sortable: false,
				},
				{
					text: 'Remaing SK (Active)',
					align: 'start',
					sortable: false,
				},
				{
					text: 'Amount Withdraw',
					align: 'start',
					sortable: false,
				},
				{
					text: 'Date & Time Withdraw',
					align: 'start',
					sortable: false,
				},
				{
					text: 'Withdraw By',
					align: 'start',
					sortable: false,
				},
			],
		}
	},

	components: {
		Card,
	},
	created() {
		this.filteredData = this.GP_GETT_DATA_WITHDRAWALS.msg
	},
	methods: {
		formatData: function(date) {
			return moment(date).format('MMMM DD, YYYY @ hh:mm a')
		},
		formatNumber: function(value) {
			return value && value.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
		},
	},
	computed: {
		...mapGetters({ GP_GETT_DATA_WITHDRAWALS: 'gp/GP_GETT_DATA_WITHDRAWALS' }),
	},
	watch: {
		responseWithdraw: function(value) {
			console.log('from res withdraw', value)
			this.filteredData.gpWithdrawals.push(value)
			this.filteredData.gpWithdrawals.forEach((client) => {
				if (client.clientInfo.uuid === value.clientInfo.uuid) {
					client.clientInfo.skCum = value.clientInfo.skCum
				}
			})
			for (const key in this.filteredData.totals) {
				this.filteredData.totals[key] = value.totals[key]
			}
		},
		responseEdit: function(value) {
			console.log('from res edit', value)
			this.filteredData.gpWithdrawals.forEach((client) => {
				if (client.clientInfo.uuid === value.clientInfo.uuid) {
					client.clientInfo.skCum = value.clientInfo.skCum
				}
			})
		},
	},
}
</script>
