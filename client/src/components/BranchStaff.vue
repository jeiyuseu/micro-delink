<template>
	<div>
		<card>
			<div slot="card-title">Branch Staff | {{ data.branchName }}</div>
			<div slot="card-text">
				<custom-dialog :modal="dialog" :width="maxWidth">
					<div slot="modal-title">
						Add New Staff
					</div>
					<div slot="modal-text"></div>
				</custom-dialog>
			</div>
			<div slot="card-text">
				<v-card-title>
					<v-text-field v-model="search" append-icon="mdi-magnify" label="Search staffs..." single-line hide-details></v-text-field
				></v-card-title>
				<v-data-table :headers="headers" :items="data.staffs" :items-per-page="5" class="elevation-1">
					<template v-slot:item="{ item }">
						<tr>
							<td>
								{{ (item.firstName + ' ' + item.lastName).toUpperCase() }}
							</td>
							<td>{{ item.codeName.toUpperCase() }}- GP2</td>
							<td class="text-center ">
								<v-btn color="primary" rounded :to="`${$route.params.slug}/${item.codeName}-gp2`" class="mr-2">
									<v-icon dark left>
										mdi-eye
									</v-icon>
									View Staffs</v-btn
								>
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
export default {
	props: {
		data: Object,
	},
	data() {
		return {
			dialog: false,
			maxWidth: '600px',
			search: '',
			headers: [
				{
					text: 'Name of Staff',
					align: 'start',
					sortable: false,
				},
				{
					text: 'Codename',
					align: 'start',
					sortable: false,
				},
				{
					text: 'Action',
					align: 'center',
					sortable: false,
				},
			],
		}
	},
	components: {
		Card,
		CustomDialog,
	},
	methods: {},
	computed: {},
}
</script>
