<template>
	<Dialog :modal="dialogDeleteToggle" width="400px">
		<div slot="modal-title">Delete {{ fullName }} ?</div>
		<div slot="modal-text">{{ fullName }} will be deleted including related datas...</div>
		<div slot="modal-action" class="text-right">
			<v-spacer></v-spacer>
			<v-btn color="red darken-1" @click="$emit('close-delete')" text>Cancel</v-btn>
			<v-btn color="red darken-2" class="font-weight-black" :loading="loading" @click="deleted(UUID_GETT)" text>Delete</v-btn>
		</div>
	</Dialog>
</template>

<script>
	import Dialog from './Dialog.vue'
	import { mapActions, mapGetters } from 'vuex'
	export default {
		data() {
			return {
				details: '',
			}
		},
		props: {
			dialogDeleteToggle: Boolean,
			deleted: Function,
			loading: Boolean,
		},
		components: {
			Dialog,
		},

		computed: {
			...mapGetters('info', ['INFO_GETT', 'UUID_GETT']),
			fullName: function() {
				return this.INFO_GETT
			},
		},
		methods: {
			// ...mapActions({ GP2_DELETE_CLIENT: 'gp2/GP2_DELETE_CLIENT' }),
			// deleteClient: function() {
			// 	this.loading = true
			// 	this.GP2_DELETE_CLIENT({ uuid: this.clientInfo.uuid })
			// 		.then(({ data }) => {
			// 			this.items.totals = data.msg.totals
			// 			this.loading = false
			// 			this.$emit('deleted-clients', {
			// 				infoId: data.msg.infoId,
			// 				clientId: data.msg.clientId,
			// 			})
			// 			this.$emit('close-delete')
			// 			this.$toasted.success(this.$titleize(this.fullName) + ' is deleted!', { icon: 'check' })
			// 		})
			// 		.catch((error) => {
			// 			console.log(error)
			// 			this.loading = false
			// 			this.$toasted.error('Something went wrong...', { icon: 'close' })
			// 		})
			// },
		},
	}
</script>
