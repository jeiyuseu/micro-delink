<template>
	<div>
		<Card v-if="$route.path.split('/')[2] !== 'branch'">
			<div slot="card-title">Dashboard</div>
			<div slot="card-text">
				...
			</div>
		</Card>
		<router-view></router-view>
	</div>
</template>

<script>
import Card from '@/components/Card'

export default {
	components: {
		Card,
	},
	data() {
		return {}
	},
	created() {},
	methods: {},
	computed: {},
}
</script>
