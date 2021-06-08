<template>
	<div>
		<Dialog :modal="editToggle" :width="'700px'">
			<div slot="modal-title">
				Edit Info
			</div>
			<div slot="modal-text">
				{{ editInfo }}
				<v-form>
					<v-container grid-list-md>
						<v-row>
							<v-col cols="12">
								<v-text-field
									v-model.trim="editInfo.id"
									label="* New Codename"
									prepend-inner-icon="mdi-text-box-plus-outline"
									placeholder="E.G MA-01, MB-02, MC-03..."
									autocomplete="off"
									:rules="[(v) => !!v || 'Must a have a codename!']"
									ref="infoDesc"
								></v-text-field>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="6">
								<v-menu
									ref="dateOfReleased"
									v-model="menuDateOfReleased"
									:close-on-content-click="false"
									transition="scale-transition"
									offset-y
									max-width="290px"
									min-width="auto"
								>
									<template v-slot:activator="{ on, attrs }">
										<v-text-field
											v-model.trim="editInfo.dateOfReleased"
											label="* Date of Released"
											prepend-inner-icon="mdi-calendar"
											v-bind="attrs"
											readonly
											v-on="on"
											clearable
											autocomplete="off"
											:rules="[(v) => !!v || 'Date of released is required!']"
										></v-text-field>
									</template>

									<v-date-picker v-model.trim="editInfo.dateOfReleased" no-title scrollable>
										<v-spacer></v-spacer>
										<div class="justify-end">
											<v-btn text color="primary" @click="menuDateOfReleased = false">
												Cancel
											</v-btn>
											<v-btn text color="primary" @click="$refs.dateOfReleased.save(editInfo.dateOfReleased)">
												OK
											</v-btn>
										</div>
									</v-date-picker>
								</v-menu>
							</v-col>
							<v-col cols="6">
								<v-select
									:items="[{ desc: '16 Weeks', value: 16 }]"
									item-text="desc"
									item-value="value"
									prepend-inner-icon="mdi-view-week"
									label="* Loan Term"
									@change="loanTerm"
									v-model="editInfo.weeksToPay"
									:rules="[(v) => !!v || 'Loan Term is required!']"
								></v-select>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="6">
								<v-menu
									ref="dateOfFirstPayment"
									v-model="menuFirstOfPayment"
									:close-on-content-click="false"
									transition="scale-transition"
									offset-y
									max-width="290px"
									min-width="auto"
								>
									<template v-slot:activator="{ on, attrs }">
										<v-text-field
											v-model.trim="editInfo.dateOfFirstPayment"
											label="* Date of First Payment"
											autocomplete="off"
											v-bind="attrs"
											v-on="on"
											readonly
											clearable
											prepend-inner-icon="mdi-calendar"
											:rules="[(v) => !!v || 'Date of first payment is required!']"
										></v-text-field>
									</template>

									<v-date-picker v-model.trim="editInfo.dateOfFirstPayment" no-title @change="loanTerm" scrollable>
										<v-spacer></v-spacer>
										<div class="justify-end">
											<v-btn text color="primary" @click="menuFirstOfPayment = false">
												Cancel
											</v-btn>
											<v-btn text color="primary" @click="$refs.dateOfFirstPayment.save(editInfo.dateOfFirstPayment)">
												OK
											</v-btn>
										</div>
									</v-date-picker>
								</v-menu>
							</v-col>
							<v-col cols="6">
								<v-text-field
									v-model.trim="editInfo.dateOfLastPayment"
									label="* Date of Last Payment"
									autocomplete="off"
									prepend-inner-icon="mdi-calendar"
									readonly
								></v-text-field>
							</v-col>
						</v-row>
					</v-container>
				</v-form>
			</div>
		</Dialog>
	</div>
</template>

<script>
import Dialog from './Dialog'
export default {
	data() {
		return {}
	},
	props: {
		editToggle: Boolean,
		editInfo: Object,
	},
	components: {
		Dialog,
	},
}
</script>
