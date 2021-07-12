<template>
	<Card>
		<div slot="card-title">Withdrawals</div>
		<div slot="card-text">
			<v-data-table :headers="headers" :items="filteredData" class="elevation-10 mb-6">
				<template v-slot:item="{ item }">
					<tr>
						<td>{{ item.firstName }}</td>
					</tr>
				</template>
			</v-data-table>
		</div>
	</Card>
</template>

<script>
import Card from './Card.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
	data() {
		return {
			filteredData: [{ id: 1, firstName: 'jeus' }],
			headers: [
				{
					text: 'Client Name',
					align: 'start',
					sortable: false,
				},
			],
		}
	},

	components: {
		Card,
	},

	computed: {},
}
</script>
