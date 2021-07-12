<template>
	<Dialog :modal="dialogCr" width="600px">
		<div slot="modal-title">Cluster Resolution?</div>
		<div slot="modal-text">
			<v-alert type="info" color="orange darken-4" border="left" colored-border>
				SK Cummulative must be greater than equal of LR...
			</v-alert>
		</div>
		<div slot="modal-action" class="text-right">
			<v-spacer></v-spacer>
			<v-btn color="orange darken-4" @click="$emit('close-dialog')" text>Cancel</v-btn>
			<v-btn color="orange darken-4" class="font-weight-black" :loading="loading" @click="cr" text>Continue</v-btn>
		</div>
	</Dialog>
</template>

<script>
import Dialog from './Dialog.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
	data() {
		return {}
	},
	props: {
		dialogCr: Boolean,
		loading: Boolean,
		cr: Function,
	},
	components: {
		Dialog,
	},
	computed: {},
}
</script>
