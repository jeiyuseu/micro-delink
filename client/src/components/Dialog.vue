<template>
	<v-dialog v-model="modal" persistent :max-width="width">
		<v-card>
			<v-card-title>
				<slot name="modal-title"></slot>
			</v-card-title>

			<v-card-text>
				<slot name="modal-text"></slot>
			</v-card-text>
			<v-card-actions class="justify-end">
				<slot name="modal-action"></slot>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		props: ['modal', 'width'],
	}
</script>
