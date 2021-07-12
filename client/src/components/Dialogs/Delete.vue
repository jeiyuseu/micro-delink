<template>
	<Dialog :modal="dialogDeleteToggle" width="400px">
		<div slot="modal-title">Delete {{ fullName }} ?</div>
		<div slot="modal-text">{{ fullName }} will be deleted including related datas...</div>
		<div slot="modal-action" class="text-right">
			<v-spacer></v-spacer>
			<v-btn color="red darken-4" @click="$emit('close-delete')" text>Cancel</v-btn>
			<v-btn color="red darken-4" class="font-weight-black" :loading="loading" @click="deleted(UUID_GETT)" text
				>Delete</v-btn
			>
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
}
</script>
