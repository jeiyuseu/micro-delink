<template>
	<div>
		<v-card :loading="loading" outlined>
			<v-card-title class="display-6 font-weight-Light   text-uppercase">
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
