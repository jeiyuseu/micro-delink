<template>
	<div>
		<v-alert v-if="body" :type="alertType" dismissible>
			{{ body }}
		</v-alert>
	</div>
</template>

<script>
	import smoothReflow from 'vue-smooth-reflow'
	export default {
		props: {
			alertType: String,
			body: String,
		},
		mixins: [smoothReflow],
		mounted() {
			this.$smoothReflow()
		},
	}
</script>
