<template>
	<div>
		<v-card :loading="loading" shaped elevation="10">
			<v-card-title class="text-h5 font-weight-medium">
				<v-row no-gutter>
					<v-col cols="6">
						<slot name="card-title"></slot>
					</v-col>
					<v-col cols="6">
						<slot name="card-button"></slot>
					</v-col>
				</v-row>
			</v-card-title>
			<v-divider class="mx-4"></v-divider>
			<v-card-text>
				<slot name="card-text"></slot>
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
	export default {
		props: ['loading'],
	}
</script>
